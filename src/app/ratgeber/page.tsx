import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const kategorien = [
  {
    icon: '🥾',
    iconBg: 'bg-green-100',
    iconColor: 'text-[#2D6A4F]',
    title: 'Wandern & Gassi',
    desc: 'Die schönsten Routen in der Vulkaneifel – von der kurzen Abendrunde bis zur Tageswanderung.',
    badge: '5 Routen',
    badgeColor: 'bg-green-100 text-[#2D6A4F]',
  },
  {
    icon: '🏖',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Bademöglichkeiten',
    desc: 'Wo Hunde planschen dürfen – Seen und Bäche in der Region mit Hundebereich.',
    badge: '3 Spots',
    badgeColor: 'bg-blue-100 text-blue-600',
  },
  {
    icon: '🏨',
    iconBg: 'bg-orange-100',
    iconColor: 'text-[#F4A261]',
    title: 'Hundefreundliche Unterkünfte',
    desc: 'Hotels, Pensionen und Ferienhäuser im Kreis Daun und Umgebung.',
    badge: 'Coming soon',
    badgeColor: 'bg-gray-100 text-gray-400',
  },
  {
    icon: '🍖',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    title: 'Ernährung & Gesundheit',
    desc: 'Richtige Fütterung, häufige Krankheiten und Erste Hilfe beim Hund.',
    badge: '4 Artikel',
    badgeColor: 'bg-red-100 text-red-500',
  },
  {
    icon: '⚖',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Recht & Regeln',
    desc: 'Leinenpflicht in RLP, Naturschutzgebiete, Maulkorbpflicht – was gilt wo?',
    badge: '3 Artikel',
    badgeColor: 'bg-purple-100 text-purple-600',
  },
  {
    icon: '🗺',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Ausflugsziele',
    desc: 'Burgen, Maare, Cafés – hundefreundliche Ausflugsziele rund um Daun.',
    badge: '6 Tipps',
    badgeColor: 'bg-yellow-100 text-yellow-600',
  },
];

const wanderrouten = [
  {
    icon: '🗻',
    title: 'Dauner Maare Runde',
    subtitle: 'Gemündener, Weinfelder & Schalkenmehrener Maar',
    meta: 'ca. 12 km · mittel · Hund an der Leine',
    detail: 'Start: Parkplatz Gemündener Maar',
  },
  {
    icon: '🌿',
    title: 'HeimatSpur MaareGlück',
    subtitle: 'Offiziell nominiert als Deutschlands schönster Wanderweg 2026',
    meta: 'variabel · leicht bis mittel · hundefreundlich',
    detail: '',
  },
  {
    icon: '🚴',
    title: 'Maare-Mosel-Radweg',
    subtitle: 'Daun → Wittlich · 60 km · flach · Ideal für Hunde',
    meta: 'Ehemalige Bahntrasse, kaum Steigungen',
    detail: '',
  },
];

export default function RatgeberPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero klein ────────────────────────────────────────── */}
        <section className="bg-[#F0FDF4] py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ratgeber für Hundebesitzer in der Vulkaneifel
            </h1>
            <p className="text-gray-600 text-lg">
              Ausflugstipps, Wanderrouten und nützliches Basiswissen für Dich und Deinen Hund.
            </p>
          </div>
        </section>

        {/* ── Kategorie-Grid ────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kategorien.map((k) => (
                <div
                  key={k.title}
                  className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${k.iconBg} ${k.iconColor} flex items-center justify-center text-2xl flex-shrink-0`}
                    >
                      {k.icon}
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${k.badgeColor}`}
                    >
                      {k.badge}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 mb-2">{k.title}</h2>
                  <p className="text-sm text-gray-500 flex-1">{k.desc}</p>
                  <button className="mt-4 text-sm text-[#2D6A4F] font-medium hover:underline text-left">
                    Zur Kategorie →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Highlight-Box Freilinger See ──────────────────────── */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-[#2D6A4F] rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🏖 Tipp: Hundestrand Freilinger See
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Der Freilinger See bei Blankenheim (Ortsteil Freilingen, 53945 Blankenheim) ist
                einer der wenigen Seen in der Region mit offiziellem Hundestrand und Hundewiese.
                Eintritt frei, Kiosk vor Ort. Leinenpflicht gilt auch im Wasserbereich.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <strong>Adresse:</strong> Am Freilinger See, 53945 Blankenheim · ca. 45 Min. von Daun
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <strong>Hinweis:</strong> In den Vulkanmaaren (Rheinland-Pfalz) ist das Baden mit
                Hund nicht gestattet.
              </div>
            </div>
          </div>
        </section>

        {/* ── Wanderrouten ──────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Featured Wanderrouten</h2>
            <p className="text-gray-500 mb-10">
              Die beliebtesten Touren für Hund und Halter in der Vulkaneifel
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wanderrouten.map((r) => (
                <div
                  key={r.title}
                  className="bg-[#F0FDF4] rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                  <p className="text-sm text-[#2D6A4F] font-medium mb-3">{r.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-1">{r.meta}</p>
                  {r.detail && <p className="text-xs text-gray-400">{r.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA-Banner ────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Kennst Du einen Geheimtipp für Hundebesitzer in der Region?
            </h2>
            <p className="text-gray-500 mb-8">
              Teile Dein Wissen mit der Community – wir nehmen jeden Tipp gerne auf.
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-[#2D6A4F] text-white px-8 py-3 rounded-2xl font-medium hover:bg-[#245a42] transition-colors"
            >
              Tipp einreichen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
