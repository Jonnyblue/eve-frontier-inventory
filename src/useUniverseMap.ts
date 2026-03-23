import { useMemo } from "react";

export interface SystemPoint {
  id: number;
  name: string;
  nx: number; // world-space, centred at 0, uniform scale across x/y/z
  ny: number;
  nz: number;
  regionId: number;
}

// [minId, maxId] — always deduplicated so each link stored once
export type GateLink = [number, number];

// Static data — regenerate with: pnpm fetch-map-data
let systemsData: SystemPoint[] | null = null;
let gateLinksData: GateLink[] | null = null;

async function loadSystems(): Promise<SystemPoint[]> {
  if (systemsData) return systemsData;
  const mod = await import("./data/systems.json");
  systemsData = mod.default as SystemPoint[];
  return systemsData;
}

async function loadGateLinks(): Promise<GateLink[]> {
  if (gateLinksData) return gateLinksData;
  const mod = await import("./data/gateLinks.json");
  gateLinksData = mod.default as GateLink[];
  return gateLinksData;
}

import { useState, useEffect } from "react";

export function useUniverseMap() {
  const [systems, setSystems] = useState<SystemPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystems()
      .then((data) => {
        setSystems(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setIsLoading(false);
      });
  }, []);

  return { systems, isLoading, progress: isLoading ? 0 : 100, error };
}

export function useGateLinks(enabled: boolean) {
  const [links, setLinks] = useState<GateLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setIsLoading(true);
    loadGateLinks()
      .then((data) => {
        setLinks(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [enabled]);

  return { links, isLoading, progress: isLoading ? 50 : 100 };
}

export function useSystemById(systems: SystemPoint[]) {
  return useMemo(() => {
    const m = new Map<number, SystemPoint>();
    systems.forEach((s) => m.set(s.id, s));
    return m;
  }, [systems]);
}
