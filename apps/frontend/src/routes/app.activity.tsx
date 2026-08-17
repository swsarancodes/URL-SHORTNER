import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/system/Chart";
import { RouteColumn, TraceBadge } from "@/components/system/RouteColumn";
import { Latency } from "@/components/system/LatencyValue";
import { useRedirectFeed } from "@/hooks/useLiveTelemetry";
import { ACTIVITY } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { title: "activity — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "a chronological log of redirects, link changes and system events." },
      { property: "og:title", content: "activity — route workspace" },
      { property: "og:description", content: "a chronological log of redirects, link changes and system events." },
    ],
  }),
  component: Activity,
});

const FILTERS = ["all", "redirects", "links", "system"] as const;

function Activity() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const feed = useRedirectFeed(6);
  const rows = ACTIVITY.filter((entry) => filter === "all" || entry.kind === filter);

  return (
    <AppShell title="activity" meta={<TraceBadge live />}>
      <div className="mb-6 flex items-center gap-4">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "font-mono text-[0.8125rem] transition-colors duration-[var(--t-micro)]",
              filter === item
                ? "text-graphite underline decoration-signal decoration-1 underline-offset-[6px]"
                : "text-secondary hover:text-graphite",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Panel label="event log" className="lg:col-span-2">
          <ol className="relative space-y-0 pl-5">
            <span className="absolute top-2 bottom-2 left-[3px] w-px bg-hairline" aria-hidden="true" />
            {rows.map((entry) => (
              <li key={`${entry.time}-${entry.label}`} className="relative py-3">
                <span
                  className={cn(
                    "absolute top-[18px] -left-5 size-[5px] rounded-full",
                    entry.kind === "system" ? "bg-[color:var(--warning)]" : "bg-hairline-strong",
                  )}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="num text-[0.75rem] text-muted">{entry.time}</span>
                  <span className="font-mono text-[0.8125rem] text-graphite">{entry.label}</span>
                  {entry.meta ? (
                    <span className="label-mono ml-auto">{entry.meta}</span>
                  ) : null}
                </div>
              </li>
            ))}
            {rows.length === 0 ? (
              <li className="py-8 font-mono text-[0.8125rem] text-secondary">
                nothing logged in this category yet.
              </li>
            ) : null}
          </ol>
        </Panel>

        <div className="grid gap-5">
          <Panel label="live redirects">
            <ul className="divide-y divide-hairline">
              {feed.map((event) => (
                <li
                  key={event.id}
                  className="rail-in flex items-baseline gap-3 py-2 font-mono text-[0.8125rem]"
                >
                  <span className="num text-muted">{event.time}</span>
                  <span className="truncate text-graphite">/{event.code}</span>
                  <Latency ms={event.latencyMs} className="ml-auto text-secondary" />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel label="last incident">
            <RouteColumn
              events={[
                { stage: "gateway", latencyMs: 8, status: "complete" },
                { stage: "node 02", latencyMs: null, status: "failed", note: "504" },
                { stage: "node 01 (rerouted)", latencyMs: 11, status: "complete" },
                { stage: "response", latencyMs: 3, status: "complete" },
              ]}
              trailing="recovered in"
              totalMs={62}
            />
            <p className="label-mono mt-4 leading-relaxed">
              node 02 left the active pool at 11:35:41 and returned after two passing health checks.
            </p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
