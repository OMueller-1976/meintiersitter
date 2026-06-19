export const dynamic = 'force-dynamic'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LandkreisHeader from '@/components/portal/LandkreisHeader'
import LeftSidebar from '@/components/portal/LeftSidebar'
import RightSidebar from '@/components/portal/RightSidebar'
import SpendenModalTrigger from '@/components/shared/SpendenModalTrigger'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <LandkreisHeader user={user} bundesland="rheinland-pfalz" landkreis="daun" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="portal-sidebar-left">
          <LeftSidebar isLoggedIn={!!user} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: 'var(--content-bg)' }}>
          {children}
        </main>

        <div className="portal-sidebar-right">
          <RightSidebar />
        </div>
      </div>
      <SpendenModalTrigger />
    </div>
  )
}
