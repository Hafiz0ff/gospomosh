"use client";

import React, { useState } from "react";
import { MOCK_DOCUMENTS, MOCK_SERVICES } from "@/lib/mockData";
import { CheckCircle2, XCircle, HelpCircle, FileCheck, ShieldAlert } from "lucide-react";

export default function DocumentsPage() {
  const [selectedService, setSelectedService] = useState(MOCK_SERVICES[0].id);
  const [statuses, setStatuses] = useState<Record<string, "yes" | "no" | "unsure">>({});

  const handleStatusChange = (docId: string, status: "yes" | "no" | "unsure") => {
    setStatuses((prev) => ({ ...prev, [docId]: status }));
  };

  const totalDocs = MOCK_DOCUMENTS.length;
  const readyDocs = Object.values(statuses).filter((s) => s === "yes").length;
  const missingDocs = Object.values(statuses).filter((s) => s === "no").length;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Проверка комплектности документов
        </h1>
        <p className="text-gray-500 text-sm">
          Отметьте документы, которые у вас есть, чтобы определить готовность пакета к подаче.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <label className="block text-sm font-bold text-gray-900">Выберите услугу:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MOCK_SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Чек-лист документов</h2>
          </div>

          <div className="text-xs font-semibold text-gray-500">
            Готово: <span className="text-emerald-600 font-bold">{readyDocs}</span> из {totalDocs}
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_DOCUMENTS.map((doc) => {
            const current = statuses[doc.id] || "unsure";
            return (
              <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      {doc.document_type}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">{doc.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{doc.description}</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleStatusChange(doc.id, "yes")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      current === "yes"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Есть</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(doc.id, "no")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      current === "no"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-rose-50"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Нет</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(doc.id, "unsure")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      current === "unsure"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-amber-50"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Не уверены</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-100">
          {missingDocs === 0 ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Отлично! Комплект полностью собран к подаче.</span>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm font-bold flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Внимание: Отсутствуют {missingDocs} документов. Обратитесь к специалисту.</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-gray-600 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-gray-500 flex-shrink-0" />
        <p>
          Справочная информация: Требования носят ориентировочный характер и уточняются в зависимости от индивидуального случая.
        </p>
      </div>
    </div>
  );
}
