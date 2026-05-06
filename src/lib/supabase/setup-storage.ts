/**
 * Supabase Storage Bucket Setup
 *
 * Die folgenden Buckets müssen manuell im Supabase Dashboard angelegt werden:
 * Storage → New Bucket
 *
 * ┌─────────────────┬────────┬──────────┬────────────┐
 * │ Bucket Name     │ Public │ Max Size │ MIME Types │
 * ├─────────────────┼────────┼──────────┼────────────┤
 * │ avatars         │  yes   │   2 MB   │ image/*    │
 * │ tier-fotos      │  yes   │   5 MB   │ image/*    │
 * │ journal-fotos   │  yes   │  10 MB   │ image/*    │
 * │ marktplatz      │  yes   │   5 MB   │ image/*    │
 * └─────────────────┴────────┴──────────┴────────────┘
 *
 * Bucket-Konfiguration im Dashboard:
 *   1. "avatars"       → Profilbilder der User
 *   2. "tier-fotos"    → Fotos der Tierprofile
 *   3. "journal-fotos" → Betreuungsjournal-Fotos (Sitter → Tierhalter)
 *   4. "marktplatz"    → Bilder für Marktplatz-Einträge
 *
 * RLS-Policies für Storage (im Dashboard unter Storage → Policies):
 *
 *   avatars:
 *     - SELECT: public (alle dürfen lesen)
 *     - INSERT: auth.uid()::text = (storage.foldername(name))[1]
 *     - DELETE: auth.uid()::text = (storage.foldername(name))[1]
 *
 *   tier-fotos:
 *     - SELECT: public
 *     - INSERT: authenticated
 *     - DELETE: authenticated
 *
 *   journal-fotos:
 *     - SELECT: authenticated
 *     - INSERT: authenticated
 *     - DELETE: authenticated
 *
 *   marktplatz:
 *     - SELECT: public
 *     - INSERT: authenticated (nur Admins via Service Role in API)
 *     - DELETE: authenticated (nur Admins via Service Role in API)
 *
 * Empfohlene Datei-Pfade beim Upload:
 *   avatars:       {userId}/avatar.{ext}
 *   tier-fotos:    {userId}/{tierProfileId}.{ext}
 *   journal-fotos: {matchId}/{timestamp}.{ext}
 *   marktplatz:    {eintragId}/main.{ext}
 */

// Bucket-Namen als Konstanten für typsichere Verwendung im Code
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  TIER_FOTOS: 'tier-fotos',
  JOURNAL_FOTOS: 'journal-fotos',
  MARKTPLATZ: 'marktplatz',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Max-Dateigrößen in Bytes (zur clientseitigen Validierung)
export const STORAGE_MAX_SIZE: Record<StorageBucket, number> = {
  avatars: 2 * 1024 * 1024,        //  2 MB
  'tier-fotos': 5 * 1024 * 1024,   //  5 MB
  'journal-fotos': 10 * 1024 * 1024, // 10 MB
  marktplatz: 5 * 1024 * 1024,     //  5 MB
};
