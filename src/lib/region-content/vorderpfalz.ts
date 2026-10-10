import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt vorderpfalz)
export const vorderpfalzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Pfälzer Weinsteig: Bockenheim → Neuleiningen',
      beschreibung: 'Erste Etappe des Pfälzer Weinsteigs durch die Weinberge der Deutschen Weinstraße. Der Weinsteig führt in elf Tagesetappen nach Schweigen-Rechtenbach.',
      laenge: '17,0 km (Gesamtweg ca. 185 km)',
      startpunkt: 'Bockenheim an der Weinstraße',
    },
    {
      titel: 'Rheinterrassenweg',
      beschreibung: 'Fernwanderweg im rheinhessischen Rheinabschnitt zwischen Worms und Mainz in sechs Etappen. Für die Vorderpfalz als Anschluss am Rhein interessant.',
      laenge: 'ca. 75 km',
      startpunkt: 'Worms',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Speyerer Dom',
      emoji: '⛪',
      beschreibung: 'Größte noch erhaltene romanische Kirche der Welt, UNESCO-Welterbe seit 1981. Bau ab 1030 unter Kaiser Konrad II.',
    },
    {
      name: 'Altpörtel Speyer',
      emoji: '🏛',
      beschreibung: 'Das 55 m hohe frühere westliche Haupttor der Stadt. Untere Teile von 1230–1250, oberstes Geschoss 1512–1514.',
    },
    {
      name: 'Ebertpark Ludwigshafen',
      emoji: '🌳',
      beschreibung: 'Park in Ludwigshafen mit dem Bogenschützen von Ernst Moritz Geyger (1928) vor dem Turmrestaurant.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Ludwigshafen e. V.',
      adresse: 'Wollstraße 135b, 67065 Ludwigshafen',
      telefon: '0621 553000',
      website: 'tierheim-ludwigshafen.com',
      beschreibung: 'Tierheim in Ludwigshafen (E-Mail: info@tierheim-ludwigshafen.com). Öffnungszeiten siehe Website.',
    },
    {
      name: 'Tierschutzverein Ludwigshafen und Umgebung e. V.',
      adresse: 'Königstraße 35, 67067 Ludwigshafen',
      telefon: '0621 584290',
      website: 'tierschutzverein-ludwigshafen.de',
      beschreibung: 'Tierschutzverein in Ludwigshafen, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierheim Frankenthal',
      adresse: 'Friedrich-Ebert-Straße 12, 67227 Frankenthal',
      telefon: '06233 28485',
      website: 'frankenthaler-tierschutzverein.de',
      beschreibung: 'Tierheim des Frankenthaler Tierschutzvereins.',
    },
    {
      name: 'Tierheim Speyer u. U. e. V.',
      adresse: 'Mäuseweg 9, 67346 Speyer',
      telefon: '06232 33339',
      website: 'tierheim-speyer.de',
      oeffnungszeiten: 'Keine generellen Öffnungszeiten, Besuch nur nach individueller Terminabsprache.',
      beschreibung: 'Tierheim in Speyer.',
    },
    {
      name: 'Tierheim Haßloch',
      adresse: 'Füllerweg 157, 67454 Haßloch',
      telefon: '06324 4944',
      website: 'tierschutzverein-hassloch.de',
      beschreibung: 'Tierheim des Tierschutzvereins Haßloch.',
    },
    {
      name: 'Tiernotinsel Bad Dürkheim e. V.',
      adresse: 'Martin-Butzer-Straße 29, 67098 Bad Dürkheim',
      telefon: '0151 42877774',
      website: 'tiernotinsel-bad-duerkheim.de',
      beschreibung: 'Verein in Bad Dürkheim, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierhilfe Bad Dürkheim-Freinsheim e. V. (Auffangstation Pfalzhof)',
      adresse: 'Lambsheimer Straße 60, 67158 Ellerstadt',
      telefon: '0157 82038186',
      website: 'tierhilfe-duew.de',
      beschreibung: 'Auffangstation im Landkreis Bad Dürkheim.',
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
      text: 'Für die Vorderpfalz haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
