import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { AreaTrace, ColumnTrace, Panel, ShareRows } from "@/components/system/Chart";
import { Latency, RollingNumber } from "@/components/system/LatencyValue";
import { TraceBadge } from "@/components/system/RouteColumn";
import { useLiveLatency } from "@/hooks/useLiveTelemetry";
import { useWorkspace } from "@/lib/workspace-store";
import { COUNTRIES, DEVICES, REFERRERS, volumeSeries } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "analytics — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "redirect volume, latency distribution, sources and geography." },
      { property: "og:title", content: "analytics — route workspace" },
      { property: "og:description", content: "redirect volume, latency distribution, sources and geography." },
    ],
  }),
  component: Analytics,
});

const RANGES = ["24h", "7d", "30d", "90d"] as const;

function Analytics() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("7d");
  const { links } = useWorkspace();
  const { total } = useLiveLatency();

  const points = { "24h": 24, "7d": 14, "30d": 30, "90d": 45 }[range];
  const series = volumeSeries(points, 180, 220, points);
  const visits = links.reduce((sum, link) => sum + link.visits, 0);
  const latency = volumeSeries(18, 22, 16, 3);

  return (
    <AppShell title="analytics" meta={<TraceBadge />}>
      <div className="mb-6 flex items-center gap-4">
        {RANGES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRange(item)}
            className={cn(
              "font-mono text-[0.8125rem] transition-colors duration-[var(--t-micro)]",
              range === item
                ? "text-graphite underline decoration-signal decoration-1 underline-offset-[6px]"
                : "text-secondary hover:text-graphite",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Panel label={`redirects · ${range}`} className="lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <RollingNumber value={visits} group className="text-[2rem] leading-none text-graphite" />
              <p className="label-mono mt-2">resolved requests</p>
            </div>
            <div className="text-right">
              <Latency ms={total} className="text-[1.25rem] text-signal" />
              <p className="label-mono mt-1">p50 end to end</p>
            </div>
          </div>
          <AreaTrace series={series} className="mt-6" height={180} />
        </Panel>

        <Panel label="latency distribution">
          <ColumnTrace series={latency} height={180} />
          <dl className="mt-5 space-y-2">
            {[
              ["p50", total],
              ["p90", total + 11],
              ["p99", total + 34],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-baseline justify-between">
                <dt className="font-mono text-[0.8125rem] text-secondary">{label}</dt>
                <dd>
                  <Latency ms={Number(value)} className="text-[0.8125rem] text-graphite" />
                </dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel label="sources">
          <ShareRows rows={REFERRERS} />
        </Panel>
        <Panel label="geography">
          <ShareRows rows={COUNTRIES} />
        </Panel>
        <Panel label="devices">
          <ShareRows rows={DEVICES} suffix="%" />
        </Panel>
      </div>

      <p className="label-mono mt-6">
        figures are illustrative demo data, not measured production traffic.
      </p>
    </AppShell>
  );
}
