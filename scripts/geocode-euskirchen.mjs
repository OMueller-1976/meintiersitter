/**
 * Geocodiert alle Euskirchen-Ortschaften via Nominatim
 * und schreibt das Ergebnis nach src/lib/euskirchen-koordinaten.ts
 *
 * Einhaltung der Nominatim-Nutzungsbedingungen:
 *   - User-Agent gesetzt
 *   - max. 1 Anfrage/Sekunde (1100ms Delay)
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ORTSCHAFTEN = [
  'Euskirchen', 'Bad Münstereifel',
  'Mechernich', 'Schleiden', 'Zülpich', 'Rheinbach',
  'Weilerswist', 'Nettersheim', 'Blankenheim',
  'Kall', 'Hellenthal', 'Dahlem',
];

const USER_AGENT = 'Tiersitti/1.0 (kontakt@tiersitti.de)';
const DELAY_MS = 1100;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocode(ortschaft) {
  const query = encodeURIComponent(`${ortschaft}, Kreis Euskirchen, Nordrhein-Westfalen, Germany`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'de',
    },
  });

  if (!res.ok) {
    console.warn(`[WARN] HTTP ${res.status} für "${ortschaft}"`);
    return null;
  }

  const data = await res.json();
  if (!data || data.length === 0) {
    console.warn(`[WARN] Keine Treffer für "${ortschaft}"`);
    return null;
  }

  const { lat, lon } = data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon) };
}

async function main() {
  const ergebnisse = {};

  for (const ort of ORTSCHAFTEN) {
    process.stdout.write(`Geocoding: ${ort} ... `);
    const coords = await geocode(ort);
    if (coords) {
      ergebnisse[ort] = coords;
      console.log(`lat=${coords.lat.toFixed(4)}, lng=${coords.lng.toFixed(4)}`);
    } else {
      ergebnisse[ort] = null;
      console.log('KEIN TREFFER');
    }
    await sleep(DELAY_MS);
  }

  // TypeScript-Datei generieren
  const lines = Object.entries(ergebnisse).map(([ort, coords]) => {
    if (coords === null) {
      return `  '${ort}': null,`;
    }
    return `  '${ort}': { lat: ${coords.lat}, lng: ${coords.lng} },`;
  });

  const tsContent = `// Automatisch generiert von scripts/geocode-euskirchen.mjs
// Nominatim / OpenStreetMap — © OpenStreetMap contributors, ODbL
// Koordinaten der Ortschaften im Kreis Euskirchen (NRW)

export const EUSKIRCHEN_KOORDINATEN: Record<string, { lat: number; lng: number } | null> = {
${lines.join('\n')}
};
`;

  const outPath = join(__dirname, '..', 'src', 'lib', 'euskirchen-koordinaten.ts');
  writeFileSync(outPath, tsContent, 'utf8');
  console.log(`\nGespeichert: ${outPath}`);

  // Plausibilitäts-Check (BBox Kreis Euskirchen)
  const ungueltig = Object.entries(ergebnisse)
    .filter(([, c]) => c && (c.lat < 50.3 || c.lat > 50.8 || c.lng < 6.4 || c.lng > 7.0))
    .map(([o]) => o);

  if (ungueltig.length > 0) {
    console.warn(`\n[WARN] Verdächtige Koordinaten (außerhalb BBox): ${ungueltig.join(', ')}`);
  } else {
    console.log('[OK] Alle Koordinaten innerhalb des erwarteten Euskirchen-Bereichs.');
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
