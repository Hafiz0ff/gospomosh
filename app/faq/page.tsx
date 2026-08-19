import React from "react";
import { MOCK_FAQ } from "@/lib/mockData";
import { HelpCircle, Search } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">   FAQ</h1>
        <p className="text-gray-500 text-sm">        </p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
        <input
          type="text"
          placeholder="   (:  , , )..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {MOCK_FAQ.map((faq) => (
          <div key={faq.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

