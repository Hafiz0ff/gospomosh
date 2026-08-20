"use client";

import React, { useState } from "react";
import { MOCK_FAQ } from "@/lib/mockData";
import { useLanguage } from "@/lib/languageContext";
import { HelpCircle, Search, Sparkles } from "lucide-react";

export default function FAQPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");

  const getFaqQuestion = (id: string, originalQ: string) => {
    if (language === "tg") {
      switch (id) {
        case "faq-1":
          return "Иҷозати зист (ВНЖ) дар Русия чанд муддат эътибор дорад?";
        case "faq-2":
          return "Оё дар соли 2026 тасдиқи солонаи истиқомат аз рӯи ВНЖ ва РВП ҳатмӣ аст?";
        case "faq-3":
          return "Дар соли 2026 барои шаҳрвандони хориҷӣ кадом қоидаи «90 рӯз» амал мекунад?";
        case "faq-4":
          return "Барои муоинаи ҳатмии тиббӣ ва изи ангушт (дактилоскопия) чӣ гуна талабот вуҷуд дорад?";
        case "faq-5":
          return "Ҳангоми расидан ба синни 20 ё 45 солагӣ шиносномаи РФ дар кадом мӯҳлат бояд иваз карда шавад?";
        case "faq-6":
          return "Оё бо РВП ё патенти меҳнатӣ дар дигар минтақа кор кардан мумкин аст?";
        case "faq-7":
          return "Шаҳрванди хориҷӣ чӣ гуна метавонад дар РФ ИНН ва СНИЛС гирад?";
        case "faq-8":
          return "Кӣ метавонад бо тартиби имтиёзнок барои гирифтани шаҳрвандии РФ муроҷиат намояд?";
        default:
          return originalQ;
      }
    }
    return originalQ;
  };

  const getFaqAnswer = (id: string, originalA: string) => {
    if (language === "tg") {
      switch (id) {
        case "faq-1":
          return "Иҷозати зист (ВНЖ) дар Федератсияи Русия ба таври бемӯҳлат (бемаҳдуд) дода мешавад (ба истиснои мутахассисони баландихтисос). Аммо худи бланкаи ҳуҷҷат ҳангоми расидан ба синни 14, 20 ва 45 солагӣ мисли шиносномаи дохилӣ ҳатман бояд иваз карда шавад.";
        case "faq-2":
          return "Бале, ин талабот қатъӣ мебошад. Дорандагони ВНЖ ва РВП вазифадоранд, ки дар давоми 2 моҳи пас аз анҷоми ҳар як соли истиқомат ба мақомоти ВКД (МВД) огоҳинома фиристанд ва маълумотнома дар бораи даромад (2-НДФЛ ё иқтибоси бонкӣ)-ро замима кунанд. Ҳар 5 сол огоҳиномаи ВНЖ танҳо ба таври ҳузури шахсӣ супорида мешавад.";
        case "faq-3":
          return "Аз солҳои 2025–2026 мӯҳлати будубоши муваққатии шаҳрвандони хориҷӣ бе раводид (виза) дар давоми як соли тақвимӣ ҳамагӣ то 90 рӯзро ташкил медиҳад (қаблан дар ҳар 180 рӯз 90 рӯз буд), агар патент, шартномаи меҳнатӣ, РВП ё ВНЖ ба расмият дароварда нашуда бошад.";
        case "faq-4":
          return "Шаҳрвандони хориҷие, ки бо мақсади кор омадаанд, бояд дар давоми 30 рӯзи тақвимӣ аз лаҳзаи воридшавӣ ба қайди изи ангушт, аксбардорӣ ва муоинаи тиббӣ гузаранд. Шахсоне, ки бо дигар мақсадҳо омадаанд (зиёда аз 90 рӯз) — дар давоми 90 рӯз. Сертификатҳои тиббӣ 1 сол эътибор доранд.";
        case "faq-5":
          return "Шиноснома пас аз расидан ба синни 20 ё 45 солагӣ дар давоми 90 рӯз эътибори худро нигоҳ медорад. Ҳуҷҷатҳоро барои иваз кардан бояд қатъиян дар ҳамин давраи 90-рӯза пешниҳод намуд. Дар сурати гузаронидани мӯҳлат ҷаримаи маъмурӣ ситонида мешавад.";
        case "faq-6":
          return "Не. Иҷозати истиқомати муваққатӣ (РВП) ва патенти корӣ танҳо дар он минтақаи РФ амал мекунанд, ки дар он ҷо дода шудаанд. Аммо барои дорандагони ВНЖ маҳдудият нест — онҳо метавонанд дар дилхоҳ минтақаи Федератсияи Русия озодона фаъолияти меҳнатӣ намоянд.";
        case "faq-7":
          return "ИНН аз ҷониби мақомоти андоз (ФНС) дар асоси аризаи шаҳрванди хориҷӣ дар давоми 1–3 рӯз бо доштани қайди муҳоҷиратӣ ва тарҷумаи нотариалии шиноснома дода мешавад. СНИЛС дар Фонди иҷтимоии Русия (СФР) ё аз ҷониби корфармо ҳангоми ба кори расмӣ даромадан тартиб дода мешавад.";
        case "faq-8":
          return "Шахсони зерин ҳуқуқи гирифтани шаҳрвандӣ бо тартиби имтиёзнокро доранд: шахсоне, ки бо шаҳрванди РФ ақди никоҳ дошта, фарзанди муштарак доранд; шахсоне, ки падару модар ё фарзандони болиғи шаҳрванди РФ доранд; хатмкунандагони донишгоҳҳои аккредитатсияшудаи Русия бо дипломи аъло; иштирокчиёни Барномаи давлатии кӯчонидани ҳамватанон.";
        default:
          return originalA;
      }
    }
    return originalA;
  };

  const filteredFaq = MOCK_FAQ.filter((f) => {
    const q = getFaqQuestion(f.id, f.question).toLowerCase();
    const a = getFaqAnswer(f.id, f.answer).toLowerCase();
    const s = search.toLowerCase();
    return q.includes(s) || a.includes(s);
  });

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 text-[#08525a]">
      <div>
        <div className="flex items-center space-x-2 text-[#0E7C86] mb-1 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#FF8C42]" />
          <span>{language === "tg" ? "Маълумоти муҳими соли 2026" : "Актуальная правовая база 2026 года"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          {language === "tg" ? "Саволу ҷавобҳои муҳим (FAQ)" : "База знаний и частые вопросы (FAQ)"}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          {language === "tg"
            ? "Ҷавобҳои мутахассисон ба саволҳои асосӣ оид ба муҳоҷират, шиноснома, ВНЖ, РВП ва андозҳо дар соли 2026"
            : "Ответы юристов на ключевые вопросы по миграционному учету, паспортам, ВНЖ, РВП и налогам в 2026 году"}
        </p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-[#2AA9A9] absolute left-4 top-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            language === "tg"
              ? "Ҷустуҷӯ аз рӯи саволҳо (масалан: ВНЖ, мӯҳлат, 90 рӯз, андоз, шиноснома)..."
              : "Поиск по вопросам (например: ВНЖ, подтверждение, 90 дней, налоги, паспорт)..."
          }
          className="w-full pl-12 pr-4 py-4 bg-white border border-[#0E7C86]/20 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86] shadow-sm text-[#08525a]"
        />
      </div>

      <div className="space-y-4">
        {filteredFaq.map((faq) => (
          <div key={faq.id} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-3 hover:border-[#2AA9A9]/40 transition">
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#FDF2F0] text-[#0E7C86] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#08525a] leading-snug">
                  {getFaqQuestion(faq.id, faq.question)}
                </h3>
                <p className="text-xs sm:text-sm text-[#08525a]/80 leading-relaxed font-medium">
                  {getFaqAnswer(faq.id, faq.answer)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
