import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt rheinsieg)
export const rheinsiegContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Rheinsteig',
      beschreibung: 'Fernwanderweg auf der rechten Rheinseite von Bonn nach Wiesbaden, führt durch das Siebengebirge. Etappenweise gut als Tagestour.',
      laenge: 'ca. 320 km (Gesamtstrecke)',
      startpunkt: 'Bonn (Marktplatz)',
    },
    {
      titel: 'Nachtigallental und Annatal im Siebengebirge',
      beschreibung: 'Beliebte Talwanderungen im Naturpark Siebengebirge (Start in Königswinter bzw. Rhöndorf). Der Naturpark hat rund 200 km beschilderte Wege.',
      startpunkt: 'Königswinter / Rhöndorf',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Drachenfels',
      emoji: '🏰',
      beschreibung: 'Burgruine (320,7 m) im Siebengebirge mit Gipfelrestaurant. Die Drachenfelsbahn fährt zum Berg; ob Hunde mitfahren dürfen, bitte vorab erfragen.',
    },
    {
      name: 'Löwenburg',
      emoji: '🏰',
      beschreibung: 'Burgruine (455 m) im Siebengebirge bei Bad Honnef.',
    },
    {
      name: 'Petersberg',
      emoji: '⛰',
      beschreibung: 'Berg (335,9 m) mit keltischem Ringwall und Petersberg-Kapelle, früher Gästehaus der Bundesregierung.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Troisdorf (Tierschutz für den Rhein-Sieg-Kreis e. V.)',
      adresse: 'Siebengebirgsallee 105, 53840 Troisdorf',
      telefon: '02241 1277700',
      website: 'tierheim-troisdorf.de',
      oeffnungszeiten: 'Telefon Mo–Fr 9–12 Uhr. Besuch sonntags 14–16 Uhr. Kennenlernen mit einem Tier nach Termin (vermittlung@tierheim-troisdorf.de). Fundtiere: 0170 9305563.',
      beschreibung: 'Tierheim des Vereins Tierschutz für den Rhein-Sieg-Kreis. Ein Einzugsgebiet nennt die Website nicht.',
    },
    {
      name: 'Tierheim Albert Schweitzer Bonn (Tierschutz Bonn und Umgebung e. V.)',
      adresse: 'Lambareneweg 2, 53119 Bonn',
      telefon: '0228 636995',
      website: 'tierheimbonn.de',
      oeffnungszeiten: 'Besuch Fr und Sa 14–17 Uhr sowie nach Vereinbarung. Telefonzeiten siehe Website.',
      beschreibung: 'Tierheim in Bonn (E-Mail: info@tierheimbonn.de). Stand Oktober 2026 weist die Website auf einen Aufnahmestopp für Fund- und Abgabekatzen hin.',
    },
    {
      name: 'Orscheider Tierschutzhof (Tier-, Natur- und Artenschutz Siebengebirge e. V.)',
      adresse: 'Orscheider Straße 7, 53604 Bad Honnef-Aegidienberg',
      telefon: '02224 9803216',
      beschreibung: 'Tierschutzhof im Siebengebirge, gelistet beim Tierschutzbund Rheinland-Pfalz.',
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
      text: 'Für Rhein-Sieg & Bonn haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
