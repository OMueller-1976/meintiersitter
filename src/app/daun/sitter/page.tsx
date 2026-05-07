import Link from 'next/link';
import {
  MOCK_SITTER,
  LEISTUNGS_LABELS,
  LEISTUNGS_CHIPS,
  ORTSCHAFTEN,
} from '@/lib/mock-data';

export const metadata = { title: 'Sitter entdecken – MeinTiersitter' };

export default async function SitterPage({
  searchParams,
}: {
  searchParams: Promise<{ ort?: string; leistung?: string; garten?: string; medikamente?: string }>;
}) {
  const { ort, leistung, garten, medikamente } = await searchParams;
  const filterOrt = ort && ort !== 'Alle Ortschaften' ? ort : '';
  const filterLeistung = leistung ?? '';
  const filterGarten = garten === '1';
  const filterMedikamente = medikamente === '1';

  const sitter = MOCK_SITTER.filter((s) => {
    if (filterOrt && s.ortschaft !== filterOrt) return false;
    if (filterLeistung && !s.leistungen.includes(filterLeistung)) return false;
    if (filterGarten && !s.hat_garten) return false;
    if (filterMedikamente && !s.kann_medikamente) return false;
    return true;
  });

  const hasFilter = !!filterOrt || !!filterLeistung || filterGarten || filterMedikamente;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#1E3249]">Sitter in Deiner Region</h1>
        <p className="text-sm text-[#4E779F] mt-0.5">
          Diese Menschen helfen gerne — kostenlos und aus Freude am Tier.
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C8D8EC] p-4">
        <form className="flex flex-wrap gap-3 items-center">
          <select
            name="ort"
            defaultValue={filterOrt || 'Alle Ortschaften'}
            className="border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] text-[#1E3249]"
          >
            {ORTSCHAFTEN.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <select
            name="leistung"
            defaultValue={filterLeistung}
            className="border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] text-[#1E3249]"
          >
            <option value="">Alle Leistungen</option>
            {Object.entries(LEISTUNGS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-[#1E3249] cursor-pointer">
            <input
              type="checkbox"
              name="garten"
              value="1"
              defaultChecked={filterGarten}
              className="accent-[#2E4A6B] w-4 h-4"
            />
            🌿 Garten
          </label>

          <label className="flex items-center gap-2 text-sm text-[#1E3249] cursor-pointer">
            <input
              type="checkbox"
              name="medikamente"
              value="1"
              defaultChecked={filterMedikamente}
              className="accent-[#2E4A6B] w-4 h-4"
            />
            💊 Medikamente
          </label>

          <button
            type="submit"
            className="bg-[#2E4A6B] text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#1E3249] transition-colors"
          >
            Filtern
          </button>
          {hasFilter && (
            <Link
              href="/daun/sitter"
              className="border border-[#C8D8EC] rounded-xl px-4 py-2 text-sm text-[#4E779F] hover:bg-[#EEF2F8] transition-colors"
            >
              Zurücksetzen
            </Link>
          )}
        </form>
      </div>

      {/* Ergebnis */}
      {sitter.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#C8D8EC] p-12 text-center">
          <div className="text-4xl mb-3">🐾</div>
          <p className="text-[#4E779F] font-medium mb-1">Keine Sitter gefunden.</p>
          <p className="text-sm text-[#7A9DBF] mb-4">Filter anpassen oder direkt registrieren.</p>
          <Link
            href="/register?role=sitter"
            className="inline-block bg-[#2E4A6B] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3A5A80] transition-colors text-sm"
          >
            Als Sitter registrieren
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#7A9DBF]">
            {sitter.length} {sitter.length === 1 ? 'Sitter' : 'Sitter'} gefunden
            {hasFilter && ' · gefiltert'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sitter.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-[#C8D8EC] p-5 hover:border-[#2E4A6B] hover:shadow-md transition-all flex flex-col"
              >
                {/* Foto zentriert */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#C8D8EC] mb-3"
                    style={{ width: 72, height: 72 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.foto}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-[#1E3249] text-sm text-center">{s.name}</div>
                  <div className="text-xs text-[#4E779F] mt-0.5">📍 {s.ortschaft}</div>
                  <div className="text-xs text-[#4E779F] mt-0.5">
                    ⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews} Bewertungen)
                  </div>
                </div>

                <div className="border-t border-[#EEF2F8] mb-3" />

                <p className="text-xs text-[#4E779F] leading-relaxed line-clamp-3 flex-1 mb-3">
                  {s.beschreibung}
                </p>

                <div className="border-t border-[#EEF2F8] mb-3" />

                {/* Leistungs-Chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.leistungen.map((l) => (
                    <span key={l} className="bg-[#EEF2F8] text-[#2E4A6B] text-xs rounded-full px-2 py-0.5">
                      {LEISTUNGS_CHIPS[l] ?? l}
                    </span>
                  ))}
                </div>

                {/* Zusatz-Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {s.hat_garten && (
                    <span className="text-xs bg-[#EEF2F8] text-[#2E4A6B] px-2 py-0.5 rounded-full">
                      🌿 Garten
                    </span>
                  )}
                  {s.kann_medikamente && (
                    <span className="text-xs bg-[#EEF2F8] text-[#2E4A6B] px-2 py-0.5 rounded-full">
                      💊 Medikamente möglich
                    </span>
                  )}
                </div>

                <div className="border-t border-[#EEF2F8] mb-3" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7A9DBF]">{s.erfahrung_jahre} Jahre Erfahrung</span>
                  <Link
                    href="/register"
                    className="text-xs text-[#2E4A6B] font-medium hover:underline"
                  >
                    Kontakt aufnehmen →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA Banner */}
      <div className="bg-[#2E4A6B] rounded-xl p-6 text-center text-white">
        <p className="font-bold text-base mb-1">Du möchtest auch helfen?</p>
        <p className="text-sm text-[#A8C0DC] mb-4">
          Als Sitter registrieren ist kostenlos und dauert nur 2 Minuten.
        </p>
        <Link
          href="/register?role=sitter"
          className="inline-block bg-[#F4A261] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#E07B30] transition-colors text-sm"
        >
          Jetzt als Sitter registrieren →
        </Link>
      </div>
    </div>
  );
}
