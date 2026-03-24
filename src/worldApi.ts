const WORLD_API_URL =
  import.meta.env.VITE_WORLD_API_URL ||
  "https://world-api-stillness.live.tech.evefrontier.com";

export interface ItemType {
  id: number;
  name: string;
  description: string;
  mass: number;
  radius: number;
  volume: number;
  portionSize: number;
  groupName: string;
  groupId: number;
  categoryName: string;
  categoryId: number;
  iconUrl: string;
}

let cachedTypes: Map<number, ItemType> | null = null;

export async function fetchAllItemTypes(): Promise<Map<number, ItemType>> {
  if (cachedTypes) return cachedTypes;

  const allItems: ItemType[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `${WORLD_API_URL}/v2/types?limit=${limit}&offset=${offset}`,
    );
    const json = await res.json();
    allItems.push(...json.data);

    if (allItems.length >= json.metadata.total) break;
    offset += limit;
  }

  cachedTypes = new Map(allItems.map((t) => [t.id, t]));
  return cachedTypes;
}

export function getItemTypeName(
  types: Map<number, ItemType>,
  typeId: number,
): string {
  return types.get(typeId)?.name ?? `Unknown (#${typeId})`;
}

export function getItemType(
  types: Map<number, ItemType>,
  typeId: number,
): ItemType | undefined {
  return types.get(typeId);
}

export function buildNameToTypeIdMap(
  types: Map<number, ItemType>,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const [id, type] of types) {
    map.set(type.name, id);
  }
  return map;
}
