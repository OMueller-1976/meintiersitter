import type { RegionContent } from './types'

export const euskirchenContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Eifelsteig Etappe 13 – Blankenheim → Nettersheim',
      beschreibung:
        'Preisgekrönter Fernwanderweg durch die Hocheifel. Vorbei an der Ahrquelle, durch Täler und Heiden — eine der schönsten Etappen des Eifelsteigs.',
      laenge: 'ca. 19 km',
      dauer: '5–6 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: 'Hundefreundlich, Leine in Naturschutzgebieten',
      startpunkt: 'Blankenheim Burg',
    },
    {
      titel: 'Nationalpark Eifel – Wilder Kermeter',
      beschreibung:
        'Kernzone des Nationalparks mit altem Buchenwald und tiefen Schluchten. Wildnis erleben in direkter Nähe — Wölfe und Wildkatzen leben hier.',
      laenge: 'ca. 15 km',
      dauer: '4–5 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: '⚠️ Im Nationalpark Kernzone keine Hunde erlaubt — Randbereiche nutzbar',
      startpunkt: 'Parkplatz Einruhr (Rurseeufer)',
    },
    {
      titel: 'Rurtal-Wanderweg – Rurtalsperre Runde',
      beschreibung:
        'Rundweg rund um den Obersee der Rurtalsperre. Imposante Staudammlandschaft, Wälder und Ausblicke auf das Wasser — einer der beliebtesten Wanderwege der Region.',
      laenge: 'ca. 18 km',
      dauer: '4–5 Stunden',
      schwierigkeit: 'Mittel',
      hundInfo: 'Hundefreundlich, viele Wasserstellen',
      startpunkt: 'Parkplatz Rurtalsperre, Simmerath',
    },
    {
      titel: 'Bad Münstereifel Stadtmauerweg',
      beschreibung:
        'Spaziergang entlang der vollständig erhaltenen mittelalterlichen Stadtmauer von Bad Münstereifel. Anschließend durch das Erfttal.',
      laenge: 'ca. 6 km',
      dauer: '1,5–2 Stunden',
      schwierigkeit: 'Leicht',
      hundInfo: 'Hundefreundlich, Innenstadt mit Leine',
      startpunkt: 'Orchheimer Tor, Bad Münstereifel',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Nationalpark Eifel',
      emoji: '🌲',
      beschreibung:
        'Einziger Nationalpark in NRW — 110 km² Wildnis mit Buchenurwald, Seen und seltener Fauna. Wölfe, Wildkatzen und Schwarzstörche leben hier.',
      tipp: 'Hunde im Nationalpark nur auf markierten Wegen und an der Leine. Kernzonen gesperrt.',
    },
    {
      name: 'Rurtalsperre',
      emoji: '💧',
      beschreibung:
        'Größtes Stausee-System Deutschlands. Obersee und Urftsee bieten Bootfahren, Wandern und Radeln in spektakulärer Landschaft.',
      tipp: 'Bootssteg Rurberg — Hunde am Ufer erlaubt.',
    },
    {
      name: 'Bad Münstereifel Altstadt',
      emoji: '🏘',
      beschreibung:
        'Vollständig erhaltene mittelalterliche Stadtmauer, Fachwerkhäuser und romanische Stiftskirche. Eine der am besten erhaltenen Kleinstädte Deutschlands.',
      tipp: 'Innenstadt gut zu Fuß erkundbar, viele Cafés hundefreundlich.',
    },
    {
      name: 'Burg Blankenheim',
      emoji: '🏰',
      beschreibung:
        'Mittelalterliche Wasserburg mitten in Blankenheim, heute Jugendherberge. Einzigartig — die Ahrquelle entspringt direkt im Burghof.',
      tipp: 'Außengelände frei zugänglich, Hunde erlaubt.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Euskirchen',
      adresse: 'Euskirchen, Nordrhein-Westfalen',
      beschreibung:
        'Tierheim des Tierschutzvereins Euskirchen und Umgebung e.V. Fundtiere, Hunde- und Katzenvermittlung.',
    },
    {
      name: 'Tierheim Rheinbach',
      adresse: 'Rheinbach, Nordrhein-Westfalen',
      beschreibung:
        'Tierschutzverein Rheinbach e.V. Vermittlung von Hunden, Katzen und Kleintieren.',
    },
  ],

  hundestrand: {
    name: 'Rurseeufer Einruhr',
    beschreibung:
      'Das Rurseeufer bei Einruhr bietet Hunden traumhafte Bademöglichkeiten — klares Wasser, kiesige Uferbereiche und viel Platz in der Nationalpark-Landschaft.',
    adresse: 'Seeweg, 52152 Simmerath-Einruhr',
    entfernung: 'ca. 45 Min. von Euskirchen',
    details: [
      'Flacher Kiesstrand direkt am Rurseeufer',
      'Klares, sauberes Stausee-Wasser',
      'Große Uferwiesen, weitläufig',
      'Außerhalb des Nationalpark-Kerngebiets',
      'Leine außerhalb Wasserbereich empfohlen',
    ],
  },

  anlaufstellen: [
    {
      name: 'Tierschutzverein Euskirchen und Umgebung e.V.',
      typ: 'verein',
      adresse: 'Euskirchen',
      beschreibung:
        'Tierschutz, Fundtier-Aufnahme und Vermittlung für den Kreis Euskirchen.',
    },
    {
      name: 'NABU Euskirchen',
      typ: 'verein',
      adresse: 'Kreis Euskirchen',
      beschreibung:
        'Naturschutz und Wildtier-Erstversorgung. Anlaufstelle bei Fundvögeln und verletzten Wildtieren.',
    },
    {
      name: 'Nationalpark-Wacht Eifel',
      typ: 'notfall',
      adresse: 'Nationalpark Eifel',
      beschreibung:
        'Rangerdienst des Nationalparks. Auskunft zu Regeln im Nationalpark und bei Wildtierfunden.',
      website: 'nationalpark-eifel.de',
    },
  ],
}
