'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import type { PostingInsert, BewerbungInsert } from '@/types';

function makeClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}

// ────────────────────────────────────────────────────────────
// createPosting + Auto-Matching
// ────────────────────────────────────────────────────────────

export async function createPosting(
  data: Omit<PostingInsert, 'tierhalter_id'>
): Promise<{ error?: string; postingId?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  const { data: posting, error } = await supabase
    .from('postings')
    .insert({ ...data, tierhalter_id: user.id })
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Auto-Matching: finde Sitter im gleichen PLZ-Bereich die passende Leistung anbieten
  await autoMatchSitters(supabase, posting.id, data.plz, data.leistung as string);

  revalidatePath('/dashboard/postings');
  revalidatePath('/pinnwand');

  return { postingId: posting.id };
}

async function autoMatchSitters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  postingId: string,
  plz: string,
  leistung: string
) {
  // Leistungsfeld-Mapping
  const leistungField: Record<string, string> = {
    gassi: 'bietet_gassi',
    fuettern: 'bietet_fuettern',
    uebernachtung: 'bietet_uebernachtung',
    tagesbetreuung: 'bietet_tagesbetreuung',
  };
  const field = leistungField[leistung];
  if (!field) return;

  // Sitter mit gleicher PLZ und passender Leistung finden
  const { data: sitters } = await supabase
    .from('profiles')
    .select('id, plz')
    .eq('role', 'sitter')
    .eq('plz', plz);

  if (!sitters || sitters.length === 0) return;

  // Sitter-Profile prüfen (Leistungsangebot)
  const sitterIds = sitters.map((s: { id: string }) => s.id);
  const { data: sitterProfiles } = await supabase
    .from('sitter_profiles')
    .select(`id, ${field}`)
    .in('id', sitterIds)
    .eq(field, true);

  if (!sitterProfiles || sitterProfiles.length === 0) return;

  // Bewerbungen mit quelle='empfehlung' anlegen
  const bewerbungen: BewerbungInsert[] = sitterProfiles.map((sp: { id: string }) => ({
    posting_id: postingId,
    sitter_id: sp.id,
    quelle: 'empfehlung' as const,
  }));

  await supabase.from('bewerbungen').insert(bewerbungen).select();
}

// ────────────────────────────────────────────────────────────
// Posting löschen
// ────────────────────────────────────────────────────────────

export async function deletePostingAction(formData: FormData) {
  const postingId = formData.get('posting_id') as string;
  if (!postingId) return;

  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('postings')
    .delete()
    .eq('id', postingId)
    .eq('tierhalter_id', user.id);

  revalidatePath('/dashboard/postings');
  revalidatePath('/pinnwand');
}

// ────────────────────────────────────────────────────────────
// Sitter auswählen
// ────────────────────────────────────────────────────────────

export async function selectSitterAction(formData: FormData) {
  const bewerbungId = formData.get('bewerbung_id') as string;
  const postingId = formData.get('posting_id') as string;
  if (!bewerbungId || !postingId) return;

  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Sitter-Bewerbung auf ausgewaehlt setzen
  await supabase
    .from('bewerbungen')
    .update({ status: 'ausgewaehlt' })
    .eq('id', bewerbungId)
    .eq('posting_id', postingId);

  // Alle anderen Bewerbungen ablehnen
  await supabase
    .from('bewerbungen')
    .update({ status: 'abgelehnt' })
    .eq('posting_id', postingId)
    .neq('id', bewerbungId);

  // Posting auf besetzt setzen
  await supabase
    .from('postings')
    .update({ status: 'besetzt', auf_pinnwand: false })
    .eq('id', postingId)
    .eq('tierhalter_id', user.id);

  revalidatePath('/dashboard/postings');
  revalidatePath('/pinnwand');
}

// ────────────────────────────────────────────────────────────
// Auf Pinnwand-Posting bewerben (organisch)
// ────────────────────────────────────────────────────────────

export async function createBewerbung(
  postingId: string,
  nachricht?: string
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  const { error } = await supabase.from('bewerbungen').insert({
    posting_id: postingId,
    sitter_id: user.id,
    quelle: 'organisch',
    nachricht: nachricht || null,
  });

  if (error) {
    if (error.code === '23505') return { error: 'Du hast dich bereits beworben.' };
    return { error: error.message };
  }

  revalidatePath('/pinnwand');
  revalidatePath('/dashboard/anfragen');

  return {};
}

// ────────────────────────────────────────────────────────────
// Auf Bewerbung reagieren (ablehnen per Tierhalter)
// ────────────────────────────────────────────────────────────

export async function respondToBewerbungAction(formData: FormData) {
  const bewerbungId = formData.get('bewerbung_id') as string;
  const newStatus = formData.get('status') as 'ausgewaehlt' | 'abgelehnt';
  const postingId = formData.get('posting_id') as string;

  if (!bewerbungId || !newStatus) return;

  if (newStatus === 'ausgewaehlt') {
    const fd = new FormData();
    fd.set('bewerbung_id', bewerbungId);
    fd.set('posting_id', postingId);
    await selectSitterAction(fd);
    return;
  }

  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('bewerbungen')
    .update({ status: newStatus })
    .eq('id', bewerbungId)
    .eq('posting_id', postingId);

  revalidatePath('/dashboard/postings');
}
