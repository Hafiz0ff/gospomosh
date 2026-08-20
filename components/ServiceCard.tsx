"use client";

import React from "react";
import Link from "next/link";
import { Service } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import {
  Clock, Banknote, ChevronRight, CheckCircle2,
  FileText, Globe, Users, Receipt, Car, Landmark, Award, FileCheck
} from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function getServiceIcon(slug: string, categorySlug?: string) {
  if (slug.includes("vid-na-zhitelstvo") || slug.includes("rvp") || slug.includes("migratsionny")) {
    return <Users className="w-5 h-5 text-[#2AA9A9]" />;
  }
  if (slug.includes("grazhdanstvo")) {
    return <Award className="w-5 h-5 text-[#FF8C42]" />;
  }
  if (slug.includes("zagranpasport")) {
    return <Globe className="w-5 h-5 text-[#2AA9A9]" />;
  }
  if (slug.includes("pasport")) {
    return <FileText className="w-5 h-5 text-[#2AA9A9]" />;
  }
  if (slug.includes("inn") || slug.includes("tax")) {
    return <Receipt className="w-5 h-5 text-[#FF8C42]" />;
  }
  if (slug.includes("auto")) {
    return <Car className="w-5 h-5 text-[#2AA9A9]" />;
  }
  if (slug.includes("sudimost") || slug.includes("spravka")) {
    return <FileCheck className="w-5 h-5 text-[#2AA9A9]" />;
  }
  if (slug.includes("patent")) {
    return <Landmark className="w-5 h-5 text-[#0E7C86]" />;
  }
  return <FileText className="w-5 h-5 text-[#2AA9A9]" />;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t, language } = useLanguage();

  // Full Bilingual Service Names
  const getServiceName = (s: Service) => {
    if (language === "tg") {
      if (s.slug === "vid-na-zhitelstvo") return "Иҷозати зист (ВНЖ)";
      if (s.slug === "zamena-pasporta" || s.slug === "zamena-pasporta-rf") return "Ивази шиносномаи РФ (20/45 солагӣ, гумшуда)";
      if (s.slug === "zagranpasport") return "Шиносномаи хориҷӣ (5 ва 10 сола)";
      if (s.slug === "rvp") return "Иҷозати истиқомати муваққатӣ (РВП)";
      if (s.slug === "migratsionny-uchet") return "Бақайдгирии муҳоҷиратӣ (Регистрация)";
      if (s.slug === "inn" || s.slug === "inn-fl") return "Гирифтани ИНН барои шаҳрванд";
      if (s.slug === "grazhdanstvo-rf") return "Шаҳрвандии Федератсияи Русия";
      if (s.slug === "patent") return "Патент барои кор дар РФ";
      if (s.slug === "snils") return "Бақайдгирии СНИЛС";
      if (s.slug === "auto-registration") return "Бақайдгирии мошин дар БДА (ГИБДД)";
    }
    return s.name;
  };

  // Full Bilingual Short Descriptions
  const getServiceDesc = (s: Service) => {
    if (language === "tg") {
      if (s.slug === "vid-na-zhitelstvo") return "Ҳамроҳии пурра барои гирифтани мақоми ВНЖ дар Федератсияи Русия";
      if (s.slug === "zamena-pasporta" || s.slug === "zamena-pasporta-rf") return "Омодасозии зуди ариза ва ҳуҷҷатҳо барои ивази шиносномаи шаҳрванди РФ";
      if (s.slug === "zagranpasport") return "Шиносномаи хориҷии биометрӣ бо чипи электронӣ";
      if (s.slug === "rvp") return "Ба расмият даровардани РВП аз рӯи квота ё асосҳои имтиёзнок";
      if (s.slug === "migratsionny-uchet") return "Бақайдгирии қонунии муҳоҷиратӣ дар ҷои истиқомат";
      if (s.slug === "inn" || s.slug === "inn-fl") return "Ба ҳисоб гирифтан дар мақомоти андоз ва гирифтани шаҳодатномаи ИНН";
      if (s.slug === "auto-registration") return "Ба ҳисоб гузоштани нақлиёт ва гирифтани рақамҳои давлатӣ";
    }
    return s.short_description || s.description;
  };

  const getProcessingTime = (timeStr?: string | null) => {
    if (!timeStr) return language === "tg" ? "1 рӯз" : "1 день";
    if (language === "tg") {
      return timeStr
        .replace(/От 4 месяцев/gi, "Аз 4 моҳ")
        .replace(/От 1 до 5 дней/gi, "Аз 1 то 5 рӯз")
        .replace(/От 1 месяца/gi, "Аз 1 моҳ")
        .replace(/От 2 до 4 месяцев/gi, "Аз 2 то 4 моҳ")
        .replace(/1 рабочий день/gi, "1 рӯзи корӣ")
        .replace(/1-3 дня/gi, "1–3 рӯз")
        .replace(/1 день/gi, "1 рӯз")
        .replace(/дней/gi, "рӯз")
        .replace(/дня/gi, "рӯз")
        .replace(/день/gi, "рӯз")
        .replace(/месяцев/gi, "моҳ")
        .replace(/месяца/gi, "моҳ")
        .replace(/месяц/gi, "моҳ");
    }
    return timeStr;
  };

  const getCategoryBadge = (catName?: string) => {
    if (language === "tg" && catName) {
      if (catName.includes("Миграцион")) return "Муҳоҷират";
      if (catName.includes("Паспорт")) return "Шиноснома";
      if (catName.includes("Загран")) return "Шиносномаи хориҷӣ";
      if (catName.includes("Налог")) return "Андозҳо";
      if (catName.includes("Авто")) return "Автомобил";
      return "Хизматрасонӣ";
    }
    return catName || "Услуга";
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0E7C86]/10 p-6 shadow-sm hover:shadow-md hover:border-[#2AA9A9]/50 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F0] flex items-center justify-center">
              {getServiceIcon(service.slug, service.category?.slug)}
            </div>
            <span className="inline-block px-3 py-1 bg-[#2AA9A9]/15 text-[#08525a] text-xs font-bold rounded-full">
              {getCategoryBadge(service.category?.name)}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#0E7C86] flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2AA9A9]" />
            <span>{t.onlineAvailable}</span>
          </span>
        </div>

        <h3 className="font-extrabold text-lg text-[#08525a] group-hover:text-[#FF8C42] transition mb-2">
          {getServiceName(service)}
        </h3>

        <p className="text-[#08525a]/75 text-sm mb-6 line-clamp-2 leading-relaxed font-normal">
          {getServiceDesc(service)}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-[#0E7C86]/10 mb-4 text-xs">
          <div>
            <div className="text-[#08525a]/60 flex items-center space-x-1 mb-1 font-semibold">
              <Banknote className="w-3.5 h-3.5 text-[#2AA9A9]" />
              <span>{t.govFeeLabel}</span>
            </div>
            <div className="font-bold text-[#08525a]">
              {service.government_fee > 0 ? service.government_fee.toLocaleString() + " ₽" : t.freeLabel}
            </div>
          </div>
          <div>
            <div className="text-[#08525a]/60 flex items-center space-x-1 mb-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#2AA9A9]" />
              <span>{t.processingTimeLabel}</span>
            </div>
            <div className="font-bold text-[#08525a]">
              {getProcessingTime(service.processing_time)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-[#08525a]/60 block font-medium">{t.assistanceLabel}</span>
            <span className="font-black text-[#FF8C42] text-base">
              {t.priceFrom} {service.assistance_price.toLocaleString()} ₽
            </span>
          </div>

          <div className="flex space-x-2">
            <Link
              href={"/wizard/" + service.slug}
              className="bg-[#0E7C86] hover:bg-[#08525a] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1 shadow-sm"
            >
              <span>{t.pickBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
