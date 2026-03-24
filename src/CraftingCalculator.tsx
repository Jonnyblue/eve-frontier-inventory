import { useState, useMemo } from "react";
import type { ManualItem } from "./ManualInventory";
import type { AssemblyData } from "./useInventory";
import type { ItemType } from "./worldApi";
import { buildNameToTypeIdMap } from "./worldApi";
import type { Recipe } from "./recipes";
import { ItemIcon } from "./ItemIcon";
import {
  buildRecipeIndex,
  getCraftableOutputs,
  resolveProductionTree,
  flattenToRawMaterials,
  flattenAllMaterials,
  mergeInventories,
  type ProductionNode,
  type MaterialSummary,
} from "./craftingEngine";

interface Props {
  manualItems: ManualItem[];
  ssuItems?: AssemblyData[];
  itemTypes?: Map<number, ItemType>;
}

export function CraftingCalculator({
  manualItems,
  ssuItems,
  itemTypes,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [showDropdown, setShowDropdown] = useState(false);
  const [view, setView] = useState<"raw" | "all" | "tree">("raw");
  // User recipe overrides: material name -> recipe id
  const [recipeOverrides, setRecipeOverrides] = useState<Map<string, string>>(
    new Map(),
  );

  const craftableOutputs = useMemo(() => getCraftableOutputs(), []);
  const recipeIndex = useMemo(() => buildRecipeIndex(), []);
  const nameToTypeId = useMemo(
    () => (itemTypes ? buildNameToTypeIdMap(itemTypes) : new Map<string, number>()),
    [itemTypes],
  );

  const filteredOutputs = useMemo(() => {
    if (!search) return craftableOutputs.slice(0, 30);
    const q = search.toLowerCase();
    return craftableOutputs.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.recipe.category.toLowerCase().includes(q),
    );
  }, [craftableOutputs, search]);

  // Merge all inventory sources
  const allSsuItems = useMemo(() => {
    if (!ssuItems) return [];
    return ssuItems.flatMap((ssu) => ssu.items);
  }, [ssuItems]);

  const { tree, rawMaterials, allMaterials } = useMemo(() => {
    if (!selectedItem) return { tree: null, rawMaterials: [], allMaterials: [] };

    const inventory = mergeInventories(manualItems, allSsuItems, itemTypes);
    const tree = resolveProductionTree(
      selectedItem,
      quantity,
      inventory,
      recipeIndex,
      recipeOverrides,
    );
    const rawMaterials = flattenToRawMaterials(tree);
    const allMaterials = flattenAllMaterials(tree);

    return { tree, rawMaterials, allMaterials };
  }, [selectedItem, quantity, manualItems, allSsuItems, itemTypes, recipeIndex, recipeOverrides]);

  const handleSelect = (name: string) => {
    setSelectedItem(name);
    setSearch(name);
    setShowDropdown(false);
  };

  return (
    <div>
      {/* Item picker */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            className="search-input"
            style={{ marginBottom: 0, flex: 1 }}
            placeholder="Search for something to build..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setSelectedItem(null);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
              }}
            >
              Qty:
            </span>
            <input
              type="number"
              className="search-input"
              style={{
                width: "80px",
                marginBottom: 0,
                textAlign: "center",
              }}
              min={1}
              value={quantityInput}
              onChange={(e) => {
                setQuantityInput(e.target.value);
                const n = parseInt(e.target.value);
                if (!isNaN(n) && n >= 1) setQuantity(n);
              }}
              onBlur={() => {
                const n = parseInt(quantityInput);
                if (isNaN(n) || n < 1) { setQuantityInput("1"); setQuantity(1); }
                else setQuantityInput(String(n));
              }}
            />
          </div>
        </div>

        {showDropdown && !selectedItem && search && (
          <div className="dropdown">
            {filteredOutputs.length === 0 ? (
              <div className="dropdown-item" style={{ color: "var(--color-text-muted)" }}>
                No craftable items found
              </div>
            ) : (
              filteredOutputs.map((o) => (
                <div
                  key={o.name}
                  className="dropdown-item"
                  onClick={() => handleSelect(o.name)}
                >
                  <ItemIcon typeId={nameToTypeId.get(o.name)} />
                  <span>{o.name}</span>
                  <span
                    className="category-badge"
                    style={{ marginLeft: "8px" }}
                  >
                    {o.recipe.category}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {tree && selectedItem && (
        <div>
          {/* Direct recipe */}
          {tree.recipe && (
            <div className="ssu-card" style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ItemIcon typeId={nameToTypeId.get(selectedItem)} size={24} />
                  <span style={{ fontWeight: 400, fontSize: "1.1rem" }}>
                    {selectedItem}
                  </span>
                  <span className="category-badge" style={{ marginLeft: "8px" }}>
                    {tree.recipe.category}
                  </span>
                  <span className="category-badge" style={{ marginLeft: "4px" }}>
                    {tree.assemblyType?.replace(/_/g, " ")}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    fontFamily: "Frontier Disket Mono, monospace",
                  }}
                >
                  {tree.batchesNeeded} batch{tree.batchesNeeded !== 1 ? "es" : ""}
                  {(() => {
                    const outputQty = tree.recipe!.outputs.find(o => o.name === selectedItem)?.quantity ?? 1;
                    const total = tree.batchesNeeded * outputQty;
                    return outputQty > 1
                      ? ` → ${total} ${selectedItem} (${outputQty}/batch)`
                      : ` → ${total} ${selectedItem}`;
                  })()}
                </span>
              </div>

              {/* Direct inputs status */}
              <table className="item-table">
                <thead>
                  <tr>
                    <th>Input</th>
                    <th style={{ textAlign: "right" }}>Need</th>
                    <th style={{ textAlign: "right" }}>Have</th>
                    <th style={{ textAlign: "right" }}>Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {tree.children.map((child) => (
                    <tr key={child.name}>
                      <td>{child.name}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Frontier Disket Mono, monospace",
                        }}
                      >
                        {child.quantityNeeded.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Frontier Disket Mono, monospace",
                          color:
                            child.quantityOwned >= child.quantityNeeded
                              ? "var(--color-accent)"
                              : "var(--color-text)",
                        }}
                      >
                        {child.quantityOwned.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Frontier Disket Mono, monospace",
                          color:
                            child.quantityToCraft > 0 ? "#ef4444" : "var(--color-accent)",
                        }}
                      >
                        {child.quantityToCraft > 0
                          ? `-${child.quantityToCraft.toLocaleString()}`
                          : "OK"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* View tabs */}
          <div className="tab-bar" style={{ marginBottom: "16px" }}>
            <button
              className={`tab ${view === "raw" ? "active" : ""}`}
              onClick={() => setView("raw")}
            >
              Raw Materials Needed
            </button>
            <button
              className={`tab ${view === "all" ? "active" : ""}`}
              onClick={() => setView("all")}
            >
              All Materials
            </button>
            <button
              className={`tab ${view === "tree" ? "active" : ""}`}
              onClick={() => setView("tree")}
            >
              Production Tree
            </button>
          </div>

          {view === "raw" && (
            <MaterialTable
              materials={rawMaterials}
              title="Raw materials to gather/mine"
              nameToTypeId={nameToTypeId}
            />
          )}

          {view === "all" && (
            <MaterialTable
              materials={allMaterials}
              title="All materials (intermediate + raw)"
              nameToTypeId={nameToTypeId}
            />
          )}

          {view === "tree" && (
            <TreeView
              node={tree}
              depth={0}
              nameToTypeId={nameToTypeId}
              onOverride={(name, recipeId) => {
                const next = new Map(recipeOverrides);
                next.set(name, recipeId);
                setRecipeOverrides(next);
              }}
            />
          )}
        </div>
      )}

      {!selectedItem && (
        <div className="empty-state">
          <p>Select an item to see what you need to build it</p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              marginTop: "8px",
            }}
          >
            The calculator will check your pasted inventory and on-chain
            storage, then show what raw materials you still need
          </p>
        </div>
      )}
    </div>
  );
}

function MaterialTable({
  materials,
  title,
  nameToTypeId,
}: {
  materials: MaterialSummary[];
  title: string;
  nameToTypeId: Map<string, number>;
}) {
  if (materials.length === 0) {
    return (
      <div
        style={{
          color: "var(--color-accent)",
          textAlign: "center",
          padding: "24px",
        }}
      >
        You have everything you need!
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      <div className="all-items-table">
        <table className="item-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Need</th>
              <th style={{ textAlign: "right" }}>Have</th>
              <th style={{ textAlign: "right" }}>Deficit</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.name}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ItemIcon typeId={nameToTypeId.get(m.name)} />
                    {m.name}
                  </div>
                </td>
                <td>
                  <span className="category-badge">
                    {m.isRaw ? "raw" : "crafted"}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: "Frontier Disket Mono, monospace",
                  }}
                >
                  {m.totalNeeded.toLocaleString()}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: "Frontier Disket Mono, monospace",
                    color:
                      m.totalOwned >= m.totalNeeded
                        ? "var(--color-accent)"
                        : "var(--color-text)",
                  }}
                >
                  {m.totalOwned.toLocaleString()}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: "Frontier Disket Mono, monospace",
                    color: m.deficit > 0 ? "#ef4444" : "var(--color-accent)",
                  }}
                >
                  {m.deficit > 0
                    ? `-${m.deficit.toLocaleString()}`
                    : "OK"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TreeView({
  node,
  depth,
  nameToTypeId,
  onOverride,
}: {
  node: ProductionNode;
  depth: number;
  nameToTypeId: Map<string, number>;
  onOverride: (name: string, recipeId: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showAlts, setShowAlts] = useState(false);
  const hasChildren = node.children.length > 0;
  const hasAlts = node.alternativeRecipes.length > 0;
  const indent = depth * 20;

  return (
    <div>
      <div
        className="tree-row"
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flex: 1,
          }}
        >
          {hasChildren && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--color-text-muted)",
                width: "12px",
              }}
            >
              {expanded ? "▼" : "▶"}
            </span>
          )}
          {!hasChildren && <span style={{ width: "12px" }} />}
          <ItemIcon typeId={nameToTypeId.get(node.name)} size={16} />
          <span style={{ fontWeight: depth === 0 ? 400 : 300 }}>
            {node.name}
          </span>
          {node.assemblyType && (
            <span
              className="category-badge"
              style={{ fontSize: "0.6rem", padding: "1px 5px" }}
            >
              {node.assemblyType.replace(/_/g, " ")}
            </span>
          )}
          {hasAlts && node.quantityToCraft > 0 && (
            <button
              className="alt-recipe-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAlts(!showAlts);
              }}
              title="Switch recipe"
            >
              {node.alternativeRecipes.length + 1} recipes
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "0.85rem",
            fontFamily: "Frontier Disket Mono, monospace",
          }}
        >
          <span
            style={{
              color: "var(--color-text-muted)",
              width: "80px",
              textAlign: "right",
            }}
          >
            {node.quantityNeeded.toLocaleString()}
          </span>
          <span
            style={{
              width: "80px",
              textAlign: "right",
              color:
                node.quantityToCraft > 0 ? "#ef4444" : "var(--color-accent)",
            }}
          >
            {node.quantityToCraft > 0
              ? `-${node.quantityToCraft.toLocaleString()}`
              : "OK"}
          </span>
        </div>
      </div>

      {/* Alternative recipes picker */}
      {showAlts && (
        <div
          style={{
            paddingLeft: `${indent + 32}px`,
            paddingBottom: "8px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              marginBottom: "4px",
              marginTop: "4px",
            }}
          >
            Choose recipe for {node.name}:
          </div>
          {[node.recipe, ...node.alternativeRecipes]
            .filter((r): r is Recipe => r !== null)
            .map((r) => (
              <div
                key={r.id}
                className="alt-recipe-option"
                style={{
                  borderColor:
                    r === node.recipe
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOverride(node.name, r.id);
                  setShowAlts(false);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <span className="category-badge" style={{ marginRight: "6px", fontSize: "0.6rem" }}>
                      {r.assemblyType.replace(/_/g, " ")}
                    </span>
                    {r.name}
                  </span>
                  {r === node.recipe && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--color-accent)",
                      }}
                    >
                      selected
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {r.inputs.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                </div>
              </div>
            ))}
        </div>
      )}

      {expanded &&
        node.children.map((child, i) => (
          <TreeView
            key={`${child.name}-${i}`}
            node={child}
            depth={depth + 1}
            nameToTypeId={nameToTypeId}
            onOverride={onOverride}
          />
        ))}
    </div>
  );
}
