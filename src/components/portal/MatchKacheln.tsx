'use client';

import Link from 'next/link';

interface MatchKachelnProps {
  isLoggedIn: boolean;
  userRole?: string;
}

interface Kachel {
  icon: string;
  titel: string;
  text: string;
  buttonLabel: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  matchScore?: number;
}

function KachelCard({ k }: { k: Kachel }) {
  return (
    <div
      className="tile-sm p-3 flex flex-col relative overflow-hidden transition-all hover:opacity-90"
      style={k.highlight ? { borderColor: '#bbf7d0' } : {}}
    >
      {k.badge && (
        <span
          className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-full text-slate-900"
          style={{ background: 'var(--accent-amber)', fontSize: 10 }}
        >
          {k.badge}
        </span>
      )}
      {k.matchScore !== undefined && (
        <div className="text-lg font-extrabold mb-0.5" style={{ color: 'var(--accent-green)' }}>
          {k.matchScore}%
        </div>
      )}
      <div className="font-semibold text-[#1E3249] text-sm mb-1 leading-tight">{k.titel}</div>
      <p className="text-xs text-secondary leading-snug mb-2 flex-1">{k.text}</p>
      <Link
        href={k.href}
        className="text-xs font-bold hover:opacity-80 transition-opacity inline-block"
        style={{ color: 'var(--accent-green)' }}
      >
        {k.buttonLabel}
      </Link>
    </div>
  );
}

export default function MatchKacheln({ isLoggedIn, userRole }: MatchKachelnProps) {
  let kacheln: Kachel[];

  if (!isLoggedIn) {
    kacheln = [
      {
        icon: '🐾',
        titel: 'Tier registrieren',
        text: 'Lege ein Profil für Deinen Vierbeiner an',
        buttonLabel: 'Jetzt starten →',
        href: '/register?role=tierhalter',
      },
      {
        icon: '🤝',
        titel: 'Als Sitter anbieten',
        text: 'Hilf Tierhaltern in Deiner Nachbarschaft',
        buttonLabel: 'Gratis registrieren →',
        href: '/register?role=sitter',
      },
      {
        icon: '🏪',
        titel: 'Marktplatz',
        text: 'Tiergeschäfte und Tierärzte in der Region',
        buttonLabel: 'Zum Marktplatz →',
        href: '/marktplatz',
      },
    ];
  } else if (userRole === 'sitter') {
    kacheln = [
      {
        icon: '🔔',
        titel: 'Neue Anfragen',
        text: '2 Gesuche passen zu Deinem Profil',
        buttonLabel: 'Jetzt ansehen →',
        href: '/dashboard/anfragen',
        highlight: true,
        badge: '2',
      },
      {
        icon: '🗓',
        titel: 'Verfügbarkeit',
        text: 'Trage Deine freien Zeiten ein',
        buttonLabel: 'Verfügbarkeit pflegen →',
        href: '/dashboard/verfuegbarkeit',
      },
      {
        icon: '⭐',
        titel: 'Dein Profil',
        text: 'Vervollständige Dein Sitter-Profil',
        buttonLabel: 'Profil bearbeiten →',
        href: '/dashboard/profil',
      },
    ];
  } else {
    kacheln = [
      {
        icon: '✨',
        titel: 'Dein bester Match',
        text: 'Maria H. aus Gillenfeld passt perfekt zu Deinem Profil',
        buttonLabel: 'Match ansehen →',
        href: '/dashboard',
        highlight: true,
        badge: 'NEU',
        matchScore: 85,
      },
      {
        icon: '📋',
        titel: 'Dein offenes Gesuch',
        text: 'Du hast noch kein aktives Gesuch',
        buttonLabel: 'Gesuch aufgeben →',
        href: '/dashboard/postings/neu',
      },
      {
        icon: '💬',
        titel: 'Nachrichten',
        text: 'Schreibe direkt mit Sittern',
        buttonLabel: 'Zum Chat →',
        href: '/chat',
      },
    ];
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {kacheln.map((k) => (
        <KachelCard key={k.titel} k={k} />
      ))}
    </div>
  );
}
