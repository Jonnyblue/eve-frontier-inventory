import React, { useState, useMemo } from "react";
import { type Recipe, getRecipesForAssembly } from "./recipes";
import { useItemTypes } from "./useItemTypes";
import { buildNameToTypeIdMap, type ItemType } from "./worldApi";
import { ItemIcon } from "./ItemIcon";

function formatRunTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return parts.join(" ");
}

interface Props {
  assemblyType: Recipe["assemblyType"];
}

export function RecipeList({ assemblyType }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: itemTypes } = useItemTypes();
  const nameToTypeId = useMemo(
    () => (itemTypes ? buildNameToTypeIdMap(itemTypes) : new Map<string, number>()),
    [itemTypes],
  );

  const allRecipes = useMemo(
    () => getRecipesForAssembly(assemblyType),
    [assemblyType],
  );

  const categories = useMemo(() => {
    const cats = new Set(allRecipes.map((r) => r.category));
    return Array.from(cats);
  }, [allRecipes]);

  const filtered = useMemo(() => {
    let list = allRecipes;
    if (selectedCategory) {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.inputs.some((i) => i.name.toLowerCase().includes(q)) ||
          r.outputs.some((o) => o.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [allRecipes, selectedCategory, search]);

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="Search recipes by name or material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <button
          className={`tab ${selectedCategory === null ? "active" : ""}`}
          style={{ fontSize: "0.7rem", padding: "4px 10px" }}
          onClick={() => setSelectedCategory(null)}
        >
          All ({allRecipes.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab ${selectedCategory === cat ? "active" : ""}`}
            style={{ fontSize: "0.7rem", padding: "4px 10px" }}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.85rem",
            padding: "16px 0",
          }}
        >
          No recipes match
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} nameToTypeId={nameToTypeId} itemTypes={itemTypes} />
          ))}
        </div>
      )}
    </div>
  );
}

const monoSm: React.CSSProperties = { fontSize: "0.75rem", fontFamily: "Frontier Disket Mono, monospace" };

function RecipeCard({ recipe, nameToTypeId, itemTypes }: { recipe: Recipe; nameToTypeId: Map<string, number>; itemTypes: Map<number, ItemType> | undefined }) {
  const nameToVolume = useMemo(() => {
    if (!itemTypes) return new Map<string, number>();
    return new Map(Array.from(nameToTypeId.entries()).map(([name, id]) => [name, itemTypes.get(id)?.volume ?? 0]));
  }, [nameToTypeId, itemTypes]);

  const inVol = recipe.inputs.reduce((s, i) => s + (nameToVolume.get(i.name) ?? 0) * i.quantity, 0);
  const outVol = recipe.outputs.reduce((s, i) => s + (nameToVolume.get(i.name) ?? 0) * i.quantity, 0);
  const hasVol = inVol > 0 || outVol > 0;
  const delta = outVol - inVol;

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div>
          <span className="category-badge" style={{ marginRight: "8px" }}>
            {recipe.category}
          </span>
          <span style={{ fontWeight: 400 }}>{recipe.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {hasVol && (
            <span style={{ ...monoSm, color: delta <= 0 ? "var(--color-success)" : "var(--color-warning)" }}>
              {inVol.toLocaleString()} → {outVol.toLocaleString()} m³ ({delta > 0 ? "+" : ""}{delta.toLocaleString()})
            </span>
          )}
          <span style={{ ...monoSm, color: "var(--color-text-muted)" }}>
            {formatRunTime(recipe.runTime)}
          </span>
        </div>
      </div>

      <div className="recipe-flow">
        <div className="recipe-side">
          <div className="recipe-side-label">Input</div>
          {recipe.inputs.map((item, i) => (
            <div key={i} className="recipe-item">
              <ItemIcon typeId={nameToTypeId.get(item.name)} />
              <span>{item.name}</span>
              <span className="recipe-qty">{item.quantity.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="recipe-arrow">→</div>

        <div className="recipe-side">
          <div className="recipe-side-label">Output</div>
          {recipe.outputs.map((item, i) => (
            <div key={i} className="recipe-item">
              <ItemIcon typeId={nameToTypeId.get(item.name)} />
              <span>{item.name}</span>
              <span className="recipe-qty">{item.quantity.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
