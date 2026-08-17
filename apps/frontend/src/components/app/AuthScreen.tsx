import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mark } from "@/components/navigation/Navigation";
import { Button } from "@/components/ui/route-button";
import { RouteColumn, TraceBadge, type RouteEvent } from "@/components/system/RouteColumn";
import { useWorkspace } from "@/lib/workspace-store";

const STAGES = ["credentials", "session", "workspace"] as const;

function events(step: number, failed: boolean): RouteEvent[] {
  return STAGES.map((stage, index) => ({
    stage,
    latencyMs: [6, 4, 9][index] as number,
    status:
      failed && index === 0
        ? "failed"
        : index < step
          ? "complete"
          : index === step
            ? "active"
            : "pending",
  }));
}

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const { signIn } = useWorkspace();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/.+@.+\..+/.test(email) || password.length < 6) {
      setError("enter an email and a password of at least 6 characters.");
      setStep(-1);
      return;
    }
    setError(null);
    for (let i = 0; i < STAGES.length; i += 1) {
      setStep(i);
      await new Promise((resolve) => setTimeout(resolve, 220));
    }
    signIn(email.trim());
    void navigate({ to: "/app" });
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_0.85fr]">
      <div className="flex min-w-0 flex-col px-6 py-8 md:px-12 lg:px-16">
        <Link to="/" className="flex items-center gap-2.5 text-graphite">
          <Mark className="h-4 w-7 shrink-0" />
          <span className="text-[0.9375rem] font-medium tracking-[-0.02em]">route</span>
        </Link>

        <div className="my-auto max-w-[26rem] py-14">
          <h1 className="enter display-md text-graphite">
            {mode === "login" ? "resume the route." : "open a route."}
          </h1>
          <p className="enter body-lg mt-4" style={{ animationDelay: "120ms" }}>
            {mode === "login"
              ? "sign in to your links, latency and activity log."
              : "create a workspace and start routing links in under a minute."}
          </p>

          <form onSubmit={onSubmit} className="mt-9 space-y-5" noValidate>
            <Field label="email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@team.dev"
                className="w-full bg-transparent font-mono text-[0.875rem] text-graphite outline-none placeholder:text-muted"
              />
            </Field>
            <Field label="password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full bg-transparent font-mono text-[0.875rem] text-graphite outline-none placeholder:text-muted"
              />
            </Field>

            {error ? (
              <p className="font-mono text-[0.8125rem] text-[color:var(--failure)]">{error}</p>
            ) : null}

            <Button type="submit" magnetic className="w-full">
              <span className="font-mono text-[0.875rem]">
                {mode === "login" ? "sign in" : "create workspace"}
              </span>
            </Button>
          </form>

          <p className="mt-6 font-mono text-[0.8125rem] text-secondary">
            {mode === "login" ? (
              <>
                no workspace yet?{" "}
                <Link to="/register" className="text-signal underline underline-offset-4">
                  register
                </Link>
              </>
            ) : (
              <>
                already routing?{" "}
                <Link to="/login" className="text-signal underline underline-offset-4">
                  sign in
                </Link>
              </>
            )}
          </p>
          <p className="label-mono mt-4 leading-relaxed">
            demo authentication — credentials stay in this browser and unlock the sample workspace.
          </p>
        </div>
      </div>

      <aside className="hidden border-l border-hairline bg-surface p-12 lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-[20rem]">
          <TraceBadge live={step >= 0} />
          <p className="display-sm mt-6 text-graphite">
            {mode === "login" ? "your session takes the same route." : "the route is built before you arrive."}
          </p>
          <div className="mt-8">
            <RouteColumn events={events(step, false)} totalMs={step >= STAGES.length - 1 ? 19 : null} />
          </div>
          <p className="label-mono mt-8 leading-relaxed">
            every request in this product — sign in, create, redirect — is instrumented the same way.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono mb-2 block">{label}</span>
      <span className="block rounded-md border border-hairline bg-surface px-3 py-2.5 transition-colors duration-[var(--t-micro)] focus-within:border-signal">
        {children}
      </span>
    </label>
  );
}
