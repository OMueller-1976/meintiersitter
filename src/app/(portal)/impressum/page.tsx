

export const metadata = { title: 'Impressum – MeinTiersitter' };

export default function ImpressumPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-[#1E3249] mb-2">Impressum</h1>
          <p className="text-[#4E779F] mb-8">Zuletzt aktualisiert: Mai 2025</p>

          <p className="text-[#4E779F] leading-relaxed mb-6">Angaben gemäß § 5 TMG</p>

          {/* TODO-Box Adresse */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6">
            ⚠️ <strong>Vor Veröffentlichung ausfüllen:</strong> Bitte vollständige Postadresse eintragen.
          </div>

          <p className="text-[#2E4A6B] leading-relaxed">
            OneTitel – Digital &amp; Business Solutions<br />
            Markus Müller<br />
            [ADRESSE BITTE NACHTRAGEN]<br />
            [PLZ ORT BITTE NACHTRAGEN]
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">Kontakt</h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            E-Mail: tiersitter@onetitel.de<br />
            Web: www.meintiersitter.de
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Markus Müller<br />
            (Adresse wie oben)
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">Haftung für Inhalte</h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed mt-4">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
            entfernen.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">Haftung für Links</h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
            entfernen.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">Urheberrecht</h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
            nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </div>
    </main>
  );
}
