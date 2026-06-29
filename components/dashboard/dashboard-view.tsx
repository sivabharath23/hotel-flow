"use client";

import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OpeningBalanceModal } from "@/components/dashboard/opening-balance-modal";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building,
  Lock,
  LineChart,
  PieChart,
  PlusCircle,
  MinusCircle,
  ArrowRight,
} from "lucide-react";

interface DashboardViewProps {
  financials: {
    openingBalance: number;
    totalSales: number;
    cashSales: number;
    upiSales: number;
    cardSales: number;
    bankSales: number;
    totalExpenses: number;
    cashExpenses: number;
    cashInHand: number;
    profit: number;
    roi: number;
  };
  closingInfo: {
    isClosed: boolean;
    actualCash?: number;
    difference?: number;
    status?: string;
  } | null;
  currency: string;
  recentSales: Array<{ id: string; amount: number; paymentMethod: string; description: string | null; createdAt: Date }>;
  recentExpenses: Array<{ id: string; amount: number; category: string; paymentMethod: string; description: string | null; createdAt: Date }>;
}

export function DashboardView({ financials, closingInfo, currency, recentSales, recentExpenses }: DashboardViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions - Compact SaaS Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-3.5 md:p-4 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            Live Daily Register
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Today's Net Position
          </h2>
          <p className="text-blue-100 text-xs mt-0.5">
            Real-time cash in hand, collection balances, and net profit performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sales"
            className="py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-xs hover:bg-blue-50 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ Add Sale</span>
          </Link>
          <Link
            href="/expenses"
            className="py-2.5 px-4 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-blue-500/30"
          >
            <MinusCircle className="w-4 h-4 text-rose-400" />
            <span>- Add Expense</span>
          </Link>
        </div>
      </div>

      {/* 7 Financial Stat Cards Grid - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Opening Balance"
          subtitle="Start of day cash"
          amount={financials.openingBalance}
          currencySymbol={currency}
          icon={Wallet}
          colorScheme="blue"
          actionButton={
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950"
            >
              Set / Edit
            </button>
          }
        />

        <StatCard
          title="Today's Sales"
          subtitle={`${recentSales.length} Transactions`}
          amount={financials.totalSales}
          currencySymbol={currency}
          icon={TrendingUp}
          colorScheme="emerald"
          trendText={`Cash: ${formatCurrency(financials.cashSales, currency)}`}
        />

        <StatCard
          title="Today's Expenses"
          subtitle={`${recentExpenses.length} Outflows`}
          amount={financials.totalExpenses}
          currencySymbol={currency}
          icon={TrendingDown}
          colorScheme="rose"
          trendText={`Cash: ${formatCurrency(financials.cashExpenses, currency)}`}
        />

        <StatCard
          title="Cash In Hand"
          subtitle="Opening + Cash Sales - Exp"
          amount={financials.cashInHand}
          currencySymbol={currency}
          icon={Building}
          colorScheme="indigo"
          trendText="Physical drawer cash"
        />

        <StatCard
          title="Closing Balance"
          subtitle={closingInfo?.isClosed ? `Status: ${closingInfo.status}` : "Pending reconciliation"}
          amount={closingInfo?.actualCash !== undefined ? closingInfo.actualCash : financials.cashInHand}
          currencySymbol={currency}
          icon={Lock}
          colorScheme="purple"
          actionButton={
            <Link
              href="/closing"
              className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950"
            >
              {closingInfo?.isClosed ? "View Closing" : "Close Day"}
            </Link>
          }
        />

        <StatCard
          title="Today's Profit"
          subtitle="Sales - Expenses"
          amount={financials.profit}
          currencySymbol={currency}
          icon={LineChart}
          colorScheme={financials.profit >= 0 ? "emerald" : "rose"}
          trendText={financials.profit >= 0 ? "Net Gain Today" : "Net Loss Today"}
        />

        <StatCard
          title="ROI %"
          subtitle="(Profit / Expenses) × 100"
          amount={financials.roi}
          isCurrency={false}
          icon={PieChart}
          colorScheme="amber"
          trendText="Return on investment"
        />
      </div>

      {/* Recent Transactions Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Sales Entries</h3>
            </div>
            <Link href="/sales" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentSales.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No sales recorded today yet.</p>
            ) : (
              recentSales.slice(0, 4).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{sale.description || "Sale Entry"}</p>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{sale.paymentMethod}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(sale.amount, currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Expense Outflows</h3>
            </div>
            <Link href="/expenses" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No expenses recorded today yet.</p>
            ) : (
              recentExpenses.slice(0, 4).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{exp.description || exp.category}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                        {exp.category}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">{exp.paymentMethod}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                    -{formatCurrency(exp.amount, currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <OpeningBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAmount={financials.openingBalance}
      />
    </div>
  );
}
