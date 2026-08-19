"use client";

import React, { useState } from "react";
import { MOCK_SERVICES } from "@/lib/mockData";
import { Calculator, Banknote, ShieldCheck, Check } from "lucide-react";

export default function CalculatorPage() {
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

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            
        </h1>
        <p className="text-gray-500 text-sm">
                   
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PARAMETERS FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider"></label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MOCK_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">  / </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "child", label: " 14 " },
                { id: "teen", label: "1418 " },
                { id: "adult", label: " 18 " }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAgeGroup(item.id as any)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    ageGroup === item.id
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                      : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider"></label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "standard", label: "" },
                { id: "urgent", label: "  (+50%)" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setUrgency(item.id as any)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition ${
                    urgency === item.id
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                      : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider"> </label>
            {[
              { id: "fill_app", label: " ", price: 1500 },
              { id: "check_docs", label: "  ", price: 1000 },
              { id: "escort", label: "  ", price: 5000 }
            ].map((addon) => {
              const checked = addons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    checked ? "border-blue-600 bg-blue-50/40" : "border-gray-100 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"}`}>
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{addon.label}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600">+{addon.price.toLocaleString()} ?</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUMMARY BREAKDOWN */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg"> </h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-gray-300">
                <span> :</span>
                <span className="font-bold text-white">{govFee.toLocaleString()} ?</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>:</span>
                <span className="font-bold text-white">{baseServicePrice.toLocaleString()} ?</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>. :</span>
                <span className="font-bold text-white">{addonsTotal.toLocaleString()} ?</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-1">
              <span className="text-xs text-blue-300 block uppercase font-bold tracking-wider"> </span>
              <div className="text-3xl font-black text-blue-400">
                {grandTotal.toLocaleString()} ?
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(" !     .")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition text-sm"
          >
             
          </button>
        </div>
      </div>
    </div>
  );
}

