'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BUNDESLAENDER = [
  { slug: 'rheinland-pfalz', name: 'Rheinland-Pfalz' },
]

interface LandkreisOption {
  slug: string
  name: string
}

export default function RegionFilter() {
  const router = useRouter()
  const [bundesland, setBundesland] = useState<string>('')
  const [landkreis, setLandkreis] = useState<string>('')
  const [landkreise, setLandkreise] = useState<LandkreisOption[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiersitti_region')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.bundesland) setBundesland(parsed.bundesland)
        if (parsed.landkreis) setLandkreis(parsed.landkreis)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!bundesland) return
    fetch(`/api/v1/regions?bundesland=${bundesland}`)
      .then((r) => r.json())
      .then((data: LandkreisOption[]) => setLandkreise(data))
      .catch(() => {})
  }, [bundesland])

  useEffect(() => {
    if (!bundesland) return
    const filter = { bundesland, landkreis, savedAt: Date.now() }
    localStorage.setItem('tiersitti_region', JSON.stringify(filter))
    document.cookie = `tiersitti_region=${encodeURIComponent(JSON.stringify(filter))};max-age=${60 * 60 * 24 * 30};path=/;SameSite=Lax`
  }, [bundesland, landkreis])

  const handleNavigate = () => {
    if (bundesland && landkreis) {
      router.push(`/${bundesland}/${landkreis}`)
    } else if (bundesland) {
      router.push(`/${bundesland}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        className="glass-input cursor-pointer"
        value={bundesland}
        onChange={(e) => { setBundesland(e.target.value); setLandkreis('') }}
        aria-label="Bundesland wählen"
      >
        <option value="">Bundesland wählen</option>
        {BUNDESLAENDER.map((bl) => (
          <option key={bl.slug} value={bl.slug}>{bl.name}</option>
        ))}
      </select>

      {bundesland && (
        <select
          className="glass-input cursor-pointer"
          value={landkreis}
          onChange={(e) => setLandkreis(e.target.value)}
          aria-label="Landkreis wählen"
        >
          <option value="">Landkreis wählen</option>
          {landkreise.map((lk) => (
            <option key={lk.slug} value={lk.slug}>{lk.name}</option>
          ))}
        </select>
      )}

      {(bundesland || landkreis) && (
        <button
          onClick={handleNavigate}
          className="px-4 py-2 rounded-xl text-sm font-bold text-slate-900 cursor-pointer"
          style={{ background: 'var(--accent-green)' }}
          aria-label="Zur gewählten Region navigieren"
        >
          Los →
        </button>
      )}
    </div>
  )
}
