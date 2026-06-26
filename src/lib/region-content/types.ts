export interface Wanderroute {
  titel: string
  beschreibung: string
  laenge?: string
  dauer?: string
  schwierigkeit?: string
  hundInfo?: string
  startpunkt?: string
}

export interface Sehenswuerdigkeit {
  name: string
  beschreibung: string
  tipp?: string
  emoji?: string
}

export interface Tierheim {
  name: string
  adresse: string
  telefon?: string
  website?: string
  oeffnungszeiten?: string
  beschreibung?: string
}

export interface Anlaufstelle {
  name: string
  typ: 'verein' | 'tiertafel' | 'notfall' | 'sonstiges'
  adresse?: string
  beschreibung: string
  website?: string
  email?: string
}

export interface HundestrandHighlight {
  name: string
  beschreibung: string
  adresse: string
  entfernung?: string
  details: string[]
}

export interface RegionContent {
  wanderrouten: Wanderroute[]
  sehenswuerdigkeiten: Sehenswuerdigkeit[]
  tierheime: Tierheim[]
  hundestrand: HundestrandHighlight
  anlaufstellen: Anlaufstelle[]
}
