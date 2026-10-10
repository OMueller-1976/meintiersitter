import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt westpfalz)
export const westpfalzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Pfälzer Waldpfad: Start in Kaiserslautern',
      beschreibung: 'Fernwanderweg komplett im Pfälzerwald von Kaiserslautern nach Schweigen-Rechtenbach, in neun Tagesetappen von etwa 10 bis 23 km. Eröffnet 2011.',
      laenge: '142 km',
      startpunkt: 'Kaiserslautern',
    },
    {
      titel: 'Karlstal (Abschnitt des Pfälzer Waldpfads)',
      beschreibung: 'Im Karlstal teilt sich der Pfälzer Waldpfad die Strecke mit dem Fernwanderweg Franken-Hessen-Kurpfalz. Einzelne Etappendaten liegen uns nicht vor.',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Kaiserpfalz Barbarossaruine',
      emoji: '🏰',
      beschreibung: 'Von Friedrich I. Barbarossa im 12. Jahrhundert zur Kaiserpfalz ausgebaut. Reste der Barbarossaburg mit dem Casimirsaal sind erhalten.',
    },
    {
      name: 'Japanischer Garten Kaiserslautern',
      emoji: '🌸',
      beschreibung: 'Japanischer Garten, der laut Wikipedia zu den größten seiner Art in Europa zählt. Hunderegeln bitte vorab klären.',
    },
    {
      name: 'Rosengarten Zweibrücken',
      emoji: '🌹',
      beschreibung: 'Über 50.000 m² groß, mehr als 60.000 Rosen in etwa 2.000 Sorten. Ein Rosenweg von rund 2,5 km führt zum Wildrosengarten in der Fasanerie. Hunderegeln bitte vorab klären.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Carl Hildebrand Kaiserslautern',
      adresse: 'Altes Forsthaus 11, 67661 Kaiserslautern',
      telefon: '0631 3503667',
      website: 'tierheim-kaiserslautern.de',
      beschreibung: 'Tierheim in Kaiserslautern, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierheim Kirchheimbolanden',
      adresse: 'Am Greinerweg 1, 67292 Kirchheimbolanden',
      telefon: '06352 740033',
      website: 'tierheim-kirchheimbolanden.de',
      beschreibung: 'Tierheim im Donnersbergkreis.',
    },
    {
      name: 'Tierheim Pirmasens',
      adresse: 'Am Sommerwald 255, 66953 Pirmasens',
      telefon: '06331 65977',
      website: 'tierheim-pirmasens.com',
      beschreibung: 'Tierheim in Pirmasens.',
    },
    {
      name: 'Tierheim Zweibrücken',
      adresse: 'Ernstweilertalstraße 97, 66482 Zweibrücken',
      telefon: '06332 76460',
      website: 'tierheimzweibruecken.de',
      beschreibung: 'Tierheim in Zweibrücken.',
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
      text: 'Für die Westpfalz haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
