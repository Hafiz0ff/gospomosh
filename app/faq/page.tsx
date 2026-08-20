"use client";

import React, { useState } from "react";
import { MOCK_FAQ } from "@/lib/mockData";
import { useLanguage } from "@/lib/languageContext";
import { HelpCircle, Search, Sparkles, HeartHandshake, ShieldCheck, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "migration" | "benefits">("all");
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getFaqQuestion = (id: string, originalQ: string) => {
    if (language === "tg") {
      switch (id) {
        // Миграция и паспорта
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

        // Пособия и социальные выплаты
        case "faq-9":
          return "Кӣ ҳуқуқи гирифтани Кӯмакпулии ягона (Единое пособие)-ро барои кӯдакони то 17-сола ва занони ҳомиладор дорад?";
        case "faq-10":
          return "Оё шаҳрвандони хориҷии дорои ВНЖ метавонанд дар РФ кӯмакпулӣ ва пардохтҳои кӯдакона гиранд?";
        case "faq-11":
          return "Сармояи модарӣ (Материнский капитал) ба кӣ дода мешавад ва қоидаҳои он чӣ гуна тағйир ёфтанд?";
        case "faq-12":
          return "Кӯмакпулӣ барои нигоҳубини кӯдаки то 1.5-сола барои шаҳрвандони корманд чӣ тавр ҳисоб карда мешавад?";
        case "faq-13":
          return "«Қоидаи даромади сифрӣ» ва баҳодиҳии амвол ҳангоми таъини кӯмакпулиҳо чӣ маъно дорад?";
        case "faq-14":
          return "Оё шаҳрвандони хориҷие, ки бо патент кор мекунанд, ба пардохти варақаи беморӣ (больничный) ҳуқуқ доранд?";
        default:
          return originalQ;
      }
    }
    return originalQ;
  };

  const getFaqAnswer = (id: string, originalA: string) => {
    if (language === "tg") {
      switch (id) {
        // Миграция и паспорта
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
          return "Шахсоне зерин ҳуқуқи гирифтани шаҳрвандӣ бо тартиби имтиёзнокро доранд: шахсоне, ки бо шаҳрванди РФ ақди никоҳ дошта, фарзанди муштарак доранд; шахсоне, ки падару модар ё фарзандони болиғи шаҳрванди РФ доранд; хатмкунандагони донишгоҳҳои аккредитатсияшудаи Русия бо дипломи аъло; иштирокчиёни Барномаи давлатии кӯчонидани ҳамватанон.";

        // Пособия и социальные выплаты
        case "faq-9":
          return "Кӯмакпулии ягона (Единое пособие) ба оилаҳое, ки кӯдакони аз 0 то 17-сола доранд ва занони ҳомиладоре, ки дар марҳилаҳои аввал ба қайд гирифта шудаанд, пардохт карда мешавад. Шартҳои асосӣ: аризадиҳанда ва кӯдак бояд шаҳрванди РФ бошанд ва дар РФ доимӣ зиндагӣ кунанд (ё хориҷиёни дорои ВНЖ мувофиқи қоидаҳо), ва даромади миёнаи ҳар як узви оила набояд аз ҳадди ақали зиндагии минтақавӣ зиёд бошад. Ҳаҷми пардохт 50%, 75% ё 100%-и ҳадди ақали зиндагии кӯдаконро ташкил медиҳад.";
        case "faq-10":
          return "Бале, шаҳрвандони хориҷие, ки дар асоси Иҷозати зист (ВНЖ) дар қаламрави РФ доимӣ истиқомат доранд, ба аксари пардохтҳои иҷтимоии давлатӣ ҳуқуқ доранд, аз ҷумла: кӯмакпулии яквақта ҳангоми таваллуди кӯдак, кӯмакпулии моҳона барои нигоҳубини кӯдак то 1.5-солагӣ ва кӯмакпулӣ барои ҳомиладорӣ ва таваллуд дар сурати фаъолияти расмии меҳнатӣ.";
        case "faq-11":
          return "Сармояи модарӣ ба волидон ҳангоми таваллуд (ё фарзандхондии) кӯдак дода мешавад. Мувофиқи қоидаҳои ҷорӣ, сармояи модарӣ танҳо ба кӯдаконе дода мешавад, ки ҳангоми таваллуд шаҳрвандии РФ-ро соҳиб шудаанд ва танҳо ба он волидоне, ки дар вақти таваллуди кӯдак аллакай шаҳрванди РФ буданд. Маблағро барои беҳтар кардани шароити манзил, таҳсили кӯдакон ё пардохтҳои моҳона то 3-солагӣ истифода бурдан мумкин аст.";
        case "faq-12":
          return "Барои шаҳрвандоне, ки ба таври расмӣ ба кор қабул шудаанд, кӯмакпулӣ барои нигоҳубини кӯдак то 1.5-солагӣ 40%-и музди миёнаи меҳнатро дар 2 соли тақвимии гузашта ташкил медиҳад, вале на камтар аз ҳадди ақали муқарраркардаи қонун. Муҳим: пардохти кӯмакпулӣ ҳатто ҳангоми барвақт ба кори пурра баромадани падар ё модар пурра нигоҳ дошта мешавад.";
        case "faq-13":
          return "Барои таъини Кӯмакпулии ягона ҳамаи аъзои қобили меҳнати оила бояд дар давраи ҳисобӣ ҳадди аққал дар як моҳ даромади расмии тасдиқшуда дошта бошанд (музди меҳнат, нафақа, стипендия, даромад аз худкорӣ) ё сабаби узрноки набудани онро пешниҳод намоянд (нигоҳубини кӯдаки то 3-сола, маъюбӣ, таҳсили рӯзона, мақоми расмии бекорӣ то 6 моҳ). Инчунин моликияти оила: хонаҳо, замин ва мошинҳо санҷида мешавад.";
        case "faq-14":
          return "Шаҳрвандони хориҷие, ки дар асоси патент ё шартномаи меҳнатӣ кор мекунанд, ба пардохти варақаи корношоямии муваққатӣ (больничный) ҳуқуқ пайдо мекунанд, ба шарте ки корфармои онҳо дар давоми давраи муқарраршуда ба Фонди иҷтимоии Русия (СФР) саҳмҳои суғуртавиро пардохт намуда бошад.";
        default:
          return originalA;
      }
    }
    return originalA;
  };

  const isBenefitFaq = (id: string) => ["faq-9", "faq-10", "faq-11", "faq-12", "faq-13", "faq-14"].includes(id);

  const filteredFaq = MOCK_FAQ.filter((f) => {
    if (activeFilter === "benefits" && !isBenefitFaq(f.id)) return false;
    if (activeFilter === "migration" && isBenefitFaq(f.id)) return false;

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
            ? "Барои хондани ҷавоб ба саволи лозима клик намоед"
            : "Нажмите на интересующий вопрос, чтобы развернуть подробный ответ"}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-[#0E7C86]/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeFilter === "all" ? "bg-[#0E7C86] text-white shadow-sm" : "bg-white border border-[#0E7C86]/20 hover:bg-[#FDF2F0]"
          }`}
        >
          {language === "tg" ? "Ҳамаи саволҳо" : "Все вопросы"} ({MOCK_FAQ.length})
        </button>
        <button
          onClick={() => setActiveFilter("benefits")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeFilter === "benefits" ? "bg-[#FF8C42] text-white shadow-sm" : "bg-white border border-[#0E7C86]/20 hover:bg-[#FDF2F0]"
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{language === "tg" ? "Кӯмакпулиҳо ва сармояи модарӣ" : "Пособия и маткапитал"}</span>
        </button>
        <button
          onClick={() => setActiveFilter("migration")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeFilter === "migration" ? "bg-[#0E7C86] text-white shadow-sm" : "bg-white border border-[#0E7C86]/20 hover:bg-[#FDF2F0]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === "tg" ? "Муҳоҷират ва шиносномаҳо" : "Миграция и паспорта"}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#2AA9A9] absolute left-4 top-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            language === "tg"
              ? "Ҷустуҷӯ аз рӯи саволҳо (масалан: кӯмакпулӣ, сармояи модарӣ, ВНЖ, 90 рӯз, андоз, шиноснома)..."
              : "Поиск по вопросам (например: единое пособие, маткапитал, ВНЖ, подтверждение, 90 дней, паспорт)..."
          }
          className="w-full pl-12 pr-4 py-4 bg-white border border-[#0E7C86]/20 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86] shadow-sm text-[#08525a]"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaq.map((faq) => {
          const isBenefit = isBenefitFaq(faq.id);
          const isOpen = openIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden ${
                isOpen ? "border-[#0E7C86]/40 shadow-md ring-1 ring-[#0E7C86]/10" : "border-[#0E7C86]/10 hover:border-[#2AA9A9]/40"
              }`}
            >
              {/* Question Header (Clickable) */}
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 transition group"
                aria-expanded={isOpen}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm transition ${
                    isBenefit
                      ? "bg-amber-50 text-[#FF8C42] group-hover:bg-[#FF8C42] group-hover:text-white"
                      : "bg-[#FDF2F0] text-[#0E7C86] group-hover:bg-[#0E7C86] group-hover:text-white"
                  }`}>
                    {isBenefit ? <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" /> : <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>

                  <div className="space-y-1.5">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                      isBenefit ? "bg-amber-100 text-amber-900" : "bg-[#FDF2F0] text-[#0E7C86]"
                    }`}>
                      {isBenefit
                        ? (language === "tg" ? "Кӯмакпулӣ ва пардохтҳо" : "Пособия и выплаты")
                        : (language === "tg" ? "Муҳоҷират ва ҳуҷҷатҳо" : "Миграция и документы")}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#08525a] group-hover:text-[#FF8C42] transition leading-snug">
                      {getFaqQuestion(faq.id, faq.question)}
                    </h3>
                  </div>
                </div>

                <div className={`p-2 rounded-xl bg-[#FDF2F0] text-[#0E7C86] transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-180 bg-[#0E7C86] text-white" : ""
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Collapsible Answer */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-[#08525a]/85 leading-relaxed font-medium border-t border-[#0E7C86]/5 bg-[#FDF2F0]/20 animate-in fade-in duration-200">
                  <p>{getFaqAnswer(faq.id, faq.answer)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
