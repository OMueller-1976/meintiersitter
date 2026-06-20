/**
 * audit-seed.mjs
 * Legt 15 Test-User (5 Tierhalter, 5 Sitter, 5 Beide) + Match-Szenarien an.
 * Nutzt SERVICE_ROLE_KEY → umgeht RLS vollständig.
 * Ausführen: node scripts/audit-seed.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// .env.local manuell lesen (kein dotenv nötig)
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env.local');
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY'],
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PW = 'AuditTest2026!';

function log(label, data) {
  if (data?.error) {
    console.error(`  ✗ ${label}:`, data.error.message ?? data.error);
  } else {
    console.log(`  ✓ ${label}`);
  }
}

// ── Hilfsfunktion: User anlegen ──────────────────────────────────────────────
async function createUser(email, full_name, role) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PW,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) {
    console.error(`  ✗ createUser(${email}):`, error.message);
    return null;
  }
  console.log(`  ✓ createUser(${email})`);
  return data.user;
}

// ── TIERHALTER ────────────────────────────────────────────────────────────────
const TIERHALTER = [
  {
    email: 'suchend1@tiersitti-audit.de',
    full_name: 'Anna Bergmann',
    plz: '54550', ort: 'Daun', ortschaft: 'Daun',
    phone: '06592123456',
    bio: 'Ich liebe Tiere und brauche gelegentlich Unterstützung bei der Betreuung.',
    tier: { name: 'Bello', tierart: 'hund', rasse: 'Labrador', alter_jahre: 3, vertraeglich_hunde: true, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Braucht täglich 2 Spaziergänge, sehr verspielt.' },
    posting: { leistung: 'gassi', datum_von: '2026-07-01', datum_bis: '2026-07-07', ort: 'Daun', plz: '54550', ist_notfall: false, nachricht: 'Bello braucht täglich 2 Runden, er ist sehr freundlich.' },
  },
  {
    email: 'suchend2@tiersitti-audit.de',
    full_name: 'Bernd Krämer',
    plz: '54568', ort: 'Gerolstein', ortschaft: 'Gerolstein',
    phone: '06591234567',
    bio: 'Arbeite viel, brauche zuverlässige Hilfe für meinen Hund.',
    tier: { name: 'Luna', tierart: 'hund', rasse: 'Schäferhund', alter_jahre: 5, vertraeglich_hunde: false, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Sehr treu, mag keine fremden Hunde.' },
    posting: { leistung: 'fuettern', datum_von: '2026-07-10', datum_bis: '2026-07-14', ort: 'Gerolstein', plz: '54568', ist_notfall: false, nachricht: 'Luna braucht zweimal täglich ihr Spezialfutter (ohne Getreide).' },
  },
  {
    email: 'suchend3@tiersitti-audit.de',
    full_name: 'Clara Schön',
    plz: '54574', ort: 'Kelberg', ortschaft: 'Kelberg',
    phone: '02692345678',
    bio: 'Meine Katze Mimi ist etwas schüchtern, braucht sanfte Hände.',
    tier: { name: 'Mimi', tierart: 'katze', rasse: 'Perser', alter_jahre: 4, vertraeglich_hunde: false, vertraeglich_katzen: true, vertraeglich_kinder: false, besonderheiten: 'Schüchtern bei Fremden, bitte langsam annähern. Kein Freigang.' },
    posting: { leistung: 'tagesbetreuung', datum_von: '2026-07-15', datum_bis: '2026-07-18', ort: 'Kelberg', plz: '54574', ist_notfall: false, nachricht: 'Mimi braucht Gesellschaft und tägliches Bürsten.' },
  },
  {
    email: 'suchend4@tiersitti-audit.de',
    full_name: 'Dieter Moser',
    plz: '54576', ort: 'Hillesheim', ortschaft: 'Hillesheim',
    phone: '06593456789',
    bio: 'Habe zwei Kaninchen, brauche Urlaubsbetreuung.',
    tier: { name: 'Hoppel', tierart: 'kleintier', rasse: 'Zwergkaninchen', alter_jahre: 2, vertraeglich_hunde: false, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Freigehege im Garten nötig. Frisst nur Heu, Gemüse und Pellets.' },
    posting: { leistung: 'uebernachtung', datum_von: '2026-08-01', datum_bis: '2026-08-14', ort: 'Hillesheim', plz: '54576', ist_notfall: false, nachricht: 'Hoppel braucht viel Platz und täglichen Auslauf.' },
  },
  {
    email: 'suchend5@tiersitti-audit.de',
    full_name: 'Eva Winters',
    plz: '54558', ort: 'Gillenfeld', ortschaft: 'Gillenfeld',
    phone: '06573567890',
    bio: 'Mein Wellensittich braucht Gesellschaft wenn ich im Krankenhaus bin.',
    tier: { name: 'Tweety', tierart: 'vogel', rasse: 'Wellensittich', alter_jahre: 1, vertraeglich_hunde: false, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Singt gerne, braucht täglichen Freiflug im gesicherten Zimmer.' },
    posting: { leistung: 'fuettern', datum_von: '2026-07-20', datum_bis: '2026-07-22', ort: 'Gillenfeld', plz: '54558', ist_notfall: true, nachricht: 'Notfall: Krankenhausaufenthalt. Tweety braucht täglich Frisch- und Trockenfutter plus Freiflug.' },
  },
];

// ── SITTER ────────────────────────────────────────────────────────────────────
const SITTER = [
  {
    email: 'sitter1@tiersitti-audit.de',
    full_name: 'Felix Hartmann',
    plz: '54550', ort: 'Daun', ortschaft: 'Daun',
    phone: '06592111222',
    bio: 'Erfahrener Hundesitter mit eigenem Garten. Betreue Hunde und Katzen liebevoll.',
    sitter: { erfahrung_jahre: 5, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: false, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: false, radius_km: 20, notfall_verfuegbar: false, notfall_per_email: true, notfall_per_sms: false, notfall_per_whatsapp: false },
  },
  {
    email: 'sitter2@tiersitti-audit.de',
    full_name: 'Gabi Fuchs',
    plz: '54568', ort: 'Gerolstein', ortschaft: 'Gerolstein',
    phone: '06591222333',
    bio: 'Tierpflegerin mit Ausbildung. Übernachtungen möglich, auch Notfälle.',
    sitter: { erfahrung_jahre: 8, hat_eigene_tiere: false, hat_garten: true, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: true, radius_km: 30, notfall_verfuegbar: true, notfall_per_email: true, notfall_per_sms: true, notfall_per_whatsapp: false },
  },
  {
    email: 'sitter3@tiersitti-audit.de',
    full_name: 'Hans Müller',
    plz: '54574', ort: 'Kelberg', ortschaft: 'Kelberg',
    phone: '02692333444',
    bio: 'Rentner mit viel Zeit und Liebe für Tiere aller Art.',
    sitter: { erfahrung_jahre: 3, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: false, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: false, bietet_uebernachtung: false, radius_km: 10, notfall_verfuegbar: false, notfall_per_email: true, notfall_per_sms: false, notfall_per_whatsapp: true },
  },
  {
    email: 'sitter4@tiersitti-audit.de',
    full_name: 'Ines Koch',
    plz: '54576', ort: 'Hillesheim', ortschaft: 'Hillesheim',
    phone: '06593444555',
    bio: 'Studentin, flexibel, betreue besonders gerne Kleintiere und Vögel.',
    sitter: { erfahrung_jahre: 1, hat_eigene_tiere: false, hat_garten: false, kann_medikamente: false, betreut_hunde: false, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: false, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: false, radius_km: 5, notfall_verfuegbar: false, notfall_per_email: true, notfall_per_sms: false, notfall_per_whatsapp: false },
  },
  {
    email: 'sitter5@tiersitti-audit.de',
    full_name: 'Jonas Weber',
    plz: '54558', ort: 'Gillenfeld', ortschaft: 'Gillenfeld',
    phone: '06573555666',
    bio: 'Tierarzthelfer in Ausbildung. Übernehme auch Notfall-Betreuungen.',
    sitter: { erfahrung_jahre: 2, hat_eigene_tiere: false, hat_garten: false, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: false, bietet_uebernachtung: true, radius_km: 15, notfall_verfuegbar: true, notfall_per_email: true, notfall_per_sms: true, notfall_per_whatsapp: true },
  },
];

// ── BEIDE ─────────────────────────────────────────────────────────────────────
const BEIDE = [
  {
    email: 'beide1@tiersitti-audit.de',
    full_name: 'Klara Sauer',
    plz: '54550', ort: 'Daun', ortschaft: 'Daun',
    phone: '06592600111',
    bio: 'Habe selbst einen Hund und biete gleichzeitig Betreuung für andere an.',
    tier: { name: 'Rex', tierart: 'hund', rasse: 'Golden Retriever', alter_jahre: 2, vertraeglich_hunde: true, vertraeglich_katzen: true, vertraeglich_kinder: true, besonderheiten: 'Sehr freundlich und verspielt, mag andere Hunde sehr.' },
    sitter: { erfahrung_jahre: 4, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: false, betreut_hunde: true, betreut_katzen: false, betreut_kleintiere: false, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: false, radius_km: 10, notfall_verfuegbar: false, notfall_per_email: true, notfall_per_sms: false, notfall_per_whatsapp: false },
  },
  {
    email: 'beide2@tiersitti-audit.de',
    full_name: 'Lukas Brand',
    plz: '54568', ort: 'Gerolstein', ortschaft: 'Gerolstein',
    phone: '06591600222',
    bio: 'Tierliebhaber mit Katze und Erfahrung in der Kleintierbetreuung.',
    tier: { name: 'Whisker', tierart: 'katze', rasse: 'Maine Coon', alter_jahre: 6, vertraeglich_hunde: false, vertraeglich_katzen: true, vertraeglich_kinder: true, besonderheiten: 'Braucht viel Aufmerksamkeit und tägliches Spielen.' },
    sitter: { erfahrung_jahre: 3, hat_eigene_tiere: true, hat_garten: false, kann_medikamente: true, betreut_hunde: false, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: false, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: true, radius_km: 20, notfall_verfuegbar: false, notfall_per_email: true, notfall_per_sms: false, notfall_per_whatsapp: true },
  },
  {
    email: 'beide3@tiersitti-audit.de',
    full_name: 'Marie Engel',
    plz: '54574', ort: 'Kelberg', ortschaft: 'Kelberg',
    phone: '02692600333',
    bio: 'Landwirtin mit viel Erfahrung im Umgang mit Tieren jeder Art.',
    tier: { name: 'Hopsi', tierart: 'kleintier', rasse: 'Meerschweinchen', alter_jahre: 1, vertraeglich_hunde: false, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Braucht tägliche Streicheleinheiten und Gemüse.' },
    sitter: { erfahrung_jahre: 10, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: true, radius_km: 50, notfall_verfuegbar: true, notfall_per_email: true, notfall_per_sms: true, notfall_per_whatsapp: true },
  },
  {
    email: 'beide4@tiersitti-audit.de',
    full_name: 'Nico Stern',
    plz: '54576', ort: 'Hillesheim', ortschaft: 'Hillesheim',
    phone: '06593600444',
    bio: 'Wohne auf dem Land, Platz und Zeit für Tiere habe ich genug.',
    tier: { name: 'Pieps', tierart: 'vogel', rasse: 'Nymphensittich', alter_jahre: 3, vertraeglich_hunde: false, vertraeglich_katzen: false, vertraeglich_kinder: true, besonderheiten: 'Braucht täglich Freiflug, sehr zahm.' },
    sitter: { erfahrung_jahre: 2, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: false, betreut_hunde: true, betreut_katzen: false, betreut_kleintiere: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: false, bietet_uebernachtung: false, radius_km: 15, notfall_verfuegbar: false, notfall_per_email: false, notfall_per_sms: false, notfall_per_whatsapp: true },
  },
  {
    email: 'beide5@tiersitti-audit.de',
    full_name: 'Petra Jung',
    plz: '54558', ort: 'Gillenfeld', ortschaft: 'Gillenfeld',
    phone: '06573600555',
    bio: 'Selbstständige Tierphysiotherapeutin — betreue Tiere mit und ohne Einschränkungen.',
    tier: { name: 'Buddy', tierart: 'hund', rasse: 'Beagle', alter_jahre: 4, vertraeglich_hunde: true, vertraeglich_katzen: true, vertraeglich_kinder: true, besonderheiten: 'Medikament täglich (Tablette im Futter). Sehr sozial.' },
    sitter: { erfahrung_jahre: 7, hat_eigene_tiere: true, hat_garten: false, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, betreut_kleintiere: false, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: true, radius_km: 30, notfall_verfuegbar: true, notfall_per_email: true, notfall_per_sms: true, notfall_per_whatsapp: false },
  },
];

// ── HAUPTLOGIK ────────────────────────────────────────────────────────────────

async function main() {
  const createdIds = {};

  // ── 5 Tierhalter ──
  console.log('\n=== TIERHALTER ===');
  for (const th of TIERHALTER) {
    const user = await createUser(th.email, th.full_name, 'tierhalter');
    if (!user) continue;
    createdIds[th.email] = user.id;

    log('profiles UPDATE', await supabase.from('profiles').update({
      plz: th.plz, ort: th.ort, ortschaft: th.ortschaft, phone: th.phone, bio: th.bio,
      onboarding_complete: true,
    }).eq('id', user.id));

    const { data: tierRow, error: tierErr } = await supabase.from('tier_profiles').insert({
      owner_id: user.id, ...th.tier, is_active: true, foto_urls: [],
    }).select('id').single();
    log('tier_profiles INSERT', { error: tierErr });

    const tierId = tierRow?.id ?? null;
    log('postings INSERT', await supabase.from('postings').insert({
      tierhalter_id: user.id, tier_id: tierId, ...th.posting,
      status: 'offen', auf_pinnwand: true,
    }));
  }

  // ── 5 Sitter ──
  console.log('\n=== SITTER ===');
  for (const s of SITTER) {
    const user = await createUser(s.email, s.full_name, 'sitter');
    if (!user) continue;
    createdIds[s.email] = user.id;

    log('profiles UPDATE', await supabase.from('profiles').update({
      plz: s.plz, ort: s.ort, ortschaft: s.ortschaft, phone: s.phone, bio: s.bio,
      onboarding_complete: true,
    }).eq('id', user.id));

    log('sitter_profiles INSERT', await supabase.from('sitter_profiles').upsert({
      id: user.id, ...s.sitter,
    }, { onConflict: 'id' }));
  }

  // ── 5 Beide ──
  console.log('\n=== BEIDE ===');
  for (const b of BEIDE) {
    const user = await createUser(b.email, b.full_name, 'beide');
    if (!user) continue;
    createdIds[b.email] = user.id;

    log('profiles UPDATE', await supabase.from('profiles').update({
      plz: b.plz, ort: b.ort, ortschaft: b.ortschaft, phone: b.phone, bio: b.bio,
      onboarding_complete: true,
    }).eq('id', user.id));

    log('tier_profiles INSERT', await supabase.from('tier_profiles').insert({
      owner_id: user.id, ...b.tier, is_active: true, foto_urls: [],
    }));

    log('sitter_profiles INSERT', await supabase.from('sitter_profiles').upsert({
      id: user.id, ...b.sitter,
    }, { onConflict: 'id' }));
  }

  // ── Match-Szenarien ──
  console.log('\n=== MATCH-SZENARIEN ===');

  const th1 = createdIds['suchend1@tiersitti-audit.de'];
  const th2 = createdIds['suchend2@tiersitti-audit.de'];
  const th3 = createdIds['suchend3@tiersitti-audit.de'];
  const s1  = createdIds['sitter1@tiersitti-audit.de'];
  const s2  = createdIds['sitter2@tiersitti-audit.de'];
  const s3  = createdIds['sitter3@tiersitti-audit.de'];

  if (!th1 || !th2 || !th3 || !s1 || !s2 || !s3) {
    console.error('  ✗ Fehlende User-IDs — Match-Szenarien übersprungen');
    return;
  }

  // Match 1: angefragt
  const { data: m1, error: m1err } = await supabase.from('matches').insert({
    tierhalter_id: th1, sitter_id: s1,
    status: 'angefragt',
    leistung: 'gassi',
    datum_von: '2026-07-01', datum_bis: '2026-07-07',
    tierhalter_bestaetigt_abschluss: false, sitter_bestaetigt_abschluss: false,
    nachricht: 'Bello ist sehr freundlich, Du wirst ihn mögen!',
  }).select('id').single();
  log('Match 1: angefragt (th1↔s1)', { error: m1err });

  // Match 2: bestaetigt, nur Tierhalter hat abgeschlossen
  const { data: m2, error: m2err } = await supabase.from('matches').insert({
    tierhalter_id: th2, sitter_id: s2,
    status: 'bestaetigt',
    leistung: 'fuettern',
    datum_von: '2026-07-10', datum_bis: '2026-07-14',
    tierhalter_bestaetigt_abschluss: true, sitter_bestaetigt_abschluss: false,
    nachricht: 'Bitte zweimal täglich füttern.',
  }).select('id').single();
  log('Match 2: bestaetigt, TH-Flag=true (th2↔s2)', { error: m2err });

  // Match 3: abgeschlossen, beide Flags
  const { data: m3, error: m3err } = await supabase.from('matches').insert({
    tierhalter_id: th3, sitter_id: s3,
    status: 'abgeschlossen',
    leistung: 'tagesbetreuung',
    datum_von: '2026-07-15', datum_bis: '2026-07-18',
    tierhalter_bestaetigt_abschluss: true, sitter_bestaetigt_abschluss: true,
    nachricht: 'Mimi war in guten Händen.',
  }).select('id').single();
  log('Match 3: abgeschlossen (th3↔s3)', { error: m3err });

  // ── Bewertung + UNIQUE-Constraint-Test ──
  console.log('\n=== BEWERTUNG + UNIQUE-CONSTRAINT-TEST ===');

  if (!m3) {
    console.error('  ✗ Match 3 fehlt — Bewertungstest übersprungen');
    return;
  }

  const { error: bew1err } = await supabase.from('bewertungen').insert({
    match_id: m3.id, bewerter_id: th3, bewertet_id: s3,
    sterne: 5, kommentar: 'Hans war toll! Mimi hat ihn sofort gemocht.',
  });
  log('Bewertung 1 (th3→s3, 5★)', { error: bew1err });

  // Zweiter Versuch — muss mit 23505 scheitern
  const { error: bew2err } = await supabase.from('bewertungen').insert({
    match_id: m3.id, bewerter_id: th3, bewertet_id: s3,
    sterne: 3, kommentar: 'Zweiter Versuch — darf nicht klappen.',
  });
  if (bew2err?.code === '23505') {
    console.log(`  ✓ UNIQUE-Constraint greift korrekt (code 23505): "${bew2err.message}"`);
  } else if (bew2err) {
    console.error(`  ✗ Unerwarteter Fehler (code ${bew2err.code}): ${bew2err.message}`);
  } else {
    console.error('  ✗ UNIQUE-Constraint hat NICHT gegriffen — doppelte Bewertung möglich!');
  }

  console.log('\n✅ Seed abgeschlossen.');
}

main().catch(console.error);
