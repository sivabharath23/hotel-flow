"use client";

import { useState } from "react";
import { addSale, deleteSale } from "@/actions/sales";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Plus, Trash2, TrendingUp, CreditCard, Wallet, Landmark, QrCode, X, Check, FileSpreadsheet } from "lucide-react";

interface SalesViewProps {
  sales: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    description: string | null;
    notes: string | null;
    createdAt: Date;
  }>;
  currency: string;
}

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash", icon: Wallet, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "UPI", label: "UPI (GPay/PhonePe)", icon: QrCode, color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  { id: "CARD", label: "Card", icon: CreditCard, color: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
  { id: "BANK", label: "Bank Transfer", icon: Landmark, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" },
];

export function SalesView({ sales, currency }: SalesViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);

  const exportToExcel = () => {
    try {
      const salesData = sales.map((s) => ({
        "Transaction ID": s.id,
        "Date & Time": new Date(s.createdAt).toLocaleString(),
        "Amount": s.amount,
        "Payment Method": s.paymentMethod,
        "Description": s.description || "",
        "Notes": s.notes || "",
      }));
      const ws = XLSX.utils.json_to_sheet(salesData.length > 0 ? salesData : [{ "Status": "No sales recorded" }]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales");
      XLSX.writeFile(wb, `Sales_Register_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Sales register exported to Excel!");
    } catch (err) {
      toast.error("Failed to export sales.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addSale(formData);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Sale entry recorded successfully!");
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteSale(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (res.error) toast.error(res.error);
    else toast.success("Sale record deleted.");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Summary - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Sales Register</h2>
              <p className="text-xs text-slate-500">Record bill payments & counter collections</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sales Recorded</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalSales, currency)}
            </p>
          </div>
          <button
            onClick={exportToExcel}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            title="Export Sales to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Sale Entry</span>
          </button>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-3 md:px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Transactions ({sales.length})</h3>
          <span className="text-[11px] text-slate-400">Sorted by newest</span>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-8 px-4">
            <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No sales added yet</h4>
            <p className="text-xs text-slate-400 mt-0.5">Tap the button above to add your first sale.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {sales.map((sale) => {
              const methodConfig = PAYMENT_METHODS.find((m) => m.id === sale.paymentMethod);
              const MethodIcon = methodConfig?.icon || Wallet;

              return (
                <div key={sale.id} className="p-3 md:px-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${methodConfig?.color || "bg-slate-100 text-slate-700"}`}>
                      <MethodIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {sale.description || "Sale Transaction"}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {sale.paymentMethod}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(sale.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(sale.amount, currency)}
                    </span>
                    <button
                      onClick={() => setDeleteId(sale.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Sale Entry"
        description="Are you sure you want to delete this sale transaction? This will automatically update your daily sales and profit totals."
        confirmText="Delete Sale"
        loading={deleting}
      />

      {/* Add Sale Modal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Sale Entry</h3>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Sale Amount (₹) *
                </label>
                <input
                  type="number"
                  step="any"
                  name="amount"
                  required
                  placeholder="e.g. 1250"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold"
                    >
                      <input type="radio" name="paymentMethod" value={method.id} defaultChecked={method.id === "CASH"} className="accent-emerald-600" />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                <input type="text" name="description" placeholder="Room 104 or Catering" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs bg-emerald-600 text-white flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
