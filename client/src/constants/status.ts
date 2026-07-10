import type { LeadStatus } from "../types";

export interface StatusMeta {
  value: LeadStatus;
  label: string;
  /** Badge text colour (exact design-handoff value). */
  text: string;
  /** Badge background colour (exact design-handoff value). */
  bg: string;
  /** Solid colour for dots, stat cards, and chart series. */
  dot: string;
}

/**
 * Single source of truth for how each lead status is labelled and coloured.
 * Values are taken verbatim from the Claude Design handoff palette so badges,
 * stat cards, and report charts render exactly as designed.
 */
export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  NEW: { value: "NEW", label: "New", text: "#1d4ed8", bg: "#eff4ff", dot: "#2563eb" },
  CONTACTED: { value: "CONTACTED", label: "Contacted", text: "#b45309", bg: "#fef6e7", dot: "#f59e0b" },
  QUALIFIED: { value: "QUALIFIED", label: "Qualified", text: "#6d28d9", bg: "#f5f0ff", dot: "#8b5cf6" },
  WON: { value: "WON", label: "Won", text: "#15803d", bg: "#ecfdf3", dot: "#22c55e" },
  LOST: { value: "LOST", label: "Lost", text: "#475569", bg: "#f1f5f9", dot: "#94a3b8" },
};

export const STATUS_ORDER: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export const STATUS_OPTIONS = STATUS_ORDER.map((s) => ({
  value: s,
  label: STATUS_META[s].label,
}));
