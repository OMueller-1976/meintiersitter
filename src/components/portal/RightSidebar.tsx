'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InfoKachel {
  kategorie: string;
  emoji: string;
  titel: string;
  text: string;
  link: string;
  link_label: string;
  bg: string;
}

const INFO_KACHELN: InfoKachel[] = [
  {
    kategorie: 'Wandertipp',
    emoji: '🥾',
    titel: 'Dauner Maare Runde',
    text: 'Ca. 12 km rund um Gemündener, Weinfelder und Schalkenmehrener Maar. Hund an der Leine.',
    link: '/ratgeber',
    link_label: 'Zur Route →',
    bg: 'bg-[#EEF2F8]',
  },
  {
    kategorie: 'Hundestrand',
    emoji: '🏖',
    titel: 'Freilinger See',
    text: 'Offizieller Hundestrand bei Blankenheim — Liegewiese, Badebereich, Kiosk. Leinenpflicht.',
    link: '/ratgeber',
    link_label: 'Mehr erfahren →',
    bg: 'bg-[#E8F0F8]',
  },
  {
    kategorie: 'Ratgeber',
    emoji: '📖',
    titel: 'HeimatSpur MaareGlück',
    text: 'Nominiert für Deutschlands schönsten Wanderweg 2026. Ideal für Hundebesitzer.',
    link: '/ratgeber',
    link_label: 'Zur Route →',
    bg: 'bg-[#EEF2F8]',
  },
  {
    kategorie: 'Marktplatz',
    emoji: '🏪',
    titel: 'Tiergeschäfte im Kreis Daun',
    text: 'Finde Tierärzte, Hundeschulen und Tiershops direkt in Deiner Ortschaft.',
    link: '/marktplatz',
    link_label: 'Zum Marktplatz →',
    bg: 'bg-[#FEF3E2]',
  },
  {
    kategorie: 'Tipp',
    emoji: '💡',
    titel: 'Erstes Kennenlernen',
    text: 'Vor dem ersten Match empfehlen wir ein kurzes Kennenlernen — für Mensch und Tier.',
    link: '/ratgeber',
    link_label: 'Tipps lesen →',
    bg: 'bg-[#E8F0F8]',
  },
];

const SCHNELLZUGRIFF = [
  { emoji: '🗺', label: 'Wanderrouten', href: '/ratgeber/wandern' },
  { emoji: '🏖', label: 'Hundestrand', href: '/ratgeber/hundestrand' },
  { emoji: '🏪', label: 'Marktplatz', href: '/marktplatz' },
  { emoji: '📋', label: 'Alle Gesuche', href: '/pinnwand' },
];

export default function RightSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % INFO_KACHELN.length);
        setVisible(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = INFO_KACHELN[activeIndex];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width-right)',
        background: 'white',
        borderLeft: '1px solid #E2E8F0',
        overflowY: 'auto',
        flexShrink: 0,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Info-Kachel mit Auto-Rotate */}
      <div>
        <p className="text-xs font-semibold text-[#1E3249] mb-2 uppercase tracking-wide">
          Tipps &amp; Entdecken
        </p>

        {/* Aktuelle Kachel */}
        <div
          className={`${current.bg} rounded-xl p-4 border border-[#C8D8EC] min-h-[140px] transition-opacity duration-300`}
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-medium text-[#4E779F] bg-white/70 px-2 py-0.5 rounded-full border border-[#C8D8EC]">
              {current.kategorie}
            </span>
          </div>
          <div className="text-2xl mb-1">{current.emoji}</div>
          <div className="font-semibold text-[#1E3249] text-sm mb-1">{current.titel}</div>
          <p className="text-xs text-[#4E779F] leading-relaxed mb-2 line-clamp-3">{current.text}</p>
          <Link href={current.link} className="text-xs text-[#2E4A6B] font-medium hover:underline">
            {current.link_label}
          </Link>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {INFO_KACHELN.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setVisible(true); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-[#2E4A6B]' : 'bg-[#C8D8EC]'}`}
              aria-label={`Kachel ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#EEF2F8]" />

      {/* Schnellzugriff */}
      <div>
        <p className="text-xs text-[#4E779F] uppercase tracking-wide mb-2 font-semibold">
          Schnellzugriff
        </p>
        <ul>
          {SCHNELLZUGRIFF.map((item) => (
            <li key={item.href} className="border-b border-[#EEF2F8] last:border-0">
              <Link
                href={item.href}
                className="flex items-center gap-2 text-sm text-[#2E4A6B] hover:text-[#1E3249] py-1.5 transition-colors"
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#EEF2F8]" />

      {/* Community Box */}
      <div className="bg-[#2E4A6B] rounded-xl p-4 text-white">
        <div className="font-semibold text-sm mb-1">🐾 Werde Teil der Community</div>
        <p className="text-xs text-[#A8C0DC] mb-3 leading-relaxed">
          Schon mehrere Mitglieder im Kreis Daun
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-[#2E4A6B] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#EEF2F8] transition-colors"
        >
          Jetzt mitmachen
        </Link>
      </div>
    </aside>
  );
}
