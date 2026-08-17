const STAGES = [
  {
    label: "gateway",
    time: "8ms",
    copy:
      "the request enters through one controlled edge. authentication, limits and request context are handled before application traffic moves deeper.",
  },
  {
    label: "route",
    time: "3ms",
    copy:
      "healthy backend instances are selected by the application-level load balancer. unhealthy nodes leave the active pool.",
  },
  {
    label: "lookup",
    time: "11ms",
    copy:
      "the short code resolves against an indexed postgres mapping, with the redirect path kept intentionally small.",
  },
  {
    label: "destination",
    time: null,
    copy: "the browser receives the destination and continues to the original url.",
  },
];

export function InstrumentationStrip() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
      <div className="grid grid-cols-3 items-center">
        <span className="label-mono">request</span>
        <span className="label-mono text-center">route</span>
        <span className="label-mono text-right">redirect</span>
      </div>
      <svg viewBox="0 0 800 12" className="mt-3 h-3 w-full" preserveAspectRatio="none" aria-hidden="true">
        <line x1="4" y1="6" x2="796" y2="6" stroke="var(--hairline)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {[4, 400, 796].map((x, i) => (
          <circle key={x} cx={x} cy="6" r="3" fill={i === 1 ? "var(--signal)" : "var(--graphite)"} />
        ))}
      </svg>
      <p className="display-md mt-10 max-w-[24rem] text-graphite">
        one short link.
        <br />a surprisingly deliberate trip.
      </p>
    </div>
  );
}

export function RequestJourney() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="lg:pl-[28%]">
        <p className="label-mono">what happens after click</p>
        <h2 id="journey-heading" className="mt-4 font-mono text-[0.9375rem] text-graphite">
          someone opens /k7fq2
        </h2>
        <span className="mt-5 mb-2 block h-10 w-px bg-hairline" aria-hidden="true" />
      </div>

      <ol className="relative mt-6 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        <li
          aria-hidden="true"
          className="absolute top-[6px] right-[12.5%] left-[12.5%] hidden h-px bg-hairline lg:block"
        />
        {STAGES.map((stage) => (
          <li key={stage.label} className="relative lg:pr-8">
            <span
              className="mb-4 block size-[7px] rounded-full bg-graphite lg:relative lg:z-10"
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-3">
              <h3 className="font-mono text-[0.9375rem] text-graphite">{stage.label}</h3>
              {stage.time ? (
                <span className="font-mono text-[0.75rem] text-muted">{stage.time}</span>
              ) : null}
            </div>
            <p className="mt-3 max-w-[22rem] text-[0.9375rem] leading-[1.55] text-secondary">
              {stage.copy}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
