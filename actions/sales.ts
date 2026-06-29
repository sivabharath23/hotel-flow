"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addSale(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const description = formData.get("description") as string;
  const notes = formData.get("notes") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid amount." };
  }

  if (!paymentMethod) {
    return { error: "Payment method is required." };
  }

  await prisma.sale.create({
    data: {
      hotelId: session.hotelId,
      amount,
      paymentMethod,
      description: description || null,
      notes: notes || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/sales");
  revalidatePath("/reports");

  return { success: true };
}

export async function deleteSale(saleId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const sale = await prisma.sale.findUnique({ where: { id: saleId } });
  if (!sale || sale.hotelId !== session.hotelId) {
    return { error: "Sale record not found." };
  }

  await prisma.sale.delete({ where: { id: saleId } });

  revalidatePath("/dashboard");
  revalidatePath("/sales");
  revalidatePath("/reports");

  return { success: true };
}

export async function getSales(limit: number = 50) {
  const session = await getSession();
  if (!session) return [];

  return await prisma.sale.findMany({
    where: { hotelId: session.hotelId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
