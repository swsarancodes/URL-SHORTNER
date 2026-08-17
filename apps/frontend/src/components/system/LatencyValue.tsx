import { cn } from "@/lib/utils";

/**
 * Latency / count value where individual digits transition vertically inside a
 * clipped container. Monospace keeps widths stable so nothing reflows.
 */
export function RollingNumber({
  value,
  suffix = "",
  pad = 0,
  group = false,
  className,
}: {
  value: number;
  suffix?: string | undefined;
  pad?: number | undefined;
  group?: boolean | undefined;
  className?: string | undefined;
}) {
  const text = group
    ? Math.round(value).toLocaleString("en-US")
    : String(Math.round(value)).padStart(pad, "0");
  return (
    <span className={cn("num inline-flex items-baseline tabular-nums", className)}>
      {text.split("").map((char, index) =>
        /\d/.test(char) ? (
          <Digit key={`${index}-${text.length}`} char={char} />
        ) : (
          <span key={`sep-${index}-${text.length}`}>{char}</span>
        ),
      )}
      {suffix ? <span className="ml-px">{suffix}</span> : null}
    </span>
  );
}

function Digit({ char }: { char: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-baseline">
      <span key={char} className="digit-roll inline-block">
        {char}
      </span>
    </span>
  );
}

export function Latency({
  ms,
  className,
}: {
  ms: number;
  className?: string | undefined;
}) {
  return <RollingNumber value={ms} pad={2} suffix="ms" className={className} />;
}
