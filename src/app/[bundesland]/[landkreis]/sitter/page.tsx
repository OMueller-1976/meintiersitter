export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MOCK_SITTER } from '@/lib/mock-data'
import SitterCard from '@/components/portal/SitterCard'

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
    if (!data) notFound()
    if (!data.is_active) notFound()
    regionId = data.id
  } catch {
    // Fallback auf Mock-Daten
  }

  type SitterRow = {
    id: string
    full_name: string
    ortschaft: string
    beschreibung: string | null
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
      // Fallback auf Mock-Daten
    }
  }

  const useMock = sitters.length === 0

  return (
    <div className="flex flex-col gap-5">
      <div>
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
        <p className="text-sm text-secondary mt-1">Alle verfügbaren Tiersitter in Deiner Region.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {useMock
          ? MOCK_SITTER.map((s) => (
              <SitterCard
                key={s.id}
                name={s.name}
                ortschaft={s.ortschaft}
                beschreibung={s.beschreibung}
                fotoUrl={s.foto}
                avgRating={s.avg_rating}
                totalReviews={s.total_reviews}
                leistungen={s.leistungen}
                hatGarten={s.hat_garten}
                kannMedikamente={s.kann_medikamente}
                isDummy={true}
              />
            ))
          : sitters.map((s) => (
              <SitterCard
                key={s.id}
                name={s.full_name}
                ortschaft={s.ortschaft}
                beschreibung={s.beschreibung ?? undefined}
                fotoUrl={s.foto_url ?? undefined}
                avgRating={s.avg_rating}
                totalReviews={s.total_reviews}
                leistungen={s.leistungen}
                hatGarten={s.hat_garten}
                kannMedikamente={s.kann_medikamente}
                isDummy={s.is_dummy}
              />
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
