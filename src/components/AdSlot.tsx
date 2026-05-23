import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface AdSlotProps {
  slot: string
  regionId?: string
}

export default async function AdSlot({ slot, regionId }: AdSlotProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const now = new Date().toISOString()
  let query = supabase
    .from('ad_slots')
    .select('*')
    .eq('slot_name', slot)
    .eq('is_active', true)
    .or(`valid_from.is.null,valid_from.lte.${now}`)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .limit(1)

  if (regionId) {
    query = query.eq('region_id', regionId)
  }

  const { data } = await query.maybeSingle()

  return (
    <div
      className="tile overflow-hidden"
      style={{ width: 300, minHeight: 250 }}
    >
      {data ? (
        <a
          href={data.ad_link_url}
          target="_blank"
          rel="noopener sponsored"
          className="block w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.ad_image_url}
            alt={data.alt_text ?? 'Werbung'}
            className="w-full h-full object-cover"
          />
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
