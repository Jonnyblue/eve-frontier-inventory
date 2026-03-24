import { abbreviateAddress, useConnection } from "@evefrontier/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useState } from "react";
import { HubView } from "./HubView";
import { AssemblyLookup } from "./AssemblyLookup";
import { AllRecipes } from "./AllRecipes";
import { ManualInventory, useManualInventory } from "./ManualInventory";
import { CraftingCalculator } from "./CraftingCalculator";
import { Killboard } from "./Killboard";
import { UniverseMap } from "./UniverseMap";
import { useItemTypes } from "./useItemTypes";
import { useHubInventory } from "./useInventory";

const HUB_ID_KEY = "eve-frontier-hub-id";

function App() {
  const { handleConnect, handleDisconnect } = useConnection();
  const account = useCurrentAccount();
  const [tab, setTab] = useState<
    "hub" | "lookup" | "recipes" | "inventory" | "calculator" | "killboard" | "map"
  >("calculator");
  const [hubId, setHubId] = useState<string>(
    () => localStorage.getItem(HUB_ID_KEY) ?? ""
  );
  const manualInventory = useManualInventory();
  const { data: itemTypes } = useItemTypes();
  const { data: hubData } = useHubInventory(hubId || undefined);

  const handleSetHubId = (id: string) => {
    setHubId(id);
    if (id) localStorage.setItem(HUB_ID_KEY, id);
    else localStorage.removeItem(HUB_ID_KEY);
  };

  // Collect SSU items from hub connected assemblies
  const ssuItems = hubData?.connected.filter((a) => a.items.length > 0);

  return (
    <div className="app-container">
      <div className="header">
        <h1>EVE FRONTIER INVENTORY</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {account && (
            <span className="address-text">
              {abbreviateAddress(account.address)}
            </span>
          )}
          <button
            onClick={() =>
              account?.address ? handleDisconnect() : handleConnect()
            }
          >
            {account ? "Disconnect" : "Connect Wallet"}
          </button>
        </div>
      </div>

      <div className="tab-bar">
        <button
          className={`tab ${tab === "calculator" ? "active" : ""}`}
          onClick={() => setTab("calculator")}
        >
          Calculator
        </button>
        <button
          className={`tab ${tab === "inventory" ? "active" : ""}`}
          onClick={() => setTab("inventory")}
        >
          My Inventory
        </button>
        <button
          className={`tab ${tab === "hub" ? "active" : ""}`}
          onClick={() => setTab("hub")}
        >
          My Hub
        </button>
        <button
          className={`tab ${tab === "recipes" ? "active" : ""}`}
          onClick={() => setTab("recipes")}
        >
          Recipes
        </button>
        <button
          className={`tab ${tab === "lookup" ? "active" : ""}`}
          onClick={() => setTab("lookup")}
        >
          Lookup
        </button>
        <button
          className={`tab ${tab === "killboard" ? "active" : ""}`}
          onClick={() => setTab("killboard")}
        >
          Killboard
        </button>
        <button
          className={`tab ${tab === "map" ? "active" : ""}`}
          onClick={() => setTab("map")}
        >
          Map
        </button>
      </div>

      {tab === "calculator" ? (
        <CraftingCalculator
          manualItems={manualInventory.items}
          ssuItems={ssuItems}
          itemTypes={itemTypes}
        />
      ) : tab === "inventory" ? (
        <ManualInventory
          items={manualInventory.items}
          onUpdate={manualInventory.updateItems}
          itemTypes={itemTypes}
        />
      ) : tab === "hub" ? (
        <HubView hubId={hubId} onSetHubId={handleSetHubId} />
      ) : tab === "recipes" ? (
        <AllRecipes />
      ) : tab === "killboard" ? (
        <Killboard />
      ) : tab === "map" ? (
        <UniverseMap structures={[
          ...(hubData?.hub ? [hubData.hub] : []),
          ...(hubData?.connected ?? []),
        ]} />
      ) : (
        <AssemblyLookup />
      )}
    </div>
  );
}

export default App;
