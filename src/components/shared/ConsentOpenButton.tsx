'use client'

export default function ConsentOpenButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('tiersitti:consent-open'))}
      className={
        compact
          ? 'inline-flex items-center min-h-[32px] px-1 text-[11px] text-[#4E779F] hover:underline'
          : 'inline-flex items-center min-h-[44px] px-1 hover:underline'
      }
    >
      Cookie-Einstellungen
    </button>
  )
}
