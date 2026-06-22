'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { LEISTUNGS_CHIPS } from '@/lib/mock-data'
import { matchColor, matchLabel } from '@/lib/matching'

interface Props {
  sitterId: string
  name: string
  ort: string
  bio?: string
  fotoUrl?: string
  avgRating: number
  totalReviews: number
  leistungen?: string[]
  hatGarten?: boolean
  kannMedikamente?: boolean
  notfallVerfuegbar?: boolean
  radiusKm?: number
  erfahrungJahre?: number
  matchProzent?: number
  currentUserRole?: string | null
  onClose: () => void
  onKontakt: () => void
}

export default function SitterDetailModal({
  name,
  ort,
  bio,
  fotoUrl,
  avgRating,
  totalReviews,
  leistungen = [],
  hatGarten,
  kannMedikamente,
  notfallVerfuegbar,
  radiusKm,
  erfahrungJahre,
  matchProzent,
  currentUserRole,
  onClose,
  onKontakt,
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const initial = name.charAt(0).toUpperCase()
  const kannKontakt = currentUserRole === 'tierhalter' || currentUserRole === 'beide'
  const nichtAngemeldet = currentUserRole == null

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

        {/* Header mit Avatar */}
        <div className="relative bg-[#EEF2F8] rounded-t-2xl px-5 pt-8 pb-5 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow flex items-center justify-center bg-[#2E4A6B] text-white text-3xl font-bold mb-3">
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fotoUrl} alt={name} className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            ) : initial}
          </div>
          <h2 className="text-xl font-extrabold text-[#1E3249]">{name}</h2>
          <p className="text-sm text-[#7A9DBF] mt-0.5">📍 {ort}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-[#4E779F]">⭐ {avgRating.toFixed(1)}</span>
            <span className="text-xs text-[#7A9DBF]">({totalReviews} Bewertungen)</span>
          </div>

          {notfallVerfuegbar && (
            <div className="mt-2">
              <span className="text-xs font-semibold bg-[#FEF3E2] text-[#E07B30] border border-[#E07B30]/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                🚨 Für Notfälle verfügbar
              </span>
            </div>
          )}

          {matchProzent !== undefined && (
            <div
              className="mt-2 text-white rounded-full px-4 py-1.5 text-sm font-bold inline-block"
              style={{ background: matchColor(matchProzent) }}
            >
              {matchProzent}% Match · {matchLabel(matchProzent)}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="absolute top-3 right-3 w-8 h-8 bg-black/20 text-[#1E3249] rounded-full flex items-center justify-center hover:bg-black/30 transition-colors text-lg leading-none"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Inhalt */}
        <div className="flex-1 p-5 space-y-5 overflow-y-auto">
          {/* Bio */}
          {bio && (
            <div className="bg-[#EEF2F8] rounded-xl p-4">
              <p className="text-sm text-[#1E3249] leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Erfahrung */}
          {(erfahrungJahre !== undefined || hatGarten || kannMedikamente) && (
            <div>
              <h3 className="text-xs font-bold text-[#7A9DBF] uppercase tracking-wide mb-2">Erfahrung</h3>
              <div className="flex flex-wrap gap-2">
                {erfahrungJahre !== undefined && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#EEF2F8] text-[#2E4A6B]">
                    {erfahrungJahre} {erfahrungJahre === 1 ? 'Jahr' : 'Jahre'} Erfahrung
                  </span>
                )}
                {hatGarten && (
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
                    🌿 Hat Garten
                  </span>
                )}
                {kannMedikamente && (
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(3,105,161,0.08)', color: '#0369a1' }}>
                    💊 Kann Medikamente geben
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Leistungen */}
          {leistungen.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#7A9DBF] uppercase tracking-wide mb-2">Leistungen</h3>
              <div className="flex flex-wrap gap-2">
                {leistungen.map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-[#EEF2F8] text-[#2E4A6B]">
                    {LEISTUNGS_CHIPS[l] ?? l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Einsatzgebiet */}
          {(radiusKm !== undefined || ort) && (
            <div>
              <h3 className="text-xs font-bold text-[#7A9DBF] uppercase tracking-wide mb-2">Einsatzgebiet</h3>
              <p className="text-sm text-[#4E779F]">
                📍 {radiusKm !== undefined ? `${radiusKm} km Umkreis um ` : ''}{ort}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-[#EEF2F8]">
          {kannKontakt ? (
            <button
              onClick={onKontakt}
              className="w-full bg-[#2E4A6B] text-white font-bold py-3 rounded-xl hover:bg-[#1E3249] transition-colors"
            >
              Kontakt aufnehmen →
            </button>
          ) : nichtAngemeldet ? (
            <Link
              href="/register"
              className="block w-full text-center bg-[#2E4A6B] text-white font-bold py-3 rounded-xl hover:bg-[#1E3249] transition-colors"
            >
              Als Tierhalter registrieren →
            </Link>
          ) : null /* Sitter sieht keinen CTA beim anderen Sitter */}
        </div>
      </div>
    </div>,
    document.body
  )
}
