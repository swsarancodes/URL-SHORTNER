import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { AreaTrace, Panel, ShareRows } from "@/components/system/Chart";
import { RouteColumn, TraceBadge } from "@/components/system/RouteColumn";
import { Latency, RollingNumber } from "@/components/system/LatencyValue";
import { useLiveLatency, useRedirectFeed } from "@/hooks/useLiveTelemetry";
import { useWorkspace } from "@/lib/workspace-store";
import { REFERRERS, formatAgo, numberFmt } from "@/lib/demo-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "overview — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "system state, redirect volume and the live route." },
      { property: "og:title", content: "overview — route workspace" },
      { property: "og:description", content: "system state, redirect volume and the live route." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { links } = useWorkspace();
  const { stages, total } = useLiveLatency();
  const feed = useRedirectFeed(7);

  const active = links.filter((link) => link.state === "active");
  const visits = links.reduce((sum, link) => sum + link.visits, 0);
  const combined = links[0]?.series ?? [];

  return (
    <AppShell title="overview" meta={<TraceBadge live />}>
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Panel label="redirects · 24h" className="lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <RollingNumber value={visits} group className="text-[2.5rem] leading-none text-graphite" />
              <p className="label-mono mt-2">total across {active.length} active routes</p>
            </div>
            <div className="text-right">
              <Latency ms={total} className="text-[1.25rem] text-signal" />
              <p className="label-mono mt-1">median redirect</p>
            </div>
          </div>
          <AreaTrace series={combined} className="mt-6" />
          <div className="mt-2 flex justify-between">
            <span className="label-mono">14 d ago</span>
            <span className="label-mono">now</span>
          </div>
        </Panel>

        <Panel label="the route, right now">
          <RouteColumn
            events={[
              { stage: "gateway", latencyMs: stages.gateway, status: "complete" },
              { stage: "routing", latencyMs: stages.routing, status: "complete" },
              { stage: "lookup", latencyMs: stages.lookup, status: "complete" },
              { stage: "response", latencyMs: stages.response, status: "active" },
            ]}
            totalMs={total}
          />
          <p className="label-mono mt-5 leading-relaxed">
            illustrative telemetry from a development environment.
          </p>
        </Panel>

        <Panel
          label="live redirects"
          className="lg:col-span-2"
          action={
            <Link to="/app/activity" className="label-mono underline decoration-hairline underline-offset-4 hover:text-graphite">
              full activity
            </Link>
          }
        >
          <ul className="divide-y divide-hairline">
            {feed.map((event) => (
              <li
                key={event.id}
                className="rail-in grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-baseline gap-4 py-2.5 font-mono text-[0.8125rem]"
              >
                <span className="num text-muted">{event.time}</span>
                <span className="truncate text-graphite">/{event.code}</span>
                <span className="label-mono">{event.country}</span>
                <Latency ms={event.latencyMs} className="text-secondary" />
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-5">
          <Panel label="top routes">
            <ul className="space-y-3.5">
              {active.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <Link
                    to="/app/links/$linkId"
                    params={{ linkId: link.id }}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3"
                  >
                    <span className="truncate font-mono text-[0.8125rem] text-graphite group-hover:text-signal">
                      /{link.code}
                    </span>
                    <span className="num text-[0.8125rem] text-secondary">
                      {numberFmt.format(link.visits)}
                    </span>
                    <span className="label-mono col-span-2 truncate">
                      {formatAgo(link.lastOpenedSecondsAgo)} · {link.destination}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel label="sources">
            <ShareRows rows={REFERRERS.slice(0, 4)} />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
