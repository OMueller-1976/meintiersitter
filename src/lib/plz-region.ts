import plzRegionen from './data/plz-regionen.json'
import plzNaehe from './data/plz-naehe.json'
import { isRegionSlug, REGIONS } from './regions'
import type { RegionSlug } from './regions'

type Kandidat = [string, string] // [slug, ort]
const REGION_MAP = plzRegionen as unknown as Record<string, string | Kandidat[]>
const NAEHE_MAP = plzNaehe as unknown as Record<string, [string, number]>

export type PlzErgebnis =
  | { status: 'ok'; region: RegionSlug }
  | { status: 'mehrdeutig'; kandidaten: { region: RegionSlug; orte: string[] }[] }
  | { status: 'naehe'; region: RegionSlug; km: number }
  | { status: 'unbekannt' }
  | { status: 'ungueltig' }

export function normalisierePlz(eingabe: string | null | undefined): string | null {
  const plz = (eingabe ?? '').replace(/\s/g, '')
  return /^\d{5}$/.test(plz) ? plz : null
}

/** Ordnet eine PLZ einer Region zu. Rein serverseitig/synchron, ohne Netzwerk. */
export function findeRegionFuerPlz(eingabe: string | null | undefined): PlzErgebnis {
  const plz = normalisierePlz(eingabe)
  if (!plz) return { status: 'ungueltig' }

  const treffer = REGION_MAP[plz]
  if (typeof treffer === 'string') {
    return isRegionSlug(treffer) ? { status: 'ok', region: treffer } : { status: 'unbekannt' }
  }
  if (Array.isArray(treffer)) {
    const nachRegion = new Map<RegionSlug, string[]>()
    for (const [slug, ort] of treffer) {
      if (!isRegionSlug(slug)) continue
      const liste = nachRegion.get(slug) ?? []
      if (!liste.includes(ort)) liste.push(ort)
      nachRegion.set(slug, liste)
    }
    return {
      status: 'mehrdeutig',
      kandidaten: Array.from(nachRegion.entries()).map(([region, orte]) => ({ region, orte: orte.filter((o) => !/GmbH|e\.\s?V\.|\bKG\b|\bAG\b|Verband|niederlassung|Fabrik/i.test(o)).slice(0, 6) })),
    }
  }

  const nah = NAEHE_MAP[plz]
  if (nah && isRegionSlug(nah[0])) return { status: 'naehe', region: nah[0], km: nah[1] }
  return { status: 'unbekannt' }
}

export function regionName(slug: RegionSlug): string {
  return REGIONS[slug].name
}
