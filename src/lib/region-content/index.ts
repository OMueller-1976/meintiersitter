import { daunContent } from './daun'
import { wittlichContent } from './wittlich'
import { koblenzContent } from './koblenz'
import { euskirchenContent } from './euskirchen'
import type { RegionContent } from './types'

export type { RegionContent }
export * from './types'

export const REGION_CONTENT: Record<string, RegionContent> = {
  daun: daunContent,
  wittlich: wittlichContent,
  koblenz: koblenzContent,
  euskirchen: euskirchenContent,
}
