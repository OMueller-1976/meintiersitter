import Link from 'next/link'

const LEGAL_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
]

/**
 * Rechtliche Pflichtlinks (Impressum, Datenschutz, AGB) für Seiten ohne Portal-Sidebar
 * (Login/Registrierung, Dashboard). Auf allen Viewports sichtbar.
 */
export default function LegalFooter({ className = '' }: { className?: string }) {
  return (
    <footer
      aria-label="Rechtliches"
      className={`flex items-center justify-center gap-3 py-4 text-xs text-[#4E779F] ${className}`}
    >
      {LEGAL_LINKS.map((l, i) => (
        <span key={l.href} className="flex items-center gap-3">
          <Link href={l.href} className="inline-flex items-center min-h-[44px] px-1 hover:underline">
            {l.label}
          </Link>
          {i < LEGAL_LINKS.length - 1 && <span aria-hidden="true">·</span>}
        </span>
      ))}
    </footer>
  )
}
