import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const getInitial = (): Theme => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return "light";
    try { return getInitial(); } catch { return "light"; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
