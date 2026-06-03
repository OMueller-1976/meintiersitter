export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import GesucheCarousel from '@/components/portal/GesucheCarousel'
import SitterCarousel from '@/components/portal/SitterCarousel'
import MatchKacheln from '@/components/portal/MatchKacheln'
import type { Profile } from '@/types'

const BUNDESLAND = 'rheinland-pfalz'
const LANDKREIS = 'daun'
const LANDKREIS_NAME = 'Daun'

export const metadata: Metadata = {
  title: `Tiersitti – ${LANDKREIS_NAME}`,
}

function buildSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  })
}

export default async function DaunPage() {
  const cookieStore = await cookies()

  // Region laden
  let region: { id: string; landkreis_name: string; is_active: boolean } | null = null
  try {
    const supabase = buildSupabase(cookieStore)
    const { data, error } = await supabase
      .from('regions')
      .select('id, landkreis_name, is_active')
      .eq('bundesland_slug', BUNDESLAND)
      .eq('landkreis_slug', LANDKREIS)
      .maybeSingle()
    if (error) throw error
    region = data
  } catch (err) {
    console.error('[DaunPage] Fehler beim Laden der Region:', err)
  }

  if (region && !region.is_active) {
    return (
      <div className="flex items-center justify-center min-h-full py-16">
        <div className="tile text-center p-12 max-w-lg">
          <div className="text-4xl mb-4">🐾</div>
          <h1 className="text-2xl font-extrabold mb-3">
            Tiersitti kommt nach {region.landkreis_name}!
          </h1>
          <p className="text-secondary mb-6">
            Wir arbeiten daran, Tiersitti in Deiner Region zu starten.
            Trag Dich auf die Warteliste ein – Du wirst als Erster informiert.
          </p>
          <form action="/api/v1/waitlist" method="POST" className="flex flex-col gap-3 max-w-sm mx-auto">
            <input type="hidden" name="landkreis" value={LANDKREIS} />
            <input
              type="email"
              name="email"
              required
              placeholder="Deine E-Mail-Adresse"
              className="glass-input text-center"
            />
            <button type="submit" className="btn-primary">
              Auf Warteliste eintragen
            </button>
          </form>
          <p className="text-xs text-muted mt-4">Kein Spam – nur die Launch-Benachrichtigung.</p>
        </div>
      </div>
    )
  }

  // User + Profil laden
  let user: { id: string; user_metadata?: Record<string, string> } | null = null
  let profile: Profile | null = null

  try {
    const supabase = buildSupabase(cookieStore)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser

    if (authUser) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single<Profile>()
      if (error) throw error
      profile = data
    }
  } catch (err) {
    console.error('[DaunPage] Fehler beim Laden des Profils:', err)
  }

  const vorname = profile?.full_name?.split(' ')[0] ?? ''
  const regionName = region?.landkreis_name ?? LANDKREIS_NAME

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">
          {user && vorname
            ? `Guten Tag, ${vorname}! 🐾`
            : `Willkommen bei Tiersitti ${regionName} 🐾`}
        </h1>
        <p className="text-sm text-secondary mt-1">
          {user
            ? 'Hier ist was heute in der Region los ist.'
            : `Finde oder werde ein Tiersitter in ${regionName}.`}
        </p>
      </div>

      <MatchKacheln isLoggedIn={!!user} userRole={profile?.role} />

      <div className="tile p-4">
        <GesucheCarousel />
      </div>

      <div className="tile p-4">
        <SitterCarousel bundesland={BUNDESLAND} landkreis={LANDKREIS} />
      </div>
    </div>
  )
}
