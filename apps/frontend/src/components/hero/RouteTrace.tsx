import { CHECKPOINTS, type Checkpoint, type ShortenStatus } from "@/hooks/useShortenUrl";
import { cn } from "@/lib/utils";

const X0 = 24;
const X1 = 776;

/**
 * The live route: a thin path under the input. A signal packet travels along it
 * while the request is in flight, passing labeled instrumentation checkpoints.
 */
export function RouteTrace({
  status,
  checkpoint,
  runKey,
}: {
  status: ShortenStatus;
  checkpoint: Checkpoint | null;
  runKey: number;
}) {
  const active = status === "validating" || status === "submitting";
  const done = status === "success";
  const reachedIndex = checkpoint ? CHECKPOINTS.indexOf(checkpoint) : -1;

  const progress = done ? 1 : reachedIndex >= 0 ? (reachedIndex + 1) / CHECKPOINTS.length : 0;

  return (
    <div className="relative select-none" aria-hidden="true">
      {/* progress rail lives in dom space: svg dashes scale badly under preserveAspectRatio none */}
      <div
        className="pointer-events-none absolute top-[7px] h-px bg-signal transition-[width] duration-500 ease-out sm:top-[14px]"
        style={{ left: "3%", width: `calc(${progress} * 94%)` }}
      />
      <svg viewBox="0 0 800 44" className="h-6 w-full sm:h-11" fill="none" preserveAspectRatio="none">
        <line
          x1={X0}
          y1="14"
          x2={X1}
          y2="14"
          stroke="var(--hairline)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {CHECKPOINTS.map((point, index) => {
          const x = X0 + ((X1 - X0) * (index + 0.5)) / CHECKPOINTS.length;
          const passed = done || index <= reachedIndex;
          return (
            <g key={point}>
              <circle
                cx={x}
                cy="14"
                r={passed ? 3 : 2}
                fill={passed ? "var(--signal)" : "var(--muted)"}
                className="transition-all duration-300"
              />
              <text
                x={x}
                y="34"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.6"
                fill={passed ? "var(--secondary)" : "var(--muted)"}
                className="trace-label transition-colors duration-300"
              >

                {point}
              </text>
            </g>
          );
        })}
        <path
          d={`M${X1 - 8} 10 L${X1} 14 L${X1 - 8} 18`}
          stroke="var(--muted)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {active ? (
          <circle
            key={runKey}
            cx={X0}
            cy="14"
            r="3.5"
            fill="var(--signal)"
            className={cn("packet-run")}
            style={{ ["--packet-distance" as string]: `${X1 - X0}px` }}
          />
        ) : null}
      </svg>
    </div>
  );
}
