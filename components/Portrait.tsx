"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { Cpu, CodeXml, ShieldCheck } from "lucide-react";
import { Halftone } from "@/components/Halftone";
import { useLoaded } from "@/components/Shell";
import { EASE_OUT, PALETTE } from "@/lib/utils";

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
    <motion.div className={`absolute z-40 ${className}`} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      >
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
          data-cursor="link"
          className="flex items-center gap-2.5 border border-ink bg-paper px-3.5 py-2.5 text-[13px] font-medium leading-tight tracking-tight shadow-[4px_4px_0_#111111]"
        >
          <Icon className="size-[18px] shrink-0 text-ink" strokeWidth={1.5} />
          <span className="whitespace-pre-line">{label}</span>
        </motion.div>
      </motion.div>
    </motion.div>
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

  const orangeX = useTransform(mx, (v) => v * 36);
  const orangeY = useTransform(my, (v) => v * 28);
  const mistX = useTransform(mx, (v) => v * -26);
  const mistY = useTransform(my, (v) => v * -18);
  const photoX = useTransform(mx, (v) => v * 12);
  const photoY = useTransform(my, (v) => v * 8);

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px] lg:max-w-none">
      {/* clip definition for the photo */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="portrait-blob" clipPathUnits="objectBoundingBox">
            <path transform="scale(0.0025 0.002)" d={PHOTO} />
          </clipPath>
        </defs>
      </svg>

      {/* blobs */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ x: orangeX, y: orangeY }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={loaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.5 }}
      >
        <svg viewBox="0 0 400 500" className="size-full overflow-visible" aria-hidden>
          <motion.path
            fill={PALETTE.accent}
            initial={{ d: ORANGE_A }}
            animate={{ d: [ORANGE_A, ORANGE_B, ORANGE_A] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute inset-0 z-10"
        style={{ x: mistX, y: mistY }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={loaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.65 }}
      >
        <svg viewBox="0 0 400 500" className="size-full overflow-visible" aria-hidden>
          <motion.path
            fill={PALETTE.mist}
            initial={{ d: MIST_A }}
            animate={{ d: [MIST_A, MIST_B, MIST_A] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* the portrait itself — monochrome, masked into the blob */}
      <motion.div
        className="absolute inset-0 z-30"
        style={{ x: photoX, y: photoY }}
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.8 }}
        data-cursor="view"
        data-cursor-label="Hello"
      >
        <div className="absolute inset-0" style={{ clipPath: "url(#portrait-blob)" }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Portrait of Sitaram Oli"
              className="size-full object-cover grayscale contrast-[1.08]"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-paper" />
              <Halftone scene="portrait" cell={5} className="absolute inset-0 size-full" />
            </>
          )}
        </div>
        {/* hairline contour on the mask so the silhouette reads on paper */}
        <svg viewBox="0 0 400 500" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
          <path d={PHOTO} fill="none" stroke={PALETTE.ink} strokeWidth="1" />
        </svg>
      </motion.div>

      {/* orbit line + sparkle */}
      <svg
        viewBox="0 0 512 560"
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[6%] z-[35] hidden overflow-visible md:block"
        style={{ width: "128%", height: "112%" }}
        aria-hidden
      >
        <g transform="rotate(-22 256 290)">
          <motion.ellipse
            cx="256"
            cy="290"
            rx="240"
            ry="96"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={loaded ? { pathLength: 1 } : {}}
            transition={{ duration: 2.2, ease: EASE_OUT, delay: 1 }}
          />
          <path id="orbit-path" d="M16 290 a240 96 0 1 0 480 0 a240 96 0 1 0 -480 0" fill="none" />
          <g>
            <path
              d="M0-15c.9 9 6 14.1 15 15-9 .9-14.1 6-15 15-.9-9-6-14.1-15-15 9-.9 14.1-6 15-15Z"
              fill={PALETTE.accent}
              transform="scale(1.2)"
            />
            <animateMotion dur="22s" repeatCount="indefinite" rotate="0">
              <mpath href="#orbit-path" />
            </animateMotion>
          </g>
        </g>
      </svg>

      {/* floating discipline chips */}
      <Chip
        icon={ShieldCheck}
        label="Cybersecurity"
        className="left-0 top-[18%] lg:-left-[12%]"
        depth={34}
        delay={1.15}
        mx={mx}
        my={my}
      />
      <Chip
        icon={CodeXml}
        label={"Full-Stack\nDevelopment"}
        className="right-0 top-[58%] lg:-right-[7%]"
        depth={-30}
        delay={1.3}
        mx={mx}
        my={my}
      />
      <Chip
        icon={Cpu}
        label="AI / ML"
        className="bottom-[22%] left-0 lg:-left-[7%]"
        depth={24}
        delay={1.45}
        mx={mx}
        my={my}
      />
    </div>
  );
}
