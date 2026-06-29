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
  Coins,
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
    totalInvestments: number;
    cashInvestments: number;
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

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Link
            href="/sales"
            className="py-2 px-3 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-xs hover:bg-blue-50 transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Sale</span>
          </Link>
          <Link
            href="/expenses"
            className="py-2 px-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center gap-1 border border-blue-500/30"
          >
            <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>- Expense</span>
          </Link>
          <Link
            href="/investments"
            className="py-2 px-3 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1 border border-emerald-400/30"
          >
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Capital</span>
          </Link>
        </div>
      </div>

      {/* 8 Financial Stat Cards Grid - Compact */}
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
          title="Investments Inflow"
          subtitle="Capital & Injections"
          amount={financials.totalInvestments}
          currencySymbol={currency}
          icon={Coins}
          colorScheme="amber"
          trendText={`Cash In: ${formatCurrency(financials.cashInvestments, currency)}`}
        />

        <StatCard
          title="Cash In Hand"
          subtitle="Opening + Sales + Capital - Exp"
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
          trendText={financials.profit >= 0 ? "Net Gain" : "Net Loss"}
        />

        <StatCard
          title="ROI %"
          subtitle="Return on Investment"
          amount={financials.roi}
          currencySymbol="%"
          icon={PieChart}
          colorScheme={financials.roi >= 0 ? "blue" : "rose"}
          trendText="Margin Return Rate"
        />
      </div>

      {/* Opening Balance Modal */}
      <OpeningBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAmount={financials.openingBalance}
      />
    </div>
  );
}
