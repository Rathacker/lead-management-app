import { createTheme } from "@mantine/core";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "light";

/** Application-wide Mantine theme. */
export const mantineTheme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily:
    "-apple-system, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
  headings: {
    fontFamily:
      "-apple-system, 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
  },
});
