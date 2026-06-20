export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/layout/DashboardNav';
import type { Profile } from '@/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  if (!profile) redirect('/login');

  const isSitter = profile.role === 'sitter' || profile.role === 'beide';

  // Ungelesene Nachrichten
  const { count: unreadNachrichten } = await supabase
    .from('nachrichten')
    .select('id', { count: 'exact', head: true })
    .neq('sender_id', user.id)
    .eq('gelesen', false)
    .in(
      'match_id',
      (await supabase
        .from('matches')
        .select('id')
        .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
        .in('status', ['bestaetigt', 'abgeschlossen'])
        .then((r) => (r.data ?? []).map((m: { id: string }) => m.id)))
    );

  // Offene Anfragen
  let pendingAnfragen = 0;
  if (isSitter) {
    // Eingehende Kontaktanfragen
    const { count } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true })
      .eq('sitter_id', user.id)
      .eq('status', 'angefragt');
    pendingAnfragen = count ?? 0;
  } else {
    // Eingehende Bewerbungen auf eigene Postings (via JOIN)
    const { data: ownPostings } = await supabase
      .from('postings')
      .select('id')
      .eq('tierhalter_id', user.id);
    const postingIds = (ownPostings ?? []).map((p: { id: string }) => p.id);
    if (postingIds.length > 0) {
      const { count } = await supabase
        .from('bewerbungen')
        .select('id', { count: 'exact', head: true })
        .in('posting_id', postingIds)
        .eq('status', 'offen');
      pendingAnfragen = count ?? 0;
    }
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav
        role={profile.role}
        profile={profile}
        unreadNachrichten={unreadNachrichten ?? 0}
        pendingAnfragen={pendingAnfragen}
      />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0" style={{ background: 'var(--content-bg)' }}>
        {children}
      </main>
    </div>
  );
}
