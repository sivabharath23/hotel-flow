"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateFinancials } from "@/lib/calculations";
import { formatDateString } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function setOpeningBalance(amount: number, dateStr?: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const targetDate = dateStr || formatDateString(new Date());

  // Check if closing balance already recorded for today
  const existingClosing = await prisma.closingBalance.findUnique({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
  });

  if (existingClosing) {
    return { error: "Cannot modify opening balance after day closing is submitted." };
  }

  // Check existing opening balance
  const existingOpening = await prisma.openingBalance.findUnique({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
  });

  if (existingOpening && existingOpening.isLocked) {
    // Admin unlock logic could be checked here
  }

  await prisma.openingBalance.upsert({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
    update: { amount, isLocked: true },
    create: {
      hotelId: session.hotelId,
      date: targetDate,
      amount,
      isLocked: true,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/closing");
  revalidatePath("/reports");

  return { success: true };
}

export async function unlockOpeningBalance(dateStr?: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const targetDate = dateStr || formatDateString(new Date());

  await prisma.openingBalance.update({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
    data: { isLocked: false },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function recordClosingBalance(actualCash: number, notes?: string, dateStr?: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const targetDate = dateStr || formatDateString(new Date());

  // Check if already closed today
  const existingClosing = await prisma.closingBalance.findUnique({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
  });

  if (existingClosing) {
    return { error: "Day closing has already been completed for today and cannot be submitted twice." };
  }

  // Fetch today's financial data to calculate expected cash
  const startOfDay = new Date(targetDate + "T00:00:00.000Z");
  const endOfDay = new Date(targetDate + "T23:59:59.999Z");

  const [openingObj, sales, expenses] = await Promise.all([
    prisma.openingBalance.findUnique({
      where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
    }),
    prisma.sale.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.expense.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
  ]);

  const openingBalance = openingObj?.amount || 0;
  const financials = calculateFinancials({ openingBalance, sales, expenses });
  const expectedCash = financials.cashInHand;
  const difference = actualCash - expectedCash;

  let status = "EXACT";
  if (difference < 0) status = "SHORTAGE";
  if (difference > 0) status = "OVERAGE";

  const closing = await prisma.closingBalance.create({
    data: {
      hotelId: session.hotelId,
      date: targetDate,
      expectedCash,
      actualCash,
      difference,
      status,
      notes: notes || null,
    },
  });

  // Lock opening balance
  if (openingObj) {
    await prisma.openingBalance.update({
      where: { id: openingObj.id },
      data: { isLocked: true },
    });
  }

  // Save/Update DailySummary aggregate
  await prisma.dailySummary.upsert({
    where: { hotelId_date: { hotelId: session.hotelId, date: targetDate } },
    update: {
      sales: financials.totalSales,
      expenses: financials.totalExpenses,
      profit: financials.profit,
      roi: financials.roi,
    },
    create: {
      hotelId: session.hotelId,
      date: targetDate,
      sales: financials.totalSales,
      expenses: financials.totalExpenses,
      profit: financials.profit,
      roi: financials.roi,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/closing");
  revalidatePath("/reports");

  return { success: true, closing };
}
