import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const kategorien = [
  {
    icon: '🥾',
    iconBg: 'bg-[#EEF2F8]',
    iconColor: 'text-[#2E4A6B]',
    title: 'Wandern & Gassi',
    desc: 'Die schönsten Routen in der Vulkaneifel – von der kurzen Abendrunde bis zur Tageswanderung.',
    badge: '4 Routen',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: '/ratgeber/wandern',
  },
  {
    icon: '🏖',
    iconBg: 'bg-[#EEF2F8]',
    iconColor: 'text-[#2E4A6B]',
    title: 'Bademöglichkeiten',
    desc: 'Wo Hunde planschen dürfen – Seen und Bäche in der Region mit Hundebereich.',
    badge: '3 Spots',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: '/ratgeber/hundestrand',
  },
  {
    icon: '🏨',
    iconBg: 'bg-orange-100',
    iconColor: 'text-[#F4A261]',
    title: 'Hundefreundliche Unterkünfte',
    desc: 'Hotels, Pensionen und Ferienhäuser im Kreis Daun und Umgebung.',
    badge: '3 Tipps',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: '/ratgeber/unterkuenfte',
  },
  {
    icon: '🍖',
    iconBg: 'bg-[#EEF2F8]',
    iconColor: 'text-[#2E4A6B]',
    title: 'Ernährung & Gesundheit',
    desc: 'Richtige Fütterung, häufige Krankheiten und Erste Hilfe beim Hund.',
    badge: '4 Artikel',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: null,
  },
  {
    icon: '⚖',
    iconBg: 'bg-[#EEF2F8]',
    iconColor: 'text-[#2E4A6B]',
    title: 'Recht & Regeln',
    desc: 'Leinenpflicht in RLP, Naturschutzgebiete, Maulkorbpflicht – was gilt wo?',
    badge: '3 Artikel',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: null,
  },
  {
    icon: '🗺',
    iconBg: 'bg-[#EEF2F8]',
    iconColor: 'text-[#2E4A6B]',
    title: 'Ausflugsziele',
    desc: 'Burgen, Maare, Cafés – hundefreundliche Ausflugsziele rund um Daun.',
    badge: '6 Tipps',
    badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
    href: null,
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
        <section className="bg-[#EEF2F8] py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3249] mb-4">
              Ratgeber für Hundebesitzer in der Vulkaneifel
            </h1>
            <p className="text-[#4E779F] text-lg">
              Ausflugstipps, Wanderrouten und nützliches Basiswissen für Dich und Deinen Hund.
            </p>
          </div>
        </section>

        {/* ── Kategorie-Grid ────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {kategorien.map((k) => (
                <div
                  key={k.title}
                  className="border border-[#C8D8EC] hover:border-[#2E4A6B] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col bg-white"
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
                  <h2 className="font-bold text-[#1E3249] mb-2">{k.title}</h2>
                  <p className="text-sm text-[#4E779F] flex-1">{k.desc}</p>
                  {k.href ? (
                    <Link
                      href={k.href}
                      className="mt-4 text-sm text-[#2E4A6B] font-medium hover:underline text-left"
                    >
                      Zur Kategorie →
                    </Link>
                  ) : (
                    <span className="mt-4 text-sm text-[#C8D8EC] cursor-default">
                      Bald verfügbar
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Highlight-Box Freilinger See ──────────────────────── */}
        <section className="py-16 px-4 bg-[#EEF2F8]">
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-[#2E4A6B] rounded-2xl p-8 bg-[#EEF2F8]">
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">
                🏖 Tipp: Hundestrand Freilinger See
              </h2>
              <p className="text-[#1E3249] mb-4 leading-relaxed">
                Der Freilinger See bei Blankenheim (Ortsteil Freilingen, 53945 Blankenheim) ist
                einer der wenigen Seen in der Region mit offiziellem Hundestrand und Hundewiese.
                Eintritt frei, Kiosk vor Ort. Leinenpflicht gilt auch im Wasserbereich.
              </p>
              <p className="text-[#4E779F] text-sm mb-4">
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
        <section className="py-16 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1E3249] mb-3">Featured Wanderrouten</h2>
            <p className="text-[#4E779F] mb-10">
              Die beliebtesten Touren für Hund und Halter in der Vulkaneifel
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wanderrouten.map((r) => (
                <div
                  key={r.title}
                  className="bg-[#EEF2F8] rounded-2xl p-6 hover:shadow-md transition-shadow border-t-[3px] border-t-[#2E4A6B]"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="font-bold text-[#1E3249] mb-1">{r.title}</h3>
                  <p className="text-sm text-[#2E4A6B] font-medium mb-3">{r.subtitle}</p>
                  <p className="text-sm text-[#4E779F] mb-1">{r.meta}</p>
                  {r.detail && <p className="text-xs text-[#7A9DBF]">{r.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA-Banner ────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-[#2E4A6B]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kennst Du einen Geheimtipp für Hundebesitzer in der Region?
            </h2>
            <p className="text-[#A8C0DC] mb-8">
              Teile Dein Wissen mit der Community – wir nehmen jeden Tipp gerne auf.
            </p>
            <Link
              href="/kontakt"
              className="inline-block bg-[#F4A261] text-white px-8 py-3 rounded-2xl font-medium hover:bg-[#E07B30] transition-colors"
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
