export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LandkreisHeader from '@/components/portal/LandkreisHeader'
import LeftSidebar from '@/components/portal/LeftSidebar'
import RightSidebar from '@/components/portal/RightSidebar'
import SpendenModalTrigger from '@/components/shared/SpendenModalTrigger'
import { REGIONS, getRegionSlugByDbRegion } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  let regionSlug: RegionSlug = 'daun'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('region')
      .eq('id', user.id)
      .single()
    if (profile?.region) {
      regionSlug = getRegionSlugByDbRegion(profile.region)
    }
  }

  const cfg = REGIONS[regionSlug]

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <LandkreisHeader user={user} bundesland="rheinland-pfalz" landkreis={cfg.dbRegion} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="portal-sidebar-left">
          <LeftSidebar isLoggedIn={!!user} region={regionSlug} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: 'var(--content-bg)' }}>
          {children}
        </main>

        <div className="portal-sidebar-right">
          <RightSidebar region={regionSlug} />
        </div>
      </div>
      <SpendenModalTrigger />
    </div>
  )
}
