"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {ArrowUpRight} from "lucide-react";
import {useRef} from "react";
import {Halftone} from "@/components/Halftone";
import {MaskText, Reveal, SectionLabel, Sparkle} from "@/components/ui/motion";
import {projects, type Project} from "@/lib/data";
import {EASE_OUT, PALETTE, cn} from "@/lib/utils";

/** Each card gets its own composition so the list never feels templated. */
const layouts = [
    {
        plate: "lg:col-span-8 lg:col-start-1 lg:row-start-1",
        aspect: "aspect-[4/3]",
        info: "lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end lg:pl-4",
        panel: false,
    },
    {
        plate: "lg:col-span-6 lg:col-start-7 lg:row-start-1",
        aspect: "aspect-[4/5]",
        info: "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start lg:pt-28",
        panel: false,
    },
    {
        plate: "lg:col-span-9 lg:col-start-2 lg:row-start-1",
        aspect: "aspect-[16/10]",
        info: "lg:col-span-5 lg:col-start-7 lg:row-start-2 lg:-mt-20",
        panel: true,
    },
    {
        plate: "lg:col-span-6 lg:col-start-5 lg:row-start-1",
        aspect: "aspect-square",
        info: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end",
        panel: false,
    },
] as const;

const toneBg = {mist: "bg-mist", ink: "bg-ink", paper: "bg-paper"} as const;
const tonePaper = {mist: PALETTE.mist, ink: PALETTE.ink, paper: PALETTE.paper} as const;

function AccentShape({shape, className}: { shape: Project["accentShape"]; className: string }) {
    const base = "absolute bg-accent";
    const shapes = {
        circle: "rounded-full",
        square: "",
        bar: "",
        half: "rounded-tl-full",
    } as const;
    return <span aria-hidden className={cn(base, shapes[shape], className)}/>;
}

function Card({project, i}: { project: Project; i: number }) {
    const layout = layouts[i % layouts.length];
    const ref = useRef<HTMLElement>(null);
    const {scrollYProgress} = useScroll({target: ref, offset: ["start end", "end start"]});
    const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
    const accentY = useTransform(scrollYProgress, [0, 1], ["22px", "-22px"]);
    const inverted = project.tone === "ink";

    return (
        <article ref={ref} className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
            {/* plate */}
            <motion.a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
                data-cursor-label="View"
                tabIndex={-1}
                aria-hidden
                className={cn("group relative block", layout.plate)}
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "0px 0px -10% 0px"}}
            >
                <motion.div
                    className={cn("relative overflow-hidden", layout.aspect, toneBg[project.tone], project.tone === "paper" && "border border-ink")}
                    variants={{
                        hidden: {clipPath: "inset(0 0 100% 0)"},
                        show: {clipPath: "inset(0 0 0% 0)"},
                    }}
                    transition={{duration: 1.3, ease: EASE_OUT}}
                >
                    <motion.div
                        className="absolute inset-y-[-9%] inset-x-0 transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                        style={{y}}
                    >
                        {project.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={project.image}
                                alt={`${project.title} — project screenshot`}
                                className="size-full object-cover"
                            />
                        ) : (
                            <Halftone
                                scene={project.scene}
                                cell={6}
                                inverted={inverted}
                                paper={tonePaper[project.tone]}
                                className="size-full"
                            />
                        )}
                    </motion.div>
                    {!project.image && (
                        <motion.div className="absolute inset-0" style={{y: accentY}}>
                            <AccentShape shape={project.accentShape} className={project.accentClass}/>
                        </motion.div>
                    )}

                    <span className="mono-label absolute left-4 top-4 flex items-center gap-2 bg-paper px-2.5 py-1.5 text-ink">
            {project.index} / 0{projects.length}
          </span>
                    <span className="mono-label absolute bottom-4 right-4 bg-ink px-2.5 py-1.5 text-paper">
            {project.year}
          </span>
                    {/* touch devices have no cursor "View" disc — show an explicit cue instead */}
                    <span
                        aria-hidden
                        className="mono-label absolute right-4 top-4 hidden items-center gap-1.5 bg-accent px-2.5 py-1.5 text-ink [@media(hover:none)]:inline-flex"
                    >
            {project.linkLabel ?? "View project"} <ArrowUpRight className="size-3.5" strokeWidth={2}/>
          </span>
                </motion.div>
            </motion.a>

            {/* info */}
            <div className={cn("relative z-10", layout.info)}>
                <div className={cn(layout.panel && "border border-ink bg-paper p-6 md:p-9")}>
                    <Reveal>
            <span className="stroke-ink block text-[clamp(4.5rem,9vw,9.5rem)] font-extrabold leading-[0.8] tracking-[-0.06em]">
              {project.index}
            </span>
                    </Reveal>

                    <h3 className="mt-5">
                        <MaskText
                            lines={[
                                <a
                                    key="t"
                                    href={project.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-cursor="link"
                                    tabIndex={-1}
                                    className="group/t inline-flex min-h-11 items-start gap-2 text-[clamp(2.6rem,5.4vw,5.6rem)] font-bold leading-[0.9] tracking-[-0.055em] decoration-accent decoration-[0.07em] underline-offset-[0.1em] hover:underline"
                                >
                                    {project.title}
                                    <ArrowUpRight
                                        className="mt-[0.15em] size-[0.42em] shrink-0 transition-transform duration-500 group-hover/t:-translate-y-1 group-hover/t:translate-x-1"
                                        strokeWidth={1.5}
                                    />
                                </a>,
                            ]}
                        />
                    </h3>

                    <Reveal delay={0.1} className="mono-label mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span aria-hidden className="size-1.5 bg-accent"/>
                        <span>{project.kind}</span>
                    </Reveal>

                    <Reveal delay={0.15} as="p" className="mt-6 max-w-[40ch] text-[1.05rem] leading-snug tracking-tight text-ink/80">
                        {project.blurb}
                    </Reveal>

                    <Reveal delay={0.18}>
                        <dl className="mt-7 max-w-[44ch] border-t border-ink/25">
                            <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b border-ink/25 py-3">
                                <dt className="mono-label text-ink/75">Role</dt>
                                <dd className="font-medium tracking-tight">{project.role}</dd>
                            </div>
                            {project.result && (
                                <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b border-ink/25 py-3">
                                    <dt className="mono-label text-ink/75">Result</dt>
                                    <dd className="font-medium leading-snug tracking-tight">{project.result}</dd>
                                </div>
                            )}
                        </dl>
                    </Reveal>

                    <Reveal delay={0.2} as="p" className="mt-6 flex flex-wrap gap-2">
                        {project.stack.map((s) => (
                            <span key={s} className="mono-label border border-ink/25 px-2.5 py-1.5">
                {s}
              </span>
                        ))}
                    </Reveal>

                    {/* visible on every device — the one explicit way in, with a ≥44px hit area */}
                    <Reveal delay={0.24} className="mt-5">
                        <a
                            href={project.href}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="link"
                            aria-label={`${project.linkLabel ?? "View project"}: ${project.title}`}
                            className="group/row -mx-1 inline-flex min-h-11 items-center gap-2 border-b border-ink px-1 text-[1.05rem] font-medium tracking-tight"
                        >
                            {project.linkLabel ?? "View project"}
                            <ArrowUpRight
                                className="size-[1.1em] transition-transform duration-500 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5"
                                strokeWidth={1.75}
                            />
                        </a>
                    </Reveal>
                </div>
            </div>
        </article>
    );
}

export function Work() {
    return (
        <section id="work" className="relative border-t border-ink/20 py-24 md:py-32">
            <div className="wrap">
                <SectionLabel index="02" title="Selected Work"/>

                <h2 className="display mt-14 text-[clamp(4.6rem,15vw,16rem)] lg:mt-20">
                    <MaskText lines={["Selected", "Work"]} lineClasses={["", "lg:pl-[1.2em]"]}/>
                </h2>
                <div className="mt-8 flex items-start justify-between gap-8 lg:mt-4 lg:pl-[39%]">
                    <Reveal as="p" className="max-w-sm text-lg leading-snug tracking-tight text-ink/70">
                        Four projects across secure systems, security tooling and full-stack engineering — each built to be used, audited and
                        maintained.
                    </Reveal>
                    <Sparkle className="hidden size-14 shrink-0 text-accent md:block"/>
                </div>

                <div className="mt-24 flex flex-col gap-24 md:mt-32 md:gap-32">
                    {projects.map((p, i) => (
                        <Card key={p.title} project={p} i={i}/>
                    ))}
                </div>
            </div>
        </section>
    );
}
