import type { Lead, LeadStatus } from "../types";

const HEADERS = ["Name", "Company", "Email", "Phone", "Source", "Status", "Notes"];

function escapeCell(value: string | null | undefined): string {
  const str = value == null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Builds a UTF-8 BOM CSV (Excel-friendly) from the given leads and triggers a download. */
export function exportLeadsToCsv(leads: Lead[], statusLabel: (status: LeadStatus) => string): void {
  const lines = [HEADERS.join(",")];
  for (const lead of leads) {
    lines.push(
      [lead.name, lead.company, lead.email, lead.phone, lead.source, statusLabel(lead.status), lead.notes]
        .map(escapeCell)
        .join(","),
    );
  }

  const csv = "﻿" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
