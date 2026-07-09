import { Group, Loader, Select, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { LeadStatus } from "../../types";
import { STATUS_OPTIONS } from "../../constants/status";

type StatusFilter = LeadStatus | "ALL";

interface ToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  status: StatusFilter;
  onStatus: (value: StatusFilter) => void;
  resultLabel: string;
  fetching: boolean;
}

const FILTER_OPTIONS = [{ value: "ALL", label: "All statuses" }, ...STATUS_OPTIONS];

export function Toolbar({ search, onSearch, status, onStatus, resultLabel, fetching }: ToolbarProps) {
  return (
    <Group justify="space-between" gap="sm" wrap="wrap">
      <Group gap="sm" style={{ flex: 1, minWidth: 0 }} wrap="wrap">
        <TextInput
          value={search}
          onChange={(e) => onSearch(e.currentTarget.value)}
          placeholder="Search name, company, or email"
          leftSection={<IconSearch size={16} />}
          rightSection={fetching ? <Loader size={16} /> : null}
          aria-label="Search leads"
          w={320}
          maw="100%"
        />
        <Select
          value={status}
          onChange={(val) => onStatus((val ?? "ALL") as StatusFilter)}
          data={FILTER_OPTIONS}
          allowDeselect={false}
          aria-label="Filter by status"
          w={160}
        />
      </Group>
      <Text size="sm" c="dimmed">
        {resultLabel}
      </Text>
    </Group>
  );
}
