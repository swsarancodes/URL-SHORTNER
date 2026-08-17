import { forwardRef, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "quiet" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** subtle magnetic pull (pointer devices only), max ~4px */
  magnetic?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "rounded-[10px] bg-graphite px-5 text-[0.9375rem] text-[color:var(--surface)] hover:bg-signal",
  quiet:
    "rounded-[8px] border border-hairline bg-surface px-3 py-1.5 text-[0.8125rem] text-secondary hover:border-signal hover:text-signal",
  ghost: "text-[0.875rem] text-secondary hover:text-graphite",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", magnetic = false, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLButtonElement | null>(null);

  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!magnetic || event.pointerType !== "mouse") return;
      const node = localRef.current;
      if (!node) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = node.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      node.style.transform = `translate3d(${(dx * 4).toFixed(2)}px, ${(dy * 3).toFixed(2)}px, 0)`;
    },
    [magnetic],
  );

  const reset = useCallback(() => {
    const node = localRef.current;
    if (node) node.style.transform = "";
  }, []);

  return (
    <button
      ref={setRef}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(base, variants[variant], magnetic && "will-change-transform", className)}
      {...props}
    />
  );
});
