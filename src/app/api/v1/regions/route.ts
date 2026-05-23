import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bundesland = searchParams.get('bundesland')
  const isActive = searchParams.get('is_active')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  let query = supabase.from('regions').select('id, bundesland_slug, bundesland_name, landkreis_slug, landkreis_name, is_active, tierheim_name, lat, lng')

  if (bundesland) query = query.eq('bundesland_slug', bundesland)
  if (isActive === 'true') query = query.eq('is_active', true)

  const { data, error } = await query.order('landkreis_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // For RegionFilter: return slug+name pairs
  const result = (data ?? []).map((r) => ({ slug: r.landkreis_slug, name: r.landkreis_name, is_active: r.is_active }))
  return NextResponse.json(result)
}
