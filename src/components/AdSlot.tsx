import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface AdSlotProps {
  slot: string
  regionId?: string
}

export default async function AdSlot({ slot, regionId }: AdSlotProps) {
  let ad: { ad_link_url: string; ad_image_url: string; alt_text: string } | null = null

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase env vars missing')

    const cookieStore = await cookies()
    const supabase = createServerClient(url, key, {
      cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
    })

    const now = new Date().toISOString()
    let query = supabase
      .from('ad_slots')
      .select('ad_link_url, ad_image_url, alt_text')
      .eq('slot_name', slot)
      .eq('is_active', true)
      .or(`valid_from.is.null,valid_from.lte.${now}`)
      .or(`valid_until.is.null,valid_until.gte.${now}`)
      .limit(1)

    if (regionId) query = query.eq('region_id', regionId)

    const { data, error } = await query.maybeSingle()
    if (error) throw error
    ad = data
  } catch (err) {
    console.error('[AdSlot] Fehler beim Laden:', err)
    // Graceful fallback: Spenden-CTA anzeigen
  }

  return (
    <div className="tile overflow-hidden" style={{ width: 300, minHeight: 250 }}>
      {ad ? (
        <a href={ad.ad_link_url} target="_blank" rel="noopener sponsored" className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.ad_image_url} alt={ad.alt_text ?? 'Werbung'} className="w-full h-full object-cover" />
        </a>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-3">
          <div className="text-3xl">🐾</div>
          <p className="font-bold text-base">Tiersitti unterstützen</p>
          <p className="text-sm text-muted leading-relaxed">
            50 % jeder Spende ab 500 € gehen ans lokale Tierheim.
          </p>
          <Link
            href="/spenden"
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-900"
            style={{ background: 'var(--accent-green)' }}
          >
            Jetzt spenden →
          </Link>
        </div>
      )}
    </div>
  )
}
