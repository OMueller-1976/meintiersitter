import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt ahr)
export const ahrContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Ahrsteig: Bad Neuenahr → Schloss Sinzig',
      beschreibung: 'Unterer Teil des Ahrsteigs, der an der Ahr entlang bis zum Schloss Sinzig kurz vor der Mündung in den Rhein führt.',
      laenge: '17,6 km',
      startpunkt: 'Bad Neuenahr',
    },
    {
      titel: 'Ahrsteig: Insul → Kreuzberg (Altenahr)',
      beschreibung: 'Etappe im oberen Ahrtal bis nach Altenahr. Der Ahrsteig beginnt insgesamt an der Ahrquelle in Blankenheim.',
      laenge: '17,4 km',
      startpunkt: 'Insul',
    },
    {
      titel: 'Rheinburgenweg',
      beschreibung: 'Fernwanderweg von Bingen bis zum Rolandsbogen bei Remagen am linken Rheinufer, mit Stationen wie Boppard, Koblenz, Andernach, Bad Breisig und Sinzig. Etappenweise als Tagestour gehbar.',
      laenge: 'ca. 196 km (Gesamtstrecke)',
      startpunkt: 'Rolandsbogen, Remagen (Ziel am Nordende)',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Altstadt Ahrweiler mit Stadttoren',
      emoji: '🏘',
      beschreibung: 'Mittelalterliche Altstadt mit Fachwerkhäusern und gut erhaltener Stadtmauer. Vier Stadttore sind erhalten: Ober-, Nieder-, Adenbach- und Ahrtor.',
    },
    {
      name: 'Römervilla Ahrweiler',
      emoji: '🏛',
      beschreibung: 'Römisches Landhaus aus dem 2. bis 3. Jahrhundert mit großem Badetrakt, konserviert und für Besucher geöffnet. Ob Hunde mit hinein dürfen, bitte vorab erfragen.',
    },
    {
      name: 'Langer Köbes',
      emoji: '🗼',
      beschreibung: 'Aussichtsturm (15 m, von 1972) auf dem Neuenahrer Berg an der Stelle der früheren Burg Neuenahr.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim und Tierschutzverein Kreis Ahrweiler e. V.',
      adresse: 'Blankertshohl 25, 53424 Remagen',
      telefon: '02642 21600',
      website: 'tierheim-remagen.de',
      oeffnungszeiten: 'Besuch nur nach Terminvereinbarung. Täglich außer Dienstag, 8:00–12:30 und 14:30–17:00 Uhr.',
      beschreibung: 'Zuständig für Fund-, Abgabe- und Sicherstellungstiere im gesamten Kreis Ahrweiler (u. a. Remagen, Sinzig, Bad Neuenahr-Ahrweiler, Adenau, Niederzissen) und die Gemeinde Wachtberg.',
    },
    {
      name: 'Tierheim Neuwied (Tierschutzverein Neuwied)',
      adresse: 'Ludwigshof 1, 56567 Neuwied',
      telefon: '02631 55356',
      website: 'tierheim-neuwied.de',
      oeffnungszeiten: 'Besuch nachmittags nach Absprache, an Feiertagen geschlossen. Büro Mo–Fr 9–13 Uhr.',
      beschreibung: 'Tierheim in Neuwied mit Hunden, Katzen, Kleintieren und Fundtieren.',
    },
    {
      name: 'Bund gegen Missbrauch der Tiere e. V., Tierheim Heckenbach-Frankenau',
      adresse: 'Heckenbach (Adresse bitte telefonisch erfragen)',
      telefon: '02647 3375',
      beschreibung: 'Laut Kreisverwaltung Ahrweiler als Tierschutzverein im Kreis gelistet.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Katzenschutzverein Bad Neuenahr-Ahrweiler e. V.',
      typ: 'verein',
      adresse: 'Landhoferstraße 6, 53501 Grafschaft',
      beschreibung: 'Verein für Katzen im Kreis Ahrweiler. Telefon: 02641 29354.',
    },
    {
      name: 'Katzenschutzfreunde Rhein-Ahr-Eifel e. V.',
      typ: 'verein',
      adresse: 'Birkenweg 40, 53426 Schalkenbach',
      beschreibung: 'Verein für Katzen in der Region. Telefon: 02646 915928.',
      website: 'katzenschutzfreunde.de',
      email: 'info@katzenschutzfreunde.de',
    },
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
      text: 'Für Ahr & Rhein haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
