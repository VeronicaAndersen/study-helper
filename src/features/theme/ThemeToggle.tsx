import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

export type ThemePreference = "light" | "dark" | "system";

// Keep in sync with the pre-paint script in index.html.
const THEME_STORAGE_KEY = "fieldnotes-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};
const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can be blocked; fall back to the system setting.
  }
  return "system";
}

function applyTheme(preference: ThemePreference) {
  const isDark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia(DARK_QUERY).matches);
  const root = document.documentElement;
  root.dataset.theme = isDark ? "dark" : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      "content",
      getComputedStyle(root).getPropertyValue("--color-canvas").trim(),
    );
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);

  useEffect(() => {
    applyTheme(preference);
    if (preference !== "system") return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const cycle = useCallback(() => {
    setPreference((current) => {
      const next = NEXT_PREFERENCE[current];
      try {
        if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
        else localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Not persisted; the choice still applies for this visit.
      }
      return next;
    });
  }, []);

  const Icon =
    preference === "light" ? Sun : preference === "dark" ? Moon : Monitor;
  const next = NEXT_PREFERENCE[preference];

  return (
    <button
      type="button"
      className="grid size-11 cursor-pointer place-items-center rounded-xl border border-line bg-paper text-muted transition-colors duration-200 hover:border-green hover:text-green"
      onClick={cycle}
      aria-label={`Theme: ${LABELS[preference]}. Switch to ${LABELS[next]}`}
      title={`Theme: ${LABELS[preference]} (click for ${LABELS[next]})`}
    >
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
