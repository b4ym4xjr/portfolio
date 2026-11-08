"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { MaskText, Reveal, SectionLabel } from "@/components/ui/motion";
import { expertise, type Discipline } from "@/lib/data";
import { EASE_OUT, cn } from "@/lib/utils";

/** Abstract geometry — each discipline owns a mark that reacts to hover. */
function Mark({ shape, active }: { shape: Discipline["shape"]; active: boolean }) {
  const t = { duration: 0.9, ease: EASE_OUT };
  if (shape === "square") {
    return (
      <svg viewBox="0 0 120 120" className="size-full overflow-visible" aria-hidden>
        <motion.rect
          x="20"
          y="20"
          width="80"
          height="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ rotate: active ? 45 : 0 }}
          style={{ transformOrigin: "60px 60px" }}
          transition={t}
        />
        <motion.rect
          x="44"
          y="44"
          width="32"
          height="32"
          className={active ? "fill-ink" : "fill-accent"}
          animate={{ rotate: active ? -45 : 0, scale: active ? 1.4 : 1 }}
          style={{ transformOrigin: "60px 60px" }}
          transition={t}
        />
      </svg>
    );
  }
  if (shape === "ring") {
    return (
      <svg viewBox="0 0 120 120" className="size-full overflow-visible" aria-hidden>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <motion.circle
          cx="60"
          cy="60"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={{ scale: active ? 1.5 : 1 }}
          style={{ transformOrigin: "60px 60px" }}
          transition={t}
        />
        <motion.circle
          cx="60"
          cy="60"
          r="9"
          className={active ? "fill-ink" : "fill-accent"}
          animate={{ cx: active ? 92 : 60 }}
          transition={t}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="size-full overflow-visible" aria-hidden>
      {Array.from({ length: 25 }).map((_, i) => {
        const cx = 20 + (i % 5) * 20;
        const cy = 20 + Math.floor(i / 5) * 20;
        const hot = i === 12;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={hot ? 8 : 3}
            className={hot ? (active ? "fill-ink" : "fill-accent") : "fill-current"}
            animate={{
              r: hot ? (active ? 11 : 8) : active ? 6.5 - Math.hypot(cx - 60, cy - 60) / 14 : 3,
            }}
            transition={{ ...t, delay: active ? Math.hypot(cx - 60, cy - 60) / 400 : 0 }}
          />
        );
      })}
    </svg>
  );
}

function Row({ item, active, onEnter }: { item: Discipline; active: boolean; onEnter: () => void }) {
  return (
    <motion.li
      onMouseEnter={onEnter}
      onFocus={onEnter}
      data-cursor="link"
      className="group relative border-t border-paper/20 last:border-b"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8 }}
    >
      {/* hover wash — a slab of orange rising from the baseline */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-bottom bg-accent transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          active ? "scale-y-100" : "scale-y-0",
        )}
      />
      <div
        className={cn(
          "relative grid items-center gap-x-6 gap-y-8 py-10 transition-colors duration-500 md:py-14 lg:grid-cols-12",
          active ? "text-ink" : "text-paper",
        )}
      >
        <span className="mono-label lg:col-span-1">
          <span className="lg:pl-0">{item.index}</span>
        </span>

        <h3
          className={cn(
            "display text-[clamp(2.8rem,7.4vw,8.5rem)] leading-[0.88] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-span-7",
            active && "lg:translate-x-6",
          )}
        >
          {item.title}
        </h3>

        <div className="lg:col-span-3 lg:col-start-9">
          <p className="max-w-[34ch] text-[1.02rem] leading-snug tracking-tight opacity-80">{item.lead}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <li key={t} className="mono-label border border-current px-2 py-1 opacity-80">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden size-20 justify-self-end lg:col-span-1 lg:block xl:size-24">
          <Mark shape={item.shape} active={active} />
        </div>
      </div>
    </motion.li>
  );
}

export function Expertise() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="expertise"
      data-cursor-theme="dark"
      className="relative bg-ink py-24 text-paper md:py-32"
    >
      <div className="wrap">
        <SectionLabel index="03" title="Expertise" />

        <div className="mt-14 grid gap-y-8 lg:mt-20 lg:grid-cols-12 lg:gap-x-6">
          <h2 className="display text-[clamp(4rem,12vw,13rem)] lg:col-span-9">
            <MaskText lines={["Three", "disciplines,"]} lineClasses={["", "lg:pl-[0.8em]"]} />
            <MaskText
              delay={0.2}
              lines={[
                <span key="one" className="font-serif text-[0.92em] font-normal italic tracking-[-0.03em] text-accent">
                  one craft.
                </span>,
              ]}
              lineClasses={["lg:pl-[1.8em]"]}
            />
          </h2>
          <Reveal
            as="p"
            className="max-w-[30ch] self-end text-lg leading-snug tracking-tight text-paper/70 lg:col-span-3"
          >
            Security is not a layer you add at the end, and machine learning is not magic. They are engineering — practised together.
          </Reveal>
        </div>

        <ul
          className="mt-20 md:mt-28"
          onMouseLeave={() => setActive(null)}
        >
          {expertise.map((item, i) => (
            <Row key={item.title} item={item} active={active === i} onEnter={() => setActive(i)} />
          ))}
        </ul>

        <p className="mono-label mt-8 flex items-center gap-2 text-paper/70">
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} /> Hover a discipline
        </p>
      </div>
    </section>
  );
}
