'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { LEISTUNGS_LABELS } from '@/lib/mock-data'
import { matchColor, matchLabel } from '@/lib/matching'
import { TIERART_EMOJI, type PostingRow } from './GesuchCard'

interface Props {
  posting: PostingRow
  matchProzent?: number
  currentUserRole?: string | null
  onClose: () => void
  onBewerben: () => void
}

function formatDate(d: string): string {
  const [y, m, day] = d.split('-')
  return `${parseInt(day)}.${parseInt(m)}.${y}`
}

export default function GesuchDetailModal({ posting: p, matchProzent, currentUserRole, onClose, onBewerben }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const tp = Array.isArray(p.tier_profiles) ? p.tier_profiles[0] : p.tier_profiles
  const pr = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles

  const tierName = tp?.name ?? 'Unbekanntes Tier'
  const tierRasse = tp?.rasse ?? ''
  const tierEmoji = TIERART_EMOJI[tp?.tierart ?? ''] ?? '🐾'
  const besitzerName = pr?.full_name ?? 'Tierhalter'
  const avatarInitial = besitzerName.charAt(0).toUpperCase()

  // Fotos: foto_urls hat Priorität, Fallback auf einzelnes foto_url
  const fotos = (tp?.foto_urls ?? []).filter(Boolean) as string[]
  if (fotos.length === 0 && tp?.foto_url) fotos.push(tp.foto_url)

  const kannBewerben = currentUserRole === 'sitter' || currentUserRole === 'beide'

  // Escape-Taste schließt Modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Foto-Galerie */}
        <div className="relative flex-shrink-0">
          {fotos.length > 0 ? (
            <div
              className="flex overflow-x-auto snap-x snap-mandatory rounded-t-2xl"
              style={{ scrollbarWidth: 'none' }}
            >
              {fotos.map((url, i) => (
                <div key={i} className="snap-start flex-shrink-0 w-full aspect-[4/3] bg-[#EEF2F8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${tierName} Foto ${i + 1}`} className="w-full h-full object-cover rounded-t-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-[#EEF2F8] rounded-t-2xl flex items-center justify-center">
              <span className="text-7xl">{tierEmoji}</span>
            </div>
          )}

          {/* Notfall-Badge oben links */}
          {p.ist_notfall && (
            <div className="absolute top-3 left-3">
              <span className="text-xs font-semibold bg-[#E07B30] text-white px-3 py-1 rounded-full inline-flex items-center gap-1 animate-pulse shadow">
                🚨 Notfall
              </span>
            </div>
          )}

          {/* Match-Badge oben rechts */}
          {matchProzent !== undefined && (
            <div
              className="absolute top-3 right-3 text-white rounded-full px-4 py-2 text-sm font-bold shadow"
              style={{ background: matchColor(matchProzent) }}
            >
              {matchProzent}% · {matchLabel(matchProzent)}
            </div>
          )}

          {/* Schließen-Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-lg leading-none"
            style={matchProzent !== undefined ? { top: '3.5rem' } : undefined}
            aria-label="Schließen"
          >
            ✕
          </button>

          {/* Scroll-Dots bei mehreren Fotos */}
          {fotos.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {fotos.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" />
              ))}
            </div>
          )}
        </div>

        {/* Inhalt */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          {/* Tier-Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{tierEmoji}</span>
              <h2 className="text-xl font-extrabold text-[#1E3249]">{tierName}</h2>
            </div>
            {tierRasse && <p className="text-sm text-[#7A9DBF]">{tierRasse}</p>}
          </div>

          {/* Leistung + Zeitraum + Ort */}
          <div className="space-y-1.5">
            <div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block"
                style={{ background: '#EEF2F8', color: '#2E4A6B' }}
              >
                {LEISTUNGS_LABELS[p.leistung] ?? p.leistung}
              </span>
            </div>
            <div className="text-sm text-[#4E779F]">
              📅 {formatDate(p.datum_von)}{p.datum_von !== p.datum_bis && ` – ${formatDate(p.datum_bis)}`}
            </div>
            {p.uhrzeit_von && (
              <div className="text-sm text-[#4E779F]">
                🕐 {p.uhrzeit_von}{p.uhrzeit_bis ? `–${p.uhrzeit_bis}` : ''}
              </div>
            )}
            <div className="text-sm text-[#4E779F]">📍 {p.ort}</div>
          </div>

          {/* Nachricht */}
          {p.nachricht && (
            <div className="bg-[#EEF2F8] rounded-xl p-4">
              <p className="text-sm text-[#1E3249] leading-relaxed">{p.nachricht}</p>
            </div>
          )}

          {/* Tierhalter */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#EEF2F8]">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: '#2E4A6B' }}
            >
              {avatarInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1E3249]">{besitzerName}</p>
              <p className="text-xs text-[#7A9DBF]">📍 {p.ort}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-[#EEF2F8]">
          {kannBewerben ? (
            <button
              onClick={onBewerben}
              className="w-full bg-[#2E4A6B] text-white font-bold py-3 rounded-xl hover:bg-[#1E3249] transition-colors"
            >
              Bewerben →
            </button>
          ) : (
            <Link
              href="/register"
              className="block w-full text-center bg-[#2E4A6B] text-white font-bold py-3 rounded-xl hover:bg-[#1E3249] transition-colors"
            >
              Als Sitter registrieren →
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
