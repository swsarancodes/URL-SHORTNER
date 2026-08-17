import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useWorkspace } from "@/lib/workspace-store";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "workspace — route" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "the authenticated route workspace: links, analytics, activity and api access.",
      },
      { property: "og:title", content: "workspace — route" },
      { property: "og:description", content: "links, analytics, activity and api access." },
    ],
  }),
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  const { session, hydrated } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !session) void navigate({ to: "/login" });
  }, [hydrated, session, navigate]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <p className="label-mono">resolving session</p>
      </div>
    );
  }

  return <Outlet />;
}
