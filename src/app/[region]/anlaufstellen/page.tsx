import Link from 'next/link'
import { notFound } from 'next/navigation'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'
import { getRegionContent } from '@/lib/region-content'
import { regionMetadata, breadcrumbLd, tierheimeLd } from '@/lib/seo'
import JsonLd from '@/components/shared/JsonLd'
import KiHinweis from '@/components/shared/KiHinweis'

interface Props {
  params: { region: string }
}

export function generateMetadata({ params }: { params: { region: string } }) {
  return regionMetadata(params.region, 'anlaufstellen')
}

export default function AnlaufstellenPage({ params }: Props) {
  const { region } = params
  if (!(region in REGIONS)) notFound()

  const regionConfig = REGIONS[region as RegionSlug]
  const content = getRegionContent(region)
  if (!content) notFound()
  const { tierheime, anlaufstellen, futterstationen } = content

  const TYP_LABEL: Record<string, string> = {
    verein: 'Tierschutzverein',
    tiertafel: 'Tiertafel',
    notfall: 'Notfall',
    sonstiges: 'Anlaufstelle',
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <JsonLd data={[breadcrumbLd(params.region, 'anlaufstellen'), ...tierheimeLd(params.region)]} />

      {/* Hero */}
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold mb-3">🏠 Im Ernstfall helfen sie weiter</h1>
        <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
          Tierheime, Tierschutzvereine und Anlaufstellen in {regionConfig.name} — für alle Fälle wenn dringende Hilfe gebraucht wird.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* Notfall-Hinweis — statischer Block */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 w-full">
          <h2 className="text-lg font-bold text-amber-800 mb-2">🚨 Tiernotfall?</h2>
          <p className="text-amber-700 leading-relaxed mb-3">
            Bei einem akuten Tiernotfall außerhalb der Öffnungszeiten: Bitte wende Dich
            direkt an die örtliche Polizei oder den tierärztlichen Notdienst.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-xl px-4 py-2">
            <span className="text-amber-800 font-semibold">Notfallnummer:</span>
            <span className="text-amber-900 font-bold text-lg">110 (Polizei)</span>
          </div>
          <p className="text-amber-700 leading-relaxed mt-3">
            Hund entlaufen?{' '}
            <Link href={`/${region}/ratgeber/hund-entlaufen`} className="font-semibold underline">
              Das hilft jetzt
            </Link>
            .
          </p>
        </div>

        {/* Tierheime */}
        {tierheime.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#1E3249] mb-4 flex items-center gap-2">
              <span>🏠</span> Tierheime
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tierheime.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏠</span>
                      <h3 className="font-bold text-[#1E3249] text-base leading-tight">{t.name}</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#DDEAF4] text-[#2E4A6B] whitespace-nowrap flex-shrink-0">
                      Tierheim
                    </span>
                  </div>
                  <div className="text-sm text-[#4E779F] space-y-1">
                    <p>📍 {t.adresse}</p>
                    {t.oeffnungszeiten && <p>🕐 {t.oeffnungszeiten}</p>}
                    {t.website && <p>🌐 {t.website}</p>}
                  </div>
                  {t.beschreibung && (
                    <p className="text-sm text-[#2E4A6B] leading-relaxed">{t.beschreibung}</p>
                  )}
                  {t.website && (
                    <a
                      href={t.website.startsWith('http') ? t.website : `https://${t.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                    >
                      Zur Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Anlaufstellen */}
        {anlaufstellen.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#1E3249] mb-4 flex items-center gap-2">
              <span>🤝</span> Tierschutz & Anlaufstellen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {anlaufstellen.map((a) => (
                <div key={a.name} className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {a.typ === 'tiertafel' ? '🍽' : a.typ === 'notfall' ? '🚨' : '🤝'}
                      </span>
                      <h3 className="font-bold text-[#1E3249] text-base leading-tight">{a.name}</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FEF3E2] text-[#E07B30] whitespace-nowrap flex-shrink-0">
                      {TYP_LABEL[a.typ] ?? a.typ}
                    </span>
                  </div>
                  {a.adresse && (
                    <p className="text-sm text-[#4E779F]">📍 {a.adresse}</p>
                  )}
                  {a.email && (
                    <p className="text-sm text-[#4E779F]">✉️ {a.email}</p>
                  )}
                  {a.website && (
                    <p className="text-sm text-[#4E779F]">🌐 {a.website}</p>
                  )}
                  <p className="text-sm text-[#2E4A6B] leading-relaxed">{a.beschreibung}</p>
                  {a.website && (
                    <a
                      href={a.website.startsWith('http') ? a.website : `https://${a.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                    >
                      Zur Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Futterstationen */}
        <section id="futterstationen" className="scroll-mt-4">
          <h2 className="text-xl font-bold text-[#1E3249] mb-4 flex items-center gap-2">
            <span>🍖</span> Futterstationen & Tiertafeln
          </h2>
          {futterstationen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {futterstationen.map((f) => (
                <div key={f.name} className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">{f.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FEF3E2] text-[#9A4A0F] whitespace-nowrap flex-shrink-0">
                      {f.typ === 'tiertafel' ? 'Tiertafel' : f.typ === 'futterstelle' ? 'Futterstelle' : 'Spendenannahme'}
                    </span>
                  </div>
                  <div className="text-sm text-[#4E779F] space-y-1">
                    <p>📍 {f.adresse ? `${f.adresse}, ` : ''}{f.ort}</p>
                    {f.ausgabezeiten && <p>🕐 {f.ausgabezeiten}</p>}
                  </div>
                  <p className="text-sm text-[#2E4A6B] leading-relaxed">{f.beschreibung}</p>
                  {f.website && (
                    <a
                      href={f.website.startsWith('http') ? f.website : `https://${f.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                    >
                      Zur Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="bg-white rounded-2xl border border-[#C8D8EC] p-6 text-sm text-[#4E779F]">
              Für {regionConfig.name} sind noch keine Futterstationen oder Tiertafeln erfasst.
            </p>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[#2E4A6B] rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Kennen Sie eine weitere Anlaufstelle?</h2>
          <p className="text-white/80 mb-5 leading-relaxed">
            Schreiben Sie uns — wir nehmen sie gerne auf.
          </p>
          <a
            href="mailto:kontakt@tiersitti.de?subject=Anlaufstelle%20vorschlagen"
            className="inline-block bg-white text-[#2E4A6B] font-semibold rounded-xl px-6 py-3 hover:bg-[#EEF2F8] transition-colors"
          >
            Eintrag vorschlagen →
          </a>
        </section>

      </div>
      <div className="max-w-4xl mx-auto px-4 pb-10"><KiHinweis /></div>
    </main>
  )
}
