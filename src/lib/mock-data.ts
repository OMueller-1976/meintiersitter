export interface PostingMock {
  id: string;
  tier_name: string;
  tier_rasse: string;
  tier_foto: string;
  leistung: string;
  leistung_label: string;
  ortschaft: string;
  plz: string;
  datum_von: string;
  datum_bis: string;
  uhrzeit: string;
  besitzer_name: string;
  avatar_initial: string;
  beschreibung: string;
}

export interface SitterMock {
  id: string;
  name: string;
  ortschaft: string;
  plz: string;
  foto: string;
  avatar_initial: string;
  beschreibung: string;
  leistungen: string[];
  hat_garten: boolean;
  erfahrung_jahre: number;
  kann_medikamente: boolean;
  avg_rating: number;
  total_reviews: number;
}

export const MOCK_POSTINGS: PostingMock[] = [
  {
    id: '1',
    tier_name: 'Bella',
    tier_rasse: 'Labrador Retriever',
    tier_foto: '/assets/Hund.png',
    leistung: 'gassi',
    leistung_label: 'Gassi gehen',
    ortschaft: 'Daun',
    plz: '54550',
    datum_von: '2025-06-10',
    datum_bis: '2025-06-12',
    uhrzeit: 'Morgens 7–9 Uhr',
    besitzer_name: 'Familie Müller',
    avatar_initial: 'FM',
    beschreibung:
      'Bella ist unsere 4-jährige Labradorhündin — freundlich, verspielt und liebt lange Spaziergänge. Wir suchen jemanden für die Morgengassi-Runde. Bella zieht nicht an der Leine und kommt gut mit anderen Hunden aus.',
  },
  {
    id: '2',
    tier_name: 'Felix',
    tier_rasse: 'Europäische Kurzhaar',
    tier_foto: '/assets/Katze.png',
    leistung: 'fuettern',
    leistung_label: 'Füttern & Besuch',
    ortschaft: 'Gillenfeld',
    plz: '54558',
    datum_von: '2025-06-20',
    datum_bis: '2025-06-27',
    uhrzeit: 'Einmal täglich',
    besitzer_name: 'Petra Schmitt',
    avatar_initial: 'PS',
    beschreibung:
      'Felix ist ein ruhiger, verschmuster Kater, 6 Jahre alt. Wir fahren eine Woche in den Urlaub und suchen jemanden der täglich vorbeischaut, füttert und kurz mit ihm spielt.',
  },
  {
    id: '3',
    tier_name: 'Sunny',
    tier_rasse: 'Shetland Pony',
    tier_foto: '/assets/ponny.png',
    leistung: 'tagesbetreuung',
    leistung_label: 'Tagesbetreuung',
    ortschaft: 'Manderscheid',
    plz: '54531',
    datum_von: '2025-07-01',
    datum_bis: '2025-07-03',
    uhrzeit: 'Ganztags',
    besitzer_name: 'Thomas Weber',
    avatar_initial: 'TW',
    beschreibung:
      'Unser Shetlandpony Sunny braucht an drei Tagen Betreuung — Fütterung morgens und abends, Weide kontrollieren. Sunny ist sehr zahm und kinderlieb.',
  },
  {
    id: '4',
    tier_name: 'Kiko',
    tier_rasse: 'Wellensittich',
    tier_foto: '/assets/Vogel.png',
    leistung: 'fuettern',
    leistung_label: 'Füttern & Pflege',
    ortschaft: 'Gerolstein',
    plz: '54568',
    datum_von: '2025-06-15',
    datum_bis: '2025-06-22',
    uhrzeit: 'Morgens + Abends',
    besitzer_name: 'Sabine Berg',
    avatar_initial: 'SB',
    beschreibung:
      'Kiko ist ein quicklebendiger Wellensittich der Gesellschaft liebt. Zweimal täglich füttern, frisches Wasser, kurz mit ihm sprechen. Er ist sehr zutraulich!',
  },
];

export const MOCK_SITTER: SitterMock[] = [
  {
    id: '1',
    name: 'Familie Berger',
    ortschaft: 'Daun',
    plz: '54550',
    foto: '/assets/Familie.png',
    avatar_initial: 'FB',
    beschreibung:
      'Wir sind eine Familie mit zwei Kindern (8 und 11 Jahre) und großem Garten. Wir hatten selbst viele Jahre Hunde und möchten gerne wieder Verantwortung übernehmen.',
    leistungen: ['gassi', 'fuettern', 'tagesbetreuung'],
    hat_garten: true,
    erfahrung_jahre: 10,
    kann_medikamente: false,
    avg_rating: 4.8,
    total_reviews: 12,
  },
  {
    id: '2',
    name: 'Markus Hoffmann',
    ortschaft: 'Gillenfeld',
    plz: '54558',
    foto: '/assets/MannSitter.png',
    avatar_initial: 'MH',
    beschreibung:
      'Rentner und passionierter Wanderer in der Vulkaneifel. Ich bin täglich in der Natur unterwegs — ein Hund wäre der perfekte Begleiter. 20 Jahre eigene Hundeerfahrung.',
    leistungen: ['gassi', 'fuettern'],
    hat_garten: false,
    erfahrung_jahre: 20,
    kann_medikamente: false,
    avg_rating: 4.9,
    total_reviews: 8,
  },
  {
    id: '3',
    name: 'Maria Schneider',
    ortschaft: 'Manderscheid',
    plz: '54531',
    foto: '/assets/FrauSitter.png',
    avatar_initial: 'MS',
    beschreibung:
      'Tierarzthelferin mit 8 Jahren Erfahrung. Kann auch Medikamente verabreichen. Großer eingezäunter Garten vorhanden. Ich betreue Hunde, Katzen und Kleintiere.',
    leistungen: ['gassi', 'fuettern', 'tagesbetreuung', 'uebernachtung'],
    hat_garten: true,
    erfahrung_jahre: 8,
    kann_medikamente: true,
    avg_rating: 5.0,
    total_reviews: 5,
  },
];

export const LEISTUNGS_LABELS: Record<string, string> = {
  gassi: 'Gassi gehen',
  fuettern: 'Füttern',
  tagesbetreuung: 'Tagesbetreuung',
  uebernachtung: 'Übernachtung',
};

export const LEISTUNGS_BADGE_CLASSES: Record<string, string> = {
  gassi: 'bg-[#DDEAF4] text-[#2E4A6B]',
  fuettern: 'bg-[#FEF3E2] text-[#E07B30]',
  tagesbetreuung: 'bg-[#E8F0F8] text-[#2E4A6B]',
  uebernachtung: 'bg-[#EDE8F5] text-[#5B4A8A]',
};

export const LEISTUNGS_CHIPS: Record<string, string> = {
  gassi: '🦮 Gassi',
  fuettern: '🍖 Füttern',
  tagesbetreuung: '☀️ Tagesbetreuung',
  uebernachtung: '🌙 Übernachtung',
};

export const ORTSCHAFTEN = [
  'Alle Ortschaften',
  'Daun',
  'Gillenfeld',
  'Manderscheid',
  'Gerolstein',
  'Hillesheim',
  'Kelberg',
  'Ulmen',
  'Adenau',
  'Kirchweiler',
];
