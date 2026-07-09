import { api } from "./client";
import type { Settings } from "../types";

export const SettingsApi = {
  get() {
    return api.get<Settings>("/settings").then((r) => r.data);
  },

  update(patch: Partial<Settings>) {
    return api.put<Settings>("/settings", patch).then((r) => r.data);
  },
};
