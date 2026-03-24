import { useQuery } from "@tanstack/react-query";
import { executeGraphQLQuery } from "@evefrontier/dapp-kit";

const WORLD_PACKAGE_ID =
  import.meta.env.VITE_EVE_WORLD_PACKAGE_ID ||
  "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c";

export interface InventoryItem {
  tenant: string;
  typeId: number;
  itemId: number;
  volume: number;
  quantity: number;
}

export interface AssemblyData {
  id: string;
  itemId: number;
  kind: string; // "StorageUnit" | "NetworkNode" | "Assembly" etc.
  name: string;
  typeId: number;
  statusOnline: boolean;
  ownerCapId: string;
  energySourceId: string;
  locationHash: string;
  solarSystemId: number;
  // SSU-specific
  maxCapacity: number;
  usedCapacity: number;
  items: InventoryItem[];
  // NetworkNode-specific
  connectedAssemblyIds: string[];
  fuel?: {
    quantity: number;
    maxCapacity: number;
    burnRate: number;
    isBurning: boolean;
    typeId: number;
  };
  energySource?: {
    maxProduction: number;
    currentProduction: number;
    totalReserved: number;
  };
}

const OBJECT_QUERY = `
query GetObject($id: SuiAddress!) {
  object(address: $id) {
    asMoveObject {
      contents {
        type { repr }
        json
      }
      dynamicFields(first: 50) {
        nodes {
          name { json type { repr } }
          value {
            ... on MoveValue { json type { repr } }
            ... on MoveObject {
              address
              contents { type { repr } json }
            }
          }
        }
      }
    }
  }
}
`;

const OWNED_OBJECTS_QUERY = `
query GetOwnedObjects($owner: SuiAddress!, $type: String, $cursor: String) {
  address(address: $owner) {
    objects(
      filter: { type: $type }
      first: 50
      after: $cursor
    ) {
      nodes {
        address
        contents { type { repr } json }
        dynamicFields(first: 50) {
          nodes {
            name { json type { repr } }
            value {
              ... on MoveValue { json type { repr } }
              ... on MoveObject {
                address
                contents { type { repr } json }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
`;

const ALL_OWNED_OBJECTS_QUERY = `
query GetAllOwnedObjects($owner: SuiAddress!) {
  address(address: $owner) {
    objects(first: 50) {
      nodes {
        address
        contents { type { repr } json }
      }
    }
  }
}
`;

function parseAssembly(
  id: string,
  typeRepr: string,
  json: any,
  dynamicFields: any[],
): AssemblyData {
  const kind = typeRepr.split("::").pop() ?? "Unknown";

  // Parse all inventories from dynamic fields (SSUs can have main + owner inventories)
  const inventories: any[] = [];
  let totalMaxCapacity = 0;
  let totalUsedCapacity = 0;
  for (const df of dynamicFields) {
    const val = df.value?.json;
    if (val && val.items !== undefined && val.max_capacity !== undefined) {
      inventories.push(val);
      totalMaxCapacity += Number(val.max_capacity ?? 0);
      totalUsedCapacity += Number(val.used_capacity ?? 0);
    }
  }

  const items: InventoryItem[] = [];
  for (const inventory of inventories) {
    const entries = Array.isArray(inventory.items)
      ? inventory.items
      : inventory.items.contents ?? [];
    for (const entry of entries) {
      const val = entry.value ?? entry;
      const typeId = Number(val.type_id ?? 0);
      // Merge with existing entry of same type
      const existing = items.find((i) => i.typeId === typeId);
      if (existing) {
        existing.quantity += Number(val.quantity ?? 0);
      } else {
        items.push({
          tenant: val.tenant ?? "",
          typeId,
          itemId: Number(val.item_id ?? 0),
          volume: Number(val.volume ?? 0),
          quantity: Number(val.quantity ?? 0),
        });
      }
    }
  }

  return {
    id,
    itemId: Number(json.key?.item_id ?? 0),
    kind,
    name: json.metadata?.name || "",
    typeId: Number(json.type_id ?? 0),
    statusOnline: json.status?.status?.["@variant"] === "ONLINE",
    ownerCapId: json.owner_cap_id ?? "",
    energySourceId: json.energy_source_id ?? "",
    solarSystemId: Number(json.location?.solar_system_id?.item_id ?? 0),
    locationHash: json.location?.location_hash ?? "",
    maxCapacity: totalMaxCapacity,
    usedCapacity: totalUsedCapacity,
    items,
    connectedAssemblyIds: json.connected_assembly_ids ?? [],
    fuel: json.fuel
      ? {
          quantity: Number(json.fuel.quantity ?? 0),
          maxCapacity: Number(json.fuel.max_capacity ?? 0),
          burnRate: Number(json.fuel.burn_rate_in_ms ?? 0),
          isBurning: json.fuel.is_burning ?? false,
          typeId: Number(json.fuel.type_id ?? 0),
        }
      : undefined,
    energySource: json.energy_source
      ? {
          maxProduction: Number(json.energy_source.max_energy_production ?? 0),
          currentProduction: Number(
            json.energy_source.current_energy_production ?? 0,
          ),
          totalReserved: Number(
            json.energy_source.total_reserved_energy ?? 0,
          ),
        }
      : undefined,
  };
}

async function fetchObjectById(objectId: string): Promise<AssemblyData | null> {
  const res: any = await executeGraphQLQuery(OBJECT_QUERY, { id: objectId });
  const obj = res.data?.object?.asMoveObject;
  if (!obj) return null;

  const typeRepr = obj.contents?.type?.repr ?? "";
  const json = obj.contents?.json ?? {};
  const dfs = obj.dynamicFields?.nodes ?? [];

  return parseAssembly(objectId, typeRepr, json, dfs);
}

async function fetchConnectedAssemblies(
  ids: string[],
): Promise<AssemblyData[]> {
  const results: AssemblyData[] = [];
  // Fetch in parallel, batches of 6
  const promises = ids.map((id) => fetchObjectById(id));
  const resolved = await Promise.all(promises);
  for (const r of resolved) {
    if (r) results.push(r);
  }
  return results;
}

export async function fetchPlayerAssemblies(
  walletAddress: string,
): Promise<{ hubs: AssemblyData[]; connected: AssemblyData[] }> {
  // Step 1: wallet → PlayerProfile → character_id
  const profileType = `${WORLD_PACKAGE_ID}::character::PlayerProfile`;
  const profileRes: any = await executeGraphQLQuery(OWNED_OBJECTS_QUERY, {
    owner: walletAddress,
    type: profileType,
  });

  const profileNodes = profileRes.data?.address?.objects?.nodes ?? [];
  if (profileNodes.length === 0) return { hubs: [], connected: [] };

  const characterId = profileNodes[0].contents?.json?.character_id;
  if (!characterId) return { hubs: [], connected: [] };

  // Step 2: character → all OwnerCaps → find NetworkNode IDs
  const capsRes: any = await executeGraphQLQuery(ALL_OWNED_OBJECTS_QUERY, {
    owner: characterId,
  });

  const capNodes = capsRes.data?.address?.objects?.nodes ?? [];
  const networkNodeIds: string[] = capNodes
    .filter((n: any) => n.contents?.type?.repr?.includes("network_node"))
    .map((n: any) => n.contents?.json?.authorized_object_id)
    .filter(Boolean);

  if (networkNodeIds.length === 0) return { hubs: [], connected: [] };

  // Step 3: fetch each NetworkNode hub + its connected assemblies
  const results = await Promise.all(
    networkNodeIds.map((id) => fetchHubAndConnected(id)),
  );

  const hubs = results.map((r) => r.hub).filter(Boolean) as AssemblyData[];
  const connected = results.flatMap((r) => r.connected);

  return { hubs, connected };
}

export function usePlayerHubs(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["playerHubs", walletAddress],
    queryFn: () => fetchPlayerAssemblies(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 30_000,
  });
}

export async function fetchHubAndConnected(
  hubId: string,
): Promise<{
  hub: AssemblyData | null;
  connected: AssemblyData[];
}> {
  const hub = await fetchObjectById(hubId);
  if (!hub) return { hub: null, connected: [] };

  const connected = await fetchConnectedAssemblies(hub.connectedAssemblyIds);
  return { hub, connected };
}

export function useHubInventory(hubId: string | undefined) {
  return useQuery({
    queryKey: ["hub", hubId],
    queryFn: () => fetchHubAndConnected(hubId!),
    enabled: !!hubId,
    staleTime: 30_000,
  });
}

export function useAssembly(objectId: string | undefined) {
  return useQuery({
    queryKey: ["assembly", objectId],
    queryFn: () => fetchObjectById(objectId!),
    enabled: !!objectId,
    staleTime: 30_000,
  });
}
