# Tiersitti – Projektdokumentation & Technische Spezifikation

> **Plattformname:** Tiersitti  
> **Domain:** tiersitti.de  
> **Letzte Aktualisierung:** Mai 2026  
> **Bestehender Dummy:** https://meintiersitter.vercel.app/daun  
> **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Vercel  
> **Ziel:** Bundesweite Tier-Community-Plattform, MVP-Start RLP / Landkreis Daun (Vulkaneifel)

---

## 1. Vision & Positionierung

### Claim
**Tiersitti – Tierbetreuung und Tierhilfe in Deiner Region.**  
*Subline: Finde Sitter, melde Gefahren, entdecke tierfreundliche Orte und vernetze Dich mit Tierfreunden in Deiner Region.*

### Kernprinzipien
- **Lokal first** – Bundesland → Landkreis → Ort (dreigliedrige Hierarchie)
- **Vertrauen** – Profile, Bewertungen, Badges, persönliche Vorstellung
- **Community** – nicht nur Sitterbörse, sondern regionales Tierhalter-Ökosystem
- **Kostenlos für Suchende** – Monetarisierung über Banner, Sponsoren, Spenden
- **App-ready** – Architektur PWA-first, dann React Native (Expo)
- **Direktkontakt** – interner Chat nur für registrierte User (beide Seiten müssen Account haben)

### Differenzierung zu Rover / Pawshake / Holidog
| Feature | Tiersitti | Rover / Pawshake |
|---|---|---|
| Regionalfokus (Landkreis) | ✅ | ❌ |
| Interner Chat (registrierte User) | ✅ | ✅ |
| Giftköder-Warner | ✅ | ❌ |
| Vermisst/Gefunden-Modul | ✅ | ❌ |
| Wanderrouten / Hundestrände | ✅ | ❌ |
| Tierärzte-Verzeichnis | ✅ | ❌ |
| Kostenlos für Halter & Sitter | ✅ | ❌ |
| Community Spenden-Modell | ✅ | ❌ |
| Bundesland/Landkreis-Filter persistent | ✅ | ❌ |

---

## 2. URL-Struktur (Pfad-basiert, SEO-optimiert)

```
/                                    → Nationale Startseite (Dashboard)
/[bundesland]                        → Landesübersicht, z.B. /rheinland-pfalz
/[bundesland]/[landkreis]            → Landkreisseite, z.B. /rheinland-pfalz/daun
/pinnwand                            → Gesuche (filterbar)
/sitter                              → Sittersuche (filterbar)
/ratgeber                            → Ratgeber (national + regional)
/ratgeber/wandern                    → Wanderrouten
/ratgeber/hundestrand                → Hundestrände
/ratgeber/unterkuenfte               → Hundefreundliche Unterkünfte
/marktplatz                          → Tierärzte, Shops, Partner
/chat                                → Chat-Übersicht (nur eingeloggte User)
/chat/[conversationId]               → Einzelner Chat
/register                            → Registrierung (Halter / Sitter)
/login                               → Login
/profil                              → Nutzerprofil
/tier/[id]                           → Tierprofil (auch als Modal)
/sitter/[id]                         → Sitterprofil (auch als Modal)
/spenden                             → Spendenpage mit Fortschrittsanzeige
/impressum / /datenschutz / /agb
```

**Wichtig:** Pfad-Struktur statt Subdomains → alle Landkreisseiten erben Domain-Authority von tiersitti.de.

---

## 3. Design-System

### Farbschema (Blau-Grün-Verlauf, Glasmorphismus)
Inspiration: Beigefügtes Referenzbild (dunkler Verlaufshintergrund, Kacheln leicht abgehoben in ähnlicher Farbvariante).

```css
/* Hintergrund */
--gradient-bg: linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0d6e8a 100%);

/* Kacheln: Glasmorphismus */
--tile-bg: rgba(255, 255, 255, 0.10);
--tile-border: rgba(255, 255, 255, 0.18);
--tile-shadow: 0 8px 32px rgba(0, 0, 0, 0.20);
--tile-blur: blur(14px);

/* Akzentfarben */
--accent-green: #4ade80;
--accent-blue: #38bdf8;
--accent-amber: #f59e0b;   /* Dummy-Badge */

/* Text */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.72);
--text-muted: rgba(255, 255, 255, 0.45);

/* Chat-spezifisch */
--chat-bubble-own: rgba(74, 222, 128, 0.25);
--chat-bubble-other: rgba(255, 255, 255, 0.12);

/* Tile-Klasse */
.tile {
  background: var(--tile-bg);
  backdrop-filter: var(--tile-blur);
  -webkit-backdrop-filter: var(--tile-blur);
  border: 1px solid var(--tile-border);
  border-radius: 16px;
  box-shadow: var(--tile-shadow);
}
```

### Typografie
- **Display/Headlines:** Nunito (rund, warm, vertrauensvoll)
- **Body:** Inter
- **Monospace (optional):** JetBrains Mono (nur technische Elemente)

### Dummy-Badge (alle Beispieldaten)
```tsx
<span className="dummy-badge">📌 Beispiel</span>
// Amber, leicht transparent, top-right auf Kachel
// Tooltip: "Dies ist ein Beispiel-Eintrag zur Illustration."
```

### UI-Komponenten-Prinzipien
- **Dropdown/Wheel:** Bundesland & Landkreis-Auswahl
  - Desktop: Dropdown mit Suchfeld
  - Mobile: Bottom Sheet Wheel Picker
- **Modals:** Alle Profilansichten (Tier, Sitter), Gesuch erstellen (Wizard), Chat öffnen, Spenden, Filter
- **Wizard:** Gesuch erstellen in 4 Steps mit Progress-Indicator
- **Kein hartes Weiß** – immer semi-transparente Glasmorphismus-Elemente

---

## 4. Regionaler Filter (Header, persistent)

### Verhalten
- Sichtbar für **alle User** (registriert & anonym)
- Zwei-stufige Auswahl: Bundesland → Landkreis
- Nach Auswahl → Navigation zu `/[bundesland]/[landkreis]`
- "Mein Standort" via Geolocation API (Permission-gated, optional)

### Persistenz
```typescript
interface RegionFilter {
  bundesland: string;   // "rheinland-pfalz"
  landkreis: string;    // "daun"
  savedAt: number;      // Unix timestamp
}
// localStorage["tiersitti_region"] + httpOnly Cookie "tiersitti_region" (30 Tage)
// Wird bei Seitenaufruf ausgelesen und vorausgewählt
```

---

## 5. Chat-Funktionalität (Supabase Realtime)

### Grundregeln
- **Nur registrierte User** können chatten (beide Seiten müssen Account haben)
- Chat wird initiiert von: Sitter-Profilseite ("Nachricht senden") ODER Gesuch-Pinnwand ("Bewerben + Nachricht")
- Keine Telefonnummer / E-Mail im Chat nötig (alles plattformintern)
- Unregistrierte User sehen CTA: "Registriere Dich kostenlos, um [Sitter-Name] direkt zu schreiben"

### Datenbankschema Chat
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a UUID REFERENCES users(id) NOT NULL,  -- Initiator
  participant_b UUID REFERENCES users(id) NOT NULL,  -- Empfänger
  care_request_id UUID REFERENCES care_requests(id), -- Optional: Bezug zu Gesuch
  sitter_id UUID REFERENCES sitter_profiles(id),     -- Optional: Bezug zu Sitter
  last_message_at TIMESTAMPTZ,
  is_archived_by_a BOOLEAN DEFAULT FALSE,
  is_archived_by_b BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_a, participant_b, care_request_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_conversations_participant_a ON conversations(participant_a);
CREATE INDEX idx_conversations_participant_b ON conversations(participant_b);
```

### RLS Policies (Chat)
```sql
-- Conversations: nur eigene sehen
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_conversations" ON conversations
  FOR ALL USING (
    auth.uid() = participant_a OR auth.uid() = participant_b
  );

-- Messages: nur in eigenen Conversations
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_messages" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_a = auth.uid() OR participant_b = auth.uid()
    )
  );
```

### Realtime-Subscriptions
```typescript
// Chat-Seite: Live-Updates ohne Polling
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message]);
  })
  .subscribe();
```

### Chat-UI-Spezifikation
- **Chat-Übersicht** (`/chat`): Liste aller Conversations, ungelesene Nachrichten-Badge
- **Einzelchat** (`/chat/[id]`): Bubble-Design (eigene rechts grün, andere links weiß/transparent)
- **Benachrichtigungen:** E-Mail bei neuer Nachricht (wenn User nicht online), In-App-Badge im Header
- **Kontext-Anzeige:** Oben im Chat-Fenster: Tiername + Betreuungsart (wenn aus Gesuch initiiert)
- **Keine Dateiübertragung** im MVP (nur Text)
- **Melde-Funktion** (Missbrauch melden)

### Unregistriert-CTA beim Chat-Versuch
```tsx
// Wenn nicht eingeloggt und auf "Nachricht senden" klickt:
<Modal>
  <h2>Kostenlos registrieren</h2>
  <p>Um {sitterName} direkt zu schreiben, erstelle jetzt Deinen kostenlosen Tiersitti-Account.</p>
  <Button href="/register">Jetzt registrieren</Button>
  <Button variant="ghost" href="/login">Bereits Mitglied? Einloggen</Button>
</Modal>
```

---

## 6. Datenbankmodell (Supabase / PostgreSQL)

### `regions`
```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundesland_slug TEXT NOT NULL,
  bundesland_name TEXT NOT NULL,
  landkreis_slug TEXT,
  landkreis_name TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  is_active BOOLEAN DEFAULT FALSE,
  hero_image_url TEXT,
  description TEXT,
  tierheim_name TEXT,
  tierheim_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `region_content`
```sql
CREATE TABLE region_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES regions(id),
  content_type TEXT NOT NULL,
  -- 'wanderroute' | 'hundestrand' | 'unterkunft' | 'tipp' | 'marktplatz' | 'ratgeber'
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  external_url TEXT,
  address TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  tags TEXT[],
  is_sponsored BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer',
  -- 'viewer' | 'tierhalter' | 'sitter' | 'admin'
  region_id UUID REFERENCES regions(id),
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `sitter_profiles`
```sql
CREATE TABLE sitter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  region_id UUID REFERENCES regions(id),
  display_name TEXT,
  profile_type TEXT,
  avatar_url TEXT,
  kurzbeschreibung TEXT,
  ueber_mich TEXT,
  wohnort TEXT,
  plz TEXT,
  einsatzradius_km INT DEFAULT 10,
  erfahrung_jahre INT,
  leistungen TEXT[],
  -- ['gassi','fuettern','tagesbetreuung','uebernachtung','haussitting','kleintier']
  betreute_tierarten TEXT[],
  spezialerfahrung TEXT[],
  qualifikationen TEXT[],
  garten_vorhanden BOOLEAN DEFAULT FALSE,
  garten_eingezaeunt BOOLEAN DEFAULT FALSE,
  andere_tiere_im_haushalt BOOLEAN DEFAULT FALSE,
  kinder_im_haushalt BOOLEAN DEFAULT FALSE,
  auto_vorhanden BOOLEAN DEFAULT FALSE,
  medikamente_moeglich BOOLEAN DEFAULT FALSE,
  erste_hilfe_tier BOOLEAN DEFAULT FALSE,
  fuehrungszeugnis_geprueft BOOLEAN DEFAULT FALSE,
  identitaet_geprueft BOOLEAN DEFAULT FALSE,
  preis_gassi_30 DECIMAL(6,2),
  preis_gassi_60 DECIMAL(6,2),
  preis_kontrollbesuch DECIMAL(6,2),
  preis_tagesbetreuung DECIMAL(6,2),
  preis_uebernachtung DECIMAL(6,2),
  preis_haussitting DECIMAL(6,2),
  kostenlose_kennenlernrunde BOOLEAN DEFAULT TRUE,
  verfuegbarkeit_wochentage TEXT[],
  kurzfristig_verfuegbar BOOLEAN DEFAULT FALSE,
  max_tiere_gleichzeitig INT DEFAULT 1,
  rating_avg DECIMAL(3,2),
  rating_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `pets`
```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  region_id UUID REFERENCES regions(id),
  tier_name TEXT NOT NULL,
  tierart TEXT NOT NULL,
  rasse TEXT,
  geschlecht TEXT,
  kastriert BOOLEAN,
  geburtsdatum DATE,
  gewicht_kg DECIMAL(5,2),
  groesse TEXT,
  profilbild_url TEXT,
  charakterbeschreibung TEXT,
  energielevel TEXT,
  vertraeglichkeit_hunde TEXT,
  vertraeglichkeit_katzen TEXT,
  vertraeglichkeit_kinder TEXT,
  leinenverhalten TEXT,
  rueckruf TEXT,
  angst_themen TEXT[],
  medikamente_noetig BOOLEAN DEFAULT FALSE,
  medikamente_details TEXT,        -- Nur für bestätigte Sitter (RLS)
  tierarzt_name TEXT,
  tierarzt_telefon TEXT,           -- Nur für bestätigte Sitter (RLS)
  notfallkontakt_name TEXT,        -- Nur für bestätigte Sitter (RLS)
  notfallkontakt_telefon TEXT,     -- Nur für bestätigte Sitter (RLS)
  sitter_darf_tierarzt_aufsuchen BOOLEAN DEFAULT FALSE,
  tierarzt_kostenfreigabe_eur DECIMAL(8,2),
  futterart TEXT,
  fuetterungszeiten TEXT[],
  gassi_haeufigkeit_taeglich INT,
  freilauf_erlaubt BOOLEAN DEFAULT FALSE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `care_requests` (Gesuche)
```sql
CREATE TABLE care_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  pet_id UUID REFERENCES pets(id),
  region_id UUID REFERENCES regions(id),
  betreuungsart TEXT NOT NULL,
  startdatum DATE,
  enddatum DATE,
  zeitfenster TEXT,
  beschreibung TEXT,
  max_budget DECIMAL(8,2),
  status TEXT DEFAULT 'offen',
  -- 'offen' | 'angefragt' | 'vergeben' | 'erledigt'
  sichtbarkeit TEXT DEFAULT 'public',
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `hazard_reports` (Giftköder-Warner)
```sql
CREATE TABLE hazard_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES users(id),
  region_id UUID REFERENCES regions(id),
  hazard_type TEXT NOT NULL,
  hazard_location_lat DECIMAL(9,6),
  hazard_location_lng DECIMAL(9,6),
  hazard_address_approx TEXT,
  hazard_radius_m INT DEFAULT 50,
  hazard_description TEXT,
  hazard_photo_url TEXT,
  status TEXT DEFAULT 'pending',
  confirmed_by_count INT DEFAULT 0,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

### `lost_found_reports` (Vermisst/Gefunden)
```sql
CREATE TABLE lost_found_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES users(id),
  region_id UUID REFERENCES regions(id),
  report_type TEXT NOT NULL,       -- 'vermisst' | 'gefunden'
  tierart TEXT,
  rasse TEXT,
  tier_name TEXT,
  beschreibung TEXT,
  foto_url TEXT,
  zuletzt_gesehen_lat DECIMAL(9,6),
  zuletzt_gesehen_lng DECIMAL(9,6),
  zuletzt_gesehen_adresse TEXT,
  zuletzt_gesehen_am TIMESTAMPTZ,
  kontakt_name TEXT,
  kontakt_telefon TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id),
  sitter_id UUID REFERENCES sitter_profiles(id),
  care_request_id UUID REFERENCES care_requests(id),
  rating_gesamt DECIMAL(2,1),
  rating_zuverlaessigkeit DECIMAL(2,1),
  rating_kommunikation DECIMAL(2,1),
  rating_tierverhalten DECIMAL(2,1),
  freitext TEXT,
  wiederbuchung BOOLEAN,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `donations`
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id),
  amount_eur DECIMAL(8,2),
  region_id UUID REFERENCES regions(id),
  payment_provider TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending',
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE donation_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES regions(id),
  total_received_eur DECIMAL(10,2) DEFAULT 0,
  total_costs_eur DECIMAL(10,2) DEFAULT 0,
  total_to_tierheim_eur DECIMAL(10,2) DEFAULT 0,
  milestone_eur DECIMAL(10,2) DEFAULT 500,
  milestone_reached_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `ad_slots` (Banner-Verwaltung)
```sql
CREATE TABLE ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT,
  -- 'homepage_medrec' | 'landkreis_medrec' | 'ratgeber_native'
  region_id UUID REFERENCES regions(id),
  advertiser_name TEXT,
  ad_image_url TEXT,
  ad_link_url TEXT,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `business_listings` (Marktplatz)
```sql
CREATE TABLE business_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES regions(id),
  business_type TEXT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  telefon TEXT,
  website_url TEXT,
  logo_url TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Alle Landkreise Rheinland-Pfalz (Seed-Daten)

### Status-Typen
- `active` = vollständige Landkreisseite (Daun = einzige aktive Region im MVP)
- `seed` = Region in DB, Seite zeigt "Bald verfügbar" + Wartelisten-Formular

### Kreisfreie Städte RLP
| Slug | Name | Status |
|---|---|---|
| frankenthal | Frankenthal | seed |
| kaiserslautern-stadt | Kaiserslautern (Stadt) | seed |
| koblenz | Koblenz | seed |
| landau | Landau in der Pfalz | seed |
| ludwigshafen | Ludwigshafen am Rhein | seed |
| mainz | Mainz | seed |
| neustadt-weinstrasse | Neustadt an der Weinstraße | seed |
| pirmasens | Pirmasens | seed |
| speyer | Speyer | seed |
| trier | Trier | seed |
| worms | Worms | seed |
| zweibruecken | Zweibrücken | seed |

### Landkreise RLP
| Slug | Name | Status |
|---|---|---|
| ahrweiler | Ahrweiler | seed |
| altenkirchen | Altenkirchen (Westerwald) | seed |
| alzey-worms | Alzey-Worms | seed |
| bad-duerkheim | Bad Dürkheim | seed |
| bad-kreuznach | Bad Kreuznach | seed |
| bernkastel-wittlich | Bernkastel-Wittlich | seed |
| birkenfeld | Birkenfeld | seed |
| cochem-zell | Cochem-Zell | seed |
| **daun** | **Vulkaneifel (Daun)** | **✅ active** |
| donnersbergkreis | Donnersbergkreis | seed |
| germersheim | Germersheim | seed |
| kaiserslautern-land | Kaiserslautern (Landkreis) | seed |
| kusel | Kusel | seed |
| mainz-bingen | Mainz-Bingen | seed |
| mayen-koblenz | Mayen-Koblenz | seed |
| neuwied | Neuwied | seed |
| rhein-hunsrueck | Rhein-Hunsrück-Kreis | seed |
| rhein-lahn | Rhein-Lahn-Kreis | seed |
| rheinpfalz | Rhein-Pfalz-Kreis | seed |
| suedliche-weinstrasse | Südliche Weinstraße | seed |
| suedwestpfalz | Südwestpfalz | seed |
| trier-saarburg | Trier-Saarburg | seed |
| westerwaldkreis | Westerwaldkreis | seed |

---

## 8. Seitenstruktur im Detail

### A) Nationale Startseite `/`
- Header + Bundesland/Landkreis-Filter
- Hero: "Finde vertrauensvolle Tierbetreuung in Deiner Region"
- Statistiken: Sitter-Anzahl, offene Gesuche, aktive Regionen
- Neueste Gesuche (mit Dummy-Badge wenn nötig)
- Vorgestellte Sitter (mit Dummy-Badge wenn nötig)
- Ratgeber-Teaser (native Advertising-Slot möglich)
- **Rechtes Sideboard: Medium Rectangle Banner (300×250)**
  - Fallback wenn kein Werbetreibender: Spendenhinweis
- Spendenfortschrittsbalken (bundesweit)
- Footer

### B) Landesübersicht `/rheinland-pfalz`
- Alle Landkreise als Kacheln (aktive hervorgehoben)
- Karte RLP mit Landkreis-Pins
- Statistiken RLP gesamt

### C) Landkreisseite `/rheinland-pfalz/daun`
- Regionaler Hero mit Landkreis-Logo
- Regionale Gesuche + Sitter (mit Dummy-Badges)
- Tipps & Entdecken (Wanderrouten, Hundestrand, etc.)
- Tierärzte-Verzeichnis (lokal)
- Giftköder-Warner-Karte (lokal)
- MedRec Banner-Slot
- Spendenbalken (lokal, mit Tierheim-Bezug)

### D) "Bald verfügbar"-Seite (seed-Regionen)
```
/rheinland-pfalz/koblenz
→ "Tiersitti kommt nach Koblenz!"
→ E-Mail-Warteliste: "X Menschen warten schon"
→ CTA: "Als Sitter vorregistrieren"
```

---

## 9. Monetarisierung

### Kostenlos (immer)
- Profil erstellen, Gesuch aufgeben, Sitter suchen, Kontakt/Chat

### Freiwillige Spenden
- Spendenbutton Header + Footer + Landkreisseite
- Milestone: 500 € → 50% ans lokale Tierheim, 50% Betriebskosten
- Transparenzseite `/spenden` mit Live-Fortschritt
- Zahlung: Stripe + PayPal

### Banner-Werbung
- **Medium Rectangle (300×250):** rechtes Sideboard (national + Landkreis)
- **Native Advertising:** Ratgeber-Bereich (gekennzeichnet als "Anzeige")
- Fallback bei leerem Slot: Spendenhinweis oder Eigenpromo

### Keine Buchungsprovision im MVP
Erst Phase 3 nach ausreichend Traffic.

---

## 10. App-Readiness

### Phase 1: PWA (Next.js)
```json
// public/manifest.json
{
  "name": "Tiersitti",
  "short_name": "Tiersitti",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f4c81",
  "theme_color": "#1a7a5e",
  "description": "Tierbetreuung und Tierhilfe in Deiner Region"
}
```

### Phase 2: React Native (Expo)
- Shared API-Client (Supabase JS SDK)
- Shared Auth (Supabase Auth)
- Expo Router (file-based, analog Next.js App Router)
- Native Wheel Picker für Region-Filter
- Push Notifications via Expo Notifications

### API-Design (app-kompatibel)
- Next.js API Routes: `/api/v1/...`
- Supabase PostgREST direkt mit RLS
- Auth: JWT via Supabase Auth
- Alle Responses: strukturiertes JSON

---

## 11. SEO-Strategie

### Automatisch generierte Landingpages
```
/tiersitter-[landkreis]       → "Tiersitter in [Name]"
/hundesitter-[landkreis]      → "Hundesitter in [Name]"
/katzensitter-[landkreis]     → "Katzensitter in [Name]"
/gassi-[landkreis]            → "Gassi-Service in [Name]"
/tierbetreuung-[landkreis]    → "Tierbetreuung in [Name]"
```

### Strukturierte Daten
- `LocalBusiness` für Sitter-Profile
- `FAQPage` für Ratgeber
- `BreadcrumbList` für alle Regionenseiten

---

## 12. MVP-Phasen

### MVP 1 – Grundstruktur
- [ ] Alle RLP-Landkreise in Supabase (seed-only + Daun active)
- [ ] Bundesland/Landkreis-Filter (Header, persistent localStorage/Cookie)
- [ ] Nationale Startseite (Dashboard, MedRec-Slot, Spendenbalken)
- [ ] Landesübersicht RLP
- [ ] Landkreisseite Daun (dynamisch aus DB)
- [ ] "Bald verfügbar"-Seiten (seed-Regionen) mit Warteliste
- [ ] Dummy-Badges auf allen Beispieldaten
- [ ] Glasmorphismus Design-System (Blau-Grün)
- [ ] Impressum, Datenschutz, AGB

### MVP 2 – Profile & Chat
- [ ] Vollständiges Tierprofil (Modal, Wizard)
- [ ] Vollständiges Sitterprofil (Modal)
- [ ] Gesuch-Wizard (4 Steps, Modal)
- [ ] **Chat-Funktion** (Supabase Realtime, nur registrierte User)
- [ ] Chat-Übersicht + Einzelchat-UI
- [ ] E-Mail-Benachrichtigung bei neuer Nachricht
- [ ] Bewertungssystem
- [ ] Sitter-Badges
- [ ] Spenden live (Stripe/PayPal)
- [ ] PWA (manifest.json + Service Worker)

### MVP 3 – Community & Skalierung
- [ ] Giftköder-Warner (Leaflet-Karte)
- [ ] Vermisst/Gefunden-Modul
- [ ] Weitere Bundesländer
- [ ] Premium-Partnerprofile
- [ ] Push-Notifications
- [ ] React Native App (Expo)
- [ ] Admin-Dashboard

---

## 13. Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS Variables |
| Datenbank | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Realtime/Chat | Supabase Realtime (postgres_changes) |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Karten | Leaflet.js (Giftköder-Warner) |
| Zahlungen | Stripe + PayPal (Spenden) |
| E-Mail | Resend |
| Analytics | Plausible (DSGVO-konform, kein Cookie-Banner nötig) |
| App Phase 2 | Expo (React Native) |

---

## 14. DSGVO & Rechtliches

- RLS in Supabase sichert sensible Felder (Chipnummer, Medikamente, Notfallkontakt) auf DB-Ebene
- Chat-Nachrichten: nur für beteiligte User sichtbar (RLS)
- `is_dummy = TRUE` Datensätze enthalten ausschließlich fiktive Daten
- Cookie-Banner: nur bei Marketing-Cookies nötig (Plausible = kein Banner)
- Spendentransaktionen: 10 Jahre Aufbewahrung (Steuerrecht)
- Impressumspflicht (TMG §5)
- Haftungshinweis: Plattform haftet nicht für Schäden aus Betreuungsverhältnissen

---

## 15. Offene To-Dos

- [ ] tiersitti.de Domain registriert? → bestätigen
- [ ] Logo / CI final (aktuell Daun-Dummy-Logo)
- [ ] Tierheim Daun (oder Vulkaneifel e.V.): Kooperation anfragen
- [ ] Stripe/PayPal Account für Spenden einrichten
- [ ] Impressum-Angaben finalisieren
- [ ] Datenschutzerklärung anwaltlich prüfen lassen
- [ ] Plausible Analytics Account anlegen
- [ ] WhatsApp-Community "Tiersitti Daun" anlegen (Giftköder-Warner Hebel)

---

*Dieses Dokument ist die Single Source of Truth für alle Entwicklungs- und Design-Entscheidungen von Tiersitti (tiersitti.de). Es ist für Claude Code, andere Claude-Chats und alle Projektbeteiligten gedacht. Immer als ersten Anhang in neue Chats laden.*
