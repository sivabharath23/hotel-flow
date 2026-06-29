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

export async function updateHotelProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const owner = formData.get("owner") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const gst = formData.get("gst") as string;
  const hotelType = formData.get("hotelType") as string;
  const currency = formData.get("currency") as string;

  if (!name || !owner || !phone || !email || !address || !city || !state || !hotelType) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await prisma.hotel.update({
      where: { id: session.hotelId },
      data: {
        name,
        owner,
        phone,
        email,
        address,
        city,
        state,
        gst: gst || null,
        hotelType,
        currency: currency || "INR",
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { error: "Email address is already registered by another property." };
    }
    return { error: "Failed to update hotel profile." };
  }
}
