"use client";

import {AnimatePresence, motion, useMotionValueEvent, useScroll} from "framer-motion";
import {ArrowUpRight, Download, Menu, X} from "lucide-react";
import {useEffect, useState} from "react";
import {Magnetic} from "@/components/ui/motion";
import {useLoaded} from "@/components/Shell";
import {navAlias, navItems, profile} from "@/lib/data";
import {EASE_IN_OUT, EASE_OUT, cn} from "@/lib/utils";

const SECTION_IDS = ["home", "about", "work", "expertise", "experience", "education", "contact"];

function useActiveSection() {
    const [active, setActive] = useState("home");
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id);
                }
            },
            {rootMargin: "-45% 0px -50% 0px"},
        );
        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);
    return navAlias[active] ?? active;
}

export function Header() {
    const loaded = useLoaded();
    const active = useActiveSection();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const {scrollY} = useScroll();
    useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

    return (
        <motion.header
            className={cn(
                "fixed inset-x-0 top-0 z-70 border-b transition-colors duration-500",
                scrolled || open ? "border-ink/15 bg-paper" : "border-transparent bg-transparent",
            )}
            initial={{y: "-100%"}}
            animate={{y: loaded ? 0 : "-100%"}}
            transition={{duration: 0.9, ease: EASE_OUT, delay: 0.25}}
        >
            <div className="wrap flex h-16 items-center justify-between md:h-18">
                <a
                    href="#home"
                    data-cursor="link"
                    aria-label="S.R. Oli — home"
                    className="group -ml-1 inline-flex min-h-11 min-w-11 items-center px-1 text-[1.65rem] font-bold leading-none tracking-tight"
                >
                    S
                    <span
                        className="mx-px inline-block text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-24">
            /
          </span>
                    O
                </a>

                <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => {
                        const isActive = active === item.id;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                data-cursor="link"
                                className="relative inline-flex min-h-11 items-center px-4 text-[14px] font-medium tracking-tight"
                            >
                <span className={cn("transition-opacity duration-300", isActive ? "opacity-100" : "opacity-60 hover:opacity-100")}>
                  {item.label}
                </span>
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute inset-x-4 bottom-1 h-0.5 bg-accent"
                                        transition={{duration: 0.6, ease: EASE_IN_OUT}}
                                    />
                                )}
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <Magnetic strength={0.25} className="max-lg:hidden">
                        <a
                            href={profile.cv}
                            download
                            data-cursor="link"
                            className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-ink px-5 text-[14px] font-medium text-paper"
                        >
              <span
                  aria-hidden
                  className="absolute inset-0 translate-y-[101%] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
              />
                            <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-ink">
                <Download className="size-4" strokeWidth={1.75}/>
                Download CV
              </span>
                        </a>
                    </Magnetic>
                    {/* below lg the primary action is Contact; the CV moves into the menu */}
                    <a
                        href="#contact"
                        data-cursor="link"
                        className="group relative inline-flex h-11 items-center gap-1.5 overflow-hidden rounded-full bg-ink px-5 text-[14px] font-medium text-paper lg:hidden"
                    >
            <span
                aria-hidden
                className="absolute inset-0 translate-y-[101%] bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
            />
                        <span className="relative z-10 inline-flex items-center gap-1.5 transition-colors duration-300 group-hover:text-ink">
              Contact
              <ArrowUpRight className="size-4" strokeWidth={1.75}/>
            </span>
                    </a>
                    <button
                        type="button"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        data-cursor="link"
                        onClick={() => setOpen((o) => !o)}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 lg:hidden"
                    >
                        {open ? <X className="size-5" strokeWidth={1.5}/> : <Menu className="size-5" strokeWidth={1.5}/>}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="overflow-hidden border-t border-ink/15 bg-paper lg:hidden"
                        initial={{height: 0}}
                        animate={{height: "auto"}}
                        exit={{height: 0}}
                        transition={{duration: 0.6, ease: EASE_IN_OUT}}
                    >
                        <nav className="wrap flex flex-col py-4">
                            {navItems.map((item, i) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={() => setOpen(false)}
                                    className="flex items-baseline justify-between border-b border-ink/10 py-4 text-4xl font-bold tracking-tighter last:border-0"
                                >
                                    {item.label}
                                    <span className="mono-label text-ink/70">0{i + 1}</span>
                                </a>
                            ))}
                            <a
                                href={profile.cv}
                                download
                                className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink text-[15px] font-medium"
                            >
                                <Download className="size-4" strokeWidth={1.75}/> Download CV
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
