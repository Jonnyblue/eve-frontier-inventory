import { recipes, type Recipe } from "./recipes";
import type { ManualItem } from "./ManualInventory";
import type { ItemType } from "./worldApi";

export interface ProductionNode {
  name: string;
  quantityNeeded: number;
  quantityOwned: number;
  quantityToCraft: number;
  recipe: Recipe | null;
  alternativeRecipes: Recipe[];
  batchesNeeded: number;
  assemblyType: Recipe["assemblyType"] | null;
  children: ProductionNode[];
}

export interface MaterialSummary {
  name: string;
  totalNeeded: number;
  totalOwned: number;
  deficit: number;
  isRaw: boolean;
}

// Maps output name -> all recipes that produce it
type RecipeIndex = Map<string, Recipe[]>;

// Priority for recipe selection: prefer dedicated crafting over refinery byproducts
const ASSEMBLY_PRIORITY: Record<string, number> = {
  mini_printer: 0,  // best — dedicated crafting
  assembler: 1,
  mini_berth: 2,
  refinery: 3,      // worst — often a byproduct
};

function pickBestRecipe(
  itemName: string,
  allRecipes: Recipe[],
  overrides: Map<string, string>,
): Recipe {
  // Check user override first
  const overrideId = overrides.get(itemName);
  if (overrideId) {
    const found = allRecipes.find((r) => r.id === overrideId);
    if (found) return found;
  }

  // Prefer the recipe that yields the MOST of the target item per run,
  // then break ties by assembly type priority (dedicated machines over refineries)
  return allRecipes.slice().sort((a, b) => {
    const aQty = a.outputs.find((o) => o.name === itemName)?.quantity ?? 0;
    const bQty = b.outputs.find((o) => o.name === itemName)?.quantity ?? 0;
    if (bQty !== aQty) return bQty - aQty; // more output = better

    const aPri = ASSEMBLY_PRIORITY[a.assemblyType] ?? 99;
    const bPri = ASSEMBLY_PRIORITY[b.assemblyType] ?? 99;
    return aPri - bPri;
  })[0];
}

export function buildRecipeIndex(): RecipeIndex {
  const index: RecipeIndex = new Map();
  for (const recipe of recipes) {
    for (const output of recipe.outputs) {
      const existing = index.get(output.name);
      if (existing) {
        existing.push(recipe);
      } else {
        index.set(output.name, [recipe]);
      }
    }
  }
  return index;
}

export function getCraftableOutputs(): { name: string; recipe: Recipe }[] {
  const seen = new Set<string>();
  const results: { name: string; recipe: Recipe }[] = [];
  for (const recipe of recipes) {
    for (const output of recipe.outputs) {
      if (!seen.has(output.name)) {
        seen.add(output.name);
        results.push({ name: output.name, recipe });
      }
    }
  }
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAlternativeRecipes(
  itemName: string,
  index: RecipeIndex,
): Recipe[] {
  return index.get(itemName) ?? [];
}

export function resolveProductionTree(
  targetName: string,
  quantity: number,
  inventory: Map<string, number>,
  index: RecipeIndex,
  overrides?: Map<string, string>,
  visited?: Set<string>,
): ProductionNode {
  const _visited = visited ?? new Set<string>();
  const _overrides = overrides ?? new Map<string, string>();

  const owned = inventory.get(targetName.toLowerCase()) ?? 0;
  const toCraft = Math.max(0, quantity - owned);

  // Consume from inventory
  if (owned > 0) {
    const consumed = Math.min(owned, quantity);
    inventory.set(targetName.toLowerCase(), owned - consumed);
  }

  const allRecipes = index.get(targetName) ?? [];
  const recipe =
    allRecipes.length > 0
      ? pickBestRecipe(targetName, allRecipes, _overrides)
      : null;
  const alternativeRecipes = allRecipes.filter((r) => r !== recipe);

  // Raw material, fully owned, or circular reference
  if (!recipe || toCraft === 0 || _visited.has(targetName)) {
    return {
      name: targetName,
      quantityNeeded: quantity,
      quantityOwned: Math.min(owned, quantity),
      quantityToCraft: toCraft,
      recipe: null,
      alternativeRecipes,
      batchesNeeded: 0,
      assemblyType: null,
      children: [],
    };
  }

  _visited.add(targetName);

  const outputEntry = recipe.outputs.find((o) => o.name === targetName);
  const outputPerBatch = outputEntry?.quantity ?? 1;
  const batches = Math.ceil(toCraft / outputPerBatch);

  const children: ProductionNode[] = [];
  for (const input of recipe.inputs) {
    const inputNeeded = input.quantity * batches;
    const child = resolveProductionTree(
      input.name,
      inputNeeded,
      inventory,
      index,
      _overrides,
      new Set(_visited),
    );
    children.push(child);
  }

  return {
    name: targetName,
    quantityNeeded: quantity,
    quantityOwned: Math.min(owned, quantity),
    quantityToCraft: toCraft,
    recipe,
    alternativeRecipes,
    batchesNeeded: batches,
    assemblyType: recipe.assemblyType,
    children,
  };
}

export function flattenToRawMaterials(
  tree: ProductionNode,
): MaterialSummary[] {
  const raw = new Map<string, MaterialSummary>();
  const index = buildRecipeIndex();

  function walk(node: ProductionNode) {
    // A material is truly "raw" if no recipe in the game produces it
    const isRaw = !index.has(node.name);

    if (isRaw && node.quantityToCraft > 0) {
      const key = node.name;
      const existing = raw.get(key);
      if (existing) {
        existing.totalNeeded += node.quantityNeeded;
        existing.totalOwned += node.quantityOwned;
        existing.deficit += node.quantityToCraft;
      } else {
        raw.set(key, {
          name: node.name,
          totalNeeded: node.quantityNeeded,
          totalOwned: node.quantityOwned,
          deficit: node.quantityToCraft,
          isRaw: true,
        });
      }
    }

    for (const child of node.children) {
      walk(child);
    }
  }

  walk(tree);
  return Array.from(raw.values()).sort((a, b) => b.deficit - a.deficit);
}

export function flattenAllMaterials(
  tree: ProductionNode,
): MaterialSummary[] {
  const all = new Map<string, MaterialSummary>();
  const index = buildRecipeIndex();

  function walk(node: ProductionNode) {
    if (node.quantityNeeded > 0) {
      const key = node.name;
      const isRaw = !index.has(node.name);
      const existing = all.get(key);
      if (existing) {
        existing.totalNeeded += node.quantityNeeded;
        existing.totalOwned += node.quantityOwned;
        existing.deficit += node.quantityToCraft;
      } else {
        all.set(key, {
          name: node.name,
          totalNeeded: node.quantityNeeded,
          totalOwned: node.quantityOwned,
          deficit: node.quantityToCraft,
          isRaw,
        });
      }
    }

    for (const child of node.children) {
      walk(child);
    }
  }

  for (const child of tree.children) {
    walk(child);
  }

  return Array.from(all.values()).sort((a, b) => {
    if (a.isRaw !== b.isRaw) return a.isRaw ? -1 : 1;
    return b.deficit - a.deficit;
  });
}

export function mergeInventories(
  manual: ManualItem[],
  ssuItems?: { typeId: number; quantity: number }[],
  itemTypes?: Map<number, ItemType>,
): Map<string, number> {
  const merged = new Map<string, number>();

  for (const item of manual) {
    const key = item.name.toLowerCase();
    merged.set(key, (merged.get(key) ?? 0) + item.quantity);
  }

  if (ssuItems && itemTypes) {
    for (const item of ssuItems) {
      const typeInfo = itemTypes.get(item.typeId);
      if (typeInfo) {
        const key = typeInfo.name.toLowerCase();
        merged.set(key, (merged.get(key) ?? 0) + item.quantity);
      }
    }
  }

  return merged;
}
