import { Avatar, Group, NavLink, Stack, Text } from "@mantine/core";
import { IconChartBar, IconLogout, IconSettings, IconUsers } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Leads", icon: IconUsers },
  { to: "/reports", label: "Reports", icon: IconChartBar },
  { to: "/settings", label: "Settings", icon: IconSettings },
];

export function SidebarNav({ onNavigate }: { onNavigate: () => void }) {
  const { email, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Stack h="100%" justify="space-between">
      <Stack gap={4}>
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              component={RouterNavLink}
              to={item.to}
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.8} />}
              active={active}
              onClick={onNavigate}
              variant="light"
            />
          );
        })}
      </Stack>

      <Stack gap="xs">
        <Group gap="sm" px="xs">
          <Avatar radius="xl" size={34} color="blue" variant="light">
            {(email ?? "AD").slice(0, 2).toUpperCase()}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <Text size="sm" fw={600} truncate>
              Admin
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {email ?? "admin@example.com"}
            </Text>
          </div>
        </Group>
        <NavLink
          label="Log out"
          leftSection={<IconLogout size={17} stroke={1.8} />}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          c="red"
        />
      </Stack>
    </Stack>
  );
}
