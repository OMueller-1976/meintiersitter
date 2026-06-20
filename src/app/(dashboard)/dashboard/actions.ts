'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component – ignore
          }
        },
      },
    }
  );

  await supabase.auth.signOut();
  redirect('/');
}

// Tierhalter kontaktiert Sitter direkt (ohne Posting)
export async function sendeKontaktanfrageAnSitter(
  sitterId: string,
  nachricht: string,
  tierId?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  // Doppel-Anfrage verhindern
  const { data: existing } = await supabase
    .from('matches')
    .select('id')
    .eq('tierhalter_id', user.id)
    .eq('sitter_id', sitterId)
    .in('status', ['angefragt', 'bestaetigt'])
    .maybeSingle();

  if (existing) return { success: true, matchId: existing.id };

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('matches')
    .insert({
      tierhalter_id: user.id,
      sitter_id: sitterId,
      tier_id: tierId ?? null,
      status: 'angefragt',
      nachricht,
      datum_von: today,
      datum_bis: today,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Erste Nachricht in den Chat schreiben
  await supabase
    .from('nachrichten')
    .insert({ match_id: data.id, sender_id: user.id, inhalt: nachricht });

  revalidatePath('/dashboard/nachrichten');
  return { success: true, matchId: data.id };
}

// Sitter bewirbt sich auf Posting
export async function bewerbenAufPosting(
  postingId: string,
  nachricht: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  // Doppel-Bewerbung verhindern
  const { data: existing } = await supabase
    .from('bewerbungen')
    .select('id')
    .eq('posting_id', postingId)
    .eq('sitter_id', user.id)
    .maybeSingle();

  if (existing) return { success: true };

  const { error } = await supabase
    .from('bewerbungen')
    .insert({
      posting_id: postingId,
      sitter_id: user.id,
      nachricht,
      quelle: 'organisch',
      status: 'ausstehend',
    });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/anfragen');
  return { success: true };
}

// Tierhalter akzeptiert Bewerbung → Match erstellen → Chat freischalten
export async function akzeptiereBewerbung(bewerbungId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  const { data: bewerbung, error: fetchError } = await supabase
    .from('bewerbungen')
    .select('*, postings(*)')
    .eq('id', bewerbungId)
    .single();

  if (fetchError || !bewerbung) return { error: 'Bewerbung nicht gefunden' };

  const posting = Array.isArray(bewerbung.postings)
    ? bewerbung.postings[0]
    : bewerbung.postings as {
        tierhalter_id: string;
        tier_id: string | null;
        leistung: string;
        datum_von: string;
        datum_bis: string;
      } | null;

  if (!posting || posting.tierhalter_id !== user.id) return { error: 'Kein Zugriff' };

  // Bewerbung als ausgewählt markieren
  await supabase
    .from('bewerbungen')
    .update({ status: 'ausgewaehlt' })
    .eq('id', bewerbungId);

  // Match anlegen damit Chat startet
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      tierhalter_id: user.id,
      sitter_id: bewerbung.sitter_id,
      tier_id: posting.tier_id ?? null,
      status: 'bestaetigt',
      leistung: posting.leistung,
      datum_von: posting.datum_von,
      datum_bis: posting.datum_bis,
      nachricht: bewerbung.nachricht,
    })
    .select()
    .single();

  if (matchError) return { error: matchError.message };

  // Erste Nachricht (Bewerbungstext) in Chat übertragen
  if (bewerbung.nachricht) {
    await supabase.from('nachrichten').insert({
      match_id: match.id,
      sender_id: bewerbung.sitter_id,
      inhalt: bewerbung.nachricht,
    });
  }

  revalidatePath('/dashboard/anfragen');
  revalidatePath('/dashboard/nachrichten');
  return { success: true, matchId: match.id };
}

export async function lehneBewerbungAb(bewerbungId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  const { data: bewerbung } = await supabase
    .from('bewerbungen')
    .select('id, postings!inner(tierhalter_id)')
    .eq('id', bewerbungId)
    .single();

  if (!bewerbung) return { error: 'Bewerbung nicht gefunden' };

  const posting = Array.isArray(bewerbung.postings) ? bewerbung.postings[0] : bewerbung.postings as { tierhalter_id: string } | null;
  if (!posting || posting.tierhalter_id !== user.id) return { error: 'Kein Zugriff' };

  await supabase
    .from('bewerbungen')
    .update({ status: 'abgelehnt' })
    .eq('id', bewerbungId);

  revalidatePath('/dashboard/anfragen');
  return { success: true };
}

// Sitter akzeptiert direkte Kontaktanfrage → Chat freischalten
export async function akzeptiereKontaktanfrage(matchId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  const { error } = await supabase
    .from('matches')
    .update({ status: 'bestaetigt' })
    .eq('id', matchId)
    .eq('sitter_id', user.id)
    .eq('status', 'angefragt');

  if (error) return { error: error.message };
  revalidatePath('/dashboard/anfragen');
  revalidatePath('/dashboard/nachrichten');
  return { success: true };
}

export async function lehneKontaktanfrageAb(matchId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  await supabase
    .from('matches')
    .update({ status: 'abgelehnt' })
    .eq('id', matchId)
    .eq('sitter_id', user.id);

  revalidatePath('/dashboard/anfragen');
  return { success: true };
}

// Nachricht im freigeschalteten Chat senden
export async function sendeChatNachricht(matchId: string, inhalt: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht eingeloggt' };

  const { data: match } = await supabase
    .from('matches')
    .select('status')
    .eq('id', matchId)
    .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
    .single();

  if (match?.status !== 'bestaetigt' && match?.status !== 'abgeschlossen') {
    return { error: 'Chat ist noch nicht freigeschaltet' };
  }

  const { error } = await supabase
    .from('nachrichten')
    .insert({ match_id: matchId, sender_id: user.id, inhalt });

  if (error) return { error: error.message };
  return { success: true };
}
