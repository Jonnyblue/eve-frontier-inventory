import { useRef, useEffect, useState, useCallback } from "react";
import { useUniverseMap, useGateLinks } from "./useUniverseMap";
import type { SystemPoint, GateLink } from "./useUniverseMap";
import { useKillboard } from "./useKillboard";
import type { AssemblyData } from "./useInventory";

// ---------------------------------------------------------------------------
// 3D helpers
// ---------------------------------------------------------------------------

// Rotate a point around Y then X axes. Returns [x2, y2, z2].
function rotate3D(
  nx: number, ny: number, nz: number,
  rotX: number, rotY: number,
): [number, number, number] {
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  // Y-axis rotation
  const x1 = nx * cosY + nz * sinY;
  const z1 = -nx * sinY + nz * cosY;
  // X-axis rotation
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const y2 = ny * cosX - z1 * sinX;
  const z2 = ny * sinX + z1 * cosX;
  return [x1, y2, z2];
}

// ---------------------------------------------------------------------------
// Paste structures parser
// ---------------------------------------------------------------------------
const PASTE_STORAGE_KEY = "eve-frontier-pasted-structures";

interface PastedStructure {
  systemName: string;
  kind: string;
  online: boolean;
}

function parsePaste(text: string): PastedStructure[] {
  const results: PastedStructure[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const parts = line.split(/\t+|\s{3,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    const [systemName, kind, statusStr = ""] = parts;
    results.push({ systemName, kind, online: statusStr.toUpperCase() === "ONLINE" });
  }
  return results;
}

function buildStructuresFromPaste(
  pasted: PastedStructure[],
  byName: Map<string, SystemPoint>,
): AssemblyData[] {
  return pasted.flatMap(({ systemName, kind, online }) => {
    const sys = byName.get(systemName.toUpperCase());
    if (!sys) return [];
    return [{
      id: `pasted-${sys.id}-${kind}`,
      itemId: 0, kind, name: kind, typeId: 0,
      statusOnline: online, ownerCapId: "", energySourceId: "",
      locationHash: "", solarSystemId: sys.id,
      maxCapacity: 0, usedCapacity: 0, items: [], connectedAssemblyIds: [],
    }];
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function UniverseMap({ structures = [] }: { structures?: AssemblyData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { systems, isLoading, progress, error } = useUniverseMap();
  const { data: kills } = useKillboard();
  const [showLinks, setShowLinks] = useState(false);
  const { links: gateLinks, isLoading: linksLoading, progress: linksProgress } = useGateLinks(showLinks);

  // Camera: orbit around origin, offsetX/Y is a 2D screen-space pan on top
  // Axis convention: (nx, nz, -ny) → (scene x, scene y, scene z) per community findings
  const cam = useRef({ offsetX: 0, offsetY: 0, scale: 0.85, rotX: 0.15, rotY: 0.3, pivotX: 0, pivotY: 0, pivotZ: 0 });
  const drag = useRef({ active: false, button: 0, lastMX: 0, lastMY: 0, totalDist: 0 });
  const size = useRef({ w: 900, h: 600 });

  // Data refs
  const systemsRef = useRef<SystemPoint[]>([]);
  const byIdRef = useRef(new Map<number, SystemPoint>());
  const byNameRef = useRef(new Map<string, SystemPoint>());
  const killCountsRef = useRef(new Map<number, number>());
  const showKillsRef = useRef(true);
  const showLinksRef = useRef(false);
  const gateLinksRef = useRef<GateLink[]>([]);
  const hovIdRef = useRef<number | null>(null);
  const structuresRef = useRef<AssemblyData[]>([]);

  // Pasted structures
  const [pasteText, setPasteText] = useState(() => localStorage.getItem(PASTE_STORAGE_KEY) ?? "");
  const [showPaste, setShowPaste] = useState(false);
  const [pastedStructures, setPastedStructures] = useState<AssemblyData[]>(() => {
    const saved = localStorage.getItem(PASTE_STORAGE_KEY) ?? "";
    return saved ? buildStructuresFromPaste(parsePaste(saved), new Map()) : [];
  });

  // UI state
  const [hovered, setHovered] = useState<{ sys: SystemPoint; kills: number; structs: AssemblyData[]; x: number; y: number } | null>(null);
  const [showKills, setShowKills] = useState(true);
  const [killWindow, setKillWindow] = useState<number>(24); // hours; 0 = all time
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  // ----- stable draw (reads only refs) -----
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !systemsRef.current.length) return;
    const ctx = canvas.getContext("2d")!;
    const { w: W, h: H } = size.current;
    const { offsetX, offsetY, scale, rotX, rotY, pivotX, pivotY, pivotZ } = cam.current;
    const ppu = Math.min(W, H) * scale;
    const kc = killCountsRef.current;
    const showK = showKillsRef.current;
    const hovId = hovIdRef.current;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // --- Pass 1: project all systems (needed for gate links spanning screen edge) ---
    const proj = new Map<number, [number, number, number]>(); // id -> [sx, sy, z2]
    const back: [number, number][] = [];
    const mid: [number, number][] = [];
    const front: [number, number][] = [];
    const killDots: [number, number, number, number][] = []; // sx,sy,count,z2
    let hovSys: [number, number] | null = null;

    for (const sys of systemsRef.current) {
      const [x2, y2, z2] = rotate3D(sys.nx - pivotX, sys.nz - pivotY, -sys.ny - pivotZ, rotX, rotY);
      const sx = x2 * ppu + W / 2 + offsetX;
      const sy = -y2 * ppu + H / 2 + offsetY;
      proj.set(sys.id, [sx, sy, z2]);
      if (sx < -6 || sx > W + 6 || sy < -6 || sy > H + 6) continue;

      if (sys.id === hovId) { hovSys = [sx, sy]; continue; }

      const n = kc.get(sys.id) ?? 0;
      if (n > 0 && showK) { killDots.push([sx, sy, n, z2]); continue; }

      if (z2 < -0.08) back.push([Math.round(sx), Math.round(sy)]);
      else if (z2 < 0.08) mid.push([Math.round(sx), Math.round(sy)]);
      else front.push([Math.round(sx), Math.round(sy)]);
    }

    // --- Gate links (drawn beneath dots) ---
    const links = gateLinksRef.current;
    if (showLinksRef.current && links.length > 0) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [aId, bId] of links) {
        const a = proj.get(aId);
        const b = proj.get(bId);
        if (!a || !b) continue;
        if (a[0] < -50 && b[0] < -50) continue;
        if (a[0] > W + 50 && b[0] > W + 50) continue;
        if (a[1] < -50 && b[1] < -50) continue;
        if (a[1] > H + 50 && b[1] > H + 50) continue;
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
    }

    // Sub-pixel points when zoomed out, circles only when zoomed in
    const r = Math.max(0.4, Math.min(3, scale * 0.18));

    // Draw depth layers as white dots with opacity variation (back=dim, front=bright)
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (const [sx, sy] of back) { ctx.moveTo(sx + r, sy); ctx.arc(sx, sy, r, 0, Math.PI * 2); }
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (const [sx, sy] of mid) { ctx.moveTo(sx + r, sy); ctx.arc(sx, sy, r, 0, Math.PI * 2); }
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (const [sx, sy] of front) { ctx.moveTo(sx + r, sy); ctx.arc(sx, sy, r, 0, Math.PI * 2); }
    ctx.fill();

    // Kill dots — size + brightness scaled by depth
    for (const [sx, sy, n, z2] of killDots) {
      const depthScale = 0.8 + (z2 + 0.5) * 0.4; // ~0.6–1.0
      const r = Math.min((1.5 + n * 0.45) * depthScale, 7);
      const a = Math.min((0.55 + n * 0.06) * (0.7 + (z2 + 0.5) * 0.3), 1);
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = n >= 5 ? `rgba(234,179,8,${a})` : `rgba(239,68,68,${a})`;
      ctx.fill();
    }

    // Structure markers (hub + connected assemblies)
    for (const asm of structuresRef.current) {
      const sys = byIdRef.current.get(asm.solarSystemId);
      if (!sys) continue;
      const [x2, y2, z2] = rotate3D(sys.nx - pivotX, sys.nz - pivotY, -sys.ny - pivotZ, rotX, rotY);
      const sx = x2 * ppu + W / 2 + offsetX;
      const sy = -y2 * ppu + H / 2 + offsetY;
      if (sx < -12 || sx > W + 12 || sy < -12 || sy > H + 12) continue;
      const depthA = 0.6 + (z2 + 0.5) * 0.4;
      const online = asm.statusOnline;
      const isHub = asm.kind.toLowerCase().includes("node") || asm.kind.toLowerCase().includes("hub");
      const r = isHub ? 7 : 5;
      ctx.beginPath();
      ctx.arc(Math.round(sx), Math.round(sy), r, 0, Math.PI * 2);
      ctx.fillStyle = online
        ? `rgba(0, 230, 180, ${Math.min(1, depthA * 0.85)})`
        : `rgba(120, 120, 120, ${Math.min(1, depthA * 0.7)})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(Math.round(sx), Math.round(sy), r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = online
        ? `rgba(0, 230, 180, ${Math.min(1, depthA * 0.35)})`
        : `rgba(120, 120, 120, ${Math.min(1, depthA * 0.25)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Hovered / selected system
    if (hovSys) {
      const [sx, sy] = hovSys;
      ctx.beginPath();
      ctx.arc(sx, sy, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }, []);

  // Sync data → refs
  useEffect(() => {
    systemsRef.current = systems;
    const byId = new Map<number, SystemPoint>();
    const byName = new Map<string, SystemPoint>();
    systems.forEach((s) => { byId.set(s.id, s); byName.set(s.name.toUpperCase(), s); });
    byIdRef.current = byId;
    byNameRef.current = byName;
    // Re-resolve pasted structures now that we have system name lookup
    const saved = localStorage.getItem(PASTE_STORAGE_KEY) ?? "";
    if (saved) setPastedStructures(buildStructuresFromPaste(parsePaste(saved), byName));
    draw();
  }, [systems, draw]);

  useEffect(() => {
    const all = [...structures, ...pastedStructures].filter((s) => s.solarSystemId > 0);
    structuresRef.current = all;
    draw();
  }, [structures, pastedStructures, draw]);

  useEffect(() => {
    const m = new Map<number, number>();
    const cutoff = killWindow > 0 ? Date.now() - killWindow * 3_600_000 : 0;
    for (const k of kills ?? []) {
      if (!k.solarSystemId) continue;
      if (cutoff > 0 && k.killTimestamp < cutoff) continue;
      m.set(k.solarSystemId, (m.get(k.solarSystemId) ?? 0) + 1);
    }
    killCountsRef.current = m;
    draw();
  }, [kills, killWindow, draw]);

  useEffect(() => {
    showKillsRef.current = showKills;
    draw();
  }, [showKills, draw]);

  useEffect(() => {
    showLinksRef.current = showLinks;
    draw();
  }, [showLinks, draw]);

  useEffect(() => {
    gateLinksRef.current = gateLinks;
    draw();
  }, [gateLinks, draw]);

  // Canvas resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      size.current = { w: canvas.width, h: canvas.height };
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // ----- hover: screen-space search (24k iterations, precomputed trig) -----
  const findHovered = useCallback((mx: number, my: number): SystemPoint | null => {
    const { w: W, h: H } = size.current;
    const { offsetX, offsetY, scale, rotX, rotY, pivotX, pivotY, pivotZ } = cam.current;
    const ppu = Math.min(W, H) * scale;
    const RADIUS_SQ = 100; // 10px²
    let nearest: SystemPoint | null = null;
    let minDist = RADIUS_SQ;
    for (const sys of systemsRef.current) {
      const [x2, y2] = rotate3D(sys.nx - pivotX, sys.nz - pivotY, -sys.ny - pivotZ, rotX, rotY);
      const sx = x2 * ppu + W / 2 + offsetX;
      const sy = -y2 * ppu + H / 2 + offsetY;
      const d = (sx - mx) ** 2 + (sy - my) ** 2;
      if (d < minDist) { minDist = d; nearest = sys; }
    }
    return nearest;
  }, []);

  // ----- event handlers -----
  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { mx: e.clientX - r.left, my: e.clientY - r.top };
  };

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getPos(e);
    drag.current = { active: true, button: e.button, lastMX: mx, lastMY: my, totalDist: 0 };
    setCursor("grabbing");
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getPos(e);

    if (drag.current.active) {
      const dx = mx - drag.current.lastMX;
      const dy = my - drag.current.lastMY;
      drag.current.totalDist += Math.abs(dx) + Math.abs(dy);
      drag.current.lastMX = mx;
      drag.current.lastMY = my;

      if (drag.current.button === 0) {
        // Left drag → 3D orbit
        cam.current.rotY += dx * 0.005;
        cam.current.rotX += dy * 0.005;
        // Clamp pitch so you can't flip upside down
        cam.current.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cam.current.rotX));
      } else {
        // Right drag → pan
        cam.current.offsetX += dx;
        cam.current.offsetY += dy;
      }
      draw();
      return;
    }

    // Hover
    const nearest = findHovered(mx, my);
    if (nearest?.id !== hovIdRef.current) {
      hovIdRef.current = nearest?.id ?? null;
      draw();
    }
    setHovered(nearest
      ? { sys: nearest, kills: killCountsRef.current.get(nearest.id) ?? 0, structs: structuresRef.current.filter(s => s.solarSystemId === nearest.id), x: mx, y: my }
      : null,
    );
  }, [draw, findHovered]);

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const wasDrag = drag.current.totalDist > 5;
    drag.current.active = false;
    setCursor("grab");

    if (e.button === 0 && !wasDrag) {
      // Click → make this star the rotation pivot (it snaps to canvas centre)
      const { mx, my } = getPos(e);
      const nearest = findHovered(mx, my);
      if (nearest) {
        const { w: W, h: H } = size.current;
        cam.current.pivotX = nearest.nx;
        cam.current.pivotY = nearest.nz;
        cam.current.pivotZ = -nearest.ny;
        cam.current.offsetX = 0;
        cam.current.offsetY = 0;
        hovIdRef.current = nearest.id;
        setHovered({ sys: nearest, kills: killCountsRef.current.get(nearest.id) ?? 0, structs: structuresRef.current.filter(s => s.solarSystemId === nearest.id), x: W / 2, y: H / 2 });
        draw();
      }
    }
  }, [draw, findHovered]);

  const onMouseLeave = useCallback(() => {
    drag.current.active = false;
    setCursor("grab");
    hovIdRef.current = null;
    setHovered(null);
    draw();
  }, [draw]);

  // Non-passive wheel listener — must be added imperatively so preventDefault works
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1 / 1.12 : 1.12;
      cam.current.scale = Math.max(0.003, Math.min(500, cam.current.scale * factor));
      draw();
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [draw]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q || !systemsRef.current.length) return;
    const sys = systemsRef.current.find((s) => s.name.toLowerCase().includes(q));
    if (sys) {
      // Centre on system and zoom in
      const { w: W, h: H } = size.current;
      cam.current.scale = 3;
      cam.current.pivotX = sys.nx;
      cam.current.pivotY = sys.nz;
      cam.current.pivotZ = -sys.ny;
      cam.current.offsetX = 0;
      cam.current.offsetY = 0;
      hovIdRef.current = sys.id;
      setHovered({ sys, kills: killCountsRef.current.get(sys.id) ?? 0, structs: structuresRef.current.filter(s => s.solarSystemId === sys.id), x: W / 2, y: H / 2 });
      draw();
    }
  };

  const resetView = () => {
    cam.current = { offsetX: 0, offsetY: 0, scale: 0.85, rotX: 0.15, rotY: 0.3, pivotX: 0, pivotY: 0, pivotZ: 0 };
    draw();
  };

  const tooltipW = 210;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            className="search-input"
            style={{ marginBottom: 0, width: "200px" }}
            placeholder="Jump to system..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" style={{ fontSize: "0.8rem", padding: "4px 12px" }}>Go</button>
        </form>
        <button
          onClick={() => setShowKills((v) => !v)}
          style={{
            fontSize: "0.8rem", padding: "4px 12px",
            background: showKills ? "rgba(239,68,68,0.15)" : "transparent",
            border: "1px solid var(--color-border)",
            color: showKills ? "#ef4444" : "var(--color-text-muted)",
          }}
        >
          {showKills ? "Hide" : "Show"} Kills
        </button>
        {showKills && (
          <select
            value={killWindow}
            onChange={(e) => setKillWindow(Number(e.target.value))}
            style={{
              fontSize: "0.8rem", padding: "4px 8px",
              background: "#0b0b0b",
              border: "1px solid rgba(250,250,229,0.2)",
              color: "rgba(250,250,229,0.7)",
            }}
          >
            <option value={1} style={{ background: "#0b0b0b", color: "#fafae5" }}>Last 1h</option>
            <option value={6} style={{ background: "#0b0b0b", color: "#fafae5" }}>Last 6h</option>
            <option value={24} style={{ background: "#0b0b0b", color: "#fafae5" }}>Last 24h</option>
            <option value={72} style={{ background: "#0b0b0b", color: "#fafae5" }}>Last 3d</option>
            <option value={168} style={{ background: "#0b0b0b", color: "#fafae5" }}>Last 7d</option>
            <option value={0} style={{ background: "#0b0b0b", color: "#fafae5" }}>All time</option>
          </select>
        )}
        <button
          onClick={() => setShowLinks((v) => !v)}
          style={{
            fontSize: "0.8rem", padding: "4px 12px",
            background: showLinks ? "rgba(80,150,230,0.15)" : "transparent",
            border: "1px solid var(--color-border)",
            color: showLinks ? "rgba(80,150,230,1)" : "var(--color-text-muted)",
          }}
        >
          {showLinks ? "Hide" : "Show"} Gates
          {linksLoading && ` (${linksProgress}%)`}
        </button>
        <button onClick={resetView} style={{ fontSize: "0.8rem", padding: "4px 12px" }}>
          Reset View
        </button>
        <button
          onClick={() => setShowPaste((v) => !v)}
          style={{
            fontSize: "0.8rem", padding: "4px 12px",
            background: pastedStructures.length > 0 ? "rgba(0,230,180,0.15)" : "transparent",
            border: "1px solid var(--color-border)",
            color: pastedStructures.length > 0 ? "rgba(0,230,180,1)" : "var(--color-text-muted)",
          }}
        >
          Structures {pastedStructures.length > 0 ? `(${new Set(pastedStructures.map(s => s.solarSystemId)).size} systems)` : ""}
        </button>
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          Scroll = zoom · Left drag = rotate · Right drag = pan · Click star = centre
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          {systems.length > 0 && `${systems.length.toLocaleString()} systems`}
          {(kills?.length ?? 0) > 0 && ` · ${Array.from(killCountsRef.current.values()).reduce((a, b) => a + b, 0)} kills`}
        </span>
      </div>

      {showPaste && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <textarea
            style={{
              width: "100%", height: "120px", background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)", color: "var(--color-text)",
              fontFamily: "monospace", fontSize: "0.78rem", padding: "8px",
              resize: "vertical", boxSizing: "border-box",
            }}
            placeholder={"Paste your structure list from the in-game Structure window:\nUSK-VMB\tField Printer\tONLINE\nUSK-VMB\tRefinery\tONLINE"}
            value={pasteText}
            onChange={(e) => {
              const text = e.target.value;
              setPasteText(text);
              localStorage.setItem(PASTE_STORAGE_KEY, text);
              setPastedStructures(buildStructuresFromPaste(parsePaste(text), byNameRef.current));
            }}
          />
          {pastedStructures.length === 0 && pasteText.trim() && (
            <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>No systems matched — check system names are exact.</span>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          position: "relative", width: "100%",
          height: "calc(100vh - 220px)", minHeight: "400px",
          borderRadius: "4px", overflow: "hidden",
          border: "1px solid var(--color-border)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", cursor }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onContextMenu={(e) => e.preventDefault()}
        />

        {isLoading && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px",
            background: "rgba(8,8,14,0.92)",
          }}>
            <div style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              Loading universe... {progress}%
            </div>
            <div style={{ width: "240px", height: "4px", background: "var(--color-border)", borderRadius: "2px" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--color-accent)", borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Cached after first load</div>
          </div>
        )}

        {error && !isLoading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="error">Failed to load map: {error}</div>
          </div>
        )}

        {hovered && (
          <div style={{
            position: "absolute",
            left: Math.min(hovered.x + 14, (size.current.w || 900) - tooltipW - 8),
            top: Math.max(hovered.y - 48, 4),
            width: tooltipW,
            background: "rgba(8,8,14,0.97)",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            padding: "8px 10px", fontSize: "0.8rem",
            pointerEvents: "none", zIndex: 10,
          }}>
            <div style={{ fontFamily: "Frontier Disket Mono, monospace", color: "var(--color-accent)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px" }}>
              {hovered.sys.name}
            </div>
            {hovered.kills > 0 && (
              <div style={{ color: "#ef4444", fontSize: "0.72rem", marginBottom: "4px" }}>
                {hovered.kills} kill{hovered.kills !== 1 ? "s" : ""}
              </div>
            )}
            {hovered.structs.length > 0 && (
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {hovered.structs.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: s.statusOnline ? "rgba(0,230,180,0.9)" : "rgba(120,120,120,0.7)", display: "inline-block" }} />
                    <span style={{ color: s.statusOnline ? "var(--color-text)" : "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.kind}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isLoading && systems.length > 0 && (
          <div style={{
            position: "absolute", bottom: "12px", right: "12px",
            background: "rgba(8,8,14,0.85)", border: "1px solid var(--color-border)",
            borderRadius: "4px", padding: "8px 12px", fontSize: "0.72rem",
            color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "4px",
          }}>
            {[
              { size: 6, color: "rgba(255,255,255,0.65)", label: "System" },
              { size: 8, color: "rgba(239,68,68,0.9)", label: "1–4 kills" },
              { size: 10, color: "rgba(234,179,8,0.9)", label: "5+ kills" },
              { size: 8, color: "rgba(0,230,180,0.85)", label: "My structures" },
              ...(showLinks ? [{ size: 6, color: "rgba(255,255,255,0.35)", label: "Gate link", line: true }] : []),
            ].map(({ size: s, color, label, line }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {line
                  ? <span style={{ display: "inline-block", width: 16, height: 1, background: color }} />
                  : <span style={{ display: "inline-block", width: s, height: s, borderRadius: "50%", background: color }} />
                }
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
