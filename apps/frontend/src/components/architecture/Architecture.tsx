import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/route-button";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

type NodeId = "browser" | "gateway" | "router" | "b01" | "b02" | "postgres";

const NOTES: Record<NodeId, string> = {
  browser: "issues the request for a short code",
  gateway: "auth, rate limits, request context",
  router: "health-aware backend selection",
  b01: "application instance, stateless",
  b02: "application instance, stateless",
  postgres: "durable code → destination mapping",
};

const EDGES: { id: string; from: NodeId; to: NodeId; d: string }[] = [
  { id: "e1", from: "browser", to: "gateway", d: "M96 150 H196" },
  { id: "e2", from: "gateway", to: "router", d: "M256 150 H352" },
  { id: "e3", from: "router", to: "b01", d: "M406 150 C450 150 450 74 500 74" },
  { id: "e4", from: "router", to: "b02", d: "M406 150 C450 150 450 226 500 226" },
  { id: "e5", from: "b01", to: "postgres", d: "M596 74 C650 74 650 150 700 150" },
  { id: "e6", from: "b02", to: "postgres", d: "M596 226 C650 226 650 150 700 150" },
];

const NODE_POS: Record<NodeId, { x: number; y: number; label: string; anchor: "start" | "middle" | "end" }> = {
  browser: { x: 40, y: 150, label: "browser", anchor: "start" },
  gateway: { x: 200, y: 150, label: "gateway", anchor: "start" },
  router: { x: 356, y: 150, label: "router", anchor: "start" },
  b01: { x: 504, y: 74, label: "backend 01", anchor: "start" },
  b02: { x: 504, y: 226, label: "backend 02", anchor: "start" },
  postgres: { x: 704, y: 150, label: "postgres", anchor: "start" },
};

export function Architecture() {
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [down, setDown] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function simulate() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDown(true);
    setMessage("backend 02 removed from active pool");
    timers.current.push(
      setTimeout(() => setMessage("health check passed · backend 02 restored"), 4200),
    );
    timers.current.push(
      setTimeout(() => {
        setDown(false);
      }, 4200),
    );
    timers.current.push(setTimeout(() => setMessage(null), 7600));
  }

  const isDim = (node: NodeId) => hovered !== null && hovered !== node;
  const edgeState = (edge: { from: NodeId; to: NodeId }) => {
    const offline = down && (edge.from === "b02" || edge.to === "b02");
    const related = hovered !== null && (edge.from === hovered || edge.to === hovered);
    return { offline, related };
  };

  return (
    <section
      id="architecture"
      aria-labelledby="arch-heading"
      className="border-t border-hairline py-24 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <h2 id="arch-heading" className="display-md max-w-[28rem] text-graphite">
            simple at the edge. deliberate underneath.
          </h2>
          <div>
            <Button
              type="button"
              variant="quiet"
              onClick={simulate}
              className="font-mono"
              aria-describedby="failure-status"
            >
              simulate node failure
            </Button>
            <p
              id="failure-status"
              role="status"
              aria-live="polite"
              className="mt-3 font-mono text-[0.75rem] text-secondary"
            >
              {message ?? "\u00a0"}
            </p>
          </div>
        </div>

        {/* desktop canvas */}
        <div className="grid-texture mt-14 hidden overflow-hidden rounded-[18px] border border-hairline bg-surface md:block">
          <svg viewBox="0 0 800 300" className="h-auto w-full" role="img" aria-label="system architecture: browser to gateway to router, two backend instances, postgres">
            {EDGES.map((edge) => {
              const { offline, related } = edgeState(edge);
              return (
                <path
                  key={edge.id}
                  d={edge.d}
                  fill="none"
                  stroke={related ? "var(--signal)" : "var(--graphite)"}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className="transition-opacity duration-300"
                  opacity={offline ? 0.12 : hovered ? (related ? 1 : 0.18) : 0.45}
                  strokeDasharray={offline ? "3 4" : undefined}
                />
              );
            })}

            {(Object.keys(NODE_POS) as NodeId[]).map((id) => {
              const node = NODE_POS[id];
              const offline = down && id === "b02";
              return (
                <g
                  key={id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}: ${NOTES[id]}`}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  className="cursor-default transition-transform duration-300"
                  style={{
                    transform: hovered === id ? "translate(0,-3px)" : undefined,
                    opacity: isDim(id) ? 0.4 : 1,
                  }}
                >
                  <circle
                    cx={node.x - 8}
                    cy={node.y}
                    r="3"
                    fill={offline ? "var(--muted)" : hovered === id ? "var(--signal)" : "var(--graphite)"}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor={node.anchor}
                    fontFamily="var(--font-mono)"
                    fontSize="12"
                    fill={offline ? "var(--muted)" : "var(--graphite)"}
                  >
                    {node.label}
                  </text>
                  {(id === "b01" || id === "b02") && (
                    <text
                      x={node.x}
                      y={node.y + 20}
                      fontFamily="var(--font-mono)"
                      fontSize="9.5"
                      fill={offline ? "var(--muted)" : "var(--secondary)"}
                    >
                      {offline ? "unavailable" : "healthy"}
                    </text>
                  )}
                  {hovered === id && (
                    <text
                      x={id === "postgres" ? 792 : node.x}
                      y={node.y - 16}
                      textAnchor={id === "postgres" ? "end" : "start"}
                      fontFamily="var(--font-mono)"
                      fontSize="9.5"
                      fill="var(--secondary)"
                    >
                      {NOTES[id]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* mobile: vertical route */}
        <ul className="mt-12 md:hidden">
          {(["browser", "gateway", "router", "b01", "b02", "postgres"] as NodeId[]).map(
            (id, index, all) => {
              const offline = down && id === "b02";
              return (
                <li key={id}>
                  <div className="flex items-center gap-3">
                    <StatusDot tone={offline ? "down" : "neutral"} />
                    <span
                      className={cn(
                        "font-mono text-[0.875rem]",
                        offline ? "text-muted" : "text-graphite",
                      )}
                    >
                      {NODE_POS[id].label}
                    </span>
                    {(id === "b01" || id === "b02") && (
                      <span className="font-mono text-[0.75rem] text-muted">
                        {offline ? "unavailable" : "healthy"}
                      </span>
                    )}
                  </div>
                  <p className="ml-[10px] border-l border-hairline py-2 pl-4 text-[0.8125rem] text-secondary">
                    {NOTES[id]}
                  </p>
                  {index === all.length - 1 ? null : null}
                </li>
              );
            },
          )}
        </ul>
      </div>
    </section>
  );
}
