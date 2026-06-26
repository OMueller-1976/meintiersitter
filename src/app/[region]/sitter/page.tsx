export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import SitterCard from '@/components/portal/SitterCard'
import { getAktiveSitter } from '@/lib/queries/sitter'
import { getMatchProzenteForTierhalter } from '@/lib/queries/matching'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'

interface Props {
  params: { region: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cfg = REGIONS[params.region as RegionSlug]
  if (!cfg) return {}
  return {
    title: `Sitter in ${cfg.name} – Tiersitti`,
    description: `Alle Tiersitter im ${cfg.name} auf einen Blick.`,
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

function getLeistungen(sp: {
  bietet_gassi: boolean | null
  bietet_fuettern: boolean | null
  bietet_tagesbetreuung: boolean | null
  bietet_uebernachtung: boolean | null
} | null | undefined): string[] {
  if (!sp) return []
  const l: string[] = []
  if (sp.bietet_gassi) l.push('gassi')
  if (sp.bietet_fuettern) l.push('fuettern')
  if (sp.bietet_tagesbetreuung) l.push('tagesbetreuung')
  if (sp.bietet_uebernachtung) l.push('uebernachtung')
  return l
}

export default async function RegionSitterPage({ params }: Props) {
  const { region } = params

  if (!(region in REGIONS)) notFound()
  const regionConfig = REGIONS[region as RegionSlug]

  const cookieStore = await cookies()

  // Region validieren
  try {
    const supabase = buildSupabase(cookieStore)
    const { data, error } = await supabase
      .from('regions')
      .select('id, is_active')
      .eq('landkreis_slug', region)
      .maybeSingle()
    if (error) throw error
    if (!data || !data.is_active) notFound()
  } catch {
    // Bei DB-Fehler trotzdem anzeigen
  }

  // User laden für Kontakt-Button + Match-Prozente
  let userId: string | null = null
  let userRole: string | null = null
  try {
    const supabase = buildSupabase(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      userRole = profile?.role ?? null
    }
  } catch { /* ignore */ }

  const sitters = await getAktiveSitter({ region: regionConfig.dbRegion })

  let matchProzente: Record<string, number> = {}
  if (userId && (userRole === 'tierhalter' || userRole === 'beide') && sitters.length > 0) {
    matchProzente = await getMatchProzenteForTierhalter(userId, sitters.map((s) => s.id))
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href={`/${region}`}
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-green)' }}
        >
          ← Portal {regionConfig.name}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold">Sitter in {regionConfig.name} 🐾</h1>
        <p className="text-sm text-secondary mt-1">Alle verfügbaren Tiersitter in Deiner Region.</p>
      </div>

      {sitters.length === 0 ? (
        <div className="tile p-12 text-center">
          <div className="text-4xl mb-3">🐾</div>
          <p className="text-secondary font-medium mb-1">Noch keine Sitter registriert.</p>
          <p className="text-sm text-muted mb-4">Sei der Erste in {regionConfig.name}!</p>
          <Link
            href="/register?role=sitter"
            className="inline-block text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}
          >
            Als Sitter registrieren →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sitters.map((s) => {
            const sp = Array.isArray(s.sitter_profiles) ? s.sitter_profiles[0] : s.sitter_profiles
            return (
              <SitterCard
                key={s.id}
                sitterId={s.id}
                name={s.full_name}
                ortschaft={s.ort ?? s.ortschaft ?? ''}
                beschreibung={s.bio ?? undefined}
                fotoUrl={s.avatar_url ?? undefined}
                avgRating={sp?.avg_rating ?? 0}
                totalReviews={sp?.total_reviews ?? 0}
                leistungen={getLeistungen(sp)}
                hatGarten={sp?.hat_garten ?? false}
                kannMedikamente={sp?.kann_medikamente ?? false}
                betreuungBeimSitter={sp?.betreuung_beim_sitter ?? false}
                notfallVerfuegbar={sp?.notfall_verfuegbar ?? false}
                erfahrungJahre={sp?.erfahrung_jahre ?? undefined}
                radiusKm={sp?.radius_km ?? undefined}
                isDummy={s.ist_beispiel ?? false}
                isLoggedIn={!!userId}
                userRole={userRole ?? undefined}
                matchProzent={matchProzente[s.id]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
