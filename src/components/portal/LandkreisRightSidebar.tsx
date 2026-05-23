'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const INFO_KACHELN = [
  {
    kategorie: 'Wandertipp',
    emoji: '🥾',
    titel: 'Dauner Maare Runde',
    text: 'Ca. 12 km rund um Gemündener, Weinfelder und Schalkenmehrener Maar. Hund an der Leine.',
    link: '/ratgeber/wandern',
    link_label: 'Zur Route →',
  },
  {
    kategorie: 'Hundestrand',
    emoji: '🏖',
    titel: 'Freilinger See',
    text: 'Offizieller Hundestrand bei Blankenheim — Liegewiese, Badebereich, Kiosk.',
    link: '/ratgeber/hundestrand',
    link_label: 'Mehr erfahren →',
  },
  {
    kategorie: 'Wandertipp',
    emoji: '🏆',
    titel: 'HeimatSpur MaareGlück',
    text: 'Nominiert für Deutschlands schönsten Wanderweg 2026. Ideal für Hundebesitzer.',
    link: '/ratgeber/wandern',
    link_label: 'Zur Route →',
  },
  {
    kategorie: 'Marktplatz',
    emoji: '🏪',
    titel: 'Tiergeschäfte im Kreis Daun',
    text: 'Finde Tierärzte, Hundeschulen und Tiershops direkt in Deiner Ortschaft.',
    link: '/marktplatz',
    link_label: 'Zum Marktplatz →',
  },
]

const SCHNELLZUGRIFF = [
  { emoji: '🗺', label: 'Wanderrouten', href: '/ratgeber/wandern' },
  { emoji: '🏖', label: 'Hundestrand', href: '/ratgeber/hundestrand' },
  { emoji: '🏪', label: 'Marktplatz', href: '/marktplatz' },
  { emoji: '📋', label: 'Alle Gesuche', href: '/pinnwand' },
]

export default function LandkreisRightSidebar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % INFO_KACHELN.length)
        setFading(false)
      }, 300)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const current = INFO_KACHELN[activeIndex]

  return (
    <div className="flex flex-col h-full" style={{
      width: 'var(--sidebar-width-right)',
      background: 'rgba(15,76,129,0.35)',
      backdropFilter: 'blur(12px)',
      borderLeft: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Tipps Kachel */}
        <div className="tile-sm" style={{ height: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>TIPPS &amp; ENTDECKEN</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {INFO_KACHELN.map((_, i) => (
                <button key={i} onClick={() => { setActiveIndex(i); setFading(false) }}
                  style={{ width: 6, height: 6, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === activeIndex ? 'var(--accent-green)' : 'rgba(255,255,255,0.2)' }}
                  aria-label={`Kachel ${i + 1}`} />
              ))}
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
            <div style={{ transition: 'opacity 0.3s', opacity: fading ? 0 : 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{current.kategorie} {current.emoji}</span>
              <p style={{ fontWeight: 700, fontSize: 14, margin: '4px 0', color: 'white' }}>{current.titel}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', flex: 1, overflow: 'hidden' }}>{current.text}</p>
              <Link href={current.link} style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', textDecoration: 'none', marginTop: 6 }}>
                {current.link_label}
              </Link>
            </div>
          </div>
        </div>

        {/* Community */}
        <div className="tile-sm p-4">
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🐾 Werde Teil der Community</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
            Schon mehrere Mitglieder in der Region dabei!
          </p>
          <Link href="/register" style={{
            display: 'block', textAlign: 'center', fontSize: 13, fontWeight: 700,
            background: 'var(--accent-green)', color: '#0f172a',
            borderRadius: 10, padding: '8px 0', textDecoration: 'none',
          }}>
            Jetzt mitmachen →
          </Link>
        </div>
      </div>

      {/* Schnellzugriff */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem', flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: 8 }}>SCHNELLZUGRIFF</p>
        <nav>
          {SCHNELLZUGRIFF.map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: 'rgba(255,255,255,0.7)',
              padding: '6px 4px', textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span>{item.emoji}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
