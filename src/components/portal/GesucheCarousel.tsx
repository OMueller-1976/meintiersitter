'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { MOCK_POSTINGS } from '@/lib/mock-data';

function formatDateRange(von: string, bis: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    return `${parseInt(day)}.${parseInt(m)}.`;
  };
  return von === bis ? fmt(von) + '2025' : `${fmt(von)}–${fmt(bis)}2025`;
}

const LEISTUNG_STYLE: Record<string, string> = {
  gassi: 'rgba(56,189,248,0.25)',
  fuettern: 'rgba(245,158,11,0.25)',
  tagesbetreuung: 'rgba(74,222,128,0.2)',
  uebernachtung: 'rgba(167,139,250,0.25)',
};

export default function GesucheCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold">Aktuelle Gesuche</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
            {MOCK_POSTINGS.length} offen
          </span>
        </div>
        <Link href="/pinnwand" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-green)' }}>
          Alle anzeigen →
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition disabled:opacity-30"
          style={{ background: '#f0f4f8', border: '1px solid #d0e4f7', color: '#0f4c81' }}
          aria-label="Zurück"
        >
          ‹
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {MOCK_POSTINGS.map((p) => (
              <div key={p.id} className="flex-none" style={{ width: 'calc(50% - 6px)', minWidth: 0 }}>
                <div className="tile-sm p-4 h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3" style={{ minWidth: 0 }}>
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.tier_foto} alt={p.tier_name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <span className="font-bold text-sm leading-tight truncate">{p.tier_name}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,158,11,0.12)', color: '#b45309', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '20px', fontSize: '11px', fontWeight: 600, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>📌 Beispiel</span>
                      </div>
                      <div className="text-xs text-muted truncate">{p.tier_rasse}</div>
                      <div className="text-xs text-secondary truncate">📍 {p.ortschaft}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: LEISTUNG_STYLE[p.leistung] ?? 'rgba(255,255,255,0.15)', color: '#1e293b' }}>
                      {p.leistung_label}
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-2 flex-1">{p.beschreibung}</p>

                  <div className="mb-3">
                    <div className="text-xs text-muted">📅 {formatDateRange(p.datum_von, p.datum_bis)}</div>
                    <div className="text-xs text-muted">🕐 {p.uhrzeit}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 text-[9px] font-bold flex-shrink-0"
                        style={{ background: 'var(--accent-green)' }}>
                        {p.avatar_initial}
                      </div>
                      <span className="text-xs text-muted truncate">{p.besitzer_name}</span>
                    </div>
                    <Link href="/register" className="text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ color: 'var(--accent-green)' }}>
                      Bewerben →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition disabled:opacity-30"
          style={{ background: '#f0f4f8', border: '1px solid #d0e4f7', color: '#0f4c81' }}
          aria-label="Weiter"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {MOCK_POSTINGS.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === selectedIndex ? 'var(--accent-green)' : '#d0e4f7' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
