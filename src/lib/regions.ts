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
