"use client";

import {motion, useScroll} from "framer-motion";
import {useRef} from "react";
import {MaskText, Reveal, SectionLabel} from "@/components/ui/motion";
import {experience} from "@/lib/data";
import {EASE_OUT, cn} from "@/lib/utils";

export function Experience() {
    const ref = useRef<HTMLDivElement>(null);
    const {scrollYProgress} = useScroll({target: ref, offset: ["start 65%", "end 55%"]});

    return (
        <section id="experience" className="relative py-24 md:py-32">
            <div className="wrap">
                <SectionLabel index="04" title="Experience"/>

                <div className="mt-14 flex flex-col justify-between gap-8 lg:mt-20 lg:flex-row lg:items-end">
                    <h2 className="display text-[clamp(4.2rem,13vw,14rem)]">
                        <MaskText lines={["Experience"]}/>
                    </h2>
                    <Reveal as="p" className="max-w-[26ch] text-lg leading-snug tracking-tight text-ink/70 lg:mb-4">
                        Shipping software where reliability and security are not optional.
                    </Reveal>
                </div>

                <div ref={ref} className="relative mt-20 md:mt-28">
                    {/* timeline spine: hairline + a line that draws with scroll */}
                    <span aria-hidden className="absolute bottom-0 left-1.75 top-0 w-px bg-ink/20 md:left-[25%]"/>
                    <motion.span
                        aria-hidden
                        className="absolute bottom-0 left-1.75 top-0 w-px origin-top bg-ink md:left-[25%]"
                        style={{scaleY: scrollYProgress}}
                    />

                    <ol>
                        {experience.map((job, i) => (
                            <li
                                key={job.role}
                                className="relative grid gap-x-6 gap-y-4 border-t border-ink/15 py-12 pl-9 md:grid-cols-12 md:pl-0 md:py-16"
                            >
                                <motion.span
                                    aria-hidden
                                    className={cn(
                                        "absolute left-1.75 top-[3.35rem] size-3.75 -translate-x-1/2 border border-ink md:left-[25%] md:top-[4.6rem]",
                                        job.current ? "rounded-full bg-accent" : "bg-paper",
                                    )}
                                    initial={{scale: 0}}
                                    whileInView={{scale: 1}}
                                    viewport={{once: true, margin: "0px 0px -20% 0px"}}
                                    transition={{duration: 0.6, ease: EASE_OUT}}
                                />

                                <div className="md:col-span-3 md:pr-12 md:text-right">
                                    <span className="mono-label block text-ink/75">{job.period}</span>
                                    {job.current && (
                                        <span className="mono-label mt-2 inline-flex items-center gap-2">
                      <span className="size-1.5 animate-blink rounded-full bg-accent"/> Current
                    </span>
                                    )}
                                </div>

                                <div className={cn("md:col-span-8 md:col-start-5", i % 2 === 1 && "md:pl-[6%]")}>
                                    <h3 className="text-[clamp(2rem,4.4vw,4.6rem)] font-bold leading-[0.95] tracking-tighter">
                                        <MaskText lines={[job.role]}/>
                                    </h3>
                                    <Reveal delay={0.1} className="mt-4 flex flex-wrap items-baseline gap-x-4">
                                        <span className="font-serif text-[1.6rem] italic leading-none md:text-[2rem]">{job.org}</span>
                                        <span className="mono-label text-ink/70">{job.place}</span>
                                    </Reveal>
                                    <Reveal delay={0.18} as="p" className="mt-6 max-w-[52ch] text-[1.05rem] leading-snug tracking-tight text-ink/75">
                                        {job.blurb}
                                    </Reveal>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
