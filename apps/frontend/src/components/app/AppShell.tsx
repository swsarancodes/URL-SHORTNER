import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Mark } from "@/components/navigation/Navigation";
import { Latency } from "@/components/system/LatencyValue";
import { CommandMenu } from "@/components/app/CommandMenu";
import { NewLinkPanel } from "@/components/app/NewLinkPanel";
import { useLiveLatency } from "@/hooks/useLiveTelemetry";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/route-button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "overview", exact: true },
  { to: "/app/links", label: "links", exact: false },
  { to: "/app/analytics", label: "analytics", exact: false },
  { to: "/app/activity", label: "activity", exact: false },
  { to: "/app/api", label: "api", exact: false },
  { to: "/app/settings", label: "settings", exact: false },
] as const;

export function AppShell({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { session, signOut } = useWorkspace();
  const { total } = useLiveLatency();
  const [commandOpen, setCommandOpen] = useState(false);
  const [newLinkOpen, setNewLinkOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="border-hairline lg:sticky lg:top-0 lg:h-dvh lg:border-r">
        <div className="flex items-center gap-2.5 px-6 py-6 text-graphite">
          <Mark className="h-4 w-7 shrink-0" />
          <span className="text-[0.9375rem] font-medium tracking-[-0.02em]">route</span>
          <span className="label-mono ml-auto">workspace</span>
        </div>

        <nav aria-label="workspace" className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:gap-0">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 font-mono text-[0.8125rem] transition-colors duration-[var(--t-micro)]",
                  active ? "text-graphite" : "text-secondary hover:text-graphite",
                )}
              >
                <span
                  className={cn(
                    "size-[4px] rounded-full transition-colors duration-[var(--t-micro)]",
                    active ? "bg-signal" : "bg-transparent group-hover:bg-hairline-strong",
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-6 lg:absolute lg:bottom-6 lg:block lg:w-[232px]">
          <div className="border-t border-hairline pt-4">
            <p className="label-mono">signed in</p>
            <p className="mt-1 truncate font-mono text-[0.8125rem] text-graphite">
              {session?.email ?? "demo@route.dev"}
            </p>
            <button
              type="button"
              onClick={signOut}
              className="mt-3 font-mono text-[0.75rem] text-secondary underline decoration-hairline underline-offset-4 transition-colors hover:text-graphite"
            >
              sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-hairline bg-paper/85 backdrop-blur-sm">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 lg:px-10">
            <h1 className="truncate font-mono text-[0.9375rem] text-graphite">{title}</h1>
            {meta ? <div className="min-w-0 text-secondary">{meta}</div> : null}

            <div className="ml-auto flex shrink-0 items-center gap-3">
              <span className="hidden items-baseline gap-2 sm:flex">
                <span className="label-mono">p50</span>
                <Latency ms={total} className="text-[0.8125rem] text-signal" />
              </span>
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-1.5 font-mono text-[0.75rem] text-secondary transition-colors duration-[var(--t-micro)] hover:border-hairline-strong hover:text-graphite"
              >
                search
                <kbd className="label-mono border-l border-hairline pl-2">⌘k</kbd>
              </button>
              <Button type="button" onClick={() => setNewLinkOpen(true)} className="min-h-[34px] px-3">
                <span className="font-mono text-[0.75rem]">new link</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>

      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNewLink={() => {
          setCommandOpen(false);
          setNewLinkOpen(true);
        }}
      />
      <NewLinkPanel open={newLinkOpen} onOpenChange={setNewLinkOpen} />
    </div>
  );
}
