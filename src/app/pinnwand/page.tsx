import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Posting, Profile, TierProfile } from '@/types';
import PinnwandBewerbenButton from './PinnwandBewerbenButton';

const LEISTUNG_LABEL: Record<string, string> = {
  gassi: 'Gassi gehen',
  fuettern: 'Füttern',
  tagesbetreuung: 'Tagesbetreuung',
  uebernachtung: 'Übernachtung',
};

const LEISTUNG_COLOR: Record<string, string> = {
  gassi: 'bg-[#DDEAF4] text-[#2E4A6B]',
  fuettern: 'bg-[#FEF3E2] text-[#E07B30]',
  tagesbetreuung: 'bg-[#E8F0F8] text-[#2E4A6B]',
  uebernachtung: 'bg-[#EDE8F5] text-[#5B4A8A]',
};

type PostingRow = Posting & {
  tierhalter: Pick<Profile, 'full_name' | 'ort'> | null;
  tier: Pick<TierProfile, 'name' | 'tierart'> | null;
};

export const metadata = { title: 'Pinnwand – MeinTiersitter' };

export default async function PinnwandPage({
  searchParams,
}: {
  searchParams: { leistung?: string; plz?: string };
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('postings')
    .select('*, tierhalter:profiles!tierhalter_id(full_name, ort), tier:tier_profiles(name, tierart)')
    .eq('status', 'offen')
    .eq('auf_pinnwand', true)
    .order('created_at', { ascending: false });

  if (searchParams.leistung) {
    query = query.eq('leistung', searchParams.leistung);
  }
  if (searchParams.plz) {
    query = query.eq('plz', searchParams.plz);
  }

  const { data: postings } = await query;
  const rows = (postings ?? []) as PostingRow[];

  let meineBewerbungen: Set<string> = new Set();
  if (user) {
    const { data: bew } = await supabase
      .from('bewerbungen')
      .select('posting_id')
      .eq('sitter_id', user.id);
    meineBewerbungen = new Set((bew ?? []).map((b) => b.posting_id));
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#2E4A6B]">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-white">Pinnwand</h1>
          <p className="text-[#A8C0DC] mt-1">
            Offene Gesuche aus der Region – meld dich als Tiersitter!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter */}
        <form className="flex flex-wrap gap-3 mb-8 bg-white/80 backdrop-blur-sm border border-[#C8D8EC] rounded-2xl p-4">
          <select
            name="leistung"
            defaultValue={searchParams.leistung ?? ''}
            className="border border-[#C8D8EC] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] text-[#1E3249]"
          >
            <option value="">Alle Leistungen</option>
            <option value="gassi">Gassi gehen</option>
            <option value="fuettern">Füttern</option>
            <option value="tagesbetreuung">Tagesbetreuung</option>
            <option value="uebernachtung">Übernachtung</option>
          </select>
          <input
            name="plz"
            type="text"
            placeholder="PLZ filtern"
            defaultValue={searchParams.plz ?? ''}
            className="border border-[#C8D8EC] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] w-32 text-[#1E3249]"
          />
          <button
            type="submit"
            className="bg-[#2E4A6B] text-white rounded-xl px-5 py-2 text-sm font-medium hover:bg-[#1E3249] transition-colors"
          >
            Filtern
          </button>
          {(searchParams.leistung || searchParams.plz) && (
            <a
              href="/pinnwand"
              className="border border-[#C8D8EC] rounded-xl px-5 py-2 text-sm text-[#4E779F] hover:bg-[#EEF2F8] transition-colors"
            >
              Zurücksetzen
            </a>
          )}
        </form>

        {/* Postings */}
        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C8D8EC] shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">🐾</div>
            <p className="text-[#4E779F]">Keine offenen Gesuche gefunden.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((posting) => (
              <div
                key={posting.id}
                className="bg-white rounded-2xl border border-[#C8D8EC] hover:border-[#2E4A6B] shadow-sm p-6 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badge + Ort */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${LEISTUNG_COLOR[posting.leistung]}`}
                      >
                        {LEISTUNG_LABEL[posting.leistung]}
                      </span>
                      <span className="text-sm text-[#4E779F]">
                        {posting.ort} · {posting.plz}
                      </span>
                    </div>

                    {/* Tier */}
                    {posting.tier && (
                      <p className="text-sm font-medium text-[#1E3249] mb-1">
                        {posting.tier.name}{' '}
                        <span className="font-normal text-[#4E779F]">
                          ({posting.tier.tierart})
                        </span>
                      </p>
                    )}

                    {/* Zeitraum */}
                    <p className="text-sm text-[#4E779F] mb-1">
                      {format(new Date(posting.datum_von), 'd. MMM yyyy', { locale: de })}
                      {posting.datum_von !== posting.datum_bis && (
                        <> – {format(new Date(posting.datum_bis), 'd. MMM yyyy', { locale: de })}</>
                      )}
                      {posting.uhrzeit_von && (
                        <span className="ml-1 text-[#7A9DBF]">
                          · {posting.uhrzeit_von}
                          {posting.uhrzeit_bis && ` – ${posting.uhrzeit_bis}`} Uhr
                        </span>
                      )}
                    </p>

                    {/* Nachricht */}
                    {posting.nachricht && (
                      <p className="text-sm text-[#4E779F] mt-2 line-clamp-2">
                        {posting.nachricht}
                      </p>
                    )}

                    {/* Tierhalter */}
                    <p className="text-xs text-[#7A9DBF] mt-3">
                      Gesucht von{' '}
                      <span className="font-medium text-[#4E779F]">
                        {posting.tierhalter?.full_name ?? 'Unbekannt'}
                      </span>
                    </p>
                  </div>

                  {/* Bewerben-Button */}
                  <div className="flex-shrink-0">
                    <PinnwandBewerbenButton
                      postingId={posting.id}
                      isLoggedIn={!!user}
                      hasBewerbung={meineBewerbungen.has(posting.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA für nicht eingeloggte */}
        {!user && rows.length > 0 && (
          <div className="mt-8 bg-[#2E4A6B] rounded-2xl p-6 text-center text-white">
            <p className="font-semibold mb-2">Du bist Tiersitter?</p>
            <p className="text-sm text-[#A8C0DC] mb-4">
              Registriere dich kostenlos und bewirb dich auf Gesuche in deiner Nähe.
            </p>
            <a
              href="/register"
              className="inline-block bg-[#F4A261] text-white font-semibold px-6 py-2 rounded-xl hover:bg-[#E07B30] transition-colors"
            >
              Jetzt registrieren
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
