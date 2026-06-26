import type { RegionContent } from './types'

export const daunContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Dauner Maare Runde',
      beschreibung:
        'Die klassische Runde durch die drei Dauner Maare — Gemündener, Weinfelder und Schalkenmehrener Maar. Mit Dronketurm auf dem Mäuseberg (560 m) und fantastischem Ausblick über die Vulkaneifel.',
      laenge: 'ca. 12 km',
      dauer: '3–4 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: 'Hund an der Leine (Naturschutzgebiet)',
      startpunkt: 'Parkplatz Gemündener Maar, Schalkenmehren',
    },
    {
      titel: 'HeimatSpur MaareGlück',
      beschreibung:
        'Nominiert für Deutschlands schönsten Wanderweg 2026. Führt durch die typische Vulkaneifellandschaft mit Maaren, Mühlen und Wacholderheiden. 43 HeimatSpuren zur Auswahl.',
      laenge: 'variabel 8–15 km',
      dauer: '2–5 Stunden',
      schwierigkeit: 'Leicht bis Mittel',
      hundInfo: 'Hundefreundlich',
    },
    {
      titel: 'Maare-Mosel-Radweg',
      beschreibung:
        'Auf einer ehemaligen Bahntrasse von Daun nach Wittlich — fast keine Höhenunterschiede. Ideal für Radfahrer mit Hund. Viadukte, Tunnel und idyllische Waldabschnitte.',
      laenge: '60 km (Daun → Wittlich)',
      dauer: 'Ganztag',
      schwierigkeit: 'Leicht',
      hundInfo: 'Ideal für Hunde',
      startpunkt: 'Daun Bahnhof (ehemaliger Haltepunkt)',
    },
    {
      titel: 'Eifelsteig Etappe 11',
      beschreibung:
        'Daun → Manderscheid: Einer der schönsten Abschnitte des Eifelsteigs. Vorbei an Vulkankratern, durch Flusstäler, mit Blick auf die Burgruinen Manderscheid.',
      laenge: 'ca. 18 km',
      dauer: '5–6 Stunden',
      schwierigkeit: 'Anspruchsvoll',
      hundInfo: 'Leinenpflicht teilweise',
      startpunkt: 'Daun Stadtmitte (Eifelsteig-Markierung)',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Dauner Maare',
      emoji: '🌋',
      beschreibung:
        'Drei vulkanische Maare mitten in Daun — Gemündener, Weinfelder und Schalkenmehrener Maar. Einzigartiges Naturwunder der Vulkaneifel.',
      tipp: 'Rundwanderweg am Maar-Ufer ideal für Hunde (Leinenpflicht).',
    },
    {
      name: 'Nürburgring',
      emoji: '🏎',
      beschreibung:
        'Die legendäre Rennstrecke liegt in der Nähe. Erlebniswelt, Museum und Testfahrten das ganze Jahr.',
      tipp: 'Hunde auf dem Gelände erlaubt, Leine mitbringen.',
    },
    {
      name: 'Gerolstein Dolomiten',
      emoji: '🗻',
      beschreibung:
        'Bizarre Felsformationen über der Stadt Gerolstein — einzigartiges Klettermassiv in der Eifel.',
    },
    {
      name: 'Vulkankrater Strohn',
      emoji: '🌿',
      beschreibung:
        'Besterhaltener Schlackenvulkan Deutschlands. Kleiner Rundweg um den Krater, hundefreundlich.',
    },
  ],

  tierheime: [
    {
      name: 'Eifeltierheim Altrich',
      adresse: 'Altrich, 54516 Wittlich',
      website: 'eifeltierheim.de',
      oeffnungszeiten: 'Mo–Fr 10–14 Uhr, Sa+So 15–17 Uhr',
      beschreibung:
        'Betreut Fundtiere für die Region Daun, Gerolstein, Prüm und Wittlich. Besuche nur nach Terminvergabe (nicht Mo + Mi).',
    },
  ],

  hundestrand: {
    name: 'Freilinger See',
    beschreibung:
      'Einer der wenigen Seen in der Region mit offiziellem Hundestrand und Hundewiese. Eintritt frei, Kiosk vor Ort.',
    adresse: 'Am Freilinger See, 53945 Blankenheim/Freilingen',
    entfernung: 'ca. 45 Min. von Daun',
    details: [
      'Offizieller Hundestrand + Hundewiese seit 2021',
      'Separater Badebereich mit Bojenkette',
      'Kiosk mit Imbiss vor Ort',
      'Parkplatz fußläufig',
      'Leinenpflicht auch im Wasserbereich',
    ],
  },

  anlaufstellen: [
    {
      name: 'Förderverein Eifeltierheim e.V.',
      typ: 'verein',
      adresse: 'Postfach 13 15, 54503 Wittlich',
      beschreibung:
        'Gegründet 2005, Region Wittlich–Daun. Schwerpunkt: Kastration herrenloser Katzen, Tierschutz Vulkaneifel.',
      website: 'foerderverein-eifeltierheim.de',
      email: 'info@foerderverein-eifeltierheim.de',
    },
    {
      name: 'Tierteller Eifel e.V.',
      typ: 'tiertafel',
      adresse: 'Bahnhofstraße 28, 54584 Jünkerath',
      beschreibung:
        'Tiertafel für einkommensschwache Tierhalter. Ausgabe jeden 2. und 4. Donnerstag, 14–16 Uhr.',
      website: 'tiertellereifel.jimdofree.com',
    },
    {
      name: 'Katzenhilfe Südeifel e.V.',
      typ: 'verein',
      adresse: 'Region Südeifel',
      beschreibung:
        'Unterbringung, Versorgung und Vermittlung notleidender Katzen. Kastrationsprogramm.',
      website: 'katzenhilfe-suedeifel.de',
    },
  ],
}
