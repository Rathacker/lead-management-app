import { Button, Group, Modal, Text, ThemeIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { Lead } from "../../types";

interface DeleteLeadDialogProps {
  lead: Lead | null;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteLeadDialog({ lead, submitting, onConfirm, onCancel }: DeleteLeadDialogProps) {
  return (
    <Modal opened={!!lead} onClose={onCancel} title="Delete lead?" centered size="sm">
      <ThemeIcon size={46} radius="md" variant="light" color="red" mb="md">
        <IconTrash size={22} />
      </ThemeIcon>
      <Text size="sm" c="dimmed" mb="lg">
        {lead
          ? `“${lead.name}” will be permanently removed. This can’t be undone.`
          : "This lead will be permanently removed."}
      </Text>
      <Group justify="flex-end" gap="sm">
        <Button variant="default" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button color="red" loading={submitting} onClick={onConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
