const TRACE = [
  ["gateway", "7ms"],
  ["routing", "2ms"],
  ["lookup", "14ms"],
  ["response", "3ms"],
];

export function PerformanceTrace() {
  return (
    <section
      aria-labelledby="performance-heading"
      className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28"
    >
      <div className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
        <div>
          <h2 id="performance-heading" className="display-md text-graphite">
            redirects should feel uneventful.
          </h2>
          <p className="mt-8 max-w-[24rem] font-mono text-[0.9375rem] leading-[1.9] text-secondary">
            lookup the code.
            <br />
            find the destination.
            <br />
            get out of the way.
          </p>
        </div>

        <div className="border-t border-hairline pt-5">
          <p className="font-mono text-[0.8125rem] text-graphite">GET /k7fq2</p>
          <dl className="mt-4">
            {TRACE.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between py-1.5">
                <dt className="font-mono text-[0.8125rem] text-secondary">{label}</dt>
                <dd className="font-mono text-[0.8125rem] text-graphite">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 border-t border-hairline pt-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.8125rem] text-secondary">total</span>
              <span className="font-mono text-[0.8125rem] text-signal">26ms</span>
            </div>
          </div>
          <p className="label-mono mt-5 leading-relaxed">
            illustrative values from local development, not measured production benchmarks.
          </p>
        </div>
      </div>
    </section>
  );
}
