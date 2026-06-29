"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addInvestment(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const source = (formData.get("source") as string) || "OWNER_CAPITAL";
  const paymentMethod = (formData.get("paymentMethod") as string) || "CASH";
  const description = formData.get("description") as string;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid positive investment amount." };
  }

  try {
    const investment = await prisma.investment.create({
      data: {
        hotelId: session.hotelId,
        amount,
        source,
        paymentMethod,
        description: description || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/investments");
    revalidatePath("/closing");
    revalidatePath("/reports");

    return { success: true, investment };
  } catch (err: any) {
    return { error: "Failed to record investment entry." };
  }
}

export async function deleteInvestment(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.investment.deleteMany({
      where: { id, hotelId: session.hotelId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/investments");
    revalidatePath("/closing");
    revalidatePath("/reports");

    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete investment entry." };
  }
}

export async function getInvestments() {
  const session = await getSession();
  if (!session) return [];

  return prisma.investment.findMany({
    where: { hotelId: session.hotelId },
    orderBy: { createdAt: "desc" },
  });
}
