'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { MOCK_POSTINGS, LEISTUNGS_BADGE_CLASSES } from '@/lib/mock-data';

function formatDateRange(von: string, bis: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    return `${parseInt(day)}.${parseInt(m)}.`;
  };
  return von === bis ? fmt(von) + '2025' : `${fmt(von)}–${fmt(bis)}2025`;
}

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
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#1E3249]">Aktuelle Gesuche</h2>
          <span className="bg-[#DDEAF4] text-[#2E4A6B] text-xs font-medium px-2 py-0.5 rounded-full">
            {MOCK_POSTINGS.length} offen
          </span>
        </div>
        <Link href="/pinnwand" className="text-xs text-[#2E4A6B] hover:underline font-medium">
          Alle anzeigen →
        </Link>
      </div>

      {/* Carousel wrapper */}
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
            {MOCK_POSTINGS.map((p) => (
              <div
                key={p.id}
                className="flex-none min-w-0"
                style={{ width: 'calc(50% - 6px)' }}
              >
                <div className="bg-white rounded-xl border border-[#C8D8EC] p-4 hover:border-[#2E4A6B] hover:shadow-md transition-all h-full flex flex-col">
                  {/* Top row: Foto + Info + Badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8D8EC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.tier_foto}
                        alt={p.tier_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1E3249] text-base leading-tight">{p.tier_name}</div>
                      <div className="text-sm text-[#7A9DBF]">{p.tier_rasse}</div>
                      <div className="text-sm text-[#4E779F]">📍 {p.ortschaft}</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${LEISTUNGS_BADGE_CLASSES[p.leistung] ?? 'bg-[#EEF2F8] text-[#2E4A6B]'}`}>
                      {p.leistung_label}
                    </span>
                  </div>

                  <p className="text-sm text-[#4E779F] leading-relaxed mb-3 line-clamp-2 flex-1">
                    {p.beschreibung}
                  </p>

                  {/* Datum + Uhrzeit */}
                  <div className="mb-3">
                    <div className="text-sm text-[#7A9DBF]">📅 {formatDateRange(p.datum_von, p.datum_bis)}</div>
                    <div className="text-sm text-[#4E779F]">🕐 {p.uhrzeit}</div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EEF2F8]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#2E4A6B] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {p.avatar_initial}
                      </div>
                      <span className="text-sm text-[#4E779F] truncate">{p.besitzer_name}</span>
                    </div>
                    <Link
                      href="/register"
                      className="text-sm text-[#2E4A6B] font-medium hover:underline flex-shrink-0"
                    >
                      Jetzt bewerben →
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#C8D8EC] shadow flex items-center justify-center text-[#2E4A6B] hover:bg-white transition disabled:opacity-30"
          aria-label="Weiter"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {MOCK_POSTINGS.map((_, i) => (
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
