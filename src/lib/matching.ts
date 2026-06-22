import { distanzKm } from './distance'

export interface MatchInput {
  tierart: 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges'
  leistung: string // 'gassi' | 'fuettern' | 'tagesbetreuung' | 'uebernachtung'
  posting_ort: string
  posting_plz: string
  lat?: number | null
  lng?: number | null
  betreuungsort?: 'eigenheim' | 'beim_sitter' | 'beides' | null
}

export interface SitterMatchProfil {
  ort: string | null
  plz: string | null
  lat?: number | null
  lng?: number | null
  betreut_hunde: boolean
  betreut_katzen: boolean
  betreut_kleintiere: boolean
  bietet_gassi: boolean
  bietet_fuettern: boolean
  bietet_tagesbetreuung: boolean
  bietet_uebernachtung: boolean
  radius_km: number | null
  erfahrung_jahre: number | null
  avg_rating: number | null
  betreuung_beim_sitter?: boolean | null
}

export function berechneMatchProzent(
  posting: MatchInput,
  sitter: SitterMatchProfil
): number {
  // Harter Ausschluss: Gesuch verlangt Betreuung beim Sitter, aber Sitter bietet das nicht an
  if (posting.betreuungsort === 'beim_sitter' && !sitter.betreuung_beim_sitter) {
    return 0
  }

  let score = 0

  // 1) Tierart-Kompatibilität (35 Punkte)
  const tierartMap: Record<string, boolean> = {
    hund: sitter.betreut_hunde,
    katze: sitter.betreut_katzen,
    vogel: sitter.betreut_kleintiere,
    kleintier: sitter.betreut_kleintiere,
    sonstiges: sitter.betreut_kleintiere,
  }
  if (tierartMap[posting.tierart]) score += 35

  // 2) Leistungs-Match (35 Punkte)
  const leistungMap: Record<string, boolean> = {
    gassi: sitter.bietet_gassi,
    fuettern: sitter.bietet_fuettern,
    tagesbetreuung: sitter.bietet_tagesbetreuung,
    uebernachtung: sitter.bietet_uebernachtung,
  }
  if (leistungMap[posting.leistung]) score += 35

  // 3) Standort-Nähe (20 Punkte)
  const hasKoords =
    posting.lat != null && posting.lng != null &&
    sitter.lat != null && sitter.lng != null

  if (hasKoords) {
    const km = distanzKm(sitter.lat!, sitter.lng!, posting.lat!, posting.lng!)
    const radius = sitter.radius_km ?? 15

    if (km <= radius) {
      // Innerhalb des Radius: linear von 20 (km=0) bis 10 (km=radius)
      const anteil = km / radius // 0..1
      score += Math.round(20 - anteil * 10) // 20..10
    } else {
      // Außerhalb: weiche Reduktion — maximal 3 Punkte
      score += 3
    }
  } else if (sitter.ort && posting.posting_ort) {
    // PLZ-Fallback wenn keine Koordinaten vorhanden
    if (sitter.ort.toLowerCase() === posting.posting_ort.toLowerCase()) {
      score += 20 // gleiche Ortschaft
    } else {
      const plzSitter = parseInt(sitter.plz ?? '0')
      const plzPosting = parseInt(posting.posting_plz ?? '0')
      const diff = Math.abs(plzSitter - plzPosting)
      const radius = sitter.radius_km ?? 15
      if (diff <= 10) score += 16
      else if (diff <= 25 && radius >= 15) score += 10
      else if (radius >= 25) score += 6
    }
  } else {
    score += 8 // unbekannt → neutraler Mittelwert
  }

  // 4) Erfahrungs-Bonus (10 Punkte)
  const erfahrung = sitter.erfahrung_jahre ?? 0
  score += Math.min(erfahrung, 10)

  return Math.min(Math.round(score), 100)
}

export function matchLabel(prozent: number): string {
  if (prozent >= 85) return 'Top-Match'
  if (prozent >= 65) return 'Guter Match'
  if (prozent >= 40) return 'Möglicher Match'
  return 'Geringe Übereinstimmung'
}

export function matchColor(prozent: number): string {
  if (prozent >= 85) return '#16A34A' // grün
  if (prozent >= 65) return '#2E4A6B' // blau
  if (prozent >= 40) return '#E07B30' // orange
  return '#94A3B8' // grau
}
