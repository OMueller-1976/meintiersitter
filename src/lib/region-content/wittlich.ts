import type { RegionContent } from './types'

export const wittlichContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Moselsteig Etappe 9 – Traben-Trarbach → Bernkastel',
      beschreibung:
        'Traumhafter Höhenweg über den Moselrücken mit Weinbergen und Ausblicken auf die Moselschlingen. Einer der schönsten Moselsteig-Abschnitte.',
      laenge: 'ca. 22 km',
      dauer: '6–7 Stunden',
      schwierigkeit: 'Mittel bis Anspruchsvoll',
      hundInfo: 'Hundefreundlich, Leine in Weinbergen empfohlen',
      startpunkt: 'Traben-Trarbach Bahnhof',
    },
    {
      titel: 'Lieserpfad',
      beschreibung:
        'Premiumwanderweg entlang der Lieser von Manderscheid nach Wittlich. Durch Wälder, Täler und idyllische Bachabschnitte — einer der schönsten Flussrandwege der Eifel.',
      laenge: 'ca. 30 km (mehrtägig möglich)',
      dauer: '2 Tage',
      schwierigkeit: 'Mittel',
      hundInfo: 'Sehr hundefreundlich, viele Wasserläufe zum Planschen',
      startpunkt: 'Manderscheid Kurpark',
    },
    {
      titel: 'Bernkastel-Kues Weinlehrpfad',
      beschreibung:
        'Rundweg durch die Weinberge rund um Bernkastel mit herrlichem Blick auf die Mosel und Burg Landshut. Infotafeln zur Weinkultur.',
      laenge: 'ca. 8 km',
      dauer: '2–3 Stunden',
      schwierigkeit: 'Leicht bis Mittel',
      hundInfo: 'Hundefreundlich außerhalb der Lese-Saison',
      startpunkt: 'Marktplatz Bernkastel',
    },
    {
      titel: 'Moselhöhenweg',
      beschreibung:
        'Fernwanderweg auf den Höhen beider Moselseiten. Spektakuläre Fernblicke, Burgen und Weinorte. Etappenweise ideal auch mit Hund.',
      laenge: 'variabel (Etappen 10–25 km)',
      dauer: 'je nach Etappe',
      schwierigkeit: 'Mittel',
      hundInfo: 'Leine in Ortschaften und Weinbergen',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Burg Landshut',
      emoji: '🏰',
      beschreibung:
        'Mittelalterliche Burgruine hoch über Bernkastel-Kues mit Panoramablick über die Mosel. Kostenloser Aufstieg, beeindruckende Kulisse.',
      tipp: 'Hunde dürfen mit auf die Burg, Leine mitnehmen.',
    },
    {
      name: 'Bernkastel-Kues Marktplatz',
      emoji: '🏘',
      beschreibung:
        'Einer der schönsten mittelalterlichen Marktplätze Deutschlands mit Fachwerkhäusern aus dem 17. Jahrhundert und historischem Rathaus.',
      tipp: 'Viele Außengastronomie-Plätze sind hundefreundlich.',
    },
    {
      name: 'Kloster Machern',
      emoji: '⛪',
      beschreibung:
        'Ehemaliges Zisterzienserkloster bei Zeltingen-Rachtig, heute Wein- und Kulturgut. Historische Anlage mit Gartenbereich.',
      tipp: 'Außengelände hundefreundlich, Besuch mit Hund möglich.',
    },
    {
      name: 'Moselmündung Koblenz',
      emoji: '🌊',
      beschreibung:
        'Das Deutscheck, wo Mosel auf Rhein trifft — eindrucksvolles Panorama an der Spitze der Halbinsel.',
    },
  ],

  tierheime: [
    {
      name: 'Eifeltierheim Altrich',
      adresse: 'Altrich, 54516 Wittlich',
      website: 'eifeltierheim.de',
      oeffnungszeiten: 'Mo–Fr 10–14 Uhr, Sa+So 15–17 Uhr',
      beschreibung:
        'Zuständig für den Landkreis Bernkastel-Wittlich. Fundtiere und Vermittlung.',
    },
  ],

  hundestrand: {
    name: 'Mosel-Badestellen bei Trittenheim',
    beschreibung:
      'Naturbelassene Uferbereiche an der Mosel bei Trittenheim eignen sich hervorragend als Badestelle für Hunde — flacher Zugang, ruhige Strömung.',
    adresse: 'Moseldamm, 54349 Trittenheim',
    entfernung: 'ca. 20 Min. von Wittlich',
    details: [
      'Flacher, kiesiger Einstieg ins Wasser',
      'Kaum Bootsverkehr am frühen Morgen',
      'Schattige Uferwiese vorhanden',
      'Kein offizieller Hundestrand — natürliche Badestelle',
      'Leine außerhalb des Wassers empfohlen',
    ],
  },

  anlaufstellen: [
    {
      name: 'Förderverein Eifeltierheim e.V.',
      typ: 'verein',
      adresse: 'Postfach 13 15, 54503 Wittlich',
      beschreibung:
        'Tierschutzverein für die Region Wittlich–Daun. Kastrationsprogramm, Tierschutz und Fundtier-Vermittlung.',
      website: 'foerderverein-eifeltierheim.de',
      email: 'info@foerderverein-eifeltierheim.de',
    },
    {
      name: 'Tierteller Eifel e.V.',
      typ: 'tiertafel',
      adresse: 'Region Gerolstein / Wittlich',
      beschreibung:
        'Gemeinnütziger Tierschutzverein. Tiertafel für einkommensschwache Tierhalter in der Region.',
      website: 'tiertellereifel.jimdofree.com',
    },
  ],
}
