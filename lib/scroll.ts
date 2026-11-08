import type Lenis from "lenis";

/** The page-wide Lenis instance (null on touch / reduced-motion, where native scrolling is used). */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Smooth-scroll to an element, a y offset, or the top — works with or without Lenis. */
export function scrollToTarget(target: HTMLElement | number, opts: { offset?: number } = {}) {
  const offset = opts.offset ?? 0;
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
