import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Pagination,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDownload, IconPlus } from "@tabler/icons-react";
import type { Lead, LeadInput, LeadStatus } from "../types";
import { LeadsApi } from "../api/leads.api";
import { useLeads } from "../hooks/useLeads";
import { useDebounce } from "../hooks/useDebounce";
import { useSettings } from "../context/SettingsContext";
import { useToast } from "../context/ToastContext";
import { SEARCH_DEBOUNCE_MS } from "../constants/config";
import { STATUS_META } from "../constants/status";
import { exportLeadsToCsv } from "../lib/exportCsv";
import { StatCards } from "../components/leads/StatCards";
import { Toolbar } from "../components/leads/Toolbar";
import { LeadsTable } from "../components/leads/LeadsTable";
import { EmptyState } from "../components/leads/EmptyState";
import { LeadFormPanel } from "../components/leads/LeadFormPanel";
import { DeleteLeadDialog } from "../components/leads/DeleteLeadDialog";

type StatusFilter = LeadStatus | "ALL";

export default function LeadsPage() {
  const { settings } = useSettings();
  const { notify } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  // Any change to the result set or page size returns to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, settings.pageSize]);

  const query = useMemo(
    () => ({ search: debouncedSearch, status: statusFilter, page, pageSize: settings.pageSize }),
    [debouncedSearch, statusFilter, page, settings.pageSize],
  );
  const { leads, total, totalPages, stats, loading, fetching, error, createLead, updateLead, deleteLead } =
    useLeads(query);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtering = debouncedSearch.trim().length > 0 || statusFilter !== "ALL";
  const resultLabel = total === 1 ? "1 lead" : `${total} leads`;

  const openAdd = useCallback(() => {
    setEditingLead(null);
    setPanelOpen(true);
  }, []);
  const openEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
    setPanelOpen(true);
  }, []);
  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setEditingLead(null);
  }, []);

  const handleSubmit = useCallback(
    async (input: LeadInput) => {
      setSaving(true);
      try {
        if (editingLead) {
          await updateLead(editingLead.id, input);
          notify("Lead updated");
        } else {
          await createLead(input);
          notify("Lead added");
        }
        closePanel();
      } catch {
        notify("Something went wrong. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [editingLead, updateLead, createLead, notify, closePanel],
  );

  const askDelete = useCallback(
    async (lead: Lead) => {
      if (settings.confirmBeforeDelete) {
        setDeleteTarget(lead);
        return;
      }
      try {
        await deleteLead(lead.id);
        notify("Lead deleted");
      } catch {
        notify("Could not delete lead.");
      }
    },
    [settings.confirmBeforeDelete, deleteLead, notify],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLead(deleteTarget.id);
      notify("Lead deleted");
      setDeleteTarget(null);
    } catch {
      notify("Could not delete lead.");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, deleteLead, notify]);

  const handleExport = useCallback(async () => {
    // Export the full filtered set (server-filtered), not just the current page.
    const all = await LeadsApi.list({ search: debouncedSearch, status: statusFilter, pageSize: 10000 });
    exportLeadsToCsv(all.data, (s) => STATUS_META[s].label);
    notify(`Exported ${all.data.length} lead${all.data.length === 1 ? "" : "s"}`);
  }, [debouncedSearch, statusFilter, notify]);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <Box>
          <Title order={2}>Leads</Title>
          <Text c="dimmed" size="sm">
            Track and manage your sales pipeline.
          </Text>
        </Box>
        <Group gap="sm">
          <Button
            variant="default"
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
            disabled={total === 0}
          >
            {filtering ? "Export filtered" : "Export CSV"}
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={openAdd}>
            Add Lead
          </Button>
        </Group>
      </Group>

      {stats && <StatCards stats={stats} />}

      <Paper withBorder radius="md">
        <Box p="md">
          <Toolbar
            search={search}
            onSearch={setSearch}
            status={statusFilter}
            onStatus={setStatusFilter}
            resultLabel={resultLabel}
            fetching={fetching}
          />
        </Box>
        <Divider />

        {loading ? (
          <Center py={64}>
            <Loader />
          </Center>
        ) : error ? (
          <Center py={48}>
            <Text c="red">{error}</Text>
          </Center>
        ) : total === 0 ? (
          <EmptyState
            filtering={filtering}
            onAdd={openAdd}
            onClear={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          />
        ) : (
          <>
            <LeadsTable
              leads={leads}
              showAvatars={settings.showAvatars}
              onEdit={openEdit}
              onDelete={askDelete}
            />
            {totalPages > 1 && (
              <Group justify="space-between" p="md">
                <Text size="sm" c="dimmed">
                  Page {page} of {totalPages}
                </Text>
                <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
              </Group>
            )}
          </>
        )}
      </Paper>

      <LeadFormPanel
        open={panelOpen}
        lead={editingLead}
        submitting={saving}
        onSubmit={handleSubmit}
        onClose={closePanel}
      />
      <DeleteLeadDialog
        lead={deleteTarget}
        submitting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
}
