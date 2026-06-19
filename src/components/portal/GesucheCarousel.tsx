'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { LEISTUNGS_LABELS } from '@/lib/mock-data';
import NachrichtModal from '@/components/dashboard/NachrichtModal';
import { matchColor, matchLabel } from '@/lib/matching';

// Typ passend zur getOffenePostings-Query
export type PostingRow = {
  id: string
  leistung: string
  datum_von: string
  datum_bis: string
  uhrzeit_von: string | null
  uhrzeit_bis: string | null
  nachricht: string | null
  plz: string
  ort: string
  status: string
  ist_beispiel: boolean | null
  created_at: string
  tier_profiles: Array<{
    id: string
    name: string
    tierart: string
    rasse: string | null
    foto_url: string | null
  }> | null
  profiles: Array<{
    id: string
    full_name: string
  }> | null
}

function formatDateRange(von: string, bis: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-');
    return `${parseInt(day)}.${parseInt(m)}.`;
  };
  return von === bis ? fmt(von) : `${fmt(von)}–${fmt(bis)}`;
}

const LEISTUNG_STYLE: Record<string, string> = {
  gassi: 'rgba(56,189,248,0.25)',
  fuettern: 'rgba(245,158,11,0.25)',
  tagesbetreuung: 'rgba(74,222,128,0.2)',
  uebernachtung: 'rgba(167,139,250,0.25)',
};

const TIERART_EMOJI: Record<string, string> = {
  hund: '🐕',
  katze: '🐈',
  vogel: '🐦',
  kleintier: '🐹',
  sonstiges: '🐾',
};

interface Props {
  postings: PostingRow[]
  isLoggedIn?: boolean
  userRole?: string
  matchProzente?: Record<string, number>
}

function PostingCard({ p, isLoggedIn, userRole, matchProzent }: { p: PostingRow; isLoggedIn?: boolean; userRole?: string; matchProzent?: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const tp = Array.isArray(p.tier_profiles) ? p.tier_profiles[0] : p.tier_profiles;
  const pr = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
  const tierName = tp?.name ?? 'Unbekanntes Tier';
  const tierRasse = tp?.rasse ?? '';
  const fotoUrl = tp?.foto_url;
  const tierEmoji = TIERART_EMOJI[tp?.tierart ?? ''] ?? '🐾';
  const besitzerName = pr?.full_name ?? 'Tierhalter';
  const avatarInitial = besitzerName.charAt(0).toUpperCase();

  const kannBewerben = isLoggedIn && (userRole === 'sitter' || userRole === 'beide');

  return (
    <div className="tile-sm p-4 h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3" style={{ minWidth: 0 }}>
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7] flex items-center justify-center bg-[#f0f4f8]">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={tierName} className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-xl">{tierEmoji}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-bold text-sm leading-tight truncate">{tierName}</span>
            {p.ist_beispiel && (
              <span className="text-xs bg-[#FEF3E2] text-[#E07B30] px-2 py-0.5 rounded-full inline-flex items-center gap-1 flex-shrink-0">
                📌 Beispiel
              </span>
            )}
          </div>
          {tierRasse && <div className="text-xs text-muted truncate">{tierRasse}</div>}
          <div className="text-xs text-secondary truncate">📍 {p.ort}</div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: LEISTUNG_STYLE[p.leistung] ?? 'rgba(255,255,255,0.15)', color: '#1e293b' }}>
          {LEISTUNGS_LABELS[p.leistung] ?? p.leistung}
        </span>
      </div>

      {matchProzent !== undefined && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: matchColor(matchProzent) }}>
            {matchProzent}%
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold text-slate-900"
            style={{ background: 'var(--accent-amber)', fontSize: 9 }}>
            {matchLabel(matchProzent)}
          </span>
        </div>
      )}

      {p.nachricht && (
        <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-2 flex-1">{p.nachricht}</p>
      )}

      <div className="mb-3">
        <div className="text-xs text-muted">📅 {formatDateRange(p.datum_von, p.datum_bis)}</div>
        {p.uhrzeit_von && (
          <div className="text-xs text-muted">
            🕐 {p.uhrzeit_von}{p.uhrzeit_bis ? `–${p.uhrzeit_bis}` : ''}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 text-[9px] font-bold flex-shrink-0"
            style={{ background: 'var(--accent-green)' }}>
            {avatarInitial}
          </div>
          <span className="text-xs text-muted truncate">{besitzerName}</span>
        </div>
        {kannBewerben ? (
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            style={{ color: 'var(--accent-green)' }}
          >
            Bewerben →
          </button>
        ) : !isLoggedIn ? (
          <Link href="/login" className="text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            style={{ color: 'var(--accent-green)' }}>
            Bewerben →
          </Link>
        ) : null}
      </div>

      <NachrichtModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        richtung="sitter-an-tierhalter"
        empfaengerName={besitzerName}
        empfaengerId={pr?.id ?? ''}
        tierName={tierName}
        postingId={p.id}
      />
    </div>
  );
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
              <PostingCard p={p} isLoggedIn={isLoggedIn} userRole={userRole} matchProzent={matchProzente?.[p.id]} />
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

export default function GesucheCarousel({ postings, isLoggedIn, userRole, matchProzente }: Props) {
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
        <Link href="/pinnwand" className="text-xs font-semibold hover:opacity-80 transition-opacity"
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
            <PostingCard key={p.id} p={p} isLoggedIn={isLoggedIn} userRole={userRole} matchProzent={matchProzente?.[p.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
