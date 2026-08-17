import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_LINKS, type LinkRecord, type LinkState } from "@/lib/demo-data";

const SESSION_KEY = "route.session";
const LINKS_KEY = "route.links";

interface WorkspaceValue {
  session: { email: string } | null;
  hydrated: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  links: LinkRecord[];
  createLink: (input: { destination: string; code?: string; title?: string }) => LinkRecord;
  setLinkState: (id: string, state: LinkState) => void;
  removeLink: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

function randomCode() {
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [links, setLinks] = useState<LinkRecord[]>(DEMO_LINKS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) setSession(JSON.parse(rawSession) as { email: string });
      const rawLinks = localStorage.getItem(LINKS_KEY);
      if (rawLinks) setLinks(JSON.parse(rawLinks) as LinkRecord[]);
    } catch {
      /* demo storage only */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LINKS_KEY, JSON.stringify(links));
    } catch {
      /* ignore */
    }
  }, [links, hydrated]);

  const signIn = useCallback((email: string) => {
    const next = { email };
    setSession(next);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const createLink = useCallback(
    (input: { destination: string; code?: string; title?: string }) => {
      const code = input.code?.trim() || randomCode();
      const record: LinkRecord = {
        id: code,
        code,
        destination: input.destination.replace(/^https?:\/\//, ""),
        title: input.title?.trim() || "untitled",
        state: "active",
        createdAt: "just now",
        expiresAt: null,
        visits: 0,
        lastOpenedSecondsAgo: 0,
        series: Array.from({ length: 14 }, () => 0),
      };
      setLinks((prev) => [record, ...prev.filter((link) => link.id !== code)]);
      return record;
    },
    [],
  );

  const setLinkState = useCallback((id: string, state: LinkState) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, state } : link)));
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const value = useMemo<WorkspaceValue>(
    () => ({
      session,
      hydrated,
      signIn,
      signOut,
      links,
      createLink,
      setLinkState,
      removeLink,
    }),
    [session, hydrated, signIn, signOut, links, createLink, setLinkState, removeLink],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
}
