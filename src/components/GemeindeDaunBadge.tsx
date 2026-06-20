export default function GemeindeDaunBadge() {
  return (
    <div className="tile-sm" style={{ padding: '14px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#4E779F', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>
        Mit freundlicher Unterstützung
      </p>
      {/* TODO: echtes Dschinn-Logo einsetzen, sobald verfügbar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/logo-vulkaneifel.jpg"
        alt="Dschinn Catering"
        className="w-16 h-16 rounded-xl object-cover mx-auto mb-2"
      />
      <a
        href="https://www.dschinn.de"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1E3249', marginBottom: 2 }}>Dschinn Catering</p>
        <p style={{ fontSize: 12, color: '#6b7280' }}>Food- und Event-Catering – Foodtruck für Firmen und private Feiern</p>
      </a>
    </div>
  )
}
