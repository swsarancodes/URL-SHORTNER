import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/system/Chart";
import { Button } from "@/components/ui/route-button";
import { Switch } from "@/components/ui/switch";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "settings — route workspace" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "account, default link behaviour and workspace preferences." },
      { property: "og:title", content: "settings — route workspace" },
      { property: "og:description", content: "account, default link behaviour and workspace preferences." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { session, signOut } = useWorkspace();
  const [domain, setDomain] = useState("sho.rt");
  const [redirect301, setRedirect301] = useState(true);
  const [expiry, setExpiry] = useState(false);
  const [alerts, setAlerts] = useState(true);

  return (
    <AppShell title="settings" meta={<span className="label-mono">workspace preferences</span>}>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel label="account">
          <Row label="email" value={session?.email ?? "demo@route.dev"} />
          <Row label="plan" value="engineering · demo" />
          <Row label="member since" value="aug 2026" />
          <Button type="button" variant="quiet" onClick={signOut} className="mt-5 font-mono">
            sign out
          </Button>
        </Panel>

        <Panel label="default link behaviour">
          <label className="block">
            <span className="label-mono mb-2 block">short domain</span>
            <input
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              className="w-full rounded-md border border-hairline bg-paper px-3 py-2.5 font-mono text-[0.875rem] text-graphite outline-none transition-colors duration-[var(--t-micro)] focus:border-signal"
            />
          </label>

          <div className="mt-6 space-y-4">
            <Toggle
              label="permanent redirects (301)"
              hint="302 keeps the lookup dynamic; 301 lets browsers cache the route."
              checked={redirect301}
              onChange={setRedirect301}
            />
            <Toggle
              label="expire new links after 30 days"
              hint="applies only to links created from now on."
              checked={expiry}
              onChange={setExpiry}
            />
            <Toggle
              label="alert me on node failover"
              hint="one message per incident, not per request."
              checked={alerts}
              onChange={setAlerts}
            />
          </div>
        </Panel>

        <Panel label="infrastructure" className="lg:col-span-2">
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <Row label="gateway region" value="eu-central · single controlled edge" />
            <Row label="backend pool" value="3 nodes · health-checked every 5s" />
            <Row label="database" value="postgres 16 · indexed code lookup" />
            <Row label="cache" value="in-memory hot codes · 60s ttl" />
          </div>
          <p className="label-mono mt-5 leading-relaxed">
            values describe the demo topology of this system design project.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline py-3 last:border-0">
      <span className="font-mono text-[0.8125rem] text-secondary">{label}</span>
      <span className="font-mono text-[0.8125rem] text-graphite">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <p className="font-mono text-[0.8125rem] text-graphite">{label}</p>
        <p className="label-mono mt-1 leading-relaxed">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}
