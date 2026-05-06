'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';

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

export async function sendNachricht(
  matchId: string,
  inhalt: string
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  // Sicherheitscheck: User ist Beteiligter
  const { data: match } = await supabase
    .from('matches')
    .select('id, tierhalter_id, sitter_id')
    .eq('id', matchId)
    .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
    .single();

  if (!match) return { error: 'Kein Zugriff' };

  const { error } = await supabase
    .from('nachrichten')
    .insert({ match_id: matchId, sender_id: user.id, inhalt });

  if (error) return { error: error.message };

  await supabase
    .from('matches')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', matchId);

  return {};
}

export async function markAsRead(matchId: string): Promise<void> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('nachrichten')
    .update({ gelesen: true })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .eq('gelesen', false);
}

export async function abschliessenMatch(matchId: string): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  const { error } = await supabase
    .from('matches')
    .update({ status: 'abgeschlossen' })
    .eq('id', matchId)
    .eq('tierhalter_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/nachrichten');
  revalidatePath('/dashboard/bewertungen');
  return {};
}

export async function shareJournalUpdate(
  matchId: string,
  fotoUrl: string | null,
  nachricht: string
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  const { data: match } = await supabase
    .from('matches')
    .select('id, sitter_id')
    .eq('id', matchId)
    .eq('sitter_id', user.id)
    .single();

  if (!match) return { error: 'Kein Zugriff' };

  const { data: journal, error: journalError } = await supabase
    .from('journal_eintraege')
    .insert({ match_id: matchId, sitter_id: user.id, foto_url: fotoUrl, nachricht })
    .select('id')
    .single();

  if (journalError) return { error: journalError.message };

  await supabase.from('nachrichten').insert({
    match_id: matchId,
    sender_id: user.id,
    inhalt: `__journal__:${journal.id}`,
  });

  await supabase
    .from('matches')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', matchId);

  revalidatePath('/dashboard/nachrichten');
  return {};
}

export async function createBewertung(
  matchId: string,
  bewertetId: string,
  sterne: number,
  kommentar: string | null
): Promise<{ error?: string }> {
  const supabase = makeClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  const { data: match } = await supabase
    .from('matches')
    .select('id, status, tierhalter_id, sitter_id')
    .eq('id', matchId)
    .eq('status', 'abgeschlossen')
    .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
    .single();

  if (!match) return { error: 'Match nicht gefunden oder nicht abgeschlossen' };

  const { error } = await supabase.from('bewertungen').insert({
    match_id: matchId,
    bewerter_id: user.id,
    bewertet_id: bewertetId,
    sterne,
    kommentar: kommentar || null,
  });

  if (error) {
    if (error.code === '23505') return { error: 'Du hast diesen Match bereits bewertet.' };
    return { error: error.message };
  }

  revalidatePath('/dashboard/bewertungen');
  revalidatePath('/dashboard/nachrichten');
  return {};
}
