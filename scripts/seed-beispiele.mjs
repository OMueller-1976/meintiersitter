import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function createDemoUser(email, fullName, role) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: crypto.randomUUID(),
    email_confirm: true,
    user_metadata: { full_name: fullName, role }
  })
  if (error) {
    if (error.message.includes('already been registered')) {
      const { data: list } = await supabase.auth.admin.listUsers()
      const existing = list.users.find(u => u.email === email)
      return existing?.id
    }
    console.error('Fehler bei', email, error.message)
    return null
  }
  return data.user.id
}

async function main() {
  console.log('🌱 Seede Beispiel-Daten...')

  // ━━━ TIERHALTER + TIERE + POSTINGS ━━━
  const tierhalterDaten = [
    {
      email: 'beispiel-mueller@meintiersitter.de',
      name: 'Familie Müller', ort: 'Daun', plz: '54550',
      tier: { name: 'Bella', tierart: 'hund', rasse: 'Labrador Retriever',
        alter_jahre: 4, foto_url: '/assets/Hund.png',
        beschreibung: 'Bella ist unsere 4-jährige Labradorhündin — freundlich, verspielt und liebt lange Spaziergänge.' },
      posting: { leistung: 'gassi',
        nachricht: 'Wir suchen jemanden für die Morgengassi-Runde. Bella zieht nicht an der Leine und kommt gut mit anderen Hunden aus.',
        datum_von: '2026-07-10', datum_bis: '2026-07-12',
        uhrzeit_von: '07:00', uhrzeit_bis: '09:00' }
    },
    {
      email: 'beispiel-schmitt@meintiersitter.de',
      name: 'Petra Schmitt', ort: 'Gillenfeld', plz: '54558',
      tier: { name: 'Felix', tierart: 'katze', rasse: 'Europäische Kurzhaar',
        alter_jahre: 6, foto_url: '/assets/Katze.png',
        beschreibung: 'Felix ist ein ruhiger, verschmuster Kater, 6 Jahre alt.' },
      posting: { leistung: 'fuettern',
        nachricht: 'Wir fahren eine Woche in den Urlaub und suchen jemanden der täglich vorbeischaut, füttert und kurz mit ihm spielt.',
        datum_von: '2026-07-20', datum_bis: '2026-07-27',
        uhrzeit_von: null, uhrzeit_bis: null }
    },
    {
      email: 'beispiel-weber@meintiersitter.de',
      name: 'Thomas Weber', ort: 'Manderscheid', plz: '54531',
      tier: { name: 'Sunny', tierart: 'sonstiges', rasse: 'Shetland Pony',
        alter_jahre: 7, foto_url: '/assets/ponny.png',
        beschreibung: 'Sunny ist ein zahmes, kinderfreundliches Shetlandpony.' },
      posting: { leistung: 'tagesbetreuung',
        nachricht: 'Unser Shetlandpony braucht an drei Tagen Betreuung — Fütterung morgens und abends, Weide kontrollieren.',
        datum_von: '2026-08-01', datum_bis: '2026-08-03',
        uhrzeit_von: null, uhrzeit_bis: null }
    },
    {
      email: 'beispiel-berg@meintiersitter.de',
      name: 'Sabine Berg', ort: 'Gerolstein', plz: '54568',
      tier: { name: 'Kiko', tierart: 'vogel', rasse: 'Wellensittich',
        alter_jahre: 3, foto_url: '/assets/vogel.png',
        beschreibung: 'Kiko ist ein quicklebendiger, zutraulicher Wellensittich.' },
      posting: { leistung: 'fuettern',
        nachricht: 'Zweimal täglich füttern, frisches Wasser, kurz mit ihm sprechen. Er ist sehr zutraulich!',
        datum_von: '2026-07-15', datum_bis: '2026-07-22',
        uhrzeit_von: '08:00', uhrzeit_bis: '18:00' }
    },
  ]

  for (const d of tierhalterDaten) {
    const userId = await createDemoUser(d.email, d.name, 'tierhalter')
    if (!userId) continue

    await supabase.from('profiles').upsert({
      id: userId, role: 'tierhalter', full_name: d.name,
      email: d.email, ort: d.ort, plz: d.plz,
      ist_beispiel: true, subscription_status: 'active',
    }, { onConflict: 'id' })

    const { data: tier } = await supabase.from('tier_profiles')
      .upsert({
        owner_id: userId, ...d.tier, ist_beispiel: true, is_active: true,
      }, { onConflict: 'owner_id,name' })
      .select().single()

    let tierId = tier?.id
    if (!tierId) {
      const { data: existing } = await supabase.from('tier_profiles')
        .select('id').eq('owner_id', userId).eq('name', d.tier.name).single()
      tierId = existing?.id
    }

    await supabase.from('postings').insert({
      tierhalter_id: userId, tier_id: tierId,
      ...d.posting, plz: d.plz, ort: d.ort,
      status: 'offen', auf_pinnwand: true, ist_beispiel: true,
    })

    console.log('✓', d.name, '+', d.tier.name, '+ Posting angelegt')
  }

  // ━━━ SITTER ━━━
  const sitterDaten = [
    {
      email: 'beispiel-berger@meintiersitter.de',
      name: 'Familie Berger', ort: 'Daun', plz: '54550',
      avatar_url: '/assets/familie.png',
      bio: 'Wir sind eine Familie mit zwei Kindern (8 und 11 Jahre) und großem Garten. Wir hatten selbst viele Jahre Hunde.',
      sitter: { erfahrung_jahre: 10, hat_eigene_tiere: true, hat_garten: true,
        kann_medikamente: false, betreut_hunde: true, betreut_katzen: true,
        bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true,
        bietet_uebernachtung: false, radius_km: 10, avg_rating: 4.8, total_reviews: 12 }
    },
    {
      email: 'beispiel-hoffmann@meintiersitter.de',
      name: 'Markus Hoffmann', ort: 'Gillenfeld', plz: '54558',
      avatar_url: '/assets/MannSitter.png',
      bio: 'Rentner und passionierter Wanderer in der Vulkaneifel. 20 Jahre eigene Hundeerfahrung.',
      sitter: { erfahrung_jahre: 20, hat_eigene_tiere: false, hat_garten: false,
        kann_medikamente: false, betreut_hunde: true, betreut_katzen: false,
        bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: false,
        bietet_uebernachtung: false, radius_km: 15, avg_rating: 4.9, total_reviews: 8 }
    },
    {
      email: 'beispiel-schneider@meintiersitter.de',
      name: 'Maria Schneider', ort: 'Manderscheid', plz: '54531',
      avatar_url: '/assets/FrauSitter.png',
      bio: 'Tierarzthelferin mit 8 Jahren Erfahrung. Kann auch Medikamente verabreichen.',
      sitter: { erfahrung_jahre: 8, hat_eigene_tiere: true, hat_garten: true,
        kann_medikamente: true, betreut_hunde: true, betreut_katzen: true,
        bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true,
        bietet_uebernachtung: true, radius_km: 20, avg_rating: 5.0, total_reviews: 5 }
    },
  ]

  for (const d of sitterDaten) {
    const userId = await createDemoUser(d.email, d.name, 'sitter')
    if (!userId) continue

    await supabase.from('profiles').upsert({
      id: userId, role: 'sitter', full_name: d.name,
      email: d.email, ort: d.ort, plz: d.plz,
      avatar_url: d.avatar_url, bio: d.bio,
      ist_beispiel: true, subscription_status: 'inactive',
    }, { onConflict: 'id' })

    await supabase.from('sitter_profiles').upsert({
      id: userId, ...d.sitter,
    }, { onConflict: 'id' })

    console.log('✓ Sitter', d.name, 'angelegt')
  }

  console.log('🌱 Fertig!')
}

main().catch(console.error)
