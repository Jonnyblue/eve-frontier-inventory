export interface RecipeItem {
  name: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  category: string; // e.g. "Mineral", "Salvage", "Rift", etc.
  name: string; // blueprint name (usually the ore/input name)
  runTime: number; // seconds
  inputs: RecipeItem[];
  outputs: RecipeItem[];
  assemblyType: "refinery" | "mini_berth" | "mini_printer" | "assembler" | "printer" | "berth";
}

export const recipes: Recipe[] = [
  // === Refinery Recipes ===

  // Char Ores
  {
    id: "refinery-feldspar-crystals",
    category: "Char Ores",
    name: "Feldspar Crystals",
    runTime: 3,
    inputs: [{ name: "Feldspar Crystals", quantity: 40 }],
    outputs: [
      { name: "Hydrocarbon Residue", quantity: 10 },
      { name: "Silica Grains", quantity: 30 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-silica-grains",
    category: "Mineral",
    name: "Silica Grains",
    runTime: 9,
    inputs: [{ name: "Silica Grains", quantity: 20 }],
    outputs: [
      { name: "Feldspar Crystal Shards", quantity: 50 },
      { name: "Silicon Dust", quantity: 150 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-hydrocarbon-residue",
    category: "Mineral",
    name: "Hydrocarbon Residue",
    runTime: 9,
    inputs: [{ name: "Hydrocarbon Residue", quantity: 20 }],
    outputs: [
      { name: "Troilite Sulfide Grains", quantity: 20 },
      { name: "Tholin Aggregates", quantity: 180 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-iron-rich-nodules",
    category: "Mineral",
    name: "Iron-Rich Nodules",
    runTime: 9,
    inputs: [{ name: "Iron-Rich Nodules", quantity: 10 }],
    outputs: [
      { name: "Platinum-Group Veins", quantity: 20 },
      { name: "Nickel-Iron Veins", quantity: 198 },
    ],
    assemblyType: "refinery",
  },

  // Slag Ores
  {
    id: "refinery-platinum-palladium-matrix",
    category: "Slag Ores",
    name: "Platinum-Palladium Matrix",
    runTime: 3,
    inputs: [{ name: "Platinum-Palladium Matrix", quantity: 40 }],
    outputs: [
      { name: "Silica Grains", quantity: 10 },
      { name: "Iron-Rich Nodules", quantity: 30 },
      { name: "Palladium", quantity: 8 },
    ],
    assemblyType: "refinery",
  },

  // Comet Ores
  {
    id: "refinery-hydrated-sulfide-matrix",
    category: "Comet Ores",
    name: "Hydrated Sulfide Matrix",
    runTime: 3,
    inputs: [{ name: "Hydrated Sulfide Matrix", quantity: 40 }],
    outputs: [
      { name: "Water Ice", quantity: 200 },
      { name: "Hydrocarbon Residue", quantity: 20 },
    ],
    assemblyType: "refinery",
  },

  // Glint Ores
  {
    id: "refinery-aromatic-carbon-veins",
    category: "Glint Ores",
    name: "Aromatic Carbon Veins",
    runTime: 15,
    inputs: [{ name: "Aromatic Carbon Veins", quantity: 100 }],
    outputs: [
      { name: "Chitinous Organics", quantity: 1 },
      { name: "Aromatic Carbon Weave", quantity: 4 },
      { name: "Kerogen Tar", quantity: 8 },
    ],
    assemblyType: "refinery",
  },

  // Soot Ores
  {
    id: "refinery-tholin-nodules",
    category: "Soot Ores",
    name: "Tholin Nodules",
    runTime: 15,
    inputs: [{ name: "Tholin Nodules", quantity: 100 }],
    outputs: [
      { name: "Chitinous Organics", quantity: 1 },
      { name: "Aromatic Carbon Weave", quantity: 8 },
    ],
    assemblyType: "refinery",
  },

  // Ember Ores
  {
    id: "refinery-primitive-kerogen-matrix",
    category: "Ember Ores",
    name: "Primitive Kerogen Matrix",
    runTime: 15,
    inputs: [{ name: "Primitive Kerogen Matrix", quantity: 100 }],
    outputs: [
      { name: "Chitinous Organics", quantity: 1 },
      { name: "Kerogen Tar", quantity: 16 },
    ],
    assemblyType: "refinery",
  },

  // Dewdrop Ores
  {
    id: "refinery-methane-ice-shards",
    category: "Dewdrop Ores",
    name: "Methane Ice Shards",
    runTime: 15,
    inputs: [{ name: "Methane Ice Shards", quantity: 100 }],
    outputs: [
      { name: "Chitinous Organics", quantity: 1 },
      { name: "Tholin Aggregates", quantity: 126 },
      { name: "Water Ice", quantity: 349 },
    ],
    assemblyType: "refinery",
  },

  // Ingot Ores
  {
    id: "refinery-iridosmine-nodules",
    category: "Ingot Ores",
    name: "Iridosmine Nodules",
    runTime: 5,
    inputs: [{ name: "Iridosmine Nodules", quantity: 40 }],
    outputs: [{ name: "Iron-Rich Nodules", quantity: 40 }],
    assemblyType: "refinery",
  },

  // Salvage
  {
    id: "refinery-salvaged-materials",
    category: "Salvage",
    name: "Salvaged Materials",
    runTime: 4,
    inputs: [{ name: "Salvaged Materials", quantity: 10 }],
    outputs: [
      { name: "Carbon Weave", quantity: 1 },
      { name: "Thermal Composites", quantity: 2 },
      { name: "Reinforced Alloys", quantity: 6 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-mummified-clone",
    category: "Salvage",
    name: "Mummified Clone",
    runTime: 3,
    inputs: [{ name: "Mummified Clone", quantity: 5 }],
    outputs: [
      { name: "Aromatic Carbon Weave", quantity: 1 },
      { name: "Kerogen Tar", quantity: 1 },
      { name: "Water Ice", quantity: 50 },
    ],
    assemblyType: "refinery",
  },

  // Rift
  {
    id: "refinery-rough-young-crude-matter",
    category: "Rift",
    name: "Rough Young Crude Matter",
    runTime: 20,
    inputs: [{ name: "Rough Young Crude Matter", quantity: 30 }],
    outputs: [
      { name: "Salt", quantity: 1 },
      { name: "Eupraxite", quantity: 28 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-rough-old-crude-matter",
    category: "Rift",
    name: "Rough Old Crude Matter",
    runTime: 20,
    inputs: [{ name: "Rough Old Crude Matter", quantity: 30 }],
    outputs: [
      { name: "Salt", quantity: 16 },
      { name: "Sophrogon", quantity: 28 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-fine-young-crude-matter",
    category: "Rift",
    name: "Fine Young Crude Matter",
    runTime: 20,
    inputs: [{ name: "Fine Young Crude Matter", quantity: 30 }],
    outputs: [
      { name: "Eupraxite", quantity: 3 },
      { name: "Brine", quantity: 26 },
    ],
    assemblyType: "refinery",
  },
  {
    id: "refinery-fine-old-crude-matter",
    category: "Rift",
    name: "Fine Old Crude Matter",
    runTime: 20,
    inputs: [{ name: "Fine Old Crude Matter", quantity: 30 }],
    outputs: [
      { name: "Sophrogon", quantity: 3 },
      { name: "Brine", quantity: 26 },
    ],
    assemblyType: "refinery",
  },

  // Mineral → Fuel
  {
    id: "refinery-sophrogon-fuel",
    category: "Mineral",
    name: "Sophrogon → SOF-40 Fuel",
    runTime: 18,
    inputs: [{ name: "Sophrogon", quantity: 10 }],
    outputs: [{ name: "SOF-40 Fuel", quantity: 600 }],
    assemblyType: "refinery",
  },
  {
    id: "refinery-eupraxite-fuel",
    category: "Mineral",
    name: "Eupraxite → EU-40 Fuel",
    runTime: 18,
    inputs: [{ name: "Eupraxite", quantity: 10 }],
    outputs: [{ name: "EU-40 Fuel", quantity: 600 }],
    assemblyType: "refinery",
  },
  {
    id: "refinery-water-ice-fuel",
    category: "Mineral",
    name: "Water Ice → D1 Fuel",
    runTime: 3,
    inputs: [{ name: "Water Ice", quantity: 275 }],
    outputs: [{ name: "D1 Fuel", quantity: 75 }],
    assemblyType: "refinery",
  },

  // Hydrogen Fuel
  {
    id: "refinery-d2-fuel-salt",
    category: "Hydrogen Fuel",
    name: "D2 Fuel → Salt",
    runTime: 3,
    inputs: [{ name: "D2 Fuel", quantity: 200 }],
    outputs: [{ name: "Salt", quantity: 1 }],
    assemblyType: "refinery",
  },

  // === Mini Berth Recipes ===

  // Shuttles
  {
    id: "berth-wend",
    category: "Shuttle",
    name: "Wend",
    runTime: 60,
    inputs: [
      { name: "Nomad Program Frame", quantity: 1 },
      { name: "Reinforced Alloys", quantity: 34 },
      { name: "Carbon Weave", quantity: 17 },
      { name: "Thermal Composites", quantity: 17 },
    ],
    outputs: [{ name: "Wend", quantity: 1 }],
    assemblyType: "mini_berth",
  },

  // Corvettes
  {
    id: "berth-reflex",
    category: "Corvette",
    name: "Reflex",
    runTime: 50,
    inputs: [
      { name: "Nomad Program Frame", quantity: 1 },
      { name: "Reinforced Alloys", quantity: 28 },
      { name: "Hydrocarbon Residue", quantity: 40 },
    ],
    outputs: [{ name: "Reflex", quantity: 1 }],
    assemblyType: "mini_berth",
  },
  {
    id: "berth-recurve",
    category: "Corvette",
    name: "Recurve",
    runTime: 130,
    inputs: [
      { name: "Nomad Program Frame", quantity: 2 },
      { name: "Carbon Weave", quantity: 25 },
      { name: "Thermal Composites", quantity: 25 },
      { name: "Reinforced Alloys", quantity: 45 },
      { name: "Still Kernel", quantity: 2 },
    ],
    outputs: [{ name: "Recurve", quantity: 1 }],
    assemblyType: "mini_berth",
  },
  {
    id: "berth-reiver",
    category: "Corvette",
    name: "Reiver",
    runTime: 150,
    inputs: [
      { name: "Nomad Program Frame", quantity: 2 },
      { name: "Reinforced Alloys", quantity: 78 },
      { name: "Carbon Weave", quantity: 33 },
      { name: "Thermal Composites", quantity: 33 },
    ],
    outputs: [{ name: "Reiver", quantity: 1 }],
    assemblyType: "mini_berth",
  },
  {
    id: "berth-carom",
    category: "Corvette",
    name: "Carom",
    runTime: 10260,
    inputs: [
      { name: "Carom Stack", quantity: 1 },
      { name: "Nomad Program Frame", quantity: 2 },
      { name: "Carbon Weave", quantity: 44 },
      { name: "Thermal Composites", quantity: 44 },
      { name: "Reinforced Alloys", quantity: 88 },
    ],
    outputs: [{ name: "Carom", quantity: 1 }],
    assemblyType: "mini_berth",
  },
  {
    id: "berth-stride",
    category: "Corvette",
    name: "Stride",
    runTime: 10630,
    inputs: [
      { name: "Stride Stack", quantity: 1 },
      { name: "Nomad Program Frame", quantity: 2 },
      { name: "Carbon Weave", quantity: 48 },
      { name: "Thermal Composites", quantity: 48 },
      { name: "Reinforced Alloys", quantity: 96 },
    ],
    outputs: [{ name: "Stride", quantity: 1 }],
    assemblyType: "mini_berth",
  },

  // === Mini Printer Recipes ===

  // Mining Crystals
  {
    id: "printer-synthetic-mining-lens",
    category: "Asteroid Mining Crystal",
    name: "Synthetic Mining Lens",
    runTime: 3,
    inputs: [{ name: "Silica Grains", quantity: 3 }],
    outputs: [{ name: "Synthetic Mining Lens", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-luminalis-mining-lens",
    category: "Asteroid Mining Crystal",
    name: "Luminalis Mining Lens",
    runTime: 3,
    inputs: [
      { name: "Silicon Dust", quantity: 45 },
      { name: "Luminalis", quantity: 1 },
    ],
    outputs: [{ name: "Luminalis Mining Lens", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-radiantium-mining-lens",
    category: "Asteroid Mining Crystal",
    name: "Radiantium Mining Lens",
    runTime: 3,
    inputs: [
      { name: "Silicon Dust", quantity: 45 },
      { name: "Radiantium", quantity: 1 },
    ],
    outputs: [{ name: "Radiantium Mining Lens", quantity: 1 }],
    assemblyType: "mini_printer",
  },

  // Manufacturing Components
  {
    id: "printer-thermal-composites",
    category: "Manufacturing Component",
    name: "Thermal Composites",
    runTime: 4,
    inputs: [
      { name: "Silicon Dust", quantity: 630 },
      { name: "Tholin Aggregates", quantity: 1260 },
      { name: "Feldspar Crystal Shards", quantity: 210 },
    ],
    outputs: [{ name: "Thermal Composites", quantity: 14 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-reinforced-alloys",
    category: "Manufacturing Component",
    name: "Reinforced Alloys",
    runTime: 4,
    inputs: [
      { name: "Nickel-Iron Veins", quantity: 1050 },
      { name: "Feldspar Crystal Shards", quantity: 1050 },
    ],
    outputs: [{ name: "Reinforced Alloys", quantity: 14 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-carbon-weave",
    category: "Manufacturing Component",
    name: "Carbon Weave",
    runTime: 5,
    inputs: [{ name: "Tholin Aggregates", quantity: 3150 }],
    outputs: [{ name: "Carbon Weave", quantity: 14 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-printed-circuits",
    category: "Manufacturing Component",
    name: "Printed Circuits",
    runTime: 3,
    inputs: [
      { name: "Silicon Dust", quantity: 37 },
      { name: "Tholin Aggregates", quantity: 22 },
    ],
    outputs: [{ name: "Printed Circuits", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-building-foam",
    category: "Manufacturing Component",
    name: "Building Foam",
    runTime: 25,
    inputs: [
      { name: "Reinforced Alloys", quantity: 65 },
      { name: "Carbon Weave", quantity: 65 },
      { name: "Thermal Composites", quantity: 65 },
    ],
    outputs: [{ name: "Building Foam", quantity: 10 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-echo-chamber",
    category: "Manufacturing Component",
    name: "Echo Chamber",
    runTime: 17,
    inputs: [
      { name: "Nickel-Iron Veins", quantity: 120 },
      { name: "Troilite Sulfide Grains", quantity: 45 },
      { name: "Feldspar Crystal Shards", quantity: 105 },
    ],
    outputs: [{ name: "Echo Chamber", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-still-kernel",
    category: "Manufacturing Component",
    name: "Still Kernel",
    runTime: 11,
    inputs: [
      { name: "Brine", quantity: 50 },
      { name: "Tholin Nodules", quantity: 5 },
    ],
    outputs: [{ name: "Still Kernel", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-still-knot",
    category: "Manufacturing Component",
    name: "Still Knot",
    runTime: 11,
    inputs: [
      { name: "Salt", quantity: 5 },
      { name: "Feral Echo", quantity: 5 },
    ],
    outputs: [{ name: "Still Knot", quantity: 1 }],
    assemblyType: "mini_printer",
  },

  // Exotronic Frames
  {
    id: "printer-nomad-program-frame",
    category: "Exotronic Frames",
    name: "Nomad Program Frame",
    runTime: 20,
    inputs: [{ name: "Fossilized Exotronics", quantity: 5 }],
    outputs: [{ name: "Nomad Program Frame", quantity: 1 }],
    assemblyType: "mini_printer",
  },

  // Ammunition
  {
    id: "printer-rapid-plasma-ammo-1-s",
    category: "Plasma Charge",
    name: "Rapid Plasma Ammo 1 (S)",
    runTime: 5,
    inputs: [
      { name: "Platinum-Group Veins", quantity: 400 },
      { name: "Troilite Sulfide Grains", quantity: 400 },
    ],
    outputs: [{ name: "Rapid Plasma Ammo 1 (S)", quantity: 100 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-coilgun-ammo-1-s",
    category: "Coilgun Charge",
    name: "Coilgun Ammo 1 (S)",
    runTime: 5,
    inputs: [{ name: "Nickel-Iron Veins", quantity: 230 }],
    outputs: [{ name: "Coilgun Ammo 1 (S)", quantity: 100 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-ac-gyrojet-ammo-1-s",
    category: "Gyrojet Ammunition",
    name: "AC Gyrojet Ammo 1 (S)",
    runTime: 3,
    inputs: [{ name: "Iron-Rich Nodules", quantity: 24 }],
    outputs: [{ name: "AC Gyrojet Ammo 1 (S)", quantity: 100 }],
    assemblyType: "mini_printer",
  },

  // Heat Sink
  {
    id: "printer-compressed-coolant",
    category: "Heat Sink Charge",
    name: "Compressed Coolant",
    runTime: 3,
    inputs: [
      { name: "D1 Fuel", quantity: 115 },
      { name: "Iron-Rich Nodules", quantity: 1 },
    ],
    outputs: [{ name: "Compressed Coolant", quantity: 10 }],
    assemblyType: "mini_printer",
  },

  // Fuel
  {
    id: "printer-d2-fuel",
    category: "Hydrogen Fuel",
    name: "D2 Fuel",
    runTime: 6,
    inputs: [
      { name: "Salt", quantity: 1 },
      { name: "D1 Fuel", quantity: 200 },
    ],
    outputs: [{ name: "D2 Fuel", quantity: 200 }],
    assemblyType: "mini_printer",
  },

  // Stacks (Miscellaneous)
  {
    id: "printer-carom-stack",
    category: "Miscellaneous",
    name: "Carom Stack",
    runTime: 43200,
    inputs: [
      { name: "Stack Slice 5DW", quantity: 1 },
      { name: "Stack Slice 5DE", quantity: 1 },
      { name: "Stack Slice 5C1", quantity: 1 },
      { name: "Stack Slice 31V", quantity: 1 },
      { name: "Stack Slice 31Q", quantity: 1 },
      { name: "Stack Slice 31F", quantity: 1 },
    ],
    outputs: [{ name: "Carom Stack", quantity: 1 }],
    assemblyType: "mini_printer",
  },
  {
    id: "printer-stride-stack",
    category: "Miscellaneous",
    name: "Stride Stack",
    runTime: 43200,
    inputs: [
      { name: "Stack Slice 5DZ", quantity: 1 },
      { name: "Stack Slice 5DK", quantity: 1 },
      { name: "Stack Slice 5C0", quantity: 1 },
      { name: "Stack Slice 31P", quantity: 1 },
    ],
    outputs: [{ name: "Stride Stack", quantity: 1 }],
    assemblyType: "mini_printer",
  },

  // === Assembler Recipes ===

  // Warp Scramblers
  { id: "asm-warp-entangler-ii", category: "Warp Scrambler", name: "Warp Entangler II", runTime: 181, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Carbon Weave", quantity: 3 }], outputs: [{ name: "Warp Entangler II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-warp-entangler-iii", category: "Warp Scrambler", name: "Warp Entangler III", runTime: 371, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 3 }, { name: "Carbon Weave", quantity: 3 }], outputs: [{ name: "Warp Entangler III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-warp-entangler-iv", category: "Warp Scrambler", name: "Warp Entangler IV", runTime: 777, inputs: [{ name: "Printed Circuits", quantity: 3 }, { name: "Reinforced Alloys", quantity: 3 }, { name: "Carbon Weave", quantity: 4 }], outputs: [{ name: "Warp Entangler IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-warp-entangler-v", category: "Warp Scrambler", name: "Warp Entangler V", runTime: 1585, inputs: [{ name: "Printed Circuits", quantity: 3 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Carbon Weave", quantity: 4 }], outputs: [{ name: "Warp Entangler V", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-warp-entangler-vi", category: "Warp Scrambler", name: "Warp Entangler VI", runTime: 3274, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Carbon Weave", quantity: 5 }], outputs: [{ name: "Warp Entangler VI", quantity: 1 }], assemblyType: "assembler" },

  // Energy Lances - Tuho
  { id: "asm-tuho-7", category: "Energy Lance", name: "Tuho 7", runTime: 137, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 1 }], outputs: [{ name: "Tuho 7", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-tuho-9", category: "Energy Lance", name: "Tuho 9", runTime: 301, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 2 }], outputs: [{ name: "Tuho 9", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-tuho-s", category: "Energy Lance", name: "Tuho S", runTime: 620, inputs: [{ name: "Printed Circuits", quantity: 5 }, { name: "Reinforced Alloys", quantity: 2 }], outputs: [{ name: "Tuho S", quantity: 1 }], assemblyType: "assembler" },

  // Energy Lances - Xoru
  { id: "asm-xoru-7", category: "Energy Lance", name: "Xoru 7", runTime: 664, inputs: [{ name: "Printed Circuits", quantity: 8 }, { name: "Reinforced Alloys", quantity: 2 }], outputs: [{ name: "Xoru 7", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-xoru-9", category: "Energy Lance", name: "Xoru 9", runTime: 2872, inputs: [{ name: "Printed Circuits", quantity: 8 }, { name: "Reinforced Alloys", quantity: 4 }], outputs: [{ name: "Xoru 9", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-xoru-s", category: "Energy Lance", name: "Xoru S", runTime: 11770, inputs: [{ name: "Printed Circuits", quantity: 10 }, { name: "Reinforced Alloys", quantity: 4 }], outputs: [{ name: "Xoru S", quantity: 1 }], assemblyType: "assembler" },

  // Crude Engines - Velocity
  { id: "asm-velocity-cd81", category: "Crude Engines", name: "Velocity CD81", runTime: 825, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Thermal Composites", quantity: 8 }], outputs: [{ name: "Velocity CD81", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-velocity-cd82", category: "Crude Engines", name: "Velocity CD82", runTime: 1883, inputs: [{ name: "Printed Circuits", quantity: 8 }, { name: "Reinforced Alloys", quantity: 8 }, { name: "Thermal Composites", quantity: 16 }], outputs: [{ name: "Velocity CD82", quantity: 1 }], assemblyType: "assembler" },

  // Crude Engines - Tempo
  { id: "asm-tempo-cd41", category: "Crude Engines", name: "Tempo CD41", runTime: 413, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Thermal Composites", quantity: 8 }], outputs: [{ name: "Tempo CD41", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-tempo-cd42", category: "Crude Engines", name: "Tempo CD42", runTime: 942, inputs: [{ name: "Printed Circuits", quantity: 8 }, { name: "Reinforced Alloys", quantity: 8 }, { name: "Thermal Composites", quantity: 16 }, { name: "Still Kernel", quantity: 1 }], outputs: [{ name: "Tempo CD42", quantity: 1 }], assemblyType: "assembler" },

  // Shield Hardeners - Thermal Field Array
  { id: "asm-thermal-field-array-ii", category: "Shield Hardener", name: "Thermal Field Array II", runTime: 201, inputs: [{ name: "Thermal Composites", quantity: 12 }], outputs: [{ name: "Thermal Field Array II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-thermal-field-array-iii", category: "Shield Hardener", name: "Thermal Field Array III", runTime: 426, inputs: [{ name: "Thermal Composites", quantity: 16 }], outputs: [{ name: "Thermal Field Array III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-thermal-field-array-iv", category: "Shield Hardener", name: "Thermal Field Array IV", runTime: 881, inputs: [{ name: "Thermal Composites", quantity: 19 }], outputs: [{ name: "Thermal Field Array IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-thermal-field-array-v", category: "Shield Hardener", name: "Thermal Field Array V", runTime: 1811, inputs: [{ name: "Thermal Composites", quantity: 22 }], outputs: [{ name: "Thermal Field Array V", quantity: 1 }], assemblyType: "assembler" },

  // Nanitic Braces - Thermal-electro
  { id: "asm-te-nanitic-brace-ii", category: "Nanitic Brace", name: "Thermal-electro Nanitic Brace II", runTime: 181, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Thermal-electro Nanitic Brace II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-te-nanitic-brace-iii", category: "Nanitic Brace", name: "Thermal-electro Nanitic Brace III", runTime: 405, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 9 }], outputs: [{ name: "Thermal-electro Nanitic Brace III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-te-nanitic-brace-iv", category: "Nanitic Brace", name: "Thermal-electro Nanitic Brace IV", runTime: 916, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 20 }], outputs: [{ name: "Thermal-electro Nanitic Brace IV", quantity: 1 }], assemblyType: "assembler" },

  // Nanitic Braces - Thermalnetic
  { id: "asm-tn-nanitic-brace-ii", category: "Nanitic Brace", name: "Thermalnetic Nanitic Brace II", runTime: 181, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Thermalnetic Nanitic Brace II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-tn-nanitic-brace-iii", category: "Nanitic Brace", name: "Thermalnetic Nanitic Brace III", runTime: 405, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 12 }], outputs: [{ name: "Thermalnetic Nanitic Brace III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-tn-nanitic-brace-iv", category: "Nanitic Brace", name: "Thermalnetic Nanitic Brace IV", runTime: 923, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 24 }], outputs: [{ name: "Thermalnetic Nanitic Brace IV", quantity: 1 }], assemblyType: "assembler" },

  // Stasis Webs
  { id: "asm-stasis-net-v", category: "Stasis Web", name: "Stasis Net V", runTime: 1553, inputs: [{ name: "Printed Circuits", quantity: 3 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Thermal Composites", quantity: 5 }], outputs: [{ name: "Stasis Net V", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-stasis-net-vi", category: "Stasis Web", name: "Stasis Net VI", runTime: 3192, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Thermal Composites", quantity: 6 }], outputs: [{ name: "Stasis Net VI", quantity: 1 }], assemblyType: "assembler" },

  // Armor Repair Units
  { id: "asm-armor-restorer-ii", category: "Armor Repair Unit", name: "Systematic Armor Restorer II", runTime: 111, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }], outputs: [{ name: "Systematic Armor Restorer II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-armor-restorer-iii", category: "Armor Repair Unit", name: "Systematic Armor Restorer III", runTime: 222, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Still Kernel", quantity: 1 }], outputs: [{ name: "Systematic Armor Restorer III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-armor-restorer-iv", category: "Armor Repair Unit", name: "Systematic Armor Restorer IV", runTime: 962, inputs: [{ name: "Printed Circuits", quantity: 22 }, { name: "Reinforced Alloys", quantity: 22 }, { name: "Still Kernel", quantity: 4 }], outputs: [{ name: "Systematic Armor Restorer IV", quantity: 1 }], assemblyType: "assembler" },

  // Plasma Weapons
  { id: "asm-t2-rapid-plasma-s", category: "Plasma Weapon", name: "Tier 2 Rapid Plasma (S)", runTime: 283, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Troilite Sulfide Grains", quantity: 150 }], outputs: [{ name: "Tier 2 Rapid Plasma (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t2-rapid-plasma-m", category: "Plasma Weapon", name: "Tier 2 Rapid Plasma (M)", runTime: 2727, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Troilite Sulfide Grains", quantity: 300 }], outputs: [{ name: "Tier 2 Rapid Plasma (M)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-rapid-plasma-s", category: "Plasma Weapon", name: "Tier 3 Rapid Plasma (S)", runTime: 597, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Troilite Sulfide Grains", quantity: 210 }], outputs: [{ name: "Tier 3 Rapid Plasma (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-rapid-plasma-m", category: "Plasma Weapon", name: "Tier 3 Rapid Plasma (M)", runTime: 11412, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Troilite Sulfide Grains", quantity: 420 }], outputs: [{ name: "Tier 3 Rapid Plasma (M)", quantity: 1 }], assemblyType: "assembler" },

  // Projectile Weapons
  { id: "asm-t2-autocannon-s", category: "Projectile Weapon", name: "Tier 2 Autocannon (S)", runTime: 276, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Feldspar Crystal Shards", quantity: 125 }], outputs: [{ name: "Tier 2 Autocannon (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t2-howitzer-m", category: "Projectile Weapon", name: "Tier 2 Howitzer (M)", runTime: 2667, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Feldspar Crystal Shards", quantity: 250 }], outputs: [{ name: "Tier 2 Howitzer (M)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-autocannon-s", category: "Projectile Weapon", name: "Tier 3 Autocannon (S)", runTime: 577, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Feldspar Crystal Shards", quantity: 170 }], outputs: [{ name: "Tier 3 Autocannon (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-howitzer-m", category: "Projectile Weapon", name: "Tier 3 Howitzer (M)", runTime: 11086, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Feldspar Crystal Shards", quantity: 340 }], outputs: [{ name: "Tier 3 Howitzer (M)", quantity: 1 }], assemblyType: "assembler" },

  // Mass Driver Weapons
  { id: "asm-t2-coilgun-s", category: "Mass Driver Weapon", name: "Tier 2 Coilgun (S)", runTime: 249, inputs: [{ name: "Platinum-Group Veins", quantity: 140 }, { name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 1 }], outputs: [{ name: "Tier 2 Coilgun (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t2-coilgun-m", category: "Mass Driver Weapon", name: "Tier 2 Coilgun (M)", runTime: 2457, inputs: [{ name: "Platinum-Group Veins", quantity: 70 }, { name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Palladium", quantity: 70 }], outputs: [{ name: "Tier 2 Coilgun (M)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-coilgun-s", category: "Mass Driver Weapon", name: "Tier 3 Coilgun (S)", runTime: 505, inputs: [{ name: "Platinum-Group Veins", quantity: 110 }, { name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Palladium", quantity: 110 }], outputs: [{ name: "Tier 3 Coilgun (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-t3-coilgun-m", category: "Mass Driver Weapon", name: "Tier 3 Coilgun (M)", runTime: 9935, inputs: [{ name: "Platinum-Group Veins", quantity: 440 }, { name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 2 }], outputs: [{ name: "Tier 3 Coilgun (M)", quantity: 1 }], assemblyType: "assembler" },

  // Warp Accelerators
  { id: "asm-hop", category: "Warp Accelerator", name: "Hop", runTime: 120, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 2 }], outputs: [{ name: "Hop", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-leap", category: "Warp Accelerator", name: "Leap", runTime: 320, inputs: [{ name: "Thermal Composites", quantity: 4 }, { name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }], outputs: [{ name: "Leap", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-lunge", category: "Warp Accelerator", name: "Lunge", runTime: 800, inputs: [{ name: "Thermal Composites", quantity: 8 }, { name: "Printed Circuits", quantity: 16 }, { name: "Reinforced Alloys", quantity: 16 }], outputs: [{ name: "Lunge", quantity: 1 }], assemblyType: "assembler" },

  // Flex Armor Hardeners
  { id: "asm-adaptive-nanitic-armor-weave-ii", category: "Flex Armor Hardener", name: "Adaptive Nanitic Armor Weave II", runTime: 97, inputs: [{ name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Adaptive Nanitic Armor Weave II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-adaptive-nanitic-armor-weave-iii", category: "Flex Armor Hardener", name: "Adaptive Nanitic Armor Weave III", runTime: 194, inputs: [{ name: "Thermal Composites", quantity: 1 }, { name: "Still Kernel", quantity: 1 }], outputs: [{ name: "Adaptive Nanitic Armor Weave III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-adaptive-nanitic-armor-weave-iv", category: "Flex Armor Hardener", name: "Adaptive Nanitic Armor Weave IV", runTime: 804, inputs: [{ name: "Thermal Composites", quantity: 12 }, { name: "Still Kernel", quantity: 6 }], outputs: [{ name: "Adaptive Nanitic Armor Weave IV", quantity: 1 }], assemblyType: "assembler" },

  // Propulsion Modules
  { id: "asm-afterburner-ii", category: "Propulsion Module", name: "Afterburner II", runTime: 97, inputs: [{ name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Afterburner II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-afterburner-iii", category: "Propulsion Module", name: "Afterburner III", runTime: 194, inputs: [{ name: "Thermal Composites", quantity: 1 }, { name: "Still Kernel", quantity: 1 }], outputs: [{ name: "Afterburner III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-afterburner-iv", category: "Propulsion Module", name: "Afterburner IV", runTime: 798, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Carbon Weave", quantity: 4 }, { name: "Thermal Composites", quantity: 4 }, { name: "Still Kernel", quantity: 3 }], outputs: [{ name: "Afterburner IV", quantity: 1 }], assemblyType: "assembler" },

  // Shield Generators
  { id: "asm-attuned-shield-gen-ii", category: "Defensive System", name: "Attuned Shield Generator II", runTime: 207, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Carbon Weave", quantity: 8 }], outputs: [{ name: "Attuned Shield Generator II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-attuned-shield-gen-iii", category: "Defensive System", name: "Attuned Shield Generator III", runTime: 505, inputs: [{ name: "Printed Circuits", quantity: 12 }, { name: "Carbon Weave", quantity: 24 }], outputs: [{ name: "Attuned Shield Generator III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-attuned-shield-gen-iv", category: "Defensive System", name: "Attuned Shield Generator IV", runTime: 1169, inputs: [{ name: "Printed Circuits", quantity: 31 }, { name: "Carbon Weave", quantity: 62 }], outputs: [{ name: "Attuned Shield Generator IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reinforced-shield-gen-ii", category: "Defensive System", name: "Reinforced Shield Generator II", runTime: 207, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Carbon Weave", quantity: 8 }], outputs: [{ name: "Reinforced Shield Generator II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reinforced-shield-gen-iii", category: "Defensive System", name: "Reinforced Shield Generator III", runTime: 505, inputs: [{ name: "Printed Circuits", quantity: 12 }, { name: "Carbon Weave", quantity: 24 }], outputs: [{ name: "Reinforced Shield Generator III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reinforced-shield-gen-iv", category: "Defensive System", name: "Reinforced Shield Generator IV", runTime: 1169, inputs: [{ name: "Printed Circuits", quantity: 31 }, { name: "Carbon Weave", quantity: 62 }], outputs: [{ name: "Reinforced Shield Generator IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-bulwark-shield-gen-ii", category: "Defensive System", name: "Bulwark Shield Generator II", runTime: 207, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Carbon Weave", quantity: 7 }, { name: "Palladium", quantity: 150 }], outputs: [{ name: "Bulwark Shield Generator II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-bulwark-shield-gen-iii", category: "Defensive System", name: "Bulwark Shield Generator III", runTime: 505, inputs: [{ name: "Printed Circuits", quantity: 12 }, { name: "Carbon Weave", quantity: 21 }, { name: "Palladium", quantity: 450 }], outputs: [{ name: "Bulwark Shield Generator III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-bulwark-shield-gen-iv", category: "Defensive System", name: "Bulwark Shield Generator IV", runTime: 1169, inputs: [{ name: "Printed Circuits", quantity: 31 }, { name: "Carbon Weave", quantity: 60 }, { name: "Palladium", quantity: 600 }], outputs: [{ name: "Bulwark Shield Generator IV", quantity: 1 }], assemblyType: "assembler" },

  // Armor Plates
  { id: "asm-bulky-armor-plates-ii", category: "Defensive System", name: "Bulky Armor Plates II", runTime: 155, inputs: [{ name: "Reinforced Alloys", quantity: 4 }], outputs: [{ name: "Bulky Armor Plates II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-bulky-armor-plates-iii", category: "Defensive System", name: "Bulky Armor Plates III", runTime: 357, inputs: [{ name: "Reinforced Alloys", quantity: 7 }], outputs: [{ name: "Bulky Armor Plates III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-bulky-armor-plates-v", category: "Defensive System", name: "Bulky Armor Plates V", runTime: 921, inputs: [{ name: "Reinforced Alloys", quantity: 24 }], outputs: [{ name: "Bulky Armor Plates V", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-coated-armor-plates-ii", category: "Defensive System", name: "Coated Armor Plates II", runTime: 172, inputs: [{ name: "Carbon Weave", quantity: 4 }], outputs: [{ name: "Coated Armor Plates II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-coated-armor-plates-iii", category: "Defensive System", name: "Coated Armor Plates III", runTime: 391, inputs: [{ name: "Carbon Weave", quantity: 7 }], outputs: [{ name: "Coated Armor Plates III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-coated-armor-plates-iv", category: "Defensive System", name: "Coated Armor Plates IV", runTime: 921, inputs: [{ name: "Carbon Weave", quantity: 16 }], outputs: [{ name: "Coated Armor Plates IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-nimble-armor-plates-ii", category: "Defensive System", name: "Nimble Armor Plates II", runTime: 150, inputs: [{ name: "Reinforced Alloys", quantity: 3 }, { name: "Carbon Weave", quantity: 1 }], outputs: [{ name: "Nimble Armor Plates II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-nimble-armor-plates-iii", category: "Defensive System", name: "Nimble Armor Plates III", runTime: 357, inputs: [{ name: "Reinforced Alloys", quantity: 4 }, { name: "Carbon Weave", quantity: 2 }], outputs: [{ name: "Nimble Armor Plates III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-nimble-armor-plates-iv", category: "Defensive System", name: "Nimble Armor Plates IV", runTime: 830, inputs: [{ name: "Reinforced Alloys", quantity: 8 }, { name: "Carbon Weave", quantity: 4 }], outputs: [{ name: "Nimble Armor Plates IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reactive-armor-plates-ii", category: "Defensive System", name: "Reactive Armor Plates II", runTime: 182, inputs: [{ name: "Carbon Weave", quantity: 3 }, { name: "Thermal Composites", quantity: 3 }], outputs: [{ name: "Reactive Armor Plates II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reactive-armor-plates-iii", category: "Defensive System", name: "Reactive Armor Plates III", runTime: 421, inputs: [{ name: "Carbon Weave", quantity: 6 }, { name: "Thermal Composites", quantity: 6 }], outputs: [{ name: "Reactive Armor Plates III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-reactive-armor-plates-iv", category: "Defensive System", name: "Reactive Armor Plates IV", runTime: 943, inputs: [{ name: "Carbon Weave", quantity: 11 }, { name: "Thermal Composites", quantity: 11 }], outputs: [{ name: "Reactive Armor Plates IV", quantity: 1 }], assemblyType: "assembler" },

  // Cargo Grids
  { id: "asm-cargo-grid-ii", category: "Expanded Cargohold", name: "Cargo Grid II", runTime: 209, inputs: [{ name: "Reinforced Alloys", quantity: 4 }, { name: "Carbon Weave", quantity: 7 }], outputs: [{ name: "Cargo Grid II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-cargo-grid-iii", category: "Expanded Cargohold", name: "Cargo Grid III", runTime: 469, inputs: [{ name: "Reinforced Alloys", quantity: 7 }, { name: "Carbon Weave", quantity: 13 }], outputs: [{ name: "Cargo Grid III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-cargo-grid-iv", category: "Expanded Cargohold", name: "Cargo Grid IV", runTime: 1054, inputs: [{ name: "Reinforced Alloys", quantity: 14 }, { name: "Carbon Weave", quantity: 26 }], outputs: [{ name: "Cargo Grid IV", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-cargo-grid-v", category: "Expanded Cargohold", name: "Cargo Grid V", runTime: 2339, inputs: [{ name: "Reinforced Alloys", quantity: 28 }, { name: "Carbon Weave", quantity: 52 }], outputs: [{ name: "Cargo Grid V", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-cargo-grid-vi", category: "Expanded Cargohold", name: "Cargo Grid VI", runTime: 5144, inputs: [{ name: "Reinforced Alloys", quantity: 56 }, { name: "Carbon Weave", quantity: 104 }], outputs: [{ name: "Cargo Grid VI", quantity: 1 }], assemblyType: "assembler" },

  // Celerity Engines
  { id: "asm-celerity-cd01", category: "Crude Engines", name: "Celerity CD01", runTime: 207, inputs: [{ name: "Printed Circuits", quantity: 4 }, { name: "Reinforced Alloys", quantity: 4 }, { name: "Thermal Composites", quantity: 8 }], outputs: [{ name: "Celerity CD01", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-celerity-cd02", category: "Crude Engines", name: "Celerity CD02", runTime: 471, inputs: [{ name: "Printed Circuits", quantity: 8 }, { name: "Reinforced Alloys", quantity: 8 }, { name: "Thermal Composites", quantity: 16 }, { name: "Still Kernel", quantity: 1 }], outputs: [{ name: "Celerity CD02", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-celerity-cd03", category: "Crude Engines", name: "Celerity CD03", runTime: 4230, inputs: [{ name: "Printed Circuits", quantity: 16 }, { name: "Reinforced Alloys", quantity: 16 }, { name: "Thermal Composites", quantity: 32 }, { name: "Still Kernel", quantity: 2 }], outputs: [{ name: "Celerity CD03", quantity: 1 }], assemblyType: "assembler" },

  // Crude Extractor
  { id: "asm-crude-extractor", category: "Crude Extractor", name: "Crude Extractor", runTime: 750, inputs: [{ name: "Printed Circuits", quantity: 3 }, { name: "Carbon Weave", quantity: 5 }], outputs: [{ name: "Crude Extractor", quantity: 1 }], assemblyType: "assembler" },

  // Heat Ejectors
  { id: "asm-heat-exchanger-xs", category: "Heat Ejector", name: "Heat Exchanger XS", runTime: 197, inputs: [{ name: "Reinforced Alloys", quantity: 3 }, { name: "D1 Fuel", quantity: 280 }, { name: "Palladium", quantity: 2 }], outputs: [{ name: "Heat Exchanger XS", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-heat-exchanger-s", category: "Heat Ejector", name: "Heat Exchanger S", runTime: 452, inputs: [{ name: "Platinum-Group Veins", quantity: 35 }, { name: "Reinforced Alloys", quantity: 6 }, { name: "D1 Fuel", quantity: 560 }, { name: "Palladium", quantity: 35 }], outputs: [{ name: "Heat Exchanger S", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-cryogenic-ejector-s", category: "Heat Ejector", name: "Cryogenic Ejector S", runTime: 904, inputs: [{ name: "Platinum-Group Veins", quantity: 35 }, { name: "Reinforced Alloys", quantity: 6 }, { name: "D1 Fuel", quantity: 560 }, { name: "Palladium", quantity: 35 }], outputs: [{ name: "Cryogenic Ejector S", quantity: 1 }], assemblyType: "assembler" },

  // EM Field Arrays
  { id: "asm-em-field-array-ii", category: "Shield Hardener", name: "EM Field Array II", runTime: 218, inputs: [{ name: "Carbon Weave", quantity: 12 }], outputs: [{ name: "EM Field Array II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-em-field-array-iii", category: "Shield Hardener", name: "EM Field Array III", runTime: 461, inputs: [{ name: "Carbon Weave", quantity: 16 }], outputs: [{ name: "EM Field Array III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-em-field-array-iv", category: "Shield Hardener", name: "EM Field Array IV", runTime: 949, inputs: [{ name: "Carbon Weave", quantity: 19 }], outputs: [{ name: "EM Field Array IV", quantity: 1 }], assemblyType: "assembler" },

  // Explosive Field Arrays
  { id: "asm-explosive-field-array-ii", category: "Shield Hardener", name: "Explosive Field Array II", runTime: 201, inputs: [{ name: "Reinforced Alloys", quantity: 6 }, { name: "Thermal Composites", quantity: 6 }], outputs: [{ name: "Explosive Field Array II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explosive-field-array-iii", category: "Shield Hardener", name: "Explosive Field Array III", runTime: 415, inputs: [{ name: "Reinforced Alloys", quantity: 7 }, { name: "Thermal Composites", quantity: 7 }], outputs: [{ name: "Explosive Field Array III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explosive-field-array-iv", category: "Shield Hardener", name: "Explosive Field Array IV", runTime: 863, inputs: [{ name: "Reinforced Alloys", quantity: 9 }, { name: "Thermal Composites", quantity: 8 }], outputs: [{ name: "Explosive Field Array IV", quantity: 1 }], assemblyType: "assembler" },

  // Kinetic Field Arrays
  { id: "asm-kinetic-field-array-ii", category: "Shield Hardener", name: "Kinetic Field Array II", runTime: 184, inputs: [{ name: "Reinforced Alloys", quantity: 8 }], outputs: [{ name: "Kinetic Field Array II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-kinetic-field-array-iii", category: "Shield Hardener", name: "Kinetic Field Array III", runTime: 387, inputs: [{ name: "Reinforced Alloys", quantity: 10 }], outputs: [{ name: "Kinetic Field Array III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-kinetic-field-array-iv", category: "Shield Hardener", name: "Kinetic Field Array IV", runTime: 804, inputs: [{ name: "Reinforced Alloys", quantity: 12 }], outputs: [{ name: "Kinetic Field Array IV", quantity: 1 }], assemblyType: "assembler" },

  // Hydrogen Engines
  { id: "asm-sojourn", category: "Hydrogen Engines", name: "Sojourn", runTime: 39, inputs: [{ name: "Reinforced Alloys", quantity: 2 }, { name: "Hydrocarbon Residue", quantity: 10 }], outputs: [{ name: "Sojourn", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-embark", category: "Hydrogen Engines", name: "Embark", runTime: 89, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Embark", quantity: 1 }], assemblyType: "assembler" },

  // Explo-electro Nanitic Braces
  { id: "asm-explo-electro-brace-ii", category: "Nanitic Brace", name: "Explo-electro Nanitic Brace II", runTime: 159, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Explo-electro Nanitic Brace II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explo-electro-brace-iii", category: "Nanitic Brace", name: "Explo-electro Nanitic Brace III", runTime: 350, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 3 }], outputs: [{ name: "Explo-electro Nanitic Brace III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explo-electro-brace-iv", category: "Nanitic Brace", name: "Explo-electro Nanitic Brace IV", runTime: 796, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 8 }], outputs: [{ name: "Explo-electro Nanitic Brace IV", quantity: 1 }], assemblyType: "assembler" },

  // Explonetic-electro Nanitic Braces
  { id: "asm-explonetic-electro-brace-ii", category: "Nanitic Brace", name: "Explonetic-electro Nanitic Brace II", runTime: 159, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Explonetic-electro Nanitic Brace II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explonetic-electro-brace-iii", category: "Nanitic Brace", name: "Explonetic-electro Nanitic Brace III", runTime: 362, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Explonetic-electro Nanitic Brace III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-explonetic-electro-brace-iv", category: "Nanitic Brace", name: "Explonetic-electro Nanitic Brace IV", runTime: 835, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }, { name: "Thermal Composites", quantity: 11 }], outputs: [{ name: "Explonetic-electro Nanitic Brace IV", quantity: 1 }], assemblyType: "assembler" },

  // Base Weapons
  { id: "asm-base-autocannon-s", category: "Projectile Weapon", name: "Base Autocannon (S)", runTime: 156, inputs: [{ name: "Iron-Rich Nodules", quantity: 10 }, { name: "Silica Grains", quantity: 30 }], outputs: [{ name: "Base Autocannon (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-base-howitzer-m", category: "Projectile Weapon", name: "Base Howitzer (M)", runTime: 632, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Feldspar Crystal Shards", quantity: 150 }], outputs: [{ name: "Base Howitzer (M)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-base-rapid-plasma-s", category: "Plasma Weapon", name: "Base Rapid Plasma (S)", runTime: 132, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Troilite Sulfide Grains", quantity: 90 }], outputs: [{ name: "Base Rapid Plasma (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-rapid-plasma-m", category: "Plasma Weapon", name: "Rapid Plasma (M)", runTime: 643, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Troilite Sulfide Grains", quantity: 100 }], outputs: [{ name: "Rapid Plasma (M)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-base-coilgun-s", category: "Mass Driver Weapon", name: "Base Coilgun (S)", runTime: 115, inputs: [{ name: "Platinum-Group Veins", quantity: 60 }, { name: "Printed Circuits", quantity: 1 }, { name: "Reinforced Alloys", quantity: 1 }, { name: "Palladium", quantity: 60 }], outputs: [{ name: "Base Coilgun (S)", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-base-coilgun-m", category: "Mass Driver Weapon", name: "Base Coilgun (M)", runTime: 574, inputs: [{ name: "Platinum-Group Veins", quantity: 120 }, { name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Palladium", quantity: 120 }], outputs: [{ name: "Base Coilgun (M)", quantity: 1 }], assemblyType: "assembler" },

  // Hull Repairer
  { id: "asm-hull-repairer", category: "Hull Repair Unit", name: "Hull Repairer", runTime: 148, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 2 }], outputs: [{ name: "Hull Repairer", quantity: 1 }], assemblyType: "assembler" },

  // Shield Rechargers
  { id: "asm-shield-restorer-ii", category: "Shield Recharger", name: "Shield Restorer II", runTime: 243, inputs: [{ name: "Platinum-Group Veins", quantity: 13 }, { name: "Printed Circuits", quantity: 17 }, { name: "Carbon Weave", quantity: 17 }], outputs: [{ name: "Shield Restorer II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-shield-restorer-iii", category: "Shield Recharger", name: "Shield Restorer III", runTime: 556, inputs: [{ name: "Platinum-Group Veins", quantity: 15 }, { name: "Printed Circuits", quantity: 20 }, { name: "Carbon Weave", quantity: 19 }], outputs: [{ name: "Shield Restorer III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-shield-restorer-iv", category: "Shield Recharger", name: "Shield Restorer IV", runTime: 970, inputs: [{ name: "Platinum-Group Veins", quantity: 13 }, { name: "Printed Circuits", quantity: 17 }, { name: "Carbon Weave", quantity: 17 }, { name: "Still Kernel", quantity: 3 }], outputs: [{ name: "Shield Restorer IV", quantity: 1 }], assemblyType: "assembler" },

  // Mining Lasers
  { id: "asm-small-cutting-laser", category: "Asteroid Mining Laser", name: "Small Cutting Laser", runTime: 167, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Carbon Weave", quantity: 3 }], outputs: [{ name: "Small Cutting Laser", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-medium-cutting-laser", category: "Asteroid Mining Laser", name: "Medium Cutting Laser", runTime: 863, inputs: [{ name: "Printed Circuits", quantity: 5 }, { name: "Carbon Weave", quantity: 10 }], outputs: [{ name: "Medium Cutting Laser", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-large-cutting-laser", category: "Asteroid Mining Laser", name: "Large Cutting Laser", runTime: 14863, inputs: [{ name: "Printed Circuits", quantity: 7 }, { name: "Carbon Weave", quantity: 15 }], outputs: [{ name: "Large Cutting Laser", quantity: 1 }], assemblyType: "assembler" },

  // Stasis Nets (lower tiers)
  { id: "asm-stasis-net-ii", category: "Stasis Web", name: "Stasis Net II", runTime: 178, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 2 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Stasis Net II", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-stasis-net-iii", category: "Stasis Web", name: "Stasis Net III", runTime: 366, inputs: [{ name: "Printed Circuits", quantity: 2 }, { name: "Reinforced Alloys", quantity: 3 }, { name: "Thermal Composites", quantity: 4 }], outputs: [{ name: "Stasis Net III", quantity: 1 }], assemblyType: "assembler" },
  { id: "asm-stasis-net-iv", category: "Stasis Web", name: "Stasis Net IV", runTime: 760, inputs: [{ name: "Printed Circuits", quantity: 3 }, { name: "Reinforced Alloys", quantity: 3 }, { name: "Thermal Composites", quantity: 5 }], outputs: [{ name: "Stasis Net IV", quantity: 1 }], assemblyType: "assembler" },

  // Batched Manufacturing Materials
  { id: "ptr-batched-carbon-weave", category: "Batched Material", name: "Batched Carbon Weave", runTime: 6, inputs: [{ name: "Carbon Weave", quantity: 30 }], outputs: [{ name: "Batched Carbon Weave", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-batched-printed-circuits", category: "Batched Material", name: "Batched Printed Circuits", runTime: 6, inputs: [{ name: "Printed Circuits", quantity: 30 }], outputs: [{ name: "Batched Printed Circuits", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-batched-reinforced-alloys", category: "Batched Material", name: "Batched Reinforced Alloys", runTime: 7, inputs: [{ name: "Reinforced Alloys", quantity: 30 }], outputs: [{ name: "Batched Reinforced Alloys", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-batched-thermal-composites", category: "Batched Material", name: "Batched Thermal Composites", runTime: 7, inputs: [{ name: "Thermal Composites", quantity: 30 }], outputs: [{ name: "Batched Thermal Composites", quantity: 1 }], assemblyType: "printer" },

  // Exotronic Frames
  { id: "ptr-apocalypse-protocol-frame", category: "Exotronic Frames", name: "Apocalypse Protocol Frame", runTime: 46, inputs: [{ name: "Still Knot", quantity: 5 }, { name: "Echo Chamber", quantity: 1 }, { name: "Kerogen Tar", quantity: 120 }], outputs: [{ name: "Apocalypse Protocol Frame", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-archangel-protocol-frame", category: "Exotronic Frames", name: "Archangel Protocol Frame", runTime: 31, inputs: [{ name: "Still Knot", quantity: 5 }, { name: "Echo Chamber", quantity: 1 }, { name: "Kerogen Tar", quantity: 30 }], outputs: [{ name: "Archangel Protocol Frame", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-bastion-program-frame", category: "Exotronic Frames", name: "Bastion Program Frame", runTime: 31, inputs: [{ name: "Still Knot", quantity: 5 }, { name: "Echo Chamber", quantity: 1 }, { name: "Kerogen Tar", quantity: 30 }], outputs: [{ name: "Bastion Program Frame", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-exterminata-protocol-frame", category: "Exotronic Frames", name: "Exterminata Protocol Frame", runTime: 31, inputs: [{ name: "Still Knot", quantity: 1 }, { name: "Echo Chamber", quantity: 1 }, { name: "Kerogen Tar", quantity: 30 }], outputs: [{ name: "Exterminata Protocol Frame", quantity: 1 }], assemblyType: "printer" },

  // Asteroid Mining Crystals
  { id: "ptr-eclipsite-mining-lens", category: "Asteroid Mining Crystal", name: "Eclipsite Mining Lens", runTime: 6, inputs: [{ name: "Silicon Dust", quantity: 80 }, { name: "Eclipsite", quantity: 1 }], outputs: [{ name: "Eclipsite Mining Lens", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-granocite-mining-lens", category: "Asteroid Mining Crystal", name: "Granocite Mining Lens", runTime: 5, inputs: [{ name: "Silicon Dust", quantity: 45 }, { name: "Granocite", quantity: 1 }], outputs: [{ name: "Granocite Mining Lens", quantity: 1 }], assemblyType: "printer" },

  // Nanite Sequencers
  { id: "ptr-em-nanite-sequencer", category: "Nanite Sequencer", name: "EM Nanite Sequencer", runTime: 49, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Carbon Weave", quantity: 1 }], outputs: [{ name: "EM Nanite Sequencer", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-explosive-nanite-sequencer", category: "Nanite Sequencer", name: "Explosive Nanite Sequencer", runTime: 222, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Explosive Nanite Sequencer", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-kinetic-nanite-sequencer", category: "Nanite Sequencer", name: "Kinetic Nanite Sequencer", runTime: 222, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Kinetic Nanite Sequencer", quantity: 1 }], assemblyType: "printer" },
  { id: "ptr-thermal-nanite-sequencer", category: "Nanite Sequencer", name: "Thermal Nanite Sequencer", runTime: 222, inputs: [{ name: "Printed Circuits", quantity: 1 }, { name: "Thermal Composites", quantity: 1 }], outputs: [{ name: "Thermal Nanite Sequencer", quantity: 1 }], assemblyType: "printer" },

  // Tier 2 Ammunition
  { id: "ptr-ac-gyrojet-ammo-2-s", category: "Gyrojet Ammunition", name: "AC Gyrojet Ammo 2 (S)", runTime: 5, inputs: [{ name: "Nickel-Iron Veins", quantity: 230 }], outputs: [{ name: "AC Gyrojet Ammo 2 (S)", quantity: 100 }], assemblyType: "printer" },
  { id: "ptr-ac-gyrojet-ammo-3-s", category: "Gyrojet Ammunition", name: "AC Gyrojet Ammo 3 (S)", runTime: 5, inputs: [{ name: "Nickel-Iron Veins", quantity: 230 }], outputs: [{ name: "AC Gyrojet Ammo 3 (S)", quantity: 100 }], assemblyType: "printer" },
  { id: "ptr-em-disintegrator-charge-m", category: "EM Charge", name: "EM Disintegrator Charge (M)", runTime: 3, inputs: [{ name: "Nickel-Iron Veins", quantity: 60 }, { name: "Platinum-Group Veins", quantity: 60 }], outputs: [{ name: "EM Disintegrator Charge (M)", quantity: 100 }], assemblyType: "printer" },
  { id: "ptr-em-disintegrator-charge-s", category: "EM Charge", name: "EM Disintegrator Charge (S)", runTime: 3, inputs: [{ name: "Nickel-Iron Veins", quantity: 20 }, { name: "Platinum-Group Veins", quantity: 20 }], outputs: [{ name: "EM Disintegrator Charge (S)", quantity: 100 }], assemblyType: "printer" },
  { id: "ptr-rapid-plasma-ammo-2-s", category: "Plasma Charge", name: "Rapid Plasma Ammo 2 (S)", runTime: 5, inputs: [{ name: "Platinum-Group Veins", quantity: 400 }, { name: "Troilite Sulfide Grains", quantity: 400 }], outputs: [{ name: "Rapid Plasma Ammo 2 (S)", quantity: 100 }], assemblyType: "printer" },

  // Fusion Fuel
  { id: "ptr-sof-80-fuel", category: "Fusion Fuel", name: "SOF-80 Fuel", runTime: 30, inputs: [{ name: "Catalytic Dust", quantity: 44 }, { name: "SOF-40 Fuel", quantity: 500 }], outputs: [{ name: "SOF-80 Fuel", quantity: 500 }], assemblyType: "printer" },

  // === Berth Recipes (full-size ship berth) ===

  // Frigates
  {
    id: "berth-lorha",
    category: "Frigate",
    name: "LORHA",
    runTime: 8320,
    inputs: [
      { name: "Bastion Program Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 58 },
      { name: "Batched Carbon Weave", quantity: 29 },
      { name: "Batched Thermal Composites", quantity: 29 },
    ],
    outputs: [{ name: "LORHA", quantity: 1 }],
    assemblyType: "berth",
  },
  {
    id: "berth-haf",
    category: "Frigate",
    name: "HAF",
    runTime: 82800,
    inputs: [
      { name: "Exterminata Protocol Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 160 },
      { name: "Batched Carbon Weave", quantity: 74 },
      { name: "Batched Thermal Composites", quantity: 74 },
    ],
    outputs: [{ name: "HAF", quantity: 1 }],
    assemblyType: "berth",
  },
  {
    id: "berth-lai",
    category: "Frigate",
    name: "LAI",
    runTime: 78000,
    inputs: [
      { name: "Exterminata Protocol Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 80 },
      { name: "Batched Carbon Weave", quantity: 70 },
      { name: "Batched Thermal Composites", quantity: 70 },
      { name: "Still Kernel", quantity: 4 },
    ],
    outputs: [{ name: "LAI", quantity: 1 }],
    assemblyType: "berth",
  },
  {
    id: "berth-mcf",
    category: "Frigate",
    name: "MCF",
    runTime: 79200,
    inputs: [
      { name: "Exterminata Protocol Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 88 },
      { name: "Batched Carbon Weave", quantity: 48 },
      { name: "Batched Thermal Composites", quantity: 48 },
      { name: "Still Kernel", quantity: 3 },
    ],
    outputs: [{ name: "MCF", quantity: 1 }],
    assemblyType: "berth",
  },
  {
    id: "berth-usv",
    category: "Frigate",
    name: "USV",
    runTime: 8200,
    inputs: [
      { name: "Archangel Protocol Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 56 },
      { name: "Batched Carbon Weave", quantity: 28 },
      { name: "Batched Thermal Composites", quantity: 28 },
    ],
    outputs: [{ name: "USV", quantity: 1 }],
    assemblyType: "berth",
  },

  // Destroyers
  {
    id: "berth-tades",
    category: "Destroyer",
    name: "TADES",
    runTime: 151200,
    inputs: [
      { name: "Apocalypse Protocol Frame", quantity: 1 },
      { name: "Batched Reinforced Alloys", quantity: 124 },
      { name: "Batched Carbon Weave", quantity: 72 },
      { name: "Batched Thermal Composites", quantity: 72 },
      { name: "Still Kernel", quantity: 4 },
    ],
    outputs: [{ name: "TADES", quantity: 1 }],
    assemblyType: "berth",
  },
];

export function getRecipesForAssembly(
  assemblyType: Recipe["assemblyType"],
): Recipe[] {
  return recipes.filter((r) => r.assemblyType === assemblyType);
}

export function getRecipeCategories(
  assemblyType: Recipe["assemblyType"],
): string[] {
  const cats = new Set(
    recipes
      .filter((r) => r.assemblyType === assemblyType)
      .map((r) => r.category),
  );
  return Array.from(cats);
}
