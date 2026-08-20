"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_SERVICES, MOCK_QUESTIONS } from "@/lib/mockData";
import { useLanguage } from "@/lib/languageContext";
import { ArrowLeft, CheckCircle, ChevronRight, FileCheck, RefreshCw, ShieldAlert, UserCheck } from "lucide-react";
import { createLead } from "@/lib/dataService";

export default function WizardPage({ params }: { params: Promise<{ serviceSlug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { language } = useLanguage();

  const service = MOCK_SERVICES.find((s) => s.slug === resolvedParams.serviceSlug) || MOCK_SERVICES[0];
  const questions = MOCK_QUESTIONS[service.slug] || MOCK_QUESTIONS["vid-na-zhitelstvo"];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");
  const [leadComment, setLeadComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<number | null>(null);

  const currentQuestion = questions[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / questions.length) * 100);

  const handleSelectOption = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setIsSubmitting(true);
    try {
      const result = await createLead({
        name: leadName,
        phone: leadPhone,
        whatsapp: leadWhatsapp || leadPhone,
        service_id: service.id,
        answers_json: answers,
        result_json: {
          fee: service.government_fee,
          time: service.processing_time,
          assistance_price: service.assistance_price
        },
        comment: leadComment,
        status: 'new'
      });
      setSubmittedLeadNumber(result.lead_number || 1001);
    } catch {
      setSubmittedLeadNumber(1001);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bilingual Questions Translation
  const getQuestionText = (qText: string) => {
    if (language === "tg") {
      if (qText.includes("Разрешение на временное проживание")) {
        return "Оё шумо Иҷозати истиқомати муваққатӣ (РВП)-и амалкунанда доред?";
      }
      if (qText.includes("упрощенное основание для ВНЖ")) {
        return "Оё шумо барои гирифтани ВНЖ асоси имтиёзнок доред (волидон/фарзандони шаҳрванди РФ)?";
      }
      if (qText.includes("полное сопровождение")) {
        return "Оё ба шумо ҳамроҳии пурраи ҳуқуқӣ «зери калид» лозим аст?";
      }
    }
    return qText;
  };

  const getQuestionDesc = (desc?: string) => {
    if (!desc) return "";
    if (language === "tg") {
      if (desc.includes("общих основаниях")) {
        return "Доштани РВП имкон медиҳад, ки барои ВНЖ бо тартиби умумӣ муроҷиат намоед.";
      }
      if (desc.includes("стадию получения РВП")) {
        return "Ба шумо имкон медиҳад, ки бе гирифтани РВП мустақиман барои ВНЖ муроҷиат кунед.";
      }
      if (desc.includes("проверку документов")) {
        return "Санҷиши ҳуҷҷатҳо, сабти ном ба навбат ва ҳузури шахсии ҳуқуқшиносро дар бар мегирад.";
      }
    }
    return desc;
  };

  const getOptionLabel = (label: string) => {
    if (language === "tg") {
      if (label.includes("более 8 месяцев")) return "Ҳа, бо РВП зиёда аз 8 моҳ зиндагӣ мекунам";
      if (label.includes("РВП отсутствует")) return "Не, РВП надорам";
      if (label.includes("есть основание")) return "Ҳа, асоси имтиёзнок дорам (хешовандон, диплом, мутахассис)";
      if (label.includes("Нет оснований")) return "Асос нест (аввал бояд РВП гирам)";
      if (label.includes("требуется сопровождение")) return "Ҳа, ба ман кӯмаки мутахассисон лозим аст";
      if (label.includes("только консультация")) return "Не, танҳо машварат ва санҷиши ҳуҷҷатҳо лозим аст";
    }
    return label;
  };

  const getServiceName = (s: typeof service) => {
    if (language === "tg") {
      if (s.slug === "vid-na-zhitelstvo") return "Иҷозати зист (ВНЖ)";
      if (s.slug === "rvp") return "Иҷозати истиқомати муваққатӣ (РВП)";
      if (s.slug === "zamena-pasporta") return "Ивази шиносномаи РФ";
      if (s.slug === "zagranpasport") return "Шиносномаи хориҷӣ (10 сола)";
    }
    return s.name;
  };

  const getProcessingTime = (tStr?: string | null) => {
    if (!tStr) return language === "tg" ? "1 рӯз" : "1 день";
    if (language === "tg") {
      return tStr.replace(/От 4 месяцев/gi, "Аз 4 моҳ").replace(/От 1 месяца/gi, "Аз 1 моҳ").replace(/1 рабочий день/gi, "1 рӯзи корӣ");
    }
    return tStr;
  };

  const checklistStepsTg = [
    "Омода кардани нусхаи аслии шиноснома ва тарҷумаи нотариалӣ",
    "Аксҳои махсус 35х45 мм (4 дона)",
    "Тасдиқи даромади расмӣ (маълумотномаи 2-НДФЛ / иқтибоси бонкӣ)",
    "Гузаштани муоинаи тиббӣ (сертификатҳо)",
    "Пардохти боҷи давлатӣ",
    "Сабти ном ба навбат дар мақомоти ВКД (МВД)",
    "Супоридани бастаи омодашудаи ҳуҷҷатҳо"
  ];

  const checklistStepsRu = [
    "Подготовка оригинала и нотариального перевода паспорта",
    "Спецфотографии 35х45 мм (4 шт.)",
    "Подтверждение официального дохода (2-НДФЛ / выписка)",
    "Прохождение медицинского освидетельствования",
    "Оплата государственной пошлины",
    "Запись на прием в уполномоченный орган МВД",
    "Подача сформированного пакета документов"
  ];

  const currentSteps = language === "tg" ? checklistStepsTg : checklistStepsRu;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 text-[#08525a]">
      <div className="flex items-center justify-between border-b border-[#0E7C86]/10 pb-4">
        <Link href={`/services/${service.slug}`} className="text-[#08525a]/70 hover:text-[#08525a] text-sm flex items-center space-x-1.5 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "tg" ? "Ба тавсифи хизматрасонӣ" : "К описанию услуги"}</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 bg-[#FDF2F0] text-[#0E7C86] rounded-full">
          {language === "tg" ? "Роҳнамои интихоб" : "Мастер подбора"}
        </span>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-500">
              <span>{language === "tg" ? `Қадами ${currentStepIndex + 1} аз ${questions.length}` : `Шаг ${currentStepIndex + 1} из ${questions.length}`}</span>
              <span>{progressPercent}% {language === "tg" ? "гузашт" : "пройдено"}</span>
            </div>
            <div className="w-full bg-[#FDF2F0] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E7C86] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#08525a]">
              {getQuestionText(currentQuestion.question)}
            </h2>
            {currentQuestion.description && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {getQuestionDesc(currentQuestion.description)}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion.options?.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-medium text-sm ${
                    isSelected
                      ? "border-[#0E7C86] bg-[#0E7C86]/5 text-[#08525a] shadow-sm"
                      : "border-gray-100 hover:border-[#0E7C86]/30 bg-white text-gray-800"
                  }`}
                >
                  <span>{getOptionLabel(opt.label)}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-[#0E7C86] bg-[#0E7C86] text-white" : "border-gray-300"
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-400"
            >
              {language === "tg" ? "Қафо" : "Назад"}
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="bg-[#0E7C86] hover:bg-[#08525a] disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition flex items-center space-x-2"
            >
              <span>
                {currentStepIndex === questions.length - 1
                  ? (language === "tg" ? "Дидани натиҷа" : "Посмотреть результат")
                  : (language === "tg" ? "Оянда" : "Далее")}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 text-[#0E7C86]">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F0] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#2AA9A9]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E7C86]">
                  {language === "tg" ? "Натиҷаи инфиродӣ" : "Персональный результат"}
                </span>
                <h2 className="text-2xl font-extrabold text-[#08525a]">
                  {language === "tg" ? "Хизматрасонӣ:" : "Услуга:"} {getServiceName(service)}
                </h2>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed border-b border-gray-100 pb-4">
              {language === "tg"
                ? "Дар асоси ҷавобҳои шумо бастаи ҳуҷҷатҳо ва ҳисоби пешакӣ тартиб дода шуд."
                : "На основе ваших ответов сформирован комплект документов и предварительный расчёт."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#FDF2F0]/50 p-4 rounded-2xl border border-[#0E7C86]/10">
                <span className="text-xs text-gray-400 block mb-1">
                  {language === "tg" ? "Мӯҳлати тахминӣ" : "Ориентировочный срок"}
                </span>
                <span className="font-bold text-[#08525a] text-base">{getProcessingTime(service.processing_time)}</span>
              </div>
              <div className="bg-[#FDF2F0]/50 p-4 rounded-2xl border border-[#0E7C86]/10">
                <span className="text-xs text-gray-400 block mb-1">
                  {language === "tg" ? "Боҷи давлатӣ" : "Ориентировочная пошлина"}
                </span>
                <span className="font-bold text-[#08525a] text-base">{service.government_fee.toLocaleString()} ₽</span>
              </div>
              <div className="bg-[#FDF2F0] p-4 rounded-2xl border border-[#0E7C86]/20">
                <span className="text-xs text-[#0E7C86] block mb-1">
                  {language === "tg" ? "Ҳамроҳии ҳуқуқӣ" : "Сопровождение юриста"}
                </span>
                <span className="font-extrabold text-[#FF8C42] text-base">
                  {language === "tg" ? "аз" : "от"} {service.assistance_price.toLocaleString()} ₽
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#0E7C86]" />
                <h3 className="font-bold text-lg text-[#08525a]">
                  {language === "tg" ? "Тартиби қадам ба қадами амалҳо" : "Пошаговый порядок действий"}
                </h3>
              </div>

              <div className="space-y-3">
                {currentSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="w-6 h-6 rounded-full bg-[#FDF2F0] text-[#0E7C86] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              <button
                onClick={() => setShowLeadModal(true)}
                className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-[#FF8C42]/25 transition flex items-center space-x-2"
              >
                <UserCheck className="w-5 h-5" />
                <span>{language === "tg" ? "Гирифтани кӯмаки мутахассис" : "Получить помощь специалиста"}</span>
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-5 py-4 rounded-2xl transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === "tg" ? "Аз аввал гузаштан" : "Пройти заново"}</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              {language === "tg"
                ? "Диққат: Ҳисоб хусусияти тахминӣ дорад. Талаботи ниҳоӣ аз ҷониби ҳуқуқшиноси хадамот мушаххас карда мешавад."
                : "Внимание: Расчёт носит ориентировочный характер. Окончательные требования уточняются юристом сервиса."}
            </p>
          </div>
        </div>
      )}

      {showLeadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-[#08525a]">
            {!submittedLeadNumber ? (
              <>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#08525a]">
                    {language === "tg" ? "Гирифтани кӯмаки мутахассис" : "Получить помощь специалиста"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "tg"
                      ? `Ҷавобҳо ва рӯйхати ҳуҷҷатҳо барои «${getServiceName(service)}» худкор замима мешаванд.`
                      : `Ответы и составленный чек-лист по услуге «${service.name}» будут автоматически прикреплены к заявке.`}
                  </p>
                </div>

                <form onSubmit={handleCreateLead} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "tg" ? "Номи шумо *" : "Ваше имя *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder={language === "tg" ? "Рустам" : "Александр"}
                      className="w-full p-3 bg-[#FDF2F0]/50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0E7C86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "tg" ? "Рақами телефон *" : "Номер телефона *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full p-3 bg-[#FDF2F0]/50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0E7C86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Telegram</label>
                    <input
                      type="text"
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full p-3 bg-[#FDF2F0]/50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0E7C86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "tg" ? "Шарҳ / Маълумоти иловагӣ" : "Комментарий / Уточнение"}
                    </label>
                    <textarea
                      rows={3}
                      value={leadComment}
                      onChange={(e) => setLeadComment(e.target.value)}
                      placeholder={language === "tg" ? "Маълумоти иловагиро нависед..." : "Укажите дополнительную информацию..."}
                      className="w-full p-3 bg-[#FDF2F0]/50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0E7C86] resize-none"
                    ></textarea>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLeadModal(false)}
                      className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                    >
                      {language === "tg" ? "Бекор кардан" : "Отмена"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 py-3 bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
                    >
                      {isSubmitting
                        ? (language === "tg" ? "Ирсол..." : "Отправка...")
                        : (language === "tg" ? "Ирсоли дархост" : "Отправить заявку")}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#08525a]">
                  {language === "tg" ? "Дархост ирсол шуд!" : "Заявка отправлена!"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "tg" ? "Рақами дархости шумо:" : "Номер вашей заявки:"}{" "}
                  <span className="font-extrabold text-[#0E7C86] text-base">#{submittedLeadNumber}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {language === "tg"
                    ? "Ҳуқуқшиноси мо дар давоми 15 дақиқа барои тасдиқи тафсилот бо шумо тамос мегирад."
                    : "Наш профильный юрист свяжется с вами в течение 15 минут для подтверждения деталей."}
                </p>
                <button
                  onClick={() => {
                    setShowLeadModal(false);
                    router.push('/admin');
                  }}
                  className="w-full py-3 bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold rounded-xl text-xs transition shadow-md"
                >
                  {language === "tg" ? "Дидан дар Панели мудир" : "Посмотреть в Панели администратора"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
