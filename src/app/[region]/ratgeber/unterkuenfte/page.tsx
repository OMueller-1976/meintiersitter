import { notFound } from 'next/navigation'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'
import { getRegionContent } from '@/lib/region-content'
import { regionMetadata, breadcrumbLd } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import KiHinweis from '@/components/shared/KiHinweis'

export function generateMetadata({ params }: { params: { region: string } }) {
  return regionMetadata(params.region, 'unterkuenfte')
}

interface Props {
  params: { region: string }
}

const buchungsTipps = [
  '„Hunde willkommen" explizit beim Anbieter prüfen',
  'Eingezäunter Garten ist ideal für mehr Freiheit',
  'Leinenpflicht in Naturschutzgebieten beachten',
  'Zeckenmittel und Wundversorgung einpacken',
  'Tierarzt-Notfallnummer der Region vorab speichern',
];

export default function UnterkuenftePage({ params }: Props) {
  if (!(params.region in REGIONS)) notFound()
  const regionConfig = REGIONS[params.region as RegionSlug]
  const content = getRegionContent(params.region)
  if (!content) notFound()

  const { unterkuenfte, unterkunftTipps } = content
  const empfehlung = unterkuenfte.find((u) => u.empfehlung)
  const weitere = unterkuenfte.filter((u) => u !== empfehlung)
  const link = (url: string) => (url.startsWith('http') ? url : `https://${url}`)

  return (
    <main className="min-h-screen">
      <JsonLd data={[breadcrumbLd(params.region, 'unterkuenfte')]} />
      {/* Hero */}
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          🏨 Hundefreundliche Unterkünfte in {regionConfig.name}
        </h1>
        <p className="text-[#A8C0DC] text-lg">
          Übernachten mit Vierbeiner — diese Unterkünfte heißen Euren Hund willkommen.
        </p>
      </div>

      <div className="bg-[#F1F5F9]">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

          {unterkuenfte.length === 0 && (
            <p className="bg-white rounded-2xl border border-[#C8D8EC] p-6 text-sm text-[#4E779F]">
              Für {regionConfig.name} sind noch keine geprüften Unterkünfte erfasst.
              Die Tipps unten helfen bei der Suche auf den gängigen Buchungsplattformen.
            </p>
          )}

          {empfehlung && (
            <div className="bg-white rounded-2xl border-2 border-[#2E4A6B] p-7">
              <div className="inline-flex items-center gap-2 bg-[#DDEAF4] text-[#2E4A6B] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ⭐ Empfehlung der Redaktion
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3249]">{empfehlung.name}</h2>
                  <p className="text-[#4E779F] text-sm mt-0.5">{empfehlung.ort}</p>
                  <p className="text-sm text-[#4E779F] mt-1">{empfehlung.beschreibung}</p>
                </div>
                {empfehlung.website && (
                  <a
                    href={link(empfehlung.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-[#2E4A6B] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#3A5A80] transition-colors"
                  >
                    Website →
                  </a>
                )}
              </div>
              {empfehlung.features && (
                <ul className="space-y-2">
                  {empfehlung.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#4E779F]">
                      <span className="text-[#2E4A6B] font-bold flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {weitere.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">Weitere Unterkünfte</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {weitere.map((u) => (
                  <div key={u.name} className="bg-white rounded-2xl border border-[#C8D8EC] p-5 flex flex-col">
                    <h3 className="font-semibold text-[#1E3249] text-sm">{u.name}</h3>
                    <p className="text-xs text-[#4E779F] mb-2">{u.ort}</p>
                    <p className="text-xs text-[#4E779F] leading-relaxed flex-1 mb-3">{u.beschreibung}</p>
                    {u.website && (
                      <a href={link(u.website)} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-[#2E4A6B] hover:underline">
                        Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {unterkunftTipps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">Gut zu wissen</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {unterkunftTipps.map((k) => (
                  <div key={k.titel} className="bg-white rounded-2xl border border-[#C8D8EC] p-5 flex flex-col">
                    <div className="text-3xl mb-3" aria-hidden="true">{k.icon}</div>
                    <h3 className="font-semibold text-[#1E3249] text-sm mb-2">{k.titel}</h3>
                    <p className="text-xs text-[#4E779F] leading-relaxed flex-1 mb-3">{k.text}</p>
                    {k.tipp && (
                      <div className="bg-[#EEF2F8] rounded-lg px-3 py-2 text-xs text-[#2E4A6B]">
                        💡 Tipp: {k.tipp}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#EEF2F8] rounded-2xl p-6">
            <h2 className="font-bold text-[#1E3249] text-lg mb-4">🔍 Worauf beim Buchen achten?</h2>
            <ul className="space-y-2">
              {buchungsTipps.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[#4E779F]">
                  <span className="text-[#2E4A6B] font-bold flex-shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-10"><KiHinweis /></div>
    </main>
  );
}
