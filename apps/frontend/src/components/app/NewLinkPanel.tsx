import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/route-button";
import { RouteColumn, type RouteEvent } from "@/components/system/RouteColumn";
import { useWorkspace } from "@/lib/workspace-store";
import { cn } from "@/lib/utils";

const STAGES = ["validate", "reserve code", "write mapping", "propagate"] as const;

function buildEvents(step: number, failed: boolean): RouteEvent[] {
  return STAGES.map((stage, index) => ({
    stage,
    latencyMs: [4, 3, 9, 5][index] as number,
    status:
      failed && index === 1
        ? "failed"
        : index < step
          ? "complete"
          : index === step
            ? "active"
            : "pending",
  }));
}

export function NewLinkPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { links, createLink } = useWorkspace();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setStep(-1);
    setError(null);
  }, [open]);

  function validate() {
    try {
      const parsed = new URL(destination.trim());
      if (!/^https?:$/.test(parsed.protocol) || !parsed.hostname.includes(".")) {
        return "enter a valid http or https url.";
      }
    } catch {
      return "enter a valid http or https url.";
    }
    if (code.trim() && links.some((link) => link.code === code.trim())) {
      return "that code is already routed.";
    }
    return null;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      setStep(-1);
      return;
    }
    setError(null);
    for (let i = 0; i < STAGES.length; i += 1) {
      setStep(i);
      await new Promise((resolve) => setTimeout(resolve, 190));
    }
    const record = createLink({ destination: destination.trim(), code, title });
    setStep(STAGES.length);
    setDestination("");
    setCode("");
    setTitle("");
    onOpenChange(false);
    void navigate({ to: "/app/links/$linkId", params: { linkId: record.id } });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-hairline bg-surface p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-hairline px-6 py-5 text-left">
          <SheetTitle className="font-mono text-[0.9375rem] font-normal text-graphite">
            new link
          </SheetTitle>
          <p className="label-mono">the route is created in four steps</p>
        </SheetHeader>

        <form onSubmit={onSubmit} className="panel-in space-y-6 px-6 py-6" noValidate>
          <Field label="destination url">
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="https://example.com/a/very/long/path"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[0.875rem] text-graphite outline-none placeholder:text-muted"
            />
          </Field>

          <Field label="custom code (optional)">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[0.875rem] text-muted">sho.rt/</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/[^a-z0-9-]/gi, ""))}
                placeholder="auto"
                className="w-full bg-transparent font-mono text-[0.875rem] text-graphite outline-none placeholder:text-muted"
              />
            </div>
          </Field>

          <Field label="label (optional)">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="internal name"
              className="w-full bg-transparent font-mono text-[0.875rem] text-graphite outline-none placeholder:text-muted"
            />
          </Field>

          {error ? (
            <p className="font-mono text-[0.8125rem] text-[color:var(--failure)]">{error}</p>
          ) : null}

          <div className={cn("border-t border-hairline pt-5", step < 0 && "opacity-45")}>
            <RouteColumn label="creation route" events={buildEvents(step, false)} />
          </div>

          <Button type="submit" magnetic className="w-full">
            <span className="font-mono text-[0.8125rem]">create route</span>
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono mb-2 block">{label}</span>
      <span className="block rounded-md border border-hairline bg-paper px-3 py-2.5 transition-colors duration-[var(--t-micro)] focus-within:border-signal">
        {children}
      </span>
    </label>
  );
}
