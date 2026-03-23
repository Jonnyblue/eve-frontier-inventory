import { useState } from "react";
import { useHubInventory } from "./useInventory";
import { useItemTypes } from "./useItemTypes";
import { AssemblyCard } from "./AssemblyCard";

const DEFAULT_HUB_ID =
  "0xc746d1c0cf1f6a9446117d3a0fc4255e2f2bec38b8686250c05a21d83f3cf211";

export function HubView() {
  const [hubId, setHubId] = useState(DEFAULT_HUB_ID);
  const [inputValue, setInputValue] = useState(DEFAULT_HUB_ID);
  const { data, isLoading, error, refetch } = useHubInventory(hubId);
  const { data: itemTypes } = useItemTypes();

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          className="search-input"
          style={{ marginBottom: 0 }}
          placeholder="Enter Network Node / Hub object ID (0x...)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setHubId(inputValue.trim());
          }}
        />
        <button onClick={() => setHubId(inputValue.trim())}>Load</button>
      </div>

      {isLoading && <div className="loading">Loading hub data...</div>}

      {error && (
        <div className="error">
          Failed to load hub: {String(error)}
          <br />
          <button onClick={() => refetch()} style={{ marginTop: "12px" }}>
            Retry
          </button>
        </div>
      )}

      {data?.hub && (
        <div>
          <AssemblyCard assembly={data.hub} itemTypes={itemTypes} isHub onRefetch={refetch} />

          {data.connected.length > 0 && (
            <div className="section">
              <h2 className="section-title">
                Connected Assemblies ({data.connected.length})
              </h2>
              {data.connected.map((a) => (
                <AssemblyCard key={a.id} assembly={a} itemTypes={itemTypes} onRefetch={refetch} />
              ))}
            </div>
          )}

          {data.connected.length === 0 && (
            <div
              className="empty-state"
              style={{ marginTop: "16px", padding: "24px" }}
            >
              No connected assemblies found
            </div>
          )}
        </div>
      )}

      {data && !data.hub && (
        <div className="empty-state">
          No assembly found at this address. Make sure you entered a valid
          object ID.
        </div>
      )}
    </div>
  );
}
