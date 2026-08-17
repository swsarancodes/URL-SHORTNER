import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useWorkspace } from "@/lib/workspace-store";

export function CommandMenu({
  open,
  onOpenChange,
  onNewLink,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewLink: () => void;
}) {
  const navigate = useNavigate();
  const { links } = useWorkspace();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput placeholder="search links, sections, actions…" className="font-mono text-[0.875rem]" />
      <CommandList>
        <CommandEmpty className="py-8 text-center font-mono text-[0.8125rem] text-secondary">
          no match on this route.
        </CommandEmpty>

        <CommandGroup heading="actions">
          <CommandItem value="new link create shorten" onSelect={onNewLink} className="font-mono text-[0.8125rem]">
            create a new link
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="links">
          {links.slice(0, 6).map((link) => (
            <CommandItem
              key={link.id}
              value={`${link.code} ${link.title} ${link.destination}`}
              onSelect={() => {
                onOpenChange(false);
                void navigate({ to: "/app/links/$linkId", params: { linkId: link.id } });
              }}
              className="font-mono text-[0.8125rem]"
            >
              <span className="text-graphite">/{link.code}</span>
              <span className="ml-3 truncate text-muted">{link.destination}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="sections">
          {[
            { to: "/app", label: "overview" },
            { to: "/app/links", label: "links" },
            { to: "/app/analytics", label: "analytics" },
            { to: "/app/activity", label: "activity" },
            { to: "/app/api", label: "api" },
            { to: "/app/settings", label: "settings" },
          ].map((item) => (
            <CommandItem
              key={item.to}
              value={item.label}
              onSelect={() => {
                onOpenChange(false);
                void navigate({ to: item.to });
              }}
              className="font-mono text-[0.8125rem]"
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
