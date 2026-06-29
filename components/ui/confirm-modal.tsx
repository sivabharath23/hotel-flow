"use client";

import React from "react";
import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isLogout = title.toLowerCase().includes("sign out") || title.toLowerCase().includes("logout");

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${type === "danger" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50" : "bg-amber-50 text-amber-600 dark:bg-amber-950/50"}`}>
            {isLogout ? <LogOut className="w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{description}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${
              type === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
            }`}
          >
            <span>{loading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
