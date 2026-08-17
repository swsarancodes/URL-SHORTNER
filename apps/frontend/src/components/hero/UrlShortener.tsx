import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/route-button";
import { RouteTrace } from "@/components/hero/RouteTrace";
import { useShortenUrl } from "@/hooks/useShortenUrl";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<string, string> = {
  validating: "validating",
  submitting: "routing",
  success: "ready",
};

export function UrlShortener({ idPrefix = "hero" }: { idPrefix?: string }) {
  const fieldId = `${idPrefix}-${useId()}`;
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const { status, busy, checkpoint, result, error, shorten } = useShortenUrl();
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function onCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`https://${result.shortUrl}`);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="w-full min-w-0">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setCopied(false);
          setRunKey((k) => k + 1);
          void shorten(value);
        }}
        noValidate
      >
        <label htmlFor={fieldId} className="label-mono mb-3 block">
          long url
        </label>

        <div
          className={cn(
            "flex items-stretch gap-2 rounded-[14px] border bg-surface p-2 pl-4 transition-colors duration-200",
            "shadow-[0_18px_50px_rgba(23,25,28,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
            "focus-within:border-signal focus-within:ring-1 focus-within:ring-inset focus-within:ring-[color-mix(in_oklab,var(--signal)_35%,transparent)]",
            status === "error" ? "border-[color:var(--destructive)]" : "border-hairline",
          )}
        >
          <input
            id={fieldId}
            name="url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://example.com/a/very/long/path"
            aria-describedby={`${fieldId}-status`}
            aria-invalid={status === "error"}
            className="min-h-[52px] min-w-0 flex-1 bg-transparent font-mono text-[0.9375rem] text-graphite outline-none placeholder:text-muted sm:min-h-[56px]"
          />
          <Button
            type="submit"
            magnetic
            disabled={busy}
            className="min-h-[52px] shrink-0 sm:min-h-[56px]"
          >
            <span className="font-mono text-[0.875rem] tracking-[0.01em]">
              {busy ? "routing" : "shorten"}
            </span>
          </Button>
        </div>
      </form>

      <div className="mt-1">
        <RouteTrace status={status} checkpoint={checkpoint} runKey={runKey} />
      </div>

      <p
        id={`${fieldId}-status`}
        role="status"
        aria-live="polite"
        className={cn(
          "mt-3 font-mono text-[0.8125rem]",
          status === "error" ? "text-[color:var(--destructive)]" : "text-secondary",
        )}
      >
        {status === "error" ? error : (STATUS_TEXT[status] ?? "")}
      </p>

      {result && status === "success" ? (
        <div className="reveal mt-6 min-w-0 border-t border-hairline pt-5">
          <p className="label-mono mb-2">short link</p>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <a
              href={`https://${result.shortUrl}`}
              onClick={(event) => event.preventDefault()}
              className="min-w-0 truncate font-mono text-[1.375rem] text-signal underline decoration-1 underline-offset-[6px] sm:text-[1.625rem]"
            >
              {result.shortUrl}
            </a>
            <Button
              type="button"
              variant="quiet"
              onClick={onCopy}
              aria-label={copied ? "short link copied" : "copy short link"}
              className="shrink-0 font-mono"
            >
              {copied ? "copied" : "copy"}
            </Button>
          </div>
          <p className="mt-3 truncate font-mono text-[0.75rem] text-muted">
            → {result.longUrl}
          </p>
        </div>
      ) : null}
    </div>
  );
}
