"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useLoaded } from "@/components/Shell";
import { EASE_OUT, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Reveal — fade + rise on enter                                       */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/*  MaskText — each line slides up from behind a clipping edge          */
/* ------------------------------------------------------------------ */
export function MaskText({
  lines,
  className,
  lineClasses,
  delay = 0,
  stagger = 0.09,
  onLoad = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClasses?: string[];
  delay?: number;
  stagger?: number;
  /** trigger on preloader finishing instead of on scroll-into-view */
  onLoad?: boolean;
}) {
  const loaded = useLoaded();
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        // The observed element is the (untransformed) clipping wrapper — observing
        // the translated child would report it as clipped and never fire.
        <motion.span
          key={i}
          className={cn("block overflow-hidden py-[0.1em] -my-[0.1em]", lineClasses?.[i])}
          initial="hidden"
          {...(onLoad
            ? { animate: loaded ? "show" : "hidden" }
            : {
                whileInView: "show",
                viewport: { once: true, margin: "0px 0px -8% 0px" },
              })}
        >
          <motion.span
            className="block will-change-transform"
            variants={{ hidden: { y: "118%" }, show: { y: "0%" } }}
            transition={{ duration: 1.15, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  WordFade — words ignite as you scroll through the paragraph         */
/* ------------------------------------------------------------------ */
function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.26em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export function WordFade({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.45"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 2 / words.length);
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic — element leans toward the pointer                         */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.25 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small art-direction atoms                                           */
/* ------------------------------------------------------------------ */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 0c.7 6.8 4.5 11.3 12 12-7.5.7-11.3 5.2-12 12-.7-6.8-4.5-11.3-12-12C7.5 11.3 11.3 6.8 12 0Z" />
    </svg>
  );
}

export function SectionLabel({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="mono-label flex shrink-0 items-center gap-2.5">
        <span className="size-1.5 bg-accent" />
        <span>({index})</span>
        <span>{title}</span>
      </span>
      <motion.span
        aria-hidden
        className="h-px flex-1 origin-left bg-current opacity-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      />
    </div>
  );
}
