import { api } from "./client";
import type { DashboardStats, Lead, LeadInput, LeadStatus, Paginated, ReportData } from "../types";

export interface LeadQuery {
  search?: string;
  status?: LeadStatus | "ALL";
  page?: number;
  pageSize?: number;
}

export const LeadsApi = {
  list(query: LeadQuery = {}) {
    const params: Record<string, string | number> = {};
    if (query.search) params.search = query.search;
    if (query.status && query.status !== "ALL") params.status = query.status;
    if (query.page) params.page = query.page;
    if (query.pageSize) params.pageSize = query.pageSize;
    return api.get<Paginated<Lead>>("/leads", { params }).then((r) => r.data);
  },

  dashboard() {
    return api.get<DashboardStats>("/leads/dashboard").then((r) => r.data);
  },

  reports() {
    return api.get<ReportData>("/leads/reports").then((r) => r.data);
  },

  create(input: LeadInput) {
    return api.post<Lead>("/leads", input).then((r) => r.data);
  },

  update(id: string, input: LeadInput) {
    return api.put<Lead>(`/leads/${id}`, input).then((r) => r.data);
  },

  remove(id: string) {
    return api.delete(`/leads/${id}`).then(() => undefined);
  },
};
