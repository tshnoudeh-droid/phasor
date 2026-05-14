"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("phasor-theme") as "dark" | "light" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(t: "dark" | "light") {
    if (t === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("phasor-theme", next);
  }

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return <div className="w-8 h-4" />;

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative w-8 h-4 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-phasor-electric"
      style={{
        background: theme === "light" ? "var(--phasor-electric)" : "var(--phasor-border)",
      }}
    >
      <span
        className="absolute top-0.5 w-3 h-3 rounded-full bg-phasor-void transition-all duration-200"
        style={{ left: theme === "light" ? "calc(100% - 14px)" : "2px" }}
      />
    </button>
  );
}
