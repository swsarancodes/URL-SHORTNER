import { cn } from "@/lib/utils";

/** Hairline area chart. No gridlines, no chart chrome — just the shape of traffic. */
export function AreaTrace({
  series,
  className,
  height = 120,
}: {
  series: number[];
  className?: string | undefined;
  height?: number | undefined;
}) {
  const max = Math.max(1, ...series);
  const step = 100 / Math.max(1, series.length - 1);
  const points = series.map((value, index) => [index * step, 100 - (value / max) * 92] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L100 100 L0 100 Z`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      aria-hidden="true"
    >
      <path d={area} fill="color-mix(in oklab, var(--signal) 8%, transparent)" />
      <path
        d={line}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {points.at(-1) ? (
        <circle cx={points.at(-1)![0]} cy={points.at(-1)![1]} r="1.4" fill="var(--signal)" />
      ) : null}
    </svg>
  );
}

/** Column volume chart, one bar per bucket. */
export function ColumnTrace({ series, height = 160 }: { series: number[]; height?: number }) {
  const max = Math.max(1, ...series);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }} aria-hidden="true">
      {series.map((value, index) => (
        <span
          key={index}
          className="flex-1 rounded-[1px] bg-hairline-strong transition-colors duration-[var(--t-micro)] hover:bg-signal"
          style={{ height: `${Math.max(2, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/** Horizontal share rows: label, hairline bar, value. */
export function ShareRows({
  rows,
  suffix = "",
}: {
  rows: readonly (readonly [string, number])[];
  suffix?: string;
}) {
  const max = Math.max(1, ...rows.map(([, value]) => value));
  return (
    <ul className="space-y-3">
      {rows.map(([label, value]) => (
        <li key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.8125rem] text-graphite">{label}</p>
            <span className="mt-1.5 block h-px w-full bg-hairline">
              <span
                className="block h-px bg-signal transition-[width] duration-[var(--t-panel)]"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </span>
          </div>
          <span className="num shrink-0 text-[0.8125rem] text-secondary">
            {value.toLocaleString("en-US")}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Panel({
  label,
  children,
  className,
  action,
}: {
  label: string;
  children: React.ReactNode;
  className?: string | undefined;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-hairline bg-surface p-5 lg:p-6",
        className,
      )}
    >
      <header className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="label-mono">{label}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
