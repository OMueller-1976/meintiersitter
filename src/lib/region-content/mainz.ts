import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt mainz)
export const mainzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Rheinterrassenweg: Bodenheim → Mainz',
      beschreibung: 'Letzte (6.) Etappe des Rheinterrassenwegs über Laubenheim bis zum Stadtpark in Mainz. Der gesamte Weg verläuft in sechs Etappen von Worms nach Mainz.',
      laenge: 'Gesamtweg ca. 75 km',
      startpunkt: 'Bodenheim',
    },
    {
      titel: 'Rheinburgenweg',
      beschreibung: 'Fernwanderweg am linken Rheinufer, der in Bingen beginnt und über Bacharach, St. Goar, Boppard und Koblenz bis zum Rolandsbogen bei Remagen führt.',
      laenge: 'ca. 196 km (Gesamtstrecke)',
      startpunkt: 'Bingen am Rhein',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Mainzer Dom',
      emoji: '⛪',
      beschreibung: 'Bedeutendstes romanisches Bauwerk in Mainz, unter Erzbischof Willigis errichtet.',
    },
    {
      name: 'St. Stephan',
      emoji: '🪟',
      beschreibung: 'Größte gotische Kirche der Stadt, bekannt für die Fenster von Marc Chagall.',
    },
    {
      name: 'Gutenberg-Museum',
      emoji: '📖',
      beschreibung: 'Museum im Haus „Zum Römischen Kaiser“. Ob Hunde hinein dürfen, bitte vorab erfragen.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Mainz (Tierschutzverein Mainz und Umgebung e. V.)',
      adresse: 'Zwerchallee 13–15, 55120 Mainz',
      telefon: '06131 687066',
      website: 'tierheim-mainz.de',
      oeffnungszeiten: 'Büro und Telefon Mo–Fr 10–12 und 15–17 Uhr. Vermittlung samstags 14:30–16:30 Uhr (Termin empfohlen). An Feiertagen und Rosenmontag geschlossen.',
      beschreibung: 'Tierheim in Mainz (E-Mail: info@thmainz.de). Ein Einzugsgebiet nennt die Website nicht.',
    },
    {
      name: 'Tierschutz Bingen e. V.',
      adresse: 'Aspisheimer Weg 26, 55459 Grolsheim',
      telefon: '06727 8750',
      oeffnungszeiten: 'Nur nach Terminvereinbarung.',
      beschreibung: 'Tierheim im Raum Bingen (Landkreis Mainz-Bingen).',
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
      text: 'Für Mainz & Umgebung haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
