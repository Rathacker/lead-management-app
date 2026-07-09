import { Button, Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface EmptyStateProps {
  filtering: boolean;
  onAdd: () => void;
  onClear: () => void;
}

export function EmptyState({ filtering, onAdd, onClear }: EmptyStateProps) {
  return (
    <Center py={64}>
      <Stack align="center" gap="xs" maw={360}>
        <ThemeIcon size={72} radius="lg" variant="light" color="gray">
          <IconSearch size={34} />
        </ThemeIcon>
        <Text fw={700} fz="lg" mt="sm">
          {filtering ? "No matching leads" : "No leads yet"}
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          {filtering
            ? "Try adjusting your search or status filter to find what you’re looking for."
            : "Add your first lead to start tracking your sales pipeline here."}
        </Text>
        {filtering ? (
          <Button variant="light" mt="sm" onClick={onClear}>
            Clear filters
          </Button>
        ) : (
          <Button mt="sm" onClick={onAdd}>
            Add Lead
          </Button>
        )}
      </Stack>
    </Center>
  );
}
