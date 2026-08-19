import React from "react";
import { MOCK_SERVICES, MOCK_CATEGORIES } from "@/lib/mockData";
import ServiceCard from "@/components/ServiceCard";
import { Search } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#08525a] tracking-tight mb-2">
          Каталог услуг
        </h1>
        <p className="text-[#08525a]/70 text-sm">
          Выберите нужную услугу для быстрого расчета госпошлины, сроков и подбора документов
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#0E7C86]/10 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#2AA9A9] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Поиск по названию услуги..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86] text-[#08525a]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 bg-[#0E7C86] text-white rounded-xl text-xs font-bold shadow-sm">
            Все категории
          </button>
          {MOCK_CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              className="px-4 py-2 bg-[#FDF2F0] hover:bg-[#FFD9A0]/50 text-[#08525a] rounded-xl text-xs font-bold transition"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
