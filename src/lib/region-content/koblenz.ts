import type { RegionContent } from './types'

export const koblenzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Rheinsteig Boppard – St. Goar',
      beschreibung:
        'Spektakulärer Höhenweg auf der rechten Rheinseite mit Blick auf die Loreley-Schleife. Weinberge, Burgen und Aussichtspunkte wechseln sich ab.',
      laenge: 'ca. 20 km',
      dauer: '5–6 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: 'Hundefreundlich, Leine in Weinbergen',
      startpunkt: 'Boppard Bahnhof',
    },
    {
      titel: 'Moselhöhenweg Cochem – Treis-Karden',
      beschreibung:
        'Traumhafter Höhenweg oberhalb der Moselschlingen. Ausblicke auf Burg Eltz, Weinberge und das Moseltal. Zu den schönsten Wanderungen der Region.',
      laenge: 'ca. 16 km',
      dauer: '4–5 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: 'Hundefreundlich, teils Leinenpflicht',
      startpunkt: 'Cochem Marktplatz',
    },
    {
      titel: 'Maifeld-Höhenweg bei Polch',
      beschreibung:
        'Ruhiger Panoramarundweg durch das hügelige Maifeld. Weite Ausblicke über die Landschaft, kaum Steigungen, ideal für Hunde.',
      laenge: 'ca. 12 km',
      dauer: '3 Stunden',
      schwierigkeit: 'Leicht',
      hundInfo: 'Sehr hundefreundlich',
      startpunkt: 'Polch Ortsmitte',
    },
    {
      titel: 'Festungsweg Koblenz – Ehrenbreitstein',
      beschreibung:
        'Aufstieg zur Festung Ehrenbreitstein mit atemberaubendem Blick auf das Deutsche Eck, die Mosel- und Rheinmündung.',
      laenge: 'ca. 6 km',
      dauer: '2 Stunden',
      schwierigkeit: 'Mittel (Aufstieg)',
      hundInfo: 'Hunde auf Festungsgelände erlaubt',
      startpunkt: 'Koblenz Altstadt / Sessellift (Hunde erlaubt)',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Festung Ehrenbreitstein',
      emoji: '🏰',
      beschreibung:
        'Eine der größten erhaltenen Festungsanlagen Europas, hoch über dem Deutschen Eck. Welterbe-Panorama über Rhein und Mosel.',
      tipp: 'Hunde erlaubt, Sessellift mit Hund nutzbar.',
    },
    {
      name: 'Deutsches Eck – Moselmündung',
      emoji: '🌊',
      beschreibung:
        'Die Mündung der Mosel in den Rhein — das Wahrzeichen von Koblenz. Eindrucksvoller Spaziergang entlang der Promenade.',
      tipp: 'Breite Promenade perfekt für Hunde, überall Leine.',
    },
    {
      name: 'Boppard Rheinstrecke',
      emoji: '🚂',
      beschreibung:
        'Der schönste Abschnitt des Mittelrheins mit der großen Rheinschleife. Von der Gedeonseck-Aussicht spektakulärer Blick auf die Schleife.',
      tipp: 'Stuhlsesselbahn Boppard — Hunde erlaubt.',
    },
    {
      name: 'Burg Eltz',
      emoji: '🏯',
      beschreibung:
        'Vollständig erhaltene Burg im Elztal, nie zerstört. Eine der beeindruckendsten Burgen Deutschlands, umgeben von Wäldern.',
      tipp: 'Hunde auf dem Außengelände erlaubt. Parkplatz mit Fußweg zur Burg (ca. 30 Min.).',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Koblenz',
      adresse: 'Koblenz, Rheinland-Pfalz',
      website: 'tierheim-koblenz.de',
      beschreibung:
        'Städtisches Tierheim für Koblenz und Umgebung. Fundtiere, Vermittlung und Tierschutz.',
    },
    {
      name: 'Tierheim Mayen',
      adresse: 'Mayen, Rheinland-Pfalz',
      beschreibung:
        'Tierheim des Tierschutzvereins Mayen und Umgebung e.V. Annahme und Vermittlung von Fundtieren.',
    },
  ],

  hundestrand: {
    name: 'Uferwiesen Boppard am Rhein',
    beschreibung:
      'Die ausgedehnten Rheinuferwiesen in Boppard bieten Hunden viel Platz zum Toben und Schwimmen. Flacher Rheinstrand, weitläufig und ruhig.',
    adresse: 'Rheinuferstraße, 56154 Boppard',
    entfernung: 'ca. 50 Min. von Koblenz',
    details: [
      'Flacher Zugang zum Rhein, kiesiger Strand',
      'Große Uferwiesen zum Freilaufen',
      'Beste Zeiten: früh morgens oder Spätnachmittag',
      'Kein offizieller Hundestrand — naturbelassenes Ufer',
      'Leine in Ortsnähe und auf Promenade',
    ],
  },

  anlaufstellen: [
    {
      name: 'Tierschutzverein Koblenz und Umgebung e.V.',
      typ: 'verein',
      adresse: 'Koblenz',
      beschreibung:
        'Träger des Tierheims Koblenz. Tierschutz, Fundtiere, Kastrationsprojekte für die Region.',
      website: 'tierheim-koblenz.de',
    },
    {
      name: 'Tierschutzverein Cochem-Zell e.V.',
      typ: 'verein',
      adresse: 'Cochem',
      beschreibung:
        'Tierschutz für den Landkreis Cochem-Zell. Fundtier-Aufnahme und Vermittlung.',
    },
  ],
}
