import { createClient } from '@/lib/supabase/server'

export async function getMarktplatzEintraege(region?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('marktplatz_eintraege')
    .select('*')
    .eq('is_active', true)
    .order('kategorie')
    .order('name')

  if (region) {
    query = query.eq('region', region)
  }

  const { data, error } = await query

  if (error) {
    // Fallback: region-Spalte existiert möglicherweise noch nicht — alle Einträge laden
    if (region) {
      const { data: allData, error: allError } = await supabase
        .from('marktplatz_eintraege')
        .select('*')
        .eq('is_active', true)
        .order('kategorie')
        .order('name')
      if (!allError) return allData ?? []
    }
    console.error('getMarktplatzEintraege error:', error)
    return []
  }
  return data ?? []
}

export const KATEGORIE_LABELS: Record<string, string> = {
  tiershop: '🛍️ Tierbedarf & Futter',
  tierarzt: '🩺 Tierärzte',
  tierpension: '🏠 Tierpensionen',
  hundefriseur: '✂️ Hundefriseure',
  hundeschule: '🎓 Hundeschulen',
  sonstiges: '📌 Weitere Anbieter',
}
