import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt koblenz)
export const koblenzContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Rheinsteig',
      beschreibung:
        'Fernwanderweg auf der rechten Rheinseite von Bonn nach Wiesbaden. Er führt durch Koblenz-Ehrenbreitstein und überquert bei Lahnstein die Lahn.',
      laenge: 'ca. 320 km (Gesamtstrecke)',
      startpunkt: 'Bonn (Marktplatz)',
    },
    {
      titel: 'Moselsteig',
      beschreibung:
        'Fernwanderweg von Perl an der Obermosel bis Koblenz, wo die Mosel in den Rhein mündet. Etappenweise als Tagestour gehbar.',
      laenge: '365 km (Gesamtstrecke)',
      startpunkt: 'Perl (Ziel: Koblenz)',
    },
    {
      titel: 'Rheinburgenweg',
      beschreibung:
        'Fernwanderweg am linken Rheinufer von Bingen bis zum Rolandsbogen bei Remagen, u. a. über Boppard, Koblenz und Andernach.',
      laenge: 'ca. 196 km (Gesamtstrecke)',
      startpunkt: 'Bingen am Rhein',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Festung Ehrenbreitstein',
      emoji: '🏰',
      beschreibung:
        'Festung auf einem rund 180 m hohen Bergsporn in Koblenz, gegenüber der Moselmündung. Teil des UNESCO-Welterbes Oberes Mittelrheintal; heute u. a. Landesmuseum Koblenz.',
    },
    {
      name: 'Burg Eltz',
      emoji: '🏯',
      beschreibung:
        'Höhenburg aus dem 12. Jahrhundert im Elztal bei Wierschem (Kreis Mayen-Koblenz), seit über 800 Jahren im Besitz der Familie Eltz und nie gewaltsam erobert. Heute öffentlich zugängliches Museum.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Koblenz',
      adresse: 'Zaunheimer Straße 26, 56072 Koblenz-Rübenach',
      telefon: '0261 406380',
      website: 'tierheim-koblenz.de',
      beschreibung: 'Tierheim des Tierschutzvereins Koblenz und Umgebung e. V. Zeiten bitte auf der Website prüfen.',
    },
    {
      name: 'Tierheim Mayen (Tierschutzverein Mayen und Umgebung e. V.)',
      adresse: 'In der Pluns 1, 56727 Mayen',
      telefon: '02651 77438',
      website: 'tierschutzverein-mayen.de',
      oeffnungszeiten: 'Di–So 14–16 Uhr (laut Website auch an Sonn- und Feiertagen).',
      beschreibung: 'Tierheim in Mayen (E-Mail: info@tierheim-mayen.de).',
    },
    {
      name: 'Tierheim Andernach',
      adresse: 'Augsbergweg 62, 56626 Andernach',
      telefon: '02632 44343',
      website: 'tierheim-andernach.de',
      beschreibung: 'Tierheim in Andernach, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierheim Montabaur',
      adresse: 'Zur Hüttenmühle 5, 56410 Montabaur',
      telefon: '02602 180826',
      website: 'tierheim-montabaur.de',
      beschreibung: 'Tierheim im Westerwald.',
    },
    {
      name: 'Tierheim Diez e. V.',
      adresse: 'Am Hammerberg, 65558 Holzheim',
      telefon: '06432 6638',
      website: 'tierschutzverein-diez.de',
      beschreibung: 'Tierheim im Raum Diez (Rhein-Lahn-Kreis).',
    },
    {
      name: 'Tierauffangstation Weitefeld',
      adresse: 'Sandstraße 29, 57586 Weitefeld',
      telefon: '02747 9153950',
      website: 'tierschutz-altenkirchen.de',
      beschreibung: 'Auffangstation im Kreis Altenkirchen.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Hundesuchhilfe Saving Paws',
      typ: 'notfall',
      adresse: 'Birresborn (Vulkaneifel)',
      beschreibung:
        'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel. Ob ein Einsatz in Deinem Ort möglich ist, bitte telefonisch klären. Hilfe bei entlaufenen Hunden: Suchflyer, Futterstellen, Suchhunde, Wärmebilddrohnen und Lebendfallen. Notfall-Hotline: 0170 7350767.',
      website: 'hundesuchhilfe.de',
    },
    ...BUNDESWEIT_ANLAUFSTELLEN,
  ],

  unterkuenfte: [
    {
      name: 'Ferienwohnung „Reif für die Insel"',
      ort: 'Urbar bei Koblenz',
      beschreibung: 'Hunde sind laut Anbieter willkommen. Zu Zaun und Garten bitte direkt beim Vermieter nachfragen.',
    },
    {
      name: 'Ferienwohnung an Rhein und Mosel',
      ort: 'Urbar bei Koblenz',
      beschreibung: 'Hunde sind laut Anbieter willkommen. Zu Zaun und Garten bitte direkt beim Vermieter nachfragen.',
    },
  ],
  unterkunftTipps: [UNTERKUNFT_TIPP_ALLGEMEIN],
  futterstationen: [
    {
      name: 'Tierhilfe Rhein-Hunsrück e.V. – Tiertafel / Futtertonne',
      typ: 'tiertafel',
      ort: 'Külz (Rhein-Hunsrück-Kreis)',
      adresse: 'In der Michelbach 8, 55471 Külz',
      beschreibung: 'Futterausgabe für bedürftige Tierhalter. Ausgabetermine und aktuelle Standort-Änderungen werden auf der Website bekannt gegeben. Telefon: 06761 5123.',
      website: 'https://www.tierhilfe-rhein-hunsrueck.de',
    },
  ],
}
