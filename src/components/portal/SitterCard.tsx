'use client'

import Link from 'next/link'
import { LEISTUNGS_CHIPS } from '@/lib/mock-data'

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
  name: string
  ortschaft: string
  beschreibung?: string
  fotoUrl?: string
  avgRating: number
  totalReviews: number
  leistungen?: string[]
  hatGarten?: boolean
  kannMedikamente?: boolean
  isDummy?: boolean
}

export default function SitterCard({
  name, ortschaft, beschreibung, fotoUrl,
  avgRating, totalReviews, leistungen = [],
  hatGarten, kannMedikamente, isDummy,
}: SitterCardProps) {
  return (
    <div className="tile p-4 flex flex-col gap-3">
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

      <Link href="/register" className="text-xs font-bold hover:opacity-80 transition-opacity mt-auto"
        style={{ color: 'var(--accent-green)' }}>
        Profil ansehen →
      </Link>
    </div>
  )
}
