import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2F8] to-[#D4E3F0]">
      <header className="bg-[#2E4A6B] flex items-center justify-between px-6" style={{ height: 72 }}>
        <Link href="/daun" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-xl">🐾</div>
          <div>
            <div className="text-white font-semibold text-lg leading-tight">MeinTiersitter</div>
            <div className="text-[#A8C0DC] text-xs">Tiersitti</div>
          </div>
        </Link>
        <Link href="/daun" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Zurück zum Portal
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
