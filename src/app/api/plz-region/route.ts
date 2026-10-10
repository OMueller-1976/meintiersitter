import { NextResponse, type NextRequest } from 'next/server'
import { findeRegionFuerPlz, normalisierePlz } from '@/lib/plz-region'
import { REGIONS } from '@/lib/regions'

// Einfaches In-Memory-Rate-Limit (best effort pro Serverinstanz): 30 Anfragen/Minute je IP.
const FENSTER_MS = 60_000
const MAX_ANFRAGEN = 30
const zaehler = new Map<string, { start: number; n: number }>()

function erlaubt(ip: string): boolean {
  const jetzt = Date.now()
  const eintrag = zaehler.get(ip)
  if (!eintrag || jetzt - eintrag.start > FENSTER_MS) {
    if (zaehler.size > 5000) zaehler.clear()
    zaehler.set(ip, { start: jetzt, n: 1 })
    return true
  }
  eintrag.n += 1
  return eintrag.n <= MAX_ANFRAGEN
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unbekannt'
  if (!erlaubt(ip)) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte warte kurz.' }, { status: 429 })
  }

  const plz = normalisierePlz(new URL(request.url).searchParams.get('plz'))
  if (!plz) return NextResponse.json({ status: 'ungueltig' }, { status: 400 })

  const ergebnis = findeRegionFuerPlz(plz)
  const mitNamen =
    ergebnis.status === 'ok' || ergebnis.status === 'naehe'
      ? { ...ergebnis, name: REGIONS[ergebnis.region].name }
      : ergebnis.status === 'mehrdeutig'
        ? { ...ergebnis, kandidaten: ergebnis.kandidaten.map((k) => ({ ...k, name: REGIONS[k.region].name })) }
        : ergebnis

  return NextResponse.json(mitNamen, { headers: { 'Cache-Control': 'public, max-age=3600' } })
}
