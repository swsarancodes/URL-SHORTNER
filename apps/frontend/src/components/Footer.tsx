import { motion } from "framer-motion";
import { Mark } from "@/components/navigation/Navigation";
import { useParallax } from "@/components/motion/Reveal";
import footerImage from "@/assets/footer-chair.jpg";

export function Footer() {
  const imageRef = useParallax<HTMLImageElement>(70);

  return (
    <footer className="relative isolate min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          ref={imageRef}
          src={footerImage}
          alt="a transparent folding chair glowing in a field of wildflowers under a starlit blue sky"
          loading="lazy"
          className="h-[115%] w-full object-cover object-[50%_55%]"
        />
        {/* tight scrim, only behind the top copy and the bottom nav row */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-56"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--graphite) 55%, transparent) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--graphite) 65%, transparent) 100%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[80vh] max-w-350 flex-col justify-between px-6 pt-16 pb-8 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 0.84, 0.24, 1] }}
          className="display-sm max-w-md text-paper"
        >
          one line of text.
          <br />
          a route that stays out of the way.
        </motion.p>

        <div className="mt-12 grid gap-8 border-t border-paper/20 pt-8 lg:grid-cols-3 lg:items-center">
          <div className="flex items-center gap-2.5 text-paper">
            <Mark className="h-4 w-7 shrink-0" />
            <span className="text-[0.9375rem] font-medium tracking-[-0.02em]">route</span>
          </div>
          <nav aria-label="footer" className="flex flex-wrap gap-6 lg:justify-center">
            <a href="#top" className="text-[0.875rem] text-paper/70 hover:text-paper">
              product
            </a>
            <a href="#principles" className="text-[0.875rem] text-paper/70 hover:text-paper">
              docs
            </a>
            <a href="#architecture" className="text-[0.875rem] text-paper/70 hover:text-paper">
              architecture
            </a>
            <a
              href="https://github.com"
              className="text-[0.875rem] text-paper/70 hover:text-paper"
            >
              github
            </a>
          </nav>
          <p className="label-mono text-paper/60 lg:text-right">
            built with react, fastapi and postgres
          </p>
        </div>
      </div>
    </footer>
  );
}

