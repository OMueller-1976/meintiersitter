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
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          aria-label="Zurück"
        >
          ‹
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {MOCK_SITTER.map((s) => (
              <div key={s.id} className="flex-none min-w-0" style={{ width: 'calc(50% - 6px)' }}>
                <div className="tile-sm p-4 h-full flex flex-col relative">
                  <span className="dummy-badge">📌 Beispiel</span>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.foto} alt={s.name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm leading-tight truncate">{s.name}</div>
                      <div className="text-xs text-muted">📍 {s.ortschaft}</div>
                      <div className="text-xs text-secondary">⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews})</div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-3 flex-1">{s.beschreibung}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {s.leistungen.map((l) => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                        {LEISTUNGS_CHIPS[l] ?? l}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.hat_garten && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: 'var(--accent-green)' }}>
                        🌿 Garten
                      </span>
                    )}
                    {s.kann_medikamente && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent-blue)' }}>
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
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          aria-label="Weiter"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {MOCK_SITTER.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === selectedIndex ? 'var(--accent-green)' : 'rgba(255,255,255,0.25)' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
