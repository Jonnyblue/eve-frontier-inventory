import { useState } from "react";
import { HubView } from "./HubView";
import { AssemblyLookup } from "./AssemblyLookup";
import { AllRecipes } from "./AllRecipes";
import { ManualInventory, useManualInventory } from "./ManualInventory";
import { CraftingCalculator } from "./CraftingCalculator";
import { Killboard } from "./Killboard";
import { UniverseMap } from "./UniverseMap";
import { useItemTypes } from "./useItemTypes";
import { usePlayerHubs } from "./useInventory";
import { useConnection } from "@evefrontier/dapp-kit";

function App() {
  const [tab, setTab] = useState<
    "hub" | "lookup" | "recipes" | "inventory" | "calculator" | "killboard" | "map"
  >("calculator");
  const { walletAddress, isConnected, hasEveVault, handleConnect, handleDisconnect } = useConnection();

  const manualInventory = useManualInventory();
  const { data: itemTypes } = useItemTypes();
  const { data: playerData } = usePlayerHubs(walletAddress);

  // Collect SSU items from all hubs' connected assemblies
  const ssuItems = playerData?.connected.filter((a) => a.items.length > 0);

  return (
    <div className="app-container">
      <div className="header">
        <h1>EVE FRONTIER INVENTORY</h1>
        {isConnected ? (
          <button className="btn-secondary" onClick={handleDisconnect}>Disconnect</button>
        ) : (
          <button className="btn-secondary" onClick={handleConnect} disabled={!hasEveVault}>
            {hasEveVault ? "Connect EVE Vault" : "Install EVE Vault"}
          </button>
        )}
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
        <HubView />
      ) : tab === "recipes" ? (
        <AllRecipes />
      ) : tab === "killboard" ? (
        <Killboard />
      ) : tab === "map" ? (
        <UniverseMap structures={[
          ...(playerData?.hubs ?? []),
          ...(playerData?.connected ?? []),
        ]} />
      ) : (
        <AssemblyLookup />
      )}
    </div>
  );
}

export default App;
