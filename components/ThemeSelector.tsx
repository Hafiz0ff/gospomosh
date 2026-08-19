"use client";

import React, { useState } from "react";
import { useTheme, THEMES, ThemeKey } from "@/lib/themeContext";
import { Palette, Check } from "lucide-react";

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border border-black/10 hover:bg-black/5 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm bg-white"
        title="Выбрать цветовую тему"
      >
        <Palette className="w-4 h-4 text-[var(--color-primary)]" />
        <span className="hidden sm:inline">Тема</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl p-3 z-50 space-y-2 animate-in fade-in duration-150 text-gray-800">
          <div className="text-[11px] font-extrabold uppercase text-gray-400 px-2">
            Выберите цветовую гамму:
          </div>

          <div className="space-y-1.5">
            {Object.values(THEMES).map((t) => {
              const isSelected = currentTheme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTheme(t.key);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition text-xs font-bold ${
                    isSelected ? "bg-gray-100 ring-2 ring-gray-900" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {/* Color Swatch Preview */}
                    <div className="flex -space-x-1 overflow-hidden rounded-full border border-gray-200 p-0.5">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.colors.bg }} />
                    </div>
                    <span>{t.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
