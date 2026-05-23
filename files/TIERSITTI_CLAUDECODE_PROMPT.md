# Tiersitti – Claude Code Implementierungs-Prompt (MVP 1 + 2)

> Diesen Prompt in Claude Code als Startnachricht verwenden.  
> Vollständige Spezifikation: siehe `TIERSITTI_PROJEKT.md`

---

## Kontext

Du baust **Tiersitti** (tiersitti.de) – eine bundesweite, regional strukturierte Tier-Community-Plattform für Deutschland. Bestehender Dummy: https://meintiersitter.vercel.app/daun (Next.js, Vercel). Die Plattform startet mit Rheinland-Pfalz, First-Mover ist Landkreis Daun (Vulkaneifel). Alle bestehenden Inhalte des Dummys werden übernommen und sind Basis für die Weiterentwicklung.

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (DB + Auth + Realtime + Storage), Vercel

---

## Was gebaut werden soll (MVP 1 + 2)

### 1. Design-System (Glasmorphismus, Blau-Grün)

Ersetze das aktuelle Design vollständig mit folgendem System:

```css
/* globals.css */
:root {
  --gradient-bg: linear-gradient(135deg, #0f4c81 0%, #1a7a5e 50%, #0d6e8a 100%);
  --tile-bg: rgba(255, 255, 255, 0.10);
  --tile-border: rgba(255, 255, 255, 0.18);
  --tile-shadow: 0 8px 32px rgba(0, 0, 0, 0.20);
  --accent-green: #4ade80;
  --accent-blue: #38bdf8;
  --accent-amber: #f59e0b;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.72);
  --text-muted: rgba(255, 255, 255, 0.45);
  --chat-bubble-own: rgba(74, 222, 128, 0.22);
  --chat-bubble-other: rgba(255, 255, 255, 0.10);
}

body {
  background: var(--gradient-bg);
  background-attachment: fixed;
  font-family: 'Nunito', sans-serif;
  color: var(--text-primary);
  min-height: 100vh;
}

.tile {
  background: var(--tile-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--tile-border);
  border-radius: 16px;
  box-shadow: var(--tile-shadow);
}

.dummy-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(245, 158, 11, 0.85);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}
```

Google Font: `Nunito` (weights 400, 600, 700, 800). Lade via `next/font/google`.

### 2. Supabase Datenbankschema

Führe folgende SQL-Migrationen in dieser Reihenfolge aus:

**a) regions Tabelle + RLP Seed-Daten**

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

-- Alle RLP Landkreise (Daun = active, alle anderen seed-only)
INSERT INTO regions (bundesland_slug, bundesland_name, landkreis_slug, landkreis_name, lat, lng, is_active, tierheim_name) VALUES
('rheinland-pfalz','Rheinland-Pfalz','daun','Vulkaneifel (Daun)',50.1965,6.8313,TRUE,'Tierheim Vulkaneifel'),
('rheinland-pfalz','Rheinland-Pfalz','ahrweiler','Ahrweiler',50.5286,7.0939,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','altenkirchen','Altenkirchen (Westerwald)',50.6862,7.6478,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','alzey-worms','Alzey-Worms',49.7472,8.1169,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','bad-duerkheim','Bad Dürkheim',49.4611,8.1731,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','bad-kreuznach','Bad Kreuznach',49.8478,7.8650,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','bernkastel-wittlich','Bernkastel-Wittlich',49.9858,6.8912,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','birkenfeld','Birkenfeld',49.6503,7.1708,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','cochem-zell','Cochem-Zell',50.1461,7.1667,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','donnersbergkreis','Donnersbergkreis',49.6275,7.9211,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','germersheim','Germersheim',49.2211,8.3647,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','kaiserslautern-land','Kaiserslautern (Landkreis)',49.4411,7.7689,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','kusel','Kusel',49.5378,7.4008,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','mainz-bingen','Mainz-Bingen',49.9817,8.0039,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','mayen-koblenz','Mayen-Koblenz',50.3253,7.3628,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','neuwied','Neuwied',50.4289,7.4625,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','rhein-hunsrueck','Rhein-Hunsrück-Kreis',50.0167,7.5000,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','rhein-lahn','Rhein-Lahn-Kreis',50.3000,7.8333,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','rheinpfalz','Rhein-Pfalz-Kreis',49.4383,8.3597,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','suedliche-weinstrasse','Südliche Weinstraße',49.2000,8.0167,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','suedwestpfalz','Südwestpfalz',49.2000,7.5000,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','trier-saarburg','Trier-Saarburg',49.7500,6.6500,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','westerwaldkreis','Westerwaldkreis',50.5667,7.9667,FALSE,NULL),
-- Kreisfreie Städte
('rheinland-pfalz','Rheinland-Pfalz','frankenthal','Frankenthal',49.5353,8.3539,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','kaiserslautern-stadt','Kaiserslautern (Stadt)',49.4444,7.7689,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','koblenz','Koblenz',50.3569,7.5890,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','landau','Landau in der Pfalz',49.1978,8.1161,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','ludwigshafen','Ludwigshafen am Rhein',49.4811,8.4353,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','mainz','Mainz',49.9929,8.2473,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','neustadt-weinstrasse','Neustadt an der Weinstraße',49.3517,8.1386,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','pirmasens','Pirmasens',49.1981,7.6053,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','speyer','Speyer',49.3175,8.4311,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','trier','Trier',49.7489,6.6371,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','worms','Worms',49.6317,8.3650,FALSE,NULL),
('rheinland-pfalz','Rheinland-Pfalz','zweibruecken','Zweibrücken',49.2464,7.3594,FALSE,NULL);
```

**b) Users, Sitter, Pets, Care Requests, Chat**

```sql
-- users (erweitert Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer',
  region_id UUID REFERENCES regions(id),
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sitter_profiles
CREATE TABLE sitter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  region_id UUID REFERENCES regions(id),
  display_name TEXT,
  avatar_url TEXT,
  kurzbeschreibung TEXT,
  ueber_mich TEXT,
  wohnort TEXT,
  plz TEXT,
  einsatzradius_km INT DEFAULT 10,
  erfahrung_jahre INT,
  leistungen TEXT[],
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
  preis_tagesbetreuung DECIMAL(6,2),
  preis_uebernachtung DECIMAL(6,2),
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

-- pets
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
  profilbild_url TEXT,
  charakterbeschreibung TEXT,
  energielevel TEXT,
  medikamente_noetig BOOLEAN DEFAULT FALSE,
  medikamente_details TEXT,
  tierarzt_name TEXT,
  tierarzt_telefon TEXT,
  notfallkontakt_name TEXT,
  notfallkontakt_telefon TEXT,
  sitter_darf_tierarzt_aufsuchen BOOLEAN DEFAULT FALSE,
  futterart TEXT,
  gassi_haeufigkeit_taeglich INT,
  freilauf_erlaubt BOOLEAN DEFAULT FALSE,
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- care_requests (Gesuche)
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
  is_dummy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat: conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a UUID REFERENCES users(id) NOT NULL,
  participant_b UUID REFERENCES users(id) NOT NULL,
  care_request_id UUID REFERENCES care_requests(id),
  sitter_id UUID REFERENCES sitter_profiles(id),
  last_message_at TIMESTAMPTZ,
  is_archived_by_a BOOLEAN DEFAULT FALSE,
  is_archived_by_b BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat: messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes Chat
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_conv_a ON conversations(participant_a);
CREATE INDEX idx_conv_b ON conversations(participant_b);

-- donations
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
  milestone_eur DECIMAL(10,2) DEFAULT 500,
  milestone_reached_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dummy-Zeile für bundesweiten Fortschrittsbalken
INSERT INTO donation_stats (region_id, total_received_eur, milestone_eur)
VALUES (NULL, 0, 500);

-- ad_slots
CREATE TABLE ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT,
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

**c) RLS Policies**

```sql
-- Conversations: nur eigene
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_conversations" ON conversations FOR ALL
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

-- Messages: nur in eigenen Conversations
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_messages" ON messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_a = auth.uid() OR participant_b = auth.uid()
    )
  );

-- Pets: sensible Felder nur für Owner
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_pets_full" ON pets FOR ALL
  USING (owner_id = auth.uid());
CREATE POLICY "public_pets_read" ON pets FOR SELECT
  USING (TRUE)  -- öffentliche Felder über View steuern, sensible Felder weglassen
  WITH CHECK (FALSE);

-- Alle anderen Tabellen: public read, authenticated write
ALTER TABLE sitter_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_sitter" ON sitter_profiles FOR SELECT USING (TRUE);
CREATE POLICY "own_sitter_write" ON sitter_profiles FOR ALL
  USING (user_id = auth.uid());

ALTER TABLE care_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_requests" ON care_requests FOR SELECT USING (TRUE);
CREATE POLICY "own_requests_write" ON care_requests FOR ALL
  USING (owner_id = auth.uid());
```

**d) Supabase Realtime aktivieren**

```sql
-- Realtime für Chat aktivieren
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
```

**e) Dummy-Daten (Daun)**

```sql
-- Dummy User IDs (fiktiv, kein echtes Auth)
-- Gesuche
INSERT INTO care_requests (owner_id, region_id, betreuungsart, startdatum, enddatum, zeitfenster, beschreibung, status, is_dummy)
SELECT
  NULL,
  (SELECT id FROM regions WHERE landkreis_slug = 'daun'),
  'gassi', '2025-06-10', '2025-06-12', 'Morgens 7–9 Uhr',
  'Bella ist unsere 4-jährige Labradorhündin — freundlich, verspielt und liebt lange Spaziergänge.',
  'offen', TRUE;
-- (weitere Dummy-Einträge analog für Felix, Sunny, Kiko)
```

### 3. Bundesland/Landkreis-Filter (Header-Komponente)

Erstelle `components/RegionFilter.tsx`:

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Alle Bundesländer (erweiterbar)
const BUNDESLAENDER = [
  { slug: 'rheinland-pfalz', name: 'Rheinland-Pfalz' },
  // weitere folgen
]

export default function RegionFilter() {
  const router = useRouter()
  const [bundesland, setBundesland] = useState<string>('')
  const [landkreis, setLandkreis] = useState<string>('')
  const [landkreise, setLandkreise] = useState<{slug: string, name: string}[]>([])

  // Beim Laden aus localStorage lesen
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiersitti_region')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.bundesland) setBundesland(parsed.bundesland)
        if (parsed.landkreis) setLandkreis(parsed.landkreis)
      }
    } catch {}
  }, [])

  // Landkreise laden wenn Bundesland gewählt
  useEffect(() => {
    if (!bundesland) return
    fetch(`/api/v1/regions?bundesland=${bundesland}`)
      .then(r => r.json())
      .then(data => setLandkreise(data))
  }, [bundesland])

  // Persistieren
  useEffect(() => {
    if (!bundesland) return
    const filter = { bundesland, landkreis, savedAt: Date.now() }
    localStorage.setItem('tiersitti_region', JSON.stringify(filter))
    // Cookie setzen (30 Tage)
    document.cookie = `tiersitti_region=${encodeURIComponent(JSON.stringify(filter))};max-age=${60*60*24*30};path=/;SameSite=Lax`
  }, [bundesland, landkreis])

  const handleNavigate = () => {
    if (bundesland && landkreis) {
      router.push(`/${bundesland}/${landkreis}`)
    } else if (bundesland) {
      router.push(`/${bundesland}`)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Bundesland Dropdown */}
      <select
        className="tile px-3 py-2 text-sm cursor-pointer"
        value={bundesland}
        onChange={e => { setBundesland(e.target.value); setLandkreis('') }}
      >
        <option value="">Bundesland wählen</option>
        {BUNDESLAENDER.map(bl => (
          <option key={bl.slug} value={bl.slug}>{bl.name}</option>
        ))}
      </select>

      {/* Landkreis Dropdown (erscheint nach Bundesland-Wahl) */}
      {bundesland && (
        <select
          className="tile px-3 py-2 text-sm cursor-pointer"
          value={landkreis}
          onChange={e => setLandkreis(e.target.value)}
        >
          <option value="">Landkreis wählen</option>
          {landkreise.map(lk => (
            <option key={lk.slug} value={lk.slug}>{lk.name}</option>
          ))}
        </select>
      )}

      {/* Navigate Button */}
      {(bundesland || landkreis) && (
        <button
          onClick={handleNavigate}
          className="bg-accent-green text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          Los →
        </button>
      )}
    </div>
  )
}
```

### 4. Chat-Feature (Supabase Realtime)

**a) API Route** `app/api/v1/chat/route.ts`:
- `GET /api/v1/chat` → alle Conversations des eingeloggten Users
- `POST /api/v1/chat` → neue Conversation starten (body: `{recipientId, careRequestId?, message}`)
- `POST /api/v1/chat/[id]/messages` → Nachricht senden

**b) Chat-Übersicht** `app/chat/page.tsx`:
- Liste aller Conversations als Kacheln
- Ungelesene Nachrichten: Badge mit Anzahl
- Jede Kachel zeigt: Avatar, Name, letzte Nachricht, Zeitstempel
- Nur für eingeloggte User (Middleware-Schutz)

**c) Einzelchat** `app/chat/[id]/page.tsx`:
- Nachrichten-Bubble-UI:
  - Eigene Nachrichten rechts, Hintergrund: `var(--chat-bubble-own)` (grün-transparent)
  - Fremde Nachrichten links, Hintergrund: `var(--chat-bubble-other)` (weiß-transparent)
- Oben: Kontext-Bar (Tiername + Betreuungsart wenn aus Gesuch)
- Unten: Texteingabe + Senden-Button
- Realtime: Supabase-Channel auf `conversation:{id}`, `postgres_changes` auf `messages`
- Beim Öffnen: alle Nachrichten als `is_read = TRUE` markieren

**d) "Nachricht senden"-Button** auf Sitter-Profilseite:
```tsx
// Wenn eingeloggt: → öffnet Chat oder erstellt neue Conversation
// Wenn nicht eingeloggt: → Modal mit Registrierungs-CTA
<button onClick={handleChatCTA}>
  💬 Nachricht senden
</button>
```

**e) Header-Badge** für ungelesene Nachrichten:
- Zahl in rotem Badge neben Chat-Icon im Header
- Realtime-Update via Supabase-Channel

### 5. Seitenstruktur

**a) Nationale Startseite** `app/page.tsx`:
- Hero mit RegionFilter
- Statistik-Kacheln (Sitter gesamt, offene Gesuche, aktive Regionen)
- Neueste Gesuche (bundesweit, is_dummy-Badge wo nötig)
- Featured Sitter (is_dummy-Badge wo nötig)
- Ratgeber-Teaser
- Rechtes Sideboard: `<AdSlot slot="homepage_medrec" />` (300×250)
- Spendenbalken: `<DonationProgress />` (bundesweit)

**b) RLP-Übersicht** `app/rheinland-pfalz/page.tsx`:
- Alle Landkreise als Kacheln
- Aktive Landkreise hervorgehoben (grüner Rahmen)
- Seed-Landkreise: ausgegraut + "Bald verfügbar"

**c) Landkreisseite** `app/[bundesland]/[landkreis]/page.tsx`:
- `params.landkreis` → Query auf `regions`-Tabelle
- Wenn `is_active = FALSE` → Redirect auf "Bald verfügbar"-Template
- Wenn `is_active = TRUE` → volle Landkreisseite (wie aktuell Daun-Dummy)

**d) "Bald verfügbar"** Template:
```tsx
// Für alle seed-Landkreise
<div className="tile text-center p-12">
  <h1>Tiersitti kommt nach {landkreisName}!</h1>
  <p>Wir arbeiten daran, Tiersitti in Deiner Region zu starten.</p>
  <WaitlistForm landkreis={landkreis} />
  <p className="text-muted">{waitlistCount} Menschen warten bereits</p>
</div>
```

**e) AdSlot-Komponente** `components/AdSlot.tsx`:
```tsx
// Lädt aktiven Banner für Slot+Region aus Supabase
// Fallback: Spendenhinweis oder Eigenpromo wenn kein Werbetreibender
export default function AdSlot({ slot, regionId }: Props) {
  // ... fetch from ad_slots
  return (
    <div style={{ width: 300, height: 250 }} className="tile overflow-hidden">
      {ad ? (
        <a href={ad.ad_link_url} target="_blank" rel="noopener sponsored">
          <img src={ad.ad_image_url} alt={ad.alt_text} />
        </a>
      ) : (
        <DonationCTA compact />
      )}
    </div>
  )
}
```

**f) DonationProgress-Komponente** `components/DonationProgress.tsx`:
```tsx
// Fortschrittsbalken mit Spendenmeilenstein
// Props: currentAmount, milestone (500), tierheimName
export default function DonationProgress({ regionId }: Props) {
  // Lädt donation_stats für Region (oder global wenn null)
  const percent = Math.min((current / milestone) * 100, 100)
  return (
    <div className="tile p-4">
      <div className="flex justify-between mb-2">
        <span>🐾 Spenden für {tierheimName}</span>
        <span>{current} / {milestone} €</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3">
        <div className="bg-accent-green h-3 rounded-full transition-all"
             style={{ width: `${percent}%` }} />
      </div>
      <p className="text-sm text-muted mt-2">
        50% der Spenden ab {milestone} € gehen ans Tierheim
      </p>
    </div>
  )
}
```

### 6. PWA-Konfiguration

`public/manifest.json`:
```json
{
  "name": "Tiersitti",
  "short_name": "Tiersitti",
  "description": "Tierbetreuung und Tierhilfe in Deiner Region",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f4c81",
  "theme_color": "#1a7a5e",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`next.config.ts`: PWA-Plugin aktivieren (next-pwa).

### 7. API Routes (App-kompatibel)

Erstelle unter `app/api/v1/`:

```
/api/v1/regions               GET: alle Regionen (Filter: bundesland, is_active)
/api/v1/regions/[slug]        GET: einzelne Region
/api/v1/sitter                GET: Sitter (Filter: regionId, leistungen)
/api/v1/sitter/[id]           GET: einzelner Sitter
/api/v1/requests              GET: Gesuche (Filter: regionId, betreuungsart)
/api/v1/requests/[id]         GET: einzelnes Gesuch
/api/v1/chat                  GET: eigene Conversations | POST: neue Conversation
/api/v1/chat/[id]/messages    GET: Nachrichten | POST: senden
/api/v1/donations/stats       GET: Spendenstand (regionId oder global)
/api/v1/ads/[slot]            GET: aktiver Banner für Slot+Region
/api/v1/waitlist              POST: E-Mail auf Warteliste für Landkreis
```

### 8. Dummy-Daten-Markierung

Alle Komponenten die Gesuche oder Sitter rendern:
```tsx
{item.is_dummy && (
  <span className="dummy-badge" title="Dies ist ein Beispiel-Eintrag">
    📌 Beispiel
  </span>
)}
```

Auf der Pinnwand: Filter "Nur echte Einträge" (filtert `is_dummy = FALSE`).

---

## Reihenfolge der Implementierung

1. **Supabase**: Schema anlegen + RLP-Seed-Daten + RLS-Policies + Realtime
2. **Design-System**: CSS-Variables, Glasmorphismus, Nunito-Font, Tile-Klasse
3. **RegionFilter**: Header-Komponente mit Persistenz
4. **API Routes**: `/api/v1/regions`, `/api/v1/sitter`, `/api/v1/requests`
5. **Nationale Startseite**: `/` mit Filter, Statistiken, AdSlot, DonationProgress
6. **Landesübersicht**: `/rheinland-pfalz`
7. **Landkreisseite**: `/[bundesland]/[landkreis]` (dynamisch, Daun aktiv)
8. **Seed-Seiten**: "Bald verfügbar" Template für alle anderen RLP-Landkreise
9. **Chat**: Tabellen, RLS, Realtime-Subscription, Chat-UI, Header-Badge
10. **PWA**: manifest.json, Service Worker, Meta-Tags
11. **Dummy-Badges**: auf allen bestehenden Beispieldaten
12. **AdSlot + DonationProgress**: Komponenten fertigstellen

---

## Wichtige Hinweise

- **Plattformname überall:** "Tiersitti" (nicht mehr MeinTiersitter)
- **Domain:** tiersitti.de (in Meta-Tags, OG-Tags, manifest.json)
- **Dummy-Badge:** auf ALLEN bestehenden Testsittern und Testgesuchen
- **Chat nur für registrierte User:** Middleware `matcher: ['/chat/:path*']`
- **Supabase Realtime:** für Chat zwingend aktivieren
- **DSGVO:** Plausible Analytics (kein Cookie-Banner nötig)
- **Farben:** kein hartes Weiß, immer Glasmorphismus-Tiles auf Verlaufshintergrund
- **Mobile:** Bottom Sheet für Region-Filter auf kleinen Screens
- **Barrierefreiheit:** aria-labels auf allen interaktiven Elementen

---

*Vollständige Spezifikation: `TIERSITTI_PROJEKT.md`*
