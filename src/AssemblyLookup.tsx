import { useState } from "react";
import { useAssembly } from "./useInventory";
import { useItemTypes } from "./useItemTypes";
import { AssemblyCard } from "./AssemblyCard";

export function AssemblyLookup() {
  const [objectId, setObjectId] = useState("");
  const [queryId, setQueryId] = useState<string | undefined>();
  const { data, isLoading, error } = useAssembly(queryId);
  const { data: itemTypes } = useItemTypes();

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          className="search-input"
          style={{ marginBottom: 0 }}
          placeholder="Enter any assembly object ID (0x...)"
          value={objectId}
          onChange={(e) => setObjectId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && objectId.trim())
              setQueryId(objectId.trim());
          }}
        />
        <button onClick={() => objectId.trim() && setQueryId(objectId.trim())}>
          Lookup
        </button>
      </div>

      {isLoading && <div className="loading">Loading assembly...</div>}

      {error && (
        <div className="error">Failed to load: {String(error)}</div>
      )}

      {data && <AssemblyCard assembly={data} itemTypes={itemTypes} />}

      {queryId && !isLoading && !error && !data && (
        <div className="empty-state">No assembly found at this address</div>
      )}
    </div>
  );
}
