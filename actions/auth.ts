"use server";

import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Hotel name is required"),
  owner: z.string().min(2, "Owner name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  gst: z.string().optional(),
  hotelType: z.string().min(1, "Select hotel type"),
  currency: z.string().default("INR"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function registerHotel(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { email, password, name, owner, phone, address, city, state, gst, hotelType, currency } = validated.data;

  const existing = await prisma.hotel.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const hotel = await prisma.hotel.create({
    data: {
      name,
      owner,
      phone,
      email,
      password: hashedPassword,
      address,
      city,
      state,
      gst: gst || null,
      hotelType,
      currency,
    },
  });

  const token = await signJWT({
    hotelId: hotel.id,
    email: hotel.email,
    name: hotel.name,
    role: "Admin",
  });

  const cookieStore = await cookies();
  cookieStore.set("hotelflow_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function loginHotel(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  const hotel = await prisma.hotel.findUnique({ where: { email } });
  if (!hotel) {
    return { error: "Invalid email or password." };
  }

  const isValid = await bcrypt.compare(password, hotel.password);
  if (!isValid) {
    return { error: "Invalid email or password." };
  }

  const token = await signJWT({
    hotelId: hotel.id,
    email: hotel.email,
    name: hotel.name,
    role: "Admin",
  });

  const cookieStore = await cookies();
  cookieStore.set("hotelflow_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function logoutHotel() {
  const cookieStore = await cookies();
  cookieStore.delete("hotelflow_token");
  redirect("/login");
}
