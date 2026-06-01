

export const metadata = { title: 'Förderer & Sponsoren – MeinTiersitter Vulkaneifel' };

export default function FoerdererPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">

        {/* Hero */}
        <div className="bg-[#2E4A6B] text-white rounded-2xl py-10 px-8 mb-6">
            <h1 className="text-3xl font-bold mb-3">🤝 Förderer & Sponsoren</h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              Diese Unternehmen und Organisationen unterstützen MeinTiersitter und das Tierwohl
              in der Vulkaneifel.
            </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

          {/* Sponsor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Sponsor 1: dschinn */}
            <div className="bg-white border-2 border-[#2E4A6B] rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">✨ Premium-Partner</span>
                <span className="text-xs font-bold bg-[#F4A261] text-white rounded-full px-3 py-1">
                  Premium
                </span>
              </div>
              <div className="h-20 bg-[#EEF2F8] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2E4A6B]">dschinn</span>
              </div>
              <div>
                <p className="font-semibold text-[#1E3249] text-lg">dschinn.online</p>
                <p className="text-sm text-[#4E779F] leading-relaxed mt-2">
                  Digitale Lösungen und Web-Entwicklung aus der Region. dschinn.online
                  unterstützt MeinTiersitter als technischer Partner und fördert digitale
                  Infrastruktur für regionale Community-Projekte.
                </p>
              </div>
              <a
                href="https://www.dschinn.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E4A6B] font-medium text-sm hover:text-[#1E3249] transition-colors mt-auto"
              >
                www.dschinn.online →
              </a>
            </div>

            {/* Sponsor 2: OneTitel */}
            <div className="bg-white border-2 border-[#2E4A6B] rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">✨ Premium-Partner</span>
                <span className="text-xs font-bold bg-[#F4A261] text-white rounded-full px-3 py-1">
                  Premium
                </span>
              </div>
              <div className="h-20 bg-[#EEF2F8] rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#2E4A6B]">OneTitel</span>
              </div>
              <div>
                <p className="font-semibold text-[#1E3249] text-lg">onetitel.de</p>
                <p className="text-sm text-[#4E779F] leading-relaxed mt-2">
                  OneTitel — Digital & Business Solutions. Initiator und technischer Umsetzer
                  von MeinTiersitter. Spezialist für digitale Plattformen, Apps und
                  Business-Lösungen aus der Region.
                </p>
              </div>
              <a
                href="https://www.onetitel.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E4A6B] font-medium text-sm hover:text-[#1E3249] transition-colors mt-auto"
              >
                www.onetitel.de →
              </a>
            </div>
          </div>

          {/* Zitat */}
          <div className="bg-[#EEF2F8] rounded-2xl p-6 relative">
            <span className="text-6xl text-[#C8D8EC] font-serif absolute top-3 left-5 leading-none select-none">
              &ldquo;
            </span>
            <p className="text-[#2E4A6B] text-lg font-medium leading-relaxed text-center px-8 pt-4">
              Gemeinsam für das Tierwohl in der Vulkaneifel — regional verwurzelt, digital vernetzt.
            </p>
          </div>

          {/* Förderer werden */}
          <div className="bg-[#2E4A6B] rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* Links */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">
                  Sie möchten ebenfalls unterstützen? 🌟
                </h2>
                <p className="text-white/80 leading-relaxed mb-5">
                  Werden Sie Förderer von MeinTiersitter und unterstützen Sie aktiv das Tierwohl
                  sowie die Nachbarschaftshilfe in der Vulkaneifel. Als Sponsor profitieren Sie
                  von sichtbarer Präsenz in unserer wachsenden Community.
                </p>
                <ul className="space-y-2 text-white/90 text-sm">
                  {[
                    'Logo + Verlinkung auf dieser Seite',
                    'Erwähnung in der rechten Sidebar (Portal-Startseite)',
                    'Namentliche Nennung in unserem Newsletter (geplant)',
                    '"Offizieller Förderer" Badge',
                    'Unterstützung eines regionalen Herzensprojekts',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-white font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rechts: Preis-Card */}
              <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <p className="text-[#4E779F] text-sm">Jahresbeitrag</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1E3249]">€ 250</span>
                  <span className="text-[#4E779F]">/ Jahr</span>
                </div>
                <p className="text-sm text-[#4E779F]">
                  Einmaliger Jahresbeitrag inkl. aller oben genannten Leistungen. Kündigung
                  jederzeit zum Jahresende.
                </p>
                <a
                  href="mailto:tiersitter@onetitel.de?subject=F%C3%B6rderschaft%20MeinTiersitter&body=Ich%20interessiere%20mich%20f%C3%BCr%20eine%20F%C3%B6rderschaft%20bei%20MeinTiersitter.%20Bitte%20nehmen%20Sie%20Kontakt%20mit%20mir%20auf."
                  className="block text-center text-sm font-semibold bg-[#2E4A6B] text-white rounded-xl py-3 hover:bg-[#3A5A80] transition-colors"
                >
                  Jetzt Förderer werden →
                </a>
                <a
                  href="mailto:tiersitter@onetitel.de"
                  className="block text-center text-sm text-[#4E779F] hover:text-[#2E4A6B] transition-colors"
                >
                  Fragen? tiersitter@onetitel.de
                </a>
              </div>
            </div>
          </div>

        </div>
    </main>
  );
}
