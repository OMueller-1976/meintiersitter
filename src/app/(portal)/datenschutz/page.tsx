

export const metadata = { title: 'Datenschutzerklärung – MeinTiersitter' };

export default function DatenschutzPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-[#1E3249] mb-2">Datenschutzerklärung</h1>
          <p className="text-[#4E779F] mb-8">Zuletzt aktualisiert: Mai 2025</p>

          {/* 1 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            1. Datenschutz auf einen Blick
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mb-2">Allgemeine Hinweise</p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mt-4 mb-2">
            Datenerfassung auf dieser Website
          </p>
          <p className="text-[#2E4A6B] leading-relaxed">
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber: Markus
            Müller, OneTitel – Digital &amp; Business Solutions, kontakt@tiersitti.de
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 2 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">2. Hosting</h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Diese Website wird bei Vercel Inc., 340 Pine Street, Suite 700, San Francisco,
            California 94104, USA gehostet. Details entnehmen Sie der Datenschutzerklärung von
            Vercel:{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#1E3249]"
            >
              https://vercel.com/legal/privacy-policy
            </a>
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 3 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            3. Allgemeine Hinweise und Pflichtinformationen
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mb-2">Datenschutz</p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir
            behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
            Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mt-4 mb-2">
            Verantwortliche Stelle
          </p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Markus Müller<br />
            OneTitel – Digital &amp; Business Solutions<br />
            E-Mail: kontakt@tiersitti.de
          </p>
          <p className="text-[#2E4A6B] leading-relaxed mt-4">
            Sie haben das Recht, jederzeit Auskunft über Herkunft, Empfänger und Zweck Ihrer
            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
            Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
            Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
            widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung
            der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 4 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            4. Datenerfassung auf dieser Website
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mb-2">
            Registrierung auf dieser Website
          </p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen.
            Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen
            Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung
            abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir
            die Registrierung ablehnen.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed mt-4">
            Bei wichtigen Änderungen, etwa beim Angebotsumfang oder bei technisch notwendigen
            Änderungen, nutzen wir die bei der Registrierung angegebene E-Mail-Adresse, um Sie auf
            diesem Wege zu informieren.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed mt-4">
            Rechtsgrundlage für die Verarbeitung der bei der Registrierung eingegebenen Daten ist
            Art. 6 Abs. 1 lit. b DSGVO.
          </p>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mt-4 mb-2">
            Datenbankhosting — Supabase
          </p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Nutzerdaten (Profil, Tierprofile, Nachrichten) werden bei Supabase Inc. gespeichert.
            Supabase nutzt EU-Server (Frankfurt). Weitere Informationen:{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#1E3249]"
            >
              https://supabase.com/privacy
            </a>
          </p>
          <p className="text-[#2E4A6B] leading-relaxed font-medium mt-4 mb-2">
            Zahlungsabwicklung — Stripe
          </p>
          <p className="text-[#2E4A6B] leading-relaxed">
            Zahlungen werden über Stripe Payments Europe Ltd. abgewickelt. Stripe ist nach
            EU-Datenschutzrecht zertifiziert. Weitere Informationen:{' '}
            <a
              href="https://stripe.com/de/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#1E3249]"
            >
              https://stripe.com/de/privacy
            </a>
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 5 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">5. Ihre Rechte</h2>
          <p className="text-[#2E4A6B] leading-relaxed mb-3">
            Sie haben folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
          </p>
          <ul className="text-[#2E4A6B] leading-relaxed flex flex-col gap-1.5 ml-4">
            {[
              'Recht auf Auskunft (Art. 15 DSGVO)',
              'Recht auf Berichtigung (Art. 16 DSGVO)',
              'Recht auf Löschung (Art. 17 DSGVO)',
              'Recht auf Einschränkung (Art. 18 DSGVO)',
              'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)',
              'Widerspruchsrecht (Art. 21 DSGVO)',
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="text-[#2E4A6B] font-bold mt-0.5">–</span>
                {r}
              </li>
            ))}
          </ul>
          <p className="text-[#2E4A6B] leading-relaxed mt-4">
            Zur Ausübung Ihrer Rechte wenden Sie sich an: kontakt@tiersitti.de
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 6 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            6. Beschwerderecht
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren.
            Zuständig ist der Landesbeauftragte für Datenschutz und Informationsfreiheit
            Rheinland-Pfalz.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 7 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            7. Einwilligung (Cookie-Banner)
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Beim ersten Besuch fragen wir Sie über einen Hinweis („Cookie-Banner“), ob Sie der Messung der Nutzung
            zustimmen. Notwendige Funktionen (z. B. Anmeldung) funktionieren auch ohne Einwilligung. Google-Dienste
            werden erst nach Ihrer Zustimmung geladen (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Ihre Wahl wird
            lokal in Ihrem Browser gespeichert. Sie können sie jederzeit über „Cookie-Einstellungen“ im Footer
            ändern oder widerrufen; der Widerruf gilt für die Zukunft.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 8 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            8. Google Tag Manager
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Mit Ihrer Einwilligung setzen wir den Google Tag Manager der Google Ireland Limited, Gordon House, Barrow
            Street, Dublin 4, Irland, ein. Der Tag Manager verwaltet Skripte (Tags) für Reichweitenmessung. Er selbst
            erstellt keine Nutzerprofile, kann aber beim Laden Ihre IP-Adresse und Geräteinformationen an Google
            übertragen und löst die in ihm hinterlegten Dienste aus.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 9 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            9. Google Analytics
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Sofern über den Tag Manager eingerichtet, nutzen wir Google Analytics (Google Ireland Limited) zur
            statistischen Auswertung der Nutzung unserer Seiten, z. B. aufgerufene Seiten, Verweildauer, Herkunftsregion
            und Gerätetyp. Dabei können Cookies und ähnliche Technologien eingesetzt werden. Die Daten werden pseudonym
            verarbeitet. Eine Übermittlung an Google LLC in die USA ist möglich; Google ist unter dem EU-US Data Privacy
            Framework zertifiziert. Rechtsgrundlage ist Ihre Einwilligung. Die Speicherdauer richtet sich nach den in
            Google Analytics eingestellten Aufbewahrungsfristen. Weitere Informationen:
            policies.google.com/privacy. Eine Opt-out-Möglichkeit ist der Widerruf der Einwilligung im Footer.
          </p>

          <div className="border-t border-[#C8D8EC] my-6" />

          {/* 10 */}
          <h2 className="text-lg font-semibold text-[#2E4A6B] mt-8 mb-3">
            10. Weitere Google-Dienste
          </h2>
          <p className="text-[#2E4A6B] leading-relaxed">
            Weitere Google-Dienste (z. B. Google Ads, Conversion-Tracking, Google Search Console) setzen wir nur ein,
            soweit sie hier aufgeführt sind oder Sie ihnen zugestimmt haben. Aktuell sind über den Tag Manager nur die
            oben genannten Dienste vorgesehen. Dieser Abschnitt wird bei Änderungen angepasst.
          </p>
        </div>
    </main>
  );
}
