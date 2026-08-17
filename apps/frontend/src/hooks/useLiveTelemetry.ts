import { useEffect, useRef, useState } from "react";

export interface StageLatency {
  gateway: number;
  routing: number;
  lookup: number;
  response: number;
}

const BASE: StageLatency = { gateway: 7, routing: 2, lookup: 14, response: 3 };

function drift(value: number, spread: number, min: number) {
  const next = value + (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * spread);
  return Math.max(min, next);
}

/**
 * Illustrative latency telemetry. Values drift slightly on an interval so the
 * instrumentation reads as instrumentation, never as decoration.
 */
export function useLiveLatency(intervalMs = 2600) {
  const [stages, setStages] = useState<StageLatency>(BASE);

  useEffect(() => {
    const id = setInterval(() => {
      setStages((prev) => ({
        gateway: Math.min(14, drift(prev.gateway, 2, 5)),
        routing: Math.min(6, drift(prev.routing, 1, 1)),
        lookup: Math.min(24, drift(prev.lookup, 3, 9)),
        response: Math.min(8, drift(prev.response, 1, 2)),
      }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const total = stages.gateway + stages.routing + stages.lookup + stages.response;
  return { stages, total };
}

export interface RedirectEvent {
  id: string;
  time: string;
  code: string;
  latencyMs: number;
  country: string;
}

const CODES = ["k7fq2", "docs", "m2xa9", "r8pk4"];
const PLACES = ["us", "de", "in", "gb", "jp", "br"];

function clockLabel(date: Date) {
  return date.toTimeString().slice(0, 8);
}

/** Rolling feed of illustrative redirects for the workspace live rail. */
export function useRedirectFeed(size = 8) {
  const [events, setEvents] = useState<RedirectEvent[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    function push(offsetMs = 0) {
      counter.current += 1;
      const next: RedirectEvent = {
        id: `e${counter.current}`,
        time: clockLabel(new Date(Date.now() - offsetMs)),
        code: CODES[Math.floor(Math.random() * CODES.length)] as string,
        latencyMs: 17 + Math.round(Math.random() * 18),
        country: PLACES[Math.floor(Math.random() * PLACES.length)] as string,
      };
      setEvents((prev) => [next, ...prev].slice(0, size));
    }
    for (let i = size - 1; i >= 0; i -= 1) push(i * 3400);
    const id = setInterval(push, 3400);
    return () => clearInterval(id);
  }, [size]);

  return events;
}
