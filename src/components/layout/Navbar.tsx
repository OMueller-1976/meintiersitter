'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-[#2D6A4F]">🐾 MeinTiersitter</span>
          <span className="text-xs text-gray-400">Kreis Daun · Vulkaneifel</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/ratgeber"
            className="text-gray-600 hover:text-[#2D6A4F] text-sm transition-colors"
          >
            Ratgeber
          </Link>
          <Link
            href="/pinnwand"
            className="text-gray-600 hover:text-[#2D6A4F] text-sm transition-colors"
          >
            Pinnwand
          </Link>
          <Link
            href="/marktplatz"
            className="text-gray-600 hover:text-[#2D6A4F] text-sm transition-colors"
          >
            Marktplatz
          </Link>
          <Link
            href="/login"
            className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-1.5 rounded-xl text-sm hover:bg-[#2D6A4F]/5 transition-colors"
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="bg-[#2D6A4F] text-white px-4 py-1.5 rounded-xl text-sm hover:bg-[#245a42] transition-colors"
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
            className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 pb-4 flex flex-col gap-3 bg-white">
          <Link
            href="/ratgeber"
            className="text-gray-600 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Ratgeber
          </Link>
          <Link
            href="/pinnwand"
            className="text-gray-600 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Pinnwand
          </Link>
          <Link
            href="/marktplatz"
            className="text-gray-600 py-2 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Marktplatz
          </Link>
          <Link
            href="/login"
            className="border border-[#2D6A4F] text-[#2D6A4F] px-4 py-2 rounded-xl text-center text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Anmelden
          </Link>
          <Link
            href="/register"
            className="bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-center text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Kostenlos registrieren
          </Link>
        </div>
      )}
    </nav>
  );
}
