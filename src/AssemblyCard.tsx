import { useState } from "react";
import type { AssemblyData } from "./useInventory";
import type { ItemType } from "./worldApi";
import { getItemType } from "./worldApi";
import { RecipeList } from "./RecipeList";
import type { Recipe } from "./recipes";

// type_id → assembly type mapping
const ASSEMBLY_TYPE_MAP: Record<number, Recipe["assemblyType"]> = {
  88063: "refinery",
  88069: "mini_berth",
  87119: "mini_printer",
  88068: "assembler",
};

interface Props {
  assembly: AssemblyData;
  itemTypes?: Map<number, ItemType>;
  isHub?: boolean;
}

export function AssemblyCard({ assembly, itemTypes, isHub }: Props) {
  const [showRecipes, setShowRecipes] = useState(false);
  const assemblyType = ASSEMBLY_TYPE_MAP[assembly.typeId];
  const typeInfo = itemTypes?.get(assembly.typeId);
  const displayName =
    assembly.name || typeInfo?.name || `Assembly #${assembly.typeId}`;

  const capacityPercent =
    assembly.maxCapacity > 0
      ? Math.round((assembly.usedCapacity / assembly.maxCapacity) * 100)
      : 0;

  const fuelPercent =
    assembly.fuel && assembly.fuel.maxCapacity > 0
      ? Math.round(
          (assembly.fuel.quantity / assembly.fuel.maxCapacity) * 100,
        )
      : 0;

  const fuelTypeInfo = assembly.fuel
    ? itemTypes?.get(assembly.fuel.typeId)
    : undefined;

  return (
    <div className={`ssu-card ${isHub ? "hub-card" : ""}`}>
      <div className="ssu-card-header">
        <div>
          <h3>
            {isHub && <span style={{ color: "var(--color-accent)" }}>HUB </span>}
            {displayName}
          </h3>
          <span className="address-text">
            {assembly.id.slice(0, 10)}...{assembly.id.slice(-8)}
          </span>
          {typeInfo && (
            <span
              className="category-badge"
              style={{ marginLeft: "8px" }}
            >
              {typeInfo.groupName || typeInfo.categoryName}
            </span>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              color: assembly.statusOnline
                ? "var(--color-accent)"
                : "var(--color-text-muted)",
              fontSize: "0.8rem",
              fontFamily: "Frontier Disket Mono, monospace",
            }}
          >
            {assembly.statusOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Fuel info */}
      {assembly.fuel && (
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              marginBottom: "4px",
            }}
          >
            <span>
              Fuel: {assembly.fuel.quantity.toLocaleString()}{" "}
              {fuelTypeInfo?.name ?? `#${assembly.fuel.typeId}`}
            </span>
            <span>{fuelPercent}%</span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-bar-fill"
              style={{
                width: `${fuelPercent}%`,
                background:
                  fuelPercent < 20
                    ? "#ef4444"
                    : fuelPercent < 50
                      ? "#eab308"
                      : "var(--color-accent)",
              }}
            />
          </div>
        </div>
      )}

      {/* Energy info */}
      {assembly.energySource && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            marginBottom: "12px",
          }}
        >
          <span>
            Energy: {assembly.energySource.currentProduction}/
            {assembly.energySource.maxProduction}
          </span>
          <span>Reserved: {assembly.energySource.totalReserved}</span>
        </div>
      )}

      {/* Connected assemblies count for hub */}
      {assembly.connectedAssemblyIds.length > 0 && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            marginBottom: "12px",
          }}
        >
          {assembly.connectedAssemblyIds.length} connected assemblies
        </div>
      )}

      {/* Inventory */}
      {assembly.maxCapacity > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              marginBottom: "4px",
            }}
          >
            <span>Inventory</span>
            <span>
              {assembly.usedCapacity.toLocaleString()} /{" "}
              {assembly.maxCapacity.toLocaleString()} m³ ({capacityPercent}%)
            </span>
          </div>
          <div className="capacity-bar" style={{ marginBottom: "12px" }}>
            <div
              className="capacity-bar-fill"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          {assembly.items.length > 0 ? (
            <table className="item-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {assembly.items.map((item) => {
                  const it = itemTypes
                    ? getItemType(itemTypes, item.typeId)
                    : undefined;
                  return (
                    <tr key={item.typeId}>
                      <td>{it?.name ?? `#${item.typeId}`}</td>
                      <td>
                        <span className="category-badge">
                          {it?.categoryName ?? "Unknown"}
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Frontier Disket Mono, monospace",
                        }}
                      >
                        {item.quantity.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "var(--color-text-muted)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {(item.volume * item.quantity).toLocaleString()} m³
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.85rem",
                padding: "8px 0",
              }}
            >
              Empty
            </div>
          )}
        </div>
      )}

      {/* Recipes section */}
      {assemblyType && (
        <div className="recipes-section">
          <button
            className="recipes-toggle"
            onClick={() => setShowRecipes(!showRecipes)}
          >
            {showRecipes ? "Hide" : "Show"} Recipes
          </button>
          {showRecipes && (
            <div style={{ marginTop: "12px" }}>
              <RecipeList assemblyType={assemblyType} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
