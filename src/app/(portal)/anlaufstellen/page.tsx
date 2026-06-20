

export const metadata = { title: 'Tierheime & Anlaufstellen – MeinTiersitter Vulkaneifel' };

export default function AnlaufstellenPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">

        {/* Hero */}
        <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
            <h1 className="text-3xl font-bold mb-3">🏠 Im Ernstfall helfen sie weiter</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              Tierheime, Tierschutzvereine und Anlaufstellen in der Vulkaneifel, Eifel und bis
              Wittlich — für alle Fälle wenn dringende Hilfe gebraucht wird.
            </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

          {/* Notfall-Hinweis */}
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
          </div>

          {/* Abschnitt: Tierheime */}
          <section>
            <h2 className="text-xl font-bold text-[#1E3249] mb-4 flex items-center gap-2">
              <span>🏠</span> Tierheime
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Karte 1 */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏠</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Eifeltierheim Altrich
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#DDEAF4] text-[#2E4A6B] whitespace-nowrap flex-shrink-0">
                    Tierheim
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Altrich, 54516 Wittlich</p>
                  <p>🕐 Mo–Fr 10–14 Uhr, Sa+So 15–17 Uhr</p>
                  <p>🌐 eifeltierheim.de</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Das Eifeltierheim Altrich betreut Fundtiere für die Region Daun, Gerolstein,
                  Prüm und Wittlich. Besuche nur nach vorheriger Terminvergabe (nicht Mo + Mi).
                </p>
                <div className="bg-[#EEF2F8] rounded-xl p-3 text-xs text-[#4E779F]">
                  <p className="font-semibold text-[#2E4A6B] mb-1">Spendenkonto</p>
                  <p>IBAN: DE74 5606 1472 0005 6632 76</p>
                  <p>Vereinigte Volksbank Raiffeisenbank</p>
                </div>
                <a
                  href="https://eifeltierheim.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Zur Website →
                </a>
              </div>
            </div>
          </section>

          {/* Abschnitt: Tierschutzvereine */}
          <section>
            <h2 className="text-xl font-bold text-[#1E3249] mb-4 flex items-center gap-2">
              <span>🤝</span> Tierschutzvereine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Karte 2 */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤝</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Förderverein Eifeltierheim e.V.
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FEF3E2] text-[#E07B30] whitespace-nowrap flex-shrink-0">
                    Verein
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Postfach 13 15, 54503 Wittlich</p>
                  <p>✉️ info@foerderverein-eifeltierheim.de</p>
                  <p>🌐 foerderverein-eifeltierheim.de</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Gegründet 2005, Region Wittlich–Daun. Gemeinnützig anerkannt (Amtsgericht
                  Wittlich, VR 11216). Schwerpunkt: Kastration herrenloser Katzen, Tierschutz
                  Vulkaneifel.
                </p>
                <a
                  href="https://www.foerderverein-eifeltierheim.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Zur Website →
                </a>
              </div>

              {/* Karte 3 */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍽</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Tierteller Eifel e.V.
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FEF3E2] text-[#E07B30] whitespace-nowrap flex-shrink-0">
                    Verein
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Region Gerolstein / Wittlich</p>
                  <p>🌐 tiertellereifel.jimdofree.com</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Gemeinnütziger Tierschutzverein, vom Finanzamt Wittlich anerkannt. Aktiv mit
                  Spendenständen in der Region, u.a. vor dem Fressnapf in Gerolstein. Engagement
                  für Tiere in Not.
                </p>
                <a
                  href="https://tiertellereifel.jimdofree.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Zur Website →
                </a>
              </div>

              {/* Karte 4 */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐱</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Katzenhilfe Südeifel e.V.
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FEF3E2] text-[#E07B30] whitespace-nowrap flex-shrink-0">
                    Verein
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Region Südeifel</p>
                  <p>🌐 katzenhilfe-suedeifel.de</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Unterbringung, Versorgung und Vermittlung notleidender, wildlebender und
                  herrenloser Katzen in der Südeifel. Kastrationsprogramm zur Reduzierung der
                  Katzenpopulation.
                </p>
                <a
                  href="https://www.katzenhilfe-suedeifel.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Zur Website →
                </a>
              </div>
            </div>
          </section>

          {/* Notfall-Kontakte */}
          <section className="bg-[#EEF2F8] rounded-2xl p-6 w-full">
            <h2 className="text-xl font-bold text-[#1E3249] mb-4">☎ Wichtige Rufnummern</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Tierärzte Kelberg GmbH', tel: '02692 - 229' },
                { label: 'Tierarzt Knut, Wittlich', tel: '06571 - 96230' },
                { label: 'Tierarzt Tietz, Wittlich', tel: '06571 - 6146' },
                { label: 'Tierklinik Longuich', tel: '24h Notdienst (Suchlink)' },
                { label: 'Polizei (Fundtier Daun/Gerolstein)', tel: '110' },
                { label: 'Wildtierauffangstation Wiltingen', tel: '06581 - 9960010' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#C8D8EC]"
                >
                  <span className="text-sm text-[#2E4A6B] font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-[#1E3249] ml-3 whitespace-nowrap">
                    {item.tel}
                  </span>
                </div>
              ))}
            </div>
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

          {/* Abschnitt: Futterstationen */}
          <section id="futterstationen" className="scroll-mt-6">
            <h2 className="text-2xl font-semibold text-[#1E3249] mb-4 flex items-center gap-2">
              <span>🍖</span> Futterstationen &amp; Tiertafeln
            </h2>

            {/* Intro */}
            <div className="bg-[#EEF2F8] rounded-2xl p-6 mb-6">
              <p className="text-[#2E4A6B] leading-relaxed">
                In der Eifel können Sie Tierfutter direkt an lokale Tiertafeln und
                Tierschutzvereine spenden. Diese geben das Futter an bedürftige Tierhalter
                weiter oder versorgen freilebende Streunerkatzen. Futterspenden werden als
                Sachspende entgegengenommen.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <p className="text-amber-800 text-sm leading-relaxed">
                  💡 <strong>Tipp:</strong> In vielen Eifeler Supermärkten und Fressnapf-Filialen
                  stehen dauerhaft Spendenboxen bereit, in die Sie gekauftes Futter direkt
                  einwerfen können.
                </p>
              </div>
            </div>

            {/* Karten-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              {/* Karte 1: Tierteller Eifel */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍽</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Tierteller Eifel e.V.
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#EAF3DE] text-[#3B6D11] whitespace-nowrap flex-shrink-0">
                    Tiertafel
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Bahnhofstraße 28, 54584 Jünkerath</p>
                  <p>🕐 Jeden 2. und 4. Donnerstag im Monat, 14:00–16:00 Uhr</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Diese Tiertafel hilft einkommensschwachen Tierhaltern in der Region Eifel.
                  Futter- und Sachspenden jederzeit willkommen. Außerdem Ausgabestelle:
                  Kyllstraße 13, 54611 Hallschlag — jeden 2. Donnerstag 12:00–16:00 Uhr.
                </p>
                <a
                  href="https://tiertellereifel.jimdofree.com/spenden/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Zur Website →
                </a>
              </div>

              {/* Karte 2: Pfotenherz */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐾</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Pfotenherz
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#EAF3DE] text-[#3B6D11] whitespace-nowrap flex-shrink-0">
                    Tiertafel
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Bausendorf, Vulkaneifel</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Hilft Tierhaltern in akuten finanziellen Notlagen in der Vulkaneifel.
                  Sachspenden können oft direkt nach Absprache in eine Spendenbox vor Ort
                  gegeben werden.
                </p>
                <p className="text-xs text-[#6B7280] italic">
                  Bitte vorab Kontakt aufnehmen für aktuelle Abgabemöglichkeiten.
                </p>
              </div>

              {/* Karte 3: Wir helfen Boogie */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐕</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Wir helfen Boogie e.V.
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#EAF3DE] text-[#3B6D11] whitespace-nowrap flex-shrink-0">
                    Tierschutz &amp; Tafel
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Bettenfeld, Vulkaneifel</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Engagiert sich in der Vulkaneifel für Tierschutz und Tiertafel-Ausgaben.
                  Der Verein freut sich besonders über Geld- oder Sachspenden — auch für
                  ihren Transporterunterhalt.
                </p>
              </div>

              {/* Karte 4: Eifeltierheim Altrich */}
              <div className="bg-white rounded-2xl border border-[#C8D8EC] p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏠</span>
                    <h3 className="font-bold text-[#1E3249] text-base leading-tight">
                      Eifeltierheim Altrich
                    </h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#DDEAF4] text-[#2E4A6B] whitespace-nowrap flex-shrink-0">
                    Tierheim + Spenden
                  </span>
                </div>
                <div className="text-sm text-[#4E779F] space-y-1">
                  <p>📍 Altrich, 54516 Wittlich</p>
                </div>
                <p className="text-sm text-[#2E4A6B] leading-relaxed">
                  Neben Futter werden hier auch Medikamente und Tierzubehör dringend
                  benötigt. Das Tierheim ist auf Sach- und Geldspenden aus der Bevölkerung
                  angewiesen.
                </p>
                <div className="bg-[#EEF2F8] rounded-xl p-3 text-xs text-[#4E779F]">
                  <p className="font-semibold text-[#2E4A6B] mb-1">Spendenkonto</p>
                  <p>IBAN: DE74 5606 1472 0005 6632 76</p>
                  <p>Vereinigte Volksbank Raiffeisenbank</p>
                </div>
                <a
                  href="https://eifeltierheim.de/unterstuetzung/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-block text-sm font-medium text-white bg-[#2E4A6B] hover:bg-[#3A5A80] rounded-xl px-4 py-2 text-center transition-colors"
                >
                  Spenden-Infos →
                </a>
              </div>
            </div>

            {/* Spendenboxen */}
            <div className="bg-[#EEF2F8] rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-[#1E3249] mb-3">🛒 Spendenboxen im Supermarkt</h3>
              <p className="text-sm text-[#2E4A6B] leading-relaxed mb-3">
                In folgenden Märkten und Filialen stehen dauerhaft Spendenboxen — einfach
                Futter kaufen und direkt einwerfen:
              </p>
              <ul className="space-y-1 mb-4">
                {['EDEKA Filialen in der Region', 'Fressnapf-Filialen (u.a. Gerolstein)', 'Weitere Tierfachgeschäfte in der Eifel'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#2E4A6B]">
                    <span className="text-[#3B6D11] font-bold flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#6B7280]">
                Die Spendenboxen werden von lokalen Tierschutzvereinen regelmäßig geleert
                und das Futter weitergegeben.
              </p>
            </div>

            {/* CTA Futterstationen */}
            <div className="text-center">
              <p className="text-[#4E779F] mb-3 text-sm">Kennen Sie eine weitere Futterstation?</p>
              <a
                href="mailto:kontakt@tiersitti.de?subject=Futterstation%20vorschlagen"
                className="inline-block bg-[#2E4A6B] text-white font-semibold rounded-xl px-6 py-3 hover:bg-[#3A5A80] transition-colors"
              >
                Eintrag vorschlagen →
              </a>
            </div>
          </section>

        </div>
    </main>
  );
}
