"use client";

import { useState } from "react";
import { addExpense, deleteExpense } from "@/actions/expenses";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Plus, Trash2, TrendingDown, CreditCard, Wallet, Landmark, QrCode, X, Check, ShoppingBag, FileSpreadsheet } from "lucide-react";

interface ExpensesViewProps {
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    paymentMethod: string;
    description: string | null;
    createdAt: Date;
  }>;
  currency: string;
}

const CATEGORIES = [
  "Vegetables",
  "Milk",
  "Gas",
  "Chicken",
  "Salary",
  "Electricity",
  "Misc",
];

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash" },
  { id: "UPI", label: "UPI" },
  { id: "CARD", label: "Card" },
  { id: "BANK", label: "Bank Transfer" },
];

export function ExpensesView({ expenses, currency }: ExpensesViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = selectedCategory
    ? expenses.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase())
    : expenses;

  const exportToExcel = () => {
    try {
      const expensesData = filteredExpenses.map((e) => ({
        "Expense ID": e.id,
        "Date & Time": new Date(e.createdAt).toLocaleString(),
        "Amount": e.amount,
        "Category": e.category,
        "Payment Method": e.paymentMethod,
        "Description": e.description || "",
      }));
      const ws = XLSX.utils.json_to_sheet(expensesData.length > 0 ? expensesData : [{ "Status": "No expenses recorded" }]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Expenses");
      XLSX.writeFile(wb, `Expense_Outflows_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Expenses exported to Excel!");
    } catch (err) {
      toast.error("Failed to export expenses.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addExpense(formData);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Expense record added!");
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteExpense(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (res.error) toast.error(res.error);
    else toast.success("Expense record deleted.");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Summary - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Expense Outflows</h2>
              <p className="text-xs text-slate-500">Track raw material purchases & vendor bills</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Outflow</span>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
          <button
            onClick={exportToExcel}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            title="Export Expenses to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === null
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800"
          }`}
        >
          All ({expenses.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = expenses.filter((e) => e.category.toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                selectedCategory === cat
                  ? "bg-rose-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{cat}</span>
              <span className="px-1 py-0.2 text-[10px] rounded bg-black/10">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 px-4">
            <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No expenses found</h4>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="p-3 md:px-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {exp.description || `${exp.category} Purchase`}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {exp.category}
                      </span>
                      <span className="text-[10px] uppercase text-slate-400">{exp.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm md:text-base font-black text-rose-600 dark:text-rose-400">
                    -{formatCurrency(exp.amount, currency)}
                  </span>
                  <button
                    onClick={() => setDeleteId(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense Record"
        description="Are you sure you want to delete this expense outflow entry? This will update your financial profit calculations."
        confirmText="Delete Expense"
        loading={deleting}
      />

      {/* Add Expense Modal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Expense</h3>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Amount (₹) *</label>
                <input type="number" step="any" name="amount" required placeholder="e.g. 450" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-rose-600 outline-none" />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category *</label>
                <select name="category" required defaultValue="Vegetables" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold">
                  {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Payment Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                      <input type="radio" name="paymentMethod" value={method.id} defaultChecked={method.id === "CASH"} className="accent-rose-600" />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description / Vendor</label>
                <input type="text" name="description" placeholder="Fresh Vegetables or Electricity" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-100 text-slate-700">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs bg-rose-600 text-white flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
