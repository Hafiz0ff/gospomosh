"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeKey = "teal" | "garnet" | "indigo" | "plum" | "sage";

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  colors: {
    primary: string;       // Primary buttons, logos, active tabs
    primaryHover: string;
    secondary: string;     // Accents, icons, badges
    accent: string;        // CTA buttons, highlights
    bg: string;            // Main page background
    cardBg: string;        // Cards, tables, modals background
    textMain: string;      // Main heading & text color (high contrast)
    textMuted: string;     // Secondary muted text
    border: string;        // Borders
  };
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  // 1. Текущая палитра (Deep Teal & Aqua)
  teal: {
    key: "teal",
    name: "Морской бриз (Deep Teal)",
    colors: {
      primary: "#0E7C86",
      primaryHover: "#08525a",
      secondary: "#2AA9A9",
      accent: "#FF8C42",
      bg: "#FDF2F0",
      cardBg: "#FFFFFF",
      textMain: "#08525a",
      textMuted: "#08525a99",
      border: "#0E7C8620"
    }
  },
  // 2. Garnet Red & Dark Orchid & Sunset Peach
  garnet: {
    key: "garnet",
    name: "Гранатовый закат (Garnet & Peach)",
    colors: {
      primary: "#7D0633",
      primaryHover: "#5c0425",
      secondary: "#F2A07B",
      accent: "#7D0633",
      bg: "#FBDCC4",
      cardBg: "#FFFFFF",
      textMain: "#31112C",
      textMuted: "#31112Caa",
      border: "#7D063325"
    }
  },
  // 3. Cosmic Indigo & Deep Teal & Peach Linen
  indigo: {
    key: "indigo",
    name: "Космический индиго (Cosmic Indigo)",
    colors: {
      primary: "#0A043C",
      primaryHover: "#03506F",
      secondary: "#03506F",
      accent: "#03506F",
      bg: "#FFE3D8",
      cardBg: "#FFFFFF",
      textMain: "#0A043C",
      textMuted: "#0A043Caa",
      border: "#0A043C20"
    }
  },
  // 4. Velvet Plum & Raspberry Rose & Rose Cashmere
  plum: {
    key: "plum",
    name: "Бархатная слива (Velvet Plum)",
    colors: {
      primary: "#432E54",
      primaryHover: "#322240",
      secondary: "#4B4376",
      accent: "#AE445A",
      bg: "#E8BCB9",
      cardBg: "#FFFFFF",
      textMain: "#432E54",
      textMuted: "#432E54aa",
      border: "#432E5420"
    }
  },
  // 5. Deep Blue-Black & Evening Indigo & Muted Sage Yellow
  sage: {
    key: "sage",
    name: "Шалфей и Индиго (Sage & Indigo)",
    colors: {
      primary: "#1B2430",
      primaryHover: "#51557E",
      secondary: "#51557E",
      accent: "#816797",
      bg: "#D6D5A8",
      cardBg: "#FFFFFF",
      textMain: "#1B2430",
      textMuted: "#1B2430aa",
      border: "#1B243025"
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeKey;
  theme: ThemeConfig;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "teal",
  theme: THEMES.teal,
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("teal");

  useEffect(() => {
    const saved = localStorage.getItem("gospomosh_theme") as ThemeKey;
    if (saved && THEMES[saved]) {
      setCurrentTheme(saved);
      applyThemeVariables(THEMES[saved]);
    } else {
      applyThemeVariables(THEMES.teal);
    }
  }, []);

  const handleSetTheme = (key: ThemeKey) => {
    setCurrentTheme(key);
    localStorage.setItem("gospomosh_theme", key);
    applyThemeVariables(THEMES[key]);
  };

  const applyThemeVariables = (t: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", t.colors.primary);
    root.style.setProperty("--color-primary-hover", t.colors.primaryHover);
    root.style.setProperty("--color-secondary", t.colors.secondary);
    root.style.setProperty("--color-accent", t.colors.accent);
    root.style.setProperty("--color-bg", t.colors.bg);
    root.style.setProperty("--color-card", t.colors.cardBg);
    root.style.setProperty("--color-text-main", t.colors.textMain);
    root.style.setProperty("--color-text-muted", t.colors.textMuted);
    root.style.setProperty("--color-border", t.colors.border);
    document.body.style.backgroundColor = t.colors.bg;
    document.body.style.color = t.colors.textMain;
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, theme: THEMES[currentTheme], setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
