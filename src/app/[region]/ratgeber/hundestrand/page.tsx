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
  return { title: `Special Hunde – ${cfg.name}` }
}

export default function HundestrandPage({ params }: Props) {
  const { region } = params
  if (!(region in REGIONS)) notFound()

  const regionConfig = REGIONS[region as RegionSlug]
  const content = REGION_CONTENT[region] ?? REGION_CONTENT['daun']
  const spot = content.hundestrand

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🐕 Special Hunde – {regionConfig.name}
        </h1>
        <p className="text-[#A8C0DC] text-lg">
          Bademöglichkeiten und Hundespots in der Region
        </p>
      </div>

      <div className="bg-[#F1F5F9]">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

          {/* Highlight-Card */}
          <div className="bg-[#2E4A6B] rounded-2xl p-8 text-white">
            <div className="inline-flex items-center gap-2 bg-[#F4A261] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ⭐ Hundestrand der Region
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{spot.name}</h2>
            {spot.entfernung && (
              <p className="text-[#A8C0DC] mb-4">📍 {spot.entfernung}</p>
            )}
            <p className="text-[#D4E3F0] text-sm mb-6 leading-relaxed">{spot.beschreibung}</p>

            {spot.details.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {spot.details.map((d) => (
                  <div key={d} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 text-[#A8C0DC]">✓</span>
                    <span className="text-[#D4E3F0]">{d}</span>
                  </div>
                ))}
              </div>
            )}

            {spot.adresse && (
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#A8C0DC] uppercase tracking-wide mb-1">
                  Adresse
                </p>
                <p className="text-sm text-[#D4E3F0]">{spot.adresse}</p>
              </div>
            )}
          </div>

          {/* Allgemeiner Hinweis */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Allgemeiner Hinweis</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              Bitte beachte die jeweils gültigen Leinenpflichten und Sperrgebiete in Naturschutzgebieten
              und Nationalparks. Die Angaben sind ohne Gewähr — vor Ort gelten die aktuellen Beschilderungen.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
