import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/system/Chart";
import { Button } from "@/components/ui/route-button";
import { RollingNumber } from "@/components/system/LatencyValue";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/api")({
  head: () => ({
    meta: [
      { title: "api — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "keys, quota and request examples for the route api." },
      { property: "og:title", content: "api — route workspace" },
      { property: "og:description", content: "keys, quota and request examples for the route api." },
    ],
  }),
  component: ApiPage,
});

const SNIPPETS = {
  curl: `curl -X POST https://api.sho.rt/v1/links \\
  -H "authorization: Bearer rt_live_••••••••" \\
  -H "content-type: application/json" \\
  -d '{"destination":"https://example.com/long/path"}'`,
  node: `const res = await fetch("https://api.sho.rt/v1/links", {
  method: "POST",
  headers: {
    authorization: \`Bearer \${process.env.ROUTE_KEY}\`,
    "content-type": "application/json",
  },
  body: JSON.stringify({ destination: "https://example.com/long/path" }),
});
const { code, short_url } = await res.json();`,
  response: `{
  "code": "k7fq2",
  "short_url": "sho.rt/k7fq2",
  "destination": "https://example.com/long/path",
  "created_at": "2026-08-16T11:42:07Z"
}`,
} as const;

type Tab = keyof typeof SNIPPETS;

function ApiPage() {
  const [tab, setTab] = useState<Tab>("curl");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <AppShell title="api" meta={<span className="label-mono">v1 · rest</span>}>
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Panel label="keys" className="lg:col-span-2">
          <ul className="divide-y divide-hairline">
            {[
              { name: "production", key: "rt_live_9f2c41ba77de", created: "aug 04" },
              { name: "staging", key: "rt_test_4ab8129cf013", created: "jul 28" },
            ].map((entry) => (
              <li key={entry.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-2 py-3.5">
                <span className="font-mono text-[0.8125rem] text-graphite">{entry.name}</span>
                <span className="num text-[0.8125rem] text-secondary">
                  {revealed ? entry.key : `${entry.key.slice(0, 8)}••••••••`}
                </span>
                <span className="label-mono">created {entry.created}</span>
                <button
                  type="button"
                  onClick={() => copy(entry.key, entry.name)}
                  className="ml-auto font-mono text-[0.75rem] text-secondary underline decoration-hairline underline-offset-4 transition-colors hover:text-graphite"
                >
                  {copied === entry.name ? "copied" : "copy"}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            <Button type="button" variant="quiet" onClick={() => setRevealed((v) => !v)} className="font-mono">
              {revealed ? "hide keys" : "reveal keys"}
            </Button>
            <Button type="button" className="font-mono">
              <span className="text-[0.8125rem]">create key</span>
            </Button>
          </div>
        </Panel>

        <Panel label="quota · this month">
          <RollingNumber value={18422} group className="text-[2rem] leading-none text-graphite" />
          <p className="label-mono mt-2">of 50,000 requests</p>
          <span className="mt-5 block h-px w-full bg-hairline">
            <span className="block h-px bg-signal" style={{ width: "37%" }} />
          </span>
          <dl className="mt-5 space-y-2">
            {[
              ["rate limit", "60 req / min"],
              ["errors · 24h", "0.02%"],
              ["region", "eu-central"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between">
                <dt className="font-mono text-[0.8125rem] text-secondary">{label}</dt>
                <dd className="font-mono text-[0.8125rem] text-graphite">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel
          label="create a link"
          className="lg:col-span-3"
          action={
            <div className="flex items-center gap-4">
              {(Object.keys(SNIPPETS) as Tab[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "font-mono text-[0.75rem] transition-colors duration-[var(--t-micro)]",
                    tab === item
                      ? "text-graphite underline decoration-signal decoration-1 underline-offset-[6px]"
                      : "text-secondary hover:text-graphite",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <div className="relative overflow-x-auto rounded-md border border-hairline bg-paper p-4">
            <pre className="font-mono text-[0.8125rem] leading-[1.7] text-graphite">
              {SNIPPETS[tab]}
            </pre>
            <button
              type="button"
              onClick={() => copy(SNIPPETS[tab], "snippet")}
              className="absolute top-3 right-3 font-mono text-[0.75rem] text-secondary underline decoration-hairline underline-offset-4 transition-colors hover:text-graphite"
            >
              {copied === "snippet" ? "copied" : "copy"}
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
