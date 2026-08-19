"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import ThemeSelector from "@/components/ThemeSelector";
import {
  Search, FileText, CheckSquare, Calculator, HelpCircle, Shield, UserCheck, Menu, X
} from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#0E7C86]/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0E7C86] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#0E7C86]/20">
                ГП
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-[#08525a] tracking-tight">
                {APP_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-[#08525a]/80">
            <Link href="/services" className="hover:text-[#0E7C86] transition flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-[#2AA9A9]" />
              <span>Каталог услуг</span>
            </Link>
            <Link href="/client/questionnaire" className="hover:text-[#0E7C86] transition flex items-center space-x-1.5 text-[#0E7C86] font-bold">
              <UserCheck className="w-4 h-4 text-[#FF8C42]" />
              <span>Анкета клиента</span>
            </Link>
            <Link href="/documents" className="hover:text-[#0E7C86] transition flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-[#2AA9A9]" />
              <span>Проверка документов</span>
            </Link>
            <Link href="/calculator" className="hover:text-[#0E7C86] transition flex items-center space-x-1.5">
              <Calculator className="w-4 h-4 text-[#2AA9A9]" />
              <span>Калькулятор</span>
            </Link>
            <Link href="/faq" className="hover:text-[#0E7C86] transition flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-[#2AA9A9]" />
              <span>FAQ</span>
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeSelector />
            <Link
              href="/wizard/vid-na-zhitelstvo"
              className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-[#FF8C42]/20 transition flex items-center space-x-2 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Подобрать услугу</span>
            </Link>
            <Link
              href="/admin"
              className="text-[#0E7C86]/50 hover:text-[#0E7C86] p-2 rounded-lg transition"
              title="Панель администратора"
            >
              <Shield className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeSelector />
            <Link
              href="/wizard/vid-na-zhitelstvo"
              className="bg-[#FF8C42] text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1"
            >
              <span>Подобрать</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#08525a] hover:bg-[#FDF2F0] focus:outline-none"
              aria-label="Открыть мобильное меню"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-[#0E7C86]/10 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#08525a]">
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl hover:bg-[#FDF2F0] flex items-center space-x-3 transition"
            >
              <FileText className="w-5 h-5 text-[#2AA9A9]" />
              <span>Каталог услуг</span>
            </Link>
            <Link
              href="/client/questionnaire"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-[#FDF2F0] text-[#0E7C86] font-bold flex items-center space-x-3 transition"
            >
              <UserCheck className="w-5 h-5 text-[#FF8C42]" />
              <span>Единая анкета клиента</span>
            </Link>
            <Link
              href="/documents"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl hover:bg-[#FDF2F0] flex items-center space-x-3 transition"
            >
              <CheckSquare className="w-5 h-5 text-[#2AA9A9]" />
              <span>Проверка документов</span>
            </Link>
            <Link
              href="/calculator"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl hover:bg-[#FDF2F0] flex items-center space-x-3 transition"
            >
              <Calculator className="w-5 h-5 text-[#2AA9A9]" />
              <span>Калькулятор пошлин</span>
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl hover:bg-[#FDF2F0] flex items-center space-x-3 transition"
            >
              <HelpCircle className="w-5 h-5 text-[#2AA9A9]" />
              <span>Частые вопросы (FAQ)</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl border border-[#0E7C86]/20 text-[#08525a] font-bold flex items-center space-x-3 transition"
            >
              <Shield className="w-5 h-5 text-[#0E7C86]" />
              <span>Кабинет администратора</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
