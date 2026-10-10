import { daunContent } from './daun'
import { wittlichContent } from './wittlich'
import { koblenzContent } from './koblenz'
import { euskirchenContent } from './euskirchen'
import { trierContent } from './trier'
import { ahrContent } from './ahr'
import { naheContent } from './nahe'
import { mainzContent } from './mainz'
import { vorderpfalzContent } from './vorderpfalz'
import { suedpfalzContent } from './suedpfalz'
import { westpfalzContent } from './westpfalz'
import { aachenContent } from './aachen'
import { rheinsiegContent } from './rheinsieg'
import type { RegionContent } from './types'

export type { RegionContent }
export * from './types'

/** Inhalt einer Region. Kein stiller Fallback auf eine andere Region: unbekannt -> undefined. */
export function getRegionContent(slug: string): RegionContent | undefined {
  return Object.prototype.hasOwnProperty.call(REGION_CONTENT, slug) ? REGION_CONTENT[slug] : undefined
}

export const REGION_CONTENT: Record<string, RegionContent> = {
  daun: daunContent,
  wittlich: wittlichContent,
  koblenz: koblenzContent,
  euskirchen: euskirchenContent,
  trier: trierContent,
  ahr: ahrContent,
  nahe: naheContent,
  mainz: mainzContent,
  vorderpfalz: vorderpfalzContent,
  suedpfalz: suedpfalzContent,
  westpfalz: westpfalzContent,
  aachen: aachenContent,
  rheinsieg: rheinsiegContent,
}
