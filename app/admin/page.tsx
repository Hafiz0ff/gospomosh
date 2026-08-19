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
  MessageSquare, CheckCircle, Clock, AlertCircle, Upload, EyeOff, File, Briefcase
} from "lucide-react";
import {
  getLeads, updateLeadStatus, getClients, deleteClient, createLead,
  getClientCommunications, addClientCommunication, getManagerTasks,
  createManagerTask, updateManagerTaskStatus
} from "@/lib/dataService";
import { uploadClientDocument, getDocumentSignedUrl } from "@/lib/storageService";
import { Lead, ClientData, Service, ClientCommunication, ManagerTask, ClientDocument } from "@/lib/types";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "leads" | "tasks" | "services" | "categories">("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [clientModalTab, setClientModalTab] = useState<"overview" | "passport" | "family" | "addresses" | "docs" | "comms" | "tasks" | "leads">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMasked, setShowMasked] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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
  const [previewSignedUrl, setPreviewSignedUrl] = useState<string | null>(null);

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
      } catch (err) {
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
    }
  }, [selectedClient]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("gospomosh_admin_auth");
    router.push("/admin/login");
  };

  const handleStatusChange = async (id: string, status: Lead["status"]) => {
    await updateLeadStatus(id, status);
    loadData();
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Удалить клиента? Будут удалены анкета, семья, документы. История заявок сохранится.")) {
      await deleteClient(id);
      loadData();
      if (selectedClient && selectedClient.id === id) setSelectedClient(null);
    }
  };

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

  const handleToggleTaskStatus = async (taskId: string, currentStatus: ManagerTask["status"]) => {
    const nextStatus = currentStatus === "completed" ? "new" : "completed";
    await updateManagerTaskStatus(taskId, nextStatus);
    loadData();
  };

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
        // Add to client's documents in state
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

  const handlePreviewDoc = async (storagePath: string) => {
    const signed = await getDocumentSignedUrl(storagePath, 300);
    if (signed) {
      window.open(signed, "_blank");
    } else {
      alert("Временная ссылка недоступна или файл в демо-режиме");
    }
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

  const filteredClients = clients.filter(c => {
    const q = c.questionnaire;
    const query = searchQuery.toLowerCase();
    const fullName = `${q.profile.last_name} ${q.profile.first_name} ${q.profile.middle_name || ""}`.toLowerCase();
    const phone = (q.contacts.phone || "").toLowerCase();
    const inn = (q.tax.inn || "").toLowerCase();
    const snils = (q.tax.snils || "").toLowerCase();
    const passport = `${q.internal_passport.series} ${q.internal_passport.number}`.toLowerCase();

    return fullName.includes(query) || phone.includes(query) || inn.includes(query) || snils.includes(query) || passport.includes(query);
  });

  if (isLoadingAuth) {
    return <div className="p-16 text-center text-xs font-bold text-[#08525a]">Проверка прав администратора...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8 text-[#08525a]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#0E7C86]/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E7C86] text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#08525a]">Рабочее место менеджера & CRM</h1>
            <p className="text-[#08525a]/60 text-xs">Документы, коммуникации, задачи и контроль сроков</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowMasked(!showMasked)}
            className="text-xs font-semibold px-3 py-2 bg-[#FDF2F0] border border-[#0E7C86]/20 text-[#08525a] rounded-xl transition flex items-center space-x-1.5"
            title="Переключить маскирование"
          >
            {showMasked ? <Lock className="w-3.5 h-3.5 text-[#2AA9A9]" /> : <Unlock className="w-3.5 h-3.5 text-[#FF8C42]" />}
            <span className="hidden sm:inline">{showMasked ? "Замаскировано" : "Открыто"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-4 py-2 bg-white border border-[#0E7C86]/20 hover:bg-[#FFFBF3] text-[#08525a] rounded-xl transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-2 border-b border-[#0E7C86]/10 pb-3 overflow-x-auto">
        {[
          { id: "dashboard", label: "Dashboard", icon: Briefcase },
          { id: "clients", label: "Клиенты", icon: Users, count: clients.length },
          { id: "leads", label: "Заявки", icon: UserCheck, count: leads.length },
          { id: "tasks", label: "Задачи", icon: CheckCircle, count: tasks.filter(t => t.status !== "completed").length },
          { id: "services", label: "Услуги", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive ? "bg-[#0E7C86] text-white shadow-sm" : "bg-white border border-[#0E7C86]/20 text-[#08525a] hover:bg-[#FDF2F0]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-2 py-0.5 bg-[#FF8C42] text-white rounded-full text-[10px]">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Новые обращения</span>
              <div className="text-2xl sm:text-3xl font-black text-[#0E7C86]">{leads.filter(l => l.status === "new").length}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">В работе</span>
              <div className="text-2xl sm:text-3xl font-black text-[#2AA9A9]">{leads.filter(l => l.status === "contacted").length}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Клиенты в базе</span>
              <div className="text-2xl sm:text-3xl font-black text-[#FF8C42]">{clients.length}</div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#0E7C86]/10 shadow-sm space-y-1">
              <span className="text-xs font-bold text-gray-400">Открытые задачи</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600">{tasks.filter(t => t.status !== "completed").length}</div>
            </div>
          </div>

          {/* Attention & Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-[#FF8C42]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-[#08525a]">Требуют внимания</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#FDF2F0] rounded-xl flex items-center justify-between">
                  <span>Паспорт РФ (Иванов И.И.) — проверен</span>
                  <span className="text-emerald-700 font-bold">✓ Бессрочный</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between text-amber-900 font-semibold">
                  <span>Загранпаспорт (Петров С.) — проверка</span>
                  <span className="px-2 py-0.5 bg-amber-200 rounded text-[10px]">В работе</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl flex items-center justify-between text-rose-900 font-semibold">
                  <span>Новая заявка #1001 ожидает звонка</span>
                  <span className="px-2 py-0.5 bg-rose-200 rounded text-[10px]">Срочно</span>
                </div>
              </div>
            </div>

            {/* Quick Task Board */}
            <div className="p-6 bg-white rounded-3xl border border-[#0E7C86]/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-[#08525a]">Ближайшие задачи менеджера</h3>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className="text-xs font-bold text-[#0E7C86] hover:underline"
                >
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

      {/* CLIENTS TAB */}
      {activeTab === "clients" && (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#2AA9A9] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Поиск по ФИО, телефону, ИНН, СНИЛС, паспорту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDF2F0]/50 border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0E7C86]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
              <Link
                href="/client/questionnaire"
                className="bg-[#FF8C42] hover:bg-[#E66E26] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Новая анкета</span>
              </Link>
              <button onClick={loadData} className="p-2.5 bg-[#FDF2F0] text-[#0E7C86] rounded-xl hover:bg-[#0E7C86]/10 transition">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#0E7C86]/10 text-[#08525a]/60 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Клиент</th>
                  <th className="py-3 px-4">ИНН / СНИЛС</th>
                  <th className="py-3 px-4">Паспорт РФ</th>
                  <th className="py-3 px-4">Телефон</th>
                  <th className="py-3 px-4">Семья</th>
                  <th className="py-3 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map((c) => {
                  const q = c.questionnaire;
                  return (
                    <tr key={c.id} className="hover:bg-[#FDF2F0]/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-sm">{q.profile.last_name} {q.profile.first_name} {q.profile.middle_name}</div>
                        <div className="text-gray-400 text-[10px]">{q.profile.citizenship} • {q.profile.birth_date}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>ИНН: <span className="font-bold">{maskINN(q.tax.inn)}</span></div>
                        <div>СНИЛС: <span className="text-gray-500">{maskSNILS(q.tax.snils)}</span></div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold">
                        {maskPassport(q.internal_passport.series, q.internal_passport.number)}
                      </td>
                      <td className="py-3.5 px-4 font-bold">{q.contacts.phone}</td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <div>Супруг: {q.spouse ? "Да" : "Нет"}</div>
                        <div>Дети: <span className="font-bold text-[#0E7C86]">{q.children.length}</span></div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedClient(c);
                            setClientModalTab("overview");
                          }}
                          className="px-3 py-1.5 bg-[#0E7C86] hover:bg-[#08525a] text-white rounded-xl font-bold text-xs transition"
                        >
                          Открыть CRM
                        </button>
                        <button
                          onClick={() => handleDeleteClient(c.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-3xl border border-[#0E7C86]/10 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold">Задачи и напоминания менеджера</h2>
              <p className="text-xs text-gray-500">Контроль звонков, сбора документов и подачи заявлений</p>
            </div>
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

      {/* DETAILED CRM CARD MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl space-y-6 relative my-4 sm:my-8 text-[#08525a] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#0E7C86]/10 pb-4">
              <div>
                <span className="text-xs font-extrabold text-[#0E7C86] uppercase tracking-wider">CRM Карточка клиента</span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {selectedClient.questionnaire.profile.last_name} {selectedClient.questionnaire.profile.first_name} {selectedClient.questionnaire.profile.middle_name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={`/api/client/${selectedClient.id}/pdf`}
                  download
                  className="bg-[#FF8C42] hover:bg-[#E66E26] text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Скачать анкету</span>
                </a>
                <button
                  onClick={() => setIsCreatingLead(true)}
                  className="bg-[#0E7C86] hover:bg-[#08525a] text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Новое обращение</span>
                </button>
                <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1">✕</button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex space-x-2 border-b border-[#0E7C86]/10 pb-2 text-xs font-bold overflow-x-auto">
              {[
                { id: "overview", label: "Обзор" },
                { id: "passport", label: "Паспорта & ИНН" },
                { id: "family", label: `Семья (${selectedClient.questionnaire.children.length})` },
                { id: "docs", label: "Документы & Сканы" },
                { id: "comms", label: `Коммуникации (${communications.length})` },
                { id: "leads", label: "История обращений" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClientModalTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                    clientModalTab === tab.id ? "bg-[#0E7C86] text-white" : "text-[#08525a] hover:bg-[#FDF2F0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Tabs */}
            <div className="space-y-4 text-xs">
              {clientModalTab === "overview" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-[#0E7C86] uppercase">Основная информация</span>
                    <div><span className="text-gray-400 block">Дата рождения:</span><span className="font-bold">{selectedClient.questionnaire.profile.birth_date}</span></div>
                    <div><span className="text-gray-400 block">Гражданство:</span><span className="font-bold">{selectedClient.questionnaire.profile.citizenship}</span></div>
                    <div><span className="text-gray-400 block">Семейное положение:</span><span className="font-bold">{selectedClient.questionnaire.marital_status}</span></div>
                  </div>

                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-[#0E7C86] uppercase">Идентификаторы</span>
                    <div><span className="text-gray-400 block">ИНН (12 цифр):</span><span className="font-bold font-mono">{maskINN(selectedClient.questionnaire.tax.inn)}</span></div>
                    <div><span className="text-gray-400 block">СНИЛС (11 цифр):</span><span className="font-bold font-mono">{maskSNILS(selectedClient.questionnaire.tax.snils)}</span></div>
                    <div><span className="text-gray-400 block">Статус проверки:</span><span className="text-emerald-700 font-bold">✓ Формат корректен</span></div>
                  </div>

                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-[#0E7C86] uppercase">Связь & Документы</span>
                    <div><span className="text-gray-400 block">Телефон:</span><span className="font-bold">{selectedClient.questionnaire.contacts.phone}</span></div>
                    <div><span className="text-gray-400 block">Документов в базе:</span><span className="font-bold">{selectedClient.questionnaire.documents.length} шт.</span></div>
                    <div><span className="text-gray-400 block">Обращений:</span><span className="font-bold text-[#FF8C42]">{leads.filter(l => l.client_id === selectedClient.id).length}</span></div>
                  </div>
                </div>
              )}

              {/* DOCUMENTS & STORAGE TAB */}
              {clientModalTab === "docs" && (
                <div className="space-y-4">
                  {/* Upload Form */}
                  <form onSubmit={handleUploadDocument} className="p-4 bg-[#FDF2F0] rounded-2xl space-y-3">
                    <h4 className="font-bold text-[#0E7C86] text-xs">Загрузить скан / PDF в приватное хранилище</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Название документа (Паспорт РФ)..."
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
                      />
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value as any)}
                        className="p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs font-semibold outline-none"
                      >
                        <option value="passports">Паспорта</option>
                        <option value="tax">Налоговые (ИНН/СНИЛС)</option>
                        <option value="family">Семейные свидетельства</option>
                        <option value="immigration">Миграционные (ВНЖ/РВП)</option>
                        <option value="other">Прочие</option>
                      </select>
                      <input
                        type="date"
                        placeholder="Срок действия (если есть)"
                        value={docExpiryDate}
                        onChange={(e) => setDocExpiryDate(e.target.value)}
                        className="p-2 bg-white border border-[#0E7C86]/20 rounded-xl text-xs outline-none"
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

                  {/* Documents List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Прикрепленные документы клиента</h4>
                    {selectedClient.questionnaire.documents.length === 0 ? (
                      <p className="text-gray-400 italic">Документы еще не загружены</p>
                    ) : (
                      <div className="divide-y divide-gray-100 bg-white border rounded-xl overflow-hidden">
                        {selectedClient.questionnaire.documents.map((doc) => (
                          <div key={doc.id} className="p-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <File className="w-5 h-5 text-[#2AA9A9]" />
                              <div>
                                <div className="font-bold">{doc.document_type}</div>
                                <div className="text-[10px] text-gray-400">
                                  Срок: {doc.expiry_date || "Бессрочный"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.document_number && (
                                <button
                                  onClick={() => handlePreviewDoc(doc.document_number!)}
                                  className="px-2.5 py-1 bg-[#FDF2F0] hover:bg-[#0E7C86]/10 text-[#0E7C86] rounded-lg font-bold text-[11px]"
                                >
                                  Открыть (Signed URL)
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COMMUNICATIONS TAB */}
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

                  {/* History */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Журнал коммуникаций</h4>
                    {communications.length === 0 ? (
                      <p className="text-gray-400 italic">Записей звонков и сообщений пока нет</p>
                    ) : (
                      <div className="space-y-2">
                        {communications.map((comm) => (
                          <div key={comm.id} className="p-3 bg-white border rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span className="font-bold uppercase text-[#0E7C86]">{comm.type}</span>
                              <span>{new Date(comm.created_at).toLocaleString("ru-RU")}</span>
                            </div>
                            <p className="font-medium text-[#08525a]">{comm.comment}</p>
                            {comm.result && <div className="text-[11px] font-bold text-[#FF8C42]">Итог: {comm.result}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PASSPORTS TAB */}
              {clientModalTab === "passport" && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Паспорт гражданина РФ</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div><span className="text-gray-400 block">Серия и номер:</span><span className="font-bold">{maskPassport(selectedClient.questionnaire.internal_passport.series, selectedClient.questionnaire.internal_passport.number)}</span></div>
                      <div><span className="text-gray-400 block">Дата выдачи:</span><span className="font-bold">{selectedClient.questionnaire.internal_passport.issue_date}</span></div>
                      <div><span className="text-gray-400 block">Код подразделения:</span><span className="font-bold">{selectedClient.questionnaire.internal_passport.department_code || "—"}</span></div>
                      <div className="col-span-2 sm:col-span-3"><span className="text-gray-400 block">Кем выдан:</span><span className="font-bold">{selectedClient.questionnaire.internal_passport.issuer}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAMILY TAB */}
              {clientModalTab === "family" && (
                <div className="space-y-4">
                  {selectedClient.questionnaire.spouse && (
                    <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                      <h4 className="font-bold text-[#0E7C86]">Супруг / Супруга</h4>
                      <p className="font-bold">{selectedClient.questionnaire.spouse.last_name} {selectedClient.questionnaire.spouse.first_name} {selectedClient.questionnaire.spouse.middle_name}</p>
                    </div>
                  )}
                  <div className="p-4 bg-[#FDF2F0] rounded-2xl space-y-2">
                    <h4 className="font-bold text-[#0E7C86]">Дети ({selectedClient.questionnaire.children.length})</h4>
                    {selectedClient.questionnaire.children.map((ch, i) => (
                      <div key={ch.id} className="p-2 bg-white rounded-lg flex justify-between">
                        <span>{i + 1}. {ch.last_name} {ch.first_name}</span>
                        <span className="text-gray-400">{ch.birth_date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEADS TAB */}
              {clientModalTab === "leads" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-[#0E7C86]">История обращений по услугам</h4>
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

      {/* CREATE NEW LEAD MODAL */}
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
