"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COUNTRIES, validateINN, validateSNILS, validatePhone, validateEmail } from "@/lib/validation";
import { FullClientQuestionnaire, Child, ClientDocument } from "@/lib/types";
import { saveQuestionnaire, getClientQuestionnaire } from "@/lib/dataService";
import { submitQuestionnaireAction } from "@/app/actions/submitQuestionnaire";
import {
  ArrowLeft, ChevronRight, CheckCircle2, ShieldAlert, User, Globe, FileText,
  CreditCard, PhoneCall, MapPin, Heart, Users, Baby, FolderPlus, Download, CheckSquare
} from "lucide-react";

export default function ClientQuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clientQuestionnaireId, setClientQuestionnaireId] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // FORM STATE
  const [q, setQ] = useState<FullClientQuestionnaire>({
    status: 'draft',
    profile: {
      last_name: "",
      first_name: "",
      middle_name: "",
      birth_date: "",
      birth_place: "",
      gender: "male",
      citizenship: "Российская Федерация",
      previous_citizenship: ""
    },
    tax: {
      inn: "",
      snils: ""
    },
    internal_passport: {
      type: "internal",
      series: "",
      number: "",
      issue_date: "",
      issuer: "",
      department_code: ""
    },
    has_foreign_passport: false,
    foreign_passport: {
      type: "foreign",
      series: "",
      number: "",
      issue_date: "",
      issuer: "",
      expiry_date: ""
    },
    contacts: {
      phone: "",
      whatsapp: "",
      email: ""
    },
    registration_address: {
      type: "registration",
      country: "Российская Федерация",
      region: "",
      city: "",
      locality: "",
      street: "",
      house: "",
      building: "",
      apartment: "",
      postal_code: ""
    },
    actual_address_same: true,
    actual_address: {
      type: "actual",
      country: "Российская Федерация",
      region: "",
      city: "",
      locality: "",
      street: "",
      house: "",
      building: "",
      apartment: "",
      postal_code: ""
    },
    marital_status: "single",
    spouse: {
      last_name: "",
      first_name: "",
      middle_name: "",
      birth_date: "",
      birth_place: "",
      citizenship: "Российская Федерация",
      inn: "",
      snils: "",
      marriage_date: "",
      marriage_place: ""
    },
    children: [],
    documents: [],
    consent: false
  });

  const [whatsappSame, setWhatsappSame] = useState(true);
  const [hasPrevCitizenship, setHasPrevCitizenship] = useState(false);
  const [innError, setInnError] = useState<string | null>(null);
  const [snilsError, setSnilsError] = useState<string | null>(null);

  useEffect(() => {
    const local = localStorage.getItem("gospomosh_draft_q");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setQ(parsed);
      } catch (e) {}
    }
  }, []);

  const saveDraftLocally = (updated: FullClientQuestionnaire) => {
    setQ(updated);
    localStorage.setItem("gospomosh_draft_q", JSON.stringify(updated));
  };

  const handleSaveDraft = async () => {
    setSaveMessage("Сохранение черновика...");
    const res = await saveQuestionnaire(q);
    setClientQuestionnaireId(res.id || "cl-1");
    setSaveMessage("Черновик сохранён!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleNext = () => {
    saveDraftLocally(q);
    if (step < 12) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // CHILD LOGIC
  const addChild = () => {
    const newChild: Child = {
      id: "child-" + Date.now(),
      last_name: q.profile.last_name || "",
      first_name: "",
      middle_name: q.profile.middle_name || "",
      birth_date: "",
      citizenship: q.profile.citizenship || "Российская Федерация"
    };
    saveDraftLocally({ ...q, children: [...q.children, newChild] });
  };

  const updateChild = (id: string, field: keyof Child, val: any) => {
    const updated = q.children.map(c => c.id === id ? { ...c, [field]: val } : c);
    saveDraftLocally({ ...q, children: updated });
  };

  const removeChild = (id: string) => {
    const updated = q.children.filter(c => c.id !== id);
    saveDraftLocally({ ...q, children: updated });
  };

  // DOCS LOGIC
  const addDoc = () => {
    const newDoc: ClientDocument = {
      id: "doc-" + Date.now(),
      document_type: "Свидетельство о рождении",
      document_number: ""
    };
    saveDraftLocally({ ...q, documents: [...q.documents, newDoc] });
  };

  const updateDoc = (id: string, field: keyof ClientDocument, val: any) => {
    const updated = q.documents.map(d => d.id === id ? { ...d, [field]: val } : d);
    saveDraftLocally({ ...q, documents: updated });
  };

  const removeDoc = (id: string) => {
    const updated = q.documents.filter(d => d.id !== id);
    saveDraftLocally({ ...q, documents: updated });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.consent) {
      alert("Необходимо подтвердить согласие на обработку персональных данных");
      return;
    }
    const finalData = { ...q, status: 'completed' as const };
    const res = await submitQuestionnaireAction(finalData);
    if (!res.success) {
      alert(res.error || "Ошибка сохранения анкеты на сервере");
      return;
    }
    localStorage.removeItem("gospomosh_draft_q");
    alert("Единая анкета клиента успешно отправлена и сохранена!");
    router.push('/admin/login');
  };

  const progressPercent = Math.round((step / 12) * 100);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between border-b border-[#0E7C86]/10 pb-4 print:hidden">
        <Link href="/" className="text-[#0E7C86] hover:underline text-sm font-bold flex items-center space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>На главную</span>
        </Link>
        <div className="flex items-center space-x-3">
          {saveMessage && <span className="text-xs font-bold text-[#FF8C42]">{saveMessage}</span>}
          <button
            onClick={handleSaveDraft}
            className="text-xs font-bold px-3 py-1.5 bg-[#FFD9A0]/50 hover:bg-[#FFD9A0] text-[#08525a] rounded-xl transition"
          >
            Сохранить и продолжить позже
          </button>
        </div>
      </div>

      {/* STEPPER PROGESS */}
      <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 sm:p-8 shadow-sm space-y-6 print:hidden">
        <div className="flex justify-between items-center text-xs font-bold text-[#08525a]">
          <span>Шаг {step} из 12</span>
          <span>{progressPercent}% пройдено</span>
        </div>
        <div className="w-full bg-[#FDF2F0] h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#0E7C86] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* STEP CONTENT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <User className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 1: Основные данные</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Фамилия *</label>
                <input
                  type="text"
                  required
                  value={q.profile.last_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, last_name: e.target.value } })}
                  placeholder="Иванов"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Имя *</label>
                <input
                  type="text"
                  required
                  value={q.profile.first_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, first_name: e.target.value } })}
                  placeholder="Иван"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Отчество</label>
                <input
                  type="text"
                  value={q.profile.middle_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, middle_name: e.target.value } })}
                  placeholder="Иванович"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Дата рождения *</label>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={q.profile.birth_date}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, birth_date: e.target.value } })}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Место рождения *</label>
                <input
                  type="text"
                  required
                  value={q.profile.birth_place}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, birth_place: e.target.value } })}
                  placeholder="г. Москва"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Пол *</label>
                <select
                  value={q.profile.gender}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, gender: e.target.value as any } })}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <Globe className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 2: Гражданство</h2>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#08525a] mb-1">Гражданство (выбор из списка) *</label>
              <select
                value={q.profile.citizenship}
                onChange={(e) => setQ({ ...q, profile: { ...q.profile, citizenship: e.target.value } })}
                className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-[#0E7C86]/10 space-y-3">
              <label className="flex items-center space-x-2 text-sm font-bold text-[#08525a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPrevCitizenship}
                  onChange={(e) => setHasPrevCitizenship(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0E7C86]"
                />
                <span>Имелось предыдущее гражданство</span>
              </label>

              {hasPrevCitizenship && (
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Страна предыдущего гражданства</label>
                  <select
                    value={q.profile.previous_citizenship || ""}
                    onChange={(e) => setQ({ ...q, profile: { ...q.profile, previous_citizenship: e.target.value } })}
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <FileText className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 3: Паспортные данные</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#08525a]">Паспорт гражданина (Основной)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Серия *</label>
                  <input
                    type="text"
                    required
                    value={q.internal_passport.series}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, series: e.target.value } })}
                    placeholder="4510"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Номер *</label>
                  <input
                    type="text"
                    required
                    value={q.internal_passport.number}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, number: e.target.value } })}
                    placeholder="123456"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Дата выдачи *</label>
                  <input
                    type="date"
                    required
                    value={q.internal_passport.issue_date}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, issue_date: e.target.value } })}
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Код подразделения</label>
                  <input
                    type="text"
                    value={q.internal_passport.department_code || ""}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, department_code: e.target.value } })}
                    placeholder="770-001"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Кем выдан *</label>
                <input
                  type="text"
                  required
                  value={q.internal_passport.issuer}
                  onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, issuer: e.target.value } })}
                  placeholder="ГУ МВД России по г. Москве"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#0E7C86]/10 space-y-4">
              <label className="flex items-center space-x-2 text-sm font-bold text-[#08525a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={q.has_foreign_passport}
                  onChange={(e) => setQ({ ...q, has_foreign_passport: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0E7C86]"
                />
                <span>Есть действующий загранпаспорт</span>
              </label>

              {q.has_foreign_passport && (
                <div className="p-4 bg-[#FDF2F0]/70 rounded-2xl border border-[#0E7C86]/10 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0E7C86]">Загранпаспорт</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Серия"
                      value={q.foreign_passport?.series || ""}
                      onChange={(e) => setQ({ ...q, foreign_passport: { ...q.foreign_passport!, series: e.target.value } })}
                      className="p-3 bg-white border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Номер"
                      value={q.foreign_passport?.number || ""}
                      onChange={(e) => setQ({ ...q, foreign_passport: { ...q.foreign_passport!, number: e.target.value } })}
                      className="p-3 bg-white border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <CreditCard className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 4: ИНН и СНИЛС</h2>
            </div>

            <div className="p-4 bg-[#FFD9A0]/30 rounded-2xl border border-[#FFD9A0] text-xs text-[#08525a] space-y-1">
              <span className="font-bold block">💡 Обратите внимание:</span>
              <p>Проверяется математическая корректность номеров (контрольные цифры), но не факт их фактической регистрации в государственном реестре.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">ИНН физического лица (12 цифр)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={q.tax.inn || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQ({ ...q, tax: { ...q.tax, inn: val } });
                    const res = validateINN(val);
                    setInnError(res.isValid ? null : res.message || null);
                  }}
                  placeholder="771234567890"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                />
                {innError && <span className="text-xs font-bold text-[#FF8C42] mt-1 block">{innError}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">СНИЛС (11 цифр)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={q.tax.snils || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQ({ ...q, tax: { ...q.tax, snils: val } });
                    const res = validateSNILS(val);
                    setSnilsError(res.isValid ? null : res.message || null);
                  }}
                  placeholder="12345678901"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                />
                {snilsError && <span className="text-xs font-bold text-[#FF8C42] mt-1 block">{snilsError}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <PhoneCall className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 5: Контактная информация</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Контактный телефон *</label>
                <input
                  type="tel"
                  required
                  value={q.contacts.phone}
                  onChange={(e) => {
                    const p = e.target.value;
                    setQ({
                      ...q,
                      contacts: {
                        ...q.contacts,
                        phone: p,
                        whatsapp: whatsappSame ? p : q.contacts.whatsapp
                      }
                    });
                  }}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs font-bold text-[#08525a] cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappSame}
                  onChange={(e) => {
                    setWhatsappSame(e.target.checked);
                    if (e.target.checked) {
                      setQ({ ...q, contacts: { ...q.contacts, whatsapp: q.contacts.phone } });
                    }
                  }}
                  className="w-4 h-4 rounded text-[#0E7C86]"
                />
                <span>WhatsApp использует этот же номер телефона</span>
              </label>

              {!whatsappSame && (
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">Номер WhatsApp / Telegram</label>
                  <input
                    type="tel"
                    value={q.contacts.whatsapp || ""}
                    onChange={(e) => setQ({ ...q, contacts: { ...q.contacts, whatsapp: e.target.value } })}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">Электронная почта (Email)</label>
                <input
                  type="email"
                  value={q.contacts.email || ""}
                  onChange={(e) => setQ({ ...q, contacts: { ...q.contacts, email: e.target.value } })}
                  placeholder="ivan@example.com"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <MapPin className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 6: Адреса</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#08525a]">Адрес постоянной регистрации</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Регион / Область"
                  value={q.registration_address.region || ""}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, region: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder="Город *"
                  required
                  value={q.registration_address.city}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, city: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder="Улица *"
                  required
                  value={q.registration_address.street}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, street: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Дом *"
                  required
                  value={q.registration_address.house}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, house: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder="Корпус"
                  value={q.registration_address.building || ""}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, building: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder="Кв."
                  value={q.registration_address.apartment || ""}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, apartment: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-[#0E7C86]/10">
                <label className="flex items-center space-x-2 text-sm font-bold text-[#08525a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={q.actual_address_same}
                    onChange={(e) => setQ({ ...q, actual_address_same: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0E7C86]"
                  />
                  <span>Адрес фактического проживания совпадает с адресом регистрации</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <Heart className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 7: Семейное положение</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: 'single', label: 'Не женат / Не замужем' },
                { id: 'married', label: 'Женат / Замужем' },
                { id: 'divorced', label: 'Разведен / Разведена' },
                { id: 'widowed', label: 'Вдовец / Вдова' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setQ({ ...q, marital_status: item.id as any })}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition flex items-center justify-between ${
                    q.marital_status === item.id
                      ? "border-[#0E7C86] bg-[#0E7C86]/10 text-[#08525a]"
                      : "border-gray-100 bg-white text-[#08525a]"
                  }`}
                >
                  <span>{item.label}</span>
                  {q.marital_status === item.id && <CheckCircle2 className="w-5 h-5 text-[#0E7C86]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <Users className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 8: Данные супруга / супруги</h2>
            </div>

            {q.marital_status !== 'married' ? (
              <div className="p-6 bg-[#FDF2F0] rounded-2xl text-center text-xs font-bold text-[#08525a]/70">
                Шаг пропущен, так как семейное положение указано как «{q.marital_status === 'single' ? 'Не женат/не замужем' : q.marital_status === 'divorced' ? 'Разведен' : 'Вдовец/вдова'}».
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Фамилия супруга *"
                    value={q.spouse?.last_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, last_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Имя супруга *"
                    value={q.spouse?.first_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, first_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Отчество"
                    value={q.spouse?.middle_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, middle_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="Дата заключения брака"
                    value={q.spouse?.marriage_date || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, marriage_date: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Место заключения брака"
                    value={q.spouse?.marriage_place || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, marriage_place: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 9 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[#08525a]">
                <Baby className="w-5 h-5 text-[#2AA9A9]" />
                <h2 className="text-xl font-extrabold">Шаг 9: Данные детей ({q.children.length})</h2>
              </div>
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 shadow-sm"
              >
                <span>+ Добавить ребёнка</span>
              </button>
            </div>

            {q.children.length === 0 ? (
              <div className="p-8 bg-[#FDF2F0] rounded-2xl text-center text-xs font-semibold text-[#08525a]/70">
                Дети не добавлены. Если у вас есть дети, нажмите кнопку «+ Добавить ребёнка».
              </div>
            ) : (
              <div className="space-y-4">
                {q.children.map((child, idx) => {
                  const age = child.birth_date ? Math.floor((Date.now() - new Date(child.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000)) : 0;
                  const is14Plus = age >= 14;

                  return (
                    <div key={child.id} className="p-5 bg-white rounded-2xl border border-[#0E7C86]/20 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-[#0E7C86]/10 pb-2">
                        <span className="font-bold text-xs text-[#0E7C86]">Ребёнок #{idx + 1} {is14Plus && "(14+ лет — требуется паспорт)"}</span>
                        <button
                          type="button"
                          onClick={() => removeChild(child.id)}
                          className="text-xs text-[#FF8C42] hover:underline font-bold"
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Фамилия"
                          value={child.last_name}
                          onChange={(e) => updateChild(child.id, 'last_name', e.target.value)}
                          className="p-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Имя"
                          value={child.first_name}
                          onChange={(e) => updateChild(child.id, 'first_name', e.target.value)}
                          className="p-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="date"
                          value={child.birth_date}
                          onChange={(e) => updateChild(child.id, 'birth_date', e.target.value)}
                          className="p-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      {is14Plus && (
                        <div className="p-3 bg-[#FFD9A0]/20 rounded-xl border border-[#FFD9A0] space-y-2">
                          <span className="text-[11px] font-bold text-[#08525a] block">Паспортные данные ребёнка (14+)</span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Серия паспорта"
                              value={child.passport_series || ""}
                              onChange={(e) => updateChild(child.id, 'passport_series', e.target.value)}
                              className="p-2 bg-white border border-[#0E7C86]/20 rounded-lg text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Номер паспорта"
                              value={child.passport_number || ""}
                              onChange={(e) => updateChild(child.id, 'passport_number', e.target.value)}
                              className="p-2 bg-white border border-[#0E7C86]/20 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 10 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[#08525a]">
                <FolderPlus className="w-5 h-5 text-[#2AA9A9]" />
                <h2 className="text-xl font-extrabold">Шаг 10: Дополнительные документы ({q.documents.length})</h2>
              </div>
              <button
                type="button"
                onClick={addDoc}
                className="px-4 py-2 bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                + Добавить документ
              </button>
            </div>

            {q.documents.length === 0 ? (
              <div className="p-6 bg-[#FDF2F0] rounded-2xl text-center text-xs font-semibold text-[#08525a]/70">
                Дополнительные документы не добавлены. При необходимости укажите имеющиеся свидетельства, ВНЖ, РВП и др.
              </div>
            ) : (
              <div className="space-y-3">
                {q.documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-white rounded-2xl border border-[#0E7C86]/20 flex items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Тип документа (напр., ВНЖ)"
                      value={doc.document_type}
                      onChange={(e) => updateDoc(doc.id, 'document_type', e.target.value)}
                      className="p-2 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="Номер документа"
                      value={doc.document_number || ""}
                      onChange={(e) => updateDoc(doc.id, 'document_number', e.target.value)}
                      className="p-2 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold w-1/3"
                    />
                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="text-xs text-[#FF8C42] hover:underline font-bold"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 11 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <CheckSquare className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">Шаг 11: Проверка введённых данных</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FDF2F0] rounded-2xl border border-[#0E7C86]/10 space-y-2">
                <div className="flex justify-between font-bold text-[#0E7C86]">
                  <span>Основные данные:</span>
                  <button onClick={() => setStep(1)} className="hover:underline">Изменить</button>
                </div>
                <p>{q.profile.last_name} {q.profile.first_name} {q.profile.middle_name}, Родился: {q.profile.birth_date}</p>
                <p>Гражданство: {q.profile.citizenship}</p>
              </div>

              <div className="p-4 bg-[#FDF2F0] rounded-2xl border border-[#0E7C86]/10 space-y-2">
                <div className="flex justify-between font-bold text-[#0E7C86]">
                  <span>Паспорт и Налоги:</span>
                  <button onClick={() => setStep(3)} className="hover:underline">Изменить</button>
                </div>
                <p>Паспорт: {q.internal_passport.series} {q.internal_passport.number}, ИНН: {q.tax.inn || "Не указан"}, СНИЛС: {q.tax.snils || "Не указан"}</p>
              </div>
            </div>
          </div>
        )}

        {step === 12 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <ShieldAlert className="w-5 h-5 text-[#FF8C42]" />
              <h2 className="text-xl font-extrabold">Шаг 12: Подтверждение и согласие</h2>
            </div>

            <div className="p-5 bg-[#FFD9A0]/30 rounded-2xl border border-[#FFD9A0] space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={q.consent}
                  onChange={(e) => setQ({ ...q, consent: e.target.checked })}
                  className="w-5 h-5 rounded text-[#0E7C86] mt-0.5"
                />
                <span className="text-xs font-semibold text-[#08525a] leading-relaxed">
                  Я подтверждаю, что предоставляю свои персональные данные добровольно и соглашаюсь на их обработку в соответствии с условиями сервиса.
                </span>
              </label>

              <div className="text-xs pt-2">
                <Link href="/privacy" target="_blank" className="text-[#0E7C86] font-bold hover:underline">
                  Политика обработки персональных данных ↗
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-[#FF8C42]/25"
            >
              Сохранить и отправить анкету
            </button>
          </form>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center pt-6 border-t border-[#0E7C86]/10 print:hidden">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            Назад
          </button>

          {step < 12 && (
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>Продолжить</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
