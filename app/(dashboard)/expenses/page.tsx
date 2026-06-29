import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExpensesView } from "@/components/expenses/expenses-view";

export default async function ExpensesPage() {
  const session = await getSession();
  if (!session) return null;

  const [hotel, expenses] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: session.hotelId } }),
    prisma.expense.findMany({
      where: { hotelId: session.hotelId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <ExpensesView expenses={expenses} currency={hotel?.currency || "INR"} />;
}
