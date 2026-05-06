-- ============================================================
-- MeinTiersitter – Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES (erweitert auth.users)
-- ────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role                   TEXT NOT NULL CHECK (role IN ('tierhalter', 'sitter', 'admin')),
  full_name              TEXT NOT NULL,
  email                  TEXT NOT NULL,
  phone                  TEXT,
  avatar_url             TEXT,
  bio                    TEXT,
  plz                    TEXT,
  ort                    TEXT,
  ortschaft              TEXT,  -- Feinfilter: z.B. "Gillenfeld", "Manderscheid"
  latitude               FLOAT,
  longitude              FLOAT,
  is_verified            BOOLEAN DEFAULT FALSE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  subscription_status    TEXT CHECK (
                           subscription_status IN ('active','inactive','trialing','past_due')
                         ) DEFAULT 'inactive',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. TIER_PROFILES (Tierhalter legen Tierprofile an)
-- ────────────────────────────────────────────────────────────
CREATE TABLE tier_profiles (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id               UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name                   TEXT NOT NULL,
  tierart                TEXT NOT NULL CHECK (
                           tierart IN ('hund','katze','vogel','kleintier','sonstiges')
                         ),
  rasse                  TEXT,
  alter_jahre            INT,
  gewicht_kg             FLOAT,
  geschlecht             TEXT CHECK (geschlecht IN ('maennlich','weiblich')),
  kastriert              BOOLEAN DEFAULT FALSE,
  foto_url               TEXT,
  beschreibung           TEXT,
  -- Verträglichkeit
  vertraeglich_hunde     BOOLEAN DEFAULT TRUE,
  vertraeglich_katzen    BOOLEAN DEFAULT TRUE,
  vertraeglich_kinder    BOOLEAN DEFAULT TRUE,
  -- Betreuungshinweise
  fuetterung_zeiten      TEXT,   -- z.B. "7:00 und 18:00 Uhr"
  gassi_haeufigkeit      INT,    -- pro Tag
  medikamente            BOOLEAN DEFAULT FALSE,
  medikamente_info       TEXT,
  besonderheiten         TEXT,
  -- Notfall (nur für owner sichtbar via RLS)
  notfallkontakt_name    TEXT,
  notfallkontakt_phone   TEXT,
  tierarzt_name          TEXT,
  tierarzt_phone         TEXT,
  is_active              BOOLEAN DEFAULT TRUE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 3. SITTER_PROFILES (zusätzliche Sitter-Infos)
-- ────────────────────────────────────────────────────────────
CREATE TABLE sitter_profiles (
  id                          UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  erfahrung_jahre             INT DEFAULT 0,
  hat_eigene_tiere            BOOLEAN DEFAULT FALSE,
  eigene_tiere_beschreibung   TEXT,
  hat_garten                  BOOLEAN DEFAULT FALSE,
  kann_medikamente            BOOLEAN DEFAULT FALSE,
  -- Tierarten die Sitter betreuen möchte
  betreut_hunde               BOOLEAN DEFAULT TRUE,
  betreut_katzen              BOOLEAN DEFAULT FALSE,
  betreut_kleintiere          BOOLEAN DEFAULT FALSE,
  -- Leistungen
  bietet_gassi                BOOLEAN DEFAULT TRUE,
  bietet_fuettern             BOOLEAN DEFAULT TRUE,
  bietet_uebernachtung        BOOLEAN DEFAULT FALSE,
  bietet_tagesbetreuung       BOOLEAN DEFAULT FALSE,
  -- Radius
  radius_km                   INT DEFAULT 10,
  avg_rating                  FLOAT DEFAULT 0,
  total_reviews               INT DEFAULT 0,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 4. VERFUEGBARKEIT (Zeitleiste für beide Rollen)
-- ────────────────────────────────────────────────────────────
CREATE TABLE verfuegbarkeit (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rolle       TEXT NOT NULL CHECK (rolle IN ('tierhalter','sitter')),
  -- Tierhalter: "brauche Hilfe", Sitter: "bin verfügbar"
  typ         TEXT NOT NULL CHECK (typ IN ('einmalig','wiederkehrend','spontan')),
  datum_von   DATE NOT NULL,
  datum_bis   DATE NOT NULL,
  uhrzeit_von TIME,
  uhrzeit_bis TIME,
  -- Wochentage für wiederkehrend (JSON Array: [1,2,3] = Mo,Di,Mi)
  wochentage  JSONB,
  notiz       TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 5. MATCHES (das Herzstück)
-- ────────────────────────────────────────────────────────────
CREATE TABLE matches (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tierhalter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sitter_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id       UUID REFERENCES tier_profiles(id) ON DELETE SET NULL,
  status        TEXT NOT NULL CHECK (
                  status IN (
                    'angefragt',    -- Tierhalter hat Sitter angefragt
                    'bestaetigt',   -- Sitter hat angenommen
                    'abgelehnt',    -- Sitter hat abgelehnt
                    'abgebrochen',  -- Eine Seite hat abgebrochen
                    'abgeschlossen' -- Betreuung beendet, Bewertung möglich
                  )
                ) DEFAULT 'angefragt',
  datum_von     DATE NOT NULL,
  datum_bis     DATE NOT NULL,
  uhrzeit_von   TIME,
  uhrzeit_bis   TIME,
  leistung      TEXT CHECK (
                  leistung IN ('gassi','fuettern','tagesbetreuung','uebernachtung')
                ),
  nachricht     TEXT,        -- initiale Nachricht
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate active matches
  UNIQUE(tierhalter_id, sitter_id, datum_von, leistung)
);

-- ────────────────────────────────────────────────────────────
-- 6. NACHRICHTEN (Chat pro Match)
-- ────────────────────────────────────────────────────────────
CREATE TABLE nachrichten (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  inhalt     TEXT NOT NULL,
  gelesen    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 7. BEWERTUNGEN (erst nach status = 'abgeschlossen')
-- ────────────────────────────────────────────────────────────
CREATE TABLE bewertungen (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id     UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  bewerter_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bewertet_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sterne       INT NOT NULL CHECK (sterne BETWEEN 1 AND 5),
  kommentar    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  -- Jede Person kann pro Match nur einmal bewerten
  UNIQUE(match_id, bewerter_id)
);

-- ────────────────────────────────────────────────────────────
-- 8. BETREUUNGSJOURNAL (Foto-Updates vom Sitter)
-- ────────────────────────────────────────────────────────────
CREATE TABLE journal_eintraege (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sitter_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  foto_url   TEXT,
  nachricht  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 9. MARKTPLATZ_EINTRAEGE (Firmenverzeichnis)
-- ────────────────────────────────────────────────────────────
CREATE TABLE marktplatz_eintraege (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kategorie       TEXT NOT NULL CHECK (
                    kategorie IN (
                      'tiershop','tierarzt','tierpension',
                      'hundefriseur','hundeschule','sonstiges'
                    )
                  ),
  name            TEXT NOT NULL,
  beschreibung    TEXT,
  adresse         TEXT,
  plz             TEXT,
  ort             TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  oeffnungszeiten TEXT,
  foto_url        TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  is_verified     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_plz         ON profiles(plz);
CREATE INDEX idx_profiles_ortschaft   ON profiles(ortschaft);
CREATE INDEX idx_profiles_role        ON profiles(role);
CREATE INDEX idx_tier_profiles_owner  ON tier_profiles(owner_id);
CREATE INDEX idx_verfuegbarkeit_profile ON verfuegbarkeit(profile_id);
CREATE INDEX idx_verfuegbarkeit_datum ON verfuegbarkeit(datum_von, datum_bis);
CREATE INDEX idx_matches_tierhalter   ON matches(tierhalter_id);
CREATE INDEX idx_matches_sitter       ON matches(sitter_id);
CREATE INDEX idx_matches_status       ON matches(status);
CREATE INDEX idx_nachrichten_match    ON nachrichten(match_id);
CREATE INDEX idx_bewertungen_bewertet ON bewertungen(bewertet_id);
CREATE INDEX idx_marktplatz_kategorie ON marktplatz_eintraege(kategorie);
CREATE INDEX idx_marktplatz_plz       ON marktplatz_eintraege(plz);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tier_profiles_updated_at
  BEFORE UPDATE ON tier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sitter_profiles_updated_at
  BEFORE UPDATE ON sitter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: avg_rating aktuell halten
-- ============================================================

CREATE OR REPLACE FUNCTION update_sitter_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sitter_profiles SET
    avg_rating = (
      SELECT ROUND(AVG(sterne)::numeric, 1)
      FROM bewertungen
      WHERE bewertet_id = NEW.bewertet_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM bewertungen
      WHERE bewertet_id = NEW.bewertet_id
    )
  WHERE id = NEW.bewertet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bewertung_inserted
  AFTER INSERT ON bewertungen
  FOR EACH ROW EXECUTE FUNCTION update_sitter_rating();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitter_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE verfuegbarkeit      ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches             ENABLE ROW LEVEL SECURITY;
ALTER TABLE nachrichten         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bewertungen         ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_eintraege   ENABLE ROW LEVEL SECURITY;
ALTER TABLE marktplatz_eintraege ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ─────────────────────────────────────────────────
CREATE POLICY "Eigenes Profil lesen/schreiben" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Alle Profile lesbar (public)" ON profiles
  FOR SELECT USING (TRUE);

-- ── TIER_PROFILES ────────────────────────────────────────────
CREATE POLICY "Owner verwaltet Tierprofile" ON tier_profiles
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Tierprofile lesbar fuer angemeldete User" ON tier_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── SITTER_PROFILES ──────────────────────────────────────────
CREATE POLICY "Sitter verwaltet eigenes Profil" ON sitter_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Sitter-Profile oeffentlich lesbar" ON sitter_profiles
  FOR SELECT USING (TRUE);

-- ── VERFUEGBARKEIT ───────────────────────────────────────────
CREATE POLICY "User verwaltet eigene Verfuegbarkeit" ON verfuegbarkeit
  FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Verfuegbarkeit lesbar fuer angemeldete User" ON verfuegbarkeit
  FOR SELECT USING (auth.role() = 'authenticated');

-- ── MATCHES ──────────────────────────────────────────────────
CREATE POLICY "Beteiligte sehen ihre Matches" ON matches
  FOR SELECT USING (
    auth.uid() = tierhalter_id OR auth.uid() = sitter_id
  );

CREATE POLICY "Tierhalter erstellt Match" ON matches
  FOR INSERT WITH CHECK (auth.uid() = tierhalter_id);

CREATE POLICY "Beteiligte aktualisieren Match" ON matches
  FOR UPDATE USING (
    auth.uid() = tierhalter_id OR auth.uid() = sitter_id
  );

-- ── NACHRICHTEN ──────────────────────────────────────────────
CREATE POLICY "Beteiligte lesen Chat" ON nachrichten
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.tierhalter_id = auth.uid() OR m.sitter_id = auth.uid())
    )
  );

CREATE POLICY "Beteiligte schreiben Chat" ON nachrichten
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.tierhalter_id = auth.uid() OR m.sitter_id = auth.uid())
    )
  );

-- ── BEWERTUNGEN ──────────────────────────────────────────────
CREATE POLICY "Jeder sieht Bewertungen" ON bewertungen
  FOR SELECT USING (TRUE);

CREATE POLICY "Bewerter schreibt nach abgeschlossenem Match" ON bewertungen
  FOR INSERT WITH CHECK (
    auth.uid() = bewerter_id
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND m.status = 'abgeschlossen'
        AND (m.tierhalter_id = auth.uid() OR m.sitter_id = auth.uid())
    )
  );

-- ── JOURNAL ──────────────────────────────────────────────────
CREATE POLICY "Sitter schreibt Journal" ON journal_eintraege
  FOR INSERT WITH CHECK (auth.uid() = sitter_id);

CREATE POLICY "Beteiligte lesen Journal" ON journal_eintraege
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.tierhalter_id = auth.uid() OR m.sitter_id = auth.uid())
    )
  );

-- ── MARKTPLATZ (öffentlich lesbar) ───────────────────────────
CREATE POLICY "Marktplatz oeffentlich lesbar" ON marktplatz_eintraege
  FOR SELECT USING (is_active = TRUE);
