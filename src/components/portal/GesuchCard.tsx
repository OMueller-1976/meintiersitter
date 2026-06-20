'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LEISTUNGS_LABELS } from '@/lib/mock-data'
import NachrichtModal from '@/components/dashboard/NachrichtModal'
import { matchColor, matchLabel } from '@/lib/matching'
import GesuchDetailModal from './GesuchDetailModal'

// Zentraler Typ – wird von GesucheCarousel + pinnwand genutzt
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
  ist_notfall: boolean | null
  created_at: string
  tier_profiles: Array<{
    id: string
    name: string
    tierart: string
    rasse: string | null
    foto_url: string | null
    foto_urls: string[] | null
  }> | null
  profiles: Array<{
    id: string
    full_name: string
  }> | null
}

const LEISTUNG_STYLE: Record<string, string> = {
  gassi: 'rgba(56,189,248,0.25)',
  fuettern: 'rgba(245,158,11,0.25)',
  tagesbetreuung: 'rgba(74,222,128,0.2)',
  uebernachtung: 'rgba(167,139,250,0.25)',
}

export const TIERART_EMOJI: Record<string, string> = {
  hund: '🐕',
  katze: '🐈',
  vogel: '🐦',
  kleintier: '🐹',
  sonstiges: '🐾',
}

function formatDateRange(von: string, bis: string): string {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    return `${parseInt(day)}.${parseInt(m)}.`
  }
  return von === bis ? fmt(von) : `${fmt(von)}–${fmt(bis)}`
}

interface Props {
  posting: PostingRow
  matchProzent?: number
  isLoggedIn?: boolean
  userRole?: string
  /** Optionale eigene Footer-Aktion (z.B. PinnwandBewerbenButton). Überschreibt den Standard-Bewerben-Button. */
  footerAction?: React.ReactNode
  /** 'carousel' (Standard) nutzt tile-sm; 'pinnwand' nutzt bg-white mit voller Border */
  variant?: 'carousel' | 'pinnwand'
}

export default function GesuchCard({
  posting: p,
  matchProzent,
  isLoggedIn,
  userRole,
  footerAction,
  variant = 'carousel',
}: Props) {
  const [zeigeDetail, setZeigeDetail] = useState(false)
  const [zeigeNachricht, setZeigeNachricht] = useState(false)

  const tp = Array.isArray(p.tier_profiles) ? p.tier_profiles[0] : p.tier_profiles
  const pr = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
  const tierName = tp?.name ?? 'Unbekanntes Tier'
  const tierRasse = tp?.rasse ?? ''
  const fotoUrl = tp?.foto_url
  const tierEmoji = TIERART_EMOJI[tp?.tierart ?? ''] ?? '🐾'
  const besitzerName = pr?.full_name ?? 'Tierhalter'
  const avatarInitial = besitzerName.charAt(0).toUpperCase()

  const kannBewerben = isLoggedIn && (userRole === 'sitter' || userRole === 'beide')

  const containerBase = 'flex flex-col cursor-pointer hover:shadow-md transition-shadow'
  const containerClass =
    variant === 'pinnwand'
      ? `${containerBase} bg-white rounded-2xl p-5 ${p.ist_notfall ? 'border-2 border-[#E07B30]' : 'border border-[#C8D8EC] hover:border-[#2E4A6B]'}`
      : `${containerBase} tile-sm p-4 h-full`

  return (
    <div
      className={containerClass}
      style={variant === 'carousel' && p.ist_notfall ? { borderWidth: 2, borderColor: '#E07B30' } : undefined}
      onClick={() => setZeigeDetail(true)}
    >
      {p.ist_notfall && (
        <div className="mb-2">
          <span className="text-xs font-semibold bg-[#E07B30] text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
            🚨 Notfall
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3" style={{ minWidth: 0 }}>
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7] flex items-center justify-center bg-[#f0f4f8]">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoUrl}
              alt={tierName}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
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
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: LEISTUNG_STYLE[p.leistung] ?? 'rgba(255,255,255,0.15)', color: '#1e293b' }}
        >
          {LEISTUNGS_LABELS[p.leistung] ?? p.leistung}
        </span>
      </div>

      {matchProzent !== undefined && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-xs font-bold" style={{ color: matchColor(matchProzent) }}>
            {matchProzent}%
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-semibold text-slate-900"
            style={{ background: 'var(--accent-amber)', fontSize: 9 }}
          >
            {matchLabel(matchProzent)}
          </span>
        </div>
      )}

      {p.nachricht && (
        <p className="text-xs text-secondary leading-relaxed mb-3 line-clamp-2">{p.nachricht}</p>
      )}

      <div className="flex-1" />

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
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 text-[9px] font-bold flex-shrink-0"
            style={{ background: 'var(--accent-green)' }}
          >
            {avatarInitial}
          </div>
          <span className="text-xs text-muted truncate">{besitzerName}</span>
        </div>

        {footerAction ? (
          // stopPropagation damit der Footer-Button nicht das Detail-Modal öffnet
          <div onClick={(e) => e.stopPropagation()}>
            {footerAction}
          </div>
        ) : kannBewerben ? (
          <button
            onClick={(e) => { e.stopPropagation(); setZeigeNachricht(true) }}
            className="text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            style={{ color: 'var(--accent-green)' }}
          >
            Bewerben →
          </button>
        ) : !isLoggedIn ? (
          <Link
            href="/login"
            className="text-xs font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            style={{ color: 'var(--accent-green)' }}
            onClick={(e) => e.stopPropagation()}
          >
            Bewerben →
          </Link>
        ) : null}
      </div>

      {zeigeDetail && (
        <GesuchDetailModal
          posting={p}
          matchProzent={matchProzent}
          currentUserRole={userRole ?? null}
          onClose={() => setZeigeDetail(false)}
          onBewerben={() => { setZeigeDetail(false); setZeigeNachricht(true) }}
        />
      )}

      <NachrichtModal
        open={zeigeNachricht}
        onClose={() => setZeigeNachricht(false)}
        richtung="sitter-an-tierhalter"
        empfaengerName={besitzerName}
        empfaengerId={pr?.id ?? ''}
        tierName={tierName}
        postingId={p.id}
      />
    </div>
  )
}
