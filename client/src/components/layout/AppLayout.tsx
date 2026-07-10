import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { BrandMark } from "./BrandMark";
import { SidebarNav } from "./SidebarNav";

export function AppLayout() {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 248,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="lg"
    >
      <AppShell.Header bg="var(--mantine-color-default)">
        <Group h="100%" px="md" gap="sm">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <BrandMark size={30} />
          <Text fw={700} size="md">
            Lead Manager
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg="var(--mantine-color-default)">
        <SidebarNav onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
