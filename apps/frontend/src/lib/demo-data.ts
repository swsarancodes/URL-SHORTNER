export type LinkState = "active" | "disabled" | "expired";

export interface LinkRecord {
  id: string;
  code: string;
  destination: string;
  title: string;
  state: LinkState;
  createdAt: string;
  expiresAt: string | null;
  visits: number;
  lastOpenedSecondsAgo: number;
  /** last 14 days of redirects, oldest first */
  series: number[];
}

export const DEMO_LINKS: LinkRecord[] = [
  {
    id: "k7fq2",
    code: "k7fq2",
    destination: "engineering.example.dev/system-design/url-routing",
    title: "system-design-notes",
    state: "active",
    createdAt: "aug 16",
    expiresAt: null,
    visits: 1284,
    lastOpenedSecondsAgo: 18,
    series: [214, 189, 231, 268, 244, 302, 287, 341, 318, 366, 402, 388, 441, 482],
  },
  {
    id: "docs",
    code: "docs",
    destination: "docs.example.dev/api/authentication",
    title: "documentation",
    state: "active",
    createdAt: "aug 12",
    expiresAt: null,
    visits: 842,
    lastOpenedSecondsAgo: 124,
    series: [98, 112, 104, 141, 133, 158, 149, 171, 162, 188, 176, 204, 219, 194],
  },
  {
    id: "m2xa9",
    code: "m2xa9",
    destination: "github.com/project/repository",
    title: "portfolio",
    state: "active",
    createdAt: "aug 09",
    expiresAt: "sep 09",
    visits: 391,
    lastOpenedSecondsAgo: 431,
    series: [41, 38, 52, 47, 63, 58, 71, 66, 79, 74, 88, 81, 96, 104],
  },
  {
    id: "r8pk4",
    code: "r8pk4",
    destination: "notes.example.dev/distributed-systems",
    title: "distributed-systems notes",
    state: "active",
    createdAt: "aug 04",
    expiresAt: null,
    visits: 268,
    lastOpenedSecondsAgo: 1840,
    series: [22, 31, 27, 34, 29, 41, 37, 44, 39, 48, 43, 52, 47, 58],
  },
  {
    id: "archive",
    code: "archive",
    destination: "notes.example.dev/2024/archive",
    title: "old archive",
    state: "disabled",
    createdAt: "jul 21",
    expiresAt: null,
    visits: 96,
    lastOpenedSecondsAgo: 84000,
    series: [12, 9, 14, 11, 8, 6, 7, 4, 3, 2, 1, 0, 0, 0],
  },
  {
    id: "beta7",
    code: "beta7",
    destination: "engineering.example.dev/changelog/2026-07",
    title: "beta changelog",
    state: "expired",
    createdAt: "jul 02",
    expiresAt: "aug 02",
    visits: 517,
    lastOpenedSecondsAgo: 190000,
    series: [64, 58, 71, 66, 52, 47, 38, 29, 21, 14, 9, 4, 1, 0],
  },
];

export interface RailEntry {
  id: string;
  time: string;
  code: string;
  latencyMs: number;
}

export const REFERRERS = [
  ["direct", 3182],
  ["news.ycombinator.com", 1841],
  ["x.com", 962],
  ["github.com", 611],
  ["newsletter", 288],
] as const;

export const DEVICES = [
  ["desktop", 62],
  ["mobile", 33],
  ["tablet", 5],
] as const;

export const COUNTRIES = [
  ["united states", 2841],
  ["germany", 1122],
  ["india", 908],
  ["united kingdom", 671],
  ["japan", 402],
] as const;

export const ACTIVITY = [
  { time: "11:42:07", label: "/k7fq2 redirected", meta: "24ms", kind: "redirects" },
  { time: "11:40:18", label: "/docs created", meta: null, kind: "links" },
  { time: "11:38:52", label: "/m2xa9 redirected", meta: "19ms", kind: "redirects" },
  { time: "11:36:04", label: "node 02 returned to active pool", meta: "health check passed", kind: "system" },
  { time: "11:35:41", label: "node 02 removed from active pool", meta: "timeout · 504", kind: "system" },
  { time: "11:32:44", label: "/archive disabled", meta: null, kind: "links" },
  { time: "11:28:12", label: "/r8pk4 redirected", meta: "31ms", kind: "redirects" },
  { time: "10:58:33", label: "/beta7 expired", meta: null, kind: "links" },
] as const;

export function volumeSeries(points: number, base: number, spread: number, seed = 7) {
  let h = seed * 2654435761;
  const out: number[] = [];
  for (let i = 0; i < points; i += 1) {
    h = (h ^ (h >>> 15)) * 2246822519;
    const wobble = ((h >>> 8) % 1000) / 1000;
    const trend = i / points;
    out.push(Math.round(base + trend * spread * 0.6 + (wobble - 0.5) * spread));
  }
  return out;
}

export function formatAgo(seconds: number) {
  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hr ago`;
  return `${Math.round(seconds / 86400)} d ago`;
}

export const numberFmt = new Intl.NumberFormat("en-US");
