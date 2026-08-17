import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { AreaTrace } from "@/components/system/Chart";
import { useWorkspace } from "@/lib/workspace-store";
import { formatAgo, numberFmt, type LinkState } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/links/")({
  head: () => ({
    meta: [
      { title: "links — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "every route you own, with state, volume and destination." },
      { property: "og:title", content: "links — route workspace" },
      { property: "og:description", content: "every route you own, with state, volume and destination." },
    ],
  }),
  component: LinksIndex,
});

const FILTERS: Array<{ value: LinkState | "all"; label: string }> = [
  { value: "all", label: "all" },
  { value: "active", label: "active" },
  { value: "disabled", label: "disabled" },
  { value: "expired", label: "expired" },
];

const stateTone: Record<LinkState, string> = {
  active: "text-signal",
  disabled: "text-secondary",
  expired: "text-[color:var(--warning)]",
};

function LinksIndex() {
  const { links } = useWorkspace();
  const [filter, setFilter] = useState<LinkState | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      links.filter((link) => {
        if (filter !== "all" && link.state !== filter) return false;
        if (!query.trim()) return true;
        const needle = query.trim().toLowerCase();
        return (
          link.code.includes(needle) ||
          link.destination.toLowerCase().includes(needle) ||
          link.title.toLowerCase().includes(needle)
        );
      }),
    [links, filter, query],
  );

  return (
    <AppShell title="links" meta={<span className="label-mono">{rows.length} routes</span>}>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-4">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "font-mono text-[0.8125rem] transition-colors duration-[var(--t-micro)]",
                filter === item.value
                  ? "text-graphite underline decoration-signal decoration-1 underline-offset-[6px]"
                  : "text-secondary hover:text-graphite",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="filter by code, label or destination"
          className="ml-auto w-full max-w-[300px] rounded-md border border-hairline bg-surface px-3 py-2 font-mono text-[0.8125rem] text-graphite outline-none transition-colors duration-[var(--t-micro)] placeholder:text-muted focus:border-signal"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="hidden grid-cols-[130px_minmax(0,1fr)_100px_90px_120px] gap-4 border-b border-hairline px-5 py-3 lg:grid">
          {["code", "destination", "redirects", "state", "14 d"].map((head) => (
            <span key={head} className="label-mono">
              {head}
            </span>
          ))}
        </div>

        <ul className="divide-y divide-hairline">
          {rows.map((link) => (
            <li key={link.id}>
              <Link
                to="/app/links/$linkId"
                params={{ linkId: link.id }}
                className="group grid gap-x-4 gap-y-2 px-5 py-4 transition-colors duration-[var(--t-micro)] hover:bg-surface-secondary lg:grid-cols-[130px_minmax(0,1fr)_100px_90px_120px] lg:items-center"
              >
                <span className="font-mono text-[0.875rem] text-graphite group-hover:text-signal">
                  /{link.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[0.8125rem] text-secondary">
                    {link.destination}
                  </span>
                  <span className="label-mono mt-1 block truncate">
                    {link.title} · created {link.createdAt} · opened {formatAgo(link.lastOpenedSecondsAgo)}
                  </span>
                </span>
                <span className="num text-[0.8125rem] text-graphite">
                  {numberFmt.format(link.visits)}
                </span>
                <span className={cn("font-mono text-[0.75rem]", stateTone[link.state])}>
                  {link.state}
                </span>
                <AreaTrace series={link.series} height={28} className="hidden lg:block" />
              </Link>
            </li>
          ))}
          {rows.length === 0 ? (
            <li className="px-5 py-10 text-center font-mono text-[0.8125rem] text-secondary">
              no routes match this filter.
            </li>
          ) : null}
        </ul>
      </div>
    </AppShell>
  );
}
