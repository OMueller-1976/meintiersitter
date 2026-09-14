'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LeftSidebarProps {
  isLoggedIn?: boolean;
  region?: string;
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

function buildNavGroups(region: string): NavGroup[] {
  return [
    {
      items: [
        { icon: '🏠', label: 'Portal', href: `/${region}` },
        { icon: '📋', label: 'Pinnwand', href: `/${region}#pinnwand` },
        { icon: '🐾', label: 'Sitter entdecken', href: `/${region}/sitter` },
      ],
    },
    {
      label: 'ERKUNDEN',
      items: [
        { icon: '🥾', label: 'Wanderrouten', href: `/${region}/ratgeber/wandern` },
        { icon: '🐕', label: 'Special Hunde', href: `/${region}/hundestrand` },
        { icon: '🏨', label: 'Unterkünfte', href: `/${region}/ratgeber/unterkuenfte` },
        { icon: '🏪', label: 'Marktplatz', href: `/${region}/marktplatz` },
        { icon: '📖', label: 'Ratgeber', href: `/${region}/ratgeber` },
      ],
    },
    {
      label: 'ANLAUFSTELLEN',
      items: [
        { icon: '🏠', label: 'Tierheime & Vereine', href: `/${region}/anlaufstellen` },
        { icon: '🍖', label: 'Futterstationen', href: `/${region}/anlaufstellen#futterstationen` },
      ],
    },
  ];
}

const loggedInGroup: NavGroup = {
  label: 'MEIN BEREICH',
  items: [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '💬', label: 'Nachrichten', href: '/dashboard/nachrichten' },
    { icon: '⭐', label: 'Bewertungen', href: '/dashboard/bewertungen' },
  ],
};

export default function LeftSidebar({ isLoggedIn, region = 'daun' }: LeftSidebarProps) {
  const pathname = usePathname();

  const navGroups = buildNavGroups(region);
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
                  fontWeight: 700,
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
                    fontSize: 15.2,
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

      {/* APP-Bereich */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--vke-text-secondary)',
            padding: '0.75rem 1rem 0.25rem',
            letterSpacing: '0.08em',
          }}
        >
          APP
        </div>
        <Link href="/app" className="block mx-3 mb-4 bg-[#1E3249] rounded-xl p-3 hover:bg-[#243B58] transition-colors">
          <p className="text-white text-xs font-medium mb-3 text-center">📱 App herunterladen</p>
          <div className="flex gap-2 justify-center">
            {/* iOS QR Code */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[72px] h-[72px] bg-white rounded-lg p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/qr-app-ios.svg" alt="QR-Code: Tiersitti als App auf dem iPhone installieren" className="w-full h-full" />
              </div>
              <span className="text-[10px] text-white/70 text-center leading-tight"> iOS</span>
            </div>
            {/* Android QR Code */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[72px] h-[72px] bg-white rounded-lg p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/qr-app-android.svg" alt="QR-Code: Tiersitti als App auf Android installieren" className="w-full h-full" />
              </div>
              <span className="text-[10px] text-white/70 text-center leading-tight">🤖 Android</span>
            </div>
          </div>
          <p className="text-[10px] text-white/50 text-center mt-2 leading-tight">
            QR-Code scannen &amp; App installieren
          </p>
        </Link>
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
