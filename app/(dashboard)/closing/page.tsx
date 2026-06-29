import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFinancials } from "@/lib/calculations";
import { formatDateString } from "@/lib/utils";
import { ClosingView } from "@/components/closing/closing-view";

export default async function ClosingPage() {
  const session = await getSession();
  if (!session) return null;

  const todayStr = formatDateString(new Date());
  const startOfDay = new Date(todayStr + "T00:00:00.000Z");
  const endOfDay = new Date(todayStr + "T23:59:59.999Z");

  const [hotel, openingObj, sales, expenses, investments, closingObj] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: session.hotelId } }),
    prisma.openingBalance.findUnique({
      where: { hotelId_date: { hotelId: session.hotelId, date: todayStr } },
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
    prisma.investment.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
    prisma.closingBalance.findUnique({
      where: { hotelId_date: { hotelId: session.hotelId, date: todayStr } },
    }),
  ]);

  const openingBalance = openingObj?.amount || 0;
  const financials = calculateFinancials({ openingBalance, sales, expenses, investments });

  return (
    <ClosingView
      expectedCash={financials.cashInHand}
      existingClosing={closingObj}
      currency={hotel?.currency || "INR"}
    />
  );
}
