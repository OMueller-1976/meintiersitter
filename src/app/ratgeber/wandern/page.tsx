import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Wandern mit Hund – MeinTiersitter Ratgeber' };

const routen = [
  {
    titel: 'Dauner Maare Runde',
    badge: { label: 'Beliebt', cls: 'bg-[#FEF3E2] text-[#E07B30]' },
    emoji: '🌊',
    pills: [
      { icon: '📏', text: 'ca. 12 km' },
      { icon: '⏱', text: '3–4 Stunden' },
      { icon: '💪', text: 'Mittel' },
      { icon: '🐕', text: 'Hund an der Leine' },
    ],
    beschreibung:
      'Die klassische Runde durch die drei Dauner Maare — Gemündener, Weinfelder und Schalkenmehrener Maar. Start am Parkplatz Gemündener Maar. Mit Dronketurm auf dem Mäuseberg (560 m) und fantastischem Ausblick über die Vulkaneifel. Einkehrmöglichkeit in Schalkenmehren.',
    hinweis: {
      typ: 'amber',
      text: '⚠️ Naturschutzgebiet: Hunde müssen an der Leine bleiben und die Wege dürfen nicht verlassen werden.',
    },
    start: 'Parkplatz Gemündener Maar, Schalkenmehren',
  },
  {
    titel: 'HeimatSpur MaareGlück',
    badge: { label: 'Nominiert 2026', cls: 'bg-[#DDEAF4] text-[#2E4A6B]' },
    emoji: '🏆',
    pills: [
      { icon: '📏', text: 'variabel 8–15 km' },
      { icon: '⏱', text: '2–5 Stunden' },
      { icon: '💪', text: 'Leicht bis Mittel' },
      { icon: '🐕', text: 'Hundefreundlich' },
    ],
    beschreibung:
      'Nominiert für Deutschlands schönsten Wanderweg 2026. Führt durch die typische Vulkaneifellandschaft mit Maaren, Mühlen und Wacholderheiden. 43 HeimatSpuren stehen zur Auswahl — von 2 bis 29 Kilometer.',
    hinweis: {
      typ: 'info',
      text: 'Alle 43 Routen auf gesundland-vulkaneifel.de',
    },
    start: null,
  },
  {
    titel: 'Maare-Mosel-Radweg',
    badge: { label: 'Familienfreundlich', cls: 'bg-[#E0F2F1] text-[#2E7D6E]' },
    emoji: '🚴',
    pills: [
      { icon: '📏', text: '60 km (Daun → Wittlich)' },
      { icon: '⏱', text: 'Ganztag' },
      { icon: '💪', text: 'Leicht (kaum Steigungen)' },
      { icon: '🐕', text: 'Ideal für Hunde' },
    ],
    beschreibung:
      'Auf einer ehemaligen Bahntrasse von Daun nach Wittlich — fast keine Höhenunterschiede. Ideal für Radfahrer mit Hund. Viadukte, Tunnel und idyllische Waldabschnitte. Auch als Teilstrecke perfekt.',
    hinweis: null,
    start: 'Daun Bahnhof (ehemaliger Haltepunkt)',
  },
  {
    titel: 'Eifelsteig Etappe 11',
    badge: { label: 'Prämiert', cls: 'bg-[#EDE8F5] text-[#5B4A8A]' },
    emoji: '⭐',
    pills: [
      { icon: '📏', text: 'ca. 18 km' },
      { icon: '⏱', text: '5–6 Stunden' },
      { icon: '💪', text: 'Anspruchsvoll' },
      { icon: '🐕', text: 'Leinenpflicht teilweise' },
    ],
    beschreibung:
      'Daun → Manderscheid: Einer der schönsten Abschnitte des Eifelsteigs. Vorbei an Vulkankratern, durch Flusstäler, mit Blick auf die Burgruinen Manderscheid. Treppen sollten für den Hund kein Problem sein.',
    hinweis: null,
    start: 'Daun Stadtmitte (Eifelsteig-Markierung)',
  },
];

const tipps = [
  'In den Vulkanmaaren (RLP) ist das Baden mit Hunden verboten',
  'Naturschutzgebiete: immer Leine anlegen',
  'Wasser für den Hund mitbringen',
  'Bei Hitze: Asphaltierte Wege können Pfoten verbrennen',
  'Zeckenschutz empfohlen',
];

export default function WandernPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <div className="bg-[#2E4A6B]">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <Link
              href="/ratgeber"
              className="inline-flex items-center gap-1 text-[#A8C0DC] hover:text-white text-sm mb-4 transition-colors"
            >
              ← Ratgeber
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              🥾 Wandern mit Hund in der Vulkaneifel
            </h1>
            <p className="text-[#A8C0DC] text-lg">
              Die schönsten Routen rund um Daun, Manderscheid und die Dauner Maare
            </p>
          </div>
        </div>

        <div className="bg-[#F1F5F9]">
          <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Routen-Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {routen.map((r) => (
                <div
                  key={r.titel}
                  className="bg-white rounded-2xl border border-[#C8D8EC] p-6 hover:border-[#2E4A6B] hover:shadow-md transition-all flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2F8] flex items-center justify-center text-2xl flex-shrink-0">
                      {r.emoji}
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${r.badge.cls}`}>
                      {r.badge.label}
                    </span>
                  </div>

                  <h2 className="font-bold text-[#1E3249] text-lg mb-3">{r.titel}</h2>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {r.pills.map((p) => (
                      <span
                        key={p.text}
                        className="inline-flex items-center gap-1 bg-[#EEF2F8] text-[#2E4A6B] text-xs rounded-full px-3 py-1"
                      >
                        {p.icon} {p.text}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-[#4E779F] leading-relaxed mb-4 flex-1">
                    {r.beschreibung}
                  </p>

                  {/* Hinweis */}
                  {r.hinweis && (
                    <div
                      className={`rounded-xl px-4 py-3 text-xs mb-3 ${
                        r.hinweis.typ === 'amber'
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-[#EEF2F8] border border-[#C8D8EC] text-[#2E4A6B]'
                      }`}
                    >
                      {r.hinweis.text}
                    </div>
                  )}

                  {/* Start */}
                  {r.start && (
                    <p className="text-xs text-[#7A9DBF]">
                      📍 <span className="font-medium">Start:</span> {r.start}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Allgemeine Tipps */}
            <div className="bg-[#EEF2F8] rounded-2xl p-6">
              <h2 className="font-bold text-[#1E3249] text-lg mb-4">
                🐕 Wichtige Hinweise für Hunde in der Vulkaneifel
              </h2>
              <ul className="space-y-2">
                {tipps.map((t) => (
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
      <Footer />
    </>
  );
}
