import type { RegionContent } from './types'
import { BUNDESWEIT_ANLAUFSTELLEN, UNTERKUNFT_TIPP_ALLGEMEIN } from './shared'

// Quellen: siehe docs/regionen-quellen.md (Abschnitt aachen)
export const aachenContent: RegionContent = {
  wanderrouten: [
    {
      titel: 'Eifelsteig: Start in Kornelimünster',
      beschreibung: 'Der Eifelsteig beginnt im Aachener Ortsteil Kornelimünster und führt in 15 Etappen (14 bis 29 km) bis nach Trier. Einzelne Etappendaten findest Du auf eifelsteig.de.',
      laenge: '313 km (Gesamtstrecke)',
      startpunkt: 'Aachen-Kornelimünster',
    },
  ],

  sehenswuerdigkeiten: [
    {
      name: 'Aachener Dom',
      emoji: '⛪',
      beschreibung: 'Wahrzeichen der Stadt, hervorgegangen aus der Pfalzkapelle Karls des Großen. 1978 als erste Stätte in Deutschland zum UNESCO-Welterbe erklärt.',
    },
    {
      name: 'Aachener Rathaus',
      emoji: '🏛',
      beschreibung: 'Erbaut 1349 auf den Resten der Königshalle der Pfalz, auf Initiative der Bürger um Bürgermeister Gerhard Chorus.',
    },
    {
      name: 'Lousberg',
      emoji: '⛰',
      beschreibung: 'Hügel im Aachener Talkessel, an dem schon in der Steinzeit Feuerstein abgebaut wurde.',
    },
  ],

  tierheime: [
    {
      name: 'Tierheim & Tierschutzverein für die Städteregion Aachen e. V.',
      adresse: 'Feldchen 26, 52070 Aachen',
      telefon: '0241 9204250',
      website: 'tierschutzverein-aachen.de',
      beschreibung: 'Tierheim für die Städteregion Aachen. Besuchszeiten werden in Verzeichnissen unterschiedlich angegeben, bitte vor dem Besuch anrufen.',
    },
    {
      name: 'Tierheim Düren (Tierschutzverein für den Kreis Düren e. V.)',
      adresse: 'Am Tierheim 2, 52355 Düren-Niederau',
      telefon: '02421 998550',
      website: 'tierschutzverein-dueren.de',
      beschreibung: 'Tierheim im Kreis Düren. Öffnungszeiten bitte telefonisch erfragen.',
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
      text: 'Für Aachen & Düren haben wir bisher keine Unterkünfte mit belegter Hunde-Erlaubnis aufgenommen. Wir tragen nur Angaben mit Quelle ein.',
    },
  ],
  futterstationen: [],
}
