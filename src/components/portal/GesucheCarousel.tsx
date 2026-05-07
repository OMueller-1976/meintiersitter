'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

interface PostingMock {
  id: string;
  tier_name: string;
  tier_rasse: string;
  tier_emoji: string;
  leistung: string;
  leistung_label: string;
  ortschaft: string;
  datum_von: string;
  datum_bis: string;
  besitzer_name: string;
  beschreibung: string;
  avatar_initial: string;
}

const MOCK_POSTINGS: PostingMock[] = [
  {
    id: '1',
    tier_name: 'Pippi',
    tier_rasse: 'Golden Retriever',
    tier_emoji: '🐕',
    leistung: 'gassi',
    leistung_label: 'Gassi gehen',
    ortschaft: 'Kirchweiler',
    datum_von: '2025-06-12',
    datum_bis: '2025-06-14',
    besitzer_name: 'Familie Schneider',
    beschreibung: 'Pippi ist ein freundlicher Retriever, 3 Jahre alt. Sucht jemanden für tägliche Morgenspaziergänge.',
    avatar_initial: 'FS',
  },
  {
    id: '2',
    tier_name: 'Milo',
    tier_rasse: 'Dackel',
    tier_emoji: '🐶',
    leistung: 'tagesbetreuung',
    leistung_label: 'Tagesbetreuung',
    ortschaft: 'Daun',
    datum_von: '2025-06-20',
    datum_bis: '2025-06-20',
    besitzer_name: 'Thomas K.',
    beschreibung: 'Milo braucht an einem Werktag Gesellschaft — wir sind berufstätig und suchen jemanden mit Herz.',
    avatar_initial: 'TK',
  },
  {
    id: '3',
    tier_name: 'Luna',
    tier_rasse: 'Labrador Mix',
    tier_emoji: '🐾',
    leistung: 'uebernachtung',
    leistung_label: 'Übernachtung',
    ortschaft: 'Gillenfeld',
    datum_von: '2025-07-01',
    datum_bis: '2025-07-07',
    besitzer_name: 'Sabine M.',
    beschreibung: 'Luna ist sehr lieb und schläft die ganze Nacht durch. Urlaubszeit — brauchen eine Woche Betreuung.',
    avatar_initial: 'SM',
  },
  {
    id: '4',
    tier_name: 'Rex',
    tier_rasse: 'Schäferhund',
    tier_emoji: '🐕‍🦺',
    leistung: 'fuettern',
    leistung_label: 'Füttern',
    ortschaft: 'Manderscheid',
    datum_von: '2025-06-15',
    datum_bis: '2025-06-16',
    besitzer_name: 'Peter W.',
    beschreibung: 'Rex braucht 2x täglich Futter und kurze Gassi-Runde. Wir sind übers Wochenende weg.',
    avatar_initial: 'PW',
  },
];

const BADGE_COLORS: Record<string, string> = {
  gassi: 'bg-[#DDEAF4] text-[#2E4A6B]',
  fuettern: 'bg-[#FEF3E2] text-[#E07B30]',
  tagesbetreuung: 'bg-[#E8F0F8] text-[#2E4A6B]',
  uebernachtung: 'bg-[#EDE8F5] text-[#5B4A8A]',
};

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
          <h2 className="text-base font-semibold text-[#1E3249]">Aktuelle Gesuche</h2>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {MOCK_POSTINGS.length} offen
          </span>
        </div>
        <Link href="/pinnwand" className="text-xs text-[#2E4A6B] hover:underline font-medium">
          Alle anzeigen →
        </Link>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Prev */}
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
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.tier_emoji}</span>
                      <div>
                        <div className="font-semibold text-[#1E3249] text-sm leading-tight">{p.tier_name}</div>
                        <div className="text-xs text-[#7A9DBF]">{p.tier_rasse} · {p.ortschaft}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${BADGE_COLORS[p.leistung] ?? 'bg-[#EEF2F8] text-[#2E4A6B]'}`}>
                      {p.leistung_label}
                    </span>
                  </div>

                  <p className="text-xs text-[#4E779F] leading-relaxed mb-3 line-clamp-2 flex-1">
                    {p.beschreibung}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EEF2F8]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#2E4A6B] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {p.avatar_initial}
                      </div>
                      <span className="text-xs text-[#4E779F] truncate">{p.besitzer_name}</span>
                    </div>
                    <span className="text-xs text-[#7A9DBF] flex-shrink-0">{formatDateRange(p.datum_von, p.datum_bis)}</span>
                  </div>
                  <Link
                    href="/register"
                    className="mt-2 text-xs text-[#2E4A6B] font-medium hover:underline"
                  >
                    Jetzt bewerben →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
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
