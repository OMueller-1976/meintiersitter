/** Transparenzhinweis unter Ratgeber-Inhalten. */
export default function KiHinweis({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="Hinweis zur Erstellung"
      className={`rounded-xl border border-[#C8D8EC] bg-[#F4F8FC] px-4 py-3 text-xs leading-relaxed text-[#4E779F] ${className}`}
    >
      <strong className="text-[#2E4A6B]">Hinweis:</strong> Dieser Inhalt wurde mit Unterstützung von KI recherchiert und
      zusammengestellt. Alle Angaben ohne Gewähr, Stand Oktober 2026. Bitte prüfe Adressen, Zeiten und Regeln vor einem
      Besuch direkt beim Anbieter. Fehler oder Änderungen kannst Du uns über das{' '}
      <a href="/impressum" className="underline">Impressum</a> melden.
    </aside>
  )
}
