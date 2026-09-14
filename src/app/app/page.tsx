import type { Metadata } from 'next'
import InstallGuide from './InstallGuide'

export const metadata: Metadata = {
  title: 'Tiersitti als App installieren',
  description: 'Installiere Tiersitti als App auf Deinem iPhone oder Android-Handy — kostenlos, ohne App Store.',
}

export default function AppInstallPage() {
  return (
    <main className="min-h-screen bg-[#F0F5FB] px-6 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="Tiersitti App-Icon" width={80} height={80} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3249] mb-2">
            Tiersitti als App installieren
          </h1>
          <p className="text-[#4E779F] leading-relaxed max-w-md mx-auto">
            Tiersitti gibt es nicht im App Store — Du installierst es direkt aus dem Browser als
            App auf Deinem Homescreen. Kostenlos, in wenigen Sekunden, mit eigenem Icon und ohne
            Browser-Leiste.
          </p>
        </div>

        <InstallGuide />

        <p className="text-center text-sm text-[#7A9DBF] mt-10">
          <a href="/" className="underline hover:text-[#4E779F]">
            Zurück zur Startseite
          </a>
        </p>
      </div>
    </main>
  )
}
