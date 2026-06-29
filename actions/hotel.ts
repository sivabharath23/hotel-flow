"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateHotelLogo(logoUrl: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  await prisma.hotel.update({
    where: { id: session.hotelId },
    data: { logoUrl },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
