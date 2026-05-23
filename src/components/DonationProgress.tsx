import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface DonationProgressProps {
  regionId?: string
}

export default async function DonationProgress({ regionId }: DonationProgressProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  let query = supabase.from('donation_stats').select(`
    total_received_eur, milestone_eur,
    regions ( tierheim_name, landkreis_name )
  `)

  if (regionId) {
    query = query.eq('region_id', regionId)
  } else {
    query = query.is('region_id', null)
  }

  const { data } = await query.maybeSingle()

  const current = Number(data?.total_received_eur ?? 0)
  const milestone = Number(data?.milestone_eur ?? 500)
  const percent = Math.min((current / milestone) * 100, 100)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tierheimName = (data as any)?.regions?.tierheim_name ?? 'das Tierheim'

  return (
    <div className="tile p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">🐾 Spenden für {tierheimName}</span>
        <span className="text-sm text-muted">
          {current.toFixed(0)} / {milestone.toFixed(0)} €
        </span>
      </div>
      <div className="w-full rounded-full h-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: 'var(--accent-green)' }}
        />
      </div>
      <p className="text-xs text-muted mt-2">
        50 % der Spenden ab {milestone.toFixed(0)} € gehen ans Tierheim
      </p>
    </div>
  )
}
