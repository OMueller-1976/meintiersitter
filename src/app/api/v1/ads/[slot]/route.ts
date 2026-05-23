import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get('regionId')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const now = new Date().toISOString()
  let query = supabase
    .from('ad_slots')
    .select('id, ad_image_url, ad_link_url, alt_text, advertiser_name')
    .eq('slot_name', slot)
    .eq('is_active', true)
    .or(`valid_from.is.null,valid_from.lte.${now}`)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .limit(1)

  if (regionId) query = query.eq('region_id', regionId)

  const { data, error } = await query.maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json(null, { status: 204 })
  return NextResponse.json(data)
}
