import { Badge } from "@mantine/core";
import type { LeadStatus } from "../../types";
import { STATUS_META } from "../../constants/status";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge color={meta.color} variant="light" radius="sm">
      {meta.label}
    </Badge>
  );
}
