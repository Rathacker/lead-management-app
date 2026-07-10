import type { Settings } from "../types";

export const PAGE_SIZE_OPTIONS = [5, 8, 10, 15] as const;

/** Predefined lead sources offered in the Add/Edit form dropdown. */
export const SOURCE_OPTIONS = [
  "Website Form",
  "Referral",
  "LinkedIn",
  "Cold Call",
  "Event",
  "Other",
] as const;

export const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  pageSize: 5,
  showAvatars: true,
  confirmBeforeDelete: true,
};

export const SEARCH_DEBOUNCE_MS = 300;
export const TOAST_DURATION_MS = 2400;
