import Link from 'next/link'
import { notFound } from 'next/navigation'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'
import { SAVING_PAWS, savingPawsRegionHinweis } from '@/lib/saving-paws'

export const metadata = {
  title: 'Hund entlaufen – das hilft jetzt – Tiersitti Ratgeber',
  description:
    'Was tun, wenn ein Hund entläuft? Erste Schritte, Vorsorge beim Hundesitter und die Hundesuchhilfe Saving Paws.',
}

interface Props {
  params: { region: string }
}

const ersteSchritte = [
  'Ruhe bewahren. Panik hilft Deinem Hund nicht, und er spürt sie.',
  'Nicht hinterherrennen oder laut rufen. Ein verängstigter Hund läuft dann oft weiter weg.',
  'Merke Dir den Ort, an dem der Hund entlaufen ist, und lass dort ein getragenes Kleidungsstück oder seine Decke liegen.',
  'Hol möglichst früh professionelle Hilfe dazu, bevor unkoordinierte Suchaktionen den Hund weiter verunsichern.',
  'Melde den Hund beim Haustierregister, bei dem er registriert ist, und informiere Tierheime, Tierärzte und Polizei in der Umgebung.',
  'Bereite ein aktuelles Foto, Rasse, Größe, Chipnummer und Besonderheiten vor, damit Meldungen und Suchflyer schnell gehen.',
]

const beimSitter = [
  'Doppelte Sicherung beim Gassi: gut sitzendes Geschirr plus Halsband, bei unsicheren Hunden zusätzlich eine Schleppleine.',
  'Vorab klären, wie der Hund auf Reize reagiert (Wild, Knall, fremde Hunde) und wo er nicht frei laufen darf.',
  'Notfallplan festlegen: Der Sitter informiert die Halter sofort. Telefonnummern von Haltern, Tierarzt und Notfallkontakt stehen griffbereit.',
  'Foto, Chipnummer und Registrierung des Hundes dem Sitter vorab geben.',
  'Gartentor und Haustür beim Übergabegespräch gemeinsam prüfen: Sind Zäune dicht, schließen Tore sicher?',
]

export default function HundEntlaufenPage({ params }: Props) {
  if (!(params.region in REGIONS)) notFound()
  const region = params.region
  const regionConfig = REGIONS[region as RegionSlug]

  return (
    <main className="min-h-screen">
      <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🚨 Hund entlaufen – das hilft jetzt</h1>
        <p className="text-[#A8C0DC] text-lg">
          Erste Schritte, Vorsorge beim Hundesitter und Hilfe vor Ort in {regionConfig.name}.
        </p>
      </div>

      <div className="bg-[#F1F5F9]">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

          {/* Soforthilfe-Box */}
          <section aria-labelledby="sofort" className="bg-white border-2 border-red-300 rounded-2xl p-6">
            <h2 id="sofort" className="text-lg font-bold text-red-800 mb-2">Sofort Hilfe holen</h2>
            <p className="text-sm text-[#2E4A6B] leading-relaxed mb-3">
              Die <strong>{SAVING_PAWS.name}</strong> ist ein gemeinnütziger Verein aus {SAVING_PAWS.sitz}
              und unterstützt Halter bei der Suche nach entlaufenen Hunden.
            </p>
            <a
              href={SAVING_PAWS.telefonHref}
              className="inline-block bg-red-700 text-white text-base font-semibold rounded-xl px-5 py-2.5 hover:bg-red-800 transition-colors"
            >
              📞 Notfall-Hotline {SAVING_PAWS.telefon}
            </a>
            <p className="text-xs text-[#4E779F] mt-3">{savingPawsRegionHinweis(region)}</p>
          </section>

          <section aria-labelledby="erste">
            <h2 id="erste" className="text-xl font-bold text-[#1E3249] mb-3">Die ersten Schritte</h2>
            <ol className="space-y-2 bg-white rounded-2xl border border-[#C8D8EC] p-6">
              {ersteSchritte.map((t, i) => (
                <li key={t} className="flex gap-3 text-sm text-[#2E4A6B] leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2E4A6B] text-white text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="sitter">
            <h2 id="sitter" className="text-xl font-bold text-[#1E3249] mb-3">
              Vorsorge, wenn Dein Hund beim Sitter ist
            </h2>
            <p className="text-sm text-[#4E779F] mb-3 leading-relaxed">
              Entläuft ein Hund beim Sitter, ist der Halter nicht in der Nähe. Umso wichtiger sind klare
              Absprachen vor der Betreuung. Das gilt für Halter und Sitter gleichermaßen.
            </p>
            <ul className="space-y-2 bg-white rounded-2xl border border-[#C8D8EC] p-6">
              {beimSitter.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-[#2E4A6B] leading-relaxed">
                  <span className="text-[#2E4A6B] font-bold flex-shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="verein">
            <h2 id="verein" className="text-xl font-bold text-[#1E3249] mb-3">
              So hilft die Hundesuchhilfe Saving Paws
            </h2>
            <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6">
              <p className="text-sm text-[#2E4A6B] mb-3">
                Jeder Fall wird einzeln eingeschätzt. Je nach Situation kommen zum Einsatz:
              </p>
              <ul className="space-y-1.5 mb-4">
                {SAVING_PAWS.leistungen.map((l) => (
                  <li key={l} className="flex gap-2 text-sm text-[#2E4A6B]">
                    <span className="text-[#2E4A6B] font-bold flex-shrink-0">•</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <a href={SAVING_PAWS.telefonHref} className="text-sm font-semibold text-red-800 underline">
                  📞 {SAVING_PAWS.telefon}
                </a>
                <a
                  href={SAVING_PAWS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#2E4A6B] underline"
                >
                  hundesuchhilfe.de →
                </a>
              </div>
            </div>
          </section>

          <p className="text-xs text-[#4E779F]">
            Angaben ohne Gewähr. Weitere Hilfen findest Du unter{' '}
            <Link href={`/${region}/anlaufstellen`} className="underline">
              Anlaufstellen
            </Link>
            . Bei Verletzung oder akuter Gefahr für das Tier: Tierarzt oder tierärztlicher Notdienst.
          </p>
        </div>
      </div>
    </main>
  )
}
