// ============================================================
// MeinTiersitter – TypeScript Types
// Spiegeln exakt das Supabase-Schema (001_initial_schema.sql)
// ============================================================

// ────────────────────────────────────────────────────────────
// Enum Union Types (aus CHECK-Constraints)
// ────────────────────────────────────────────────────────────

export type UserRole = 'tierhalter' | 'sitter' | 'beide' | 'admin';

export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due';

export type Tierart = 'hund' | 'katze' | 'vogel' | 'kleintier' | 'sonstiges';

export type Geschlecht = 'maennlich' | 'weiblich';

export type VerfuegbarkeitRolle = 'tierhalter' | 'sitter';

export type VerfuegbarkeitTyp = 'einmalig' | 'wiederkehrend' | 'spontan';

export type MatchStatus =
  | 'angefragt'
  | 'bestaetigt'
  | 'abgelehnt'
  | 'abgebrochen'
  | 'abgeschlossen';

export type Leistung = 'gassi' | 'fuettern' | 'tagesbetreuung' | 'uebernachtung';

export type MarktplatzKategorie =
  | 'tiershop'
  | 'tierarzt'
  | 'tierpension'
  | 'hundefriseur'
  | 'hundeschule'
  | 'sonstiges';

// ────────────────────────────────────────────────────────────
// 1. Profile
// ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  plz: string | null;
  ort: string | null;
  ortschaft: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  onboarding_complete: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  is_verified?: boolean;
  subscription_status?: SubscriptionStatus;
};

export type ProfileUpdate = Partial<
  Omit<Profile, 'id' | 'created_at' | 'updated_at'>
>;

// ────────────────────────────────────────────────────────────
// 2. TierProfile
// ────────────────────────────────────────────────────────────

export interface TierProfile {
  id: string;
  owner_id: string;
  name: string;
  tierart: Tierart;
  rasse: string | null;
  alter_jahre: number | null;
  gewicht_kg: number | null;
  geschlecht: Geschlecht | null;
  kastriert: boolean;
  foto_url: string | null;
  foto_urls: string[];
  beschreibung: string | null;
  vertraeglich_hunde: boolean;
  vertraeglich_katzen: boolean;
  vertraeglich_kinder: boolean;
  fuetterung_zeiten: string | null;
  gassi_haeufigkeit: number | null;
  medikamente: boolean;
  medikamente_info: string | null;
  besonderheiten: string | null;
  notfallkontakt_name: string | null;
  notfallkontakt_phone: string | null;
  tierarzt_name: string | null;
  tierarzt_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Nur name, tierart und owner_id sind beim Insert zwingend erforderlich
export type TierProfileInsert = {
  owner_id: string;
  name: string;
  tierart: Tierart;
  rasse?: string | null;
  alter_jahre?: number | null;
  gewicht_kg?: number | null;
  geschlecht?: Geschlecht | null;
  kastriert?: boolean;
  foto_url?: string | null;
  foto_urls?: string[];
  beschreibung?: string | null;
  vertraeglich_hunde?: boolean;
  vertraeglich_katzen?: boolean;
  vertraeglich_kinder?: boolean;
  fuetterung_zeiten?: string | null;
  gassi_haeufigkeit?: number | null;
  medikamente?: boolean;
  medikamente_info?: string | null;
  besonderheiten?: string | null;
  notfallkontakt_name?: string | null;
  notfallkontakt_phone?: string | null;
  tierarzt_name?: string | null;
  tierarzt_phone?: string | null;
  is_active?: boolean;
};

export type TierProfileUpdate = Partial<
  Omit<TierProfile, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
>;

// ────────────────────────────────────────────────────────────
// 3. SitterProfile
// ────────────────────────────────────────────────────────────

export interface SitterProfile {
  id: string;
  erfahrung_jahre: number;
  hat_eigene_tiere: boolean;
  eigene_tiere_beschreibung: string | null;
  hat_garten: boolean;
  kann_medikamente: boolean;
  betreut_hunde: boolean;
  betreut_katzen: boolean;
  betreut_kleintiere: boolean;
  bietet_gassi: boolean;
  bietet_fuettern: boolean;
  bietet_uebernachtung: boolean;
  bietet_tagesbetreuung: boolean;
  radius_km: number;
  avg_rating: number;
  total_reviews: number;
  notfall_verfuegbar: boolean;
  notfall_telefon: string | null;
  notfall_per_email: boolean;
  notfall_per_sms: boolean;
  notfall_per_whatsapp: boolean;
  created_at: string;
  updated_at: string;
}

export type SitterProfileInsert = Omit<SitterProfile, 'avg_rating' | 'total_reviews' | 'created_at' | 'updated_at'> & {
  erfahrung_jahre?: number;
  hat_eigene_tiere?: boolean;
  hat_garten?: boolean;
  kann_medikamente?: boolean;
  betreut_hunde?: boolean;
  betreut_katzen?: boolean;
  betreut_kleintiere?: boolean;
  bietet_gassi?: boolean;
  bietet_fuettern?: boolean;
  bietet_uebernachtung?: boolean;
  bietet_tagesbetreuung?: boolean;
  radius_km?: number;
};

export type SitterProfileUpdate = Partial<
  Omit<SitterProfile, 'id' | 'avg_rating' | 'total_reviews' | 'created_at' | 'updated_at'>
>;

// ────────────────────────────────────────────────────────────
// 4. Verfuegbarkeit
// ────────────────────────────────────────────────────────────

export interface Verfuegbarkeit {
  id: string;
  profile_id: string;
  rolle: VerfuegbarkeitRolle;
  typ: VerfuegbarkeitTyp;
  datum_von: string;   // ISO date: YYYY-MM-DD
  datum_bis: string;   // ISO date: YYYY-MM-DD
  uhrzeit_von: string | null;  // HH:MM
  uhrzeit_bis: string | null;  // HH:MM
  wochentage: number[] | null; // [1,2,3] = Mo,Di,Mi
  notiz: string | null;
  is_active: boolean;
  created_at: string;
}

export type VerfuegbarkeitInsert = Omit<Verfuegbarkeit, 'id' | 'created_at'> & {
  is_active?: boolean;
};

export type VerfuegbarkeitUpdate = Partial<
  Omit<Verfuegbarkeit, 'id' | 'profile_id' | 'created_at'>
>;

// ────────────────────────────────────────────────────────────
// 5. Match
// ────────────────────────────────────────────────────────────

export interface Match {
  id: string;
  tierhalter_id: string;
  sitter_id: string;
  tier_id: string | null;
  status: MatchStatus;
  datum_von: string;   // ISO date: YYYY-MM-DD
  datum_bis: string;   // ISO date: YYYY-MM-DD
  uhrzeit_von: string | null;  // HH:MM
  uhrzeit_bis: string | null;  // HH:MM
  leistung: Leistung | null;
  nachricht: string | null;
  created_at: string;
  updated_at: string;
}

export type MatchInsert = Omit<Match, 'id' | 'created_at' | 'updated_at'> & {
  status?: MatchStatus;
};

export type MatchUpdate = Partial<Pick<Match, 'status' | 'nachricht'>>;

// Match mit eingebetteten Relations (für UI-Verwendung)
export interface MatchWithRelations extends Match {
  tierhalter?: Profile;
  sitter?: Profile;
  tier?: TierProfile;
}

// ────────────────────────────────────────────────────────────
// 6. Nachricht
// ────────────────────────────────────────────────────────────

export interface Nachricht {
  id: string;
  match_id: string;
  sender_id: string;
  inhalt: string;
  gelesen: boolean;
  created_at: string;
}

export type NachrichtInsert = Omit<Nachricht, 'id' | 'created_at'> & {
  gelesen?: boolean;
};

// ────────────────────────────────────────────────────────────
// 7. Bewertung
// ────────────────────────────────────────────────────────────

export interface Bewertung {
  id: string;
  match_id: string;
  bewerter_id: string;
  bewertet_id: string;
  sterne: 1 | 2 | 3 | 4 | 5;
  kommentar: string | null;
  created_at: string;
}

export type BewertungInsert = Omit<Bewertung, 'id' | 'created_at'>;

// ────────────────────────────────────────────────────────────
// 8. JournalEintrag
// ────────────────────────────────────────────────────────────

export interface JournalEintrag {
  id: string;
  match_id: string;
  sitter_id: string;
  foto_url: string | null;
  nachricht: string;
  created_at: string;
}

export type JournalEintragInsert = Omit<JournalEintrag, 'id' | 'created_at'>;

// ────────────────────────────────────────────────────────────
// 9. MarktplatzEintrag
// ────────────────────────────────────────────────────────────

export interface MarktplatzEintrag {
  id: string;
  kategorie: MarktplatzKategorie;
  name: string;
  beschreibung: string | null;
  adresse: string | null;
  plz: string | null;
  ort: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  oeffnungszeiten: string | null;
  foto_url: string | null;
  is_premium: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export type MarktplatzEintragInsert = Omit<MarktplatzEintrag, 'id' | 'created_at'> & {
  is_premium?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
};

// ────────────────────────────────────────────────────────────
// 10. Posting (Gesuch eines Tierhalters)
// ────────────────────────────────────────────────────────────

export type PostingStatus = 'offen' | 'besetzt' | 'abgeschlossen' | 'abgebrochen';
export type BewerbungQuelle = 'empfehlung' | 'organisch';
export type BewerbungStatus = 'ausstehend' | 'ausgewaehlt' | 'abgelehnt';

export interface Posting {
  id: string;
  tierhalter_id: string;
  tier_id: string | null;
  leistung: Leistung;
  datum_von: string;   // ISO date: YYYY-MM-DD
  datum_bis: string;   // ISO date: YYYY-MM-DD
  uhrzeit_von: string | null;  // HH:MM
  uhrzeit_bis: string | null;  // HH:MM
  nachricht: string | null;
  plz: string;
  ort: string;
  status: PostingStatus;
  auf_pinnwand: boolean;
  created_at: string;
  updated_at: string;
}

export type PostingInsert = {
  tierhalter_id: string;
  leistung: Leistung;
  datum_von: string;
  datum_bis: string;
  plz: string;
  ort: string;
  tier_id?: string | null;
  uhrzeit_von?: string | null;
  uhrzeit_bis?: string | null;
  nachricht?: string | null;
  status?: PostingStatus;
  auf_pinnwand?: boolean;
  ist_notfall?: boolean;
};

export type PostingUpdate = Partial<Pick<Posting, 'status' | 'auf_pinnwand' | 'nachricht'>>;

export interface PostingWithRelations extends Posting {
  tierhalter?: Profile;
  tier?: TierProfile;
}

// ────────────────────────────────────────────────────────────
// 11. Bewerbung (Sitter bewirbt sich auf ein Posting)
// ────────────────────────────────────────────────────────────

export interface Bewerbung {
  id: string;
  posting_id: string;
  sitter_id: string;
  quelle: BewerbungQuelle;
  status: BewerbungStatus;
  nachricht: string | null;
  created_at: string;
}

export type BewerbungInsert = {
  posting_id: string;
  sitter_id: string;
  quelle?: BewerbungQuelle;
  nachricht?: string | null;
};

export interface BewerbungWithSitter extends Bewerbung {
  sitter?: Profile;
  sitter_profil?: SitterProfile;
}

// ────────────────────────────────────────────────────────────
// Supabase Database type helper (für createClient<Database>())
// ────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      tier_profiles: {
        Row: TierProfile;
        Insert: TierProfileInsert;
        Update: TierProfileUpdate;
      };
      sitter_profiles: {
        Row: SitterProfile;
        Insert: SitterProfileInsert;
        Update: SitterProfileUpdate;
      };
      verfuegbarkeit: {
        Row: Verfuegbarkeit;
        Insert: VerfuegbarkeitInsert;
        Update: VerfuegbarkeitUpdate;
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: MatchUpdate;
      };
      nachrichten: {
        Row: Nachricht;
        Insert: NachrichtInsert;
        Update: Partial<Pick<Nachricht, 'gelesen'>>;
      };
      bewertungen: {
        Row: Bewertung;
        Insert: BewertungInsert;
        Update: never;
      };
      journal_eintraege: {
        Row: JournalEintrag;
        Insert: JournalEintragInsert;
        Update: never;
      };
      marktplatz_eintraege: {
        Row: MarktplatzEintrag;
        Insert: MarktplatzEintragInsert;
        Update: Partial<Omit<MarktplatzEintrag, 'id' | 'created_at'>>;
      };
      postings: {
        Row: Posting;
        Insert: PostingInsert;
        Update: PostingUpdate;
      };
      bewerbungen: {
        Row: Bewerbung;
        Insert: BewerbungInsert;
        Update: Partial<Pick<Bewerbung, 'status'>>;
      };
    };
  };
}
