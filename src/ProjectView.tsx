import { useState, useMemo, useEffect } from "react";
import {
  getCraftableOutputs,
  buildRecipeIndex,
  resolveProductionTree,
  flattenAllMaterials,
} from "./craftingEngine";
import { useAssembly, usePlayerHubs } from "./useInventory";
import { useItemTypes } from "./useItemTypes";
import { useConnection } from "@evefrontier/dapp-kit";
import { ItemIcon } from "./ItemIcon";
import { buildNameToTypeIdMap } from "./worldApi";

interface ProjectParams {
  recipeOutput: string; // output item name
  qty: number;
  ssuId: string; // SSU object ID (0x...)
}

function readParams(): Partial<ProjectParams> {
  const p = new URLSearchParams(window.location.search);
  const recipeOutput = p.get("item") ?? undefined;
  const qty = p.get("qty") ? Number(p.get("qty")) : undefined;
  const ssuId = p.get("ssu") ?? undefined;
  return { recipeOutput, qty, ssuId };
}

function buildUrl(params: ProjectParams): string {
  const p = new URLSearchParams({
    item: params.recipeOutput,
    qty: String(params.qty),
    ssu: params.ssuId,
  });
  return `${window.location.origin}${window.location.pathname}?${p.toString()}`;
}

function ManualSsuInput({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const isValidId = value.startsWith("0x") && value.length > 10;
  const { data: assembly, isLoading } = useAssembly(isValidId ? value : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <input
        type="text"
        className="search-input"
        style={{ marginBottom: 0 }}
        placeholder="SSU object ID (0x...)"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
      />
      {isValidId && (
        <span style={{ fontSize: "0.75rem", color: isLoading ? "var(--color-text-muted)" : assembly ? "var(--color-success)" : "var(--color-warning)" }}>
          {isLoading ? "Looking up…" : assembly ? `✓ ${assembly.name || "Unnamed SSU"}` : "SSU not found"}
        </span>
      )}
    </div>
  );
}

function ProjectSetup({ onStart }: { onStart: (p: ProjectParams) => void }) {
  const craftableOutputs = useMemo(() => getCraftableOutputs(), []);
  const { walletAddress } = useConnection();
  const { data: playerData } = usePlayerHubs(walletAddress);
  const [selectedItem, setSelectedItem] = useState(craftableOutputs[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [ssuId, setSsuId] = useState("");

  const ssus = useMemo(() => {
    if (!playerData) return [];
    return playerData.connected.filter((a) => a.kind === "StorageUnit");
  }, [playerData]);

  return (
    <div style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ margin: 0 }}>New Project</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Target Item</label>
        <select
          className="search-input"
          style={{ marginBottom: 0 }}
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          {craftableOutputs.map((o) => (
            <option key={o.name} value={o.name}>{o.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Quantity</label>
        <input
          type="number"
          min={1}
          className="search-input"
          style={{ marginBottom: 0 }}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>SSU to Track</label>
        {ssus.length > 0 ? (
          <select
            className="search-input"
            style={{ marginBottom: 0 }}
            value={ssuId}
            onChange={(e) => setSsuId(e.target.value)}
          >
            <option value="">— pick an SSU —</option>
            {ssus.map((s) => (
              <option key={s.id} value={s.id}>{s.name || s.id.slice(0, 16) + "…"}</option>
            ))}
          </select>
        ) : (
          <ManualSsuInput value={ssuId} onChange={setSsuId} />
        )}
        {!walletAddress && (
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            Connect EVE Vault to pick from your SSUs
          </span>
        )}
      </div>

      <button
        style={{ alignSelf: "flex-start" }}
        disabled={!selectedItem || qty < 1 || !ssuId}
        onClick={() => onStart({ recipeOutput: selectedItem, qty, ssuId })}
      >
        Create Project
      </button>
    </div>
  );
}

function ProjectProgress({ params, onReset }: { params: ProjectParams; onReset: () => void }) {
  const { data: ssu, isLoading } = useAssembly(params.ssuId);
  const { data: itemTypes } = useItemTypes();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const nameToTypeId = useMemo(
    () => (itemTypes ? buildNameToTypeIdMap(itemTypes) : new Map<string, number>()),
    [itemTypes],
  );

  const recipeIndex = useMemo(() => buildRecipeIndex(), []);

  const inventory = useMemo(() => {
    const map = new Map<string, number>();
    if (!ssu || !itemTypes) return map;
    for (const item of ssu.items) {
      const typeInfo = itemTypes.get(item.typeId);
      if (typeInfo) map.set(typeInfo.name.toLowerCase(), (map.get(typeInfo.name.toLowerCase()) ?? 0) + item.quantity);
    }
    return map;
  }, [ssu, itemTypes]);

  const materials = useMemo(() => {
    const inv = new Map(inventory); // copy — resolveProductionTree mutates it
    const tree = resolveProductionTree(params.recipeOutput, params.qty, inv, recipeIndex);
    return flattenAllMaterials(tree);
  }, [params.recipeOutput, params.qty, inventory, recipeIndex]);

  const allDone = materials.every((m) => m.deficit <= 0);

  const shareUrl = buildUrl(params);

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>
          {params.qty}× {params.recipeOutput}
        </h2>
        {allDone && (
          <span style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>✓ Ready to build</span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button onClick={copyUrl} style={{ fontSize: "0.75rem" }}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button onClick={onReset} style={{ fontSize: "0.75rem" }}>
            New Project
          </button>
        </div>
      </div>

      {ssu && (
        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          Tracking: {ssu.name || params.ssuId.slice(0, 20) + "…"} — {isLoading ? "refreshing…" : "live"}
        </div>
      )}

      {isLoading && !ssu && <div className="loading">Loading SSU inventory…</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {materials.map((m) => {
          const have = m.totalNeeded - m.deficit;
          const pct = Math.min(100, Math.round((have / m.totalNeeded) * 100));
          const done = m.deficit <= 0;
          return (
            <div key={m.name} className="recipe-card" style={{ padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <ItemIcon typeId={nameToTypeId.get(m.name)} size={20} />
                <span style={{ flex: 1 }}>{m.name}</span>
                <span style={{
                  fontSize: "0.8rem",
                  fontFamily: "Frontier Disket Mono, monospace",
                  color: done ? "var(--color-success)" : "var(--color-warning)",
                }}>
                  {have.toLocaleString()} / {m.totalNeeded.toLocaleString()}
                </span>
              </div>
              <div style={{ height: "4px", background: "var(--color-border)", borderRadius: "2px" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: done ? "var(--color-success)" : "var(--color-accent)",
                  borderRadius: "2px",
                  transition: "width 0.3s",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", wordBreak: "break-all" }}>
        <strong>SSU dApp URL:</strong> {shareUrl}
      </div>
    </div>
  );
}

export function ProjectView() {
  const [params, setParams] = useState<ProjectParams | null>(() => {
    const { recipeOutput, qty, ssuId } = readParams();
    if (recipeOutput && qty && ssuId) return { recipeOutput, qty, ssuId };
    return null;
  });

  // Keep URL in sync with params
  useEffect(() => {
    if (params) {
      const url = buildUrl(params);
      window.history.replaceState(null, "", url);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [params]);

  if (!params) return <ProjectSetup onStart={setParams} />;
  return <ProjectProgress params={params} onReset={() => setParams(null)} />;
}
