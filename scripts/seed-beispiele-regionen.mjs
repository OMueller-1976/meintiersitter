// Beispiel-Einträge (ist_beispiel=true) für die neuen Regionen. Lokal ausführen:
//   node scripts/seed-beispiele-regionen.mjs [slug ...]     (ohne Argument: alle neuen Regionen)
// Benötigt NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local.
// Die PLZ werden gegen src/lib/data/plz-regionen.json geprüft (Ort muss in der Region liegen).
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const PLZ = JSON.parse(readFileSync('src/lib/data/plz-regionen.json', 'utf8'))

// Je Region: 4 Orte für Gesuche, 2 Orte für Sitter ([Ort, PLZ])
const REGIONEN = {
  trier: { g: [['Trier', '54290'], ['Konz', '54329'], ['Bitburg', '54634'], ['Schweich', '54338']], s: [['Trier', '54290'], ['Kordel', '54306']] },
  ahr: { g: [['Bad Neuenahr-Ahrweiler', '53474'], ['Sinzig', '53489'], ['Remagen', '53424'], ['Neuwied', '56564']], s: [['Altenahr', '53505'], ['Linz am Rhein', '53545']] },
  nahe: { g: [['Bad Kreuznach', '55543'], ['Idar-Oberstein', '55743'], ['Worms', '67547'], ['Alzey', '55232']], s: [['Kirn', '55606'], ['Bad Sobernheim', '55566']] },
  mainz: { g: [['Mainz', '55116'], ['Ingelheim am Rhein', '55218'], ['Bingen am Rhein', '55411'], ['Nieder-Olm', '55268']], s: [['Budenheim', '55257'], ['Oppenheim', '55276']] },
  vorderpfalz: { g: [['Ludwigshafen am Rhein', '67059'], ['Speyer', '67346'], ['Frankenthal', '67227'], ['Bad Dürkheim', '67098']], s: [['Haßloch', '67454'], ['Schifferstadt', '67105']] },
  suedpfalz: { g: [['Landau in der Pfalz', '76829'], ['Neustadt an der Weinstraße', '67433'], ['Germersheim', '76726'], ['Bad Bergzabern', '76887']], s: [['Annweiler am Trifels', '76855'], ['Edenkoben', '67480']] },
  westpfalz: { g: [['Kaiserslautern', '67655'], ['Pirmasens', '66953'], ['Zweibrücken', '66482'], ['Kirchheimbolanden', '67292']], s: [['Kusel', '66869'], ['Landstuhl', '66849']] },
  aachen: { g: [['Aachen', '52062'], ['Düren', '52349'], ['Stolberg', '52222'], ['Eschweiler', '52249']], s: [['Monschau', '52156'], ['Herzogenrath', '52134']] },
  rheinsieg: { g: [['Bonn', '53111'], ['Troisdorf', '53840'], ['Siegburg', '53721'], ['Königswinter', '53639']], s: [['Bad Honnef', '53604'], ['Hennef', '53773']] },
}

const GESUCHE = [
  { name: 'Familie Müller', tier: { name: 'Bella', tierart: 'hund', rasse: 'Labrador Retriever', alter_jahre: 4, foto_url: '/assets/Hund.png', beschreibung: 'Bella ist eine freundliche, verspielte Labradorhündin.' },
    posting: { leistung: 'gassi', nachricht: 'Wir suchen jemanden für die Morgengassi-Runde. Bella zieht nicht an der Leine und versteht sich gut mit anderen Hunden.', uhrzeit_von: '07:00', uhrzeit_bis: '09:00', off: [10, 12] } },
  { name: 'Petra Schmitt', tier: { name: 'Felix', tierart: 'katze', rasse: 'Europäische Kurzhaar', alter_jahre: 6, foto_url: '/assets/Katze.png', beschreibung: 'Felix ist ein ruhiger, verschmuster Kater.' },
    posting: { leistung: 'fuettern', nachricht: 'Wir sind eine Woche im Urlaub und suchen jemanden, der täglich vorbeischaut, füttert und kurz mit Felix spielt.', off: [20, 27] } },
  { name: 'Thomas Weber', tier: { name: 'Sunny', tierart: 'sonstiges', rasse: 'Shetland Pony', alter_jahre: 7, foto_url: '/assets/ponny.png', beschreibung: 'Sunny ist ein zahmes, kinderfreundliches Shetlandpony.' },
    posting: { leistung: 'tagesbetreuung', nachricht: 'Unser Pony braucht an drei Tagen Betreuung: Fütterung morgens und abends, Weide kontrollieren.', off: [30, 32] } },
  { name: 'Sabine Berg', tier: { name: 'Kiko', tierart: 'vogel', rasse: 'Wellensittich', alter_jahre: 3, foto_url: '/assets/vogel.png', beschreibung: 'Kiko ist ein zutraulicher Wellensittich.' },
    posting: { leistung: 'fuettern', nachricht: 'Zweimal täglich füttern, frisches Wasser, kurz mit ihm sprechen.', uhrzeit_von: '08:00', uhrzeit_bis: '18:00', off: [15, 22] } },
]
const SITTER = [
  { name: 'Familie Berger', avatar_url: '/assets/familie.png', bio: 'Familie mit zwei Kindern und Garten, wir hatten selbst viele Jahre Hunde.',
    sitter: { erfahrung_jahre: 10, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: false, betreut_hunde: true, betreut_katzen: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: false, radius_km: 10 } },
  { name: 'Maria Schneider', avatar_url: '/assets/FrauSitter.png', bio: 'Tierarzthelferin, kann auch Medikamente verabreichen.',
    sitter: { erfahrung_jahre: 8, hat_eigene_tiere: true, hat_garten: true, kann_medikamente: true, betreut_hunde: true, betreut_katzen: true, bietet_gassi: true, bietet_fuettern: true, bietet_tagesbetreuung: true, bietet_uebernachtung: true, radius_km: 20 } },
]

function datum(tageAb) {
  const d = new Date(); d.setDate(d.getDate() + tageAb); return d.toISOString().slice(0, 10)
}

async function createUser(email, fullName, role) {
  const { data, error } = await supabase.auth.admin.createUser({ email, password: crypto.randomUUID(), email_confirm: true, user_metadata: { full_name: fullName, role } })
  if (!error) return data.user.id
  if (error.message.includes('already been registered')) {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    return list.users.find((u) => u.email === email)?.id
  }
  console.error('Fehler', email, error.message); return null
}

function pruefePlz(slug, ort, plz) {
  const e = PLZ[plz]
  const ok = typeof e === 'string' ? e === slug : Array.isArray(e) && e.some((x) => x[0] === slug)
  if (!ok) console.warn(`⚠ PLZ ${plz} (${ort}) liegt laut Datensatz nicht in Region ${slug}`)
  return ok
}

async function main() {
  const wanted = process.argv.slice(2)
  for (const [slug, cfg] of Object.entries(REGIONEN)) {
    if (wanted.length && !wanted.includes(slug)) continue
    console.log('🌱', slug)
    for (let i = 0; i < cfg.g.length; i++) {
      const [ort, plz] = cfg.g[i]; const d = GESUCHE[i]
      if (!pruefePlz(slug, ort, plz)) continue
      const email = `beispiel-${slug}-g${i + 1}@meintiersitter.de`
      const id = await createUser(email, d.name, 'tierhalter'); if (!id) continue
      await supabase.from('profiles').upsert({ id, role: 'tierhalter', full_name: d.name, email, ort, plz, region: slug, ist_beispiel: true, subscription_status: 'active' }, { onConflict: 'id' })
      const { data: tier } = await supabase.from('tier_profiles').upsert({ owner_id: id, ...d.tier, ist_beispiel: true, is_active: true }, { onConflict: 'owner_id,name' }).select().single()
      let tierId = tier?.id
      if (!tierId) tierId = (await supabase.from('tier_profiles').select('id').eq('owner_id', id).eq('name', d.tier.name).single()).data?.id
      const { off, ...p } = d.posting
      const { data: vorhanden } = await supabase.from('postings').select('id').eq('tierhalter_id', id).limit(1)
      if (!vorhanden?.length) {
        await supabase.from('postings').insert({ tierhalter_id: id, tier_id: tierId, uhrzeit_von: null, uhrzeit_bis: null, ...p, datum_von: datum(off[0]), datum_bis: datum(off[1]), plz, ort, region: slug, status: 'offen', auf_pinnwand: true, ist_beispiel: true })
      }
      console.log('  ✓ Gesuch', ort)
    }
    for (let i = 0; i < cfg.s.length; i++) {
      const [ort, plz] = cfg.s[i]; const d = SITTER[i]
      if (!pruefePlz(slug, ort, plz)) continue
      const email = `beispiel-${slug}-s${i + 1}@meintiersitter.de`
      const id = await createUser(email, d.name, 'sitter'); if (!id) continue
      await supabase.from('profiles').upsert({ id, role: 'sitter', full_name: d.name, email, ort, plz, region: slug, avatar_url: d.avatar_url, bio: d.bio, ist_beispiel: true, subscription_status: 'inactive' }, { onConflict: 'id' })
      await supabase.from('sitter_profiles').upsert({ id, ...d.sitter }, { onConflict: 'id' })
      console.log('  ✓ Sitter', ort)
    }
  }
  console.log('Fertig')
}
main().catch(console.error)
