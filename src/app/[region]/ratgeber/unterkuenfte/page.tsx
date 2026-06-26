

export const metadata = { title: 'Hundefreundliche Unterkünfte – MeinTiersitter Ratgeber' };

const weitereKacheln = [
  {
    icon: '🏡',
    titel: 'Ferienhäuser Vulkaneifel',
    text: 'Zahlreiche Ferienwohnungen und -häuser in der Region akzeptieren Hunde. Viele mit eingezäuntem Garten.',
    tipp: 'Nach „eingezäuntes Grundstück" filtern auf Buchungsplattformen',
  },
  {
    icon: '💧',
    titel: 'Urlaub mit Hund · Bad Bertrich',
    text: 'Ausgangspunkt für Deutschlands schönsten Wanderweg 2023 — die HeimatSpur Wasserfall-Erlebnisroute.',
    tipp: null,
  },
  {
    icon: '🌲',
    titel: 'Nähe Rursee / Nationalpark',
    text: 'Im Nationalpark Eifel nahe Heimbach: Viele Unterkünfte direkt am See. Bootsverleih, Wanderwege, hundefreundlich.',
    tipp: null,
  },
];

const buchungsTipps = [
  '„Hunde willkommen" explizit beim Anbieter prüfen',
  'Eingezäunter Garten ist ideal für mehr Freiheit',
  'Leinenpflicht im Nationalpark und Naturschutzgebieten beachten',
  'Zeckenmittel und Wundversorgung einpacken',
  'Tierarzt-Notfallnummer der Region vorab speichern',
];

const hundeparadiesFeatures = [
  'Eingezäunte Gärten je Ferienhaus',
  'Große Hundewiese + Waldstück direkt am Gelände',
  'Agilityplatz für aktive Hunde',
  'Bis zu 10 Hunde gleichzeitig möglich',
  'Stauseen zum Baden in der Nähe (Stausee Udersdorf)',
];

export default function UnterkuenftePage() {
  return (
    <main className="min-h-screen">
        {/* Hero */}
        <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🏨 Hundefreundliche Unterkünfte in der Vulkaneifel
            </h1>
            <p className="text-[#A8C0DC] text-lg">
              Übernachten mit Vierbeiner — diese Unterkünfte heißen Euren Hund herzlich willkommen.
            </p>
        </div>

        <div className="bg-[#F1F5F9]">
          <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

            {/* Featured: Hundeparadies Eifel */}
            <div className="bg-white rounded-2xl border-2 border-[#2E4A6B] p-7">
              <div className="inline-flex items-center gap-2 bg-[#DDEAF4] text-[#2E4A6B] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ⭐ Empfehlung der Redaktion
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3249]">Hundeparadies Eifel</h2>
                  <p className="text-[#4E779F] text-sm mt-0.5">Jünkerath · Vulkaneifel</p>
                  <p className="text-sm text-[#4E779F] mt-1">
                    Speziell für Hundebesitzer konzipiert — hier steht der Vierbeiner im Mittelpunkt.
                  </p>
                </div>
                <a
                  href="https://www.hundeparadies-eifel.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 bg-[#2E4A6B] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#3A5A80] transition-colors"
                >
                  Website →
                </a>
              </div>
              <ul className="space-y-2">
                {hundeparadiesFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#4E779F]">
                    <span className="text-[#2E4A6B] font-bold flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 weitere Kacheln */}
            <div>
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">Weitere Möglichkeiten</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {weitereKacheln.map((k) => (
                  <div
                    key={k.titel}
                    className="bg-white rounded-2xl border border-[#C8D8EC] p-5 hover:border-[#2E4A6B] hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="text-3xl mb-3">{k.icon}</div>
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

            {/* Tipps-Box */}
            <div className="bg-[#EEF2F8] rounded-2xl p-6">
              <h2 className="font-bold text-[#1E3249] text-lg mb-4">
                🔍 Worauf beim Buchen achten?
              </h2>
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
    </main>
  );
}
