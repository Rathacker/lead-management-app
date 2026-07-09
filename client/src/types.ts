export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: LeadStatus;
  notes?: string;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReportData {
  total: number;
  open: number;
  won: number;
  lost: number;
  winRate: number | null;
  conversion: number | null;
  byStatus: Record<LeadStatus, number>;
  bySource: { source: string; count: number }[];
}

export type Theme = "light" | "dark";

export interface Settings {
  theme: Theme;
  pageSize: number;
  showAvatars: boolean;
  confirmBeforeDelete: boolean;
}
