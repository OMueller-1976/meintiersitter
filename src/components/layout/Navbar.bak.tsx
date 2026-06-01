'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#2E4A6B] border-b border-[#1E3249] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-white">🐾 MeinTiersitter</span>
          <span className="text-xs text-[#A8C0DC]">Kreis Daun · Vulkaneifel</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/ratgeber"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Ratgeber
          </Link>
          <Link
            href="/pinnwand"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Pinnwand
          </Link>
          <Link
            href="/marktplatz"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Marktplatz
          </Link>
          <Link
            href="/login"
            className="border border-white/60 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="bg-[#F4A261] text-white px-4 py-1.5 rounded-xl text-sm hover:bg-[#E07B30] transition-colors font-medium"
          >
            Kostenlos registrieren
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 flex flex-col justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1E3249] px-4 pb-4 flex flex-col gap-3 bg-[#2E4A6B]">
          <Link
            href="/ratgeber"
            className="text-white/80 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Ratgeber
          </Link>
          <Link
            href="/pinnwand"
            className="text-white/80 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Pinnwand
          </Link>
          <Link
            href="/marktplatz"
            className="text-white/80 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Marktplatz
          </Link>
          <Link
            href="/login"
            className="border border-white/60 text-white px-4 py-2 rounded-xl text-center text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="bg-[#F4A261] text-white px-4 py-2 rounded-xl text-center text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Kostenlos registrieren
          </Link>
        </div>
      )}
    </nav>
  );
}
