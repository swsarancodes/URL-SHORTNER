import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { UrlShortener } from "@/components/hero/UrlShortener";
import { useParallax } from "@/components/motion/Reveal";
import heroImage from "@/assets/hero-hand.jpg";

const ease = [0.16, 0.84, 0.24, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function Hero() {
  const imageRef = useParallax<HTMLImageElement>(90);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate -mt-24 flex min-h-[92vh] flex-col justify-end overflow-hidden pt-24"
    >
      {/* full-bleed image bed — shown at full clarity, no wash */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.img
          ref={imageRef}
          src={heroImage}
          alt="a glittering hand reaching up from a field of wildflowers into a deep blue night sky"
          loading="eager"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease }}
          className="h-[118%] w-full object-cover object-[50%_38%]"
        />
        {/* tight scrim, only behind the nav bar and the copy block near the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--graphite) 45%, transparent) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--graphite) 20%, transparent) 45%, color-mix(in oklab, var(--graphite) 72%, transparent) 100%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-350 px-6 pt-14 pb-14 md:px-10 md:pb-16 lg:px-16 lg:pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-184"
        >
          <motion.p variants={item} className="label-mono text-paper/70">
            url shortener / routing infrastructure
          </motion.p>
          <motion.h1 variants={item} id="hero-heading" className="display-xl mt-5 text-paper">
            make the url disappear.
            <br />
            keep the route.
          </motion.h1>
          <motion.p variants={item} className="body-lg mt-7 max-w-152 text-paper/90">
            a short link is one line of text. behind it: a controlled gateway, health-aware routing,
            an indexed lookup and a redirect that gets out of the way in under 30ms.
          </motion.p>
          <motion.p variants={item} className="mt-6">
            <Link
              to="/register"
              className="font-mono text-[0.875rem] text-paper underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70"
            >
              open a workspace
            </Link>
            <span className="label-mono ml-3 text-paper/60">
              links, latency and activity in one surface
            </span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease }}
          className="mt-10 min-w-0 md:mt-14 lg:max-w-[calc(100%-4rem)]"
        >
          <UrlShortener idPrefix="hero" />
        </motion.div>
      </div>
    </section>
  );
}
