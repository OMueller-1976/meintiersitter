import { createClient } from '@/lib/supabase/server'

export async function getAktiveSitter(filters?: {
  ort?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select(`
      id, full_name, ort, ortschaft, avatar_url, bio, ist_beispiel,
      sitter_profiles (
        erfahrung_jahre, hat_garten, kann_medikamente, betreuung_beim_sitter, notfall_verfuegbar,
        bietet_gassi, bietet_fuettern,
        bietet_tagesbetreuung, bietet_uebernachtung,
        avg_rating, total_reviews, radius_km
      )
    `)
    .eq('role', 'sitter')

  if (filters?.ort && filters.ort !== 'Alle Ortschaften') {
    query = query.eq('ort', filters.ort)
  }

  const { data, error } = await query
  if (error) {
    console.error('getAktiveSitter error:', error)
    return []
  }
  // Nur Sitter mit sitter_profiles Eintrag
  return (data ?? []).filter(s => s.sitter_profiles)
}
