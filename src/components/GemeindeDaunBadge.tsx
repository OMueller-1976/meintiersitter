import Image from 'next/image'

export default function GemeindeDaunBadge() {
  return (
    <div className="tile-sm" style={{ padding: '14px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#4E779F', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>
        Mit freundlicher Unterstützung
      </p>
      <a
        href="https://www.dschinn.de"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {/* Logo ist weiß auf schwarz — dunkler Container damit es sichtbar bleibt */}
        <div style={{ background: '#111827', borderRadius: 12, width: 80, height: 64, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 8px' }}>
          <Image
            src="/assets/White on Black Kopie.png"
            alt="Dschinn - all you wish! Logo"
            width={64}
            height={52}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1E3249', marginBottom: 2 }}>Dschinn Catering</p>
        <p style={{ fontSize: 12, color: '#6b7280' }}>Food- und Event-Catering – Foodtruck für Firmen und private Feiern</p>
      </a>
    </div>
  )
}
