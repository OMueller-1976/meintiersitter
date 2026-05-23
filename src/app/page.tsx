export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RegionFilter from '@/components/RegionFilter'
import DonationProgress from '@/components/DonationProgress'
import AdSlot from '@/components/AdSlot'
import { MOCK_POSTINGS, MOCK_SITTER, LEISTUNGS_BADGE_CLASSES } from '@/lib/mock-data'
import FallbackImg from '@/components/ui/FallbackImg'

export default async function NationalHomepage() {
  let sitterCount = 0
  let requestCount = 0
  let regionCount = 1

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase env vars missing')

    const cookieStore = await cookies()
    const supabase = createServerClient(url, key, {
      cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
    })

    const [s, r, reg] = await Promise.all([
      supabase.from('sitter_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('care_requests').select('*', { count: 'exact', head: true }).eq('status', 'offen'),
      supabase.from('regions').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])
    sitterCount = s.count ?? 0
    requestCount = r.count ?? 0
    regionCount = reg.count ?? 1
  } catch (err) {
    console.error('[Homepage] Fehler beim Laden der Statistiken:', err)
    // Graceful fallback: Nullwerte anzeigen
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(15,76,129,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-extrabold text-white">🐾 Tiersitti</span>
          </Link>
          <div className="hidden md:block flex-1 max-w-lg">
            <RegionFilter />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-xl border border-white/25 hover:border-white/50 transition-colors">
              Anmelden
            </Link>
            <Link href="/register" className="text-sm font-bold text-slate-900 px-3 py-1.5 rounded-xl transition-opacity hover:opacity-90" style={{ background: 'var(--accent-green)' }}>
              Registrieren
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Tierbetreuung &amp; Tierhilfe<br />
            <span style={{ color: 'var(--accent-green)' }}>in Deiner Region</span>
          </h1>
          <p className="text-lg text-secondary mb-8 max-w-xl mx-auto">
            Finde Sitter, vernetze Dich mit Tierfreunden und entdecke tierfreundliche Orte – lokal, kostenlos, persönlich.
          </p>
          {/* Mobile RegionFilter */}
          <div className="md:hidden mb-4 flex justify-center">
            <RegionFilter />
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/rheinland-pfalz" className="tile px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity">
              🗺 Rheinland-Pfalz erkunden
            </Link>
            <Link href="/pinnwand" className="tile px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              📋 Alle Gesuche
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: sitterCount ?? 0, label: 'Sitter', icon: '🐾' },
            { value: requestCount ?? 0, label: 'Offene Gesuche', icon: '📋' },
            { value: regionCount ?? 1, label: 'Aktive Regionen', icon: '🗺' },
          ].map((s) => (
            <div key={s.label} className="tile p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-3xl font-extrabold" style={{ color: 'var(--accent-green)' }}>{s.value}</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid: content + sidebar */}
        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-8">
            {/* Neueste Gesuche */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Aktuelle Gesuche</h2>
                <Link href="/pinnwand" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-green)' }}>
                  Alle anzeigen →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_POSTINGS.map((p) => (
                  <div key={p.id} className="tile p-4 relative">
                    <span className="dummy-badge">📌 Beispiel</span>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                        <FallbackImg src={p.tier_foto} alt={p.tier_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{p.tier_name} <span className="text-muted font-normal">· {p.tier_rasse}</span></div>
                        <div className="text-xs text-muted">📍 {p.ortschaft}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${LEISTUNGS_BADGE_CLASSES[p.leistung] ?? ''}`} style={!LEISTUNGS_BADGE_CLASSES[p.leistung] ? { background: 'rgba(255,255,255,0.15)', color: 'white' } : {}}>
                        {p.leistung_label}
                      </span>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2 mb-2">{p.beschreibung}</p>
                    <div className="text-xs text-muted">📅 {p.datum_von} · 🕐 {p.uhrzeit}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Sitter */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Sitter in Deiner Region</h2>
                <Link href="/rheinland-pfalz/daun" className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-green)' }}>
                  Alle Sitter →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SITTER.map((s) => (
                  <div key={s.id} className="tile p-4 relative">
                    <span className="dummy-badge">📌 Beispiel</span>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                        <FallbackImg src={s.foto} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{s.name}</div>
                        <div className="text-xs text-muted">📍 {s.ortschaft} · ⭐ {s.avg_rating.toFixed(1)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary line-clamp-2">{s.beschreibung}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ratgeber Teaser */}
            <section>
              <h2 className="text-xl font-bold mb-4">Ratgeber & Tipps</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { href: '/ratgeber/wandern', emoji: '🥾', title: 'Wanderrouten', text: 'Hundefreundliche Routen in der Vulkaneifel' },
                  { href: '/ratgeber/hundestrand', emoji: '🏖', title: 'Hundestrand', text: 'Die besten Badeseen für Hunde' },
                  { href: '/ratgeber/unterkuenfte', emoji: '🏨', title: 'Unterkünfte', text: 'Tierfreundliche Hotels & Ferienwohnungen' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="tile p-4 hover:opacity-90 transition-opacity">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted">{item.text}</div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Donation */}
            <DonationProgress />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 w-[300px] flex-shrink-0">
            <AdSlot slot="homepage_medrec" />
            <div className="tile p-5">
              <h3 className="font-bold mb-3">Aktive Regionen</h3>
              <Link href="/rheinland-pfalz/daun" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
                <span style={{ color: 'var(--accent-green)' }}>●</span>
                <span>Vulkaneifel (Daun)</span>
              </Link>
              <p className="text-xs text-muted mt-3">Weitere Regionen folgen bald.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4 justify-between items-center">
          <span className="text-sm text-muted">© 2026 Tiersitti · tiersitti.de</span>
          <div className="flex gap-4">
            {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz'], ['AGB', '/agb']].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs text-muted hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
