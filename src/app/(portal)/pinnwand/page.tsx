import Link from 'next/link';
import { ORTSCHAFTEN, LEISTUNGS_LABELS } from '@/lib/mock-data';
import { getOffenePostings } from '@/lib/queries/postings';
import { createClient } from '@/lib/supabase/server';
import { getMatchProzenteForSitter } from '@/lib/queries/matching';
import GesuchCard, { type PostingRow } from '@/components/portal/GesuchCard';
import PinnwandBewerbenButton from './PinnwandBewerbenButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pinnwand – MeinTiersitter' };

export default async function PinnwandPage({
  searchParams,
}: {
  searchParams: Promise<{ ort?: string; leistung?: string; notfall?: string }>;
}) {
  const { ort, leistung, notfall } = await searchParams;
  const filterOrt = ort && ort !== 'Alle Ortschaften' ? ort : '';
  const filterLeistung = leistung ?? '';
  const filterNotfall = notfall === '1';
  const hasFilter = !!filterOrt || !!filterLeistung || filterNotfall;

  const postings = (await getOffenePostings({
    ort: filterOrt || undefined,
    leistung: filterLeistung || undefined,
    nurNotfall: filterNotfall || undefined,
  })) as unknown as PostingRow[];

  // User-Auth + Rolle
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  let meineBewerbungIds: Set<string> = new Set();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = profile?.role ?? null;

    if (userRole === 'sitter' || userRole === 'beide') {
      const postingIds = postings.map((p) => p.id);
      if (postingIds.length > 0) {
        const { data: bewerbungen } = await supabase
          .from('bewerbungen')
          .select('posting_id')
          .eq('sitter_id', user.id)
          .in('posting_id', postingIds);
        meineBewerbungIds = new Set((bewerbungen ?? []).map((b: { posting_id: string }) => b.posting_id));
      }
    }
  }

  const isSitter = userRole === 'sitter' || userRole === 'beide';

  // Match-Prozente für Sitter berechnen
  let matchProzente: Record<string, number> = {};
  if (user && isSitter && postings.length > 0) {
    matchProzente = await getMatchProzenteForSitter(user.id, postings);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold text-white">Aktuelle Gesuche in der Vulkaneifel</h1>
        <p className="text-[#A8C0DC] mt-2 max-w-xl">
          Alle offenen Tierbetreuungs-Gesuche in der Vulkaneifel. Melde Dich direkt beim Tierhalter.
        </p>
      </div>

      {/* Filter */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#C8D8EC] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <form className="flex flex-wrap gap-3 items-center">
            <select
              name="ort"
              defaultValue={filterOrt || 'Alle Ortschaften'}
              className="border border-[#C8D8EC] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] text-[#1E3249]"
            >
              {ORTSCHAFTEN.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select
              name="leistung"
              defaultValue={filterLeistung}
              className="border border-[#C8D8EC] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] text-[#1E3249]"
            >
              <option value="">Alle Leistungen</option>
              {Object.entries(LEISTUNGS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 cursor-pointer select-none border border-[#E07B30] bg-[#FEF3E2] rounded-xl px-4 py-2 text-sm text-[#8A5A2E] font-medium">
              <input
                type="checkbox"
                name="notfall"
                value="1"
                defaultChecked={filterNotfall}
                className="accent-[#E07B30] w-4 h-4"
              />
              🚨 Nur Notfälle
            </label>
            <button
              type="submit"
              className="bg-[#2E4A6B] text-white rounded-xl px-5 py-2 text-sm font-medium hover:bg-[#1E3249] transition-colors"
            >
              Filtern
            </button>
            {hasFilter && (
              <Link
                href="/pinnwand"
                className="border border-[#C8D8EC] rounded-xl px-5 py-2 text-sm text-[#4E779F] hover:bg-[#EEF2F8] transition-colors"
              >
                Zurücksetzen
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* Inhalt */}
      <div className="flex-1 bg-[#F1F5F9]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {postings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#C8D8EC] shadow-sm p-16 text-center">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-[#4E779F] font-medium mb-2">Noch keine Gesuche in dieser Region.</p>
              <p className="text-sm text-[#7A9DBF] mb-6">Sei der Erste und gib ein Gesuch auf!</p>
              <Link
                href="/dashboard/postings/neu"
                className="inline-block bg-[#2E4A6B] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#3A5A80] transition-colors"
              >
                Jetzt Gesuch aufgeben
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#4E779F] mb-5">
                {postings.length} {postings.length === 1 ? 'Gesuch' : 'Gesuche'} gefunden
                {hasFilter && <span className="ml-1">· gefiltert</span>}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {postings.map((p) => (
                  <GesuchCard
                    key={p.id}
                    posting={p}
                    matchProzent={isSitter ? matchProzente[p.id] : undefined}
                    isLoggedIn={!!user}
                    userRole={userRole ?? undefined}
                    variant="pinnwand"
                    footerAction={
                      isSitter ? (
                        <PinnwandBewerbenButton
                          postingId={p.id}
                          isLoggedIn={true}
                          hasBewerbung={meineBewerbungIds.has(p.id)}
                        />
                      ) : user ? (
                        <Link
                          href="/dashboard/postings/neu"
                          className="bg-[#2E4A6B] text-white text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-[#3A5A80] transition-colors flex-shrink-0"
                        >
                          Eigenes Gesuch →
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="bg-[#2E4A6B] text-white text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-[#3A5A80] transition-colors flex-shrink-0"
                        >
                          Anmelden →
                        </Link>
                      )
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* CTA Banner */}
          <div className="mt-10 bg-[#2E4A6B] rounded-2xl p-8 text-center text-white">
            <p className="text-xl font-bold mb-2">Du hast ein Tier das Betreuung braucht?</p>
            <p className="text-[#A8C0DC] text-sm mb-5">
              Veröffentliche ein Gesuch — kostenlos, schnell, und nur für den Landkreis Vulkaneifel.
            </p>
            <Link
              href={user ? '/dashboard/postings/neu' : '/register'}
              className="inline-block bg-[#F4A261] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#E07B30] transition-colors"
            >
              Jetzt Gesuch aufgeben →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
