"use client";

import { useEffect, useRef } from "react";
import { drawHalftone, SCENES, type SceneName } from "@/lib/halftone";
import { PALETTE } from "@/lib/utils";

type Props = {
  scene: SceneName;
  cell?: number;
  inverted?: boolean;
  paper?: string;
  className?: string;
};

/** Canvas halftone plate — crisp at any size, only ever ink + paper tones. */
export function Halftone({
  scene,
  cell = 6,
  inverted = false,
  paper = PALETTE.paper,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHalftone(ctx, rect.width, rect.height, SCENES[scene], {
        cell,
        ink: PALETTE.ink,
        // inverted plates are ink ground with paper dots, whatever ground colour was requested
        paper: inverted ? PALETTE.paper : paper,
        inverted,
      });
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [scene, cell, inverted, paper]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
