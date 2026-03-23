import { useState } from "react";
import { RecipeList } from "./RecipeList";
import type { Recipe } from "./recipes";

const ASSEMBLY_TYPES: { key: Recipe["assemblyType"]; label: string }[] = [
  { key: "refinery", label: "Refinery" },
  { key: "mini_printer", label: "Mini Printer" },
  { key: "assembler", label: "Assembler" },
  { key: "mini_berth", label: "Mini Berth" },
];

export function AllRecipes() {
  const [selected, setSelected] = useState<Recipe["assemblyType"]>("refinery");

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {ASSEMBLY_TYPES.map((t) => (
          <button
            key={t.key}
            className={`tab ${selected === t.key ? "active" : ""}`}
            onClick={() => setSelected(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <RecipeList assemblyType={selected} />
    </div>
  );
}
