export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BewerbungButtons, KontaktanfrageButtons } from './AnfrageActionButtons';

const LEISTUNG_LABEL: Record<string, string> = {
  gassi: 'Gassi gehen',
  fuettern: 'Füttern',
  tagesbetreuung: 'Tagesbetreuung',
  uebernachtung: 'Übernachtung',
};

type BewerbungPosting = {
  id: string;
  leistung: string;
  datum_von: string;
  datum_bis: string;
  ort: string;
  tierhalter: { full_name: string } | Array<{ full_name: string }> | null;
};

const LEISTUNG_COLOR: Record<string, string> = {
  gassi: 'bg-blue-100 text-blue-700',
  fuettern: 'bg-amber-100 text-amber-700',
  tagesbetreuung: 'bg-purple-100 text-purple-700',
  uebernachtung: 'bg-green-100 text-green-700',
};

export default async function AnfragenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, plz')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'tierhalter';
  const isSitter = role === 'sitter' || role === 'beide';

  if (isSitter) {
    // ── Sitter-Ansicht ──────────────────────────────────────────────
    // 1) Eingehende Kontaktanfragen (Match angefragt, sitter_id = ich)
    const { data: kontaktanfragen } = await supabase
      .from('matches')
      .select(`
        id, status, created_at,
        tierhalter:profiles!matches_tierhalter_id_fkey(id, full_name, ort)
      `)
      .eq('sitter_id', user.id)
      .eq('status', 'angefragt')
      .order('created_at', { ascending: false });

    // 2) Eigene Bewerbungen auf Postings
    const { data: bewerbungen } = await supabase
      .from('bewerbungen')
      .select(`
        id, status, created_at,
        posting:postings(
          id, leistung, datum_von, datum_bis, ort,
          tierhalter:profiles!postings_tierhalter_id_fkey(full_name, ort)
        )
      `)
      .eq('sitter_id', user.id)
      .order('created_at', { ascending: false });

    // 3) Regionale Gesuche (noch nicht beworben)
    const beworbeneIds = (bewerbungen ?? []).map((b) => {
      const p = b.posting;
      if (!p) return undefined;
      const single = Array.isArray(p) ? p[0] : p;
      return (single as { id: string } | undefined)?.id;
    }).filter(Boolean);
    let regionalPostings: Array<{
      id: string; leistung: string; datum_von: string; datum_bis: string; ort: string;
      tierhalter: { full_name: string } | null;
    }> = [];
    if (profile?.plz) {
      const { data: regional } = await supabase
        .from('postings')
        .select(`id, leistung, datum_von, datum_bis, ort, tierhalter:profiles!postings_tierhalter_id_fkey(full_name)`)
        .eq('status', 'offen')
        .eq('auf_pinnwand', true)
        .eq('plz', profile.plz)
        .not('id', 'in', `(${beworbeneIds.join(',') || 'null'})`)
        .order('created_at', { ascending: false })
        .limit(5);
      regionalPostings = (regional ?? []) as unknown as typeof regionalPostings;
    }

    const offeneBewerbungen = (bewerbungen ?? []).filter((b: { status: string }) => b.status === 'ausstehend');
    const akzeptierteBewerbungen = (bewerbungen ?? []).filter((b: { status: string }) => b.status === 'ausgewaehlt');
    const abgelehnteB = (bewerbungen ?? []).filter((b: { status: string }) => b.status === 'abgelehnt');

    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Anfragen & Bewerbungen</h1>
        <p className="text-gray-500 text-sm mb-8">Kontaktanfragen von Tierhaltern und Deine Bewerbungen</p>

        {/* Eingehende Kontaktanfragen */}
        {(kontaktanfragen ?? []).length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Eingehende Kontaktanfragen ({kontaktanfragen!.length}) 💬
            </h2>
            <div className="space-y-3">
              {kontaktanfragen!.map((m: {
                id: string; created_at: string;
                tierhalter: { id: string; full_name: string; ort: string } | Array<{ id: string; full_name: string; ort: string }> | null;
              }) => {
                const th = Array.isArray(m.tierhalter) ? m.tierhalter[0] : m.tierhalter;
                return (
                  <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{th?.full_name ?? 'Tierhalter'}</p>
                      {th?.ort && <p className="text-xs text-gray-400">📍 {th.ort}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(m.created_at), 'd. MMM yyyy', { locale: de })}
                      </p>
                    </div>
                    <KontaktanfrageButtons matchId={m.id} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Akzeptierte Bewerbungen */}
        {akzeptierteBewerbungen.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Bestätigt 🎉
            </h2>
            <div className="space-y-3">
              {akzeptierteBewerbungen.map((b) => {
                const p = Array.isArray(b.posting) ? b.posting[0] : b.posting;
                if (!p) return null;
                return <BewerbungCard key={b.id} posting={p as BewerbungPosting} status="ausgewaehlt" />;
              })}
            </div>
          </section>
        )}

        {/* Offene Bewerbungen */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Meine Bewerbungen ({offeneBewerbungen.length})
          </h2>
          {offeneBewerbungen.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-400 text-sm">
                Keine offenen Bewerbungen.{' '}
                <Link href="/pinnwand" className="text-[#2D6A4F] hover:underline">Zur Pinnwand</Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {offeneBewerbungen.map((b) => {
                const p = Array.isArray(b.posting) ? b.posting[0] : b.posting;
                if (!p) return null;
                return <BewerbungCard key={b.id} posting={p as BewerbungPosting} status="ausstehend" />;
              })}
            </div>
          )}
        </section>

        {/* Regionale Gesuche */}
        {regionalPostings.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Neue Gesuche in deiner Region
              </h2>
              <Link href="/pinnwand" className="text-sm text-[#2D6A4F] hover:underline">
                Alle anzeigen →
              </Link>
            </div>
            <div className="space-y-3">
              {regionalPostings.map((p) => (
                <BewerbungCard key={p.id} posting={p} isNew />
              ))}
            </div>
          </section>
        )}

        {/* Abgelehnte */}
        {abgelehnteB.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Abgelehnt ({abgelehnteB.length})
            </h2>
            <div className="space-y-2 opacity-60">
              {abgelehnteB.map((b) => {
                const p = Array.isArray(b.posting) ? b.posting[0] : b.posting;
                if (!p) return null;
                return <BewerbungCard key={b.id} posting={p as BewerbungPosting} status="abgelehnt" />;
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ── Tierhalter-Ansicht ──────────────────────────────────────────
  // Eingehende Bewerbungen auf eigene Postings
  const { data: eingehendeBewerbungen } = await supabase
    .from('bewerbungen')
    .select(`
      id, status, nachricht, created_at,
      sitter:profiles!bewerbungen_sitter_id_fkey(id, full_name, ort, avatar_url),
      posting:postings!inner(id, leistung, datum_von, datum_bis, ort, tierhalter_id)
    `)
    .eq('postings.tierhalter_id', user.id)
    .order('created_at', { ascending: false });

  const offeneBew = (eingehendeBewerbungen ?? []).filter((b: { status: string }) => b.status === 'ausstehend');
  const bearbeitete = (eingehendeBewerbungen ?? []).filter((b: { status: string }) => b.status !== 'ausstehend');

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Eingehende Bewerbungen</h1>
      <p className="text-gray-500 text-sm mb-8">Sitter, die sich auf Deine Gesuche beworben haben</p>

      {offeneBew.length === 0 && bearbeitete.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 font-medium mb-2">Noch keine Bewerbungen</p>
          <p className="text-sm text-gray-400 mb-6">Gib ein Gesuch auf und warte auf Sitter-Bewerbungen.</p>
          <Link href="/dashboard/postings/neu"
            className="inline-block text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}>
            Gesuch aufgeben →
          </Link>
        </div>
      )}

      {offeneBew.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Neue Bewerbungen ({offeneBew.length})
          </h2>
          <div className="space-y-3">
            {offeneBew.map((b: {
              id: string; nachricht: string | null; created_at: string;
              sitter: { id: string; full_name: string; ort: string | null; avatar_url: string | null } | Array<{ id: string; full_name: string; ort: string | null; avatar_url: string | null }> | null;
              posting: { id: string; leistung: string; datum_von: string; datum_bis: string; ort: string } | Array<{ id: string; leistung: string; datum_von: string; datum_bis: string; ort: string }> | null;
            }) => {
              const sitter = Array.isArray(b.sitter) ? b.sitter[0] : b.sitter;
              const posting = Array.isArray(b.posting) ? b.posting[0] : b.posting;
              if (!sitter || !posting) return null;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#2E4A6B] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {sitter.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{sitter.full_name}</p>
                      {sitter.ort && <p className="text-xs text-gray-400">📍 {sitter.ort}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Für: {LEISTUNG_LABEL[posting.leistung] ?? posting.leistung} ·{' '}
                        {format(new Date(posting.datum_von), 'd. MMM', { locale: de })}
                        {posting.datum_von !== posting.datum_bis && (
                          <> – {format(new Date(posting.datum_bis), 'd. MMM', { locale: de })}</>
                        )}
                      </p>
                      {b.nachricht && (
                        <p className="text-xs text-gray-500 mt-1.5 italic line-clamp-2">
                          &ldquo;{b.nachricht}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <BewerbungButtons bewerbungId={b.id} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {bearbeitete.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Bereits bearbeitet ({bearbeitete.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {bearbeitete.map((b: {
              id: string;
              status: string;
              sitter: { id: string; full_name: string } | Array<{ id: string; full_name: string }> | null;
              posting: { id: string; leistung: string; datum_von: string; datum_bis: string; ort: string } | Array<{ id: string; leistung: string; datum_von: string; datum_bis: string; ort: string }> | null;
            }) => {
              const sitter = Array.isArray(b.sitter) ? b.sitter[0] : b.sitter;
              if (!sitter) return null;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-700">{sitter.full_name}</p>
                  <span className={`text-xs px-3 py-1 rounded-xl font-medium ${
                    b.status === 'ausgewaehlt' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
                  }`}>
                    {b.status === 'ausgewaehlt' ? 'Angenommen ✓' : 'Abgelehnt'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// Hilfsfunktion für Sitter-Bewerbungskarten
function BewerbungCard({
  posting,
  status,
  isNew,
}: {
  posting: BewerbungPosting;
  status?: 'ausstehend' | 'ausgewaehlt' | 'abgelehnt';
  isNew?: boolean;
}) {
  const th = Array.isArray(posting.tierhalter) ? posting.tierhalter[0] : posting.tierhalter;

  const statusBadge: Record<string, string> = {
    ausstehend: 'bg-yellow-50 text-yellow-700',
    ausgewaehlt: 'bg-green-50 text-green-700',
    abgelehnt: 'bg-red-50 text-red-500',
  };
  const statusLabel: Record<string, string> = {
    ausstehend: 'Ausstehend',
    ausgewaehlt: 'Bestätigt ✓',
    abgelehnt: 'Abgelehnt',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${LEISTUNG_COLOR[posting.leistung]}`}>
            {LEISTUNG_LABEL[posting.leistung]}
          </span>
          {isNew && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-600">
              Neu
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {format(new Date(posting.datum_von), 'd. MMM yyyy', { locale: de })}
          {posting.datum_von !== posting.datum_bis && (
            <> – {format(new Date(posting.datum_bis), 'd. MMM yyyy', { locale: de })}</>
          )}
          {' · '}{posting.ort}
        </p>
        {th && (
          <p className="text-xs text-gray-400 mt-0.5">von {th.full_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {status && (
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${statusBadge[status]}`}>
            {statusLabel[status]}
          </span>
        )}
        {isNew && (
          <Link
            href="/pinnwand"
            className="text-xs bg-[#F4A261] text-white font-medium px-4 py-1.5 rounded-xl hover:bg-[#e08a44] transition-colors"
          >
            Bewerben
          </Link>
        )}
      </div>
    </div>
  );
}
