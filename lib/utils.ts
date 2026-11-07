export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Shared easings — crisp, editorial, no bounce. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const PALETTE = {
  paper: "#F8F7F4",
  ink: "#111111",
  accent: "#FF5A1F",
  mist: "#E8E7E3",
} as const;
