/**
 * audit-cleanup.mjs
 * Löscht alle Auth-User mit E-Mail *@tiersitti-audit.de.
 * Kaskadiert automatisch auf profiles, tier_profiles, sitter_profiles,
 * postings, matches, bewertungen (ON DELETE CASCADE).
 *
 * NUR ausführen nach expliziter Freigabe:
 *   node scripts/audit-cleanup.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

async function main() {
  console.log('🔍 Suche Audit-User (@tiersitti-audit.de)…');

  // Alle User paginiert laden und nach Domain filtern
  let page = 1;
  const perPage = 1000;
  const toDelete = [];

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) { console.error('listUsers Fehler:', error.message); break; }
    const users = data?.users ?? [];
    const matches = users.filter(u => u.email?.endsWith('@tiersitti-audit.de'));
    toDelete.push(...matches);
    if (users.length < perPage) break;
    page++;
  }

  if (toDelete.length === 0) {
    console.log('ℹ️  Keine Audit-User gefunden.');
    return;
  }

  console.log(`🗑️  ${toDelete.length} User gefunden — werden gelöscht:\n`);
  toDelete.forEach(u => console.log(`   ${u.email} (${u.id})`));
  console.log('');

  for (const u of toDelete) {
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    if (error) {
      console.error(`  ✗ ${u.email}: ${error.message}`);
    } else {
      console.log(`  ✓ ${u.email} gelöscht`);
    }
  }

  console.log('\n✅ Cleanup abgeschlossen.');
}

main().catch(console.error);
