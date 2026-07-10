import { Badge } from "@mantine/core";
import type { LeadStatus } from "../../types";
import { STATUS_META } from "../../constants/status";

/** Status pill rendered with the exact design-handoff colours and casing. */
export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      radius="xl"
      tt="none"
      fw={600}
      fz={12.5}
      styles={{
        root: { backgroundColor: meta.bg, color: meta.text, maxWidth: "none", height: 24, paddingInline: 10 },
        label: { overflow: "visible", display: "flex", alignItems: "center", gap: 6 },
      }}
      leftSection={<span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot }} />}
    >
      {meta.label}
    </Badge>
  );
}
