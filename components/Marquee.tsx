"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { Sparkle } from "@/components/ui/motion";
import { disciplines } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Infinite ticker that reacts to scroll: it speeds up and skews with scroll velocity,
 * and flips direction when you scroll back up. Four copies of the row; one copy = 25%.
 */
export function Marquee({
  items = disciplines,
  className,
  sparkleClass = "text-accent",
}: {
  items?: readonly string[];
  className?: string;
  sparkleClass?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 400, damping: 50 });
  const skew = useTransform(velocity, [-2500, 0, 2500], [-5, 0, 5], { clamp: true });
  const boost = useTransform(velocity, (v) => Math.min(Math.abs(v) / 280, 7));

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const v = velocity.get();
    if (v < -20) direction.current = -1;
    else if (v > 20) direction.current = 1;
    // one copy (25%) per ~28s at rest; x grows as the strip travels left
    const step = (delta / 1000) * (25 / 28) * (1 + boost.get());
    x.set((((x.get() + direction.current * step) % 25) + 25) % 25);
  });

  const translate = useTransform(x, (v) => `-${v}%`);

  const row = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-8 md:px-14">{item}</span>
          <Sparkle className={cn("size-[0.55em] shrink-0", sparkleClass)} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex w-max will-change-transform" style={{ x: translate, skewX: skew }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
