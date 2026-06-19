import { createClient } from '@/lib/supabase/server'

export async function getMarktplatzEintraege() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('marktplatz_eintraege')
    .select('*')
    .eq('is_active', true)
    .order('kategorie')
    .order('name')

  if (error) {
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
