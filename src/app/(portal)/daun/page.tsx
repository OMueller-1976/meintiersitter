export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import GesucheCarousel from '@/components/portal/GesucheCarousel'
import SitterCarousel from '@/components/portal/SitterCarousel'
import MatchKacheln from '@/components/portal/MatchKacheln'
import { getOffenePostings } from '@/lib/queries/postings'
import { getAktiveSitter } from '@/lib/queries/sitter'
import { getBesterMatchFuerTierhalter, getBesterMatchFuerSitter, getMatchProzenteForSitter, getMatchProzenteForTierhalter } from '@/lib/queries/matching'
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

  // Match-Daten + eigenes Gesuch + aktive Chats laden (nur wenn eingeloggt)
  let matchProzente: Record<string, number> = {}
  let matchProzenteForSitters: Record<string, number> = {}
  let bestMatch: {
    label: string
    ortLabel: string
    prozent: number
    href: string
    linkLabel: string
  } | null = null
  let eigenesGesuch: { tierName: string; href: string } | null = null
  let aktiveChats = 0

  if (user) {
    const supabase = buildSupabase(cookieStore)
    const role = profile?.role

    if (role === 'tierhalter' || role === 'beide') {
      const match = await getBesterMatchFuerTierhalter(user.id)
      if (match) {
        const nameKurz = match.sitterName
          ? match.sitterName.split(' ')[0] + (match.sitterName.split(' ')[1]?.[0] ? ' ' + match.sitterName.split(' ')[1][0] + '.' : '')
          : 'Unbekannt'
        bestMatch = {
          label: nameKurz,
          ortLabel: match.sitterOrt ? `aus ${match.sitterOrt}` : '',
          prozent: match.prozent,
          href: `/daun/sitter/${match.sitterId}`,
          linkLabel: 'Match ansehen →',
        }
      }

      // Eigenes offenes Gesuch
      const { data: posting } = await supabase
        .from('postings')
        .select('id, tier_profiles(name)')
        .eq('tierhalter_id', user.id)
        .eq('status', 'offen')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (posting) {
        const tp = Array.isArray(posting.tier_profiles) ? posting.tier_profiles[0] : posting.tier_profiles
        const tierName = (tp as { name?: string } | null)?.name ?? 'Dein Tier'
        eigenesGesuch = { tierName, href: `/dashboard/postings` }
      }
    } else if (role === 'sitter') {
      const match = await getBesterMatchFuerSitter(user.id)
      if (match) {
        bestMatch = {
          label: match.tierName,
          ortLabel: match.postingOrt ? `aus ${match.postingOrt}` : '',
          prozent: match.prozent,
          href: `/pinnwand/${match.postingId}`,
          linkLabel: 'Gesuch ansehen →',
        }
      }
    }

    // Aktive Chats (Matches mit Status 'akzeptiert')
    const { count } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true })
      .or(`tierhalter_id.eq.${user.id},sitter_id.eq.${user.id}`)
      .eq('status', 'akzeptiert')
    aktiveChats = count ?? 0
  }

  // Echte Daten laden
  const [postings, sitter] = await Promise.all([
    getOffenePostings(),
    getAktiveSitter(),
  ])

  // Match-Prozente für Sitter (zeigt Prozent auf Posting-Karten)
  if (user && (profile?.role === 'sitter' || profile?.role === 'beide') && postings.length > 0) {
    matchProzente = await getMatchProzenteForSitter(user.id, postings)
  }

  // Match-Prozente für Tierhalter (zeigt Prozent auf Sitter-Karten)
  if (user && (profile?.role === 'tierhalter' || profile?.role === 'beide') && sitter.length > 0) {
    matchProzenteForSitters = await getMatchProzenteForTierhalter(user.id, sitter.map((s) => s.id))
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

      <MatchKacheln
        isLoggedIn={!!user}
        userRole={profile?.role}
        bestMatch={bestMatch}
        eigenesGesuch={eigenesGesuch}
        aktiveChats={aktiveChats}
      />

      <div className="tile p-4">
        <GesucheCarousel postings={postings} isLoggedIn={!!user} userRole={profile?.role} matchProzente={matchProzente} />
      </div>

      <div className="tile p-4">
        <SitterCarousel sitter={sitter} isLoggedIn={!!user} userRole={profile?.role} matchProzente={matchProzenteForSitters} />
      </div>
    </div>
  )
}
