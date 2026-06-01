'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { MOCK_SITTER, LEISTUNGS_CHIPS } from '@/lib/mock-data';

interface Props {
  bundesland?: string
  landkreis?: string
}

export default function SitterCarousel({ bundesland = 'rheinland-pfalz', landkreis = 'daun' }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
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
        <h2 className="text-base font-bold">Sitter in Deiner Region</h2>
        <Link href={`/${bundesland}/${landkreis}/sitter`} className="text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}>
          Alle Sitter →
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
            {MOCK_SITTER.map((s) => (
              <div key={s.id} className="flex-none" style={{ width: 'calc(50% - 6px)', minWidth: 0 }}>
                <div className="tile-sm h-full flex flex-col" style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-3 mb-3" style={{ minWidth: 0 }}>
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.foto} alt={s.name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <span className="font-bold text-sm leading-tight truncate">{s.name}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,158,11,0.12)', color: '#b45309', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '20px', fontSize: '11px', fontWeight: 600, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>📌 Beispiel</span>
                      </div>
                      <div className="text-xs text-muted truncate">📍 {s.ortschaft}</div>
                      <div className="text-xs text-secondary">⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews})</div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-3 flex-1">{s.beschreibung}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {s.leistungen.map((l) => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#f0f4f8', color: '#4a5568' }}>
                        {LEISTUNGS_CHIPS[l] ?? l}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.hat_garten && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
                        🌿 Garten
                      </span>
                    )}
                    {s.kann_medikamente && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(3,105,161,0.08)', color: '#0369a1' }}>
                        💊 Medikamente
                      </span>
                    )}
                  </div>

                  <Link href="/register" className="text-xs font-bold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--accent-green)' }}>
                    Profil ansehen →
                  </Link>
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
        {MOCK_SITTER.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === selectedIndex ? 'var(--accent-green)' : '#d0e4f7' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
