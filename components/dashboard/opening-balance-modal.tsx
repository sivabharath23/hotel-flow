"use client";

import { useState } from "react";
import { setOpeningBalance } from "@/actions/balances";
import { toast } from "sonner";
import { Wallet, Check, X } from "lucide-react";

interface OpeningBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmount: number;
}

export function OpeningBalanceModal({ isOpen, onClose, currentAmount }: OpeningBalanceModalProps) {
  const [amount, setAmount] = useState(currentAmount ? currentAmount.toString() : "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid opening balance amount.");
      return;
    }

    setLoading(true);
    const res = await setOpeningBalance(parsed);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Opening balance updated successfully!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Opening Balance</h3>
              <p className="text-xs text-slate-500">Set cash in register at start of day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Cash Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg font-semibold"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-2xl font-semibold text-sm bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Balance"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
