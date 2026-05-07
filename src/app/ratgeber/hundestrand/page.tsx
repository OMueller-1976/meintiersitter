import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = { title: 'Hundestrand & Baden – MeinTiersitter Ratgeber' };

const weitereSpots = [
  {
    name: 'Pulvermaar Gillenfeld',
    text: 'Kein offizieller Hundestrand, aber: An vielen kleinen Buchten am Rundweg können Hunde ins Wasser. Tiefster See der Vulkaneifel (72 m).',
    hinweis: '⚠️ Naturfreibad: Hunde nicht erlaubt im Freibad-Bereich.',
    icon: '🌊',
  },
  {
    name: 'Kronenburger See (NRW)',
    text: 'Auf der NRW-Seite der Vulkaneifel. Hunde nur in nicht gekennzeichneten Zonen erlaubt.',
    hinweis: null,
    icon: '🏞',
  },
  {
    name: 'Kyll bei Jünkerath',
    text: 'Der Fluss bietet tolle Badestellen für Hunde. Naturbelassen, kein Freibad.',
    hinweis: null,
    icon: '🌿',
  },
];

const freilingerDetails = [
  { icon: '📍', text: 'Am Freilinger See, 53945 Blankenheim/Freilingen' },
  { icon: '🐕', text: 'Offizieller Hundestrand + Hundewiese seit 2021' },
  { icon: '🏊', text: 'Separater Badebereich mit Bojenkette' },
  { icon: '🍦', text: 'Kiosk mit Imbiss vor Ort' },
  { icon: '🅿️', text: 'Parkplatz fußläufig' },
  { icon: '⚠️', text: 'Leinenpflicht auch im Wasserbereich' },
];

export default function HundestrandPage() {
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
              🏖 Bademöglichkeiten für Hunde in der Eifelregion
            </h1>
            <p className="text-[#A8C0DC] text-lg">
              Seen, Flüsse und offizielle Hundestrände in der Vulkaneifel und Umgebung
            </p>
          </div>
        </div>

        <div className="bg-[#F1F5F9]">
          <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

            {/* Highlight-Card Freilinger See */}
            <div className="bg-[#2E4A6B] rounded-2xl p-8 text-white">
              <div className="inline-flex items-center gap-2 bg-[#F4A261] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ⭐ Der einzige offizielle Hundestrand in der Region
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Freilinger See</h2>
              <p className="text-[#A8C0DC] mb-6">Blankenheim · ca. 45 Min. von Daun</p>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {freilingerDetails.map((d) => (
                  <div key={d.text} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0">{d.icon}</span>
                    <span className="text-[#D4E3F0]">{d.text}</span>
                  </div>
                ))}
              </div>

              {/* Anfahrt */}
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#A8C0DC] uppercase tracking-wide mb-2">
                  Anfahrt ab Daun
                </p>
                <p className="text-sm text-[#D4E3F0] leading-relaxed">
                  B257 Richtung Adenau, dann B258 nach Blankenheim. Ab Blankenheim der
                  Beschilderung über Reetz nach Freilingen folgen.
                </p>
              </div>
            </div>

            {/* Weitere Badestellen */}
            <div>
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">Weitere Badestellen</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {weitereSpots.map((s) => (
                  <div
                    key={s.name}
                    className="bg-white rounded-2xl border border-[#C8D8EC] p-5 hover:border-[#2E4A6B] hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-3">{s.icon}</div>
                    <h3 className="font-semibold text-[#1E3249] text-sm mb-2">{s.name}</h3>
                    <p className="text-xs text-[#4E779F] leading-relaxed mb-2">{s.text}</p>
                    {s.hinweis && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        {s.hinweis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wichtiger Hinweis */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Wichtiger Hinweis — Vulkanmaare</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                In den rheinland-pfälzischen Vulkanmaaren (Gemündener Maar, Weinfelder Maar,
                Schalkenmehrener Maar, Pulvermaar) ist das Einbringen von Hunden ins Wasser{' '}
                <strong>generell verboten</strong>. Dies gilt auch außerhalb der Badesaison.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
