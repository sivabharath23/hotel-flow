"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const description = formData.get("description") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid amount." };
  }

  if (!category || !paymentMethod) {
    return { error: "Category and payment method are required." };
  }

  await prisma.expense.create({
    data: {
      hotelId: session.hotelId,
      amount,
      category,
      paymentMethod,
      description: description || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/reports");

  return { success: true };
}

export async function deleteExpense(expenseId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense || expense.hotelId !== session.hotelId) {
    return { error: "Expense record not found." };
  }

  await prisma.expense.delete({ where: { id: expenseId } });

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/reports");

  return { success: true };
}

export async function getExpenses(limit: number = 50) {
  const session = await getSession();
  if (!session) return [];

  return await prisma.expense.findMany({
    where: { hotelId: session.hotelId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
