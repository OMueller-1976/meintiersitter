import { notFound } from 'next/navigation'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'
import { REGION_CONTENT } from '@/lib/region-content'

interface Props {
  params: { region: string }
}

export async function generateMetadata({ params }: Props) {
  const cfg = REGIONS[params.region as RegionSlug]
  if (!cfg) return {}
  return { title: `Wandern mit Hund – ${cfg.name}` }
}

const ALLGEMEINE_TIPPS = [
  'Naturschutzgebiete: immer Leine anlegen',
  'Wasser für den Hund mitbringen',
  'Bei Hitze: Asphaltierte Wege können Pfoten verbrennen',
  'Zeckenschutz empfohlen',
  'Tierarzt-Notfallnummer der Region vorab speichern',
]

export default function WandernPage({ params }: Props) {
  const { region } = params
  if (!(region in REGIONS)) notFound()

  const regionConfig = REGIONS[region as RegionSlug]
  const content = REGION_CONTENT[region] ?? REGION_CONTENT['daun']
  const routen = content.wanderrouten

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🥾 Wandern mit Hund in {regionConfig.name}
        </h1>
        <p className="text-[#A8C0DC] text-lg">
          Die schönsten Routen für Hund und Halter in der Region
        </p>
      </div>

      <div className="bg-[#F1F5F9]">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Routen-Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {routen.map((r) => {
              const pills = [
                r.laenge && { icon: '📏', text: r.laenge },
                r.dauer && { icon: '⏱', text: r.dauer },
                r.schwierigkeit && { icon: '💪', text: r.schwierigkeit },
                r.hundInfo && { icon: '🐕', text: r.hundInfo },
              ].filter(Boolean) as { icon: string; text: string }[]

              return (
                <div
                  key={r.titel}
                  className="bg-white rounded-2xl border border-[#C8D8EC] p-6 hover:border-[#2E4A6B] hover:shadow-md transition-all flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2F8] flex items-center justify-center text-2xl flex-shrink-0 mb-4">
                    🥾
                  </div>

                  <h2 className="font-bold text-[#1E3249] text-lg mb-3">{r.titel}</h2>

                  {pills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pills.map((p) => (
                        <span
                          key={p.text}
                          className="inline-flex items-center gap-1 bg-[#EEF2F8] text-[#2E4A6B] text-xs rounded-full px-3 py-1"
                        >
                          {p.icon} {p.text}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-[#4E779F] leading-relaxed mb-4 flex-1">
                    {r.beschreibung}
                  </p>

                  {r.startpunkt && (
                    <p className="text-xs text-[#7A9DBF]">
                      📍 <span className="font-medium">Start:</span> {r.startpunkt}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Allgemeine Tipps */}
          <div className="bg-[#EEF2F8] rounded-2xl p-6">
            <h2 className="font-bold text-[#1E3249] text-lg mb-4">
              🐕 Wichtige Hinweise für Hunde in {regionConfig.kurzname}
            </h2>
            <ul className="space-y-2">
              {ALLGEMEINE_TIPPS.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[#4E779F]">
                  <span className="text-[#2E4A6B] font-bold flex-shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </main>
  )
}
