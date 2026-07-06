"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

const TOOLBAR_ICONS = {
  dark: MoonIcon,
  light: SunIcon,
  system: MonitorIcon,
} as const;

export function ThemeSwitcher({
  className,
  variant = "footer",
}: {
  className?: string;
  variant?: "footer" | "toolbar";
}) {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = getStoredTheme();
    setPreference(stored);
    applyTheme(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemChange() {
      if (getStoredTheme() === "system") applyTheme("system");
    }
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  function select(next: ThemePreference) {
    setPreference(next);
    setStoredTheme(next);
  }

  if (variant === "toolbar") {
    return (
      <fieldset className={cn("artifact-theme-toggle", className)}>
        <legend className="sr-only">Theme</legend>
        {OPTIONS.map((option) => {
          const Icon = TOOLBAR_ICONS[option.value];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => select(option.value)}
              aria-pressed={preference === option.value}
              aria-label={`${option.label} theme`}
              title={`${option.label} theme`}
              className={cn(
                "artifact-theme-toggle__button",
                preference === option.value && "artifact-theme-toggle__button--active",
              )}
            >
              <Icon aria-hidden />
            </button>
          );
        })}
      </fieldset>
    );
  }

  return (
    <fieldset className={cn("inline-flex items-center gap-2 border-0 p-0 m-0 min-w-0", className)}>
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map((option, index) => (
        <span key={option.value} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="opacity-40" aria-hidden>
              ·
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => select(option.value)}
            aria-pressed={preference === option.value}
            className={cn(
              "transition-colors duration-150",
              preference === option.value
                ? "text-foreground font-medium"
                : "text-[var(--link)] hover:underline",
            )}
          >
            {option.label}
          </button>
        </span>
      ))}
    </fieldset>
  );
}
