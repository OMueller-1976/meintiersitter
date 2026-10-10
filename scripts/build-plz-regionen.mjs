// Erzeugt die PLZ→Region-Zuordnung aus offenen Daten (zauberware/postal-codes-json-xml-csv, GeoNames-basiert).
// Aufruf: node scripts/build-plz-regionen.mjs /pfad/zu/zipcodes.de.json
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const input = process.argv[2]
if (!input) { console.error('Pfad zu zipcodes.de.json fehlt'); process.exit(1) }

const kreise = JSON.parse(readFileSync(join(root, 'src/lib/region-kreise.json'), 'utf8'))
const ags2slug = {}
for (const [slug, list] of Object.entries(kreise)) {
  if (slug.startsWith('_')) continue
  for (const ags of list) ags2slug[ags] = slug
}

const rows = JSON.parse(readFileSync(input, 'utf8')).filter((r) => /^\d{5}$/.test(r.zipcode))

// 1) Abgedeckte PLZ: plz -> Liste (slug, ort)
const covered = {}
const points = {} // plz -> [lat, lng] (nur abgedeckte)
for (const r of rows) {
  const slug = ags2slug[r.community_code]
  if (!slug) continue
  const list = (covered[r.zipcode] ??= [])
  if (!list.some(([s, o]) => s === slug && o === r.place)) list.push([slug, r.place])
  const lat = parseFloat(r.latitude), lng = parseFloat(r.longitude)
  if (Number.isFinite(lat) && Number.isFinite(lng)) points[r.zipcode] = [lat, lng, slug]
}

// Großkunden-/Firmen-PLZ-Einträge (z. B. "… GmbH") sind keine Orte und stören die Ortsauswahl.
const FIRMA = /(gmbh|mbh|\be\.?\s?v\.?|\bkg\b|\bag\b|\bohg\b|verband|stiftung|bundes|landes|verwaltung|postfach|sparkasse|bank|universit|hochschule|klinik|krankenhaus|finanzamt|amtsgericht|zentrale|gesellschaft|institut|kammer|versicherung)/i
const istOrt = ([, ort]) => !FIRMA.test(ort) && ort.length <= 40

const out = {}
for (const [plz, alle] of Object.entries(covered)) {
  const sauber = alle.filter(istOrt)
  const list = sauber.length ? sauber : alle
  const slugs = [...new Set(list.map(([s]) => s))]
  out[plz] = slugs.length === 1 ? slugs[0] : list.sort((a, b) => a[1].localeCompare(b[1], 'de'))
}

// 2) Nicht abgedeckte PLZ: nächste Region (Luftlinie zu nächstem abgedeckten PLZ-Punkt), bis 60 km
const pts = Object.values(points)
const rad = Math.PI / 180
function km(a, b) {
  const dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
const naehe = {}
const seen = new Set()
for (const r of rows) {
  if (covered[r.zipcode] || seen.has(r.zipcode)) continue
  seen.add(r.zipcode)
  const p = [parseFloat(r.latitude), parseFloat(r.longitude)]
  if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue
  let best = null
  for (const q of pts) {
    if (Math.abs(q[0] - p[0]) > 0.6 || Math.abs(q[1] - p[1]) > 1.0) continue
    const d = km(p, q)
    if (!best || d < best[1]) best = [q[2], d]
  }
  if (best && best[1] <= 60) naehe[r.zipcode] = [best[0], Math.round(best[1])]
}

writeFileSync(join(root, 'src/lib/data/plz-regionen.json'), JSON.stringify(out))
writeFileSync(join(root, 'src/lib/data/plz-naehe.json'), JSON.stringify(naehe))
console.log('abgedeckte PLZ:', Object.keys(out).length, '| mehrdeutig:', Object.values(out).filter(Array.isArray).length, '| PLZ in Reichweite:', Object.keys(naehe).length)
