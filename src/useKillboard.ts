import { useQuery } from "@tanstack/react-query";
import { executeGraphQLQuery } from "@evefrontier/dapp-kit";

const WORLD_PACKAGE_ID =
  import.meta.env.VITE_EVE_WORLD_PACKAGE_ID ||
  "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c";

const WORLD_API_URL =
  import.meta.env.VITE_WORLD_API_URL ||
  "https://world-api-stillness.live.tech.evefrontier.com";

export interface Killmail {
  txDigest: string;
  itemId: number;
  killerId: number;
  victimId: number;
  killTimestamp: number; // ms since epoch
  lossType: "SHIP" | "STRUCTURE";
  solarSystemId: number;
}

const KILLMAILS_QUERY = `
query GetKillmails($cursor: String) {
  objects(
    filter: { type: "${WORLD_PACKAGE_ID}::killmail::Killmail" }
    first: 50
    after: $cursor
  ) {
    nodes {
      address
      asMoveObject {
        contents { json }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
`;

const CHARACTERS_QUERY = `
query GetCharacters($cursor: String) {
  objects(
    filter: { type: "${WORLD_PACKAGE_ID}::character::Character" }
    first: 50
    after: $cursor
  ) {
    nodes {
      asMoveObject {
        contents { json }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
`;

// Cache for solar system names
const solarSystemCache = new Map<number, string>();

async function fetchSolarSystemName(id: number): Promise<string> {
  if (solarSystemCache.has(id)) return solarSystemCache.get(id)!;
  try {
    const res = await fetch(`${WORLD_API_URL}/v2/solarsystems/${id}`);
    if (!res.ok) throw new Error("not found");
    const json = await res.json();
    const name: string = json.name ?? `System #${id}`;
    solarSystemCache.set(id, name);
    return name;
  } catch {
    const fallback = `System #${id}`;
    solarSystemCache.set(id, fallback);
    return fallback;
  }
}

async function fetchAllKillmails(): Promise<Killmail[]> {
  const kills: Killmail[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const res: any = await executeGraphQLQuery(KILLMAILS_QUERY, {
      cursor: cursor ?? null,
    });
    const objs = res.data?.objects;
    if (!objs) break;

    for (const node of objs.nodes ?? []) {
      const j = node.asMoveObject?.contents?.json;
      if (!j) continue;
      const lossVariant = j.loss_type?.["@variant"] ?? j.loss_type;
      kills.push({
        txDigest: node.address ?? "",
        itemId: Number(j.key?.item_id ?? 0),
        killerId: Number(j.killer_id?.item_id ?? 0),
        victimId: Number(j.victim_id?.item_id ?? 0),
        killTimestamp: Number(j.kill_timestamp ?? 0) * 1000,
        lossType: lossVariant === "STRUCTURE" ? "STRUCTURE" : "SHIP",
        solarSystemId: Number(j.solar_system_id?.item_id ?? 0),
      });
    }

    hasMore = objs.pageInfo?.hasNextPage ?? false;
    cursor = objs.pageInfo?.endCursor ?? undefined;
    if (!cursor) break;
  }

  // Sort newest first
  kills.sort((a, b) => b.killTimestamp - a.killTimestamp);
  return kills;
}

async function fetchCharacterNames(): Promise<Map<number, string>> {
  const names = new Map<number, string>();
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const res: any = await executeGraphQLQuery(CHARACTERS_QUERY, {
      cursor: cursor ?? null,
    });
    const objs = res.data?.objects;
    if (!objs) break;

    for (const node of objs.nodes ?? []) {
      const j = node.asMoveObject?.contents?.json;
      if (!j) continue;
      const itemId = Number(j.key?.item_id ?? 0);
      const name: string = j.metadata?.name ?? "";
      if (itemId && name) names.set(itemId, name);
    }

    hasMore = objs.pageInfo?.hasNextPage ?? false;
    cursor = objs.pageInfo?.endCursor ?? undefined;
    if (!cursor) break;
  }

  return names;
}

export interface KillboardEntry extends Killmail {
  killerName: string;
  victimName: string;
  solarSystemName: string;
}

async function fetchKillboard(): Promise<KillboardEntry[]> {
  const [kills, charNames] = await Promise.all([
    fetchAllKillmails(),
    fetchCharacterNames(),
  ]);

  // Collect unique solar system IDs
  const solarSystemIds = [...new Set(kills.map((k) => k.solarSystemId).filter(Boolean))];
  await Promise.all(solarSystemIds.map((id) => fetchSolarSystemName(id)));

  return kills.map((k) => ({
    ...k,
    killerName: charNames.get(k.killerId) ?? `#${k.killerId}`,
    victimName: charNames.get(k.victimId) ?? `#${k.victimId}`,
    solarSystemName: solarSystemCache.get(k.solarSystemId) ?? `#${k.solarSystemId}`,
  }));
}

export function useKillboard() {
  return useQuery({
    queryKey: ["killboard"],
    queryFn: fetchKillboard,
    staleTime: 5 * 60_000, // 5 minutes
  });
}
