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
}

export type RegionSlug = keyof typeof REGIONS
