"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Download, Mail } from "lucide-react";
import { useSyncExternalStore } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Marquee } from "@/components/Marquee";
import { socialIcons } from "@/components/ui/icons";
import { Magnetic, MaskText, Reveal, SectionLabel } from "@/components/ui/motion";
import { profile, socials } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { EASE_OUT } from "@/lib/utils";

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
        <SectionLabel index="06" title="Contact" />

        <h2 className="display mt-14 text-[clamp(4rem,14.2vw,15.5rem)] lg:mt-20">
          <MaskText
            lines={[
              "Let’s build",
              "something",
              <span key="u" className="inline-flex items-baseline gap-[0.05em]">
                <span className="font-serif font-normal italic tracking-[-0.04em]">uncommon</span>
                <span className="inline-block size-[0.14em] bg-ink" />
              </span>,
            ]}
            lineClasses={["", "lg:pl-[1.1em]", "lg:pl-[0.3em]"]}
          />
        </h2>

        <div className="mt-20 grid gap-y-14 lg:mt-32 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <Reveal as="p" className="mono-label mb-4">
              Write to me
            </Reveal>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="group relative inline-block break-all text-[clamp(1.6rem,4.4vw,4.8rem)] font-bold leading-[1] tracking-[-0.05em]"
            >
              {profile.email}
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-ink"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.3 }}
              />
              <ArrowUpRight
                className="ml-2 inline size-[0.7em] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </a>

            <Reveal className="mt-16 lg:mt-24">
              <p className="mono-label mb-6">Or leave a note</p>
              <ContactForm />
            </Reveal>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap gap-3">
              <Magnetic strength={0.2}>
                <a
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.getElementById("contact-form");
                    if (form) scrollToTarget(form, { offset: -(window.innerHeight / 2 - form.offsetHeight / 2) });
                    window.setTimeout(() => form?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true }), 600);
                  }}
                  data-cursor="link"
                  className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 text-[15px] font-medium text-paper"
                >
                  <span aria-hidden className="absolute inset-0 translate-y-[101%] bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative inline-flex items-center gap-2.5 transition-colors duration-300 group-hover:text-ink">
                    <Mail className="size-[18px]" strokeWidth={1.5} /> Start a conversation
                  </span>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href={profile.cv}
                  download
                  data-cursor="link"
                  className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full border border-ink px-7 text-[15px] font-medium"
                >
                  <span aria-hidden className="absolute inset-0 translate-y-[101%] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative inline-flex items-center gap-2.5 transition-colors duration-300 group-hover:text-paper">
                    <Download className="size-[18px]" strokeWidth={1.5} /> Download CV
                  </span>
                </a>
              </Magnetic>
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
                      className="group flex items-center justify-between py-3.5 text-xl font-medium tracking-tight transition-[padding] duration-500 hover:pl-3"
                    >
                      <span className="flex items-center gap-3.5">
                        <Icon className="size-[18px]" />
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
        <footer className="mono-label mt-24 flex flex-col gap-4 border-t border-ink pt-6 md:mt-36 md:flex-row md:items-center md:justify-between">
          <span>© 2026 {profile.name}. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 animate-blink rounded-full bg-ink" />
            {profile.location}, {profile.country}
            {time && <span className="tabular-nums"> — {time} local</span>}
          </span>
          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToTarget(0)}
            className="group inline-flex items-center gap-2 self-start uppercase tracking-[0.14em] md:self-auto"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.75} />
          </button>
        </footer>
      </div>
    </section>
  );
}
