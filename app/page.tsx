"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";
import {
  ShieldCheck, CheckCircle, Sparkles, UserCheck, ArrowRight, FileText, CheckSquare, Clock
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 py-4 text-[#08525a]">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6 pb-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          {language === "tg" ? "Саволномаи ягонаи мизоҷ" : "Единая электронная анкета клиента"}
        </h1>

        <p className="text-base sm:text-xl text-[#08525a]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          {language === "tg"
            ? "Маълумоти шахсии худро як маротиба ворид кунед. Мутахассисони мо дар асоси саволномаи шумо бастаи ҳуҷҷатҳоро омода ва ҳамроҳии ҳуқуқӣ менамоянд."
            : "Заполните персональные данные один раз. Наши юристы подготовят полный комплект документов и сформируют необходимое заявление."}
        </p>

        {/* Big CTA */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/client/questionnaire"
            className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-extrabold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-xl shadow-[#FF8C42]/25 transition flex items-center space-x-3 active:scale-95"
          >
            <UserCheck className="w-6 h-6" />
            <span>{t.btnFillQuestionnaire}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-left">
          <div className="p-4 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3">
            <CheckSquare className="w-5 h-5 text-[#2AA9A9] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "12 қадами фаҳмо" : "12 простых шагов"}
              </h4>
              <p className="text-[11px] text-gray-500">
                {language === "tg" ? "Бо тавзеҳот ва намунаҳо" : "С подсказками и валидацией"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3">
            <Clock className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "Сабти худкор" : "Автосохранение"}
              </h4>
              <p className="text-[11px] text-gray-500">
                {language === "tg" ? "Имконияти идома дар вақти дигар" : "Можно продолжить позже"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3">
            <FileText className="w-5 h-5 text-[#0E7C86] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "Махфияти комил" : "Защита данных"}
              </h4>
              <p className="text-[11px] text-gray-500">
                {language === "tg" ? "Мувофиқи 152-ФЗ РФ" : "Строго по 152-ФЗ РФ"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
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
