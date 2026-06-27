"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, getPreferredTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getStoredTheme() ?? getPreferredTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export function ThemeProvider() {
  useEffect(() => {
    applyTheme(getStoredTheme() ?? getPreferredTheme());
  }, []);

  return null;
}
