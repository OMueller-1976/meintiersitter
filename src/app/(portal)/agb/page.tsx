

export const metadata = { title: 'AGB – MeinTiersitter' };

const paragraphen = [
  {
    titel: '§ 1 Geltungsbereich',
    text: 'Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Plattform MeinTiersitter (www.meintiersitter.de), betrieben von Markus Müller, OneTitel – Digital & Business Solutions.',
  },
  {
    titel: '§ 2 Leistungsbeschreibung',
    text: 'MeinTiersitter ist eine Community-Plattform zur Vermittlung privater, ehrenamtlicher Tiersitter im Raum Vulkaneifel / Kreis Daun. Die Plattform dient ausschließlich der Kontaktherstellung zwischen Tierhaltern und Sittern. Eine Vergütung der Sitter erfolgt nicht über die Plattform.',
  },
  {
    titel: '§ 3 Registrierung und Nutzerkonto',
    items: [
      '3.1 Die Nutzung der Kernfunktionen erfordert eine Registrierung mit einer gültigen E-Mail-Adresse.',
      '3.2 Tierhalter zahlen einen monatlichen Unkostenbeitrag von € 1,90 zur Deckung der Betriebskosten.',
      '3.3 Sitter-Accounts sind dauerhaft kostenlos.',
      '3.4 Falsche Angaben bei der Registrierung berechtigen zur sofortigen Sperrung des Kontos.',
    ],
  },
  {
    titel: '§ 4 Nutzerpflichten',
    items: [
      '4.1 Nutzer verpflichten sich zur wahrheitsgemäßen Angabe aller Daten.',
      '4.2 Die Weitergabe von Zugangsdaten an Dritte ist untersagt.',
      '4.3 Nutzer sind für die von ihnen eingestellten Inhalte (Tierprofile, Fotos, Nachrichten) selbst verantwortlich.',
      '4.4 Kommerzielle Nutzung der Plattform ist ohne ausdrückliche Genehmigung nicht gestattet.',
    ],
  },
  {
    titel: '§ 5 Haftungsausschluss',
    items: [
      '5.1 MeinTiersitter vermittelt ausschließlich den Kontakt zwischen Tierhaltern und Sittern. Für die tatsächliche Durchführung der Betreuung und etwaige Schäden übernimmt der Betreiber keine Haftung.',
      '5.2 Nutzer handeln bei der Betreuung auf eigene Verantwortung. Es wird empfohlen, vor dem ersten Match ein persönliches Kennenlernen durchzuführen.',
    ],
  },
  {
    titel: '§ 6 Bewertungssystem',
    items: [
      '6.1 Bewertungen sind nur nach einem abgeschlossenen Match möglich.',
      '6.2 Beleidigende oder unwahre Bewertungen werden ohne Vorankündigung entfernt.',
      '6.3 Ein Anspruch auf Entfernung einer Bewertung besteht nur bei nachgewiesenem Verstoß gegen diese AGB.',
    ],
  },
  {
    titel: '§ 7 Kündigung',
    items: [
      '7.1 Tierhalter-Abonnements können monatlich zum Monatsende gekündigt werden.',
      '7.2 Die Kündigung erfolgt per E-Mail an: tiersitter@onetitel.de',
      '7.3 Bei Kündigung werden alle persönlichen Daten nach 30 Tagen gelöscht.',
    ],
  },
  {
    titel: '§ 8 Änderungen der AGB',
    text: 'Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Nutzer werden per E-Mail über Änderungen informiert. Bei wesentlichen Änderungen gilt das Recht zur außerordentlichen Kündigung.',
  },
  {
    titel: '§ 9 Anwendbares Recht',
    text: 'Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Betreibers.',
  },
  {
    titel: '§ 10 Kontakt',
    text: null,
    kontakt: true,
  },
];

export default function AgbPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-[#1E3249] mb-2">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-[#4E779F] mb-8">Zuletzt aktualisiert: Mai 2025</p>

          {paragraphen.map((p, i) => (
            <div key={p.titel}>
              {i > 0 && <div className="border-t border-[#C8D8EC] my-6" />}
              <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">{p.titel}</h2>

              {p.kontakt ? (
                <p className="text-[#2E4A6B] leading-relaxed">
                  OneTitel – Digital &amp; Business Solutions<br />
                  Markus Müller<br />
                  tiersitter@onetitel.de<br />
                  www.meintiersitter.de
                </p>
              ) : p.items ? (
                <ul className="flex flex-col gap-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#2E4A6B] leading-relaxed">
                      <span className="font-bold mt-0.5 flex-shrink-0">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#2E4A6B] leading-relaxed">{p.text}</p>
              )}
            </div>
          ))}
        </div>
    </main>
  );
}
