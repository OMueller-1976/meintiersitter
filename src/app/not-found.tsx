import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🐾</div>
        <h1 className="text-3xl font-extrabold text-[#1E3249] mb-3">
          404 — Diese Seite ist ausgebüxt
        </h1>
        <p className="text-[#4E779F] mb-8">
          Die Seite, die Du suchst, existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/daun"
          className="inline-block bg-[#2E4A6B] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#1E3249] transition-colors"
        >
          Zurück zum Portal →
        </Link>
      </div>
    </div>
  )
}
