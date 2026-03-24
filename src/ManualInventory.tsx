import { useState, useMemo, useCallback } from "react";
import type { ItemType } from "./worldApi";

export interface ManualItem {
  name: string;
  quantity: number;
}

type SortKey = "name" | "quantity" | "volume";
type SortDir = "asc" | "desc";

const STORAGE_KEY = "eve-frontier-manual-inventory";

function loadSaved(): ManualItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveItems(items: ManualItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useManualInventory() {
  const [items, setItems] = useState<ManualItem[]>(loadSaved);

  const updateItems = useCallback((newItems: ManualItem[]) => {
    setItems(newItems);
    saveItems(newItems);
  }, []);

  return { items, updateItems };
}

export function parseInventoryText(text: string): ManualItem[] {
  const merged = new Map<string, number>();

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match: item name (with possible spaces/parens/dashes), then whitespace, then number
    const match = trimmed.match(/^(.+?)\s{2,}(\d[\d,]*)$/);
    if (match) {
      const name = match[1].trim();
      const qty = parseInt(match[2].replace(/,/g, ""), 10);
      if (name && qty > 0) {
        merged.set(name, (merged.get(name) ?? 0) + qty);
      }
    } else {
      // Try tab-separated
      const tabMatch = trimmed.match(/^(.+?)\t+(\d[\d,]*)$/);
      if (tabMatch) {
        const name = tabMatch[1].trim();
        const qty = parseInt(tabMatch[2].replace(/,/g, ""), 10);
        if (name && qty > 0) {
          merged.set(name, (merged.get(name) ?? 0) + qty);
        }
      }
    }
  }

  return Array.from(merged.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);
}

interface Props {
  items: ManualItem[];
  onUpdate: (items: ManualItem[]) => void;
  itemTypes?: Map<number, ItemType>;
}

export function ManualInventory({ items, onUpdate, itemTypes }: Props) {
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("quantity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Build name→volume lookup from itemTypes
  const volumeByName = useMemo(() => {
    if (!itemTypes) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const it of itemTypes.values()) {
      map.set(it.name.trim().toLowerCase(), it.volume);
    }
    return map;
  }, [itemTypes]);

  const getVolume = (name: string) => volumeByName.get(name.toLowerCase()) ?? 0;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const filteredItems = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "quantity") {
        cmp = a.quantity - b.quantity;
      } else {
        cmp = getVolume(a.name) * a.quantity - getVolume(b.name) * b.quantity;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, search, sortKey, sortDir, volumeByName]);

  const handleImport = () => {
    const parsed = parseInventoryText(pasteText);
    if (parsed.length === 0) return;

    // Merge with existing
    const merged = new Map<string, number>();
    for (const item of items) {
      merged.set(item.name, (merged.get(item.name) ?? 0) + item.quantity);
    }
    for (const item of parsed) {
      merged.set(item.name, (merged.get(item.name) ?? 0) + item.quantity);
    }

    const newItems = Array.from(merged.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    onUpdate(newItems);
    setPasteText("");
    setShowPaste(false);
  };

  const handleReplace = () => {
    const parsed = parseInventoryText(pasteText);
    if (parsed.length === 0) return;
    onUpdate(parsed);
    setPasteText("");
    setShowPaste(false);
  };

  const handleClear = () => {
    onUpdate([]);
  };

  const handleRemoveItem = (name: string) => {
    onUpdate(items.filter((i) => i.name !== name));
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalVolume = items.reduce((sum, i) => sum + getVolume(i.name) * i.quantity, 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="recipes-toggle"
            onClick={() => setShowPaste(!showPaste)}
          >
            {showPaste ? "Cancel" : "Paste Inventory"}
          </button>
          {items.length > 0 && (
            <button className="recipes-toggle" onClick={handleClear}>
              Clear All
            </button>
          )}
        </div>
        {items.length > 0 && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
            }}
          >
            {items.length} types / {totalItems.toLocaleString()} items
            {totalVolume > 0 && ` / ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} m³`}
          </span>
        )}
      </div>

      {showPaste && (
        <div style={{ marginBottom: "16px" }}>
          <textarea
            className="search-input"
            style={{
              height: "200px",
              resize: "vertical",
              marginBottom: "8px",
              fontFamily: "Favorit Mono, monospace",
              fontSize: "0.8rem",
            }}
            placeholder={
              "Paste your inventory here...\n\nFormat: item name followed by spaces/tabs then quantity\n\nExample:\nSilicon Dust    72976\nTholin Aggregates    5000"
            }
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleReplace}>Replace Inventory</button>
            <button onClick={handleImport}>Add to Existing</button>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                alignSelf: "center",
              }}
            >
              {parseInventoryText(pasteText).length} items detected
            </span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <input
            type="text"
            className="search-input"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="all-items-table">
            <table className="item-table">
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("name")}
                  >
                    Item{sortArrow("name")}
                  </th>
                  <th
                    style={{ textAlign: "right", cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity{sortArrow("quantity")}
                  </th>
                  {volumeByName.size > 0 && (
                    <th
                      style={{ textAlign: "right", cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSort("volume")}
                    >
                      Total Volume{sortArrow("volume")}
                    </th>
                  )}
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const vol = getVolume(item.name);
                  const totalVol = vol * item.quantity;
                  return (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Frontier Disket Mono, monospace",
                        }}
                      >
                        {item.quantity.toLocaleString()}
                      </td>
                      {volumeByName.size > 0 && (
                        <td
                          style={{
                            textAlign: "right",
                            color: totalVol > 0 ? undefined : "var(--color-text-muted)",
                            fontSize: "0.85rem",
                            fontFamily: "Frontier Disket Mono, monospace",
                          }}
                        >
                          {totalVol > 0
                            ? `${totalVol.toLocaleString(undefined, { maximumFractionDigits: 0 })} m³`
                            : "—"}
                        </td>
                      )}
                      <td>
                        <button
                          onClick={() => handleRemoveItem(item.name)}
                          style={{
                            padding: "2px 6px",
                            fontSize: "0.7rem",
                            background: "none",
                            border: "none",
                            color: "var(--color-text-muted)",
                            cursor: "pointer",
                          }}
                          title="Remove"
                        >
                          x
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {items.length === 0 && !showPaste && (
        <div className="empty-state">
          <p>No inventory added yet</p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              marginTop: "8px",
            }}
          >
            Copy your field storage contents from the game and paste them here
          </p>
        </div>
      )}
    </div>
  );
}
