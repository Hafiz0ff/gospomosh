"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <Link href="/" className="text-[#0E7C86] hover:underline text-sm font-bold flex items-center space-x-1.5">
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </Link>

      <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-8 sm:p-10 shadow-sm space-y-6 text-[#08525a]">
        <div className="flex items-center space-x-3 border-b border-[#0E7C86]/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#2AA9A9]/20 text-[#0E7C86] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#08525a]">
              Политика обработки персональных данных
            </h1>
            <p className="text-xs text-[#08525a]/60">Правовая информация сервиса «{APP_CONFIG.name}»</p>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#08525a]/85">
          <p className="p-4 bg-[#FFD9A0]/20 rounded-2xl border border-[#FFD9A0] text-xs font-semibold text-[#08525a]">
            ⚠️ Текст настоящего соглашения является техническим placeholder в рамках демонстрационного MVP. Перед коммерческим использованием текст подлежит обязательной юридической экспертизе с учётом законодательства РФ и фактической модели обработки данных компании.
          </p>

          <h2 className="text-lg font-bold text-[#08525a]">1. Общие положения</h2>
          <p>
            Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые сервисом «{APP_CONFIG.name}».
          </p>

          <h2 className="text-lg font-bold text-[#08525a]">2. Собираемые данные</h2>
          <p>
            Сервис может обрабатывать следующие персональные данные: фамилия, имя, отчество, дата и место рождения, данные документов, удостоверяющих личность (паспорт, загранпаспорт), ИНН, СНИЛС, контактный номер телефона, адрес электронной почты, адрес регистрации и фактического проживания, а также данные о семейном положении и детях.
          </p>

          <h2 className="text-lg font-bold text-[#08525a]">3. Цели обработки</h2>
          <p>
            Обработка персональных данных осуществляется исключительно в целях подготовки полного комплекта документов для получения государственных и миграционных услуг, расчета госпошлин, юридического консультирования и сопровождения клиента.
          </p>

          <h2 className="text-lg font-bold text-[#08525a]">4. Защита и конфиденциальность</h2>
          <p>
            Сервис обеспечивает полную конфиденциальность персональных данных. Данные хранятся в защищённой базе данных и не передаются третьим лицам без явного согласия клиента, за исключением случаев, предусмотренных законодательством РФ.
          </p>
        </div>
      </div>
    </div>
  );
}
