/**
 * Procedural monochrome "photography".
 *
 * Each scene is a luminance function: (x, y) -> 0 (ink) .. 1 (paper).
 * Coordinates: y in [-0.5, 0.5] (top → bottom), x in [-aspect/2, aspect/2].
 * A hex-grid halftone renderer then turns luminance into dots, so every
 * plate is just two palette colours — ink on paper (or the reverse).
 */

export type Scene = (x: number, y: number) => number;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
    const t = clamp((v - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
};

const LIGHT = (() => {
    const v = [-0.55, -0.6, 0.58];
    const m = Math.hypot(...v);
    return v.map((n) => n / m) as [number, number, number];
})();

/** Lambert shading on a unit-sphere normal at (nx, ny). */
const shade = (nx: number, ny: number) => {
    const r2 = nx * nx + ny * ny;
    if (r2 >= 1) return 0;
    const nz = Math.sqrt(1 - r2);
    return clamp(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
};

/* ------------------------------------------------------------------ */
/*  Portrait placeholder — a figure in profile, sunglasses, hood.      */
/* ------------------------------------------------------------------ */
const portrait: Scene = (x, y) => {
    let l = 0.9 - 0.16 * smooth(-0.5, 0.5, y);

    // Neck
    if (Math.abs(x - 0.02) < 0.08 && y > 0.02 && y < 0.3) {
        l = 0.12 + 0.3 * smooth(0.02, 0.22, y) * 0.6 + 0.12 * hash(x * 9, y * 9);
    }

    // Hoodie / shoulders
    {
        const cx = 0.07;
        const cy = 0.5;
        const rx = 0.52;
        const ry = 0.36;
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        if (nx * nx + ny * ny < 1) {
            l =
                0.06 +
                0.2 * shade(nx, ny) +
                0.045 * Math.sin((x * 1.2 + y) * 46) +
                0.05 * hash(x * 40, y * 40);
            // hood collar around the neck
            const collar = Math.hypot((x - 0.02) / 0.15, (y - 0.19) / 0.07);
            if (collar < 1) l = 0.1 + 0.18 * collar;
        }
    }

    // Head
    {
        const cx = -0.01;
        const cy = -0.1;
        const rx = 0.19;
        const ry = 0.245;
        const nx = (x - cx) / rx;
        const ny = (y - cy) / ry;
        const r2 = nx * nx + ny * ny;

        // Face — lit skin
        if (r2 < 1) {
            l = 0.34 + 0.62 * Math.pow(shade(nx, ny), 1.05);
            // beard on the lower third
            if (ny > 0.36 && Math.abs(nx) < 0.95) {
                l = 0.12 + 0.24 * hash(x * 70, y * 70) + 0.14 * shade(nx, ny);
            }
        }

        // Hair — curly cap that sits over the top of the skull and overhangs it
        const hx = (x - cx) / (rx * 1.14);
        const hy = (y - (cy - 0.06)) / (ry * 1.08);
        const hairLine = -0.34 + 0.1 * Math.sin(nx * 9 + 1) + 0.06 * hash(Math.floor(x * 60), 3);
        if (hx * hx + hy * hy < 1 && ny < hairLine) {
            const curl = 0.5 + 0.5 * Math.sin(x * 120 + y * 34) * Math.sin(y * 98 - x * 22);
            l = 0.05 + 0.17 * curl * (0.4 + 0.6 * shade(hx, hy));
        }

        // Sunglasses
        const lensY = cy - 0.035;
        for (const lx of [cx - 0.075, cx + 0.07]) {
            const e = Math.hypot((x - lx) / 0.068, (y - lensY) / 0.04);
            if (e < 1) l = 0.03 + 0.12 * smooth(0.4, 1, 1 - Math.abs(e - 0.4)) * (x < lx ? 1 : 0.3);
        }
        if (Math.abs(x - cx) < 0.015 && Math.abs(y - lensY) < 0.008) l = 0.05;
        if (x > cx + 0.07 && x < cx + 0.16 && Math.abs(y - (lensY - 0.012)) < 0.006) l = 0.05;
    }

    return clamp(l + (hash(x * 300, y * 300) - 0.5) * 0.05);
};

/* ------------------------------------------------------------------ */
/*  Abstract plates for projects and sections.                         */
/* ------------------------------------------------------------------ */
const orb: Scene = (x, y) => {
    let l = 0.92 - 0.12 * smooth(-0.5, 0.5, y) + 0.05 * Math.sin(y * 78);
    const cx = 0.06;
    const cy = 0.02;
    const R = 0.34;
    const d = Math.hypot(x - cx, y - cy);

    // orbital ring (tilted ellipse band)
    const a = -0.38;
    const rx = (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a);
    const ry = (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a);
    const e = Math.hypot(rx / 0.58, ry / 0.13);
    const onRing = Math.abs(e - 1) < 0.045;
    const ringFront = ry > 0;

    if (onRing && (ringFront || d > R)) l = 0.05;
    if (d < R) {
        const s = shade((x - cx) / R, (y - cy) / R);
        l = 0.05 + 0.82 * Math.pow(s, 1.7);
        if (onRing && ringFront) l = 0.04;
    }
    return clamp(l);
};

const ridges: Scene = (x, y) => {
    let l = 0.96 - 0.3 * smooth(-0.5, 0.15, y);
    const layers = 7;
    for (let k = 0; k < layers; k++) {
        const base = -0.16 + k * 0.095;
        const h =
            base +
            0.075 * Math.sin(x * (4.6 + k * 1.15) + k * 1.9) +
            0.03 * Math.sin(x * (13 + k * 2) + k * 0.7);
        if (y > h) {
            l = 0.86 - k * 0.12 - 0.22 * smooth(h, h + 0.28, y);
        }
    }
    return clamp(l + (hash(x * 200, y * 200) - 0.5) * 0.04);
};

const arch: Scene = (x, y) => {
    const w = 0.2;
    const topY = -0.12;
    const bottomY = 0.26;
    const inside =
        Math.abs(x) < w && y < bottomY && (y > topY || Math.hypot(x, y - topY) < w);
    const frame =
        Math.abs(x) < w + 0.035 &&
        y < bottomY &&
        (y > topY || Math.hypot(x, y - topY) < w + 0.035);

    // wall — dark with faint masonry
    let l = 0.1 + 0.05 * Math.sin(y * 90) * Math.sin(x * 40 + Math.floor(y * 14)) * 0.5;
    if (frame) l = 0.88;
    if (inside) l = 0.42 + 0.5 * smooth(topY - w, bottomY, y);
    // light spilling onto the ground
    if (y >= bottomY) {
        const spread = Math.abs(x) < w + (y - bottomY) * 1.1;
        l = spread ? 0.82 - 1.1 * (y - bottomY) - 0.4 * Math.abs(x) : 0.08;
    }
    return clamp(l);
};

const contour: Scene = (x, y) => {
    const f =
        0.55 * Math.sin(x * 7 + 1.3) +
        0.5 * Math.sin(y * 9 - 0.7 + x * 3) +
        0.35 * Math.sin((x + y) * 13) +
        0.18 * Math.sin(x * 27 - y * 5);
    const band = 0.5 + 0.5 * Math.sin(f * 15);
    const vig = 1 - 0.35 * smooth(0.25, 0.75, Math.hypot(x * 0.9, y));
    return clamp((0.12 + 0.86 * smooth(0.3, 0.7, band)) * vig + 0.05);
};

/** Dawn: a pale sun over concentric ripples, ground cut by horizontal strata. */
const dawn: Scene = (x, y) => {
    const sx = 0.03;
    const sy = 0.1;
    const d = Math.hypot(x - sx, (y - sy) * 1.15);
    const horizon = 0.16;

    if (y > horizon) {
        // reflective ground: stripes thicken and darken toward the viewer
        const t = (y - horizon) / (0.5 - horizon);
        const stripe = 0.5 + 0.5 * Math.sin((y - horizon) * (150 - 70 * t) + x * 2);
        const glow = 1 - smooth(0, 0.28, Math.abs(x - sx) + t * 0.1);
        return clamp(0.1 + 0.8 * smooth(0.25, 0.75, stripe) * (0.25 + 0.75 * glow) * (1 - 0.6 * t));
    }
    if (d < 0.15) return 0.97;
    const band = 0.5 + 0.5 * Math.sin(d * 62);
    const fade = 1 - smooth(0.16, 0.62, d);
    return clamp(0.08 + 0.86 * smooth(0.3, 0.7, band) * (0.3 + 0.7 * fade) + 0.05 * (1 - fade));
};

/** Parcels: rotated field tiles, a winding river and thin access roads — satellite-style. */
const parcels: Scene = (x, y) => {
    const a = 0.38;
    const rx = x * Math.cos(a) - y * Math.sin(a);
    const ry = x * Math.sin(a) + y * Math.cos(a);

    // river
    const river = Math.abs(ry - 0.04 * Math.sin(rx * 9) - 0.02 * Math.sin(rx * 23) + 0.05);
    if (river < 0.026) return 0.96;
    if (river < 0.034) return 0.12;

    const tx = rx * 7.5;
    const ty = ry * 7.5;
    const fx = tx - Math.floor(tx);
    const fy = ty - Math.floor(ty);
    // roads between parcels
    if (fx < 0.05 || fy < 0.05) return 0.94;

    const id = hash(Math.floor(tx), Math.floor(ty));
    const level = [0.1, 0.3, 0.55, 0.78][Math.floor(id * 4) % 4];
    // furrows inside each field, direction varies per parcel
    const dir = id > 0.5 ? fx : fy;
    const furrow = 0.5 + 0.5 * Math.sin(dir * (28 + id * 20));
    const vig = 1 - 0.3 * smooth(0.25, 0.75, Math.hypot(x * 0.9, y));
    return clamp((level + 0.12 * furrow) * vig + (hash(x * 200, y * 200) - 0.5) * 0.04);
};

export const SCENES = {portrait, orb, ridges, arch, contour, dawn, parcels} as const;
export type SceneName = keyof typeof SCENES;

/* ------------------------------------------------------------------ */
/*  Renderer                                                            */

/* ------------------------------------------------------------------ */
export function drawHalftone(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scene: Scene,
    opts: { cell: number; ink: string; paper: string; inverted?: boolean },
) {
    const {cell, ink, paper, inverted = false} = opts;
    const aspect = w / h;
    ctx.fillStyle = inverted ? ink : paper;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = inverted ? paper : ink;

    const rowH = cell * 0.866;
    const rows = Math.ceil(h / rowH) + 1;
    const cols = Math.ceil(w / cell) + 1;

    ctx.beginPath();
    for (let j = 0; j < rows; j++) {
        const py = j * rowH;
        for (let i = 0; i < cols; i++) {
            const px = i * cell + (j & 1 ? cell / 2 : 0);
            const l = scene((px / w - 0.5) * aspect, py / h - 0.5);
            const d = inverted ? l : 1 - l;
            const r = cell * 0.64 * Math.sqrt(clamp(d));
            if (r > 0.45) {
                ctx.moveTo(px + r, py);
                ctx.arc(px, py, r, 0, Math.PI * 2);
            }
        }
    }
    ctx.fill();
}
