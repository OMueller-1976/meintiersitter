import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN } from './shared'

export const wittlichContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Moselsteig Etappe 9 – Traben-Trarbach → Bernkastel',
      beschreibung:
        'Traumhafter Höhenweg über den Moselrücken mit Weinbergen und Ausblicken auf die Moselschlingen. Einer der schönsten Moselsteig-Abschnitte.',
      laenge: 'ca. 22 km',
      startpunkt: 'Traben-Trarbach Bahnhof',
    },
    {
      titel: 'Lieserpfad',
      beschreibung:
        'Premiumwanderweg entlang der Lieser von Manderscheid nach Wittlich. Durch Wälder, Täler und idyllische Bachabschnitte — einer der schönsten Flussrandwege der Eifel.',
      laenge: 'ca. 30 km (mehrtägig möglich)',
      startpunkt: 'Manderscheid Kurpark',
    },
    {
      titel: 'Bernkastel-Kues Weinlehrpfad',
      beschreibung:
        'Rundweg durch die Weinberge rund um Bernkastel mit herrlichem Blick auf die Mosel und Burg Landshut. Infotafeln zur Weinkultur.',
      laenge: 'ca. 8 km',
      startpunkt: 'Marktplatz Bernkastel',
    },
    {
      titel: 'Moselsteig (Gesamtstrecke)',
      beschreibung:
        'Fernwanderweg von Perl an der Obermosel bis Koblenz, führt durch Bernkastel-Kues, Traben-Trarbach und Cochem-Zell. Etappenweise als Tagestour gehbar.',
      laenge: '365 km (Gesamtstrecke)',
      startpunkt: 'Perl',
    },
    {
      titel: 'Moselhöhenweg',
      beschreibung:
        'Fernwanderweg auf den Höhen beider Moselseiten. Etappenweise gehbar.',
      laenge: 'variabel (Etappen 10–25 km)',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Burg Landshut',
      emoji: '🏰',
      beschreibung:
        'Mittelalterliche Burgruine hoch über Bernkastel-Kues mit Panoramablick über die Mosel. Kostenloser Aufstieg, beeindruckende Kulisse.',
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
    },
    {
      name: 'Reichsburg Cochem',
      emoji: '🏰',
      beschreibung:
        'Gipfelburg über Cochem an der Mosel, 1689 von französischen Truppen gesprengt und 1874–1877 im neugotischen Stil wieder aufgebaut.',
    },
  ],

  tierheime: [
    {
      name: 'Eifeltierheim Altrich',
      adresse: 'Gut Kirchhof 6, 54518 Altrich',
      telefon: '06571 9552121',
      website: 'eifeltierheim.de',
      oeffnungszeiten: 'Besuch nur nach telefonischer Terminvereinbarung (nicht montags und mittwochs). Telefon Mo–Fr 10–14 Uhr, Sa/So 15–17 Uhr.',
      beschreibung:
        'Tierheim in Altrich bei Wittlich. Ein Zuständigkeitsgebiet nennt die Website nicht.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Hundesuchhilfe Saving Paws',
      typ: 'notfall',
      adresse: 'Birresborn (Vulkaneifel)',
      beschreibung:
        'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel, Helfer in der Eifel bis Trier. Ob ein Einsatz im Kreis Bernkastel-Wittlich möglich ist, bitte telefonisch klären. Hilfe bei entlaufenen Hunden: Suchflyer, Futterstellen, Suchhunde, Wärmebilddrohnen und Lebendfallen. Notfall-Hotline: 0170 7350767.',
      website: 'hundesuchhilfe.de',
    },
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
    ...BUNDESWEIT_ANLAUFSTELLEN,
  ],

  unterkuenfte: [
    {
      name: 'Ferienhaus an der Traumschleife',
      ort: 'Hinzerath · Hunsrück (Kreis Bernkastel-Wittlich)',
      beschreibung: 'Historisches Bauernhaus direkt an der Traumschleife „Land-Zeit-Tour", komplett eingezäuntes Grundstück.',
      website: 'https://ferienhaus-an-der-traumschleife.de',
      empfehlung: true,
      features: [
        'Komplett eingezäuntes Grundstück (ca. 2.000 m², 2 m hoher Doppelstabmattenzaun)',
        'Bis zu 7 Hunde ohne Aufpreis',
        'Hundewaschplatz und Hundekorb vorhanden',
        'Bademöglichkeit für Hunde und Tierarzt in der Nähe',
      ],
    },
    {
      name: 'Ferienwohnung Maria',
      ort: 'Wittlich · Moseleifel',
      beschreibung: 'Ferienwohnung für bis zu 4 Personen, bis zu 2 Hunde kostenlos. Hunde dürfen allein in der Wohnung bleiben, Hundesitting nach Absprache möglich.',
      website: 'https://www.hunde-urlaub.net/ferienunterkunft/a11354/',
    },
  ],
  unterkunftTipps: [
    {
      icon: '🔎',
      titel: 'Cochem-Zell: Tierheim erfragen',
      text: 'Für den Landkreis Cochem-Zell haben wir kein belegtes Tierheim gefunden. Fundtiere meldest Du am besten bei der Kreisverwaltung Cochem-Zell oder dem Ordnungsamt Deiner Gemeinde.',
    },
    {
      icon: '🏡',
      titel: 'Ferienhäuser in der Region',
      text: 'Viele Ferienwohnungen und -häuser in der Region akzeptieren Hunde. Oft mit eingezäuntem Garten.',
      tipp: 'Nach „eingezäuntes Grundstück" filtern auf Buchungsplattformen',
    },
  ],
  futterstationen: [],
}
