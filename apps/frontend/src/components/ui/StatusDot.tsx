import { cn } from "@/lib/utils";

export function StatusDot({
  tone = "neutral",
  breathing = false,
  className,
}: {
  tone?: "neutral" | "signal" | "down";
  breathing?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-[5px] rounded-full",
        tone === "signal" && "bg-signal",
        tone === "neutral" && "bg-graphite",
        tone === "down" && "bg-muted",
        breathing && "breathe",
        className,
      )}
    />
  );
}
