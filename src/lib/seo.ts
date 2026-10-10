import type { Metadata } from 'next'
import { REGIONS } from './regions'
import type { RegionSlug } from './regions'
import { getRegionContent } from './region-content'

export const SITE_URL = 'https://tiersitti.de'
export const SITE_NAME = 'Tiersitti'
const OG_IMAGE = '/icons/icon-512.png'

export type RegionPageKey =
  | 'start' | 'sitter' | 'marktplatz' | 'anlaufstellen'
  | 'ratgeber' | 'wandern' | 'hundestrand' | 'hund-entlaufen' | 'unterkuenfte'

const PATH: Record<RegionPageKey, string> = {
  start: '', sitter: '/sitter', marktplatz: '/marktplatz', anlaufstellen: '/anlaufstellen',
  ratgeber: '/ratgeber', wandern: '/ratgeber/wandern', hundestrand: '/ratgeber/hundestrand',
  'hund-entlaufen': '/ratgeber/hund-entlaufen', unterkuenfte: '/ratgeber/unterkuenfte',
}

export const PAGE_LABEL: Record<RegionPageKey, string> = {
  start: 'Startseite', sitter: 'Tiersitter', marktplatz: 'Marktplatz', anlaufstellen: 'Tierheime & Anlaufstellen',
  ratgeber: 'Ratgeber', wandern: 'Wandern mit Hund', hundestrand: 'Hundestrand', 'hund-entlaufen': 'Hund entlaufen',
  unterkuenfte: 'Hundefreundliche Unterkünfte',
}

export function regionUrl(slug: string, key: RegionPageKey = 'start') {
  return `${SITE_URL}/${slug}${PATH[key]}`
}

function kuerzen(text: string, max = 158) {
  return text.length <= max ? text : text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

function beschreibung(slug: RegionSlug, key: RegionPageKey): { title: string; description: string } {
  const cfg = REGIONS[slug]
  const c = getRegionContent(slug)
  const heime = (c?.tierheime ?? []).map((t) => t.name.replace(/\s*\(.*\)\s*$/, ''))
  const orte = heime.slice(0, 3).join(', ')
  const routen = (c?.wanderrouten ?? []).map((r) => r.titel).slice(0, 2).join(' und ')
  switch (key) {
    case 'start':
      return {
        title: `Tiersitter in ${cfg.name} finden`,
        description: `Tierbetreuung in ${cfg.name} (${cfg.bundesland}): Tiersitter für Gassi, Füttern und Urlaubsbetreuung finden, Tierheime, Ratgeber und Tipps für Tierhalter.`,
      }
    case 'sitter':
      return {
        title: `Tiersitter in ${cfg.name}`,
        description: `Tiersitter und Hundesitter in ${cfg.name}: Profile mit Erfahrung, Leistungen und Radius. Kostenlos für Sitter, fair für Tierhalter.`,
      }
    case 'marktplatz':
      return {
        title: `Tierärzte & Tierbedarf in ${cfg.name}`,
        description: `Marktplatz für ${cfg.name}: Tierärzte, Tierbedarf und weitere Anbieter für Haustiere in der Region.`,
      }
    case 'anlaufstellen':
      return {
        title: `Tierheime in ${cfg.name}: Adressen & Kontakt`,
        description: orte
          ? `Tierheime und Tierschutzvereine in ${cfg.name}: ${orte}. Adressen, Telefon, Zeiten und Hilfe bei entlaufenen Tieren.`
          : `Tierheime, Tierschutzvereine und Anlaufstellen in ${cfg.name}: Adressen, Telefon und Hilfe bei entlaufenen Tieren.`,
      }
    case 'ratgeber':
      return {
        title: `Ratgeber für Tierhalter in ${cfg.kurzname}`,
        description: `Ratgeber für ${cfg.name}: Wandern mit Hund, Hund entlaufen, hundefreundliche Unterkünfte und mehr, mit regionalen Tipps.`,
      }
    case 'wandern':
      return {
        title: `Wandern mit Hund in ${cfg.kurzname}`,
        description: routen
          ? `Wandern mit Hund in ${cfg.name}. Routen mit Länge und Startpunkt, u. a. ${routen}.`
          : `Wandern mit Hund in ${cfg.name}: Routen mit Länge und Startpunkt.`,
      }
    case 'hundestrand':
      return {
        title: `Hundestrand & Badestellen in ${cfg.kurzname}`,
        description: c?.hundestrand
          ? `Hundestrand in ${cfg.name}: ${c.hundestrand.name}. Lage, Hinweise und Tipps zum Baden mit Hund.`
          : `Hundestrand in ${cfg.name}: Aktueller Stand zu geprüften Badestellen für Hunde.`,
      }
    case 'hund-entlaufen':
      return {
        title: `Hund entlaufen in ${cfg.kurzname}: das hilft jetzt`,
        description: `Hund entlaufen in ${cfg.name}? Erste Schritte, Haustierregister (TASSO, FINDEFIX), Tierheime in der Nähe und die Hundesuchhilfe Saving Paws.`,
      }
    case 'unterkuenfte':
      return {
        title: `Hundefreundliche Unterkünfte in ${cfg.kurzname}`,
        description: `Urlaub mit Hund in ${cfg.name}: Unterkünfte mit Hunde-Erlaubnis und Tipps für die Buchung.`,
      }
  }
}

/** Metadaten einer Region-Seite: eindeutiger Titel/Beschreibung, Canonical, Open Graph. */
export function regionMetadata(slug: string, key: RegionPageKey): Metadata {
  if (!(slug in REGIONS)) return {}
  const { title, description } = beschreibung(slug as RegionSlug, key)
  const url = regionUrl(slug, key)
  const desc = kuerzen(description)
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName: SITE_NAME, locale: 'de_DE', type: 'website', images: [OG_IMAGE] },
    twitter: { card: 'summary', title, description: desc },
  }
}

// ── JSON-LD ──

export function breadcrumbLd(slug: string, key: RegionPageKey) {
  const cfg = REGIONS[slug as RegionSlug]
  const items: { name: string; url: string }[] = [
    { name: SITE_NAME, url: SITE_URL },
    { name: cfg.kurzname, url: regionUrl(slug) },
  ]
  if (key !== 'start') {
    if (['wandern', 'hundestrand', 'hund-entlaufen', 'unterkuenfte'].includes(key)) {
      items.push({ name: PAGE_LABEL.ratgeber, url: regionUrl(slug, 'ratgeber') })
    }
    items.push({ name: PAGE_LABEL[key], url: regionUrl(slug, key) })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

function adresseLd(adresse: string) {
  // "Straße 1, 12345 Ort" -> PostalAddress; sonst nur streetAddress weglassen
  const m = adresse.match(/^(.*?),\s*(\d{5})\s+(.+)$/)
  if (!m) return undefined
  return { '@type': 'PostalAddress', streetAddress: m[1], postalCode: m[2], addressLocality: m[3], addressCountry: 'DE' }
}

export function tierheimeLd(slug: string) {
  const c = getRegionContent(slug)
  if (!c) return []
  return c.tierheime.map((t) => {
    const addr = adresseLd(t.adresse)
    return {
      '@context': 'https://schema.org',
      '@type': 'AnimalShelter',
      name: t.name,
      ...(addr ? { address: addr } : {}),
      ...(t.telefon ? { telephone: '+49' + t.telefon.replace(/\s+/g, '').replace(/^0/, '') } : {}),
      ...(t.website ? { url: t.website.startsWith('http') ? t.website : `https://${t.website}` } : {}),
    }
  })
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'de-DE',
  description: 'Tiersitter finden und Tierhilfe in Rheinland-Pfalz und NRW.',
}
