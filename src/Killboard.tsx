import { useState } from "react";
import { useKillboard } from "./useKillboard";
import type { KillboardEntry } from "./useKillboard";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString();
}

function LossTypeBadge({ type }: { type: "SHIP" | "STRUCTURE" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "0.7rem",
        fontFamily: "Frontier Disket Mono, monospace",
        fontWeight: "bold",
        background: type === "SHIP" ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)",
        color: type === "SHIP" ? "#ef4444" : "#eab308",
        border: `1px solid ${type === "SHIP" ? "#ef4444" : "#eab308"}`,
        minWidth: "64px",
        textAlign: "center",
      }}
    >
      {type === "SHIP" ? "SHIP" : "STRUCTURE"}
    </span>
  );
}

function KillRow({ kill }: { kill: KillboardEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: "pointer" }}
        className="kill-row"
      >
        <td style={{ paddingRight: "12px" }}>
          <LossTypeBadge type={kill.lossType} />
        </td>
        <td style={{ color: "#ef4444", fontFamily: "Frontier Disket Mono, monospace" }}>
          {kill.victimName}
        </td>
        <td style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          killed by
        </td>
        <td style={{ color: "var(--color-accent)", fontFamily: "Frontier Disket Mono, monospace" }}>
          {kill.killerName}
        </td>
        <td style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          {kill.solarSystemName}
        </td>
        <td
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.8rem",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
          title={formatTimestamp(kill.killTimestamp)}
        >
          {timeAgo(kill.killTimestamp)}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6}>
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "4px",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                fontFamily: "Frontier Disket Mono, monospace",
                marginBottom: "4px",
              }}
            >
              <span style={{ marginRight: "24px" }}>
                Kill ID: {kill.itemId}
              </span>
              <span style={{ marginRight: "24px" }}>
                Timestamp: {formatTimestamp(kill.killTimestamp)}
              </span>
              <span style={{ marginRight: "24px" }}>
                Solar System ID: {kill.solarSystemId}
              </span>
              <span>Tx: {kill.txDigest.slice(0, 12)}...</span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function Killboard() {
  const { data, isLoading, error, refetch } = useKillboard();
  const [filter, setFilter] = useState<"ALL" | "SHIP" | "STRUCTURE">("ALL");
  const [search, setSearch] = useState("");

  const filtered = (data ?? []).filter((k) => {
    if (filter !== "ALL" && k.lossType !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        k.victimName.toLowerCase().includes(q) ||
        k.killerName.toLowerCase().includes(q) ||
        k.solarSystemName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const shipKills = (data ?? []).filter((k) => k.lossType === "SHIP").length;
  const structureKills = (data ?? []).filter((k) => k.lossType === "STRUCTURE").length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {(["ALL", "SHIP", "STRUCTURE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 14px",
                fontSize: "0.8rem",
                background: filter === f ? "var(--color-accent)" : "transparent",
                color: filter === f ? "#000" : "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          style={{ marginBottom: 0, flex: 1, minWidth: "160px" }}
          placeholder="Search pilot or system..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => refetch()}
          style={{ fontSize: "0.8rem", padding: "4px 12px" }}
        >
          Refresh
        </button>
      </div>

      {data && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            marginBottom: "12px",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>Total: {data.length}</span>
          <span style={{ color: "#ef4444" }}>Ships: {shipKills}</span>
          <span style={{ color: "#eab308" }}>Structures: {structureKills}</span>
          {filtered.length !== data.length && (
            <span>Showing: {filtered.length}</span>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          Loading killboard... (fetching kills + character names)
        </div>
      )}

      {error && (
        <div className="error">
          Failed to load killboard: {String(error)}
          <br />
          <button onClick={() => refetch()} style={{ marginTop: "12px" }}>
            Retry
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <table className="item-table" style={{ tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            <col style={{ width: "90px" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "64px" }} />
            <col style={{ width: "22%" }} />
            <col />
            <col style={{ width: "80px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Type</th>
              <th>Victim</th>
              <th></th>
              <th>Killer</th>
              <th>System</th>
              <th style={{ textAlign: "right" }}>When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k, i) => (
              <KillRow key={`${k.txDigest}-${i}`} kill={k} />
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="empty-state">No kills found</div>
      )}
    </div>
  );
}
