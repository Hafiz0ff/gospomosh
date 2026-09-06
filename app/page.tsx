"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/languageContext";
import {
  UserCheck, ArrowRight, FileText, CheckSquare, Clock
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div className="py-6 sm:py-12 text-[#08525a]">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 pt-4 pb-8">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {language === "tg" ? "Саволномаи ягонаи мизоҷ" : "Единая электронная анкета клиента"}
          </h1>

          <p className="text-base sm:text-xl text-[#08525a]/80 max-w-2xl mx-auto leading-relaxed font-medium">
            {language === "tg"
              ? "Маълумоти шахсии худро як маротиба ворид кунед. Мутахассисони мо дар асоси саволномаи шумо бастаи ҳуҷҷатҳоро омода ва ҳамроҳии ҳуқуқӣ менамоянд."
              : "Заполните персональные данные один раз. Наши юристы подготовят полный комплект документов и сформируют необходимое заявление."}
          </p>
        </div>

        {/* Big CTA */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
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
          <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3.5">
            <CheckSquare className="w-5 h-5 text-[#2AA9A9] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "12 қадами фаҳмо" : "12 простых шагов"}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === "tg" ? "Бо тавзеҳот ва намунаҳо" : "С подсказками и валидацией"}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3.5">
            <Clock className="w-5 h-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "Сабти худкор" : "Автосохранение"}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === "tg" ? "Имконияти идома дар вақти дигар" : "Можно продолжить позже"}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm flex items-start space-x-3.5">
            <FileText className="w-5 h-5 text-[#0E7C86] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#08525a]">
                {language === "tg" ? "Махфияти комил" : "Защита данных"}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === "tg" ? "Мувофиқи 152-ФЗ РФ" : "Строго по 152-ФЗ РФ"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
