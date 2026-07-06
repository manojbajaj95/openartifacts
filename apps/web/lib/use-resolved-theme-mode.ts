"use client";

import { useEffect, useState } from "react";
import { getResolvedColorMode } from "@/lib/artifact-surface";
import { getStoredTheme, resolveTheme, THEME_STORAGE_KEY } from "@/lib/theme";

export const THEME_CHANGE_EVENT = "openartifacts-theme-change";

export function useResolvedThemeMode(): "light" | "dark" {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    function sync() {
      setMode(getResolvedColorMode());
    }

    sync();

    const onThemeChange = () => sync();
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) sync();
    };
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (getStoredTheme() === "system") sync();
    };

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onSystemChange);

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", onSystemChange);
      observer.disconnect();
    };
  }, []);

  return mode;
}

export function useThemePreferenceKey(): string {
  const [key, setKey] = useState("system");

  useEffect(() => {
    function sync() {
      setKey(getStoredTheme());
    }
    sync();
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  return key;
}

export function resolvedModeFromPreference(preference: string): "light" | "dark" {
  if (preference === "light" || preference === "dark" || preference === "system") {
    return resolveTheme(preference);
  }
  return getResolvedColorMode();
}
