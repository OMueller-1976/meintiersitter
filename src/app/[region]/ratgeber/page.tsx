import Link from 'next/link';
import { notFound } from 'next/navigation';
import { REGIONS } from '@/lib/regions';
import type { RegionSlug } from '@/lib/regions';
import { REGION_CONTENT } from '@/lib/region-content';

interface Props {
  params: { region: string }
}

export default function RatgeberPage({ params }: Props) {
  const { region } = params;
  if (!(region in REGIONS)) notFound();

  const regionConfig = REGIONS[region as RegionSlug];
  const content = REGION_CONTENT[region] ?? REGION_CONTENT['daun'];

  const kategorien = [
    {
      icon: '🥾',
      iconBg: 'bg-[#EEF2F8]',
      iconColor: 'text-[#2E4A6B]',
      title: 'Wandern & Gassi',
      desc: `Die schönsten Routen in ${regionConfig.name} – von der kurzen Abendrunde bis zur Tageswanderung.`,
      badge: '4 Routen',
      badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
      href: `/${region}/ratgeber/wandern`,
    },
    {
      icon: '🏖',
      iconBg: 'bg-[#EEF2F8]',
      iconColor: 'text-[#2E4A6B]',
      title: 'Bademöglichkeiten',
      desc: 'Wo Hunde planschen dürfen – Seen und Bäche in der Region mit Hundebereich.',
      badge: '3 Spots',
      badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
      href: `/${region}/ratgeber/hundestrand`,
    },
    {
      icon: '🏨',
      iconBg: 'bg-orange-100',
      iconColor: 'text-[#F4A261]',
      title: 'Hundefreundliche Unterkünfte',
      desc: `Hotels, Pensionen und Ferienhäuser in ${regionConfig.name} und Umgebung.`,
      badge: '3 Tipps',
      badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
      href: `/${region}/ratgeber/unterkuenfte`,
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
      desc: `Burgen, Sehenswürdigkeiten, Cafés – hundefreundliche Ausflugsziele in ${regionConfig.kurzname}.`,
      badge: '6 Tipps',
      badgeColor: 'bg-[#DDEAF4] text-[#2E4A6B]',
      href: null,
    },
  ];

  const wanderrouten = content.wanderrouten.slice(0, 3).map((r) => ({
    icon: '🥾',
    title: r.titel,
    subtitle: [r.laenge, r.schwierigkeit].filter(Boolean).join(' · '),
    meta: r.dauer ?? '',
    detail: r.startpunkt ?? '',
  }));

  return (
    <main>
        {/* ── Hero klein ────────────────────────────────────────── */}
        <section className="bg-[#EEF2F8] py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3249] mb-4">
              Ratgeber für Hundebesitzer in {regionConfig.name}
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

        {/* ── Highlight-Box Hundestrand ──────────────────────── */}
        <section className="py-16 px-4 bg-[#EEF2F8]">
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-[#2E4A6B] rounded-2xl p-8 bg-[#EEF2F8]">
              <h2 className="text-xl font-bold text-[#1E3249] mb-4">
                🐕 Special Hunde: {content.hundestrand.name}
              </h2>
              <p className="text-[#1E3249] mb-4 leading-relaxed">
                {content.hundestrand.beschreibung}
              </p>
              {content.hundestrand.adresse && (
                <p className="text-[#4E779F] text-sm mb-4">
                  <strong>Adresse:</strong> {content.hundestrand.adresse}
                  {content.hundestrand.entfernung && ` · ${content.hundestrand.entfernung}`}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Wanderrouten ──────────────────────────────────────── */}
        <section className="py-16 px-4 bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1E3249] mb-3">Featured Wanderrouten</h2>
            <p className="text-[#4E779F] mb-10">
              Die beliebtesten Touren für Hund und Halter in {regionConfig.name}
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
  );
}
