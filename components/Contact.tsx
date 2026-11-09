"use client";

import {motion} from "framer-motion";
import {ArrowUp, ArrowUpRight} from "lucide-react";
import {useSyncExternalStore} from "react";
import {Availability} from "@/components/Credentials";
import {ContactForm} from "@/components/ContactForm";
import {Marquee} from "@/components/Marquee";
import {socialIcons} from "@/components/ui/icons";
import {MaskText, Reveal, SectionLabel} from "@/components/ui/motion";
import {profile, socials} from "@/lib/data";
import {scrollToTarget} from "@/lib/scroll";
import {EASE_OUT} from "@/lib/utils";

function subscribeMinute(cb: () => void) {
    const id = setInterval(cb, 15_000);
    return () => clearInterval(id);
}

function useLocalTime() {
    return useSyncExternalStore(
        subscribeMinute,
        () =>
            new Intl.DateTimeFormat("en-CA", {
                timeZone: profile.timeZone,
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
                hour12: false,
            }).format(new Date()),
        () => "",
    );
}

export function Contact() {
    const time = useLocalTime();

    return (
        <section
            id="contact"
            data-cursor-theme="accent"
            className="relative overflow-hidden bg-accent text-ink"
        >
            <Marquee
                className="border-b border-ink py-4 font-serif text-[clamp(1.6rem,3vw,2.8rem)] italic"
                items={["Open to opportunities", "Let’s talk", "Secure by design", "Say hello"]}
                sparkleClass="text-ink"
            />

            <div className="wrap pb-10 pt-24 md:pt-36">
                <SectionLabel index="06" title="Contact"/>

                <h2 className="display mt-14 text-[clamp(4rem,14.2vw,15.5rem)] lg:mt-20">
                    <MaskText
                        lines={[
                            "Let’s build",
                            "something",
                            <span key="u" className="inline-flex items-baseline gap-[0.05em]">
                <span className="font-serif font-normal italic tracking-[-0.04em]">uncommon</span>
                <span className="inline-block size-[0.14em] bg-ink"/>
              </span>,
                        ]}
                        lineClasses={["", "lg:pl-[1.1em]", "lg:pl-[0.3em]"]}
                    />
                </h2>

                <div className="mt-20 grid gap-y-16 lg:mt-28 lg:grid-cols-12 lg:gap-x-6">
                    {/* PRIMARY — the form */}
                    <div className="lg:col-span-7">
                        <Reveal>
                            <Availability dotClassName="bg-ink" className="mb-5"/>
                            <p className="mb-6 text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.04em]">
                                Tell me about the project.
                            </p>
                            <ContactForm/>
                        </Reveal>
                    </div>

                    {/* SECONDARY — direct routes */}
                    <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9 lg:pt-15">
                        <div>
                            <Reveal as="p" className="mono-label mb-3">
                                Or write directly
                            </Reveal>
                            <a
                                href={`mailto:${profile.email}`}
                                data-cursor="link"
                                className="group relative -my-3 inline-block break-all py-3 text-[clamp(1.25rem,2vw,1.75rem)] font-bold leading-[1.1] tracking-[-0.04em]"
                            >
                                {profile.email}
                                <motion.span
                                    aria-hidden
                                    className="absolute bottom-2.5 left-0 h-0.5 w-full origin-left bg-ink"
                                    initial={{scaleX: 0}}
                                    whileInView={{scaleX: 1}}
                                    viewport={{once: true}}
                                    transition={{duration: 1.2, ease: EASE_OUT, delay: 0.3}}
                                />
                                <ArrowUpRight
                                    className="ml-1.5 inline size-[0.8em] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                                    strokeWidth={1.75}
                                />
                            </a>
                        </div>

                        <ul className="border-t border-ink">
                            {socials.map((s) => {
                                const Icon = socialIcons[s.id];
                                return (
                                    <li key={s.id} className="border-b border-ink">
                                        <a
                                            href={s.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            data-cursor="link"
                                            className="group flex min-h-11 items-center justify-between py-3.5 text-xl font-medium tracking-tight transition-[padding] duration-500 hover:pl-3"
                                        >
                      <span className="flex items-center gap-3.5">
                        <Icon className="size-4.5"/>
                          {s.label}
                      </span>
                                            <ArrowUpRight
                                                className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                strokeWidth={1.5}
                                            />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* footer */}
                <footer
                    className="mono-label mt-24 flex flex-col gap-4 border-t border-ink pt-6 md:mt-36 md:flex-row md:items-center md:justify-between">
                    <span>© 2026 {profile.name}. All rights reserved.</span>
                    <span className="flex items-center gap-2">
            <span className="size-1.5 animate-blink rounded-full bg-ink"/>
                        {time ? <span className="tabular-nums">Local time — {time}</span> : <span>Local time</span>}
          </span>
                    <button
                        type="button"
                        data-cursor="link"
                        onClick={() => scrollToTarget(0)}
                        className="group -my-3 inline-flex min-h-11 items-center gap-2 self-start py-3 uppercase tracking-[0.12em] md:self-auto"
                    >
                        Back to top
                        <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.75}/>
                    </button>
                </footer>
            </div>
        </section>
    );
}
