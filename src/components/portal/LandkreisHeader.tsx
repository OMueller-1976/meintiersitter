'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import LogoutButton from '@/components/auth/LogoutButton'

interface LandkreisHeaderProps {
  user?: User | null
  bundesland: string
  landkreis: string
}

export default function LandkreisHeader({ user, bundesland, landkreis }: LandkreisHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const fullName = user?.user_metadata?.full_name ?? user?.email ?? ''
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'rgba(15,76,129,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        flexShrink: 0,
        zIndex: 50,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', lineHeight: 1.2 }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>🐾 Tiersitti</span>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
          {bundesland === 'rheinland-pfalz' ? 'Rheinland-Pfalz' : bundesland} · {landkreis.charAt(0).toUpperCase() + landkreis.slice(1)}
        </span>
      </Link>

      {/* Search placeholder */}
      <div className="portal-search-wrap">
        <input
          type="text"
          placeholder="Ortschaft suchen..."
          disabled
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '6px 12px',
            color: 'white',
            fontSize: 13,
            width: 220,
            outline: 'none',
            cursor: 'not-allowed',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Account */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--accent-green)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0f172a', fontWeight: 700, fontSize: 13,
              }}
              aria-label="Account-Menü"
            >
              {initials || '?'}
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 44,
                background: 'rgba(15,76,129,0.95)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                minWidth: 180, overflow: 'hidden', zIndex: 100,
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 13, fontWeight: 600 }}>
                  {fullName}
                </div>
                {[['Profil', '/dashboard/profil'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                  <Link key={href} href={href} onClick={() => setDropdownOpen(false)}
                    style={{ display: 'block', padding: '10px 14px', fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                    {label}
                  </Link>
                ))}
                <LogoutButton style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px',
                  fontSize: 13, color: '#f87171', background: 'none',
                  border: 'none', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'inherit',
                }} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/login" style={{
              border: '1px solid rgba(255,255,255,0.3)', color: 'white',
              padding: '6px 14px', borderRadius: 8, fontSize: 13,
              textDecoration: 'none', fontWeight: 600,
            }}>
              Anmelden
            </Link>
            <Link href="/register" style={{
              background: 'var(--accent-green)', color: '#0f172a',
              padding: '6px 14px', borderRadius: 8, fontSize: 13,
              textDecoration: 'none', fontWeight: 700,
            }}>
              Registrieren
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
