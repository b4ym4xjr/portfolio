"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PALETTE } from "@/lib/utils";

/**
 * Custom cursor — a sharp orange dot plus a lagging ring that morphs by context.
 *
 *   data-cursor="link"            ring swells around interactive things
 *   data-cursor="view"            ring becomes a solid orange disc with a label
 *   data-cursor-label="Open"      overrides the disc label
 *   data-cursor-theme="dark|accent"  set on a section so the cursor stays legible
 */

type Mode = "default" | "link" | "view";
type Theme = "paper" | "dark" | "accent";

const QUERY = "(hover: hover) and (pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const fore: Record<Theme, string> = {
  paper: PALETTE.ink,
  dark: PALETTE.paper,
  accent: PALETTE.ink,
};
const dotColor: Record<Theme, string> = {
  paper: PALETTE.accent,
  dark: PALETTE.accent,
  accent: PALETTE.ink,
};

export function Cursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("View");
  const [theme, setTheme] = useState<Theme>("paper");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 1100, damping: 55, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 55, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 170, damping: 20, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 170, damping: 20, mass: 0.55 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const target = el?.closest?.("[data-cursor]") as HTMLElement | null;
      const kind = (target?.dataset.cursor as Mode | undefined) ?? "default";
      setMode(kind === "view" || kind === "link" ? kind : "default");
      setLabel(target?.dataset.cursorLabel ?? "View");
      const themed = el?.closest?.("[data-cursor-theme]") as HTMLElement | null;
      setTheme((themed?.dataset.cursorTheme as Theme | undefined) ?? "paper");
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isView = mode === "view";
  const size = isView ? 112 : mode === "link" ? 68 : 36;
  const ringBorder = isView ? PALETTE.accent : fore[theme];

  return (
    <>
      {/* lagging ring / disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
          initial={false}
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
            borderColor: ringBorder,
            backgroundColor: isView ? PALETTE.accent : "rgba(0,0,0,0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.5 }}
        >
          <motion.span
            className="mono-label whitespace-nowrap text-ink"
            initial={false}
            animate={{ opacity: isView ? 1 : 0, scale: isView ? 1 : 0.6 }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* precise dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[151]"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={false}
          animate={{
            width: 8,
            height: 8,
            opacity: visible && !isView ? 1 : 0,
            scale: mode === "link" ? 0.5 : 1,
            backgroundColor: dotColor[theme],
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
