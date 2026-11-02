"use client";

import { useState } from "react";
import {
  Users,
  Tag,
  Package,
  Layers,
  Phone,
  Mail,
  Building,
  MapPin,
  ExternalLink,
  LogOut,
  CheckCircle2,
  Clock,
  HelpCircle,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  exam_slug: string | null;
  exam_code: string | null;
  quantity: number;
  city: string | null;
  target_date: string | null;
  company: string | null;
  gstin: string | null;
  message: string | null;
  intent: string;
  source: string | null;
  status: "new" | "contacted" | "quoted" | "won" | "lost" | "spam";
  created_at: string;
}

interface Offer {
  id: string;
  exam_slug: string;
  supplier_name: string;
  supply_status: "verified" | "affiliate" | "quote" | "unavailable";
  price_inr: number;
  compare_at_inr: number;
  voucher_validity_days: number;
  is_active: boolean;
}

interface ExamSummary {
  slug: string;
  name: string;
  code: string;
  provider_slug: string;
  official_price_inr: number;
}

interface AdminDashboardClientProps {
  initialLeads: Lead[];
  initialOffers: Offer[];
  exams: ExamSummary[];
}

export function AdminDashboardClient({
  initialLeads,
  initialOffers,
  exams,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"leads" | "offers" | "exams">("leads");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const examsMap = new Map(exams.map((e) => [e.slug, e]));

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.reload();
  }

  async function updateLeadStatus(id: string, newStatus: Lead["status"]) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateOfferSupply(id: string, newStatus: Offer["supply_status"]) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, supply_status: newStatus }),
      });
      if (res.ok) {
        setOffers((prev) =>
          prev.map((offer) =>
            offer.id === id ? { ...offer, supply_status: newStatus } : offer
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredLeads =
    statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

  const leadsNewCount = leads.filter((l) => l.status === "new").length;
  const quotesCount = leads.filter((l) => l.intent === "single" || l.intent === "bulk").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white tracking-wider">
              OPS
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Certitude Control Center
              </h1>
              <p className="text-xs text-slate-500">Live DB · Production Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Supabase
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex gap-6 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === "leads"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Lead Quotes</span>
            <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === "offers"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Offers & Supply Gate</span>
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700">
              {offers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
              activeTab === "exams"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Catalogue View</span>
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700">
              {exams.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Unread / New Inquiries</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{leadsNewCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Total Leads Captured</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{leads.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Active Exam Offers</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{offers.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Supply Gate Policy</p>
            <p className="mt-1 text-xs font-bold text-emerald-700 flex items-center gap-1 mt-2">
              <CheckCircle2 className="h-4 w-4" /> 100% Quote / Affiliate
            </p>
          </div>
        </div>

        {/* TAB 1: LEADS TRIAGE */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Incoming Quotes & Inquiries</h2>
                <p className="text-xs text-slate-500">
                  Customer enquiries awaiting sales triage and WhatsApp outreach.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">All Statuses ({leads.length})</option>
                  <option value="new">New ({leads.filter((l) => l.status === "new").length})</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="spam">Spam</option>
                </select>
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                <p className="text-sm">No leads matching selected filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => {
                  const exam = lead.exam_slug ? examsMap.get(lead.exam_slug) : null;
                  const whatsappMessage = encodeURIComponent(
                    `Hi ${lead.name}, thank you for requesting an exam voucher quote for ${
                      exam?.name || lead.exam_code || "your certification"
                    } on Certitude (Ref: ${lead.reference}). Here are the details…`
                  );
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappMessage}`;

                  return (
                    <div
                      key={lead.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                            {lead.reference}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              lead.status === "new"
                                ? "bg-amber-100 text-amber-800"
                                : lead.status === "won"
                                ? "bg-emerald-100 text-emerald-800"
                                : lead.status === "contacted"
                                ? "bg-blue-100 text-blue-800"
                                : lead.status === "quoted"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lead.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(lead.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-500">Status:</label>
                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id}
                            onChange={(e) =>
                              updateLeadStatus(lead.id, e.target.value as Lead["status"])
                            }
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="quoted">Quoted</option>
                            <option value="won">Won (Deal Closed)</option>
                            <option value="lost">Lost</option>
                            <option value="spam">Spam</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5 text-xs">
                        {/* Customer Information */}
                        <div className="space-y-1.5">
                          <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                          {lead.city && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{lead.city}</span>
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Building className="h-3.5 w-3.5 text-slate-400" />
                              <span>{lead.company}</span>
                              {lead.gstin && (
                                <span className="font-mono text-[10px] bg-slate-100 px-1 rounded">
                                  GST: {lead.gstin}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Exam & Order Specs */}
                        <div className="space-y-1.5">
                          <p className="font-semibold text-slate-900">
                            {exam ? exam.name : lead.exam_code || "Custom / General Voucher"}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-700">
                              {lead.exam_code || "Code N/A"}
                            </span>
                            <span className="text-slate-600 font-medium">
                              Qty: <strong className="text-slate-900">{lead.quantity}</strong>
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="capitalize text-slate-600">
                              Intent: <strong>{lead.intent}</strong>
                            </span>
                          </div>
                          {lead.target_date && (
                            <p className="text-slate-500 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" /> Target:{" "}
                              <span className="font-medium text-slate-700">{lead.target_date}</span>
                            </p>
                          )}
                        </div>

                        {/* Actions & WhatsApp Contact */}
                        <div className="flex flex-col justify-between items-start md:items-end gap-3">
                          {lead.message && (
                            <div className="rounded-lg bg-slate-50 p-2 text-slate-600 w-full text-[11px] italic border border-slate-100">
                              &ldquo;{lead.message}&rdquo;
                            </div>
                          )}

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                          >
                            <span>Open WhatsApp Chat</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OFFERS & SUPPLY GATE */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Offer & Supply Gate Control</h2>
                <p className="text-xs text-slate-500">
                  Switch offers between Quote, Verified (Direct Checkout), and Affiliate modes.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Exam Slug</th>
                    <th className="px-4 py-3">Discounted (INR)</th>
                    <th className="px-4 py-3">Official (INR)</th>
                    <th className="px-4 py-3">Validity</th>
                    <th className="px-4 py-3">Supply Gate Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {offers.map((offer) => {
                    const exam = examsMap.get(offer.exam_slug);
                    return (
                      <tr key={offer.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{exam?.name || offer.exam_slug}</p>
                          <p className="font-mono text-[10px] text-slate-400">{offer.exam_slug}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          ₹{offer.price_inr.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          ₹{offer.compare_at_inr.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {offer.voucher_validity_days} days
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              offer.supply_status === "verified"
                                ? "bg-emerald-100 text-emerald-800"
                                : offer.supply_status === "affiliate"
                                ? "bg-blue-100 text-blue-800"
                                : offer.supply_status === "quote"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {offer.supply_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={offer.supply_status}
                            disabled={updatingId === offer.id}
                            onChange={(e) =>
                              updateOfferSupply(offer.id, e.target.value as Offer["supply_status"])
                            }
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none"
                          >
                            <option value="quote">Quote Only</option>
                            <option value="affiliate">Affiliate Link</option>
                            <option value="verified">Verified (Direct Buy)</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATALOGUE VIEW */}
        {activeTab === "exams" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Active Catalogue Exams</h2>
              <p className="text-xs text-slate-500">
                All {exams.length} exams indexed in Supabase and live in marketplace search.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.slug}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {exam.code}
                    </span>
                    <span className="text-[11px] uppercase font-semibold text-slate-400">
                      {exam.provider_slug}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">
                    {exam.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <span className="text-slate-500">Official Retail</span>
                    <span className="font-semibold text-slate-800">
                      ₹{exam.official_price_inr.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
