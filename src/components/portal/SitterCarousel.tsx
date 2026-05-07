'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { MOCK_SITTER, LEISTUNGS_CHIPS } from '@/lib/mock-data';

export default function SitterCarousel() {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#1E3249]">Sitter in Deiner Region</h2>
        <Link href="/daun/sitter" className="text-xs text-[#2E4A6B] hover:underline font-medium">
          Alle Sitter →
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#C8D8EC] shadow flex items-center justify-center text-[#2E4A6B] hover:bg-white transition disabled:opacity-30"
          aria-label="Zurück"
        >
          ‹
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {MOCK_SITTER.map((s) => (
              <div
                key={s.id}
                className="flex-none min-w-0"
                style={{ width: 'calc(50% - 6px)' }}
              >
                <div className="bg-white rounded-xl border border-[#C8D8EC] p-4 hover:border-[#2E4A6B] hover:shadow-md transition-all h-full flex flex-col">
                  {/* Foto + Name + Rating */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8D8EC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.foto}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1E3249] text-base leading-tight truncate">{s.name}</div>
                      <div className="text-sm text-[#4E779F]">📍 {s.ortschaft}</div>
                      <div className="text-sm text-[#4E779F] flex items-center gap-1">
                        ⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews} Bewertungen)
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#4E779F] leading-relaxed mb-3 line-clamp-3 flex-1">
                    {s.beschreibung}
                  </p>

                  {/* Leistungs-Chips */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {s.leistungen.map((l) => (
                      <span key={l} className="bg-[#EEF2F8] text-[#2E4A6B] text-sm rounded-full px-2 py-0.5">
                        {LEISTUNGS_CHIPS[l] ?? l}
                      </span>
                    ))}
                  </div>

                  {/* Zusatz-Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.hat_garten && (
                      <span className="text-xs bg-[#EEF2F8] text-[#2E4A6B] px-2 py-0.5 rounded-full">
                        🌿 Garten
                      </span>
                    )}
                    {s.kann_medikamente && (
                      <span className="text-xs bg-[#EEF2F8] text-[#2E4A6B] px-2 py-0.5 rounded-full">
                        💊 Medikamente möglich
                      </span>
                    )}
                  </div>

                  <Link
                    href="/register"
                    className="text-sm text-[#2E4A6B] font-medium hover:underline"
                  >
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#C8D8EC] shadow flex items-center justify-center text-[#2E4A6B] hover:bg-white transition disabled:opacity-30"
          aria-label="Weiter"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {MOCK_SITTER.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === selectedIndex ? 'bg-[#2E4A6B]' : 'bg-[#C8D8EC]'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
