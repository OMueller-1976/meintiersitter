import type { Anlaufstelle, UnterkunftTipp } from './types'

/** Bundesweite Haustier-Melderegister: gelten in jeder Region. Quellen: tasso.net, findefix.com (Stand 10.10.2026). */
export const BUNDESWEIT_ANLAUFSTELLEN: Anlaufstelle[] = [
  {
    name: 'TASSO e.V. Haustierregister',
    typ: 'notfall',
    beschreibung:
      'Bundesweites Haustierregister. Entlaufene oder gefundene Tiere lassen sich dort melden. 24-Stunden-Notruf: 06190 937300. Registrierung und Services sind laut TASSO kostenfrei.',
    website: 'tasso.net',
  },
  {
    name: 'FINDEFIX (Deutscher Tierschutzbund)',
    typ: 'notfall',
    adresse: 'In der Raste 10, 53129 Bonn',
    beschreibung:
      'Haustierregister des Deutschen Tierschutzbundes. Vermisste oder gefundene Tiere melden, Suchplakat erstellen. Service-Telefon (24 h): 0228 6049635.',
    website: 'findefix.com',
    email: 'info@findefix.com',
  },
]

export const UNTERKUNFT_TIPP_ALLGEMEIN: UnterkunftTipp = {
  icon: '🏡',
  titel: 'Vor der Buchung klären',
  text: 'Regeln für Hunde unterscheiden sich je nach Unterkunft: Gebühr pro Tier, Zahl der Hunde, Zugang zu Restaurant und Zimmer. Frag vor der Buchung direkt nach.',
  tipp: 'Bei Ferienhäusern nach „eingezäuntes Grundstück“ fragen',
}
