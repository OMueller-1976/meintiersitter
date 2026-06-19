-- ============================================================
-- 004_onboarding.sql
-- Rolle 'beide' + Notfall-Felder + Onboarding-Status
-- ============================================================

-- role um 'beide' erweitern
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (
  role IN ('tierhalter', 'sitter', 'beide', 'admin')
);

-- Notfall-Felder für Sitter
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS notfall_verfuegbar boolean DEFAULT false;
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS notfall_telefon text;
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS notfall_per_email boolean DEFAULT true;
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS notfall_per_sms boolean DEFAULT false;
ALTER TABLE sitter_profiles
  ADD COLUMN IF NOT EXISTS notfall_per_whatsapp boolean DEFAULT false;

-- Onboarding-Status tracken
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;
