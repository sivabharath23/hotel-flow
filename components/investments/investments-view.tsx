"use client";

import { useState } from "react";
import { addInvestment, deleteInvestment } from "@/actions/investments";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Coins, Plus, Trash2, Wallet, Building, PiggyBank, ArrowDownRight, Tag, CreditCard, Calendar } from "lucide-react";
import { format } from "date-fns";

interface InvestmentItem {
  id: string;
  amount: number;
  source: string;
  paymentMethod: string;
  description: string | null;
  createdAt: Date;
}

interface InvestmentsViewProps {
  initialInvestments: InvestmentItem[];
  currency: string;
}

const SOURCES = [
  { value: "OWNER_CAPITAL", label: "Owner Capital", icon: Wallet },
  { value: "BANK_LOAN", label: "Bank Loan", icon: Building },
  { value: "PARTNER_INJECTION", label: "Partner Injection", icon: PiggyBank },
  { value: "OTHER", label: "Other Source", icon: Coins },
];

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash Drawer Inflow" },
  { value: "UPI", label: "Online UPI" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "CARD", label: "Card Payment" },
];

export function InvestmentsView({ initialInvestments, currency }: InvestmentsViewProps) {
  const [investments, setInvestments] = useState<InvestmentItem[]>(initialInvestments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addInvestment(formData);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else if (res.investment) {
      toast.success("Investment recorded successfully!");
      setInvestments([res.investment as any, ...investments]);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteInvestment(deleteId);
    setDeleting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Investment entry deleted.");
      setInvestments(investments.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4" /> Capital & Investments Overview
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {formatCurrency(totalInvested, currency)}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">Total Capital Inflow & Owner Injections Logged</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 py-3 px-5 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Investment</span>
        </button>

        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Investments List Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Investment Records</h3>
          <span className="text-xs font-semibold text-slate-400">{investments.length} Total Entries</span>
        </div>

        {investments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Investments Recorded Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Log owner capital injections, loans, or partner investments to track capital inflow.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {investments.map((item) => {
              const SourceIcon = SOURCES.find((s) => s.value === item.source)?.icon || Coins;
              const sourceLabel = SOURCES.find((s) => s.value === item.source)?.label || item.source;

              return (
                <div key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <SourceIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{sourceLabel}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 truncate">
                        <span>{format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}</span>
                        {item.description && <span>• {item.description}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-base text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(item.amount, currency)}
                    </span>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Logging New Investment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Capital Investment</h3>
                  <p className="text-xs text-slate-400">Record capital injection or funding</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Investment Amount ({currency}) *</label>
                <input
                  type="number"
                  name="amount"
                  step="any"
                  placeholder="e.g. 50000"
                  required
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-black text-xl outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Capital Source *</label>
                <select name="source" required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none">
                  {SOURCES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Payment Method *</label>
                <select name="paymentMethod" required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none">
                  {PAYMENT_METHODS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes / Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Kitchen equipment setup fund"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 px-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 px-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1">
                  {loading ? "Saving..." : "Record Investment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Investment Entry"
        description="Are you sure you want to delete this capital investment record?"
        confirmText="Yes, Delete"
        loading={deleting}
      />
    </div>
  );
}
