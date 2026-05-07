'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

interface SitterMock {
  id: string;
  name: string;
  ortschaft: string;
  avatar_initial: string;
  beschreibung: string;
  leistungen: string[];
  hat_garten: boolean;
  erfahrung_jahre: number;
  avg_rating: number;
  total_reviews: number;
}

const MOCK_SITTER: SitterMock[] = [
  {
    id: '1',
    name: 'Familie Berger',
    ortschaft: 'Daun',
    avatar_initial: 'FB',
    beschreibung: 'Familie mit zwei Kindern möchte gerne Verantwortung übernehmen. Wir lieben Hunde und haben selbst früher einen gehabt.',
    leistungen: ['gassi', 'fuettern', 'tagesbetreuung'],
    hat_garten: true,
    erfahrung_jahre: 5,
    avg_rating: 0,
    total_reviews: 0,
  },
  {
    id: '2',
    name: 'Maria H.',
    ortschaft: 'Gillenfeld',
    avatar_initial: 'MH',
    beschreibung: 'Rentnerin mit viel Zeit und Herz für Tiere. Habe 20 Jahre lang selbst Hunde gehabt. Gassi gehen ist für mich eine Freude!',
    leistungen: ['gassi', 'fuettern', 'uebernachtung'],
    hat_garten: true,
    erfahrung_jahre: 20,
    avg_rating: 0,
    total_reviews: 0,
  },
  {
    id: '3',
    name: 'Jonas & Clara',
    ortschaft: 'Manderscheid',
    avatar_initial: 'JC',
    beschreibung: 'Junges Pärchen, aktiv und naturverbunden. Wandern wir sowieso täglich in der Vulkaneifel — ein Hund macht den Ausflug perfekt.',
    leistungen: ['gassi', 'tagesbetreuung'],
    hat_garten: false,
    erfahrung_jahre: 2,
    avg_rating: 0,
    total_reviews: 0,
  },
  {
    id: '4',
    name: 'Petra L.',
    ortschaft: 'Kirchweiler',
    avatar_initial: 'PL',
    beschreibung: 'Tierarzthelferin, kann auch Medikamente geben. Großer Garten vorhanden. Betreue bis zu 2 Hunde gleichzeitig.',
    leistungen: ['gassi', 'fuettern', 'uebernachtung', 'tagesbetreuung'],
    hat_garten: true,
    erfahrung_jahre: 8,
    avg_rating: 0,
    total_reviews: 0,
  },
];

const LEISTUNG_CHIPS: Record<string, string> = {
  gassi: '🦮 Gassi',
  fuettern: '🍖 Füttern',
  tagesbetreuung: '☀️ Tagesbetreuung',
  uebernachtung: '🌙 Übernachtung',
};

const AVATAR_COLORS = ['bg-[#2E4A6B]', 'bg-[#4E779F]', 'bg-[#F4A261]', 'bg-[#3A5A80]'];

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
        <h2 className="text-base font-semibold text-[#1E3249]">Sitter in Deiner Region</h2>
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
            {MOCK_SITTER.map((s, idx) => (
              <div
                key={s.id}
                className="flex-none min-w-0"
                style={{ width: 'calc(50% - 6px)' }}
              >
                <div className="bg-white rounded-xl border border-[#C8D8EC] p-4 hover:border-[#2E4A6B] hover:shadow-md transition-all h-full flex flex-col">
                  {/* Avatar + Name */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
                      {s.avatar_initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1E3249] text-sm leading-tight truncate">{s.name}</div>
                      <div className="text-xs text-[#7A9DBF]">{s.ortschaft}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#7A9DBF]">⭐ {s.total_reviews} Bewertungen</span>
                        {s.hat_garten && <span className="text-xs text-[#4E779F]">🌿 Garten</span>}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#4E779F] leading-relaxed mb-3 line-clamp-3 flex-1">
                    {s.beschreibung}
                  </p>

                  {/* Leistungs-Chips */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.leistungen.map((l) => (
                      <span key={l} className="bg-[#EEF2F8] text-[#2E4A6B] text-xs rounded-full px-2 py-0.5">
                        {LEISTUNG_CHIPS[l] ?? l}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/register"
                    className="text-xs text-[#2E4A6B] font-medium hover:underline"
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
