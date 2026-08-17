import { Latency } from "@/components/system/LatencyValue";
import { cn } from "@/lib/utils";

export type StageStatus = "pending" | "active" | "complete" | "failed";

export interface RouteEvent {
  stage: string;
  latencyMs: number | null;
  status: StageStatus;
  note?: string | undefined;
}

const dotTone: Record<StageStatus, string> = {
  pending: "bg-muted",
  active: "bg-signal",
  complete: "bg-signal",
  failed: "bg-failure",
};

/**
 * The route, rendered vertically. Reused by the hero trace, the auth pages,
 * link detail and the system health surface. State drives every visual.
 */
export function RouteColumn({
  events,
  label,
  trailing,
  totalMs,
  className,
}: {
  events: RouteEvent[];
  label?: string | undefined;
  trailing?: string | undefined;
  totalMs?: number | null | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <div className="mb-5 flex items-baseline gap-3">
          <span className="label-mono">{label}</span>
        </div>
      ) : null}

      <ol className="space-y-0">
        {events.map((event, index) => (
          <li key={event.stage}>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "size-[5px] shrink-0 rounded-full transition-colors duration-[var(--t-control)]",
                  dotTone[event.status],
                  event.status === "active" && "breathe",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "font-mono text-[0.8125rem] transition-colors duration-[var(--t-control)]",
                  event.status === "pending" ? "text-muted" : "text-graphite",
                )}
              >
                {event.stage}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[0.75rem] text-secondary">
                {event.note ??
                  (event.latencyMs !== null && event.status !== "pending" ? (
                    <Latency ms={event.latencyMs} />
                  ) : null)}
              </span>
            </div>
            {index < events.length - 1 ? (
              <span
                className={cn(
                  "ml-[2px] block h-7 w-px transition-colors duration-[var(--t-control)]",
                  event.status === "pending" ? "bg-hairline" : "bg-hairline-strong",
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>

      {totalMs != null || trailing ? (
        <div className="mt-5 flex items-baseline justify-between border-t border-hairline pt-3">
          <span className="font-mono text-[0.8125rem] text-secondary">{trailing ?? "total"}</span>
          {totalMs != null ? (
            <Latency ms={totalMs} className="text-[0.8125rem] text-signal" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function TraceBadge({ live = false }: { live?: boolean | undefined }) {
  return (
    <span className="label-mono inline-flex items-center gap-1.5">
      <span
        className={cn("size-[4px] rounded-full", live ? "bg-signal breathe" : "bg-muted")}
        aria-hidden="true"
      />
      {live ? "live trace" : "demo trace"}
    </span>
  );
}
