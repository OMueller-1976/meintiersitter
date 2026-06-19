ALTER TABLE tier_profiles
  ADD COLUMN IF NOT EXISTS foto_urls text[] DEFAULT '{}';
