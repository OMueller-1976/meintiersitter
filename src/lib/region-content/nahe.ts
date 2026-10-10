import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt nahe)
export const naheContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Nahe-Felsen-Weg (Traumschleife) in Idar-Oberstein',
      beschreibung: 'Rundweg um die Altstadt von Idar-Oberstein, als „Traumschleife“ ausgezeichnet. Führt in die Nähe von Felsenkirche und Burgruinen.',
      laenge: '9,4 km',
      startpunkt: 'Idar-Oberstein',
    },
    {
      titel: 'Soonwaldsteig',
      beschreibung: 'Fernwanderweg von Kirn an der Nahe nach Bingen am Rhein in sechs Etappen zwischen 12 und 15 km, durch den Soonwald.',
      laenge: 'ca. 83 km (6 Etappen)',
      startpunkt: 'Kirn (Nahe)',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Felsenkirche Idar-Oberstein',
      emoji: '⛪',
      beschreibung: 'Kirche von 1482 in der Felswand, zusammen mit der Burg Bosselstein und dem Schloss Oberstein das Wahrzeichen der Stadt.',
    },
    {
      name: 'Kauzenburg Bad Kreuznach',
      emoji: '🏰',
      beschreibung: 'Burg der Grafen von Sponheim, erbaut zwischen 1206 und 1230, 1688 von französischen Truppen erobert und 1689 zerstört.',
    },
    {
      name: 'Wormser Dom St. Peter',
      emoji: '⛪',
      beschreibung: 'Einer der drei romanischen Kaiserdome neben Mainz und Speyer. Der Jüdische Friedhof „Heiliger Sand“ und der Synagogenbezirk gehören seit 2021 zum UNESCO-Welterbe.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim Bad Kreuznach (Tierschutzverein Bad Kreuznach und Umgebung e. V.)',
      adresse: 'Rheingrafenstraße 120, 55543 Bad Kreuznach',
      telefon: '0671 8960296',
      website: 'tierheim-bad-kreuznach.de',
      oeffnungszeiten: 'Telefonzeiten Mo, Di, Do, Fr 9–12 und 13–15 Uhr. Besuch Di und Do 14–16 Uhr. Mittwoch (Tierarzttag), Sonn- und Feiertage geschlossen.',
      beschreibung: 'Tierheim in Bad Kreuznach. Ein Einzugsgebiet nennt die Website nicht.',
    },
    {
      name: 'Tierheim Worms (Tierschutzverein Worms Stadt und Land e. V.)',
      adresse: 'Ludwigslust 2, 67547 Worms',
      telefon: '06241 23066',
      website: 'tierheimworms.de',
      beschreibung: 'Fundtierverträge u. a. für Worms, Alzey-Stadt, Grünstadt-Stadt sowie die VG Alzey Land, Eich, Leiningerland, Lambsheim-Hessheim, Monsheim und Wonnegau. Gefundene Tiere zuerst beim zuständigen Ordnungsamt oder der Polizei melden. Ordnungsamt Worms: 06241 8533822.',
      oeffnungszeiten: 'Zeiten siehe Website („Öffnungs- und Geschäftszeiten“).',
    },
    {
      name: 'Tierheim Kirn (Tierschutzverein Kirn)',
      adresse: 'Binger Landstraße 103–105, 55606 Kirn',
      telefon: '06752 71818',
      website: 'tierschutzvereinkirn.de',
      beschreibung: 'Tierheim in Kirn an der Nahe, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierheim der Tierhelfer Ingelheim e. V.',
      adresse: 'Außenliegend 145, 55218 Ingelheim',
      telefon: '06132 76205',
      website: 'tierhelfer-ingelheim.de',
      beschreibung: 'Tierheim in Ingelheim, gelistet beim Tierschutzbund Rheinland-Pfalz.',
    },
    {
      name: 'Tierschutzverein für den Kreis Birkenfeld e. V.',
      adresse: 'Hohlstraße 86, 55743 Idar-Oberstein',
      telefon: '06781 27223',
      beschreibung: 'Tierschutzverein im Kreis Birkenfeld (Angabe der Stadt Idar-Oberstein). Zeiten bitte telefonisch erfragen.',
    },
  ],

  anlaufstellen: [
    {
      name: 'Berufstierrettung Rhein-Neckar',
      typ: 'notfall',
      beschreibung: 'Laut Tierheim Worms für verletzte Fundtiere im Raum Worms: Telefon 0151 61400840. Die Rettung braucht in der Regel zuvor eine Freigabe von Ordnungsbehörde oder Polizei, außer bei dringender Hilfe.',
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
      text: 'Für Nahe & Rheinhessen haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
