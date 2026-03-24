import { usePlayerHubs } from "./useInventory";
import { useItemTypes } from "./useItemTypes";
import { AssemblyCard } from "./AssemblyCard";
import { useConnection } from "@evefrontier/dapp-kit";

export function HubView() {
  const { walletAddress } = useConnection();
  const { data, isLoading, error, refetch } = usePlayerHubs(walletAddress);
  const { data: itemTypes } = useItemTypes();

  return (
    <div>
      {!walletAddress && (
        <div className="empty-state">
          <p>Connect your EVE Vault wallet to load your hubs</p>
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
