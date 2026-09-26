"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ThemePreference,
} from "./theme";

type ThemeModeContextValue = {
  preference: ThemePreference;
  mode: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used inside AdminThemeProvider");
  }
  return context;
};

const DARK_QUERY = "(prefers-color-scheme: dark)";

const readStoredPreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage can throw in private mode.
  }
  return "system";
};

const resolveMode = (preference: ThemePreference): ThemeMode => {
  if (preference === "system") {
    return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
  }
  return preference;
};

export default function AdminThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Server and first client render must agree; the stored preference is applied after mount.
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = readStoredPreference();
    setPreferenceState(stored);
    setMode(resolveMode(stored));
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia(DARK_QUERY);
    const update = () => setMode(query.matches ? "dark" : "light");
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [preference]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setMode(resolveMode(next));
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort only.
    }
  }, []);

  const value = useMemo(
    () => ({ preference, mode, setPreference }),
    [preference, mode, setPreference],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}
