export const REGIONS = {
  daun: {
    name: 'Landkreis Vulkaneifel',
    kurzname: 'Vulkaneifel',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'vulkaneifel',
  },
  wittlich: {
    name: 'Bernkastel-Wittlich',
    kurzname: 'Bernkastel-Wittlich',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'wittlich',
  },
  koblenz: {
    name: 'Region Koblenz & Hunsrück',
    kurzname: 'Koblenz/Hunsrück',
    bundesland: 'Rheinland-Pfalz',
    dbRegion: 'koblenz',
  },
  euskirchen: {
    name: 'Kreis Euskirchen',
    kurzname: 'Euskirchen',
    bundesland: 'Nordrhein-Westfalen',
    dbRegion: 'euskirchen',
  },
}

export type RegionSlug = keyof typeof REGIONS
