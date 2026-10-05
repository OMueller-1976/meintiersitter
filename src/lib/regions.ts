export const REGIONS = {
  daun: {
    name: 'Landkreis Vulkaneifel',
    kurzname: 'Vulkaneifel',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'vulkaneifel',
    contentFile: 'daun',
  },
  wittlich: {
    name: 'Bernkastel-Wittlich',
    kurzname: 'Bernkastel-Wittlich',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'wittlich',
    contentFile: 'wittlich',
  },
  koblenz: {
    name: 'Region Koblenz & Hunsrück',
    kurzname: 'Koblenz/Hunsrück',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'koblenz',
    contentFile: 'koblenz',
  },
  euskirchen: {
    name: 'Kreis Euskirchen',
    kurzname: 'Euskirchen',
    bundesland: 'Nordrhein-Westfalen',
    dbRegion: 'euskirchen',
    contentFile: 'euskirchen',
  },
}

export type RegionSlug = keyof typeof REGIONS

export function getRegionSlugByDbRegion(dbRegion: string): RegionSlug {
  const entry = Object.entries(REGIONS).find(([, v]) => v.dbRegion === dbRegion)
  return (entry?.[0] ?? 'daun') as RegionSlug
}

export function isRegionSlug(value: string | null | undefined): value is RegionSlug {
  return !!value && Object.prototype.hasOwnProperty.call(REGIONS, value)
}

/** Registrierungs-Link mit expliziter Region (kein stiller Fallback auf Daun). */
export function registerHref(region?: string | null, role?: string): string {
  const params = new URLSearchParams()
  if (isRegionSlug(region)) params.set('region', region)
  if (role) params.set('role', role)
  const qs = params.toString()
  return qs ? `/register?${qs}` : '/register'
}

/** Region-Slug aus URL-Pfad (/wittlich/sitter -> 'wittlich'), sonst null. */
export function regionSlugFromPath(pathname: string | null | undefined): RegionSlug | null {
  const segment = (pathname ?? '').split('/')[1]
  return isRegionSlug(segment) ? segment : null
}
