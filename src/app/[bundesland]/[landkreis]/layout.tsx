import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import LandkreisLeftSidebar from '@/components/portal/LandkreisLeftSidebar'
import LandkreisRightSidebar from '@/components/portal/LandkreisRightSidebar'
import LandkreisHeader from '@/components/portal/LandkreisHeader'

interface Props {
  children: React.ReactNode
  params: Promise<{ bundesland: string; landkreis: string }>
}

export default async function LandkreisLayout({ children, params }: Props) {
  const { bundesland, landkreis } = await params
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <LandkreisHeader user={user} bundesland={bundesland} landkreis={landkreis} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div className="portal-sidebar-left">
          <LandkreisLeftSidebar isLoggedIn={!!user} bundesland={bundesland} landkreis={landkreis} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {children}
        </main>

        <div className="portal-sidebar-right">
          <LandkreisRightSidebar />
        </div>
      </div>
    </div>
  )
}
