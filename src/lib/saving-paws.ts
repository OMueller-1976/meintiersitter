// Hundesuchhilfe Saving Paws (gemeinnuetziger Verein, Birresborn / Vulkaneifel).
// Quellen: hundesuchhilfe.de, Lokalo (22.08.2023), Eifel Journal (11.01.2024).

export const SAVING_PAWS = {
  name: 'Hundesuchhilfe Saving Paws',
  telefon: '0170 7350767',
  telefonHref: 'tel:+491707350767',
  website: 'https://www.hundesuchhilfe.de',
  sitz: 'Birresborn (Vulkaneifel)',
  leistungen: [
    'Beratung und Unterstützung, wenn ein Hund entlaufen ist',
    'Suchflyer sowie Sichtungs- und Laufprofil',
    'Überwachung von Futterstellen',
    'Einsatz von Suchhunden (Pettrailer)',
    'Drohnen mit Wärmebildkamera',
    'Lebendfallen in verschiedenen Größen',
    'Sicherung ängstlicher Hunde',
  ],
} as const

/** Ehrlicher Hinweis zum Einsatzgebiet je Region (Kerngebiet: Vulkaneifel/Südeifel). */
export function savingPawsRegionHinweis(region: string): string {
  switch (region) {
    case 'daun':
      return 'Der Verein sitzt in Birresborn und ist in der Vulkaneifel/Südeifel zu Hause.'
    case 'wittlich':
      return 'Einsatzgebiet ist die Vulkaneifel/Südeifel und Umgebung, Helfer sind in der Eifel bis Trier verteilt. Ob ein Einsatz im Kreis Bernkastel-Wittlich möglich ist, klärst Du am besten direkt per Telefon.'
    default:
      return 'Kerngebiet ist die Vulkaneifel/Südeifel. Ob ein Einsatz in dieser Region möglich ist, klärst Du am besten direkt per Telefon.'
  }
}
