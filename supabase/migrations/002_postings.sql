-- ============================================================
-- MeinTiersitter – Migration 002: Hybrid Posting System
-- Postings (Gesuche) + Bewerbungen (Bewerber)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Enum Types
-- ────────────────────────────────────────────────────────────

CREATE TYPE posting_status AS ENUM ('offen', 'besetzt', 'abgeschlossen', 'abgebrochen');
CREATE TYPE bewerbung_quelle AS ENUM ('empfehlung', 'organisch');
CREATE TYPE bewerbung_status AS ENUM ('ausstehend', 'ausgewaehlt', 'abgelehnt');

-- ────────────────────────────────────────────────────────────
-- 1. Postings (Gesuche von Tierhaltern)
-- ────────────────────────────────────────────────────────────

CREATE TABLE postings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tierhalter_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id         UUID REFERENCES tier_profiles(id) ON DELETE SET NULL,
  leistung        TEXT NOT NULL CHECK (leistung IN ('gassi','fuettern','tagesbetreuung','uebernachtung')),
  datum_von       DATE NOT NULL,
  datum_bis       DATE NOT NULL,
  uhrzeit_von     TIME,
  uhrzeit_bis     TIME,
  nachricht       TEXT,
  plz             TEXT NOT NULL,
  ort             TEXT NOT NULL,
  status          posting_status NOT NULL DEFAULT 'offen',
  -- Sichtbarkeit: immer auf Pinnwand sichtbar bis besetzt
  auf_pinnwand    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. Bewerbungen (Sitter → Posting)
-- ────────────────────────────────────────────────────────────

CREATE TABLE bewerbungen (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posting_id      UUID NOT NULL REFERENCES postings(id) ON DELETE CASCADE,
  sitter_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quelle          bewerbung_quelle NOT NULL DEFAULT 'organisch',
  status          bewerbung_status NOT NULL DEFAULT 'ausstehend',
  nachricht       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (posting_id, sitter_id)
);

-- ────────────────────────────────────────────────────────────
-- Indexes
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_postings_tierhalter ON postings(tierhalter_id);
CREATE INDEX idx_postings_status     ON postings(status);
CREATE INDEX idx_postings_plz        ON postings(plz);
CREATE INDEX idx_postings_leistung   ON postings(leistung);
CREATE INDEX idx_bewerbungen_posting ON bewerbungen(posting_id);
CREATE INDEX idx_bewerbungen_sitter  ON bewerbungen(sitter_id);
CREATE INDEX idx_bewerbungen_status  ON bewerbungen(status);

-- ────────────────────────────────────────────────────────────
-- Trigger: updated_at für postings
-- ────────────────────────────────────────────────────────────

CREATE TRIGGER update_postings_updated_at
  BEFORE UPDATE ON postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────
-- RLS
-- ────────────────────────────────────────────────────────────

ALTER TABLE postings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bewerbungen  ENABLE ROW LEVEL SECURITY;

-- Postings: öffentlich lesbar wenn offen
CREATE POLICY "Offene Postings sind öffentlich lesbar"
  ON postings FOR SELECT
  USING (status = 'offen');

-- Postings: Tierhalter sieht alle eigenen
CREATE POLICY "Tierhalter sieht eigene Postings"
  ON postings FOR SELECT
  TO authenticated
  USING (tierhalter_id = auth.uid());

-- Postings: Tierhalter darf erstellen
CREATE POLICY "Tierhalter darf Posting erstellen"
  ON postings FOR INSERT
  TO authenticated
  WITH CHECK (tierhalter_id = auth.uid());

-- Postings: Tierhalter darf eigene aktualisieren
CREATE POLICY "Tierhalter darf eigene Postings aktualisieren"
  ON postings FOR UPDATE
  TO authenticated
  USING (tierhalter_id = auth.uid());

-- Postings: Tierhalter darf eigene löschen
CREATE POLICY "Tierhalter darf eigene Postings löschen"
  ON postings FOR DELETE
  TO authenticated
  USING (tierhalter_id = auth.uid());

-- Bewerbungen: Sitter sieht eigene
CREATE POLICY "Sitter sieht eigene Bewerbungen"
  ON bewerbungen FOR SELECT
  TO authenticated
  USING (sitter_id = auth.uid());

-- Bewerbungen: Tierhalter sieht Bewerbungen auf eigene Postings
CREATE POLICY "Tierhalter sieht Bewerbungen auf eigene Postings"
  ON bewerbungen FOR SELECT
  TO authenticated
  USING (
    posting_id IN (
      SELECT id FROM postings WHERE tierhalter_id = auth.uid()
    )
  );

-- Bewerbungen: Sitter darf bewerben
CREATE POLICY "Sitter darf sich bewerben"
  ON bewerbungen FOR INSERT
  TO authenticated
  WITH CHECK (sitter_id = auth.uid());

-- Bewerbungen: Tierhalter darf Status setzen (auswählen/ablehnen)
CREATE POLICY "Tierhalter darf Bewerbungsstatus setzen"
  ON bewerbungen FOR UPDATE
  TO authenticated
  USING (
    posting_id IN (
      SELECT id FROM postings WHERE tierhalter_id = auth.uid()
    )
  );

-- Bewerbungen: Sitter darf eigene zurückziehen
CREATE POLICY "Sitter darf eigene Bewerbung löschen"
  ON bewerbungen FOR DELETE
  TO authenticated
  USING (sitter_id = auth.uid());
