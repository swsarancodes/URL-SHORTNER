const ROWS = [
  {
    left: "api gateway",
    right: "request routing + policy",
    detail: "one entry point owns auth, request context and versioning.",
  },
  {
    left: "load balancer",
    right: "health-aware backend selection",
    detail: "written at the application level rather than delegated to a managed service.",
  },
  {
    left: "rate limiter",
    right: "traffic protection",
    detail: "per-client budgets applied before requests reach application logic.",
  },
  {
    left: "circuit breaker",
    right: "failure isolation",
    detail: "repeated failures open the circuit so a bad node stops taking traffic.",
  },
  {
    left: "short-code engine",
    right: "compact unique identifiers",
    detail: "collision-checked codes kept short enough to type by hand.",
  },
  {
    left: "postgres",
    right: "durable mappings",
    detail: "indexed lookups on neon, tuned for read-heavy redirect traffic.",
  },
];

export function EngineeringPrinciples() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="border-t border-hairline py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
          <h2 id="principles-heading" className="display-md max-w-[20rem] text-graphite">
            built to understand the machinery.
          </h2>
          <div className="lg:pt-2">
            <p className="body-lg max-w-[34rem]">
              instead of hiding every infrastructure decision behind a managed service, the
              project implements several of them directly.
            </p>

            <dl className="mt-12">
              {ROWS.map((row) => (
                <div
                  key={row.left}
                  className="group border-t border-hairline py-5 transition-colors last:border-b hover:bg-surface"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6">
                    <dt className="truncate font-mono text-[0.9375rem] text-graphite">
                      {row.left}
                    </dt>
                    <dd className="font-mono text-[0.8125rem] text-secondary">{row.right}</dd>
                  </div>
                  <p className="mt-2 max-w-[30rem] text-[0.875rem] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    {row.detail}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
