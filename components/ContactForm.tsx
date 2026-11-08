"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Turnstile } from "@/components/Turnstile";
import { Magnetic } from "@/components/ui/motion";
import { cn, EASE_OUT } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
type Fields = { name: string; email: string; message: string };

const MAX_MESSAGE = 5000;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fieldClass =
  "peer block w-full border-0 border-b border-ink bg-transparent pb-3 pt-2 text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-tight text-ink outline-none transition-[padding,border-color] duration-500 placeholder:text-ink/55 focus:border-b-[3px] focus:pb-[10px]";

export function ContactForm() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<keyof Fields | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errorField === k) setErrorField(null);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = new FormData(e.currentTarget);
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus("error");
      setError("Please complete the verification check.");
      return;
    }
    setStatus("sending");
    setError("");
    setErrorField(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: form.get("company") ?? "", turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: keyof Fields };
      // a Turnstile token is single-use — always ask for a fresh one
      setTurnstileToken(null);
      setTurnstileReset((n) => n + 1);
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong. Please try again.");
        if (data.field) setErrorField(data.field);
        return;
      }
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div id="contact-form" className="relative scroll-mt-28">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            role="status"
            className="border-t border-ink pt-8"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-ink text-accent">
              <Check className="size-6" strokeWidth={2} />
            </span>
            <p className="display mt-8 text-[clamp(2.4rem,5.4vw,5.6rem)]">
              Message <span className="font-serif font-normal italic tracking-[-0.04em]">received.</span>
            </p>
            <p className="mt-5 max-w-md text-lg leading-snug">
              Thanks for reaching out — I read everything personally and will reply within a couple of days.
            </p>
            <button
              type="button"
              data-cursor="link"
              onClick={() => setStatus("idle")}
              className="mono-label mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 uppercase"
            >
              Send another <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-x-8 gap-y-10 border-t border-ink pt-8 md:grid-cols-2"
          >
            <label className="block">
              <span className="mono-label flex justify-between">
                <span>01 — Name</span>
                {errorField === "name" && <span>Required</span>}
              </span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Ada Lovelace"
                value={values.name}
                onChange={set("name")}
                aria-invalid={errorField === "name"}
                data-cursor="link"
                className={cn(fieldClass, errorField === "name" && "border-b-[3px]")}
              />
            </label>

            <label className="block">
              <span className="mono-label flex justify-between">
                <span>02 — Email</span>
                {errorField === "email" && <span>Invalid</span>}
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="ada@analytical.engine"
                value={values.email}
                onChange={set("email")}
                aria-invalid={errorField === "email"}
                data-cursor="link"
                className={cn(fieldClass, errorField === "email" && "border-b-[3px]")}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mono-label flex justify-between">
                <span>03 — Message</span>
                <span className="tabular-nums">
                  {values.message.length} / {MAX_MESSAGE}
                </span>
              </span>
              <textarea
                name="message"
                required
                rows={4}
                maxLength={MAX_MESSAGE}
                placeholder="Tell me about the project, the problem, the timeline…"
                value={values.message}
                onChange={set("message")}
                aria-invalid={errorField === "message"}
                data-cursor="link"
                className={cn(fieldClass, "resize-none", errorField === "message" && "border-b-[3px]")}
              />
            </label>

            {/* Honeypot — hidden from people and assistive tech, bots fill it in. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input name="company" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="md:col-span-2">
                <Turnstile siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} resetKey={turnstileReset} />
              </div>
            )}

            <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <Magnetic strength={0.15}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor="link"
                  className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-ink px-8 text-[15px] font-medium text-paper disabled:cursor-wait"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-[101%] bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                  />
                  <span className="relative inline-flex items-center gap-2.5 transition-colors duration-300 group-hover:text-ink">
                    {status === "sending" ? (
                      <>
                        <LoaderCircle className="size-[18px] animate-spin" strokeWidth={1.75} /> Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowUpRight
                          className="size-[18px] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                        />
                      </>
                    )}
                  </span>
                </button>
              </Magnetic>

              <p role="alert" aria-live="polite" className="mono-label min-h-4 md:max-w-xs md:text-right">
                {status === "error" ? error : ""}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
