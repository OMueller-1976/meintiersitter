'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GTM_ID = 'GTM-NCVPK6MC'
const KEY = 'tiersitti-consent-v1'
type Wahl = 'ja' | 'nein' | null

function lese(): Wahl {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'ja' || v === 'nein' ? v : null
  } catch {
    return null
  }
}

/**
 * Lädt den Google Tag Manager erst nach Einwilligung (TDDDG/DSGVO).
 * Ohne Wahl wird nichts von Google geladen. Widerruf über „Cookie-Einstellungen“ im Footer.
 */
export default function ConsentGtm() {
  const [wahl, setWahl] = useState<Wahl>(null)
  const [offen, setOffen] = useState(false)

  useEffect(() => {
    const w = lese()
    setWahl(w)
    setOffen(w === null)
    const oeffnen = () => setOffen(true)
    window.addEventListener('tiersitti:consent-open', oeffnen)
    return () => window.removeEventListener('tiersitti:consent-open', oeffnen)
  }, [])

  function speichern(v: 'ja' | 'nein') {
    try { localStorage.setItem(KEY, v) } catch { /* ignorieren */ }
    setWahl(v)
    setOffen(false)
    if (v === 'nein') window.location.reload() // bereits geladene Skripte entfernen
  }

  return (
    <>
      {wahl === 'ja' && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</Script>
      )}
      {offen && (
        <div
          role="dialog"
          aria-label="Cookie-Einstellungen"
          className="fixed inset-x-3 bottom-3 z-[1000] mx-auto max-w-xl rounded-2xl border border-[#C8D8EC] bg-white p-4 text-sm text-[#1E3249] shadow-xl"
        >
          <p className="mb-3 leading-relaxed">
            Wir möchten mit Google Tag Manager anonyme Nutzungsstatistiken erfassen, um Tiersitti zu verbessern. Dabei
            können Daten an Google übertragen werden. Das passiert nur mit Deiner Einwilligung, die Du jederzeit im
            Footer widerrufen kannst. Mehr in der{' '}
            <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => speichern('ja')} className="min-h-[44px] rounded-xl bg-[#2E4A6B] px-4 font-semibold text-white">
              Akzeptieren
            </button>
            <button onClick={() => speichern('nein')} className="min-h-[44px] rounded-xl border border-[#C8D8EC] px-4 font-semibold">
              Ablehnen
            </button>
          </div>
        </div>
      )}
    </>
  )
}
