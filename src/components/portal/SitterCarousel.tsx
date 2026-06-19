'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { LEISTUNGS_CHIPS } from '@/lib/mock-data';

// Typ passend zur getAktiveSitter-Query
export type SitterRow = {
  id: string
  full_name: string
  ort: string | null
  ortschaft: string | null
  avatar_url: string | null
  bio: string | null
  ist_beispiel: boolean | null
  sitter_profiles: Array<{
    erfahrung_jahre: number | null
    hat_garten: boolean | null
    kann_medikamente: boolean | null
    bietet_gassi: boolean | null
    bietet_fuettern: boolean | null
    bietet_tagesbetreuung: boolean | null
    bietet_uebernachtung: boolean | null
    avg_rating: number | null
    total_reviews: number | null
    radius_km: number | null
  }> | null
}

type SpEntry = NonNullable<SitterRow['sitter_profiles']>[number]

function getLeistungen(sp: SpEntry | null | undefined): string[] {
  if (!sp) return [];
  const l: string[] = [];
  if (sp.bietet_gassi) l.push('gassi');
  if (sp.bietet_fuettern) l.push('fuettern');
  if (sp.bietet_tagesbetreuung) l.push('tagesbetreuung');
  if (sp.bietet_uebernachtung) l.push('uebernachtung');
  return l;
}

function SitterCard({ s }: { s: SitterRow }) {
  const sp = Array.isArray(s.sitter_profiles) ? s.sitter_profiles[0] : s.sitter_profiles;
  const leistungen = getLeistungen(sp);
  const avgRating = sp?.avg_rating ?? 0;
  const totalReviews = sp?.total_reviews ?? 0;
  const ortLabel = s.ort ?? s.ortschaft ?? '';
  const initial = s.full_name.charAt(0).toUpperCase();

  return (
    <div className="tile-sm h-full flex flex-col" style={{ padding: '1rem' }}>
      <div className="flex items-center gap-3 mb-3" style={{ minWidth: 0 }}>
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7] flex items-center justify-center bg-[#f0f4f8]">
          {s.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.avatar_url} alt={s.full_name} className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-lg font-bold text-[#0f4c81]">{initial}</span>
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-bold text-sm leading-tight truncate">{s.full_name}</span>
            {s.ist_beispiel && (
              <span className="text-xs bg-[#FEF3E2] text-[#E07B30] px-2 py-0.5 rounded-full inline-flex items-center gap-1 flex-shrink-0">
                📌 Beispiel
              </span>
            )}
          </div>
          {ortLabel && <div className="text-xs text-muted truncate">📍 {ortLabel}</div>}
          <div className="text-xs text-secondary">⭐ {avgRating.toFixed(1)} ({totalReviews})</div>
        </div>
      </div>

      {s.bio && (
        <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-3 flex-1">{s.bio}</p>
      )}

      {leistungen.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {leistungen.map((l) => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#f0f4f8', color: '#4a5568' }}>
              {LEISTUNGS_CHIPS[l] ?? l}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {sp?.hat_garten && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
            🌿 Garten
          </span>
        )}
        {sp?.kann_medikamente && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(3,105,161,0.08)', color: '#0369a1' }}>
            💊 Medikamente
          </span>
        )}
      </div>

      <Link href="/register" className="text-xs font-bold hover:opacity-80 transition-opacity"
        style={{ color: 'var(--accent-green)' }}>
        Profil ansehen →
      </Link>
    </div>
  );
}

function CarouselView({ sitter }: { sitter: SitterRow[] }) {
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
          {sitter.map((s) => (
            <div key={s.id} className="flex-none" style={{ width: 'calc(50% - 6px)', minWidth: 0 }}>
              <SitterCard s={s} />
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
        {sitter.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: i === selectedIndex ? 'var(--accent-green)' : '#d0e4f7' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  sitter: SitterRow[]
}

export default function SitterCarousel({ sitter }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Sitter in Deiner Region</h2>
        <Link href="/daun/sitter" className="text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}>
          Alle Sitter →
        </Link>
      </div>

      {sitter.length === 0 ? (
        <div className="tile-sm p-6 text-center">
          <div className="text-3xl mb-2">🐾</div>
          <p className="text-sm text-secondary mb-1">Noch keine Sitter registriert.</p>
          <p className="text-xs text-muted mb-3">Sei der Erste!</p>
          <Link href="/register?role=sitter"
            className="text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}>
            Als Sitter registrieren →
          </Link>
        </div>
      ) : sitter.length >= 3 ? (
        <CarouselView sitter={sitter} />
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${sitter.length}, 1fr)` }}>
          {sitter.map((s) => (
            <SitterCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}
