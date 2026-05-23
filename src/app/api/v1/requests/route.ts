import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get('regionId')
  const betreuungsart = searchParams.get('betreuungsart')
  const onlyReal = searchParams.get('onlyReal') === 'true'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  let query = supabase
    .from('care_requests')
    .select('id, betreuungsart, startdatum, enddatum, zeitfenster, beschreibung, status, is_dummy, created_at, region_id')
    .eq('status', 'offen')

  if (regionId) query = query.eq('region_id', regionId)
  if (betreuungsart) query = query.eq('betreuungsart', betreuungsart)
  if (onlyReal) query = query.eq('is_dummy', false)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
