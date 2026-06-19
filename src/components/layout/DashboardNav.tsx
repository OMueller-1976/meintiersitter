'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/(dashboard)/dashboard/actions';
import type { Profile, UserRole } from '@/types';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

function getTierhalterNav(): NavItem[] {
  return [
    { icon: '🏠', label: 'Übersicht', href: '/dashboard' },
    { icon: '🐾', label: 'Meine Tiere', href: '/dashboard/tiere' },
    { icon: '📋', label: 'Meine Gesuche', href: '/dashboard/postings' },
    { icon: '🔍', label: 'Sitter suchen', href: '/dashboard/sitter-suchen' },
    { icon: '💬', label: 'Nachrichten', href: '/dashboard/nachrichten' },
    { icon: '⭐', label: 'Bewertungen', href: '/dashboard/bewertungen' },
    { icon: '🏪', label: 'Marktplatz', href: '/marktplatz' },
    { icon: '👤', label: 'Mein Profil', href: '/dashboard/profil' },
  ];
}

function getSitterNav(): NavItem[] {
  return [
    { icon: '🏠', label: 'Übersicht', href: '/dashboard' },
    { icon: '🗓', label: 'Verfügbarkeit', href: '/dashboard/verfuegbarkeit' },
    { icon: '📋', label: 'Anfragen', href: '/dashboard/anfragen' },
    { icon: '💬', label: 'Nachrichten', href: '/dashboard/nachrichten' },
    { icon: '⭐', label: 'Meine Bewertungen', href: '/dashboard/bewertungen' },
    { icon: '👤', label: 'Mein Profil', href: '/dashboard/profil' },
  ];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface Props {
  role: UserRole;
  profile: Profile;
}

export default function DashboardNav({ role, profile }: Props) {
  const pathname = usePathname();
  const isSitterRole = role === 'sitter' || role === 'beide';
  const navItems = isSitterRole ? getSitterNav() : getTierhalterNav();
  const roleName = isSitterRole ? 'Sitter' : 'Tierhalter';

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(14px)', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
        {/* Logo */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-white">🐾 Tiersitti</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Mein Dashboard</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-white font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={isActive(item.href) ? {
                    background: 'rgba(74,222,128,0.18)',
                    borderLeft: '3px solid var(--accent-green)',
                  } : { borderLeft: '3px solid transparent' }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: 'var(--accent-green)', color: '#0f172a' }}>
              {getInitials(profile.full_name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile.full_name}</p>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                {roleName}
              </span>
            </div>
          </div>
          <button
            onClick={async () => { await logoutAction(); }}
            className="w-full text-left px-3 py-2 text-sm rounded-xl transition-colors hover:text-red-400"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            ← Abmelden
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-60 flex-shrink-0" />

      {/* ── Mobile Bottom Nav ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{ background: 'rgba(15,76,129,0.9)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${
                  isActive(item.href) ? 'text-white' : 'text-white/50'
                }`}
                style={isActive(item.href) ? { color: 'var(--accent-green)' } : {}}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] leading-none">{item.label.split(' ')[0]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
