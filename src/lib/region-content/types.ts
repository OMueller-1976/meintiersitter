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

export interface Unterkunft {
  name: string
  ort: string
  beschreibung: string
  website?: string
  features?: string[]
  /** Als Empfehlung der Redaktion hervorheben (max. 1 pro Region) */
  empfehlung?: boolean
}

/** Allgemeine Hinweis-Kachel (Region-Tipps) in "Unterkuenfte" */
export interface UnterkunftTipp {
  icon: string
  titel: string
  text: string
  tipp?: string
}

export interface Futterstation {
  name: string
  typ: 'tiertafel' | 'futterstelle' | 'spendenannahme'
  ort: string
  adresse?: string
  beschreibung: string
  ausgabezeiten?: string
  website?: string
}

export interface RegionContent {
  wanderrouten: Wanderroute[]
  sehenswuerdigkeiten: Sehenswuerdigkeit[]
  tierheime: Tierheim[]
  /** Optional: nur setzen, wenn ein Hundestrand/eine Badestelle belegt ist. */
  hundestrand?: HundestrandHighlight
  anlaufstellen: Anlaufstelle[]
  unterkuenfte: Unterkunft[]
  unterkunftTipps: UnterkunftTipp[]
  futterstationen: Futterstation[]
}
