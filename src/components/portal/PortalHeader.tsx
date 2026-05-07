'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PortalHeaderProps {
  user?: { email?: string; user_metadata?: { full_name?: string; role?: string } } | null;
}

export default function PortalHeader({ user }: PortalHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fullName = user?.user_metadata?.full_name ?? user?.email ?? '';
  const role = user?.user_metadata?.role ?? '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--vke-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        flexShrink: 0,
        zIndex: 50,
        position: 'relative',
      }}
    >
      {/* Links: VKE Logo */}
      <Link href="/daun" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
        <Image
          src="/assets/images/logo-vulkaneifel.jpg"
          alt="Landkreis Vulkaneifel"
          width={44}
          height={44}
          className="rounded-lg object-cover"
          style={{ flexShrink: 0 }}
        />
        <span className="hidden md:block" style={{ color: 'white', fontSize: 10, lineHeight: 1.3 }}>
          Landkreis<br />Vulkaneifel
        </span>
      </Link>

      {/* Mitte: Suche (Desktop) */}
      <div className="portal-search-wrap">
        <input
          type="text"
          placeholder="Ortschaft suchen..."
          disabled
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8,
            padding: '6px 12px',
            color: 'white',
            fontSize: 13,
            width: 220,
            outline: 'none',
            cursor: 'not-allowed',
          }}
        />
      </div>

      {/* Rechts: MTS Branding + Account */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>🐾 MeinTiersitter</div>
          <div style={{ color: 'var(--vke-text-secondary)', fontSize: 10 }}>Kreis Daun</div>
        </div>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--vke-accent)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 13,
              }}
              aria-label="Account-Menü"
            >
              {initials || '?'}
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 44,
                  background: 'white',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  minWidth: 160,
                  overflow: 'hidden',
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{fullName}</div>
                  {role && <div style={{ fontSize: 11, color: '#94a3b8' }}>{role}</div>}
                </div>
                <Link
                  href="/dashboard/profil"
                  onClick={() => setDropdownOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', fontSize: 13, color: '#334155', textDecoration: 'none' }}
                >
                  Profil
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  style={{ display: 'block', padding: '10px 14px', fontSize: 13, color: '#334155', textDecoration: 'none' }}
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: 13,
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    Abmelden
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/login"
              style={{
                border: '1px solid white',
                color: 'white',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              style={{
                background: 'var(--vke-accent)',
                color: 'white',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Registrieren
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
