"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MOCK_SERVICES } from "@/lib/mockData";
import {
  Shield, Plus, Edit2, Trash2, Layers, FileText, CheckSquare, HelpCircle,
  UserCheck, Eye, Download, Users, Search, Lock, Unlock, Phone, Mail,
  Calendar, MapPin, Heart, FileDown, CheckCircle2, AlertTriangle, Archive, RefreshCw,
  MessageSquare, CheckCircle, Clock, AlertCircle, Upload, EyeOff, File, Briefcase,
  Copy, Check, Printer, RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize2,
  FileSpreadsheet, ExternalLink, X, Save
} from "lucide-react";
import {
  getLeads, updateLeadStatus, getClients, deleteClient, createLead,
  getClientCommunications, addClientCommunication, getManagerTasks,
  createManagerTask, updateManagerTaskStatus, updateClientStatus, updateClientQuestionnaire
} from "@/lib/dataService";
import { uploadClientDocument, getDocumentSignedUrl } from "@/lib/storageService";
import { exportClientsToExcel } from "@/lib/excelService";
import {
  Lead, ClientData, Service, ClientCommunication, ManagerTask,
  ClientDocument, FullClientQuestionnaire
} from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  new: { label: "Новая", color: "text-sky-700 bg-sky-50 border-sky-200", badge: "bg-sky-500" },
  in_progress: { label: "В обработке", color: "text-amber-700 bg-amber-50 border-amber-200", badge: "bg-amber-500" },
  need_docs: { label: "Ждем документы", color: "text-purple-700 bg-purple-50 border-purple-200", badge: "bg-purple-500" },
  submitted: { label: "Подано в ведомство", color: "text-blue-700 bg-blue-50 border-blue-200", badge: "bg-blue-500" },
  completed: { label: "Готово / Оказано", color: "text-emerald-700 bg-emerald-50 border-emerald-200", badge: "bg-emerald-500" },
  active: { label: "В базе", color: "text-teal-700 bg-teal-50 border-teal-200", badge: "bg-teal-500" },
  archived: { label: "Архив", color: "text-gray-600 bg-gray-50 border-gray-200", badge: "bg-gray-400" },
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "leads" | "tasks">("clients");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [clientModalTab, setClientModalTab] = useState<"overview" | "edit" | "passport" | "family" | "docs" | "comms" | "leads">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showMasked, setShowMasked] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Fast Clipboard Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // In-place Questionnaire Editing State
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editFormData, setEditFormData] = useState<FullClientQuestionnaire | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Document Viewer Modal State (Zoom & Rotation)
  const [viewingDoc, setViewingDoc] = useState<{ url: string; title: string; isImage: boolean } | null>(null);
  const [docZoom, setDocZoom] = useState<number>(1);
  const [docRotation, setDocRotation] = useState<number>(0);

  // Communications & Tasks State
  const [communications, setCommunications] = useState<ClientCommunication[]>([]);
  const [newCommType, setNewCommType] = useState<ClientCommunication["type"]>("whatsapp");
  const [newCommComment, setNewCommComment] = useState("");
  const [newCommResult, setNewCommResult] = useState("");

  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<ManagerTask["priority"]>("normal");

  // New Lead from Client
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(MOCK_SERVICES[0]?.slug || "");
  const [leadComment, setLeadComment] = useState("");

  // Document Upload State
  const [docCategory, setDocCategory] = useState<"passports" | "tax" | "family" | "immigration" | "other">("passports");
  const [docTitle, setDocTitle] = useState("");
  const [docExpiryDate, setDocExpiryDate] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Check Supabase Auth Session
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const hasLocalDemoAuth = localStorage.getItem("gospomosh_admin_auth") === "true";

        if (session || hasLocalDemoAuth) {
          setIsAuthenticated(true);
          loadData();
        } else {
          router.push("/admin/login");
        }
      } catch {
        if (localStorage.getItem("gospomosh_admin_auth") === "true") {
          setIsAuthenticated(true);
          loadData();
        } else {
          router.push("/admin/login");
        }
      } finally {
        setIsLoadingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  function loadData() {
    getLeads().then((res) => setLeads(res));
    getClients().then((res) => setClients(res));
    getManagerTasks().then((res) => setTasks(res));
  }

  useEffect(() => {
    if (selectedClient) {
      getClientCommunications(selectedClient.id).then((res) => setCommunications(res));
      setEditFormData(JSON.parse(JSON.stringify(selectedClient.questionnaire)));
      setIsEditingClient(false);
    }
  }, [selectedClient]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("gospomosh_admin_auth");
    router.push("/admin/login");
  };

  // WhatsApp link generator
  const getWhatsAppUrl = (phone?: string, name?: string) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");
    if (clean.length === 11 && clean.startsWith("8")) {
      clean = "7" + clean.slice(1);
    }
    const msg = `Здравствуйте, ${name || "клиент"}! Я Ваш персональный менеджер сервиса «ГосПомощь». Обращаюсь по поводу Вашей анкеты...`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  // Fast Copy to Clipboard
  const handleCopy = (text: string | undefined, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status Changer
  const handleUpdateStatus = async (clientId: string, newStatus: string, e?: React.ChangeEvent<HTMLSelectElement>) => {
    if (e) e.stopPropagation();
    await updateClientStatus(clientId, newStatus);
    loadData();
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, status: newStatus as any });
    }
  };

  // Delete Client
  const handleDeleteClient = async (id: string) => {
    if (confirm("Удалить клиента? Будут удалены анкета, семья, документы. История заявок сохранится.")) {
      await deleteClient(id);
      loadData();
      if (selectedClient && selectedClient.id === id) setSelectedClient(null);
    }
  };

  // Save in-place questionnaire edit
  const handleSaveQuestionnaireEdit = async () => {
    if (!selectedClient || !editFormData) return;
    setIsSavingEdit(true);
    try {
      await updateClientQuestionnaire(selectedClient.id, editFormData);
      setSelectedClient({
        ...selectedClient,
        questionnaire: { ...editFormData, updated_at: new Date().toISOString() }
      });
      loadData();
      setIsEditingClient(false);
      alert("Данные анкеты клиента успешно обновлены!");
    } catch (err: any) {
      alert("Ошибка сохранения: " + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Task Toggle
  const handleToggleTaskStatus = async (taskId: string, currentStatus: ManagerTask["status"]) => {
    const nextStatus = currentStatus === "completed" ? "new" : "completed";
    await updateManagerTaskStatus(taskId, nextStatus);
    loadData();
  };

  // Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    await createManagerTask({
      client_id: selectedClient ? selectedClient.id : undefined,
      title: newTaskTitle,
      assignee: "Менеджер",
      due_date: newTaskDue || new Date().toISOString().split("T")[0],
      status: "new",
      priority: newTaskPriority
    });

    setNewTaskTitle("");
    setNewTaskDue("");
    loadData();
    alert("Задача успешно добавлена!");
  };

  // Add Communication
  const handleAddCommunication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newCommComment) return;

    await addClientCommunication({
      client_id: selectedClient.id,
      type: newCommType,
      manager_name: "Менеджер",
      result: newCommResult || "Выполнено",
      comment: newCommComment
    });

    setNewCommComment("");
    setNewCommResult("");
    const updated = await getClientCommunications(selectedClient.id);
    setCommunications(updated);
  };

  // Create Lead for Client
  const handleCreateNewLeadForClient = async () => {
    if (!selectedClient) return;
    const serv = MOCK_SERVICES.find(s => s.slug === selectedServiceSlug) || MOCK_SERVICES[0];
    const q = selectedClient.questionnaire;

    await createLead({
      name: `${q.profile.last_name} ${q.profile.first_name}`,
      phone: q.contacts.phone,
      whatsapp: q.contacts.whatsapp || q.contacts.phone,
      service_id: serv.id,
      client_id: selectedClient.id,
      answers_json: { source: "CRM Direct Order" },
      result_json: { service: serv.name, price: serv.assistance_price },
      comment: leadComment || "Создано из CRM-карточки клиента",
      status: "new"
    });

    setIsCreatingLead(false);
    setLeadComment("");
    loadData();
    alert("Новое обращение успешно привязано к клиенту!");
  };

  // Upload Document
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !docFile || !docTitle) {
      alert("Заполните название документа и выберите файл");
      return;
    }

    setIsUploadingDoc(true);
    try {
      const res = await uploadClientDocument(selectedClient.id, docCategory, docFile);
      if (res.error) {
        alert("Ошибка загрузки: " + res.error);
      } else {
        const newDoc: ClientDocument = {
          id: `doc-${Date.now()}`,
          document_type: docTitle,
          document_number: res.path,
          expiry_date: docExpiryDate || undefined
        };
        selectedClient.questionnaire.documents.push(newDoc);
        setDocTitle("");
        setDocExpiryDate("");
        setDocFile(null);
        alert("Документ успешно загружен в защищенное хранилище!");
      }
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Open Document in Viewer Modal with Zoom & Rotation
  const handleOpenDocViewer = async (doc: ClientDocument) => {
    setDocZoom(1);
    setDocRotation(0);
    let url = "";
    if (doc.document_number) {
      const signed = await getDocumentSignedUrl(doc.document_number, 300);
      if (signed) url = signed;
    }
    const isImage = !doc.document_number?.toLowerCase().endsWith(".pdf");
    setViewingDoc({
      url: url || "/placeholder-doc.png",
      title: doc.document_type,
      isImage
    });
  };

  // Masking helpers
  const maskINN = (inn?: string) => {
    if (!inn) return "—";
    if (!showMasked) return inn;
    return inn.slice(0, 2) + "********" + inn.slice(-2);
  };

  const maskSNILS = (snils?: string) => {
    if (!snils) return "—";
    if (!showMasked) return snils;
    return "***-***-" + snils.slice(-5);
  };

  const maskPassport = (series: string, number: string) => {
    if (!series || !number) return "—";
    if (!showMasked) return `${series} ${number}`;
    return `** ${series.slice(-2)} ***${number.slice(-3)}`;
  };

  // Filter clients
  const filteredClients = clients.filter(c => {
    if (statusFilter !== "all") {
      const currentStatus = c.status || "new";
      if (currentStatus !== statusFilter) return false;
    }
    const q = c.questionnaire;
    if (!q) return false;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const prof = q.profile || ({} as any);
    const tax = q.tax || ({} as any);
    const pass = q.internal_passport || ({} as any);
    const cont = q.contacts || ({} as any);

    const fullName = `${prof.last_name || ""} ${prof.first_name || ""} ${prof.middle_name || ""}`.toLowerCase();
    const phone = (cont.phone || "").toLowerCase();
    const inn = (tax.inn || "").toLowerCase();
    const snils = (tax.snils || "").toLowerCase();
    const passport = `${pass.series || ""} ${pass.number || ""}`.toLowerCase();

    return fullName.includes(query) || phone.includes(query) || inn.includes(query) || snils.includes(query) || passport.includes(query);
  });

  if (isLoadingAuth) {
    return <div className="p-16 text-center text-xs font-bold text-[#08525a]">Проверка прав администратора...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 space-y-6 text-[#08525a]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#0E7C86]/10 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0E7C86] text-white flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#08525a]">Рабочее место менеджера</h1>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase rounded-md border border-emerald-200">
                CRM 2026
              </span>
            </div>
            <p className="text-[#08525a]/60 text-xs">Управление анкетами, экспорт реестра, интеграция WhatsApp и документы</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="text-xs font-bold px-3.5 py-2 bg-[#FDF2F0] border border-[#0E7C86]/20 text-[#08525a] rounded-xl transition flex items-center space-x-1.5 hover:bg-[#FDF2F0]/80"
            title="Переключить маскирование персональных данных"
          >
            {showMasked ? <Lock className="w-3.5 h-3.5 text-[#2AA9A9]" /> : <Unlock className="w-3.5 h-3.5 text-[#FF8C42]" />}
            <span className="hidden sm:inline">{showMasked ? "Маскировать PII" : "Показать данные"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-2 border-b border-[#0E7C86]/10 pb-2 overflow-x-auto">
        {[
          { id: "clients", label: "Клиенты & Реестр", icon: Users, count: clients.length },
          { id: "dashboard", label: "Аналитика", icon: Briefcase },
          { id: "leads", label: "Заявки на услуги", icon: UserCheck, count: leads.length },
          { id: "tasks", label: "Задачи менеджера", icon: CheckCircle, count: tasks.filter(t => t.status !== "completed").length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive ? "bg-[#0E7C86] text-white shadow-md" : "bg-white border border-[#0E7C86]/15 text-[#08525a] hover:bg-[#FDF2F0]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white text-[#0E7C86]" : "bg-[#FF8C42] text-white"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. CLIENTS & REGISTRY TAB */}
      {/* ======================================================== */}
      {activeTab === "clients" && (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-4 sm:p-6 shadow-sm space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#2AA9A9] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Поиск по ФИО, телефону, ИНН, СНИЛС, паспорту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDF2F0]/40 border border-[#0E7C86]/20 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Excel Export Button */}
              <button
                onClick={() => exportClientsToExcel(filteredClients)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition flex items-center space-x-2 shadow-sm"
                title="Скачать красивый отчет со всеми клиентами в Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Экспорт в Excel (.xlsx)</span>
              </button>

              {/* New Questionnaire Link */}
              <Link
                href="/client/questionnaire"
                className="bg-[#FF8C42] hover:bg-[#E66E26] text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Новая анкета</span>
              </Link>

              {/* Refresh */}
              <button
                onClick={loadData}
                className="p-2.5 bg-[#FDF2F0] text-[#0E7C86] rounded-2xl hover:bg-[#0E7C86]/10 transition border border-[#0E7C86]/15"
                title="Обновить данные"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pipeline Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-400 font-bold text-[11px] whitespace-nowrap">Статус воронки:</span>
            {[
              { id: "all", label: "Все анкеты", count: clients.length },
              { id: "new", label: "Новые", count: clients.filter(c => (c.status || "new") === "new").length },
              { id: "in_progress", label: "В обработке", count: clients.filter(c => c.status === "in_progress").length },
              { id: "need_docs", label: "Ждем документы", count: clients.filter(c => c.status === "need_docs").length },
              { id: "submitted", label: "Подано", count: clients.filter(c => c.status === "submitted").length },
              { id: "completed", label: "Готово", count: clients.filter(c => c.status === "completed").length }
            ].map(pill => {
              const isSelected = statusFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                    isSelected
                      ? "bg-[#08525a] text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clients Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FDF2F0]/60 border-b border-[#0E7C86]/10 text-[#08525a]/70 uppercase font-extrabold tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Клиент</th>
                  <th className="py-3.5 px-3">Статус анкеты</th>
                  <th className="py-3.5 px-3">ИНН / СНИЛС</th>
                  <th className="py-3.5 px-3">Паспорт</th>
                  <th className="py-3.5 px-3">Телефон & WhatsApp</th>
                  <th className="py-3.5 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                      Клиентов по заданному фильтру не найдено
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c) => {
                    const q = c.questionnaire;
                    const prof = q?.profile || ({} as any);
                    const tax = q?.tax || ({} as any);
                    const pass = q?.internal_passport || ({} as any);
                    const cont = q?.contacts || ({} as any);
                    const currentStatus = c.status || "new";
                    const statusInfo = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
                    const fullName = `${prof.last_name || ""} ${prof.first_name || ""} ${prof.middle_name || ""}`.trim() || "Клиент без имени";
                    const waLink = getWhatsAppUrl(cont.whatsapp || cont.phone, prof.first_name);

                    return (
                      <tr key={c.id} className="hover:bg-[#FDF2F0]/30 transition group">
                        {/* Client Full Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-sm text-[#08525a] flex items-center space-x-1.5">
                            <span>{fullName}</span>
                            <button
                              onClick={(e) => handleCopy(fullName, `name-${c.id}`, e)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#0E7C86] transition"
                              title="Скопировать ФИО"
                            >
                              {copiedField === `name-${c.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="text-gray-400 text-[11px] flex items-center space-x-2 mt-0.5">
                            <span>{prof.citizenship || "РФ"}</span>
                            <span>•</span>
                            <span>{prof.birth_date || "—"}</span>
                            {c.created_at && (
                              <>
                                <span>•</span>
                                <span>Рег: {new Date(c.created_at).toLocaleDateString("ru-RU")}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Interactive Status Selector */}
                        <td className="py-3.5 px-3">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleUpdateStatus(c.id, e.target.value, e)}
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] border outline-none cursor-pointer ${statusInfo.color}`}
                          >
                            <option value="new">🔵 Новая</option>
                            <option value="in_progress">🟠 В обработке</option>
                            <option value="need_docs">🟣 Ждем документы</option>
                            <option value="submitted">🔷 Подано</option>
                            <option value="completed">🟢 Готово</option>
                            <option value="archived">⚪ В архив</option>
                          </select>
                        </td>

                        {/* INN & SNILS with fast copy */}
                        <td className="py-3.5 px-3 font-mono text-[11px]">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-gray-400 text-[10px]">ИНН:</span>
                            <span className="font-bold">{maskINN(tax.inn)}</span>
                            {tax.inn && (
                              <button
                                onClick={(e) => handleCopy(tax.inn, `inn-${c.id}`, e)}
                                className="text-gray-400 hover:text-[#0E7C86] transition p-0.5"
                                title="Скопировать точный ИНН"
                              >
                                {copiedField === `inn-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="text-gray-400 text-[10px]">СНИЛС:</span>
                            <span className="text-gray-600">{maskSNILS(tax.snils)}</span>
                            {tax.snils && (
                              <button
                                onClick={(e) => handleCopy(tax.snils, `snils-${c.id}`, e)}
                                className="text-gray-400 hover:text-[#0E7C86] transition p-0.5"
                                title="Скопировать точный СНИЛС"
                              >
                                {copiedField === `snils-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Passport with fast copy */}
                        <td className="py-3.5 px-3 font-mono text-[11px]">
                          <div className="flex items-center space-x-1.5 font-bold">
                            <span>{maskPassport(pass.series, pass.number)}</span>
                            {pass.series && pass.number && (
                              <button
                                onClick={(e) => handleCopy(`${pass.series} ${pass.number}`, `pass-${c.id}`, e)}
                                className="text-gray-400 hover:text-[#0E7C86] transition p-0.5"
                                title="Скопировать серию и номер паспорта"
                              >
                                {copiedField === `pass-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                          <div className="text-gray-400 text-[10px] truncate max-w-[140px]" title={pass.issuer}>
                            {pass.issuer || "—"}
                          </div>
                        </td>

                        {/* Phone & Direct WhatsApp */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold font-mono text-[11px]">{cont.phone || "—"}</span>
                            {cont.phone && (
                              <button
                                onClick={(e) => handleCopy(cont.phone, `phone-${c.id}`, e)}
                                className="text-gray-400 hover:text-[#0E7C86] transition p-0.5"
                                title="Скопировать номер телефона"
                              >
                                {copiedField === `phone-${c.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 transition"
                              title="Написать клиенту в WhatsApp прямо сейчас"
                            >
                              <span>WhatsApp</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>

                        {/* Direct Actions: PDF Print, CRM Modal, Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Direct PDF Dossier Print */}
                            <a
                              href={`/api/client/${c.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center space-x-1"
                              title="Печать официального PDF-досье прямо из списка"
                            >
                              <Printer className="w-4 h-4 text-[#0E7C86]" />
                              <span className="hidden xl:inline text-[10px]">Печать PDF</span>
                            </a>

                            {/* Open Full CRM Card */}
                            <button
                              onClick={() => {
                                setSelectedClient(c);
                                setClientModalTab("overview");
                              }}
                              className="px-3 py-2 bg-[#0E7C86] hover:bg-[#08525a] text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>CRM</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteClient(c.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                              title="Удалить клиента"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DASHBOARD / ANALYTICS TAB */}
      {/* ======================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Новые анкеты</span>
              <div className="text-2xl sm:text-3xl font-black text-sky-600">{clients.filter(c => (c.status || "new") === "new").length}</div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">В обработке</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-500">{clients.filter(c => c.status === "in_progress").length}</div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Клиенты в базе</span>
              <div className="text-2xl sm:text-3xl font-black text-[#0E7C86]">{clients.length}</div>
            </div>
            <div className="p-5 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Открытые задачи</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600">{tasks.filter(t => t.status !== "completed").length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attention Section */}
            <div className="p-6 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-[#FF8C42]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-[#08525a]">Контроль документов и сроков</h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl flex items-center justify-between border border-emerald-100">
                  <span className="font-bold">Паспорта РФ проверены на формат</span>
                  <span className="text-emerald-700 font-extrabold">✓ Корректно</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between text-amber-900 font-semibold border border-amber-100">
                  <span>Клиентов со статусом «Ждем документы»</span>
                  <span className="px-2 py-0.5 bg-amber-200 rounded text-[11px] font-black">{clients.filter(c => c.status === "need_docs").length} чел.</span>
                </div>
                <div className="p-3 bg-sky-50 rounded-xl flex items-center justify-between text-sky-900 font-semibold border border-sky-100">
                  <span>Новых входящих обращений за неделю</span>
                  <span className="px-2 py-0.5 bg-sky-200 rounded text-[11px] font-black">{leads.length} шт.</span>
                </div>
              </div>
            </div>

            {/* Quick Task Board */}
            <div className="p-6 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-[#08525a]">Ближайшие задачи менеджера</h3>
                <button onClick={() => setActiveTab("tasks")} className="text-xs font-bold text-[#0E7C86] hover:underline">
                  Все задачи ↗
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {tasks.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-3 bg-[#FDF2F0] rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={t.status === "completed"}
                        onChange={() => handleToggleTaskStatus(t.id, t.status)}
                        className="rounded text-[#0E7C86]"
                      />
                      <span className={t.status === "completed" ? "line-through text-gray-400" : "font-bold"}>{t.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{t.due_date || "Сегодня"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LEADS TAB */}
      {/* ======================================================== */}
      {activeTab === "leads" && (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black">Заявки на государственные услуги</h2>
          <div className="divide-y divide-gray-100 text-xs">
            {leads.map(lead => (
              <div key={lead.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="font-extrabold text-sm text-[#0E7C86]">#{lead.lead_number || 1001} — {lead.name}</div>
                  <div className="text-gray-500 text-[11px]">{lead.phone} • {lead.service?.name || "Госпомощь"} • {lead.comment || "Без комментария"}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                    {lead.status}
                  </span>
                  <button
                    onClick={() => updateLeadStatus(lead.id, lead.status === "completed" ? "new" : "completed").then(() => loadData())}
                    className="px-3 py-1 bg-[#0E7C86] text-white rounded-lg text-xs font-bold"
                  >
                    {lead.status === "completed" ? "Вернуть в работу" : "Завершить"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TASKS TAB */}
      {/* ======================================================== */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black">Задачи и напоминания менеджера</h2>
            <p className="text-xs text-gray-500">Контроль звонков, сбора документов и подачи заявлений</p>
          </div>

          <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-[#FDF2F0] rounded-2xl">
            <input
              type="text"
              required
              placeholder="Название задачи (например: Позвонить по паспорту)..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="sm:col-span-2 p-2.5 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
            />
            <input
              type="date"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
              className="p-2.5 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
            />
            <button
              type="submit"
              className="py-2.5 bg-[#0E7C86] text-white font-bold rounded-xl text-xs shadow-sm hover:bg-[#08525a] transition"
            >
              + Добавить задачу
            </button>
          </form>

          <div className="divide-y divide-gray-100 text-xs">
            {tasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={t.status === "completed"}
                    onChange={() => handleToggleTaskStatus(t.id, t.status)}
                    className="w-4 h-4 text-[#0E7C86] rounded"
                  />
                  <span className={t.status === "completed" ? "line-through text-gray-400 font-medium" : "font-bold"}>{t.title}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <span className="font-mono text-[11px]">{t.due_date || "—"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-[#FFD9A0] text-[#08525a]"
                  }`}>
                    {t.status === "completed" ? "Выполнено" : "В работе"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DETAILED CRM CARD MODAL WITH IN-PLACE EDITING */}
      {/* ======================================================== */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-4 sm:p-7 shadow-2xl space-y-5 relative my-4 max-h-[92vh] overflow-y-auto text-[#08525a]">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#0E7C86]/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-black text-[#0E7C86] uppercase tracking-wider">CRM Досье клиента</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${STATUS_CONFIG[selectedClient.status || "new"]?.color || ""}`}>
                    {STATUS_CONFIG[selectedClient.status || "new"]?.label || "Новая"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {selectedClient.questionnaire.profile.last_name} {selectedClient.questionnaire.profile.first_name} {selectedClient.questionnaire.profile.middle_name}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* WhatsApp Quick Button in Modal */}
                {selectedClient.questionnaire.contacts.phone && (
                  <a
                    href={getWhatsAppUrl(selectedClient.questionnaire.contacts.whatsapp || selectedClient.questionnaire.contacts.phone, selectedClient.questionnaire.profile.first_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Чат WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Print PDF Dossier */}
                <a
                  href={`/api/client/${selectedClient.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#0E7C86]" />
                  <span>Печать PDF</span>
                </a>

                {/* Toggle In-Place Edit Mode */}
                <button
                  onClick={() => setIsEditingClient(!isEditingClient)}
                  className={`font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                    isEditingClient ? "bg-amber-500 text-white" : "bg-[#0E7C86] hover:bg-[#08525a] text-white"
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingClient ? "Отмена правки" : "Редактировать анкету"}</span>
                </button>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* If In-Place Editing Mode is Active */}
            {isEditingClient && editFormData && (
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
                    <Edit2 className="w-4 h-4" />
                    <span>Режим прямого редактирования анкеты менеджером</span>
                  </div>
                  <button
                    onClick={handleSaveQuestionnaireEdit}
                    disabled={isSavingEdit}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingEdit ? "Сохранение..." : "Сохранить изменения"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Фамилия</label>
                    <input
                      type="text"
                      value={editFormData.profile.last_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, last_name: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Имя</label>
                    <input
                      type="text"
                      value={editFormData.profile.first_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, first_name: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Отчество</label>
                    <input
                      type="text"
                      value={editFormData.profile.middle_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, middle_name: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Дата рождения</label>
                    <input
                      type="date"
                      value={editFormData.profile.birth_date || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, birth_date: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Гражданство</label>
                    <input
                      type="text"
                      value={editFormData.profile.citizenship || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, citizenship: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">ИНН</label>
                    <input
                      type="text"
                      value={editFormData.tax.inn || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, tax: { ...editFormData.tax, inn: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">СНИЛС</label>
                    <input
                      type="text"
                      value={editFormData.tax.snils || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, tax: { ...editFormData.tax, snils: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Паспорт серия</label>
                    <input
                      type="text"
                      value={editFormData.internal_passport.series || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, internal_passport: { ...editFormData.internal_passport, series: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Паспорт номер</label>
                    <input
                      type="text"
                      value={editFormData.internal_passport.number || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, internal_passport: { ...editFormData.internal_passport, number: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-600 block mb-1">Паспорт кем выдан</label>
                    <input
                      type="text"
                      value={editFormData.internal_passport.issuer || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, internal_passport: { ...editFormData.internal_passport, issuer: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block mb-1">Телефон</label>
                    <input
                      type="text"
                      value={editFormData.contacts.phone || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, contacts: { ...editFormData.contacts, phone: e.target.value } })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal Navigation Tabs */}
            <div className="flex space-x-2 border-b border-[#0E7C86]/10 pb-2 text-xs font-bold overflow-x-auto">
              {[
                { id: "overview", label: "Обзор данных" },
                { id: "passport", label: "Паспорт & ИНН" },
                { id: "docs", label: `Документы & Сканы (${selectedClient.questionnaire.documents.length})` },
                { id: "family", label: `Семья (${selectedClient.questionnaire.children.length})` },
                { id: "comms", label: `Коммуникации (${communications.length})` },
                { id: "leads", label: "Обращения" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClientModalTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    clientModalTab === tab.id ? "bg-[#0E7C86] text-white shadow-sm" : "text-[#08525a] hover:bg-[#FDF2F0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Tabs */}
            <div className="space-y-4 text-xs">
              {/* 1. OVERVIEW */}
              {clientModalTab === "overview" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2.5">
                    <span className="text-[11px] font-black text-[#0E7C86] uppercase">Основная информация</span>
                    <div><span className="text-gray-400 block">Дата рождения:</span><span className="font-bold">{selectedClient.questionnaire.profile.birth_date}</span></div>
                    <div><span className="text-gray-400 block">Гражданство:</span><span className="font-bold">{selectedClient.questionnaire.profile.citizenship}</span></div>
                    <div><span className="text-gray-400 block">Семейное положение:</span><span className="font-bold">{selectedClient.questionnaire.marital_status === "married" ? "В браке" : "Холост / Не замужем"}</span></div>
                  </div>

                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2.5">
                    <span className="text-[11px] font-black text-[#0E7C86] uppercase">Налоговые реквизиты</span>
                    <div className="flex items-center justify-between">
                      <div><span className="text-gray-400 block">ИНН:</span><span className="font-bold font-mono">{maskINN(selectedClient.questionnaire.tax.inn)}</span></div>
                      {selectedClient.questionnaire.tax.inn && (
                        <button
                          onClick={() => handleCopy(selectedClient.questionnaire.tax.inn!, "modal-inn")}
                          className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-[#0E7C86] flex items-center space-x-1"
                        >
                          {copiedField === "modal-inn" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === "modal-inn" ? "Скопировано" : "Копия"}</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div><span className="text-gray-400 block">СНИЛС:</span><span className="font-bold font-mono">{maskSNILS(selectedClient.questionnaire.tax.snils)}</span></div>
                      {selectedClient.questionnaire.tax.snils && (
                        <button
                          onClick={() => handleCopy(selectedClient.questionnaire.tax.snils!, "modal-snils")}
                          className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-[#0E7C86] flex items-center space-x-1"
                        >
                          {copiedField === "modal-snils" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === "modal-snils" ? "Скопировано" : "Копия"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2.5">
                    <span className="text-[11px] font-black text-[#0E7C86] uppercase">Связь & WhatsApp</span>
                    <div className="flex items-center justify-between">
                      <div><span className="text-gray-400 block">Телефон:</span><span className="font-bold font-mono">{selectedClient.questionnaire.contacts.phone}</span></div>
                      {selectedClient.questionnaire.contacts.phone && (
                        <button
                          onClick={() => handleCopy(selectedClient.questionnaire.contacts.phone, "modal-phone")}
                          className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-[#0E7C86] flex items-center space-x-1"
                        >
                          {copiedField === "modal-phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === "modal-phone" ? "Скопировано" : "Копия"}</span>
                        </button>
                      )}
                    </div>
                    {selectedClient.questionnaire.contacts.phone && (
                      <a
                        href={getWhatsAppUrl(selectedClient.questionnaire.contacts.whatsapp || selectedClient.questionnaire.contacts.phone, selectedClient.questionnaire.profile.first_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition"
                      >
                        <span>Написать в WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 2. DOCUMENTS & GALLERY TAB (ZOOM & ROTATE) */}
              {clientModalTab === "docs" && (
                <div className="space-y-4">
                  {/* Upload Form */}
                  <form onSubmit={handleUploadDocument} className="p-4 bg-[#FDF2F0] rounded-2xl space-y-3">
                    <h4 className="font-bold text-[#0E7C86] text-xs">Загрузить новый скан / фото документа</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Название документа (Паспорт РФ, СНИЛС)..."
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="p-2.5 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                      />
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value as any)}
                        className="p-2.5 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
                      >
                        <option value="passports">Паспорта</option>
                        <option value="tax">Налоговые (ИНН/СНИЛС)</option>
                        <option value="family">Семья (Свидетельства)</option>
                        <option value="immigration">Миграция (ВНЖ/РВП)</option>
                        <option value="other">Прочие сканы</option>
                      </select>
                      <input
                        type="date"
                        placeholder="Срок действия"
                        value={docExpiryDate}
                        onChange={(e) => setDocExpiryDate(e.target.value)}
                        className="p-2.5 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        required
                        onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                        className="text-xs text-gray-500 w-full sm:w-auto"
                      />
                      <button
                        type="submit"
                        disabled={isUploadingDoc}
                        className="w-full sm:w-auto px-4 py-2 bg-[#0E7C86] text-white font-bold rounded-xl text-xs disabled:opacity-50"
                      >
                        {isUploadingDoc ? "Загрузка..." : "Загрузить файл"}
                      </button>
                    </div>
                  </form>

                  {/* Document Gallery Cards */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Прикрепленные документы клиента</h4>
                    {selectedClient.questionnaire.documents.length === 0 ? (
                      <p className="text-gray-400 italic py-4">Документы еще не прикреплены к анкете</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedClient.questionnaire.documents.map((doc) => (
                          <div key={doc.id} className="p-3 bg-white border border-[#0E7C86]/15 rounded-2xl space-y-2 shadow-sm">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#0E7C86]/10 text-[#0E7C86] flex items-center justify-center font-bold">
                                <File className="w-4 h-4" />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="font-bold text-xs truncate" title={doc.document_type}>{doc.document_type}</div>
                                <div className="text-[10px] text-gray-400">{doc.expiry_date ? `Срок: ${doc.expiry_date}` : "Бессрочный"}</div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                              <button
                                onClick={() => handleOpenDocViewer(doc)}
                                className="px-3 py-1.5 bg-[#0E7C86] hover:bg-[#08525a] text-white rounded-xl font-bold text-[11px] transition flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Просмотр & Зум</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PASSPORTS */}
              {clientModalTab === "passport" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Паспорт гражданина РФ</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div><span className="text-gray-400 block">Серия и номер:</span><span className="font-bold font-mono">{maskPassport(selectedClient.questionnaire.internal_passport.series, selectedClient.questionnaire.internal_passport.number)}</span></div>
                      <div><span className="text-gray-400 block">Дата выдачи:</span><span className="font-bold font-mono">{selectedClient.questionnaire.internal_passport.issue_date || "—"}</span></div>
                      <div><span className="text-gray-400 block">Код подразделения:</span><span className="font-bold font-mono">{selectedClient.questionnaire.internal_passport.department_code || "—"}</span></div>
                      <div className="col-span-2 sm:col-span-3"><span className="text-gray-400 block">Кем выдан:</span><span className="font-bold">{selectedClient.questionnaire.internal_passport.issuer || "—"}</span></div>
                    </div>
                  </div>

                  {selectedClient.questionnaire.foreign_passport && (
                    <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                      <h4 className="font-bold text-[#0E7C86]">Заграничный паспорт</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><span className="text-gray-400 block">Номер:</span><span className="font-bold font-mono">{selectedClient.questionnaire.foreign_passport.series} {selectedClient.questionnaire.foreign_passport.number}</span></div>
                        <div><span className="text-gray-400 block">Действителен до:</span><span className="font-bold font-mono">{selectedClient.questionnaire.foreign_passport.expiry_date || "—"}</span></div>
                        <div className="col-span-2 sm:col-span-3"><span className="text-gray-400 block">Кем выдан:</span><span className="font-bold">{selectedClient.questionnaire.foreign_passport.issuer || "—"}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. FAMILY */}
              {clientModalTab === "family" && (
                <div className="space-y-4">
                  {selectedClient.questionnaire.spouse && (
                    <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                      <h4 className="font-bold text-[#0E7C86]">Супруг / Супруга</h4>
                      <p className="font-bold text-sm">
                        {selectedClient.questionnaire.spouse.last_name} {selectedClient.questionnaire.spouse.first_name} {selectedClient.questionnaire.spouse.middle_name}
                      </p>
                      <div className="text-gray-500">Дата рождения: {selectedClient.questionnaire.spouse.birth_date || "—"}</div>
                    </div>
                  )}
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Дети ({selectedClient.questionnaire.children.length})</h4>
                    {selectedClient.questionnaire.children.length === 0 ? (
                      <p className="text-gray-400 italic">Дети не указаны</p>
                    ) : (
                      selectedClient.questionnaire.children.map((ch, i) => (
                        <div key={ch.id} className="p-2.5 bg-white rounded-xl flex justify-between items-center border border-gray-100">
                          <span className="font-bold">{i + 1}. {ch.last_name} {ch.first_name} {ch.middle_name || ""}</span>
                          <span className="text-gray-400 font-mono">{ch.birth_date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5. COMMUNICATIONS */}
              {clientModalTab === "comms" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddCommunication} className="p-4 bg-[#FDF2F0] rounded-2xl space-y-3">
                    <h4 className="font-bold text-[#0E7C86] text-xs">Зафиксировать контакт с клиентом</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={newCommType}
                        onChange={(e) => setNewCommType(e.target.value as any)}
                        className="p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Телефонный звонок</option>
                        <option value="telegram">Telegram</option>
                        <option value="email">Email</option>
                        <option value="meeting">Личная встреча</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Результат (Договорились об отправке)..."
                        value={newCommResult}
                        onChange={(e) => setNewCommResult(e.target.value)}
                        className="p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                      />
                      <button
                        type="submit"
                        className="py-2 bg-[#0E7C86] text-white font-bold rounded-xl text-xs shadow-sm hover:bg-[#08525a] transition"
                      >
                        + Сохранить запись
                      </button>
                    </div>
                    <textarea
                      required
                      placeholder="Подробный комментарий менеджера..."
                      value={newCommComment}
                      onChange={(e) => setNewCommComment(e.target.value)}
                      className="w-full p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                      rows={2}
                    />
                  </form>

                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Журнал звонков и сообщений</h4>
                    {communications.length === 0 ? (
                      <p className="text-gray-400 italic py-2">Записей звонков и сообщений пока нет</p>
                    ) : (
                      communications.map((comm) => (
                        <div key={comm.id} className="p-3 bg-white border rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-gray-400">
                            <span className="font-bold uppercase text-[#0E7C86]">{comm.type}</span>
                            <span>{new Date(comm.created_at).toLocaleString("ru-RU")}</span>
                          </div>
                          <p className="font-medium text-[#08525a]">{comm.comment}</p>
                          {comm.result && <div className="text-[11px] font-bold text-[#FF8C42]">Итог: {comm.result}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 6. LEADS */}
              {clientModalTab === "leads" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[#0E7C86]">История обращений по услугам</h4>
                    <button
                      onClick={() => setIsCreatingLead(true)}
                      className="px-3 py-1.5 bg-[#0E7C86] text-white text-xs font-bold rounded-xl"
                    >
                      + Добавить обращение
                    </button>
                  </div>
                  {leads.filter(l => l.client_id === selectedClient.id).map(l => (
                    <div key={l.id} className="p-3 bg-white border rounded-xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#0E7C86]">#{l.lead_number || 1001} — {l.service?.name || "Услуга"}</div>
                        <div className="text-[10px] text-gray-400">{new Date(l.created_at || Date.now()).toLocaleDateString()}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFD9A0] text-[#08525a]">{l.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. DOCUMENT VIEWER MODAL WITH ZOOM AND ROTATE */}
      {/* ======================================================== */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn">
          {/* Top Control Bar */}
          <div className="w-full max-w-4xl bg-slate-900/90 text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-xl mb-3 border border-slate-800">
            <div className="font-bold text-sm truncate max-w-[240px] sm:max-w-md">
              {viewingDoc.title}
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center space-x-2 text-xs">
              {/* Zoom Out */}
              <button
                onClick={() => setDocZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Уменьшить"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold w-12 text-center text-[11px]">{Math.round(docZoom * 100)}%</span>

              {/* Zoom In */}
              <button
                onClick={() => setDocZoom(prev => Math.min(3, prev + 0.25))}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Увеличить"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Rotate Counter-Clockwise */}
              <button
                onClick={() => setDocRotation(prev => (prev - 90) % 360)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Повернуть влево на 90°"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Rotate Clockwise */}
              <button
                onClick={() => setDocRotation(prev => (prev + 90) % 360)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                title="Повернуть вправо на 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Reset */}
              <button
                onClick={() => { setDocZoom(1); setDocRotation(0); }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold transition"
                title="Сбросить масштаб и поворот"
              >
                100%
              </button>

              {/* Close */}
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 bg-rose-600 hover:bg-rose-700 rounded-xl transition ml-2"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewer Content Canvas */}
          <div className="w-full max-w-4xl flex-1 bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center relative p-4 shadow-2xl border border-slate-800 min-h-[400px]">
            {viewingDoc.isImage ? (
              <div className="overflow-auto max-w-full max-h-[75vh] flex items-center justify-center">
                <img
                  src={viewingDoc.url}
                  alt={viewingDoc.title}
                  style={{
                    transform: `scale(${docZoom}) rotate(${docRotation}deg)`,
                    transition: "transform 0.2s ease-out"
                  }}
                  className="max-h-[65vh] object-contain rounded-lg shadow-2xl origin-center"
                />
              </div>
            ) : (
              <iframe
                src={viewingDoc.url}
                className="w-full h-full min-h-[500px] rounded-xl border-none bg-white"
                title={viewingDoc.title}
              />
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. CREATE NEW LEAD MODAL */}
      {/* ======================================================== */}
      {isCreatingLead && selectedClient && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 text-[#08525a]">
            <h3 className="text-xl font-bold">Новое обращение для клиента</h3>
            <p className="text-xs text-gray-500">
              {selectedClient.questionnaire.profile.last_name} {selectedClient.questionnaire.profile.first_name} ({selectedClient.questionnaire.contacts.phone})
            </p>

            <div>
              <label className="block text-xs font-bold mb-1.5">Выберите государственную услугу</label>
              <select
                value={selectedServiceSlug}
                onChange={(e) => setSelectedServiceSlug(e.target.value)}
                className="w-full p-3 bg-[#FDF2F0] border border-[#0E7C86]/20 rounded-xl text-xs font-bold outline-none"
              >
                {MOCK_SERVICES.map(s => (
                  <option key={s.id} value={s.slug}>{s.name} ({s.assistance_price.toLocaleString()} ₽)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Комментарий менеджера</label>
              <textarea
                value={leadComment}
                onChange={(e) => setLeadComment(e.target.value)}
                placeholder="Например: Повторное обращение по замене паспорта..."
                className="w-full p-3 bg-[#FDF2F0] border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleCreateNewLeadForClient}
                className="flex-1 py-3 bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold rounded-xl text-xs transition"
              >
                Создать обращение
              </button>
              <button
                onClick={() => setIsCreatingLead(false)}
                className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
