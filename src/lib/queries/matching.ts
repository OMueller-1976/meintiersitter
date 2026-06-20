import { createClient } from '@/lib/supabase/server'
import { berechneMatchProzent, type SitterMatchProfil } from '@/lib/matching'
import { ORTSCHAFT_KOORDINATEN } from '@/lib/ortschaft-koordinaten'

type SitterMatchProfilCore = Omit<SitterMatchProfil, 'ort' | 'plz' | 'lat' | 'lng'>

function postingKoords(ort: string | null) {
  if (!ort) return { lat: null, lng: null }
  const k = ORTSCHAFT_KOORDINATEN[ort] ?? null
  return { lat: k?.lat ?? null, lng: k?.lng ?? null }
}

// Für Tierhalter: bester Sitter für eigenes offenes Gesuch
export async function getBesterMatchFuerTierhalter(userId: string) {
  const supabase = await createClient()

  const { data: posting } = await supabase
    .from('postings')
    .select('id, leistung, ort, plz, tier_profiles(tierart)')
    .eq('tierhalter_id', userId)
    .eq('status', 'offen')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!posting) return null

  const { data: sitterListe } = await supabase
    .from('profiles')
    .select(`
      id, full_name, ort, plz, latitude, longitude,
      sitter_profiles (
        betreut_hunde, betreut_katzen, betreut_kleintiere,
        bietet_gassi, bietet_fuettern,
        bietet_tagesbetreuung, bietet_uebernachtung,
        radius_km, erfahrung_jahre, avg_rating
      )
    `)
    .in('role', ['sitter', 'beide'])

  if (!sitterListe?.length) return null

  const tierProfiles = Array.isArray(posting.tier_profiles)
    ? posting.tier_profiles[0]
    : posting.tier_profiles

  const pKoords = postingKoords(posting.ort)

  let bester: { sitter: typeof sitterListe[number]; prozent: number } | null = null

  for (const s of sitterListe) {
    const sp = Array.isArray(s.sitter_profiles) ? s.sitter_profiles[0] : s.sitter_profiles
    if (!sp) continue

    const prozent = berechneMatchProzent(
      {
        tierart: (tierProfiles as { tierart?: string } | null)?.tierart as 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges' ?? 'sonstiges',
        leistung: posting.leistung,
        posting_ort: posting.ort ?? '',
        posting_plz: posting.plz ?? '',
        lat: pKoords.lat,
        lng: pKoords.lng,
      },
      {
        ort: s.ort ?? null,
        plz: s.plz ?? null,
        lat: (s as { latitude?: number | null }).latitude ?? null,
        lng: (s as { longitude?: number | null }).longitude ?? null,
        ...(sp as unknown as SitterMatchProfilCore),
      }
    )

    if (!bester || prozent > bester.prozent) {
      bester = { sitter: s, prozent }
    }
  }

  if (!bester) return null

  return {
    sitterName: bester.sitter.full_name,
    sitterOrt: bester.sitter.ort,
    sitterId: bester.sitter.id,
    prozent: bester.prozent,
    postingId: posting.id,
  }
}

// Für Sitter: bestes Gesuch für eigenes Profil
export async function getBesterMatchFuerSitter(userId: string) {
  const supabase = await createClient()

  const { data: sitterProfil } = await supabase
    .from('profiles')
    .select(`
      ort, plz, latitude, longitude,
      sitter_profiles (
        betreut_hunde, betreut_katzen, betreut_kleintiere,
        bietet_gassi, bietet_fuettern,
        bietet_tagesbetreuung, bietet_uebernachtung,
        radius_km, erfahrung_jahre, avg_rating
      )
    `)
    .eq('id', userId)
    .single()

  const sp = Array.isArray(sitterProfil?.sitter_profiles)
    ? sitterProfil.sitter_profiles[0]
    : sitterProfil?.sitter_profiles

  if (!sp) return null

  const { data: postings } = await supabase
    .from('postings')
    .select('id, leistung, ort, plz, tier_profiles(name, tierart)')
    .eq('status', 'offen')
    .eq('auf_pinnwand', true)
    .limit(50)

  if (!postings?.length) return null

  const sLat = (sitterProfil as { latitude?: number | null })?.latitude ?? null
  const sLng = (sitterProfil as { longitude?: number | null })?.longitude ?? null

  let bestes: { posting: typeof postings[number]; prozent: number } | null = null

  for (const p of postings) {
    const tp = Array.isArray(p.tier_profiles) ? p.tier_profiles[0] : p.tier_profiles
    const pKoords = postingKoords(p.ort)

    const prozent = berechneMatchProzent(
      {
        tierart: (tp as { tierart?: string } | null)?.tierart as 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges' ?? 'sonstiges',
        leistung: p.leistung,
        posting_ort: p.ort ?? '',
        posting_plz: p.plz ?? '',
        lat: pKoords.lat,
        lng: pKoords.lng,
      },
      {
        ort: sitterProfil?.ort ?? null,
        plz: sitterProfil?.plz ?? null,
        lat: sLat,
        lng: sLng,
        ...(sp as unknown as SitterMatchProfilCore),
      }
    )

    if (!bestes || prozent > bestes.prozent) {
      bestes = { posting: p, prozent }
    }
  }

  if (!bestes) return null

  const tp = Array.isArray(bestes.posting.tier_profiles)
    ? bestes.posting.tier_profiles[0]
    : bestes.posting.tier_profiles

  return {
    tierName: (tp as { name?: string } | null)?.name ?? 'Unbekanntes Tier',
    postingOrt: bestes.posting.ort ?? '',
    postingId: bestes.posting.id,
    prozent: bestes.prozent,
  }
}

// Für Tierhalter: Match-Prozent für eine Liste von Sitter-IDs (für Badge-Anzeige)
export async function getMatchProzenteForTierhalter(
  userId: string,
  sitterIds: string[]
): Promise<Record<string, number>> {
  if (!sitterIds.length) return {}

  const supabase = await createClient()

  const { data: posting } = await supabase
    .from('postings')
    .select('leistung, ort, plz, tier_profiles(tierart)')
    .eq('tierhalter_id', userId)
    .eq('status', 'offen')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!posting) return {}

  const tierProfiles = Array.isArray(posting.tier_profiles) ? posting.tier_profiles[0] : posting.tier_profiles
  const pKoords = postingKoords(posting.ort)

  const { data: sitterListe } = await supabase
    .from('profiles')
    .select(`
      id, ort, plz, latitude, longitude,
      sitter_profiles (
        betreut_hunde, betreut_katzen, betreut_kleintiere,
        bietet_gassi, bietet_fuettern,
        bietet_tagesbetreuung, bietet_uebernachtung,
        radius_km, erfahrung_jahre, avg_rating
      )
    `)
    .in('id', sitterIds)

  if (!sitterListe?.length) return {}

  const result: Record<string, number> = {}

  for (const s of sitterListe) {
    const sp = Array.isArray(s.sitter_profiles) ? s.sitter_profiles[0] : s.sitter_profiles
    if (!sp) continue

    const prozent = berechneMatchProzent(
      {
        tierart: (tierProfiles as { tierart?: string } | null)?.tierart as 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges' ?? 'sonstiges',
        leistung: posting.leistung,
        posting_ort: posting.ort ?? '',
        posting_plz: posting.plz ?? '',
        lat: pKoords.lat,
        lng: pKoords.lng,
      },
      {
        ort: s.ort ?? null,
        plz: s.plz ?? null,
        lat: (s as { latitude?: number | null }).latitude ?? null,
        lng: (s as { longitude?: number | null }).longitude ?? null,
        ...(sp as unknown as SitterMatchProfilCore),
      }
    )
    result[s.id] = prozent
  }

  return result
}

// Für Sitter: Match-Prozent für eine Liste von Postings (für Badge-Anzeige)
export async function getMatchProzenteForSitter(
  userId: string,
  postings: Array<{ id: string; leistung: string; ort: string | null; plz: string | null; tier_profiles: Array<{ tierart: string }> | { tierart: string } | null }>
): Promise<Record<string, number>> {
  const supabase = await createClient()

  const { data: sitterProfil } = await supabase
    .from('profiles')
    .select(`
      ort, plz, latitude, longitude,
      sitter_profiles (
        betreut_hunde, betreut_katzen, betreut_kleintiere,
        bietet_gassi, bietet_fuettern,
        bietet_tagesbetreuung, bietet_uebernachtung,
        radius_km, erfahrung_jahre, avg_rating
      )
    `)
    .eq('id', userId)
    .single()

  const sp = Array.isArray(sitterProfil?.sitter_profiles)
    ? sitterProfil.sitter_profiles[0]
    : sitterProfil?.sitter_profiles

  if (!sp) return {}

  const sLat = (sitterProfil as { latitude?: number | null })?.latitude ?? null
  const sLng = (sitterProfil as { longitude?: number | null })?.longitude ?? null

  const result: Record<string, number> = {}

  for (const p of postings) {
    const tp = Array.isArray(p.tier_profiles) ? p.tier_profiles[0] : p.tier_profiles
    const pKoords = postingKoords(p.ort)

    const prozent = berechneMatchProzent(
      {
        tierart: (tp as { tierart?: string } | null)?.tierart as 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges' ?? 'sonstiges',
        leistung: p.leistung,
        posting_ort: p.ort ?? '',
        posting_plz: p.plz ?? '',
        lat: pKoords.lat,
        lng: pKoords.lng,
      },
      {
        ort: sitterProfil?.ort ?? null,
        plz: sitterProfil?.plz ?? null,
        lat: sLat,
        lng: sLng,
        ...(sp as unknown as SitterMatchProfilCore),
      }
    )
    result[p.id] = prozent
  }

  return result
}
