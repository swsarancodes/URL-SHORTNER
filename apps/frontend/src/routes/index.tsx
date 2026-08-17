import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/navigation/Navigation";
import { Hero } from "@/components/hero/Hero";
import { InstrumentationStrip, RequestJourney } from "@/components/sections/RequestJourney";
import { Architecture } from "@/components/architecture/Architecture";
import { EngineeringPrinciples } from "@/components/sections/EngineeringPrinciples";
import { PerformanceTrace } from "@/components/sections/PerformanceTrace";
import { FinalShortener } from "@/components/sections/FinalShortener";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "route — shorten the link, keep the route" },
      {
        name: "description",
        content:
          "a url shortener with its infrastructure on display: gateway, health-aware routing, short-code engine and postgres. paste a long url, get a short one.",
      },
      { property: "og:title", content: "route — shorten the link, keep the route" },
      {
        property: "og:description",
        content:
          "paste a long url, get a short one. underneath: an api gateway, an application-level load balancer and postgres mappings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <Navigation />
      <main>
        <Hero />
        <Reveal>
          <InstrumentationStrip />
        </Reveal>
        <Reveal>
          <RequestJourney />
        </Reveal>
        <Reveal>
          <Architecture />
        </Reveal>
        <Reveal>
          <EngineeringPrinciples />
        </Reveal>
        <Reveal>
          <PerformanceTrace />
        </Reveal>
        <Reveal>
          <FinalShortener />
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
