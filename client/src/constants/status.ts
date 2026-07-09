import type { MantineColor } from "@mantine/core";
import type { LeadStatus } from "../types";

export interface StatusMeta {
  value: LeadStatus;
  label: string;
  /** Mantine palette key used for Badge / accents. */
  color: MantineColor;
  /** Solid hex used for chart series and legend dots. */
  hex: string;
}

/** Single source of truth for how each lead status is labelled and coloured. */
export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  NEW: { value: "NEW", label: "New", color: "blue", hex: "#2563eb" },
  CONTACTED: { value: "CONTACTED", label: "Contacted", color: "yellow", hex: "#f59e0b" },
  QUALIFIED: { value: "QUALIFIED", label: "Qualified", color: "grape", hex: "#8b5cf6" },
  WON: { value: "WON", label: "Won", color: "green", hex: "#22c55e" },
  LOST: { value: "LOST", label: "Lost", color: "gray", hex: "#94a3b8" },
};

export const STATUS_ORDER: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export const STATUS_OPTIONS = STATUS_ORDER.map((s) => ({
  value: s,
  label: STATUS_META[s].label,
}));
