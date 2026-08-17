import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/app/AuthScreen";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "create a workspace — route" },
      {
        name: "description",
        content: "open a route workspace: short links, live latency instrumentation and an api.",
      },
      { property: "og:title", content: "create a workspace — route" },
      {
        property: "og:description",
        content: "open a route workspace: short links, live latency instrumentation and an api.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthScreen mode="register" />,
});
