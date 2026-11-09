"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";
import {Credentials} from "@/components/Credentials";
import {Halftone} from "@/components/Halftone";
import {MaskText, Reveal, SectionLabel, WordFade} from "@/components/ui/motion";
import {about} from "@/lib/data";
import {EASE_OUT, PALETTE} from "@/lib/utils";

export function About() {
    const plateRef = useRef<HTMLDivElement>(null);
    const {scrollYProgress} = useScroll({target: plateRef, offset: ["start end", "end start"]});
    const plateY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
    const circleY = useTransform(scrollYProgress, [0, 1], ["40%", "-60%"]);

    return (
        <section id="about" className="relative border-t border-ink/20 py-24 md:py-32">
            <div className="wrap">
                <SectionLabel index="01" title="About"/>

                <div className="mt-16 grid gap-y-16 lg:mt-24 lg:grid-cols-12 lg:gap-x-6">
                    {/* plate — narrow, tall, pushed down for asymmetry */}
                    <div className="lg:col-span-3 lg:row-span-2 lg:mt-40">
                        <motion.div
                            ref={plateRef}
                            className="relative aspect-3/4 overflow-hidden bg-mist"
                            initial="hidden"
                            whileInView="show"
                            viewport={{once: true, margin: "0px 0px -10% 0px"}}
                        >
                            <motion.div
                                className="absolute inset-y-[-10%] inset-x-0"
                                style={{y: plateY}}
                                variants={{
                                    hidden: {clipPath: "inset(100% 0 0 0)"},
                                    show: {clipPath: "inset(0% 0 0 0)"},
                                }}
                                transition={{duration: 1.4, ease: EASE_OUT}}
                            >
                                <Halftone scene="dawn" cell={6} paper={PALETTE.mist} className="size-full"/>
                            </motion.div>
                            <motion.span
                                aria-hidden
                                className="absolute bottom-0 left-1/2 aspect-square w-[46%] -translate-x-1/2 rounded-full bg-accent"
                                style={{y: circleY}}
                            />
                        </motion.div>
                        <p className="mono-label mt-4 flex justify-between text-ink/70">
                            <span>Fig. 02</span>
                            <span>Dawn, halftone</span>
                        </p>
                    </div>

                    {/* lead paragraph */}
                    <div className="lg:col-span-9 lg:col-start-4 lg:pl-[4%]">
                        <WordFade
                            text={about.lead}
                            className="text-[clamp(1.9rem,3.9vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.04em]"
                        />
                    </div>

                    {/* story + facts */}
                    <div className="grid gap-12 lg:col-span-9 lg:col-start-4 lg:grid-cols-9 lg:pl-[4%]">
                        <div className="lg:col-span-4 lg:col-start-1">
                            <MaskText
                                lines={[
                                    <span key="a" className="mono-label">
                    The short story
                  </span>,
                                ]}
                            />
                            <Reveal delay={0.1} as="p" className="mt-5 max-w-[34ch] font-serif text-[1.7rem] italic leading-[1.2] md:text-[2rem]">
                                {about.story}
                            </Reveal>
                        </div>

                        <dl className="lg:col-span-5">
                            {about.facts.map((f, i) => (
                                <Reveal
                                    key={f.k}
                                    delay={i * 0.08}
                                    className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-t border-ink/20 py-5 last:border-b"
                                >
                                    <dt className="mono-label text-ink/70">{f.k}</dt>
                                    <dd className="text-xl font-medium tracking-tight md:text-2xl">{f.v}</dd>
                                </Reveal>
                            ))}
                        </dl>
                    </div>
                </div>

                <Credentials/>
            </div>
        </section>
    );
}
