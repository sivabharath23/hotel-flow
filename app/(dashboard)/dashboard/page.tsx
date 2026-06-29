import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateFinancials } from "@/lib/calculations";
import { formatDateString } from "@/lib/utils";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const todayStr = formatDateString(new Date());
  const startOfDay = new Date(todayStr + "T00:00:00.000Z");
  const endOfDay = new Date(todayStr + "T23:59:59.999Z");

  const [hotel, openingObj, sales, expenses, closingObj] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: session.hotelId } }),
    prisma.openingBalance.findUnique({
      where: { hotelId_date: { hotelId: session.hotelId, date: todayStr } },
    }),
    prisma.sale.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.expense.findMany({
      where: {
        hotelId: session.hotelId,
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.closingBalance.findUnique({
      where: { hotelId_date: { hotelId: session.hotelId, date: todayStr } },
    }),
  ]);

  const openingBalance = openingObj?.amount || 0;
  const financials = calculateFinancials({ openingBalance, sales, expenses });

  const closingInfo = closingObj
    ? {
        isClosed: true,
        actualCash: closingObj.actualCash,
        difference: closingObj.difference,
        status: closingObj.status,
      }
    : { isClosed: false };

  return (
    <DashboardView
      financials={financials}
      closingInfo={closingInfo}
      currency={hotel?.currency || "INR"}
      recentSales={sales}
      recentExpenses={expenses}
    />
  );
}
