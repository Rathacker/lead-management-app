import { notifications } from "@mantine/notifications";

/**
 * Thin wrapper over Mantine's notification system so feature code depends on a
 * stable `notify` API rather than the library directly.
 */
export function useToast() {
  return {
    notify: (message: string) =>
      notifications.show({
        message,
        color: "dark",
        withBorder: true,
        autoClose: 2400,
      }),
  };
}
