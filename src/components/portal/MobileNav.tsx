'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buildNavGroups, loggedInGroup } from './LeftSidebar'

interface Props {
  isLoggedIn?: boolean
  region: string
}

/**
 * Mobile Navigation: Bottom-Tab-Bar + "Mehr"-Sheet.
 * Ersetzt die auf Smartphones ausgeblendete linke Sidebar (sichtbar < 768px, siehe globals.css).
 */
export default function MobileNav({ isLoggedIn, region }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Sheet bei Navigation schliessen
  useEffect(() => { setOpen(false) }, [pathname])

  // Escape schliesst, Fokus ins Sheet
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    sheetRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const tabs = [
    { icon: '🏠', label: 'Portal', href: `/${region}`, match: (p: string) => p === `/${region}` },
    { icon: '🐾', label: 'Sitter', href: `/${region}/sitter`, match: (p: string) => p.startsWith(`/${region}/sitter`) },
    { icon: '🏪', label: 'Marktplatz', href: `/${region}/marktplatz`, match: (p: string) => p.startsWith(`/${region}/marktplatz`) },
    isLoggedIn
      ? { icon: '📊', label: 'Konto', href: '/dashboard', match: (p: string) => p.startsWith('/dashboard') }
      : { icon: '🔑', label: 'Anmelden', href: '/login', match: (p: string) => p.startsWith('/login') },
  ]

  const groups = [...buildNavGroups(region), ...(isLoggedIn ? [loggedInGroup] : [])]

  const tabClass = (active: boolean) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-semibold ${
      active ? 'text-[#0f4c81]' : 'text-[#4E779F]'
    }`

  return (
    <div className="portal-mobile-nav">
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }}
            aria-hidden="true"
          />
          <div
            ref={sheetRef}
            id="mobile-nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61,
              background: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
              maxHeight: '75dvh', overflowY: 'auto', padding: '1rem 1rem 5rem',
              outline: 'none',
            }}
          >
            {groups.map((g, gi) => (
              <div key={gi} className="mb-4">
                {g.label && (
                  <p className="text-xs font-bold tracking-wide text-[#4E779F] mb-1">{g.label}</p>
                )}
                {g.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 min-h-[44px] px-2 rounded-lg text-sm text-[#1E3249] hover:bg-[#F0F6FC]"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      <nav
        aria-label="Hauptnavigation"
        className="flex bg-white border-t border-[#d0e4f7]"
        style={{ position: 'relative', zIndex: 62, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {tabs.map((t) => {
          const active = t.match(pathname ?? '')
          return (
            <Link key={t.href} href={t.href} className={tabClass(active)} aria-current={active ? 'page' : undefined}>
              <span className="text-lg" aria-hidden="true">{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav-sheet"
          className={tabClass(open)}
        >
          <span className="text-lg" aria-hidden="true">☰</span>
          <span>Mehr</span>
        </button>
      </nav>
    </div>
  )
}
