"use client";

import React, { useState } from "react";
import { MOCK_SERVICES } from "@/lib/mockData";
import { useLanguage } from "@/lib/languageContext";
import { Calculator, Check, ArrowRight } from "lucide-react";

export default function CalculatorPage() {
  const { t, language } = useLanguage();
  const [selectedServiceId, setSelectedServiceId] = useState(MOCK_SERVICES[0].id);
  const [ageGroup, setAgeGroup] = useState<"child" | "teen" | "adult">("adult");
  const [urgency, setUrgency] = useState<"standard" | "urgent">("standard");
  const [addons, setAddons] = useState<string[]>(["fill_app", "check_docs"]);

  const service = MOCK_SERVICES.find((s) => s.id === selectedServiceId) || MOCK_SERVICES[0];

  const toggleAddon = (key: string) => {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const govFee = ageGroup === "child" ? service.government_fee * 0.5 : service.government_fee;
  const baseServicePrice = urgency === "urgent" ? service.assistance_price * 1.5 : service.assistance_price;
  const addonsTotal = (addons.includes("fill_app") ? 1500 : 0) + (addons.includes("check_docs") ? 1000 : 0) + (addons.includes("escort") ? 5000 : 0);

  const grandTotal = govFee + baseServicePrice + addonsTotal;

  // Bilingual services naming
  const getServiceName = (s: typeof service) => {
    if (language === "tg") {
      if (s.slug === "vid-na-zhitelstvo") return "Иҷозати зист (ВНЖ)";
      if (s.slug === "rvp") return "Иҷозати истиқомати муваққатӣ (РВП)";
      if (s.slug === "grazhdanstvo-rf") return "Шаҳрвандии Федератсияи Русия";
      if (s.slug === "patent") return "Патент барои кор дар РФ";
      if (s.slug === "inn-fl") return "Гирифтани ИНН барои шаҳрванд";
      if (s.slug === "snils") return "Бақайдгирии СНИЛС";
      if (s.slug === "zamena-pasporta-rf") return "Ивази шиносномаи шаҳрванди РФ";
      if (s.slug === "zagranpasport") return "Шиносномаи хориҷӣ (5 ва 10 сола)";
    }
    return s.name;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 text-[#08525a]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {t.calcTitle}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t.calcSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PARAMETERS FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
              {t.calcServiceLabel}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full p-3.5 bg-[#FDF2F0]/50 border border-black/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
            >
              {MOCK_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {getServiceName(s)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
              {t.calcAgeLabel}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "child", label: t.calcAgeChild },
                { id: "teen", label: t.calcAgeTeen },
                { id: "adult", label: t.calcAgeAdult }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAgeGroup(item.id as any)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    ageGroup === item.id
                      ? "border-[#0E7C86] bg-[#0E7C86]/10 text-[#08525a] shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
              {t.calcUrgencyLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "standard", label: t.calcUrgencyStandard },
                { id: "urgent", label: t.calcUrgencyUrgent }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setUrgency(item.id as any)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    urgency === item.id
                      ? "border-[#0E7C86] bg-[#0E7C86]/10 text-[#08525a] shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
              {t.calcAddonsLabel}
            </label>
            {[
              { id: "fill_app", label: t.addonFillApp, price: 1500 },
              { id: "check_docs", label: t.addonCheckDocs, price: 1000 },
              { id: "escort", label: t.addonEscort, price: 5000 }
            ].map((addon) => {
              const checked = addons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    checked ? "border-[#0E7C86] bg-[#0E7C86]/5" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked ? "bg-[#0E7C86] border-[#0E7C86] text-white" : "border-gray-300 bg-white"}`}>
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{addon.label}</span>
                  </div>
                  <span className="text-xs font-bold text-[#FF8C42]">+{addon.price.toLocaleString()} ₽</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUMMARY BREAKDOWN */}
        <div className="bg-[#08525a] rounded-3xl p-6 sm:p-8 text-white space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
              <Calculator className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="font-bold text-lg">{t.calcSummaryTitle}</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-gray-200">
                <span>{t.calcGovFee}</span>
                <span className="font-bold text-white">{govFee.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center text-gray-200">
                <span>{t.calcServicePrice}</span>
                <span className="font-bold text-white">{baseServicePrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center text-gray-200">
                <span>{t.calcAddonsPrice}</span>
                <span className="font-bold text-white">{addonsTotal.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-1">
              <span className="text-xs text-[#FFD9A0] block uppercase font-bold tracking-wider">
                {t.calcTotal}
              </span>
              <div className="text-3xl font-black text-[#FF8C42]">
                {grandTotal.toLocaleString()} ₽
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(language === "tg" ? "Дархости шумо қабул шуд! Мутахассиси мо ба зудӣ бо шумо тамос мегирад." : "Заявка сформирована! Менеджер свяжется с вами для уточнения деталей.")}
            className="w-full bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold py-4 rounded-2xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
          >
            <span>{t.calcSubmitBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
