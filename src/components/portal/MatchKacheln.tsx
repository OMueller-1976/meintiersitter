'use client';

import Link from 'next/link';
import { matchLabel, matchColor } from '@/lib/matching';

interface BestMatch {
  label: string        // z.B. "Maria H." oder "Bello"
  ortLabel: string     // z.B. "aus Gillenfeld"
  prozent: number
  href: string
  linkLabel: string   // z.B. "Match ansehen →" oder "Gesuch ansehen →"
}

interface EigenesGesuch {
  tierName: string
  href: string
}

interface MatchKachelnProps {
  isLoggedIn: boolean
  userRole?: string
  bestMatch?: BestMatch | null
  eigenesGesuch?: EigenesGesuch | null
  aktiveChats?: number
}

export default function MatchKacheln({
  isLoggedIn,
  userRole,
  bestMatch,
  eigenesGesuch,
  aktiveChats = 0,
}: MatchKachelnProps) {
  if (!isLoggedIn) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <KachelCard
          titel="Tier registrieren"
          text="Lege ein Profil für Deinen Vierbeiner an"
          buttonLabel="Jetzt starten →"
          href="/register?role=tierhalter"
        />
        <KachelCard
          titel="Als Sitter anbieten"
          text="Hilf Tierhaltern in Deiner Nachbarschaft"
          buttonLabel="Gratis registrieren →"
          href="/register?role=sitter"
        />
        <KachelCard
          titel="Marktplatz"
          text="Tiergeschäfte und Tierärzte in der Region"
          buttonLabel="Zum Marktplatz →"
          href="/marktplatz"
        />
      </div>
    );
  }

  const isSitter = userRole === 'sitter' || userRole === 'beide';
  const isTierhalter = userRole === 'tierhalter' || userRole === 'beide';

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Kachel 1: Bester Match */}
      {bestMatch ? (
        <div
          className="tile-sm p-3 flex flex-col relative overflow-hidden transition-all hover:opacity-90"
          style={{ borderColor: '#bbf7d0' }}
        >
          <div
            className="text-lg font-extrabold mb-0.5"
            style={{ color: matchColor(bestMatch.prozent) }}
          >
            {bestMatch.prozent}%
          </div>
          <span
            className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-full text-slate-900"
            style={{ background: 'var(--accent-amber)', fontSize: 10 }}
          >
            {matchLabel(bestMatch.prozent)}
          </span>
          <div className="font-semibold text-[#1E3249] text-sm mb-1 leading-tight">
            {bestMatch.label}
          </div>
          <p className="text-xs text-secondary leading-snug mb-2 flex-1">
            {bestMatch.ortLabel}
          </p>
          <Link
            href={bestMatch.href}
            className="text-xs font-bold hover:opacity-80 transition-opacity inline-block"
            style={{ color: 'var(--accent-green)' }}
          >
            {bestMatch.linkLabel}
          </Link>
        </div>
      ) : (
        <div className="tile-sm p-3 flex flex-col relative overflow-hidden">
          <div className="font-semibold text-[#1E3249] text-sm mb-1 leading-tight">Aktuell noch kein Match</div>
          <p className="text-xs text-secondary leading-snug flex-1">
            Sobald ein passendes Gesuch oder ein passender Sitter gefunden wird, erscheint er hier.
          </p>
        </div>
      )}

      {/* Kachel 2: Eigenes Gesuch (Tierhalter) / Verfügbarkeit (Sitter) */}
      {isTierhalter && !isSitter ? (
        eigenesGesuch ? (
          <KachelCard
            titel="Dein offenes Gesuch"
            text={`${eigenesGesuch.tierName} — Status: Offen`}
            buttonLabel="Gesuch verwalten →"
            href="/dashboard/postings"
          />
        ) : (
          <KachelCard
            titel="Dein offenes Gesuch"
            text="Du hast noch kein aktives Gesuch"
            buttonLabel="Gesuch aufgeben →"
            href="/dashboard/postings/neu"
          />
        )
      ) : isSitter ? (
        <KachelCard
          titel="Verfügbarkeit"
          text="Trage Deine freien Zeiten ein"
          buttonLabel="Verfügbarkeit pflegen →"
          href="/dashboard/verfuegbarkeit"
        />
      ) : eigenesGesuch ? (
        <KachelCard
          titel="Dein offenes Gesuch"
          text={`${eigenesGesuch.tierName} — Status: Offen`}
          buttonLabel="Gesuch verwalten →"
          href="/dashboard/postings"
        />
      ) : (
        <KachelCard
          titel="Dein offenes Gesuch"
          text="Du hast noch kein aktives Gesuch"
          buttonLabel="Gesuch aufgeben →"
          href="/dashboard/postings/neu"
        />
      )}

      {/* Kachel 3: Nachrichten */}
      <KachelCard
        titel="Nachrichten"
        text={
          aktiveChats > 0
            ? `${aktiveChats} aktive Unterhaltung${aktiveChats > 1 ? 'en' : ''}`
            : 'Noch keine Unterhaltungen'
        }
        buttonLabel="Zum Chat →"
        href="/dashboard/nachrichten"
      />
    </div>
  );
}

function KachelCard({
  titel,
  text,
  buttonLabel,
  href,
}: {
  titel: string;
  text: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="tile-sm p-3 flex flex-col relative overflow-hidden transition-all hover:opacity-90">
      <div className="font-semibold text-[#1E3249] text-sm mb-1 leading-tight">{titel}</div>
      <p className="text-xs text-secondary leading-snug mb-2 flex-1">{text}</p>
      <Link
        href={href}
        className="text-xs font-bold hover:opacity-80 transition-opacity inline-block"
        style={{ color: 'var(--accent-green)' }}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
