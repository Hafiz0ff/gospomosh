"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_CATEGORIES, MOCK_SERVICES } from "@/lib/mockData";
import ServiceCard from "@/components/ServiceCard";
import { useLanguage } from "@/lib/languageContext";
import {
  Search, ArrowRight, ShieldCheck, CheckCircle, Sparkles, UserCheck,
  FileText, Globe, Users, Receipt, Car, Home, Heart, Shield, Scale, FileCheck
} from "lucide-react";

export function getCategoryIcon(slug: string) {
  switch (slug) {
    case "passport":
      return <FileText className="w-6 h-6" />;
    case "zagranpasport":
      return <Globe className="w-6 h-6" />;
    case "migration":
      return <Users className="w-6 h-6" />;
    case "taxes":
      return <Receipt className="w-6 h-6" />;
    case "auto":
      return <Car className="w-6 h-6" />;
    case "realty":
      return <Home className="w-6 h-6" />;
    case "family":
      return <Heart className="w-6 h-6" />;
    case "pension":
      return <Shield className="w-6 h-6" />;
    case "legal":
      return <Scale className="w-6 h-6" />;
    case "certificates":
      return <FileCheck className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");

  const getCategoryName = (slug: string, originalName: string) => {
    if (language === "tg") {
      switch (slug) {
        case "passport": return "Шиноснома ва ҳуҷҷатҳо";
        case "zagranpasport": return "Шиносномаи хориҷӣ";
        case "migration": return "Хизматрасониҳои муҳоҷиратӣ";
        case "taxes": return "Андозҳо (ИНН)";
        case "auto": return "Автомобил ва ронандагӣ";
        case "realty": return "Амволи ғайриманқул";
        case "family": return "Оила ва кӯдакон";
        case "pension": return "Нафақа ва кӯмакпулиҳо";
        case "legal": return "Ёрии ҳуқуқӣ";
        case "certificates": return "Маълумотномаҳо ва иқтибосҳо";
        default: return originalName;
      }
    }
    return originalName;
  };

  return (
    <div className="space-y-16 py-4 text-[#08525a]">
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6 pb-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          {t.homeTitle}
        </h1>

        <p className="text-base sm:text-xl text-[#08525a]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.homeSubtitle}
        </p>

        <div className="max-w-2xl mx-auto relative pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#2AA9A9] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-[#0E7C86]/20 shadow-sm focus:ring-2 focus:ring-[#0E7C86] focus:border-transparent text-sm font-semibold transition outline-none bg-white text-[#08525a]"
            />
            <Link
              href={search ? `/services?q=${encodeURIComponent(search)}` : "/services"}
              className="absolute right-2 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              {t.searchBtn}
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/wizard/vid-na-zhitelstvo"
            className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-[#0E7C86]/25 transition flex items-center space-x-2"
          >
            <span>{t.btnPickService}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/client/questionnaire"
            className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-[#FF8C42]/25 transition flex items-center space-x-2"
          >
            <UserCheck className="w-5 h-5" />
            <span>{t.btnFillQuestionnaire}</span>
          </Link>
          <Link
            href="/documents"
            className="bg-white hover:bg-[#FFFBF3] border border-[#0E7C86]/20 text-[#08525a] font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition shadow-sm"
          >
            {t.btnCheckDocs}
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold">{t.categoriesTitle}</h2>
            <p className="text-[#08525a]/60 text-sm font-medium">{t.categoriesSubtitle}</p>
          </div>
          <Link href="/services" className="text-[#FF8C42] hover:text-[#E66E26] text-sm font-bold flex items-center space-x-1">
            <span>{t.allCategories}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={"/services?category=" + cat.slug}
              className="bg-white p-5 rounded-2xl border border-[#0E7C86]/10 shadow-sm hover:shadow-md hover:border-[#2AA9A9] transition text-center group flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F0] text-[#0E7C86] flex items-center justify-center group-hover:bg-[#0E7C86] group-hover:text-white transition shadow-sm">
                {getCategoryIcon(cat.slug)}
              </div>
              <span className="font-extrabold text-xs sm:text-sm text-[#08525a] group-hover:text-[#FF8C42] transition">
                {getCategoryName(cat.slug, cat.name)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold">{t.popularTitle}</h2>
          <p className="text-[#08525a]/60 text-sm font-medium">{t.popularSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-[#08525a] rounded-3xl p-8 sm:p-12 text-white space-y-8 shadow-xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">{t.whyChooseTitle}</h2>
          <p className="text-[#FFD9A0] text-sm leading-relaxed font-medium">
            {t.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#FF8C42]" />
            <h3 className="font-extrabold text-lg text-white">{t.benefit1Title}</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">{t.benefit1Desc}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <CheckCircle className="w-8 h-8 text-[#2AA9A9]" />
            <h3 className="font-extrabold text-lg text-white">{t.benefit2Title}</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">{t.benefit2Desc}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <Sparkles className="w-8 h-8 text-[#FFD9A0]" />
            <h3 className="font-extrabold text-lg text-white">{t.benefit3Title}</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">{t.benefit3Desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
