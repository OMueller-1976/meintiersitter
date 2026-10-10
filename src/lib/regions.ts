import kreiseJson from './region-kreise.json'

export const REGIONS = {
  daun: {
    name: 'Landkreis Vulkaneifel',
    kurzname: 'Vulkaneifel',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'vulkaneifel',
    contentFile: 'daun',
  },
  wittlich: {
    name: 'Mosel: Bernkastel-Wittlich & Cochem-Zell',
    kurzname: 'Mosel',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'wittlich',
    contentFile: 'wittlich',
  },
  koblenz: {
    name: 'Koblenz, Hunsrück & Westerwald',
    kurzname: 'Koblenz/Hunsrück/Westerwald',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'koblenz',
    contentFile: 'koblenz',
  },
  trier: {
    name: 'Region Trier & Eifelkreis Bitburg-Prüm',
    kurzname: 'Trier/Bitburg-Prüm',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'trier',
    contentFile: 'trier',
  },
  ahr: {
    name: 'Ahr & Rhein: Ahrweiler & Neuwied',
    kurzname: 'Ahr/Neuwied',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'ahr',
    contentFile: 'ahr',
  },
  nahe: {
    name: 'Nahe & Rheinhessen',
    kurzname: 'Nahe/Rheinhessen',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'nahe',
    contentFile: 'nahe',
  },
  mainz: {
    name: 'Mainz & Umgebung',
    kurzname: 'Mainz',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'mainz',
    contentFile: 'mainz',
  },
  vorderpfalz: {
    name: 'Vorderpfalz',
    kurzname: 'Vorderpfalz',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'vorderpfalz',
    contentFile: 'vorderpfalz',
  },
  suedpfalz: {
    name: 'Südpfalz',
    kurzname: 'Südpfalz',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'suedpfalz',
    contentFile: 'suedpfalz',
  },
  westpfalz: {
    name: 'Westpfalz & Südwestpfalz',
    kurzname: 'Westpfalz',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'westpfalz',
    contentFile: 'westpfalz',
  },
  euskirchen: {
    name: 'Kreis Euskirchen',
    kurzname: 'Euskirchen',
    bundesland: 'Nordrhein-Westfalen',
    dbRegion: 'euskirchen',
    contentFile: 'euskirchen',
  },
  aachen: {
    name: 'Aachen & Düren',
    kurzname: 'Aachen/Düren',
    bundesland: 'Nordrhein-Westfalen',
    dbRegion: 'aachen',
    contentFile: 'aachen',
  },
  rheinsieg: {
    name: 'Rhein-Sieg-Kreis & Bonn',
    kurzname: 'Rhein-Sieg/Bonn',
    bundesland: 'Nordrhein-Westfalen',
    dbRegion: 'rheinsieg',
    contentFile: 'rheinsieg',
  },
}

export type RegionSlug = keyof typeof REGIONS

/** Alle dbRegion-Werte (für CHECK-Constraints und Validierung). */
export const DB_REGIONS = Object.values(REGIONS).map((r) => r.dbRegion)

/** Kreisschlüssel (AGS) je Region, siehe region-kreise.json. */
export function getRegionKreise(slug: RegionSlug): string[] {
  return (kreiseJson as unknown as Record<string, string[]>)[slug] ?? []
}

export function getRegionSlugByDbRegion(dbRegion: string): RegionSlug {
  const entry = Object.entries(REGIONS).find(([, v]) => v.dbRegion === dbRegion)
  return (entry?.[0] ?? 'daun') as RegionSlug
}

export function isRegionSlug(value: string | null | undefined): value is RegionSlug {
  return !!value && Object.prototype.hasOwnProperty.call(REGIONS, value)
}

/** Bundesland-Name zu einer Region (für Header/Anzeige). */
export function getBundesland(slug: RegionSlug): string {
  return REGIONS[slug].bundesland
}

/** Registrierungs-Link mit expliziter Region (kein stiller Fallback auf Daun). */
export function registerHref(region?: string | null, role?: string, plz?: string | null): string {
  const params = new URLSearchParams()
  if (isRegionSlug(region)) params.set('region', region)
  if (role) params.set('role', role)
  if (plz && /^\d{5}$/.test(plz)) params.set('plz', plz)
  const qs = params.toString()
  return qs ? `/register?${qs}` : '/register'
}

/** Region-Slug aus URL-Pfad (/wittlich/sitter -> 'wittlich'), sonst null. */
export function regionSlugFromPath(pathname: string | null | undefined): RegionSlug | null {
  const segment = (pathname ?? '').split('/')[1]
  return isRegionSlug(segment) ? segment : null
}
