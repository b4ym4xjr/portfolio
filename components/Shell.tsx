"use client";

import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Cursor } from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { EASE_IN_OUT } from "@/lib/utils";

const LoadedContext = createContext(false);

/** True once the preloader curtain starts lifting — gate hero animations on it. */
export const useLoaded = () => useContext(LoadedContext);

function Preloader({ onLift }: { onLift: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString().padStart(3, "0"));
  const bar = useTransform(count, [0, 100], ["0%", "100%"]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const controls = animate(count, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        setTimeout(() => {
          setDone(true);
          onLift();
        }, 150);
      },
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [count, onLift]);

  return (
    <AnimatePresence onExitComplete={() => (document.documentElement.style.overflow = "")}>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-5 py-6 text-paper md:px-10 md:py-8"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: EASE_IN_OUT }}
        >
          <div className="flex items-start justify-between">
            <span className="text-2xl font-bold tracking-tight">
              S<span className="text-accent">/</span>O
            </span>
            <span className="mono-label text-paper/60">Portfolio — 2026</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="max-w-[16rem]">
              <span className="mono-label block text-paper/60">Loading selected work</span>
              <span className="mt-3 block h-px w-full bg-paper/20">
                <motion.span className="block h-px bg-accent" style={{ width: bar }} />
              </span>
            </div>
            <motion.span className="display text-[clamp(6rem,24vw,22rem)] leading-[0.75] tabular-nums">
              {rounded}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const lift = useCallback(() => setLoaded(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <LoadedContext.Provider value={loaded}>
        <Cursor />
        <ScrollProgress />
        <Preloader onLift={lift} />
        {children}
      </LoadedContext.Provider>
    </MotionConfig>
  );
}
