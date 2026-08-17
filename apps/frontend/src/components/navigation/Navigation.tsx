import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      <path d="M1 8h11" />
      <path d="M9 5l3 3-3 3" />
      <path d="M19 2l-5 12" />
      <circle cx="24" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Navigation() {
  return (
    <header className="relative z-20">
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-10 md:py-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.24, 1] }}
          className="flex items-center gap-4 rounded-full border border-paper/15 px-5 py-3 backdrop-blur-md md:px-7"
          style={{ backgroundColor: "color-mix(in oklab, var(--paper) 10%, transparent)" }}
        >

          <a
            href="#top"
            className="flex min-w-0 items-center gap-2.5 text-paper"
            aria-label="route — url shortener, home"
          >
            <Mark className="h-4 w-7 shrink-0" />
            <span className="truncate text-[0.9375rem] font-medium tracking-[-0.02em]">route</span>
            <span className="label-mono hidden text-paper/60 sm:inline">url shortener</span>
          </a>
          <nav aria-label="primary" className="ml-auto flex shrink-0 items-center gap-6">
            <a
              href="#architecture"
              className="hidden text-[0.875rem] text-paper/70 transition-colors hover:text-paper sm:inline"
            >
              architecture
            </a>
            <a
              href="#principles"
              className="hidden text-[0.875rem] text-paper/70 transition-colors hover:text-paper sm:inline"
            >
              docs
            </a>
            <Link
              to="/login"
              className="text-[0.875rem] text-paper/70 transition-colors hover:text-paper"
            >
              sign in
            </Link>
            <Link
              to="/register"
              className="text-[0.875rem] font-medium text-paper underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70"
            >
              open workspace
            </Link>
          </nav>
        </motion.div>
      </div>
    </header>
  );

}
