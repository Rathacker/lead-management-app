import { useEffect, useState } from "react";
import { LeadsApi } from "../api/leads.api";
import type { ReportData } from "../types";

/** Fetches pre-aggregated pipeline reports (all computed in Postgres). */
export function useReports() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    LeadsApi.reports()
      .then((result) => active && setData(result))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
