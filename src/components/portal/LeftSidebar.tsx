'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LeftSidebarProps {
  isLoggedIn?: boolean;
}

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      { icon: '🏠', label: 'Portal Daun', href: '/daun' },
      { icon: '📋', label: 'Pinnwand', href: '/pinnwand' },
      { icon: '🐾', label: 'Sitter entdecken', href: '/daun/sitter' },
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
  {
    label: 'ANLAUFSTELLEN',
    items: [
      { icon: '🏠', label: 'Tierheime & Vereine', href: '/anlaufstellen' },
    ],
  },
  {
    label: 'PARTNER',
    items: [
      { icon: '🤝', label: 'Förderer & Sponsoren', href: '/foerderer' },
    ],
  },
];

const loggedInGroup: NavGroup = {
  label: 'MEIN BEREICH',
  items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '💬', label: 'Nachrichten', href: '/dashboard/nachrichten' },
    { icon: '⭐', label: 'Bewertungen', href: '/dashboard/bewertungen' },
  ],
};

export default function LeftSidebar({ isLoggedIn }: LeftSidebarProps) {
  const pathname = usePathname();

  const groups = isLoggedIn ? [...navGroups, loggedInGroup] : navGroups;

  return (
    <nav
      style={{
        width: 'var(--sidebar-width-left)',
        background: 'var(--vke-blue)',
        overflowY: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ padding: '0.75rem 0' }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '0.25rem' }}>
            {group.label && (
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--vke-text-secondary)',
                  padding: '0.75rem 1rem 0.25rem',
                  letterSpacing: '0.08em',
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 1rem',
                    fontSize: 14.4,
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'var(--vke-text-secondary)',
                    background: isActive ? 'var(--vke-blue-light)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--vke-accent)' : '3px solid transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'var(--vke-text-secondary)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Rechtliche Links unten */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
        }}
      >
        {['Impressum', 'Datenschutz', 'AGB'].map((label, i) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link
              href={`/${label.toLowerCase()}`}
              style={{
                fontSize: 12,
                color: 'var(--vke-text-secondary)',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
            {i < 2 && (
              <span style={{ fontSize: 10, color: 'var(--vke-text-secondary)' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
