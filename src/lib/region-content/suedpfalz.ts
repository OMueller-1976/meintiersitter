import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt suedpfalz)
export const suedpfalzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Pfälzer Weinsteig',
      beschreibung: 'Fernwanderweg von Bockenheim an der Weinstraße bis Schweigen-Rechtenbach an der Grenze zum Elsass, in elf empfohlenen Tagesetappen von etwa 12 bis knapp 20 km. Dort schließt der Pfälzer Waldpfad an.',
      laenge: 'ca. 185 km (172–185 km je nach Abstechern)',
      startpunkt: 'Ziel: Schweigen-Rechtenbach',
    },
    {
      titel: 'Pfälzer Waldpfad',
      beschreibung: 'Fernwanderweg komplett im Pfälzerwald von Kaiserslautern nach Schweigen-Rechtenbach, in neun Tagesetappen von etwa 10 bis 23 km. Führt u. a. nahe Dahn, Busenberg und Burg Berwartstein.',
      laenge: '142 km',
      startpunkt: 'Ziel: Schweigen-Rechtenbach',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Hambacher Schloss',
      emoji: '🏰',
      beschreibung: 'Auf der Schlossberg-Höhe (376 m) bei Neustadt an der Weinstraße. 1832 Schauplatz des „Hambacher Fests“, Symbol der frühen deutschen Demokratie. Heute Museum und Veranstaltungsort.',
    },
    {
      name: 'Burg Trifels',
      emoji: '🏰',
      beschreibung: 'Reichsburg auf dem Sonnenberg (479 m) bei Annweiler am Trifels. Hier saß 1193 Richard Löwenherz gefangen. Der Hauptturm ist als Aussichtsturm zugänglich.',
    },
    {
      name: 'Stiftskirche Landau',
      emoji: '⛪',
      beschreibung: 'Die 1333 geweihte evangelische Stiftskirche ist das älteste Gotteshaus der Stadt und Wahrzeichen der Altstadt.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim „Maria Höffner“ Landau',
      adresse: 'Rodenweg 1, 76829 Landau',
      telefon: '06341 62658',
      website: 'tierheim-landau.de',
      beschreibung: 'Tierheim in Landau, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierheim Neustadt an der Weinstraße',
      adresse: 'Adolf-Kolping-Straße 25, 67433 Neustadt/Wstr.',
      telefon: '06321 17096',
      website: 'neustadter-tierheim.de',
      beschreibung: 'Tierheim in Neustadt an der Weinstraße.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Hundesuchhilfe Saving Paws',
      typ: 'notfall',
      adresse: 'Birresborn (Vulkaneifel)',
      beschreibung: 'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel. Ob ein Einsatz in Deinem Ort möglich ist, bitte telefonisch klären. Notfall-Hotline: 0170 7350767.',
      website: 'hundesuchhilfe.de',
    },
    ...BUNDESWEIT_ANLAUFSTELLEN,
  ],

  unterkuenfte: [],
  unterkunftTipps: [
    UNTERKUNFT_TIPP_ALLGEMEIN,
    {
      icon: '🔎',
      titel: 'Noch keine geprüften Empfehlungen',
      text: 'Für die Südpfalz haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
