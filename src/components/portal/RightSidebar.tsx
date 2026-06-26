'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GemeindeDaunBadge from '@/components/GemeindeDaunBadge';
import { REGION_CONTENT } from '@/lib/region-content';

interface InfoKachel {
  kategorie: string;
  emoji: string;
  titel: string;
  text: string;
  link: string;
  link_label: string;
}

function buildInfoKacheln(region: string): InfoKachel[] {
  const content = REGION_CONTENT[region] ?? REGION_CONTENT['daun'];
  const kacheln: InfoKachel[] = [];

  if (content.wanderrouten[0]) {
    kacheln.push({
      kategorie: 'Wandertipp',
      emoji: '🥾',
      titel: content.wanderrouten[0].titel,
      text: content.wanderrouten[0].beschreibung,
      link: `/${region}/ratgeber/wandern`,
      link_label: 'Zur Route →',
    });
  }

  if (content.wanderrouten[1]) {
    kacheln.push({
      kategorie: 'Wandertipp',
      emoji: '🏆',
      titel: content.wanderrouten[1].titel,
      text: content.wanderrouten[1].beschreibung,
      link: `/${region}/ratgeber/wandern`,
      link_label: 'Zur Route →',
    });
  }

  kacheln.push({
    kategorie: 'Special Hunde',
    emoji: '🐕',
    titel: content.hundestrand.name,
    text: content.hundestrand.beschreibung,
    link: `/${region}/hundestrand`,
    link_label: 'Mehr erfahren →',
  });

  kacheln.push({
    kategorie: 'Marktplatz',
    emoji: '🏪',
    titel: 'Tiergeschäfte in der Region',
    text: 'Finde Tierärzte, Hundeschulen und Tiershops direkt in Deiner Ortschaft.',
    link: `/${region}/marktplatz`,
    link_label: 'Zum Marktplatz →',
  });

  kacheln.push({
    kategorie: 'Tipp',
    emoji: '💡',
    titel: 'Erstes Kennenlernen',
    text: 'Vor dem ersten Match empfehlen wir ein kurzes Kennenlernen — für Mensch und Tier.',
    link: `/${region}/ratgeber`,
    link_label: 'Tipps lesen →',
  });

  return kacheln;
}

function buildSchnellzugriff(region: string) {
  return [
    { emoji: '🗺', label: 'Wanderrouten', href: `/${region}/wanderrouten` },
    { emoji: '🐕', label: 'Special Hunde', href: `/${region}/hundestrand` },
    { emoji: '🏪', label: 'Marktplatz', href: `/${region}/marktplatz` },
    { emoji: '📋', label: 'Alle Gesuche', href: `/${region}` },
  ];
}

interface RightSidebarProps {
  region?: string;
}

export default function RightSidebar({ region = 'daun' }: RightSidebarProps) {
  const INFO_KACHELN = buildInfoKacheln(region);
  const SCHNELLZUGRIFF = buildSchnellzugriff(region);
  const infoCount = INFO_KACHELN.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % infoCount);
        setFading(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [infoCount]);

  const current = INFO_KACHELN[activeIndex];

  return (
    <div
      className="flex flex-col h-full border-l border-[#E2E8F0] bg-white"
      style={{ width: 'var(--sidebar-width-right)' }}
    >
      {/* ── Scrollbarer oberer Bereich ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Kachel 1: Tipps & Entdecken — FESTE HÖHE */}
        <div className="h-[200px] rounded-xl border border-[#C8D8EC] overflow-hidden flex-shrink-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#EEF2F8] flex-shrink-0">
            <span className="text-sm font-medium text-[#4E779F] uppercase tracking-wide">
              Tipps &amp; Entdecken
            </span>
            <div className="flex gap-1">
              {INFO_KACHELN.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); setFading(false); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeIndex ? 'bg-[#2E4A6B]' : 'bg-[#C8D8EC]'
                  }`}
                  aria-label={`Kachel ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 overflow-hidden">
            <div
              className={`transition-opacity duration-300 h-full flex flex-col ${
                fading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-[#4E779F] uppercase tracking-wide">
                  {current.kategorie}
                </span>
                <span className="text-base">{current.emoji}</span>
              </div>
              <p className="font-semibold text-base text-[#1E3249] truncate mb-1">
                {current.titel}
              </p>
              <p className="text-sm text-[#4E779F] leading-relaxed flex-1 overflow-hidden line-clamp-3">
                {current.text}
              </p>
              <Link
                href={current.link}
                className="text-sm font-medium text-[#2E4A6B] hover:text-[#1E3249] mt-2 inline-block"
              >
                {current.link_label}
              </Link>
            </div>
          </div>
        </div>

        {/* Kachel 2: Gemeinde Daun */}
        <GemeindeDaunBadge />

      </div>

      {/* ── Fixierter unterer Bereich ── */}
      <div className="border-t border-[#E2E8F0] p-4 space-y-4 flex-shrink-0">

        {/* Kostenlos & Ehrenamtlich (Spenden) */}
        <div className="tile-sm" style={{ padding: '14px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4E779F', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            Kostenlos & Ehrenamtlich
          </p>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💚</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1E3249', marginBottom: 4 }}>
            Tiersitti braucht Dich
          </p>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>
            Keine Werbung, keine Gebühren — hilf uns, das zu erhalten.
          </p>
          <Link
            href="/spenden"
            style={{
              display: 'inline-block',
              background: '#2D6A4F',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            Jetzt unterstützen →
          </Link>
        </div>

        {/* Schnellzugriff */}
        <div>
          <p className="text-sm font-medium text-[#4E779F] uppercase tracking-wide mb-2">
            Schnellzugriff
          </p>
          <nav>
            {SCHNELLZUGRIFF.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm text-[#2E4A6B] hover:text-[#1E3249] py-1.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#F8FAFC] rounded px-1 transition-colors"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </div>
  );
}
