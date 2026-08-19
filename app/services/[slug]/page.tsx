import React from "react";
import Link from "next/link";
import { getServiceBySlug, getDocuments, getFAQ } from "@/lib/dataService";
import { ArrowLeft, Clock, Banknote, ShieldCheck, FileCheck, ArrowRight, HelpCircle } from "lucide-react";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);
  const documents = await getDocuments();
  const faqItems = await getFAQ();

  if (!service) {
    return <div className="p-8 text-center">Услуга не найдена</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <Link href="/services" className="text-gray-500 hover:text-gray-900 text-sm flex items-center space-x-1.5 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Назад к каталогу</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
            {service.category?.name || "Услуга"}
          </span>
          <span className="text-xs font-medium text-emerald-600 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Доступна онлайн-подача</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {service.name}
        </h1>

        <p className="text-gray-600 text-base leading-relaxed">
          {service.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-xs text-gray-400 flex items-center space-x-1 mb-1">
              <Banknote className="w-4 h-4" />
              <span>Ориентировочная пошлина</span>
            </div>
            <div className="font-extrabold text-gray-900 text-lg">
              {service.government_fee > 0 ? `${service.government_fee.toLocaleString()} ₽` : 'Бесплатно'}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-xs text-gray-400 flex items-center space-x-1 mb-1">
              <Clock className="w-4 h-4" />
              <span>Ориентировочный срок</span>
            </div>
            <div className="font-extrabold text-gray-900 text-lg">
              {service.processing_time || '1 день'}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="text-xs text-blue-600 block mb-1 font-semibold">Сопровождение под ключ</div>
            <div className="font-extrabold text-blue-700 text-lg">
              от {service.assistance_price.toLocaleString()} ₽
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href={`/wizard/${service.slug}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center space-x-2"
          >
            <span>Подобрать и рассчитать</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calculator"
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-sm px-6 py-4 rounded-2xl transition"
          >
            Рассчитать госпошлину
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <FileCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Необходимые документы</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-xs font-semibold text-blue-600 block uppercase tracking-wider">{doc.document_type}</span>
              <h3 className="font-bold text-sm text-gray-900">{doc.name}</h3>
              <p className="text-xs text-gray-500">{doc.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Часто задаваемые вопросы</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq) => (
            <div key={faq.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <h3 className="font-bold text-base text-gray-900">{faq.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
