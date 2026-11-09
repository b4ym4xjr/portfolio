"use client";

import {
    animate,
    motion,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import {ArrowRight, GraduationCap, Mail, MapPin} from "lucide-react";
import {useEffect, type MouseEvent} from "react";
import {MobileChips, Portrait} from "@/components/Portrait";
import {useLoaded} from "@/components/Shell";
import {Button} from "@/components/ui/Button";
import {socialIcons} from "@/components/ui/icons";
import {MaskText} from "@/components/ui/motion";
import {profile, socials, stats} from "@/lib/data";
import {EASE_OUT} from "@/lib/utils";

function Letters({text}: { text: string }) {
    return (
        <>
            {text.split("").map((c, i) => (
                <span key={i} className="hero-letter">
          {c}
        </span>
            ))}
        </>
    );
}

function CountUp({to, suffix}: { to: number; suffix: string }) {
    const loaded = useLoaded();
    const value = useMotionValue(0);
    const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);
    useEffect(() => {
        if (!loaded) return;
        const controls = animate(value, to, {duration: 1.8, ease: EASE_OUT, delay: 1.1});
        return () => controls.stop();
    }, [loaded, to, value]);
    return <motion.span>{text}</motion.span>;
}

export function Hero({portraitSrc}: { portraitSrc: string | null }) {
    const loaded = useLoaded();

    // normalized pointer position over the hero, eased
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const mx = useSpring(rawX, {stiffness: 55, damping: 18, mass: 0.6});
    const my = useSpring(rawY, {stiffness: 55, damping: 18, mass: 0.6});

    const onMove = (e: MouseEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        rawX.set((e.clientX - r.left) / r.width - 0.5);
        rawY.set((e.clientY - r.top) / r.height - 0.5);
    };

    const {scrollY} = useScroll();
    const nameY = useTransform(scrollY, [0, 900], [0, -140]);
    const portraitY = useTransform(scrollY, [0, 900], [0, 70]);

    const enter = (delay: number) => ({
        initial: {opacity: 0, y: 26},
        animate: loaded ? {opacity: 1, y: 0} : {},
        transition: {duration: 1, ease: EASE_OUT, delay},
    });

    return (
        <section id="home" onMouseMove={onMove} className="relative overflow-hidden pt-24 md:pt-24">
            <div className="wrap">
                {/* DOM order = phone order: headline → portrait → copy. From lg up, the portrait spans both rows on the right. */}
                <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
                    {/* ───────── type ───────── */}
                    <div className="relative z-20 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:pt-6">
                        <motion.div {...enter(0.3)} className="flex flex-wrap items-center gap-4">
              <span className="mono-label inline-flex items-center gap-2.5 rounded-full border border-ink/20 py-2 pl-3.5 pr-4">
                <span className="size-2 rounded-full bg-accent"/>
                  {profile.role}
              </span>
                            <span className="mono-label hidden text-ink/70 sm:inline">Portfolio ’26 — Index 01/07</span>
                        </motion.div>

                        <motion.h1
                            style={{y: nameY}}
                            className="display relative mt-7 text-[clamp(4.4rem,24vw,9rem)] lg:mt-8 lg:text-[clamp(4.4rem,13vw,14rem)]"
                        >
                            <MaskText
                                onLoad
                                delay={0.45}
                                stagger={0.11}
                                lineClasses={["", "", "pl-[0.5em]"]}
                                lines={[
                                    <span
                                        key="hi"
                                        className="block pb-[0.2em] font-serif text-[0.27em] font-normal italic leading-none tracking-normal"
                                    >
                    Hi, I’m
                  </span>,
                                    <span key="first">
                    <Letters text="S.R."/>
                  </span>,
                                    <span key="last" className="inline-flex items-baseline">
                    <Letters text="Oli"/>
                    <span className="text-accent">.</span>
                  </span>,
                                ]}
                            />
                        </motion.h1>
                    </div>

                    {/* ───────── portrait composition ───────── */}
                    <div className="mt-5 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-2">
                        <motion.div style={{y: portraitY}} className="ml-auto mr-[3%] w-[66%] max-w-75 md:mx-0 md:w-auto md:max-w-none">
                            <Portrait src={portraitSrc} mx={mx} my={my}/>
                        </motion.div>
                        <MobileChips/>
                        <motion.p
                            {...enter(1.6)}
                            className="mono-label mt-8 hidden justify-between text-ink/70 md:flex lg:pl-[8%]"
                        >
                            <span>Fig. 01 — S. Oli</span>
                            <span>Monochrome, 2026</span>
                        </motion.p>
                    </div>

                    {/* ───────── copy, calls to action, socials ───────── */}
                    <div className="relative z-20 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:self-start">
                        <div className="mt-10 max-w-120 lg:mt-9">
                            <motion.p
                                {...enter(1.15)}
                                className="text-[1.15rem] leading-[1.35] tracking-tight text-ink/80 md:text-[1.3rem]"
                            >
                                {profile.intro}
                            </motion.p>

                            <motion.div {...enter(1.3)} className="mt-7 flex flex-wrap gap-3">
                                <Button href="#work">
                                    View Projects <ArrowRight className="size-4.5" strokeWidth={1.75}/>
                                </Button>
                                <Button href="#contact" variant="outline">
                                    <Mail className="size-4.5" strokeWidth={1.5}/> Get in Touch
                                </Button>
                            </motion.div>

                            <motion.ul {...enter(1.45)} className="mt-5 flex gap-2.5">
                                {socials.map((s) => {
                                    const Icon = socialIcons[s.id];
                                    return (
                                        <li key={s.id}>
                                            <a
                                                href={s.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={s.label}
                                                data-cursor="link"
                                                className="group relative grid size-11 place-items-center overflow-hidden rounded-full border border-ink/20"
                                            >
                        <span
                            aria-hidden
                            className="absolute inset-0 translate-y-[101%] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                        />
                                                <Icon className="relative size-4.25 transition-colors duration-300 group-hover:text-paper"/>
                                            </a>
                                        </li>
                                    );
                                })}
                            </motion.ul>
                        </div>
                    </div>

                </div>

                {/* ───────── stats ───────── */}
                <motion.dl
                    {...enter(1.5)}
                    className="mt-16 grid grid-cols-2 border-t border-ink/20 lg:mt-20 lg:grid-cols-4"
                >
                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            className={`flex items-center gap-4 py-7 pr-4 lg:px-8 lg:first:pl-0 ${
                                i % 2 === 1 ? "pl-5 border-l border-ink/20" : ""
                            } ${i > 0 ? "lg:border-l lg:border-ink/20" : ""} ${i >= 2 ? "border-t border-ink/20 lg:border-t-0" : ""}`}
                        >
                            {s.icon === "cap" && <GraduationCap className="size-8 shrink-0" strokeWidth={1.25}/>}
                            {s.icon === "pin" && <MapPin className="size-8 shrink-0" strokeWidth={1.25}/>}
                            <div>
                                <dt className="text-[1.55rem] sm:text-[1.9rem] lg:whitespace-nowrap lg:text-[clamp(1.7rem,2.7vw,2.9rem)] font-bold leading-none tracking-tighter">
                                    {s.count !== null ? <CountUp to={s.count} suffix={s.suffix}/> : s.big}
                                </dt>
                                <dd className="mono-label mt-2.5 text-ink/75">{s.label}</dd>
                            </div>
                        </div>
                    ))}
                </motion.dl>
            </div>
        </section>
    );
}
