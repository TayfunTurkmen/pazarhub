/**
 * Regenerates public/data/turkey-locations.json
 * Requires: npm i -D turkey-neighbourhoods
 * Usage: node scripts/generate-turkey-locations.mjs
 */
import { writeFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tn = require('turkey-neighbourhoods');

const cities = tn.getCities();
const tree = cities.map((c) => {
  const districts = tn.getDistrictsAndNeighbourhoodsByCityCode(c.code);
  return {
    id: c.code,
    name: c.name,
    districts: Object.entries(districts)
      .sort((a, b) => a[0].localeCompare(b[0], 'tr'))
      .map(([name, neighs]) => ({
        name,
        neighborhoods: [...neighs]
          .map((n) => n.replace(/\s+Mah\.?$/i, '').trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'tr')),
      })),
  };
});

const out = 'public/data/turkey-locations.json';
writeFileSync(out, JSON.stringify(tree));
console.log(
  `Wrote ${tree.length} cities → ${out} (${(statSync(out).size / 1024 / 1024).toFixed(2)} MB)`,
);
