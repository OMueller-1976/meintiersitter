export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LandkreisHeader from '@/components/portal/LandkreisHeader'
import LeftSidebar from '@/components/portal/LeftSidebar'
import RightSidebar from '@/components/portal/RightSidebar'
import SpendenModalTrigger from '@/components/shared/SpendenModalTrigger'
import { REGIONS } from '@/lib/regions'
import type { RegionSlug } from '@/lib/regions'

interface Props {
  children: React.ReactNode
  params: { region: string }
}

export default async function RegionLayout({ children, params }: Props) {
  const { region } = params

  if (!(region in REGIONS)) {
    notFound()
  }

  const cfg = REGIONS[region as RegionSlug]

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <LandkreisHeader
        user={user}
        bundesland="rheinland-pfalz"
        landkreis={cfg.dbRegion}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="portal-sidebar-left">
          <LeftSidebar isLoggedIn={!!user} region={region} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: 'var(--content-bg)' }}>
          {children}
        </main>

        <div className="portal-sidebar-right">
          <RightSidebar region={region} />
        </div>
      </div>
      <SpendenModalTrigger />
    </div>
  )
}
