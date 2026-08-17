import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/app/AuthScreen";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "sign in — route" },
      {
        name: "description",
        content: "sign in to the route workspace to manage short links, latency and activity.",
      },
      { property: "og:title", content: "sign in — route" },
      {
        property: "og:description",
        content: "sign in to the route workspace to manage short links, latency and activity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthScreen mode="login" />,
});
