import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt trier)
export const trierContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Eifelsteig, Etappe 15: Kordel → Trier',
      beschreibung:
        'Letzte Etappe des Eifelsteigs. Der Fernwanderweg endet in Trier und lässt sich von dort auch in Gegenrichtung gehen.',
      laenge: '17,0 km',
      startpunkt: 'Kordel',
    },
    {
      titel: 'Eifelsteig, Etappe 14: Bruch → Kordel',
      beschreibung:
        'Lange Etappe des Eifelsteigs auf dem Weg nach Trier. Wegen der Länge eher etwas für geübte Hunde und Halter.',
      laenge: '27,8 km',
      startpunkt: 'Bruch',
    },
    {
      titel: 'Saar-Hunsrück-Steig, Trierer Zweig (Ruwer-Route)',
      beschreibung:
        'Vom Stausee Kell über Kasel/Mertesdorf zum Trimmelter Hof bei Trier. Der Zweig führt vom Hauptweg bei Hermeskeil aus nach Trier.',
      laenge: '20,2 km + 15,3 km (zwei Etappen)',
      startpunkt: 'Stausee Kell',
    },
    {
      titel: 'Moselsteig',
      beschreibung:
        'Fernwanderweg von Perl an der Obermosel bis Koblenz mit Stationen in Trier. Etappenweise gut als Tagestour zu gehen.',
      laenge: '365 km (Gesamtstrecke)',
      startpunkt: 'Perl',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Porta Nigra',
      emoji: '🏛',
      beschreibung:
        'Römisches Stadttor im Norden Triers und der am besten erhaltene Teil der römischen Stadtmauer. UNESCO-Welterbe seit 1986.',
    },
    {
      name: 'Römerbrücke',
      emoji: '🌉',
      beschreibung: 'Römische Brücke über die Mosel, die bis heute erhalten ist. Teil des UNESCO-Welterbes in Trier.',
    },
    {
      name: 'Trierer Dom und Liebfrauenkirche',
      emoji: '⛪',
      beschreibung:
        'Romanischer Dom mit spätantikem Kern, daneben die frühgotische Liebfrauenkirche. Beide gehören zum UNESCO-Welterbe.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Trier (Tierschutzverein Trier und Umgebung e. V.)',
      adresse: 'Heidenberg 1, 54294 Trier',
      telefon: '0651 86156',
      website: 'trier-tierheim.de',
      oeffnungszeiten: 'Di, Mi, Do, Sa, So 14–16 Uhr, nach vorheriger Terminvereinbarung. Mo und Fr geschlossen.',
      beschreibung:
        'Fundtiere aus der Stadt Trier und umliegenden Landkreisen (laut Tierheim u. a. Trier-Saarburg, Bitburg-Prüm, Bernkastel-Wittlich). Gefundene Tiere zuerst beim örtlichen Ordnungsamt melden. Stand Oktober 2026: Aufnahmestopp für Abgabetiere, Fundtiere und beschlagnahmte Tiere werden weiter aufgenommen.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Tierschutzverein Trier und Umgebung e. V.',
      typ: 'verein',
      adresse: 'Heidenberg 1, 54294 Trier',
      beschreibung:
        'Träger des Tierheims Trier. Büro: 0651 9983338 (Mo–Fr 8–12 Uhr, keine Vermittlungsauskunft). Tiervermittlung: 0651 86156.',
      website: 'trier-tierheim.de',
      email: 'buero@tierheim-trier.de',
    },
    {
      name: 'Hundesuchhilfe Saving Paws',
      typ: 'notfall',
      adresse: 'Birresborn (Vulkaneifel)',
      beschreibung:
        'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel. Nach Angaben des Vereins sind Helfer in der Eifel bis Trier verteilt. Ob ein Einsatz in Deinem Ort möglich ist, bitte telefonisch klären. Notfall-Hotline: 0170 7350767.',
      website: 'hundesuchhilfe.de',
    },
    ...BUNDESWEIT_ANLAUFSTELLEN,
  ],

  unterkuenfte: [
    {
      name: 'Hotel Ehranger Hof',
      ort: 'Trier',
      beschreibung: 'Hotel in Trier, Haustiere sind laut Buchungsportal HotelSpecials erlaubt. Gebühr und Regeln bitte vorab erfragen.',
      features: ['Haustiere erlaubt (laut HotelSpecials, Stand Oktober 2026)'],
    },
    {
      name: 'Deutscher Hof Trier',
      ort: 'Trier',
      beschreibung: 'Hotel in Trier, Haustiere sind laut Buchungsportal HotelSpecials erlaubt. Gebühr und Regeln bitte vorab erfragen.',
      features: ['Haustiere erlaubt (laut HotelSpecials, Stand Oktober 2026)'],
    },
    {
      name: 'Hotel-Restaurant Leander',
      ort: 'Bitburg · Eifelkreis Bitburg-Prüm',
      beschreibung: 'Hotel in Bitburg, Haustiere sind laut Buchungsportal HotelSpecials erlaubt. Gebühr und Regeln bitte vorab erfragen.',
      features: ['Haustiere erlaubt (laut HotelSpecials, Stand Oktober 2026)'],
    },
  ],
  unterkunftTipps: [UNTERKUNFT_TIPP_ALLGEMEIN],
  futterstationen: [],
}
