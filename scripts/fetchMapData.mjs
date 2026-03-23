/**
 * fetchMapData.mjs
 *
 * Run once per game cycle to regenerate static map data:
 *   node scripts/fetchMapData.mjs
 *
 * Writes:
 *   src/data/systems.json   — all solar systems with normalised coords
 *   src/data/gateLinks.json — deduplicated [minId, maxId] gate link pairs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../src/data");
const WORLD_API = "https://world-api-stillness.live.tech.evefrontier.com";
const CONCURRENCY = 150;

mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Step 1: fetch all solar systems (bulk endpoint, no gate data)
// ---------------------------------------------------------------------------
console.log("Fetching solar systems...");
const allRaw = [];
const LIMIT = 1000;
let total = Infinity;

while (allRaw.length < total) {
  const res = await fetch(`${WORLD_API}/v2/solarsystems?limit=${LIMIT}&offset=${allRaw.length}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching systems`);
  const json = await res.json();
  allRaw.push(...json.data);
  total = json.metadata.total;
  process.stdout.write(`\r  ${allRaw.length} / ${total}`);
}
console.log();

// Normalise coords (uniform scale, centred at origin)
let xMin = Infinity, xMax = -Infinity;
let yMin = Infinity, yMax = -Infinity;
let zMin = Infinity, zMax = -Infinity;
for (const s of allRaw) {
  if (s.location.x < xMin) xMin = s.location.x;
  if (s.location.x > xMax) xMax = s.location.x;
  if (s.location.y < yMin) yMin = s.location.y;
  if (s.location.y > yMax) yMax = s.location.y;
  if (s.location.z < zMin) zMin = s.location.z;
  if (s.location.z > zMax) zMax = s.location.z;
}
const maxRange = Math.max(xMax - xMin, yMax - yMin, zMax - zMin);
const midX = (xMin + xMax) / 2;
const midY = (yMin + yMax) / 2;
const midZ = (zMin + zMax) / 2;

const systems = allRaw.map((s) => ({
  id: s.id,
  name: s.name,
  nx: +((s.location.x - midX) / maxRange).toFixed(6),
  ny: +((s.location.y - midY) / maxRange).toFixed(6),
  nz: +((s.location.z - midZ) / maxRange).toFixed(6),
  regionId: s.regionId,
}));

writeFileSync(join(OUT_DIR, "systems.json"), JSON.stringify(systems));
console.log(`Wrote systems.json (${systems.length} systems)`);

// ---------------------------------------------------------------------------
// Step 2: fetch individual system pages to get gateLinks
// ---------------------------------------------------------------------------
console.log("Fetching gate links (individual system endpoints)...");
const ids = systems.map((s) => s.id);
const seen = new Set();
const gateLinks = [];
let done = 0;

for (let i = 0; i < ids.length; i += CONCURRENCY) {
  const batch = ids.slice(i, i + CONCURRENCY);
  const responses = await Promise.allSettled(
    batch.map((id) =>
      fetch(`${WORLD_API}/v2/solarsystems/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ),
  );
  for (const r of responses) {
    if (r.status === "fulfilled" && r.value?.gateLinks) {
      const fromId = r.value.id;
      for (const gate of r.value.gateLinks) {
        const toId = gate.destination.id;
        const a = Math.min(fromId, toId);
        const b = Math.max(fromId, toId);
        const key = `${a}-${b}`;
        if (!seen.has(key)) {
          seen.add(key);
          gateLinks.push([a, b]);
        }
      }
    }
  }
  done += batch.length;
  process.stdout.write(`\r  ${done} / ${ids.length} systems processed, ${gateLinks.length} links found`);
}
console.log();

writeFileSync(join(OUT_DIR, "gateLinks.json"), JSON.stringify(gateLinks));
console.log(`Wrote gateLinks.json (${gateLinks.length} unique gate links)`);
console.log("Done.");
