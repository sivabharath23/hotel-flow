"use client";

import { useState } from "react";
import { recordClosingBalance } from "@/actions/balances";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Lock, AlertTriangle, CheckCircle, Calculator, Info, Edit3, X, Check } from "lucide-react";

interface ClosingViewProps {
  expectedCash: number;
  existingClosing: {
    actualCash: number;
    expectedCash: number;
    difference: number;
    status: string;
    notes: string | null;
    createdAt: Date;
  } | null;
  currency: string;
}

export function ClosingView({ expectedCash, existingClosing, currency }: ClosingViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [actualCashInput, setActualCashInput] = useState(
    existingClosing ? String(existingClosing.actualCash) : ""
  );
  const [notes, setNotes] = useState(existingClosing?.notes || "");
  const [loading, setLoading] = useState(false);

  const actualCashNum = parseFloat(actualCashInput) || 0;
  const difference = actualCashNum - expectedCash;

  const handleStartEdit = () => {
    if (existingClosing) {
      setActualCashInput(String(existingClosing.actualCash));
      setNotes(existingClosing.notes || "");
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(actualCashNum) || actualCashInput === "") {
      toast.error("Please enter the actual physical cash count.");
      return;
    }

    setLoading(true);
    const res = await recordClosingBalance(actualCashNum, notes);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(existingClosing ? "Day closing entry updated successfully!" : "End-of-day cash closing submitted successfully!");
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                End-of-Day Cash Reconciliation
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Audit actual drawer cash against expected register calculations
              </p>
            </div>
          </div>

        </div>

        {existingClosing && !isEditing ? (
          /* Already Closed View */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                    Day Closing Completed
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Daily register was reconciled on {new Date(existingClosing.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartEdit}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Count</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-400 uppercase">Expected Cash</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {formatCurrency(existingClosing.expectedCash, currency)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-400 uppercase">Actual Cash Count</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {formatCurrency(existingClosing.actualCash, currency)}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${existingClosing.difference === 0
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/30"
                  : existingClosing.difference < 0
                    ? "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/30"
                    : "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/30"
                }`}>
                <span className="text-xs font-semibold uppercase opacity-70">Variance Status</span>
                <p className="text-xl font-black mt-1">
                  {existingClosing.difference === 0
                    ? "EXACT MATCH"
                    : existingClosing.difference < 0
                      ? `SHORTAGE (${formatCurrency(Math.abs(existingClosing.difference), currency)})`
                      : `OVERAGE (+${formatCurrency(existingClosing.difference, currency)})`}
                </p>
              </div>
            </div>

            {existingClosing.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold">Reconciliation Notes:</span> {existingClosing.notes}
              </div>
            )}
          </div>
        ) : (
          /* Form View to Perform or Edit Closing */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Calculated Expected Cash</span>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  {formatCurrency(expectedCash, currency)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">(Opening + Cash Sales - Cash Exp)</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Variance Preview</span>
                <p className={`text-2xl font-black mt-1 ${difference === 0 ? "text-slate-700 dark:text-slate-300" : difference < 0 ? "text-rose-600" : "text-amber-600"
                  }`}>
                  {actualCashInput === ""
                    ? "—"
                    : difference === 0
                      ? "₹0 (Exact)"
                      : difference < 0
                        ? `-${formatCurrency(Math.abs(difference), currency)} Shortage`
                        : `+${formatCurrency(difference, currency)} Extra`}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Actual Physical Cash Counted in Drawer (₹) *
              </label>
              <div className="relative">
                <Calculator className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="any"
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(e.target.value)}
                  placeholder="Count all physical notes and coins"
                  required
                  className="w-full pl-13 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-2xl focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Closing Remarks / Reason for Discrepancy (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Minor cash rounding differences or register tips"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              {existingClosing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel Edit</span>
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-base bg-purple-600 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                <span>{loading ? "Saving Reconciled Balance..." : existingClosing ? "Save Updated Closing" : "Submit End-of-Day Closing"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
