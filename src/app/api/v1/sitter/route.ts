import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get('regionId')
  const leistungen = searchParams.get('leistungen')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  let query = supabase
    .from('sitter_profiles')
    .select('id, display_name, avatar_url, kurzbeschreibung, wohnort, plz, leistungen, rating_avg, rating_count, is_dummy, garten_vorhanden, medikamente_moeglich')
    .eq('is_active', true)

  if (regionId) query = query.eq('region_id', regionId)
  if (leistungen) query = query.contains('leistungen', [leistungen])

  const { data, error } = await query.order('rating_avg', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
