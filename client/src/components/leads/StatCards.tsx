import { Card, Group, SimpleGrid, Text } from "@mantine/core";
import type { DashboardStats } from "../../types";
import { STATUS_META, STATUS_ORDER } from "../../constants/status";

function StatCard({ label, value, dot }: { label: string; value: number; dot?: string }) {
  return (
    <Card withBorder padding="md" radius="md">
      <Group gap={7} mb={8}>
        {dot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />}
        <Text size="xs" fw={600} c="dimmed">
          {label}
        </Text>
      </Group>
      <Text fz={28} fw={700} lh={1}>
        {value}
      </Text>
    </Card>
  );
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md" mb="lg">
      <StatCard label="Total Leads" value={stats.total} />
      {STATUS_ORDER.map((status) => (
        <StatCard
          key={status}
          label={STATUS_META[status].label}
          value={stats.byStatus[status] ?? 0}
          dot={STATUS_META[status].hex}
        />
      ))}
    </SimpleGrid>
  );
}
