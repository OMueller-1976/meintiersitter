export const dynamic = 'force-dynamic'

import { getMarktplatzEintraege, KATEGORIE_LABELS } from '@/lib/queries/marktplatz'

type Eintrag = Awaited<ReturnType<typeof getMarktplatzEintraege>>[number]

export default async function MarktplatzPage() {
  const eintraege = await getMarktplatzEintraege()

  // Nach Kategorie gruppieren
  const gruppen = eintraege.reduce<Record<string, Eintrag[]>>((acc, e) => {
    if (!acc[e.kategorie]) acc[e.kategorie] = []
    acc[e.kategorie].push(e)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1E3249] mb-2">Marktplatz</h1>
      <p className="text-sm text-[#4E779F] mb-8">
        Tierärzte, Tierbedarf und weitere Anbieter in der Vulkaneifel — geprüft und mit aktuellen Kontaktdaten.
      </p>

      {Object.keys(gruppen).length === 0 && (
        <p className="text-sm text-[#7A9DBF]">Aktuell sind keine Einträge vorhanden.</p>
      )}

      {Object.entries(gruppen).map(([kategorie, items]) => (
        <div key={kategorie} className="mb-8">
          <h2 className="text-sm font-semibold text-[#2E4A6B] uppercase tracking-wide mb-3">
            {KATEGORIE_LABELS[kategorie] ?? kategorie}
          </h2>

          <div className="divide-y divide-[#EEF2F8] border border-[#EEF2F8] rounded-xl overflow-hidden bg-white">
            {items.map((item) => (
              <div key={item.id} className="px-5 py-4 hover:bg-[#F8FAFD] transition-colors">
                {/* Auf sehr schmalen Screens: untereinander; ab sm: nebeneinander */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1E3249] text-sm">{item.name}</h3>
                      {item.is_verified && (
                        <span className="text-xs text-[#16A34A] flex items-center gap-0.5">
                          ✓ Geprüft
                        </span>
                      )}
                    </div>
                    {item.beschreibung && (
                      <p className="text-xs text-[#4E779F] mt-1 leading-relaxed">{item.beschreibung}</p>
                    )}
                    <p className="text-xs text-[#7A9DBF] mt-2">
                      📍 {item.adresse}, {item.plz} {item.ort}
                    </p>
                    {item.oeffnungszeiten && (
                      <p className="text-xs text-[#7A9DBF] mt-0.5">🕐 {item.oeffnungszeiten}</p>
                    )}
                  </div>

                  {/* Kontaktdaten: auf Mobile links-ausgerichtet, ab sm rechts */}
                  <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-1 flex-shrink-0 sm:text-right">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="text-xs text-[#2E4A6B] font-medium whitespace-nowrap"
                      >
                        📞 {item.phone}
                      </a>
                    )}
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2E4A6B] underline whitespace-nowrap"
                      >
                        Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
