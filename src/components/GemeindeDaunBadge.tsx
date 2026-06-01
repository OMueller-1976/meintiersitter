'use client'
import { useState } from 'react'

export default function GemeindeDaunBadge() {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="tile-sm" style={{ padding: '14px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#4E779F', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>
        Mit freundlicher Unterstützung
      </p>
      {!imgError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/gemeinde-daun-logo.png"
          alt="Gemeinde Daun"
          onError={() => setImgError(true)}
          style={{ height: '48px', objectFit: 'contain', margin: '0 auto 8px', display: 'block' }}
        />
      )}
      {imgError && <div style={{ fontSize: 28, marginBottom: 6 }}>🏛️</div>}
      <p style={{ fontSize: 14, fontWeight: 700, color: '#1E3249', marginBottom: 2 }}>Gemeinde Daun</p>
      <p style={{ fontSize: 12, color: '#6b7280' }}>Vulkaneifel</p>
    </div>
  )
}
