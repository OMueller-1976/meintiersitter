import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tiersitti Rheinland-Pfalz – Alle Landkreise',
  description: 'Tierbetreuung und Tierhilfe in allen Landkreisen von Rheinland-Pfalz.',
}

export default async function RheinlandPfalzPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: landkreise } = await supabase
    .from('regions')
    .select('landkreis_slug, landkreis_name, is_active, tierheim_name')
    .eq('bundesland_slug', 'rheinland-pfalz')
    .order('landkreis_name')

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(15,76,129,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-xl font-extrabold text-white">🐾 Tiersitti</Link>
          <span className="text-white/40">/</span>
          <span className="text-sm font-semibold text-white/80">Rheinland-Pfalz</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-2">Tiersitti in Rheinland-Pfalz</h1>
        <p className="text-secondary mb-8">
          Wähle Deinen Landkreis – aktive Regionen sind sofort nutzbar, weitere folgen bald.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(landkreise ?? []).map((lk) => (
            lk.is_active ? (
              <Link
                key={lk.landkreis_slug}
                href={`/rheinland-pfalz/${lk.landkreis_slug}`}
                className="tile p-4 hover:opacity-90 transition-opacity"
                style={{ border: '1.5px solid rgba(74,222,128,0.4)' }}
              >
                <div className="font-bold text-sm mb-1">{lk.landkreis_name}</div>
                {lk.tierheim_name && (
                  <div className="text-xs text-muted">{lk.tierheim_name}</div>
                )}
                <div className="text-xs mt-2" style={{ color: 'var(--accent-green)' }}>● Aktiv</div>
              </Link>
            ) : (
              <div
                key={lk.landkreis_slug}
                className="tile p-4 opacity-50 cursor-default"
              >
                <div className="font-semibold text-sm mb-1">{lk.landkreis_name}</div>
                <div className="text-xs text-muted mt-2">Bald verfügbar</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
