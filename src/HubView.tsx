import { useState } from "react";
import { usePlayerHubs } from "./useInventory";
import { useItemTypes } from "./useItemTypes";
import { AssemblyCard } from "./AssemblyCard";

const WALLET_KEY = "eve-frontier-wallet-address";

interface HubViewProps {
  walletAddress: string;
  onSetWalletAddress: (addr: string) => void;
}

export function HubView({ walletAddress, onSetWalletAddress }: HubViewProps) {
  const [inputValue, setInputValue] = useState(walletAddress);
  const { data, isLoading, error, refetch } = usePlayerHubs(walletAddress || undefined);
  const { data: itemTypes } = useItemTypes();

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          className="search-input"
          style={{ marginBottom: 0 }}
          placeholder="Enter wallet address (0x...)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSetWalletAddress(inputValue.trim());
          }}
        />
        <button onClick={() => onSetWalletAddress(inputValue.trim())}>Load</button>
      </div>

      {!walletAddress && (
        <div className="empty-state">
          <p>Enter your wallet address to load your hubs</p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "8px" }}>
            Your wallet address starts with 0x — find it in-game or in your EVE Vault wallet
          </p>
        </div>
      )}

      {isLoading && <div className="loading">Discovering your structures...</div>}

      {error && (
        <div className="error">
          Failed to load: {String(error)}
          <br />
          <button onClick={() => refetch()} style={{ marginTop: "12px" }}>Retry</button>
        </div>
      )}

      {data && data.hubs.length === 0 && walletAddress && !isLoading && (
        <div className="empty-state">
          No network nodes found for this wallet address.
        </div>
      )}

      {data && data.hubs.map((hub) => (
        <div key={hub.id} style={{ marginBottom: "32px" }}>
          <AssemblyCard assembly={hub} itemTypes={itemTypes} isHub onRefetch={refetch} />

          {data.connected.filter(a =>
            hub.connectedAssemblyIds.includes(a.id)
          ).length > 0 && (
            <div className="section">
              <h2 className="section-title">
                Connected Assemblies ({hub.connectedAssemblyIds.length})
              </h2>
              {data.connected
                .filter(a => hub.connectedAssemblyIds.includes(a.id))
                .map((a) => (
                  <AssemblyCard key={a.id} assembly={a} itemTypes={itemTypes} onRefetch={refetch} />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
