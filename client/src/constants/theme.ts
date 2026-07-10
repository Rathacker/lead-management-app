import { createTheme, type MantineColorsTuple } from "@mantine/core";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "light";

/**
 * Brand blue scale anchored on the design-handoff accent (#2563eb at shade 6,
 * hover #1d4ed8 at shade 7). Setting this as the primary colour makes every
 * Mantine accent — buttons, active nav, links, focus rings — match the design.
 */
const brand: MantineColorsTuple = [
  "#eff6ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
];

/**
 * Slate neutral scale matching the design's light-theme tokens. Mantine uses
 * this for dimmed text (shade 6), borders (3–4), and subtle fills (0–1).
 *   text #0f172a · text2 #475569 · muted #8b93a3 · line #e6e9ef · bg #f5f6f8
 */
const gray: MantineColorsTuple = [
  "#f5f6f8",
  "#eceef2",
  "#e6e9ef",
  "#dfe3ea",
  "#cbd2dc",
  "#98a1b0",
  "#8b93a3",
  "#475569",
  "#334155",
  "#0f172a",
];

/**
 * Navy dark scale matching the design's dark-theme tokens.
 *   text #e7ecf4 · text2 #aab6c8 · dimmed #8593a8 · border #243044
 *   surface (cards) #161d2c · body #0e1320
 */
const dark: MantineColorsTuple = [
  "#e7ecf4",
  "#aab6c8",
  "#8593a8",
  "#7c899e",
  "#2a374d",
  "#243044",
  "#161d2c",
  "#0e1320",
  "#0b0f18",
  "#070a12",
];

/** Application-wide Mantine theme. */
export const mantineTheme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 7 },
  colors: { brand, gray, dark },
  white: "#ffffff",
  black: "#0f172a",
  defaultRadius: "md",
  fontFamily:
    "-apple-system, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
  headings: {
    fontFamily:
      "-apple-system, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
  },
});
