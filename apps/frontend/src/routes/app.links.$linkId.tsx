import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ColumnTrace, Panel, ShareRows } from "@/components/system/Chart";
import { RouteColumn, TraceBadge } from "@/components/system/RouteColumn";
import { Latency, RollingNumber } from "@/components/system/LatencyValue";
import { Button } from "@/components/ui/route-button";
import { useLiveLatency } from "@/hooks/useLiveTelemetry";
import { useWorkspace } from "@/lib/workspace-store";
import { COUNTRIES, DEVICES, REFERRERS, formatAgo } from "@/lib/demo-data";

export const Route = createFileRoute("/app/links/$linkId")({
  head: () => ({
    meta: [
      { title: "link detail — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "one route, its redirect path, volume and sources." },
      { property: "og:title", content: "link detail — route workspace" },
      { property: "og:description", content: "one route, its redirect path, volume and sources." },
    ],
  }),
  component: LinkDetail,
});

function LinkDetail() {
  const { linkId } = useParams({ from: "/app/links/$linkId" });
  const { links, setLinkState, removeLink } = useWorkspace();
  const { stages, total } = useLiveLatency();
  const [copied, setCopied] = useState(false);
  const link = links.find((item) => item.id === linkId);

  if (!link) {
    return (
      <AppShell title="link not found">
        <p className="font-mono text-[0.875rem] text-secondary">
          this route no longer exists.{" "}
          <Link to="/app/links" className="text-signal underline underline-offset-4">
            back to links
          </Link>
        </p>
      </AppShell>
    );
  }

  async function onCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(`https://sho.rt/${link.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <AppShell
      title={`/${link.code}`}
      meta={
        <span className="label-mono truncate">
          {link.state} · created {link.createdAt} · opened {formatAgo(link.lastOpenedSecondsAgo)}
        </span>
      }
    >
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Panel label="short link" className="lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="truncate font-mono text-[1.5rem] text-signal underline decoration-1 underline-offset-[6px]">
                sho.rt/{link.code}
              </p>
              <p className="mt-3 truncate font-mono text-[0.8125rem] text-muted">
                → {link.destination}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="quiet" onClick={onCopy} className="font-mono">
                {copied ? "copied" : "copy"}
              </Button>
              <Button
                type="button"
                variant="quiet"
                onClick={() => setLinkState(link.id, link.state === "active" ? "disabled" : "active")}
                className="font-mono"
              >
                {link.state === "active" ? "disable" : "enable"}
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Metric label="redirects" value={link.visits} />
            <Metric label="last 24h" value={link.series.at(-1) ?? 0} />
            <div>
              <Latency ms={total} className="text-[1.5rem] text-signal" />
              <p className="label-mono mt-1">median redirect</p>
            </div>
          </div>
        </Panel>

        <Panel label="redirect path" action={<TraceBadge live />}>
          <RouteColumn
            events={[
              { stage: "gateway", latencyMs: stages.gateway, status: "complete" },
              { stage: "routing", latencyMs: stages.routing, status: "complete" },
              { stage: `lookup /${link.code}`, latencyMs: stages.lookup, status: "complete" },
              { stage: "301 response", latencyMs: stages.response, status: "active" },
            ]}
            totalMs={total}
          />
        </Panel>

        <Panel label="volume · 14 d" className="lg:col-span-2">
          <ColumnTrace series={link.series} />
          <div className="mt-3 flex justify-between">
            <span className="label-mono">14 d ago</span>
            <span className="label-mono">today</span>
          </div>
        </Panel>

        <div className="grid gap-5">
          <Panel label="sources">
            <ShareRows rows={REFERRERS.slice(0, 3)} />
          </Panel>
          <Panel label="devices">
            <ShareRows rows={DEVICES} suffix="%" />
          </Panel>
        </div>

        <Panel label="geography" className="lg:col-span-2">
          <ShareRows rows={COUNTRIES} />
        </Panel>

        <Panel label="danger">
          <p className="font-mono text-[0.8125rem] leading-relaxed text-secondary">
            deleting a route stops resolving it immediately. inbound requests receive a 404.
          </p>
          <Button
            type="button"
            variant="quiet"
            onClick={() => removeLink(link.id)}
            className="mt-4 font-mono text-[color:var(--failure)]"
          >
            delete route
          </Button>
        </Panel>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <RollingNumber value={value} group className="text-[1.5rem] text-graphite" />
      <p className="label-mono mt-1">{label}</p>
    </div>
  );
}
