'use client'

import { useState, useEffect } from 'react'
import SpendenModal from './SpendenModal'

export default function SpendenModalTrigger() {
  const [zeigeModal, setZeigeModal] = useState(false)

  useEffect(() => {
    const KEY = 'tiersitti_interaktionen'
    const GESEHEN_KEY = 'tiersitti_spenden_modal_letzte'

    const count = parseInt(localStorage.getItem(KEY) ?? '0') + 1
    localStorage.setItem(KEY, String(count))

    const letzteAnzeige = localStorage.getItem(GESEHEN_KEY)
    const tageVergangen = letzteAnzeige
      ? (Date.now() - parseInt(letzteAnzeige)) / 86400000
      : 999

    if (count % 10 === 0 && tageVergangen > 7) {
      setZeigeModal(true)
      localStorage.setItem(GESEHEN_KEY, String(Date.now()))
    }
  }, [])

  if (!zeigeModal) return null

  return <SpendenModal onClose={() => setZeigeModal(false)} />
}
