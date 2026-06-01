import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E3249] text-[#A8C0DC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="text-white font-bold text-lg mb-2">🐾 MeinTiersitter</div>
            <p className="text-sm text-[#7A9DBF] max-w-xs">
              Nachbarschaftshilfe für Tierhalter im Kreis Daun und der Vulkaneifel.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm items-start">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
            <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
            <Link href="/ratgeber" className="hover:text-white transition-colors">Ratgeber</Link>
          </div>
          <div className="text-sm text-[#7A9DBF]">
            Ein Projekt aus der Vulkaneifel 🌋
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#2E4A6B] text-center text-sm text-[#7A9DBF]">
          © 2025 MeinTiersitter. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
