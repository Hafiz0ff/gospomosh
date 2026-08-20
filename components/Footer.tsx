"use client";

import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import { useLanguage } from "@/lib/languageContext";
import { Phone, Send, Mail } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#08525a] text-white/80 text-sm border-t border-[#0E7C86]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FF8C42] flex items-center justify-center text-white font-bold text-lg">
                ГП
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {t.appName}
              </span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          <div>
            <h4 className="text-[#FFD9A0] font-bold mb-4 text-xs uppercase tracking-wider">{t.footerSections}</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services" className="hover:text-white transition">{t.catalog}</Link></li>
              <li><Link href="/documents" className="hover:text-white transition">{t.checkDocs}</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition">{t.calculator}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">{t.faq}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FFD9A0] font-bold mb-4 text-xs uppercase tracking-wider">{t.footerPopular}</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services/vid-na-zhitelstvo" className="hover:text-white transition">Иҷозати зист (ВНЖ)</Link></li>
              <li><Link href="/services/rvp" className="hover:text-white transition">Истиқомати муваққатӣ (РВП)</Link></li>
              <li><Link href="/services/zamena-pasporta" className="hover:text-white transition">Ивази шиносномаи РФ</Link></li>
              <li><Link href="/services/zagranpasport" className="hover:text-white transition">Шиносномаи хориҷӣ (10 сола)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#FFD9A0] font-bold mb-4 text-xs uppercase tracking-wider">{t.footerContacts}</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#2AA9A9]" />
                <span>{APP_CONFIG.contacts.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-[#2AA9A9]" />
                <span>@{APP_CONFIG.contacts.telegram}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#2AA9A9]" />
                <span>{APP_CONFIG.contacts.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-center text-white/50 space-y-2">
          <p>© {new Date().getFullYear()} {t.appName}. {t.footerRights}</p>
          <p className="max-w-3xl mx-auto">{t.footerDisclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
