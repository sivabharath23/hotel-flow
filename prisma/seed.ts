import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("123456", 10);

  const hotel = await prisma.hotel.upsert({
    where: { email: "admin@hotelflow.com" },
    update: {},
    create: {
      name: "Grand Palace Resort",
      owner: "Sivabalan",
      phone: "9876543210",
      email: "admin@hotelflow.com",
      password: hashedPassword,
      address: "123 Beach Road",
      city: "Chennai",
      state: "Tamil Nadu",
      gst: "33AAAAA0000A1Z5",
      hotelType: "Hotel",
      currency: "INR",
    },
  });

  console.log("Created demo hotel:", hotel.name);

  const todayStr = new Date().toISOString().split("T")[0];

  // Seed opening balance
  await prisma.openingBalance.upsert({
    where: { hotelId_date: { hotelId: hotel.id, date: todayStr } },
    update: {},
    create: {
      hotelId: hotel.id,
      date: todayStr,
      amount: 5000,
      isLocked: true,
    },
  });

  // Seed sales
  await prisma.sale.createMany({
    data: [
      { hotelId: hotel.id, amount: 1500, paymentMethod: "CASH", description: "Room 101 Booking", notes: "Breakfast included" },
      { hotelId: hotel.id, amount: 850, paymentMethod: "UPI", description: "Restaurant Dinner Bill #42" },
      { hotelId: hotel.id, amount: 2300, paymentMethod: "CARD", description: "Room 204 Suite Stay" },
      { hotelId: hotel.id, amount: 450, paymentMethod: "CASH", description: "Coffee & Snacks" },
    ],
  });

  // Seed expenses
  await prisma.expense.createMany({
    data: [
      { hotelId: hotel.id, amount: 1200, category: "VEGETABLES", paymentMethod: "CASH", description: "Fresh Market Produce" },
      { hotelId: hotel.id, amount: 450, category: "Water Can", paymentMethod: "UPI", description: "Drinking Water Supply" },
      { hotelId: hotel.id, amount: 900, category: "GAS", paymentMethod: "BANK", description: "Commercial Cooking Gas Cylinder" },
    ],
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
