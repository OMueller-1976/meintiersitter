/**
 * Geocodiert alle Vulkaneifel-Ortschaften via Nominatim
 * und schreibt das Ergebnis nach src/lib/ortschaft-koordinaten.ts
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
  'Daun', 'Gillenfeld', 'Schalkenmehren',
  'Darscheid', 'Üdersdorf', 'Strohn', 'Mehren',
  'Kirchweiler', 'Brockscheid', 'Gefell',
  'Wallenborn', 'Steineberg',
  'Gerolstein', 'Hillesheim', 'Jünkerath',
  'Stadtkyll', 'Birresborn', 'Pelm', 'Kerpen',
  'Hallschlag', 'Üxheim', 'Walsdorf', 'Wiesbaum',
  'Kelberg', 'Mosbruch', 'Kolverath', 'Gunderath',
];

const USER_AGENT = 'Tiersitti/1.0 (tiersitter@onetitel.de)';
const DELAY_MS = 1100;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function geocode(ortschaft) {
  const query = encodeURIComponent(`${ortschaft}, Vulkaneifel, Rheinland-Pfalz, Germany`);
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

  const tsContent = `// Automatisch generiert von scripts/geocode-ortschaften.mjs
// Nominatim / OpenStreetMap — © OpenStreetMap contributors, ODbL
// Koordinaten der Vulkaneifel-Ortschaften (Landkreis Vulkaneifel)

export const ORTSCHAFT_KOORDINATEN: Record<string, { lat: number; lng: number } | null> = {
${lines.join('\n')}
};
`;

  const outPath = join(__dirname, '..', 'src', 'lib', 'ortschaft-koordinaten.ts');
  writeFileSync(outPath, tsContent, 'utf8');
  console.log(`\nGespeichert: ${outPath}`);

  // Plausibilitäts-Check
  const ungueltig = Object.entries(ergebnisse)
    .filter(([, c]) => c && (c.lat < 49.8 || c.lat > 50.6 || c.lng < 6.2 || c.lng > 7.2))
    .map(([o]) => o);

  if (ungueltig.length > 0) {
    console.warn(`\n[WARN] Verdächtige Koordinaten (außerhalb Vulkaneifel): ${ungueltig.join(', ')}`);
  } else {
    console.log('[OK] Alle Koordinaten innerhalb des erwarteten Vulkaneifel-Bereichs.');
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
