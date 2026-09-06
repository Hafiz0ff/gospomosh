"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  COUNTRIES, validateINN, validateSNILS, validatePhone, validateEmail,
  formatPhoneNumber, formatPassportSeries, formatPassportNumber,
  formatDepartmentCode, formatSNILSNumber, formatINNNumber, calculateAge
} from "@/lib/validation";
import { FullClientQuestionnaire, Child, ClientDocument } from "@/lib/types";
import { saveQuestionnaire } from "@/lib/dataService";
import { submitQuestionnaireAction } from "@/app/actions/submitQuestionnaire";
import { uploadClientDocument, getDocumentSignedUrl } from "@/lib/storageService";
import { useLanguage } from "@/lib/languageContext";
import { QUESTIONNAIRE_TRANSLATIONS } from "@/lib/questionnaireTranslations";
import {
  ChevronRight, CheckCircle2, ShieldAlert, User, Globe, FileText,
  CreditCard, PhoneCall, MapPin, Heart, Users, Baby, FolderPlus, CheckSquare,
  AlertCircle, Sparkles, CheckCircle, RefreshCw, Camera, Upload, Eye, Printer, Download,
  Trash2, Plus, Calendar
} from "lucide-react";

export default function ClientQuestionnaireHomePage() {
  const { language } = useLanguage();
  const tq = QUESTIONNAIRE_TRANSLATIONS[language];
  const [step, setStep] = useState(1);
  const [clientQuestionnaireId, setClientQuestionnaireId] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload state for Step 10
  const [isUploading, setIsUploading] = useState(false);
  const [newDocType, setNewDocType] = useState("");
  const [newDocNumber, setNewDocNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Printable ref
  const printableRef = useRef<HTMLDivElement>(null);

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
    setSaveMessage(tq.savingDraft);
    const res = await saveQuestionnaire(q);
    setClientQuestionnaireId(res.id || "cl-1");
    setSaveMessage(tq.draftSaved);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleNext = () => {
    saveDraftLocally(q);
    if (step < 12) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  // DOCS & CAMERA UPLOAD LOGIC
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const clientId = clientQuestionnaireId || `temp-${Date.now()}`;
      const res = await uploadClientDocument(clientId, "other", file);
      
      const newDoc: ClientDocument = {
        id: "doc-" + Date.now(),
        document_type: newDocType || file.name.slice(0, 30),
        document_number: newDocNumber || res.path || file.name,
        notes: res.path ? `Файл: ${file.name}` : undefined
      };

      const updated = { ...q, documents: [...q.documents, newDoc] };
      saveDraftLocally(updated);
      setNewDocType("");
      setNewDocNumber("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert(language === "tg" ? "Ҳуҷҷат / Акс бомуваффақият илова шуд!" : "Документ / Фото успешно прикреплено!");
    } catch (err: any) {
      alert("Ошибка прикрепления: " + (err.message || "Не удалось загрузить"));
    } finally {
      setIsUploading(false);
    }
  };

  const removeDoc = (id: string) => {
    const updated = q.documents.filter(d => d.id !== id);
    saveDraftLocally({ ...q, documents: updated });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.consent) {
      alert(language === "tg" ? "Лутфан розигии худро ба коркарди маълумоти шахсӣ тасдиқ кунед" : "Необходимо подтвердить согласие на обработку персональных данных");
      return;
    }
    setIsSubmitting(true);
    try {
      const finalData = { ...q, status: 'completed' as const };
      const res = await submitQuestionnaireAction(finalData);
      if (!res.success) {
        alert(res.error || (language === "tg" ? "Хатогӣ ҳангоми сабти саволнома" : "Ошибка сохранения анкеты"));
        return;
      }
      setClientQuestionnaireId(res.clientId || res.questionnaireId || "cl-1");
      localStorage.removeItem("gospomosh_draft_q");
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(language === "tg" ? "Хатогӣ ҳангоми ирсол" : "Ошибка сохранения анкеты на сервере");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(1);
    setQ({
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
      tax: { inn: "", snils: "" },
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
      contacts: { phone: "", whatsapp: "", email: "" },
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
  };

  const progressPercent = Math.round((step / 12) * 100);
  const clientAge = calculateAge(q.profile.birth_date, language);

  // IF SUBMITTED: SHOW SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 text-[#08525a]">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {language === "tg" ? "Саволнома бомуваффақият қабул шуд!" : "Анкета успешно принята!"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto font-medium">
            {language === "tg"
              ? "Маълумоти шумо ба системаи CRM ва назди мутахассиси ҳуқуқшинос ирсол гардид. Мо дар наздиктарин фурсат барои тасдиқ ва омодасозии ҳуҷҷатҳо бо шумо тамос мегирем."
              : "Ваши персональные данные сохранены в CRM и переданы профильному юристу. Специалист свяжется с вами в течение 15 минут для согласования дальнейших шагов."}
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#0E7C86]/15 shadow-sm max-w-md mx-auto space-y-3 text-left">
          <div className="flex justify-between items-center text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>{language === "tg" ? "Муштарӣ:" : "Клиент:"}</span>
            <span className="font-bold text-[#08525a]">{q.profile.last_name} {q.profile.first_name}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>{language === "tg" ? "Телефон:" : "Телефон:"}</span>
            <span className="font-bold text-[#08525a]">{q.contacts.phone}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{language === "tg" ? "Ҳолати ариза:" : "Статус заявки:"}</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
              {language === "tg" ? "Дар баррасӣ" : "В обработке (CRM)"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <button
            onClick={handlePrintPDF}
            className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>{language === "tg" ? "Чоп / Сабт ба PDF" : "Распечатать / Сохранить в PDF"}</span>
          </button>
          <button
            onClick={resetForm}
            className="bg-white hover:bg-gray-50 text-[#08525a] border border-[#0E7C86]/20 font-bold text-sm px-6 py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === "tg" ? "Саволномаи нав" : "Заполнить новую анкету"}</span>
          </button>
          <Link
            href="/admin"
            className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center"
          >
            <span>CRM</span>
          </Link>
        </div>
      </div>
    );
  }

  // MAIN QUESTIONNAIRE VIEW
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6 text-[#08525a]">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-[#0E7C86]/10 pb-3 print:hidden">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#FF8C42]" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0E7C86]">
            {language === "tg" ? "Саволномаи расмии мизоҷ" : "Единая официальная анкета клиента"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {saveMessage && <span className="text-xs font-bold text-[#FF8C42]">{saveMessage}</span>}
          <button
            onClick={handlePrintPDF}
            className="text-xs font-bold px-3 py-1.5 bg-white border border-[#0E7C86]/20 hover:bg-[#FDF2F0] text-[#08525a] rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            title="Распечатать или сохранить в PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#0E7C86]" />
            <span className="hidden sm:inline">{language === "tg" ? "Чоп ба PDF" : "Печать / PDF"}</span>
          </button>
          <button
            onClick={handleSaveDraft}
            className="text-xs font-bold px-3.5 py-1.5 bg-[#FFD9A0]/50 hover:bg-[#FFD9A0] text-[#08525a] rounded-xl transition"
          >
            {tq.saveAndContinue}
          </button>
        </div>
      </div>

      {/* DOCUMENT ACCURACY DISCLAIMER */}
      <div className="bg-[#FFD9A0]/25 border border-[#FF8C42]/30 rounded-2xl p-3.5 sm:p-4 text-xs text-[#08525a] flex items-start space-x-2.5 shadow-sm print:hidden">
        <AlertCircle className="w-4 h-4 text-[#FF8C42] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-semibold">
          {tq.docDisclaimer}
        </p>
      </div>

      {/* 4 INTERACTIVE SECTION TABS (VARIANT 1 + 2 COMBINED) */}
      <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-3 sm:p-4 shadow-sm space-y-3 print:hidden">
        {/* Section Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { id: 1, firstStep: 1, title: tq.sections[1].title, sub: tq.sections[1].subtitle, icon: User, steps: [1, 2] },
            { id: 2, firstStep: 3, title: tq.sections[2].title, sub: tq.sections[2].subtitle, icon: FileText, steps: [3, 4] },
            { id: 3, firstStep: 5, title: tq.sections[3].title, sub: tq.sections[3].subtitle, icon: PhoneCall, steps: [5, 6] },
            { id: 4, firstStep: 7, title: tq.sections[4].title, sub: tq.sections[4].subtitle, icon: Heart, steps: [7, 8, 9, 10, 11, 12] }
          ].map((sec) => {
            const IconComponent = sec.icon;
            const isActive = sec.steps.includes(step);
            const isPassed = Math.max(...sec.steps) < step;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setStep(sec.firstStep);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 rounded-2xl text-left transition flex items-center space-x-3 border ${
                  isActive
                    ? "bg-[#0E7C86] text-white border-[#0E7C86] shadow-md shadow-[#0E7C86]/20"
                    : isPassed
                    ? "bg-[#FDF2F0] text-[#08525a] border-[#0E7C86]/20 hover:border-[#0E7C86]"
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isPassed
                    ? "bg-[#0E7C86] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {isPassed ? <CheckCircle className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                </div>

                <div className="overflow-hidden">
                  <span className={`text-[10px] font-extrabold uppercase block tracking-wider ${isActive ? "text-[#FFD9A0]" : "text-gray-400"}`}>
                    {language === "tg" ? `Бахши ${sec.id}` : `Раздел ${sec.id}`}
                  </span>
                  <span className="font-extrabold text-xs truncate block leading-snug">
                    {sec.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress & Time Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 px-2 border-t border-[#0E7C86]/10 text-xs font-bold text-[#08525a]">
          <div className="flex items-center space-x-2">
            <span className="text-[#0E7C86] bg-[#FDF2F0] px-2.5 py-1 rounded-xl">
              {step <= 2 ? (language === "tg" ? "Бахши 1 аз 4: Маълумоти шахсӣ" : "Раздел 1 из 4: Личные данные") :
               step <= 4 ? (language === "tg" ? "Бахши 2 аз 4: Шиноснома ва андоз" : "Раздел 2 из 4: Паспорт и налоги") :
               step <= 6 ? (language === "tg" ? "Бахши 3 аз 4: Тамос ва суроға" : "Раздел 3 из 4: Контакты и адрес") :
               (language === "tg" ? "Бахши 4 аз 4: Оила ва ҳуҷҷатҳо" : "Раздел 4 из 4: Семья и документы")}
            </span>
            <span className="text-gray-400 font-normal">⏱️ {tq.estimatedTime}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-extrabold text-[#0E7C86]">{tq.passedPercent(progressPercent)}</span>
            <div className="w-24 sm:w-32 bg-[#FDF2F0] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E7C86] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 sm:p-8 shadow-sm space-y-6">

        {/* STEP CONTENT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <User className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">{tq.steps[1].title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.lastName}</label>
                <input
                  type="text"
                  required
                  value={q.profile.last_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, last_name: e.target.value } })}
                  placeholder={language === "tg" ? "Саидов" : "Иванов"}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.firstName}</label>
                <input
                  type="text"
                  required
                  value={q.profile.first_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, first_name: e.target.value } })}
                  placeholder={language === "tg" ? "Рустам" : "Иван"}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.middleName}</label>
                <input
                  type="text"
                  value={q.profile.middle_name}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, middle_name: e.target.value } })}
                  placeholder={language === "tg" ? "Алишерзода" : "Иванович"}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#08525a]">{tq.fields.birthDate}</label>
                  {clientAge && (
                    <span className="text-[11px] font-extrabold text-[#0E7C86] bg-[#0E7C86]/10 px-2 py-0.5 rounded-full">
                      {clientAge.text}
                    </span>
                  )}
                </div>
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
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.birthPlace}</label>
                <input
                  type="text"
                  required
                  value={q.profile.birth_place}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, birth_place: e.target.value } })}
                  placeholder={language === "tg" ? "ш. Душанбе" : "г. Москва"}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.gender}</label>
                <select
                  value={q.profile.gender}
                  onChange={(e) => setQ({ ...q, profile: { ...q.profile, gender: e.target.value as any } })}
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
                >
                  <option value="male">{tq.fields.genderMale}</option>
                  <option value="female">{tq.fields.genderFemale}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <Globe className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">{tq.steps[2].title}</h2>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.citizenship}</label>
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
                <span>{tq.fields.hasPrevCitizenship}</span>
              </label>

              {hasPrevCitizenship && (
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.prevCitizenshipCountry}</label>
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
              <h2 className="text-xl font-extrabold">{tq.steps[3].title}</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#08525a]">{tq.fields.internalPassport}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.series}</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={q.internal_passport.series}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, series: formatPassportSeries(e.target.value) } })}
                    placeholder="45 10"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.number}</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={q.internal_passport.number}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, number: formatPassportNumber(e.target.value) } })}
                    placeholder="123456"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.issueDate}</label>
                  <input
                    type="date"
                    required
                    value={q.internal_passport.issue_date}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, issue_date: e.target.value } })}
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.departmentCode}</label>
                  <input
                    type="text"
                    maxLength={7}
                    value={q.internal_passport.department_code || ""}
                    onChange={(e) => setQ({ ...q, internal_passport: { ...q.internal_passport, department_code: formatDepartmentCode(e.target.value) } })}
                    placeholder="770-001"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.issuer}</label>
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
                <span>{tq.fields.hasForeignPassport}</span>
              </label>

              {q.has_foreign_passport && (
                <div className="p-4 bg-[#FDF2F0]/70 rounded-2xl border border-[#0E7C86]/10 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#0E7C86]">{tq.fields.foreignPassport}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={tq.fields.series}
                      value={q.foreign_passport?.series || ""}
                      onChange={(e) => setQ({ ...q, foreign_passport: { ...q.foreign_passport!, series: e.target.value } })}
                      className="p-3 bg-white border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                    />
                    <input
                      type="text"
                      placeholder={tq.fields.number}
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
              <h2 className="text-xl font-extrabold">{tq.steps[4].title}</h2>
            </div>

            <div className="p-4 bg-[#FFD9A0]/30 rounded-2xl border border-[#FFD9A0] text-xs text-[#08525a] space-y-1">
              <span className="font-bold block">💡 {language === "tg" ? "Маълумот:" : "Автоформатирование и валидация:"}</span>
              <p>
                {language === "tg"
                  ? "Рақамҳо ба таври худкор формат мешаванд ва дурустии онҳо санҷида мешавад."
                  : "Номера автоматически форматируются дефисами и пробелами, а контрольная сумма валидируется мгновенно."}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.inn}</label>
                <input
                  type="text"
                  maxLength={12}
                  value={q.tax.inn || ""}
                  onChange={(e) => {
                    const formatted = formatINNNumber(e.target.value);
                    setQ({ ...q, tax: { ...q.tax, inn: formatted } });
                    const res = validateINN(formatted);
                    setInnError(res.isValid ? null : res.message || null);
                  }}
                  placeholder="771234567890"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                />
                {innError && <span className="text-xs font-bold text-[#FF8C42] mt-1 block">{innError}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.snils}</label>
                <input
                  type="text"
                  maxLength={14}
                  value={q.tax.snils || ""}
                  onChange={(e) => {
                    const formatted = formatSNILSNumber(e.target.value);
                    setQ({ ...q, tax: { ...q.tax, snils: formatted } });
                    const res = validateSNILS(formatted);
                    setSnilsError(res.isValid ? null : res.message || null);
                  }}
                  placeholder="123-456-789 01"
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
              <h2 className="text-xl font-extrabold">{tq.steps[5].title}</h2>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#0E7C86]/10 text-xs text-[#08525a] font-medium">
              💡 {language === "tg"
                ? "Барои рақамҳои тоҷикӣ (+992) ё русӣ (+7) рақамҳоро ворид кунед — формат худкор татбиқ мегардад."
                : "Поддерживается ввод российских (+7) и таджикских (+992) номеров с автоматическим разделением скобками и дефисами."}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.phone}</label>
                <input
                  type="tel"
                  required
                  value={q.contacts.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setQ({
                      ...q,
                      contacts: {
                        ...q.contacts,
                        phone: formatted,
                        whatsapp: whatsappSame ? formatted : q.contacts.whatsapp
                      }
                    });
                  }}
                  placeholder="+7 (999) 000-00-00 / +992 (92) 123-45-67"
                  className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
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
                <span>{tq.fields.whatsappSame}</span>
              </label>

              {!whatsappSame && (
                <div>
                  <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.whatsapp}</label>
                  <input
                    type="tel"
                    value={q.contacts.whatsapp || ""}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setQ({ ...q, contacts: { ...q.contacts, whatsapp: formatted } });
                    }}
                    placeholder="+7 (999) 000-00-00 / +992 (92) 123-45-67"
                    className="w-full p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#08525a] mb-1">{tq.fields.email}</label>
                <input
                  type="email"
                  value={q.contacts.email || ""}
                  onChange={(e) => setQ({ ...q, contacts: { ...q.contacts, email: e.target.value } })}
                  placeholder="name@example.com"
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
              <h2 className="text-xl font-extrabold">{tq.steps[6].title}</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#08525a]">{tq.fields.regAddress}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={tq.fields.region}
                  value={q.registration_address.region || ""}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, region: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder={tq.fields.city}
                  required
                  value={q.registration_address.city}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, city: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
                <input
                  type="text"
                  placeholder={tq.fields.street}
                  required
                  value={q.registration_address.street}
                  onChange={(e) => setQ({ ...q, registration_address: { ...q.registration_address, street: e.target.value } })}
                  className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={tq.fields.house}
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
                  placeholder={tq.fields.apartment}
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
                  <span>{tq.fields.actualAddressSame}</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <Heart className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">{tq.steps[8].title}</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: 'single', label: tq.fields.single },
                { id: 'married', label: tq.fields.married },
                { id: 'divorced', label: tq.fields.divorced },
                { id: 'widowed', label: tq.fields.widowed }
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
              <h2 className="text-xl font-extrabold">{tq.fields.spouseData}</h2>
            </div>

            {q.marital_status !== 'married' ? (
              <div className="p-6 bg-[#FDF2F0] rounded-2xl text-center text-xs font-bold text-[#08525a]/70">
                {language === "tg"
                  ? "Қадам гузаронида шуд, зеро вазъи оилавӣ «Оиладор» интихоб нашудааст."
                  : "Шаг пропущен, так как семейное положение указано как «Не женат/не замужем»."}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder={language === "tg" ? "Насаби ҳамсар *" : "Фамилия супруга *"}
                    value={q.spouse?.last_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, last_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder={language === "tg" ? "Номи ҳамсар *" : "Имя супруга *"}
                    value={q.spouse?.first_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, first_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder={language === "tg" ? "Номи падар" : "Отчество"}
                    value={q.spouse?.middle_name || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, middle_name: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={q.spouse?.marriage_date || ""}
                    onChange={(e) => setQ({ ...q, spouse: { ...q.spouse!, marriage_date: e.target.value } })}
                    className="p-3 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-sm font-semibold"
                  />
                  <input
                    type="text"
                    placeholder={language === "tg" ? "Ҷои ақди никоҳ" : "Место заключения брака"}
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
                <h2 className="text-xl font-extrabold">{tq.fields.children} ({q.children.length})</h2>
              </div>
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 shadow-sm"
              >
                <span>{tq.fields.addChild}</span>
              </button>
            </div>

            {q.children.length === 0 ? (
              <div className="p-8 bg-[#FDF2F0] rounded-2xl text-center text-xs font-semibold text-[#08525a]/70">
                {language === "tg"
                  ? "Фарзандон илова нашудаанд. Агар кӯдак дошта бошед, тугмаи «+ Илова кардани кӯдак»-ро пахш намоед."
                  : "Дети не добавлены. Если у вас есть дети, нажмите кнопку «+ Добавить ребёнка»."}
              </div>
            ) : (
              <div className="space-y-4">
                {q.children.map((child, idx) => {
                  const cAge = calculateAge(child.birth_date, language);
                  const is14Plus = cAge && cAge.age >= 14;

                  return (
                    <div key={child.id} className="p-5 bg-white rounded-2xl border border-[#0E7C86]/20 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-[#0E7C86]/10 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-[#0E7C86]">
                            {language === "tg" ? `Кӯдак #${idx + 1}` : `Ребёнок #${idx + 1}`}
                          </span>
                          {cAge && (
                            <span className="text-[11px] font-extrabold bg-[#0E7C86]/10 text-[#0E7C86] px-2 py-0.5 rounded-full">
                              {cAge.text}
                            </span>
                          )}
                          {is14Plus && (
                            <span className="text-[10px] font-extrabold bg-[#FFD9A0] text-[#08525a] px-2 py-0.5 rounded-full">
                              {language === "tg" ? "Шиноснома лозим (14+)" : "Требуется паспорт (14+)"}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChild(child.id)}
                          className="text-xs text-[#FF8C42] hover:underline font-bold"
                        >
                          {language === "tg" ? "Нобуд кардан" : "Удалить"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder={language === "tg" ? "Насаб" : "Фамилия"}
                          value={child.last_name}
                          onChange={(e) => updateChild(child.id, 'last_name', e.target.value)}
                          className="p-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder={language === "tg" ? "Ном" : "Имя"}
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
                          <span className="text-[11px] font-bold text-[#08525a] block">
                            {language === "tg" ? "Маълумоти шиносномаи кӯдак (14+)" : "Паспортные данные ребёнка (14+)"}
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="Серия (напр. 45 10)"
                              value={child.passport_series || ""}
                              onChange={(e) => updateChild(child.id, 'passport_series', formatPassportSeries(e.target.value))}
                              className="p-2 bg-white border border-[#0E7C86]/20 rounded-lg text-xs font-mono"
                            />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Номер (напр. 123456)"
                              value={child.passport_number || ""}
                              onChange={(e) => updateChild(child.id, 'passport_number', formatPassportNumber(e.target.value))}
                              className="p-2 bg-white border border-[#0E7C86]/20 rounded-lg text-xs font-mono"
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
            <div className="flex items-center space-x-2 text-[#08525a]">
              <FolderPlus className="w-5 h-5 text-[#2AA9A9]" />
              <h2 className="text-xl font-extrabold">{tq.fields.documents} ({q.documents.length})</h2>
            </div>

            {/* DIRECT PHOTO / SCAN CAMERA UPLOADER */}
            <div className="p-5 bg-[#FDF2F0]/70 rounded-2xl border border-[#0E7C86]/20 space-y-4">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#FF8C42]" />
                <h3 className="font-bold text-xs sm:text-sm text-[#08525a]">
                  {language === "tg" ? "Замима кардани акси ҳуҷҷат аз камера ё телефон" : "Прикрепить скан / фото документа с камеры"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={language === "tg" ? "Намуди ҳуҷҷат (масалан: Шиноснома, ВНЖ, РВП)..." : "Тип документа (напр.: Паспорт, ВНЖ, РВП)..."}
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="p-3 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
                />
                <input
                  type="text"
                  placeholder={language === "tg" ? "Рақами ҳуҷҷат (ихтиёрӣ)" : "Номер документа (опционально)"}
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  className="p-3 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-3.5 bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                {isUploading ? (
                  <span>{language === "tg" ? "Боркунӣ..." : "Загрузка файла..."}</span>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-[#FFD9A0]" />
                    <span>{language === "tg" ? "Гирифтани акс ё интихоби файл" : "Сделать фото с камеры или выбрать файл"}</span>
                  </>
                )}
              </button>
            </div>

            {/* ATTACHED DOCUMENTS LIST */}
            {q.documents.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl text-center text-xs font-semibold text-[#08525a]/70 border border-[#0E7C86]/10">
                {language === "tg"
                  ? "Ҳуҷҷатҳои иловагӣ илова нашудаанд. Агар дошта бошед, тугмаи болоро барои аксбардорӣ пахш намоед."
                  : "Дополнительные документы не добавлены. При необходимости прикрепите фото или укажите реквизиты."}
              </div>
            ) : (
              <div className="space-y-3">
                {q.documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-white rounded-2xl border border-[#0E7C86]/20 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FDF2F0] text-[#0E7C86] flex items-center justify-center font-bold text-xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#08525a] block">{doc.document_type}</span>
                        <span className="text-[11px] text-gray-500 font-mono">{doc.document_number || "—"}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="text-xs text-[#FF8C42] hover:underline font-bold"
                    >
                      {language === "tg" ? "Нобуд кардан" : "Удалить"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 11 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[#08525a]">
                <CheckSquare className="w-5 h-5 text-[#2AA9A9]" />
                <h2 className="text-xl font-extrabold">{tq.steps[11].title}</h2>
              </div>
              <button
                type="button"
                onClick={handlePrintPDF}
                className="text-xs font-bold px-3 py-1.5 bg-[#0E7C86] text-white rounded-xl transition flex items-center space-x-1 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === "tg" ? "Чоп ба PDF" : "Печать / PDF"}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FDF2F0] rounded-2xl border border-[#0E7C86]/10 space-y-2">
                <div className="flex justify-between font-bold text-[#0E7C86]">
                  <span>{language === "tg" ? "Маълумоти асосӣ:" : "Основные данные:"}</span>
                  <button onClick={() => setStep(1)} className="hover:underline">{language === "tg" ? "Иваз кардан" : "Изменить"}</button>
                </div>
                <p className="font-semibold">{q.profile.last_name} {q.profile.first_name} {q.profile.middle_name}, {language === "tg" ? "Таваллуд:" : "Родился:"} {q.profile.birth_date} {clientAge && `(${clientAge.text})`}</p>
                <p>{language === "tg" ? "Шаҳрвандӣ:" : "Гражданство:"} {q.profile.citizenship}</p>
              </div>

              <div className="p-4 bg-[#FDF2F0] rounded-2xl border border-[#0E7C86]/10 space-y-2">
                <div className="flex justify-between font-bold text-[#0E7C86]">
                  <span>{language === "tg" ? "Шиноснома ва андозҳо:" : "Паспорт и Налоги:"}</span>
                  <button onClick={() => setStep(3)} className="hover:underline">{language === "tg" ? "Иваз кардан" : "Изменить"}</button>
                </div>
                <p>{language === "tg" ? "Шиноснома:" : "Паспорт:"} {q.internal_passport.series} {q.internal_passport.number}, ИНН: {q.tax.inn || "-"}, СНИЛС: {q.tax.snils || "-"}</p>
              </div>

              <div className="p-4 bg-[#FDF2F0] rounded-2xl border border-[#0E7C86]/10 space-y-2">
                <div className="flex justify-between font-bold text-[#0E7C86]">
                  <span>{language === "tg" ? "Тамос ва суроға:" : "Контакты и Адрес:"}</span>
                  <button onClick={() => setStep(5)} className="hover:underline">{language === "tg" ? "Иваз кардан" : "Изменить"}</button>
                </div>
                <p>Тел: {q.contacts.phone}, WhatsApp: {q.contacts.whatsapp || q.contacts.phone}</p>
                <p>Суроға: {q.registration_address.city}, {q.registration_address.street} {q.registration_address.house}</p>
              </div>
            </div>
          </div>
        )}

        {step === 12 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="flex items-center space-x-2 text-[#08525a]">
              <ShieldAlert className="w-5 h-5 text-[#FF8C42]" />
              <h2 className="text-xl font-extrabold">{tq.steps[12].title}</h2>
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
                  {tq.fields.consentText}
                </span>
              </label>

              <div className="text-xs pt-2">
                <Link href="/privacy" target="_blank" className="text-[#0E7C86] font-bold hover:underline">
                  {language === "tg" ? "Сиёсати коркарди маълумоти шахсӣ ↗" : "Политика обработки персональных данных ↗"}
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-[#FF8C42]/25 disabled:opacity-50"
            >
              {isSubmitting
                ? (language === "tg" ? "Ирсол ба CRM..." : "Отправка в CRM...")
                : (language === "tg" ? "Ирсол ва сабти саволнома" : "Сохранить и отправить анкету")}
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
            {tq.back}
          </button>

          {step < 12 && (
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>{tq.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
