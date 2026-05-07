import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import PortalHeader from '@/components/portal/PortalHeader';
import LeftSidebar from '@/components/portal/LeftSidebar';
import RightSidebar from '@/components/portal/RightSidebar';

export default async function DaunPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // read-only in Server Components
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <PortalHeader user={user} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Linke Sidebar – auf Mobile versteckt */}
        <div className="portal-sidebar-left">
          <LeftSidebar isLoggedIn={!!user} />
        </div>

        {/* Haupt-Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#F1F5F9',
            padding: '1.25rem',
          }}
        >
          {children}
        </main>

        {/* Rechte Sidebar – auf Mobile versteckt */}
        <div className="portal-sidebar-right">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
