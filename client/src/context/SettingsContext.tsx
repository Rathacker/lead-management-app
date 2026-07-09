import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMantineColorScheme } from "@mantine/core";
import { SettingsApi } from "../api/settings.api";
import { DEFAULT_SETTINGS } from "../constants/config";
import type { Settings } from "../types";

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  /** Optimistically update and persist a partial change to the DB. */
  update: (patch: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Hold the latest setter in a ref so the mount-only fetch effect never
  // depends on `setColorScheme` (its identity changes on scheme updates,
  // which would otherwise re-run the effect and loop the settings request).
  const setColorSchemeRef = useRef(setColorScheme);
  setColorSchemeRef.current = setColorScheme;

  useEffect(() => {
    let active = true;
    SettingsApi.get()
      .then((data) => {
        if (!active) return;
        setSettings(data);
        setColorSchemeRef.current(data.theme);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(async (patch: Partial<Settings>) => {
    const applyScheme = setColorSchemeRef.current;
    const previous = settingsRef.current;
    setSettings({ ...previous, ...patch });
    if (patch.theme) applyScheme(patch.theme);
    try {
      const saved = await SettingsApi.update(patch);
      setSettings(saved);
      applyScheme(saved.theme);
    } catch (err) {
      setSettings(previous);
      applyScheme(previous.theme);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({ settings, loading, update }), [settings, loading, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
