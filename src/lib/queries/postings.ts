import { createClient } from '@/lib/supabase/server'

export async function getOffenePostings(filters?: {
  ort?: string
  leistung?: string
  nurNotfall?: boolean
}) {
  const supabase = await createClient()

  let query = supabase
    .from('postings')
    .select(`
      id, leistung, datum_von, datum_bis,
      uhrzeit_von, uhrzeit_bis, nachricht,
      plz, ort, status, ist_beispiel, ist_notfall, created_at,
      tier_profiles ( id, name, tierart, rasse, foto_url, foto_urls ),
      profiles!postings_tierhalter_id_fkey (
        id, full_name
      )
    `)
    .eq('status', 'offen')
    .eq('auf_pinnwand', true)
    .order('ist_notfall', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.ort && filters.ort !== 'Alle Ortschaften') {
    query = query.eq('ort', filters.ort)
  }
  if (filters?.leistung && filters.leistung !== 'Alle') {
    query = query.eq('leistung', filters.leistung)
  }
  if (filters?.nurNotfall) {
    query = query.eq('ist_notfall', true)
  }

  const { data, error } = await query
  if (error) {
    console.error('getOffenePostings error:', error)
    return []
  }
  return data ?? []
}

export async function getPostingsCount() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('postings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'offen')
    .eq('auf_pinnwand', true)
  return count ?? 0
}
