import { ActionIcon, Avatar, Group, Table, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Lead } from "../../types";
import { initials } from "../../lib/format";
import { StatusBadge } from "./StatusBadge";

interface LeadsTableProps {
  leads: Lead[];
  showAvatars: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadsTable({ leads, showAvatars, onEdit, onDelete }: LeadsTableProps) {
  return (
    <Table.ScrollContainer minWidth={860}>
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Company</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Source</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th ta="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {leads.map((lead) => (
            <Table.Tr key={lead.id}>
              <Table.Td>
                <Group gap="sm" wrap="nowrap">
                  {showAvatars && (
                    <Avatar radius="xl" size={34} color="brand" variant="light">
                      {initials(lead.name)}
                    </Avatar>
                  )}
                  <Text fw={600} size="sm">
                    {lead.name}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td c="dimmed">{lead.company}</Table.Td>
              <Table.Td c="dimmed">{lead.email}</Table.Td>
              <Table.Td c="dimmed" style={{ whiteSpace: "nowrap" }}>
                {lead.phone}
              </Table.Td>
              <Table.Td c="dimmed">{lead.source}</Table.Td>
              <Table.Td>
                <StatusBadge status={lead.status} />
              </Table.Td>
              <Table.Td>
                <Group gap={4} justify="flex-end" wrap="nowrap">
                  <ActionIcon variant="subtle" color="gray" aria-label="Edit" onClick={() => onEdit(lead)}>
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" aria-label="Delete" onClick={() => onDelete(lead)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
