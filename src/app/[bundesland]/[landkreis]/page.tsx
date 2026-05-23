export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import GesucheCarousel from '@/components/portal/GesucheCarousel'
import SitterCarousel from '@/components/portal/SitterCarousel'
import MatchKacheln from '@/components/portal/MatchKacheln'
import DonationProgress from '@/components/DonationProgress'
import type { Profile } from '@/types'

interface Props {
  params: Promise<{ bundesland: string; landkreis: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { landkreis } = await params
  return {
    title: `Tiersitti – ${landkreis.charAt(0).toUpperCase() + landkreis.slice(1)}`,
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

export default async function LandkreisPage({ params }: Props) {
  const { bundesland, landkreis } = await params
  const cookieStore = await cookies()

  // Region laden — notFound() wenn ungültig
  let region: { id: string; landkreis_name: string; is_active: boolean } | null = null
  try {
    const supabase = buildSupabase(cookieStore)
    const { data, error } = await supabase
      .from('regions')
      .select('id, landkreis_name, is_active')
      .eq('bundesland_slug', bundesland)
      .eq('landkreis_slug', landkreis)
      .maybeSingle()
    if (error) throw error
    region = data
  } catch (err) {
    console.error('[LandkreisPage] Fehler beim Laden der Region:', err)
  }

  if (!region) notFound()

  if (!region.is_active) {
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
            <input type="hidden" name="landkreis" value={landkreis} />
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

  // User + Profil laden — graceful fallback wenn nicht eingeloggt oder DB-Fehler
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
    console.error('[LandkreisPage] Fehler beim Laden des Profils:', err)
    // Graceful fallback: nicht-eingeloggter View anzeigen
  }

  const vorname = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">
          {user && vorname
            ? `Guten Tag, ${vorname}! 🐾`
            : `Willkommen bei Tiersitti ${region.landkreis_name} 🐾`}
        </h1>
        <p className="text-sm text-secondary mt-1">
          {user
            ? 'Hier ist was heute in der Region los ist.'
            : `Finde oder werde ein Tiersitter in ${region.landkreis_name}.`}
        </p>
      </div>

      <MatchKacheln isLoggedIn={!!user} userRole={profile?.role} />

      <div className="tile p-4">
        <GesucheCarousel />
      </div>

      <div className="tile p-4">
        <SitterCarousel bundesland={bundesland} landkreis={landkreis} />
      </div>

      <DonationProgress regionId={region.id} />
    </div>
  )
}
