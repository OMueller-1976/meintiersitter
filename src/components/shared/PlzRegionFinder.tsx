'use client'

import { useState } from 'react'
import Link from 'next/link'

type Kandidat = { region: string; name: string; orte: string[] }
type Antwort =
  | { status: 'ok'; region: string; name: string }
  | { status: 'naehe'; region: string; name: string; km: number }
  | { status: 'mehrdeutig'; kandidaten: Kandidat[] }
  | { status: 'unbekannt' }
  | { status: 'ungueltig' }

/** "Nicht sicher? Gib Deine PLZ ein": ordnet eine PLZ einer Region zu. */
export default function PlzRegionFinder() {
  const [plz, setPlz] = useState('')
  const [antwort, setAntwort] = useState<Antwort | null>(null)
  const [laedt, setLaedt] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  async function pruefen(e: React.FormEvent) {
    e.preventDefault()
    setFehler(null)
    setAntwort(null)
    if (!/^\d{5}$/.test(plz)) {
      setFehler('Bitte gib eine PLZ mit 5 Ziffern ein.')
      return
    }
    setLaedt(true)
    try {
      const res = await fetch(`/api/plz-region?plz=${plz}`)
      if (res.status === 429) {
        setFehler('Zu viele Anfragen. Bitte versuche es in einer Minute erneut.')
        return
      }
      setAntwort((await res.json()) as Antwort)
    } catch {
      setFehler('Das hat leider nicht geklappt. Bitte versuche es noch einmal.')
    } finally {
      setLaedt(false)
    }
  }

  return (
    <section
      aria-labelledby="plz-finder-titel"
      className="max-w-3xl mx-auto bg-white border border-[#C8D8EC] rounded-2xl p-6 mb-8 shadow-sm"
    >
      <h2 id="plz-finder-titel" className="text-lg font-bold text-[#1E3249] mb-1">
        Nicht sicher, welche Region zu Dir passt?
      </h2>
      <p className="text-sm text-[#4E779F] mb-4">Gib Deine PLZ ein, wir ordnen Dich der passenden Region zu.</p>

      <form onSubmit={pruefen} className="flex gap-2 items-start">
        <div className="flex-1">
          <label htmlFor="plz-finder" className="sr-only">Postleitzahl</label>
          <input
            id="plz-finder"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={plz}
            onChange={(e) => setPlz(e.target.value.replace(/\D/g, ''))}
            placeholder="z. B. 54550"
            className="w-full border border-[#C8D8EC] rounded-xl px-3 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-[#2E4A6B]/40"
          />
        </div>
        <button
          type="submit"
          disabled={laedt}
          className="rounded-xl bg-[#2D6A4F] text-white font-semibold px-4 py-2.5 text-sm hover:opacity-90 disabled:opacity-60 min-h-[44px]"
        >
          {laedt ? 'Suche…' : 'Region finden'}
        </button>
      </form>

      <div aria-live="polite" className="mt-3 text-sm">
        {fehler && <p className="text-red-600">{fehler}</p>}

        {antwort?.status === 'ok' && (
          <p className="text-[#1E3249]">
            Deine Region: <strong>{antwort.name}</strong>{' '}
            <Link href={`/${antwort.region}`} className="font-semibold text-[#2D6A4F] underline">
              Zur Region →
            </Link>{' '}
            <Link href={`/register?region=${antwort.region}&plz=${plz}`} className="font-semibold text-[#2D6A4F] underline">
              Gleich registrieren →
            </Link>
          </p>
        )}

        {antwort?.status === 'mehrdeutig' && (
          <div className="text-[#1E3249]">
            <p className="mb-2">Diese PLZ gehört zu mehreren Regionen. Wähle Deinen Ort:</p>
            <ul className="flex flex-col gap-1">
              {antwort.kandidaten.map((k) => (
                <li key={k.region}>
                  <Link href={`/${k.region}`} className="font-semibold text-[#2D6A4F] underline">
                    {k.name}
                  </Link>
                  {k.orte.length > 0 && <span className="text-[#4E779F]"> (z. B. {k.orte.slice(0, 3).join(', ')})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {antwort?.status === 'naehe' && (
          <p className="text-[#1E3249]">
            Diese PLZ gehört noch nicht zu unseren Regionen. Am nächsten liegt{' '}
            <strong>{antwort.name}</strong> (ca. {antwort.km} km).{' '}
            <Link href={`/${antwort.region}`} className="font-semibold text-[#2D6A4F] underline">
              Zur Region →
            </Link>
          </p>
        )}

        {antwort?.status === 'unbekannt' && (
          <p className="text-[#1E3249]">
            Für diese PLZ haben wir noch keine Region in der Nähe.{' '}
            <a href="mailto:kontakt@tiersitti.de" className="font-semibold text-[#2D6A4F] underline">
              Schreib uns
            </a>
            , wir wachsen weiter.
          </p>
        )}
      </div>
    </section>
  )
}
