export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MOCK_SITTER, LEISTUNGS_CHIPS } from '@/lib/mock-data'

interface Props {
  params: Promise<{ bundesland: string; landkreis: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landkreis } = await params
  const name = landkreis.charAt(0).toUpperCase() + landkreis.slice(1)
  return {
    title: `Sitter in ${name} – Tiersitti`,
    description: `Alle Tiersitter im Kreis ${name} auf einen Blick.`,
  }
}

function buildSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  })
}

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

export default async function SitterOverviewPage({ params }: Props) {
  const { bundesland, landkreis } = await params
  const landkreisName = landkreis.charAt(0).toUpperCase() + landkreis.slice(1)
  const cookieStore = await cookies()

  // Region validieren
  let regionId: string | null = null
  try {
    const supabase = buildSupabase(cookieStore)
    const { data, error } = await supabase
      .from('regions')
      .select('id, is_active')
      .eq('bundesland_slug', bundesland)
      .eq('landkreis_slug', landkreis)
      .maybeSingle()
    if (error) throw error
    if (data?.is_active) regionId = data.id
    else if (data && !data.is_active) notFound()
    else notFound()
  } catch {
    // Fallback: Mock-Daten anzeigen
  }

  // Echte Sitter laden (graceful fallback auf Mock)
  type SitterRow = {
    id: string
    full_name: string
    ortschaft: string
    beschreibung: string
    foto_url: string | null
    avg_rating: number
    total_reviews: number
    leistungen: string[]
    hat_garten: boolean
    kann_medikamente: boolean
    is_dummy: boolean
  }
  let sitters: SitterRow[] = []
  if (regionId) {
    try {
      const supabase = buildSupabase(cookieStore)
      const { data, error } = await supabase
        .from('sitter_profiles')
        .select('id, full_name, ortschaft, beschreibung, foto_url, avg_rating, total_reviews, leistungen, hat_garten, kann_medikamente, is_dummy')
        .eq('region_id', regionId)
        .order('avg_rating', { ascending: false })
      if (error) throw error
      if (data && data.length > 0) sitters = data as SitterRow[]
    } catch {
      // Fallback auf Mock
    }
  }

  const useMock = sitters.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link
          href={`/${bundesland}/${landkreis}`}
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}
        >
          ← Portal {landkreisName}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold">Sitter in {landkreisName} 🐾</h1>
        <p className="text-sm text-secondary mt-1">
          Alle verfügbaren Tiersitter in Deiner Region.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {useMock
          ? MOCK_SITTER.map((s) => (
              <div key={s.id} className="tile p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.foto} alt={s.name} className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      <span className="font-bold text-sm truncate">{s.name}</span>
                      <span style={BADGE_STYLE}>📌 Beispiel</span>
                    </div>
                    <div className="text-xs text-muted truncate">📍 {s.ortschaft}</div>
                    <div className="text-xs text-secondary">⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews})</div>
                  </div>
                </div>
                <p className="text-xs text-secondary leading-relaxed line-clamp-3">{s.beschreibung}</p>
                <div className="flex flex-wrap gap-1">
                  {s.leistungen.map((l) => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0f4f8', color: '#4a5568' }}>
                      {LEISTUNGS_CHIPS[l] ?? l}
                    </span>
                  ))}
                </div>
                {(s.hat_garten || s.kann_medikamente) && (
                  <div className="flex flex-wrap gap-1">
                    {s.hat_garten && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
                        🌿 Garten
                      </span>
                    )}
                    {s.kann_medikamente && (
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
            ))
          : sitters.map((s) => (
              <div key={s.id} className="tile p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                  {s.foto_url && (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#d0e4f7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.foto_url} alt={s.full_name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      <span className="font-bold text-sm truncate">{s.full_name}</span>
                      {s.is_dummy && <span style={BADGE_STYLE}>📌 Beispiel</span>}
                    </div>
                    <div className="text-xs text-muted truncate">📍 {s.ortschaft}</div>
                    <div className="text-xs text-secondary">⭐ {s.avg_rating.toFixed(1)} ({s.total_reviews})</div>
                  </div>
                </div>
                {s.beschreibung && (
                  <p className="text-xs text-secondary leading-relaxed line-clamp-3">{s.beschreibung}</p>
                )}
                {s.leistungen?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {s.leistungen.map((l) => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f0f4f8', color: '#4a5568' }}>
                        {LEISTUNGS_CHIPS[l] ?? l}
                      </span>
                    ))}
                  </div>
                )}
                {(s.hat_garten || s.kann_medikamente) && (
                  <div className="flex flex-wrap gap-1">
                    {s.hat_garten && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#15803d' }}>
                        🌿 Garten
                      </span>
                    )}
                    {s.kann_medikamente && (
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
            ))}
      </div>

      {useMock && (
        <p className="text-xs text-muted text-center pt-2">
          Beispieldaten – registriere Dich, um echte Sitter in Deiner Region zu sehen.
        </p>
      )}
    </div>
  )
}
