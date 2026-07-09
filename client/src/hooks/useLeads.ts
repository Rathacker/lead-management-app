import { useCallback, useEffect, useState } from "react";
import { LeadsApi, type LeadQuery } from "../api/leads.api";
import type { DashboardStats, Lead, LeadInput } from "../types";

interface UseLeadsResult {
  leads: Lead[];
  total: number;
  totalPages: number;
  stats: DashboardStats | null;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  createLead: (input: LeadInput) => Promise<void>;
  updateLead: (id: string, input: LeadInput) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  refresh: () => void;
}

/**
 * Owns lead server state: the page of leads (filtered + paginated in Postgres),
 * the dashboard counts, and CRUD mutations. All aggregation happens server-side;
 * this hook only transports the results. Mutations refetch to stay coherent.
 */
export function useLeads(query: LeadQuery): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { search, status, page, pageSize } = query;

  const load = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const [listResult, dashboard] = await Promise.all([
        LeadsApi.list({ search, status, page, pageSize }),
        LeadsApi.dashboard(),
      ]);
      setLeads(listResult.data);
      setTotal(listResult.total);
      setTotalPages(listResult.totalPages);
      setStats(dashboard);
    } catch {
      setError("Could not load leads. Please try again.");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [search, status, page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  const mutate = useCallback(
    async (fn: () => Promise<unknown>) => {
      await fn();
      await load();
    },
    [load],
  );

  return {
    leads,
    total,
    totalPages,
    stats,
    loading,
    fetching,
    error,
    createLead: (input) => mutate(() => LeadsApi.create(input)),
    updateLead: (id, input) => mutate(() => LeadsApi.update(id, input)),
    deleteLead: (id) => mutate(() => LeadsApi.remove(id)),
    refresh: load,
  };
}
