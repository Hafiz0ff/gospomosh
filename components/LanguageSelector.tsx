"use client";

import React, { useState } from "react";
import { useLanguage, Language } from "@/lib/languageContext";
import { Globe, Check } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "tg", label: "Тоҷикӣ", flag: "🇹🇯" }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border border-black/10 hover:bg-black/5 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm bg-white"
        title="Интихоби забон / Выбор языка"
      >
        <Globe className="w-4 h-4 text-[#0E7C86]" />
        <span>{language === "ru" ? "RU" : "TG"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in duration-150 text-gray-800">
          <div className="text-[10px] font-extrabold uppercase text-gray-400 px-2 py-1">
            Забон / Язык:
          </div>

          {languages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition text-xs font-bold ${
                  isSelected ? "bg-[#FDF2F0] text-[#0E7C86]" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0E7C86]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
