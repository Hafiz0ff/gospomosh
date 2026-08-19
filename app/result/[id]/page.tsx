"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { getServiceBySlug, createLead } from "@/lib/dataService";
import { Service } from "@/lib/types";
import { CheckCircle, FileCheck, Download, UserCheck, ShieldAlert, ArrowLeft } from "lucide-react";

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submittedNumber, setSubmittedNumber] = useState<number | null>(null);

  useEffect(() => {
    getServiceBySlug("vid-na-zhitelstvo").then((s) => setService(s));
  }, []);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    const res = await createLead({
      name: leadName,
      phone: leadPhone,
      service_id: service?.id || "srv-1",
      status: "new"
    });
    setSubmittedNumber(res.lead_number || 1001);
  };

  if (!service) return <div className="p-8 text-center">Загрузка результата...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center print:hidden">
        <Link href="/services" className="text-gray-500 hover:text-gray-900 text-sm flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>К списку услуг</span>
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Скачать результат PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-emerald-600">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Персональный результат</span>
            <h1 className="text-2xl font-extrabold text-gray-900">{service.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">Ориентировочный срок</span>
            <span className="font-bold text-gray-900 text-base">{service.processing_time}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">Ориентировочная пошлина</span>
            <span className="font-bold text-gray-900 text-base">{service.government_fee.toLocaleString()} ₽</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <span className="text-xs text-blue-600 block mb-1">Сопровождение юриста</span>
            <span className="font-extrabold text-blue-700 text-base">от {service.assistance_price.toLocaleString()} ₽</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-gray-900">Необходимые документы и пошаговый план</h3>
          </div>

          <div className="space-y-3">
            {[
              "Паспорт гражданина (оригинал и нотариальный перевод)",
              "Фотографии 35х45 мм (4 шт.)",
              "Справка о доходах (2-НДФЛ / выписка)",
              "Медицинское освидетельствование",
              "Оплата государственной пошлины",
              "Подача заявления в МВД"
            ].map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-gray-800">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-between items-center print:hidden">
          <button
            onClick={() => setShowLeadModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center space-x-2"
          >
            <UserCheck className="w-5 h-5" />
            <span>Получить помощь специалиста</span>
          </button>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          Дисклеймер: Данный документ сформирован в демонстрационных целях (демо-значение). Информация носит справочный характер и уточняется юристом.
        </p>
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            {!submittedNumber ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Заявка специалисту</h3>
                <input
                  type="text"
                  required
                  placeholder="Ваше имя"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium"
                />
                <input
                  type="tel"
                  required
                  placeholder="Телефон"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium"
                />
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setShowLeadModal(false)} className="w-1/2 py-3 bg-gray-100 text-xs font-bold rounded-xl">Отмена</button>
                  <button type="submit" className="w-1/2 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl">Отправить</button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-3 py-2">
                <h3 className="text-xl font-bold text-gray-900">Заявка #{submittedNumber} принята!</h3>
                <button onClick={() => setShowLeadModal(false)} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
