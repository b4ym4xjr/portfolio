"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";
import {MaskText, Reveal, SectionLabel} from "@/components/ui/motion";
import {education} from "@/lib/data";
import {EASE_OUT} from "@/lib/utils";

export function Education() {
    const ref = useRef<HTMLElement>(null);
    const {scrollYProgress} = useScroll({target: ref, offset: ["start end", "end start"]});
    // a gentle sway — the mark stays inside its own box, never crossing the section edge
    const rotate = useTransform(scrollYProgress, [0, 1], [-18, 18]);
    const shift = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

    return (
        <section
            ref={ref}
            id="education"
            className="relative overflow-hidden border-t border-ink/20 bg-mist py-24 md:py-32"
        >
            <div className="wrap relative">
                <SectionLabel index="05" title="Education"/>

                <div className="mt-14 grid gap-y-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-6">
                    {/* headline */}
                    <div className="lg:col-span-6">
                        <h2 className="display text-[clamp(3.4rem,7.6vw,8.5rem)]">
                            <MaskText lines={["Academic", "background."]} lineClasses={["", "lg:pl-[0.35em]"]}/>
                        </h2>
                        <motion.div
                            className="stroke-ink mt-10 select-none text-[clamp(8rem,22vw,24rem)] font-bold leading-[0.75] tracking-[-0.02em] lg:mt-24"
                            style={{x: shift}}
                            aria-hidden
                        >
                            MSc
                        </motion.div>
                    </div>

                    {/* right column: a deliberate mark sitting on the grid, then the entries */}
                    <div className="lg:col-span-5 lg:col-start-8">
                        <motion.svg
                            aria-hidden
                            viewBox="0 0 200 200"
                            className="mb-12 size-28 overflow-visible lg:mb-14 lg:ml-auto lg:size-44"
                            style={{rotate}}
                        >
                            <path d="M0 200A200 200 0 0 1 200 0v200Z" className="fill-paper"/>
                            <path d="M0 200A100 100 0 0 1 100 100v100Z" className="fill-accent"/>
                            <path d="M0 200A200 200 0 0 1 200 0" fill="none" stroke="#111111" strokeWidth="1.5"/>
                        </motion.svg>

                        <ol>
                            {education.map((e, i) => (
                                <motion.li
                                    key={e.title}
                                    className="group border-t border-ink py-8 md:py-10 lg:first:border-t"
                                    initial={{opacity: 0, y: 30}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true, margin: "0px 0px -12% 0px"}}
                                    transition={{duration: 0.9, ease: EASE_OUT, delay: i * 0.06}}
                                >
                                    <div className="flex items-baseline justify-between gap-6">
                                        <span className="mono-label text-ink/75">{e.period}</span>
                                        <span className="mono-label">0{i + 1}</span>
                                    </div>
                                    <h3
                                        className={`mt-4 font-bold leading-[0.98] tracking-[-0.045em] ${
                                            e.big ? "text-[clamp(2.2rem,3.8vw,4rem)]" : "text-[clamp(1.7rem,2.6vw,2.6rem)]"
                                        }`}
                                    >
                                        {e.title}
                                    </h3>
                                    <p className="mt-3 font-serif text-[1.35rem] italic leading-tight">{e.org}</p>
                                    <Reveal as="p" delay={0.1} className="mt-4 max-w-[44ch] leading-snug tracking-tight text-ink/70">
                                        {e.blurb}
                                    </Reveal>
                                </motion.li>
                            ))}
                            <li className="border-t border-ink" aria-hidden/>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
