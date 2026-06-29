"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDateString } from "@/lib/utils";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function getReportData(range: "today" | "yesterday" | "7days" | "30days" | "custom", customStartDate?: string, customEndDate?: string) {
  const session = await getSession();
  if (!session) return null;

  let startDate: Date;
  let endDate: Date = endOfDay(new Date());

  const today = new Date();

  switch (range) {
    case "today":
      startDate = startOfDay(today);
      endDate = endOfDay(today);
      break;
    case "yesterday":
      const yesterday = subDays(today, 1);
      startDate = startOfDay(yesterday);
      endDate = endOfDay(yesterday);
      break;
    case "7days":
      startDate = startOfDay(subDays(today, 6));
      break;
    case "30days":
      startDate = startOfDay(subDays(today, 29));
      break;
    case "custom":
      startDate = customStartDate ? startOfDay(new Date(customStartDate)) : startOfDay(subDays(today, 6));
      endDate = customEndDate ? endOfDay(new Date(customEndDate)) : endOfDay(today);
      break;
    default:
      startDate = startOfDay(today);
  }

  const [sales, expenses, openingBalances, closingBalances] = await Promise.all([
    prisma.sale.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.expense.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.openingBalance.findMany({
      where: {
        hotelId: session.hotelId,
      },
    }),
    prisma.closingBalance.findMany({
      where: {
        hotelId: session.hotelId,
      },
    }),
  ]);

  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalSales - totalExpenses;
  const roi = totalExpenses > 0 ? Number(((profit / totalExpenses) * 100).toFixed(2)) : (profit > 0 ? 100 : 0);

  // Group by date for chart trends
  const dailyMap: Record<string, { date: string; sales: number; expenses: number; profit: number }> = {};

  sales.forEach((s) => {
    const d = formatDateString(s.createdAt);
    if (!dailyMap[d]) dailyMap[d] = { date: d, sales: 0, expenses: 0, profit: 0 };
    dailyMap[d].sales += s.amount;
    dailyMap[d].profit += s.amount;
  });

  expenses.forEach((e) => {
    const d = formatDateString(e.createdAt);
    if (!dailyMap[d]) dailyMap[d] = { date: d, sales: 0, expenses: 0, profit: 0 };
    dailyMap[d].expenses += e.amount;
    dailyMap[d].profit -= e.amount;
  });

  const dailyTrends = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  // Expense breakdown by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const expenseBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  return {
    summary: {
      totalSales,
      totalExpenses,
      profit,
      roi,
      salesCount: sales.length,
      expensesCount: expenses.length,
    },
    dailyTrends,
    expenseBreakdown,
    sales,
    expenses,
  };
}
