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
  bg: string;
  border: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
  matchScore?: number;
}

function KachelCard({ k }: { k: Kachel }) {
  return (
    <div
      className={`${k.bg} ${k.border} rounded-xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-full relative overflow-hidden`}
    >
      {k.badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${k.badgeColor ?? 'bg-[#F4A261] text-white'}`}>
          {k.badge}
        </span>
      )}
      <div>
        <div className="text-3xl mb-2">{k.icon}</div>
        {k.matchScore !== undefined && (
          <div className="text-3xl font-bold text-[#2E4A6B] mb-1">{k.matchScore}%</div>
        )}
        <div className="font-semibold text-[#1E3249] text-base mb-1">{k.titel}</div>
        <p className="text-sm text-[#4E779F] leading-relaxed">{k.text}</p>
      </div>
      <Link
        href={k.href}
        className="mt-4 text-sm font-semibold text-[#2E4A6B] hover:text-[#1E3249] hover:underline py-1 inline-block"
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
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#2E4A6B]',
      },
      {
        icon: '🤝',
        titel: 'Als Sitter anbieten',
        text: 'Hilf Tierhaltern in Deiner Nachbarschaft',
        buttonLabel: 'Gratis registrieren →',
        href: '/register?role=sitter',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#2E4A6B]',
      },
      {
        icon: '🏪',
        titel: 'Marktplatz',
        text: 'Tiergeschäfte und Tierärzte im Kreis Daun',
        buttonLabel: 'Zum Marktplatz →',
        href: '/marktplatz',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#2E4A6B]',
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
        bg: 'bg-white',
        border: 'border-2 border-[#F4A261]',
        badge: '2',
        badgeColor: 'bg-[#F4A261] text-white',
      },
      {
        icon: '🗓',
        titel: 'Verfügbarkeit',
        text: 'Trage Deine freien Zeiten ein',
        buttonLabel: 'Verfügbarkeit pflegen →',
        href: '/dashboard/verfuegbarkeit',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#C8D8EC]',
      },
      {
        icon: '⭐',
        titel: 'Dein Profil',
        text: 'Vervollständige Dein Sitter-Profil',
        buttonLabel: 'Profil bearbeiten →',
        href: '/dashboard/profil',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#C8D8EC]',
      },
    ];
  } else {
    // tierhalter (logged in)
    kacheln = [
      {
        icon: '✨',
        titel: 'Dein bester Match',
        text: 'Maria H. aus Gillenfeld passt perfekt zu Deinem Profil',
        buttonLabel: 'Match ansehen →',
        href: '/dashboard',
        bg: 'bg-white',
        border: 'border-2 border-[#2E4A6B]',
        badge: 'NEU',
        badgeColor: 'bg-[#F4A261] text-white',
        matchScore: 85,
      },
      {
        icon: '📋',
        titel: 'Dein offenes Gesuch',
        text: 'Du hast noch kein aktives Gesuch',
        buttonLabel: 'Gesuch aufgeben →',
        href: '/dashboard/postings/neu',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#C8D8EC]',
      },
      {
        icon: '💬',
        titel: 'Nachrichten',
        text: '0 neue Nachrichten',
        buttonLabel: 'Zu den Nachrichten →',
        href: '/dashboard/nachrichten',
        bg: 'bg-[#EEF2F8]',
        border: 'border-[#C8D8EC]',
      },
    ];
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {kacheln.map((k) => (
        <KachelCard key={k.titel} k={k} />
      ))}
    </div>
  );
}
