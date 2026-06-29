"use client";

import { useState } from "react";
import { getReportData } from "@/actions/reports";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, Download, PieChart as PieChartIcon, FileSpreadsheet, FileText } from "lucide-react";

interface ReportsViewProps {
  initialData: any;
  currency: string;
}

const COLORS = ["#2563EB", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899", "#64748B"];

export function ReportsView({ initialData, currency }: ReportsViewProps) {
  const [range, setRange] = useState<"today" | "yesterday" | "7days" | "30days" | "custom">("7days");
  const [reportData, setReportData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleRangeChange = async (newRange: any) => {
    setRange(newRange);
    if (newRange === "custom") return;
    setLoading(true);
    const data = await getReportData(newRange);
    setReportData(data);
    setLoading(false);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await getReportData("custom", customStart, customEnd);
    setReportData(data);
    setLoading(false);
  };

  const exportToExcel = () => {
    try {
      const summary = reportData?.summary || { totalSales: 0, totalExpenses: 0, profit: 0, roi: 0 };
      const sales = reportData?.sales || [];
      const expenses = reportData?.expenses || [];

      const wb = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ["HotelFlow Financial Report", range.toUpperCase()],
        ["Generated Date", new Date().toLocaleString()],
        [],
        ["SUMMARY METRICS", ""],
        ["Total Sales", summary.totalSales],
        ["Total Expenses", summary.totalExpenses],
        ["Net Profit", summary.profit],
        ["ROI %", `${summary.roi}%`],
      ];
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      // Sales Sheet
      const salesData = sales.map((s: any) => ({
        "Transaction ID": s.id,
        "Date & Time": new Date(s.createdAt).toLocaleString(),
        "Amount": s.amount,
        "Payment Method": s.paymentMethod,
        "Description": s.description || "",
        "Notes": s.notes || "",
      }));
      const salesWs = XLSX.utils.json_to_sheet(salesData.length > 0 ? salesData : [{ "Status": "No sales recorded" }]);
      XLSX.utils.book_append_sheet(wb, salesWs, "Sales");

      // Expenses Sheet
      const expensesData = expenses.map((e: any) => ({
        "Expense ID": e.id,
        "Date & Time": new Date(e.createdAt).toLocaleString(),
        "Amount": e.amount,
        "Category": e.category,
        "Payment Method": e.paymentMethod,
        "Description": e.description || "",
      }));
      const expensesWs = XLSX.utils.json_to_sheet(expensesData.length > 0 ? expensesData : [{ "Status": "No expenses recorded" }]);
      XLSX.utils.book_append_sheet(wb, expensesWs, "Expenses");

      const filename = `HotelFlow_Financial_Report_${range}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success("Excel (.xlsx) report downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download Excel report.");
    }
  };

  const exportToCSV = () => {
    try {
      const summary = reportData?.summary || { totalSales: 0, totalExpenses: 0, profit: 0, roi: 0 };
      const sales = reportData?.sales || [];
      const expenses = reportData?.expenses || [];

      let csvRows: string[] = [];

      const escapeCsv = (str: string | number | null | undefined) => {
        if (str === null || str === undefined) return '""';
        const val = String(str).replace(/"/g, '""');
        return `"${val}"`;
      };
      
      // Title & Summary Section
      csvRows.push(`"HotelFlow Financial Report (${range.toUpperCase()})"`);
      csvRows.push("");
      csvRows.push('"SUMMARY METRICS"');
      csvRows.push(`"Total Sales",${summary.totalSales}`);
      csvRows.push(`"Total Expenses",${summary.totalExpenses}`);
      csvRows.push(`"Net Profit",${summary.profit}`);
      csvRows.push(`"ROI %","${summary.roi}%"`);
      csvRows.push("");

      // Sales Transactions Section
      csvRows.push('"SALES TRANSACTIONS"');
      csvRows.push('"Transaction ID","Date & Time","Amount","Payment Method","Description","Notes"');
      sales.forEach((s: any) => {
        csvRows.push(`${escapeCsv(s.id)},${escapeCsv(new Date(s.createdAt).toLocaleString())},${s.amount},${escapeCsv(s.paymentMethod)},${escapeCsv(s.description)},${escapeCsv(s.notes)}`);
      });
      csvRows.push("");

      // Expenses Section
      csvRows.push('"EXPENSE OUTFLOWS"');
      csvRows.push('"Expense ID","Date & Time","Amount","Category","Payment Method","Description"');
      expenses.forEach((e: any) => {
        csvRows.push(`${escapeCsv(e.id)},${escapeCsv(new Date(e.createdAt).toLocaleString())},${e.amount},${escapeCsv(e.category)},${escapeCsv(e.paymentMethod)},${escapeCsv(e.description)}`);
      });

      const csvString = "\uFEFF" + csvRows.join("\r\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HotelFlow_Financial_Report_${range}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 200);

      toast.success("CSV report downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download CSV report.");
    }
  };

  const summary = reportData?.summary || { totalSales: 0, totalExpenses: 0, profit: 0, roi: 0 };
  const dailyTrends = reportData?.dailyTrends || [];
  const expenseBreakdown = reportData?.expenseBreakdown || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Range Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Financial Analytics</h2>
            <p className="text-xs text-slate-500">Visual trends, ROI tracking & expense distributions</p>
          </div>
        </div>

        {/* Action Buttons & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToExcel}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            title="Download report as genuine Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 mr-1"
            title="Download report as CSV file (.csv)"
          >
            <FileText className="w-4 h-4" />
            <span>CSV (.csv)</span>
          </button>

          {[
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "7days", label: "Last 7 Days" },
            { id: "30days", label: "Last 30 Days" },
            { id: "custom", label: "Custom Date" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleRangeChange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                range === item.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Form */}
      {range === "custom" && (
        <form onSubmit={handleCustomSubmit} className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">From:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              required
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">To:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              required
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border text-xs font-semibold"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
          >
            Apply Range
          </button>
        </form>
      )}

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Period Sales</span>
          <p className="text-lg md:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(summary.totalSales, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Period Expenses</span>
          <p className="text-lg md:text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {formatCurrency(summary.totalExpenses, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Net Profit</span>
          <p className={`text-lg md:text-xl font-black mt-0.5 ${summary.profit >= 0 ? "text-blue-600" : "text-rose-600"}`}>
            {formatCurrency(summary.profit, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Period ROI %</span>
          <p className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {summary.roi}%
          </p>
        </div>
      </div>

      {/* Charts Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Sales & Profit Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Daily Revenue vs Outflow Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", background: "#1e293b", color: "#fff", border: "none" }}
                  formatter={(value: any) => [formatCurrency(value as number, currency)]}
                />
                <Bar dataKey="sales" name="Sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-rose-600" /> Expense Category Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {expenseBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400">No expenses recorded in selected period.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {expenseBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", background: "#1e293b", color: "#fff", border: "none" }}
                    formatter={(value: any) => [formatCurrency(value as number, currency)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
