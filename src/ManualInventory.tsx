import { useState, useMemo, useCallback } from "react";

export interface ManualItem {
  name: string;
  quantity: number;
}

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
}

export function ManualInventory({ items, onUpdate }: Props) {
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, search]);

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
                  <th>Item</th>
                  <th style={{ textAlign: "right" }}>Quantity</th>
                  <th style={{ width: "40px" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
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
                ))}
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
