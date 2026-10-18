"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
type Theme = "light" | "dark";
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const saved = localStorage.getItem("franxx-theme");
    const initial: Theme = saved === "light" ? "light" : "dark";
    setTheme(initial); document.documentElement.dataset.theme = initial;
  }, []);
  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("franxx-theme", next); setTheme(next);
  }
  return <button type="button" onClick={toggle} className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`} aria-label={theme === "dark" ? "Aktifkan tema putih" : "Aktifkan tema hitam"} title={theme === "dark" ? "Ganti ke tema putih" : "Ganti ke tema hitam"}>
    {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
    {!compact && <span>{theme === "dark" ? "Tema putih" : "Tema hitam"}</span>}
  </button>;
}
