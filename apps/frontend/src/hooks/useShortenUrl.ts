import { useCallback, useEffect, useRef, useState } from "react";

export type ShortenStatus = "idle" | "validating" | "submitting" | "success" | "error";

/** Route checkpoints. The route animation derives from this list + status. */
export const CHECKPOINTS = ["validate", "route", "encode", "store", "ready"] as const;
export type Checkpoint = (typeof CHECKPOINTS)[number];

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

function makeCode(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    h = Math.imul(h ^ (h >>> 13), 16777619);
    out += ALPHABET[Math.abs(h) % ALPHABET.length];
  }
  return out;
}

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value.trim());
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

export interface ShortenResult {
  shortUrl: string;
  code: string;
  longUrl: string;
  /** illustrative stage timings, ms */
  timings: { gateway: number; routing: number; lookup: number; response: number };
}

const API_BASE = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

export function useShortenUrl() {
  const [status, setStatus] = useState<ShortenStatus>("idle");
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setCheckpoint(null);
    setResult(null);
    setError(null);
  }, [clearTimers]);

  const shorten = useCallback(
    async (raw: string) => {
      clearTimers();
      setError(null);
      setResult(null);
      setStatus("validating");
      setCheckpoint("validate");

      const value = raw.trim();
      if (!isHttpUrl(value)) {
        setStatus("error");
        setCheckpoint(null);
        setError("enter a valid http or https url.");
        return;
      }

      setStatus("submitting");
      const stages: Checkpoint[] = ["route", "encode", "store"];
      stages.forEach((stage, i) => {
        timers.current.push(setTimeout(() => setCheckpoint(stage), 180 + i * 210));
      });

      try {
        const settle = new Promise<void>((resolve) => {
          timers.current.push(setTimeout(resolve, 900));
        });

        let payload: ShortenResult | null = null;

        if (API_BASE) {
          const res = await fetch(`${API_BASE}/api/shorten`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ url: value }),
          });
          if (res.status === 429) throw new Error("too many requests. try again shortly.");
          if (!res.ok) throw new Error("this url couldn't be shortened. try again.");
          const data = (await res.json()) as { short_url?: string; code?: string };
          const code = data.code ?? makeCode(value);
          payload = {
            code,
            shortUrl: data.short_url ?? `sho.rt/${code}`,
            longUrl: value,
            timings: { gateway: 7, routing: 2, lookup: 14, response: 3 },
          };
        } else {
          const code = makeCode(value);
          payload = {
            code,
            shortUrl: `sho.rt/${code}`,
            longUrl: value,
            timings: { gateway: 7, routing: 2, lookup: 14, response: 3 },
          };
        }

        await settle;
        setCheckpoint("ready");
        setResult(payload);
        setStatus("success");
      } catch (e) {
        setCheckpoint(null);
        setStatus("error");
        setError(
          e instanceof Error && e.message
            ? e.message
            : "this url couldn't be shortened. try again.",
        );
      }
    },
    [clearTimers],
  );

  const busy = status === "validating" || status === "submitting";

  return { status, busy, checkpoint, result, error, shorten, reset };
}
