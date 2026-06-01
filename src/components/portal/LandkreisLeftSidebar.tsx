'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  isLoggedIn?: boolean
  bundesland: string
  landkreis: string
}

export default function LandkreisLeftSidebar({ isLoggedIn, bundesland, landkreis }: Props) {
  const pathname = usePathname()
  const base = `/${bundesland}/${landkreis}`

  const groups = [
    {
      items: [
        { icon: '🏠', label: `Portal ${landkreis.charAt(0).toUpperCase() + landkreis.slice(1)}`, href: base },
        { icon: '📋', label: 'Pinnwand', href: '/pinnwand' },
        { icon: '🐾', label: 'Sitter entdecken', href: `${base}/sitter` },
      ],
    },
    {
      label: 'ERKUNDEN',
      items: [
        { icon: '🥾', label: 'Wanderrouten', href: '/ratgeber/wandern' },
        { icon: '🏖', label: 'Hundestrand', href: '/ratgeber/hundestrand' },
        { icon: '🏨', label: 'Unterkünfte', href: '/ratgeber/unterkuenfte' },
        { icon: '🏪', label: 'Marktplatz', href: '/marktplatz' },
        { icon: '📖', label: 'Ratgeber', href: '/ratgeber' },
      ],
    },
    ...(isLoggedIn
      ? [{
          label: 'MEIN BEREICH',
          items: [
            { icon: '📊', label: 'Dashboard', href: '/dashboard' },
            { icon: '⭐', label: 'Bewertungen', href: '/dashboard/bewertungen' },
          ],
        }]
      : []),
  ]

  return (
    <nav style={{
      width: 'var(--sidebar-width-left)',
      background: 'rgba(15,76,129,0.5)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      overflowY: 'auto',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div style={{ padding: '0.75rem 0' }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '0.25rem' }}>
            {group.label && (
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: 'rgba(255,255,255,0.4)',
                padding: '0.75rem 1rem 0.25rem',
                letterSpacing: '0.08em',
              }}>
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.65rem 1rem', fontSize: 14, textDecoration: 'none',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                    background: isActive ? 'rgba(74,222,128,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-green)' : '3px solid transparent',
                    transition: 'background 0.15s, color 0.15s',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexWrap: 'wrap', gap: '0.25rem',
      }}>
        {(['Impressum', 'Datenschutz', 'AGB'] as const).map((label, i) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link href={`/${label.toLowerCase()}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              {label}
            </Link>
            {i < 2 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>}
          </span>
        ))}
      </div>
    </nav>
  )
}
