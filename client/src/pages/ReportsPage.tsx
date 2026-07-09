import { Card, Center, Grid, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReports } from "../hooks/useReports";
import { STATUS_META, STATUS_ORDER } from "../constants/status";

const SOURCE_PALETTE = ["#2563eb", "#8b5cf6", "#f59e0b", "#22c55e", "#ef4444", "#14b8a6", "#94a3b8"];
const AXIS_COLOR = "var(--mantine-color-dimmed)";

function Kpi({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Text size="xs" fw={600} c="dimmed" mb={8}>
        {label}
      </Text>
      <Text fz={32} fw={700} lh={1} c={color}>
        {value}
      </Text>
      {sub && (
        <Text size="xs" c="dimmed" mt={4}>
          {sub}
        </Text>
      )}
    </Card>
  );
}

export default function ReportsPage() {
  const { data, loading } = useReports();

  if (loading || !data) {
    return (
      <Center py={80}>
        <Loader />
      </Center>
    );
  }

  const statusData = STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    value: data.byStatus[s] ?? 0,
    fill: STATUS_META[s].hex,
  }));
  const sourceData = data.bySource.map((row) => ({ name: row.source, value: row.count }));

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Title order={2}>Reports</Title>
        <Text c="dimmed" size="sm">
          A snapshot of pipeline health and conversion.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        <Kpi label="Total Leads" value={data.total} />
        <Kpi label="Open Pipeline" value={data.open} sub="New · Contacted · Qualified" />
        <Kpi
          label="Win Rate"
          value={data.winRate === null ? "—" : `${data.winRate}%`}
          sub="Won of decided deals"
          color="green.7"
        />
        <Kpi
          label="Conversion"
          value={data.conversion === null ? "—" : `${data.conversion}%`}
          sub="Won of all leads"
        />
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Text fw={700} mb="md">
              Leads by status
            </Text>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--mantine-color-default-hover)" }} />
                <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Text fw={700} mb="md">
              Leads by source
            </Text>
            {sourceData.length === 0 ? (
              <Text c="dimmed" size="sm">
                No source data yet.
              </Text>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {sourceData.map((entry, i) => (
                      <Cell key={entry.name} fill={SOURCE_PALETTE[i % SOURCE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
