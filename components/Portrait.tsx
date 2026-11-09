"use client";

import {animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue} from "framer-motion";
import {CodeXml, ShieldCheck} from "lucide-react";
import {useEffect, useRef} from "react";
import {Halftone} from "@/components/Halftone";
import {useLoaded} from "@/components/Shell";
import {EASE_OUT, PALETTE} from "@/lib/utils";

/*
 * Organic shapes drawn in a 400 × 500 box.
 * Orange & mist each have two keyframe shapes with identical command
 * structure so Framer Motion can morph between them.
 */
const ORANGE_A =
    "M236 38 C318 18 386 96 380 196 C375 280 352 336 288 340 C214 344 168 262 172 176 C175 108 190 52 236 38 Z";
const ORANGE_B =
    "M248 50 C330 36 378 116 372 208 C366 292 338 326 274 332 C204 340 182 252 182 172 C183 104 208 66 248 50 Z";
const MIST_A =
    "M96 236 C124 196 206 188 220 262 C236 346 300 410 262 468 C226 520 128 500 96 420 C68 352 74 270 96 236 Z";
const MIST_B =
    "M84 250 C116 204 212 196 226 270 C242 340 292 404 268 458 C230 514 120 506 90 428 C62 360 66 280 84 250 Z";
/** The photo mask — a tall leaning teardrop. */
const PHOTO =
    "M152 110 C214 58 338 82 358 192 C374 290 348 394 300 464 C258 522 160 508 120 436 C80 366 100 160 152 110 Z";

function Chip({
                  icon: Icon,
                  label,
                  className,
                  depth,
                  delay,
                  mx,
                  my,
              }: {
    icon: typeof ShieldCheck;
    label: string;
    className: string;
    depth: number;
    delay: number;
    mx: MotionValue<number>;
    my: MotionValue<number>;
}) {
    const loaded = useLoaded();
    const x = useTransform(mx, (v) => v * depth);
    const y = useTransform(my, (v) => v * depth);
    return (
        <motion.div className={`absolute z-40 hidden md:block ${className}`} style={{x, y}}>
            <motion.div
                initial={{opacity: 0, scale: 0.7, y: 20}}
                animate={loaded ? {opacity: 1, scale: 1, y: 0} : {}}
                transition={{duration: 0.9, ease: EASE_OUT, delay}}
            >
                <div
                    data-cursor="link"
                    className="flex items-center gap-2.5 border border-ink bg-paper px-3.5 py-2.5 text-[13px] font-medium leading-tight tracking-tight shadow-[4px_4px_0_#111111] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                    <Icon className="size-4.5 shrink-0 text-ink" strokeWidth={1.5}/>
                    <span className="whitespace-pre-line">{label}</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

const CHIPS = [
    {icon: ShieldCheck, label: "Cybersecurity"},
    {icon: CodeXml, label: "Software Engineering"},
] as const;

/** Phones: the floating chips become a tidy row under the portrait (no overlap with the photo). */
export function MobileChips() {
    const loaded = useLoaded();
    return (
        <motion.ul
            className="mt-6 flex flex-wrap gap-2.5 md:hidden"
            initial={{opacity: 0, y: 16}}
            animate={loaded ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.9, ease: EASE_OUT, delay: 1.2}}
        >
            {CHIPS.map(({icon: Icon, label}) => (
                <li
                    key={label}
                    className="flex items-center gap-2 border border-ink bg-paper px-3 py-2 text-[13px] font-medium leading-tight tracking-tight shadow-[3px_3px_0_#111111]"
                >
                    <Icon className="size-4 shrink-0" strokeWidth={1.5}/>
                    {label}
                </li>
            ))}
        </motion.ul>
    );
}

/*
 * The orbit wraps the portrait: one ellipse split into a BACK arc (z-20, behind the photo) and a
 * FRONT arc (z-35, in front). The sparkle is driven by a single angle `t`, so it travels along the
 * ring, slips behind the photo on the far side and swings back out in front on the near side —
 * growing slightly as it comes toward you and shrinking as it recedes.
 *
 * Ellipse (local coords, then tilted -22°): centre (256, 290), rx 240, ry 96.
 * Angle t: 0 = right tip, π/2 = nearest point (bottom), π = left tip, 3π/2 = farthest (top).
 */
const OX = 256;
const OY = 290;
const RX = 240;
const RY = 96;
const TILT = -22;
const SPARKLE = "M0-15c.9 9 6 14.1 15 15-9 .9-14.1 6-15 15-.9-9-6-14.1-15-15 9-.9 14.1-6 15-15Z";
const FRONT_ARC = `M${OX + RX} ${OY} A${RX} ${RY} 0 0 1 ${OX - RX} ${OY}`; // right → left via the near side
const BACK_ARC = `M${OX - RX} ${OY} A${RX} ${RY} 0 0 1 ${OX + RX} ${OY}`; // left → right via the far side

function Orbit({loaded, reduce}: { loaded: boolean; reduce: boolean | null }) {
    const frontRef = useRef<SVGSVGElement>(null);
    const t = useMotionValue(0.5);

    const x = useTransform(t, (v) => OX + RX * Math.cos(v));
    const y = useTransform(t, (v) => OY + RY * Math.sin(v));
    const scale = useTransform(t, (v) => 1.05 + 0.3 * Math.sin(v));
    const frontOpacity = useTransform(t, (v) => (Math.sin(v) >= 0 ? 1 : 0));
    const backOpacity = useTransform(t, (v) => (Math.sin(v) >= 0 ? 0 : 1));

    // One signature loop: runs only while visible and never under reduced motion.
    useEffect(() => {
        if (reduce) return;
        const start = t.get();
        const controls = animate(t, [start, start + Math.PI * 2], {
            duration: 30,
            ease: "linear",
            repeat: Infinity,
        });
        const el = frontRef.current;
        let io: IntersectionObserver | undefined;
        if (el) {
            io = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) controls.play();
                else controls.pause();
            });
            io.observe(el);
        }
        return () => {
            io?.disconnect();
            controls.stop();
        };
    }, [reduce, t]);

    const svgClass = "pointer-events-none absolute inset-x-[-14%] inset-y-[-6%] hidden overflow-visible md:block";
    const svgStyle = {width: "128%", height: "112%"};
    const draw = {
        initial: {pathLength: 0},
        animate: loaded ? {pathLength: 1} : {},
        transition: {duration: 2.2, ease: EASE_OUT, delay: 1},
    };
    const sparkleFade = {
        initial: {opacity: 0},
        animate: loaded ? {opacity: 1} : {},
        transition: {duration: 0.8, delay: 1.6},
    };

    return (
        <>
            {/* BACK half — behind the photo, so the ring disappears behind you */}
            <svg viewBox="0 0 512 560" className={`${svgClass} z-20`} style={svgStyle} aria-hidden>
                <g transform={`rotate(${TILT} ${OX} ${OY})`}>
                    <motion.path d={BACK_ARC} fill="none" stroke={PALETTE.ink} strokeWidth="1" {...draw} />
                    <motion.g {...sparkleFade}>
                        <motion.path d={SPARKLE} fill={PALETTE.accent} style={{x, y, scale, opacity: backOpacity}}/>
                    </motion.g>
                </g>
            </svg>

            {/* FRONT half — across the photo, so the ring comes round in front of you */}
            <svg ref={frontRef} viewBox="0 0 512 560" className={`${svgClass} z-35`} style={svgStyle} aria-hidden>
                <g transform={`rotate(${TILT} ${OX} ${OY})`}>
                    <motion.path d={FRONT_ARC} fill="none" stroke={PALETTE.ink} strokeWidth="1" {...draw} />
                    <motion.g {...sparkleFade}>
                        <motion.path d={SPARKLE} fill={PALETTE.accent} style={{x, y, scale, opacity: frontOpacity}}/>
                    </motion.g>
                </g>
            </svg>
        </>
    );
}

export function Portrait({
                             src,
                             mx,
                             my,
                         }: {
    /** public path to a user-supplied photo, or null to render the halftone placeholder */
    src: string | null;
    mx: MotionValue<number>;
    my: MotionValue<number>;
}) {
    const loaded = useLoaded();
    const reduce = useReducedMotion();

    const orangeX = useTransform(mx, (v) => v * 36);
    const orangeY = useTransform(my, (v) => v * 28);
    const mistX = useTransform(mx, (v) => v * -26);
    const mistY = useTransform(my, (v) => v * -18);
    const photoX = useTransform(mx, (v) => v * 12);
    const photoY = useTransform(my, (v) => v * 8);

    return (
        <div className="relative mx-auto aspect-4/5 w-full max-w-135 lg:max-w-none">
            {/* clip definition for the photo */}
            <svg width="0" height="0" className="absolute" aria-hidden>
                <defs>
                    <clipPath id="portrait-blob" clipPathUnits="objectBoundingBox">
                        <path transform="scale(0.0025 0.002)" d={PHOTO}/>
                    </clipPath>
                </defs>
            </svg>

            {/* blobs */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{x: orangeX, y: orangeY}}
                initial={{opacity: 0, scale: 0.7}}
                animate={loaded ? {opacity: 1, scale: 1} : {}}
                transition={{duration: 1.3, ease: EASE_OUT, delay: 0.5}}
            >
                <svg viewBox="0 0 400 500" className="size-full overflow-visible" aria-hidden>
                    <motion.path
                        fill={PALETTE.accent}
                        initial={{d: ORANGE_A}}
                        animate={loaded && !reduce ? {d: ORANGE_B} : {}}
                        transition={{duration: 2.8, ease: EASE_OUT, delay: 1.1}}
                    />
                </svg>
            </motion.div>
            <motion.div
                className="absolute inset-0 z-10"
                style={{x: mistX, y: mistY}}
                initial={{opacity: 0, scale: 0.7}}
                animate={loaded ? {opacity: 1, scale: 1} : {}}
                transition={{duration: 1.3, ease: EASE_OUT, delay: 0.65}}
            >
                <svg viewBox="0 0 400 500" className="size-full overflow-visible" aria-hidden>
                    <motion.path
                        fill={PALETTE.mist}
                        initial={{d: MIST_A}}
                        animate={loaded && !reduce ? {d: MIST_B} : {}}
                        transition={{duration: 3.2, ease: EASE_OUT, delay: 1.25}}
                    />
                </svg>
            </motion.div>

            {/* the portrait itself — monochrome, masked into the blob */}
            <motion.div
                className="group absolute inset-0 z-30"
                style={{x: photoX, y: photoY}}
                initial={{opacity: 0}}
                animate={loaded ? {opacity: 1} : {}}
                transition={{duration: 1.2, ease: EASE_OUT, delay: 0.8}}
                data-cursor="view"
                data-cursor-label="Hello"
            >
                <div className="absolute inset-0" style={{clipPath: "url(#portrait-blob)"}}>
                    {src ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt="Portrait of Sitaram Oli"
                                className="size-full object-cover object-top grayscale contrast-[1.1]"
                            />
                            {/* print-style dot screen over the photo; it relaxes on hover */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0"
                                style={{
                                    backgroundImage: `radial-gradient(circle at center, ${PALETTE.ink} 0.9px, transparent 1.3px)`,
                                    backgroundSize: "5px 5px",
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-paper"/>
                            <Halftone scene="portrait" cell={5} className="absolute inset-0 size-full"/>
                        </>
                    )}
                </div>
                {/* hairline contour on the mask so the silhouette reads on paper */}
                <svg viewBox="0 0 400 500" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
                    <path d={PHOTO} fill="none" stroke={PALETTE.ink} strokeWidth="1"/>
                </svg>
            </motion.div>

            <Orbit loaded={loaded} reduce={reduce}/>

            {/* floating discipline chips */}
            <Chip
                icon={ShieldCheck}
                label="Cybersecurity"
                className="left-0 top-[70%] lg:left-[-12%]"
                depth={34}
                delay={1.15}
                mx={mx}
                my={my}
            />
            <Chip
                icon={CodeXml}
                label={"Software\nEngineering"}
                className="right-0 top-[35%] lg:right-[-7%]"
                depth={-30}
                delay={1.3}
                mx={mx}
                my={my}
            />
        </div>
    );
}
