'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LEISTUNGS_CHIPS } from '@/lib/mock-data'
import NachrichtModal from '@/components/dashboard/NachrichtModal'
import { matchColor, matchLabel } from '@/lib/matching'
import SitterDetailModal from './SitterDetailModal'

const BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(245,158,11,0.12)',
  color: '#b45309',
  border: '1px solid rgba(245,158,11,0.35)',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 600,
  padding: '2px 7px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

interface SitterCardProps {
  sitterId?: string
  name: string
  ortschaft: string
  beschreibung?: string
  fotoUrl?: string
  avgRating: number
  totalReviews: number
  leistungen?: string[]
  hatGarten?: boolean
  kannMedikamente?: boolean
  notfallVerfuegbar?: boolean
  erfahrungJahre?: number
  radiusKm?: number
  isDummy?: boolean
  isLoggedIn?: boolean
  userRole?: string
  matchProzent?: number
}

export default function SitterCard({
  sitterId,
  name, ortschaft, beschreibung, fotoUrl,
  avgRating, totalReviews, leistungen = [],
  hatGarten, kannMedikamente, notfallVerfuegbar, erfahrungJahre, radiusKm,
  isDummy, isLoggedIn, userRole, matchProzent,
}: SitterCardProps) {
  const [zeigeDetail, setZeigeDetail] = useState(false)
  const [zeigeKontakt, setZeigeKontakt] = useState(false)

  return (
    <div
      className="tile p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setZeigeDetail(true)}
    >
      <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
        {fotoUrl && (
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotoUrl} alt={name} className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <span className="font-bold text-sm truncate">{name}</span>
            {isDummy && <span style={BADGE_STYLE}>📌 Beispiel</span>}
          </div>
          <div className="text-xs text-muted truncate">📍 {ortschaft}</div>
          <div className="text-xs text-secondary">⭐ {avgRating.toFixed(1)} ({totalReviews})</div>
        </div>
      </div>

      {matchProzent !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: matchColor(matchProzent) }}>
            {matchProzent}%
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold text-slate-900"
            style={{ background: 'rgba(245,158,11,0.15)', fontSize: 9 }}>
            {matchLabel(matchProzent)}
          </span>
        </div>
      )}

      {beschreibung && (
        <p className="text-xs text-secondary leading-relaxed line-clamp-3">{beschreibung}</p>
      )}

      {leistungen.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {leistungen.map((l) => (
            <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0f4f8', color: '#4a5568' }}>
              {LEISTUNGS_CHIPS[l] ?? l}
            </span>
          ))}
        </div>
      )}

      {(hatGarten || kannMedikamente) && (
        <div className="flex flex-wrap gap-1">
          {hatGarten && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
              🌿 Garten
            </span>
          )}
          {kannMedikamente && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(3,105,161,0.08)', color: '#0369a1' }}>
              💊 Medikamente
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-auto">
        <Link
          href="/daun/sitter"
          className="text-xs font-bold hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}
          onClick={(e) => e.stopPropagation()}
        >
          Profil ansehen →
        </Link>
        {sitterId && isLoggedIn && userRole !== 'sitter' && (
          <button
            onClick={(e) => { e.stopPropagation(); setZeigeKontakt(true) }}
            className="text-xs font-bold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80 ml-auto"
            style={{ background: 'var(--accent-green)', color: '#fff' }}
          >
            Kontakt
          </button>
        )}
        {sitterId && !isLoggedIn && (
          <Link
            href="/login"
            className="text-xs font-bold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80 ml-auto"
            style={{ background: 'var(--accent-green)', color: '#fff' }}
            onClick={(e) => e.stopPropagation()}
          >
            Kontakt
          </Link>
        )}
      </div>

      {zeigeDetail && sitterId && (
        <SitterDetailModal
          sitterId={sitterId}
          name={name}
          ort={ortschaft}
          bio={beschreibung}
          fotoUrl={fotoUrl}
          avgRating={avgRating}
          totalReviews={totalReviews}
          leistungen={leistungen}
          hatGarten={hatGarten}
          kannMedikamente={kannMedikamente}
          notfallVerfuegbar={notfallVerfuegbar}
          erfahrungJahre={erfahrungJahre}
          radiusKm={radiusKm}
          matchProzent={matchProzent}
          currentUserRole={userRole ?? null}
          onClose={() => setZeigeDetail(false)}
          onKontakt={() => { setZeigeDetail(false); setZeigeKontakt(true) }}
        />
      )}

      {sitterId && (
        <NachrichtModal
          open={zeigeKontakt}
          onClose={() => setZeigeKontakt(false)}
          richtung="tierhalter-an-sitter"
          empfaengerName={name}
          empfaengerId={sitterId}
        />
      )}
    </div>
  )
}
