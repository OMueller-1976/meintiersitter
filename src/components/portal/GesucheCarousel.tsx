'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import GesuchCard, { type PostingRow } from './GesuchCard';

// PostingRow wird aus GesuchCard re-exportiert für externe Nutzer
export type { PostingRow } from './GesuchCard';

interface Props {
  postings: PostingRow[]
  isLoggedIn?: boolean
  userRole?: string
  matchProzente?: Record<string, number>
  region?: string
}

function CarouselView({ postings, isLoggedIn, userRole, matchProzente }: { postings: PostingRow[]; isLoggedIn?: boolean; userRole?: string; matchProzente?: Record<string, number> }) {
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
          {postings.map((p) => (
            <div key={p.id} className="flex-none" style={{ width: 'calc(50% - 6px)', minWidth: 0 }}>
              <GesuchCard
                posting={p}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                matchProzent={matchProzente?.[p.id]}
              />
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

      <div className="flex justify-center gap-1.5 mt-3">
        {postings.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === selectedIndex ? 'var(--accent-green)' : '#d0e4f7' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default function GesucheCarousel({ postings, isLoggedIn, userRole, matchProzente, region = 'daun' }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold">Aktuelle Gesuche</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
            {postings.length} offen
          </span>
        </div>
        <Link href={`/${region}`} className="text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}>
          Alle anzeigen →
        </Link>
      </div>

      {postings.length === 0 ? (
        <div className="tile-sm p-6 text-center">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm text-secondary mb-1">Noch keine offenen Gesuche.</p>
          <p className="text-xs text-muted mb-3">Sei der Erste!</p>
          <Link href="/dashboard/postings/neu"
            className="text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}>
            Gesuch aufgeben →
          </Link>
        </div>
      ) : postings.length >= 3 ? (
        <CarouselView postings={postings} isLoggedIn={isLoggedIn} userRole={userRole} matchProzente={matchProzente} />
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${postings.length}, 1fr)` }}>
          {postings.map((p) => (
            <GesuchCard
              key={p.id}
              posting={p}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              matchProzent={matchProzente?.[p.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
