'use client';

import { useRouter } from 'next/navigation';

const GRUENDE = [
  {
    icon: '🚫',
    title: 'Keine Werbung',
    desc: 'Tiersitti finanziert sich nicht durch Werbeanzeigen oder gesponserte Einträge.',
  },
  {
    icon: '💸',
    title: 'Keine Gebühren',
    desc: 'Sitter und Tierhalter nutzen die Plattform vollständig kostenlos — ohne Provision oder Abo.',
  },
  {
    icon: '🤝',
    title: 'Ehrenamtlich betrieben',
    desc: 'Tiersitti wird in der Freizeit entwickelt und gepflegt. Keine Agentur, kein Konzern dahinter.',
  },
  {
    icon: '🖥️',
    title: 'Echte Betriebskosten',
    desc: 'Server, Domains, E-Mail-Dienste, Kartendaten — das kostet auch bei einem kleinen Projekt echtes Geld.',
  },
];

function SpendenButton() {
  const link = process.env.NEXT_PUBLIC_STRIPE_DONATION_LINK;
  if (!link || link.includes('PLATZHALTER')) {
    return (
      <div className="inline-block bg-[#EEF2F8] border border-[#C8D8EC] text-[#4E779F] text-sm px-6 py-3 rounded-2xl">
        Spendenfunktion kommt bald 🕐
      </div>
    );
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-[#2D6A4F] text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-[#1E4D38] transition-colors shadow-sm"
    >
      💚 Jetzt unterstützen
    </a>
  );
}

export default function SpendenPage() {
  const router = useRouter();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">

      {/* Zurück */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-[#4E779F] hover:text-[#1E3249] mb-8 transition-colors"
      >
        ← Zurück
      </button>

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">💚</div>
        <h1 className="text-3xl font-bold text-[#1E3249] mb-3">
          Tiersitti unterstützen
        </h1>
        <p className="text-[#4E779F] text-lg leading-relaxed max-w-lg mx-auto">
          Tiersitti ist kostenlos, werbefrei und ehrenamtlich betrieben.
          Mit einer Spende hilfst Du uns, die Plattform am Leben zu erhalten.
        </p>
      </div>

      {/* Warum Spenden */}
      <div className="bg-white border border-[#C8D8EC] rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#1E3249] mb-5">Warum braucht Tiersitti Spenden?</h2>
        <div className="flex flex-col gap-5">
          {GRUENDE.map((g) => (
            <div key={g.title} className="flex gap-4">
              <div className="text-2xl flex-shrink-0 mt-0.5">{g.icon}</div>
              <div>
                <div className="font-semibold text-[#1E3249] text-sm mb-0.5">{g.title}</div>
                <div className="text-sm text-[#4E779F] leading-relaxed">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spenden-CTA */}
      <div className="bg-[#F0F5FB] border border-[#C8D8EC] rounded-2xl p-8 text-center mb-8">
        <p className="text-[#1E3249] font-semibold mb-2">Jeder Beitrag hilft</p>
        <p className="text-sm text-[#4E779F] mb-6 leading-relaxed">
          Schon ein kleiner Betrag deckt einen Teil der Serverkosten und hilft uns,
          Tiersitti langfristig kostenlos und werbefrei anzubieten.
        </p>
        <SpendenButton />
      </div>

      {/* Transparenz-Hinweis */}
      <p className="text-xs text-center text-[#7A9DBF] leading-relaxed">
        Spenden werden ausschließlich für den Betrieb der Plattform verwendet.
        Tiersitti ist kein gemeinnütziger Verein — Spenden sind nicht steuerlich absetzbar.
      </p>

    </main>
  );
}
