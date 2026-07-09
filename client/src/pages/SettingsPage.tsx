import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Divider, Group, SegmentedControl, Select, Stack, Switch, Text, Title } from "@mantine/core";
import { IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useToast } from "../context/ToastContext";
import { PAGE_SIZE_OPTIONS } from "../constants/config";
import type { Settings } from "../types";

function SettingRow({
  title,
  hint,
  control,
}: {
  title: string;
  hint: string;
  control: ReactNode;
}) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="md">
      <div>
        <Text size="sm" fw={600}>
          {title}
        </Text>
        <Text size="xs" c="dimmed">
          {hint}
        </Text>
      </div>
      {control}
    </Group>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { email, logout } = useAuth();
  const { settings, update } = useSettings();
  const { notify } = useToast();

  async function persist(patch: Partial<Settings>) {
    try {
      await update(patch);
    } catch {
      notify("Could not save settings.");
    }
  }

  return (
    <Stack gap="md" maw={640}>
      <Stack gap={2}>
        <Title order={2}>Settings</Title>
        <Text c="dimmed" size="sm">
          Personalize your workspace.
        </Text>
      </Stack>

      <Card withBorder radius="md" padding="lg">
        <Text fw={700}>Appearance</Text>
        <Text size="sm" c="dimmed" mb="md">
          Choose how Lead Manager looks to you.
        </Text>
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            Theme
          </Text>
          <SegmentedControl
            value={settings.theme}
            onChange={(value) => persist({ theme: value as Settings["theme"] })}
            data={[
              { value: "light", label: <Group gap={6}><IconSun size={15} /> Light</Group> },
              { value: "dark", label: <Group gap={6}><IconMoon size={15} /> Dark</Group> },
            ]}
          />
        </Group>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Text fw={700}>Table preferences</Text>
        <Text size="sm" c="dimmed" mb="md">
          Control how the leads table behaves.
        </Text>
        <Stack gap="md">
          <Divider />
          <SettingRow
            title="Rows per page"
            hint="How many leads show before pagination."
            control={
              <Select
                w={90}
                value={String(settings.pageSize)}
                onChange={(value) => value && persist({ pageSize: Number(value) })}
                data={PAGE_SIZE_OPTIONS.map((s) => String(s))}
                allowDeselect={false}
              />
            }
          />
          <Divider />
          <SettingRow
            title="Show avatars"
            hint="Display initials next to each lead name."
            control={
              <Switch
                checked={settings.showAvatars}
                onChange={(e) => persist({ showAvatars: e.currentTarget.checked })}
              />
            }
          />
          <Divider />
          <SettingRow
            title="Confirm before delete"
            hint="Ask for confirmation when removing a lead."
            control={
              <Switch
                checked={settings.confirmBeforeDelete}
                onChange={(e) => persist({ confirmBeforeDelete: e.currentTarget.checked })}
              />
            }
          />
        </Stack>
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Text fw={700} mb="md">
          Account
        </Text>
        <Group>
          <Avatar radius="xl" size={46} color="blue" variant="light">
            {(email ?? "AD").slice(0, 2).toUpperCase()}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={600}>
              Admin
            </Text>
            <Text size="sm" c="dimmed">
              {email ?? "admin@example.com"}
            </Text>
          </div>
          <Button
            variant="default"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Log out
          </Button>
        </Group>
      </Card>
    </Stack>
  );
}
