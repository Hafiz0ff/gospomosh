import React from "react";
import Link from "next/link";
import { MOCK_CATEGORIES, MOCK_SERVICES } from "@/lib/mockData";
import ServiceCard from "@/components/ServiceCard";
import {
  Search, ArrowRight, ShieldCheck, CheckCircle, Sparkles, UserCheck,
  FileText, Globe, Users, Receipt, Car, Home, Heart, Shield, Scale, FileCheck
} from "lucide-react";

export function getCategoryIcon(slug: string) {
  switch (slug) {
    case "passport":
      return <FileText className="w-6 h-6" />;
    case "zagranpasport":
      return <Globe className="w-6 h-6" />;
    case "migration":
      return <Users className="w-6 h-6" />;
    case "taxes":
      return <Receipt className="w-6 h-6" />;
    case "auto":
      return <Car className="w-6 h-6" />;
    case "realty":
      return <Home className="w-6 h-6" />;
    case "family":
      return <Heart className="w-6 h-6" />;
    case "pension":
      return <Shield className="w-6 h-6" />;
    case "legal":
      return <Scale className="w-6 h-6" />;
    case "certificates":
      return <FileCheck className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
}

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6 pb-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#08525a] tracking-tight leading-tight">
          Поможем разобраться, какая услуга вам нужна
        </h1>

        <p className="text-lg sm:text-xl text-[#08525a]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Ответьте на несколько простых вопросов. Система сформирует персональный список документов, рассчитает госпошлину и подготовит пошаговый план действий.
        </p>

        <div className="max-w-2xl mx-auto relative pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#2AA9A9] absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Например: ВНЖ, загранпаспорт, замена паспорта..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-[#0E7C86]/20 shadow-sm focus:ring-2 focus:ring-[#0E7C86] focus:border-transparent text-sm font-semibold transition outline-none bg-white text-[#08525a]"
            />
            <button className="absolute right-2 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm">
              Найти
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/wizard/vid-na-zhitelstvo"
            className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-[#0E7C86]/25 transition flex items-center space-x-2"
          >
            <span>Подобрать услугу</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/client/questionnaire"
            className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-[#FF8C42]/25 transition flex items-center space-x-2"
          >
            <UserCheck className="w-5 h-5" />
            <span>Заполнить анкету клиента</span>
          </Link>
          <Link
            href="/documents"
            className="bg-white hover:bg-[#FFFBF3] border border-[#0E7C86]/20 text-[#08525a] font-extrabold text-base px-8 py-4 rounded-2xl transition shadow-sm"
          >
            Проверить документы
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#08525a]">Категории услуг</h2>
            <p className="text-[#08525a]/60 text-sm font-medium">Выберите направление для быстрого старта</p>
          </div>
          <Link href="/services" className="text-[#FF8C42] hover:text-[#E66E26] text-sm font-bold flex items-center space-x-1">
            <span>Все категории</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={"/services?category=" + cat.slug}
              className="bg-white p-5 rounded-2xl border border-[#0E7C86]/10 shadow-sm hover:shadow-md hover:border-[#2AA9A9] transition text-center group flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FDF2F0] text-[#0E7C86] flex items-center justify-center group-hover:bg-[#0E7C86] group-hover:text-white transition shadow-sm">
                {getCategoryIcon(cat.slug)}
              </div>
              <span className="font-extrabold text-sm text-[#08525a] group-hover:text-[#FF8C42] transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#08525a]">Популярные услуги</h2>
          <p className="text-[#08525a]/60 text-sm font-medium">Наиболее частые обращения клиентов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-[#08525a] rounded-3xl p-8 sm:p-12 text-white space-y-8 shadow-xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black mb-3">Почему клиенты выбирают «ГосПомощь»?</h2>
          <p className="text-[#FFD9A0] text-sm leading-relaxed font-medium">
            Мы превращаем сложную бюрократическую систему в понятный цифровой сервисный маршрут.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#FF8C42]" />
            <h3 className="font-extrabold text-lg text-white">Без ошибок</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">Система исключает риски отказа из-за неполного комплекта документов.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <CheckCircle className="w-8 h-8 text-[#2AA9A9]" />
            <h3 className="font-extrabold text-lg text-white">Персональный план</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">Автоматический расчет пошлин, сроков и пошаговый чек-лист действий.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <Sparkles className="w-8 h-8 text-[#FFD9A0]" />
            <h3 className="font-extrabold text-lg text-white">Экспертная поддержка</h3>
            <p className="text-xs text-white/80 leading-relaxed font-normal">Возможность связаться с профильным юристом в 1 клик на финальном шаге.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
