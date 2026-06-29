import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InvestmentsView } from "@/components/investments/investments-view";

export default async function InvestmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [hotel, investments] = await Promise.all([
    prisma.hotel.findUnique({
      where: { id: session.hotelId },
      select: { currency: true },
    }),
    prisma.investment.findMany({
      where: { hotelId: session.hotelId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <InvestmentsView initialInvestments={investments} currency={hotel?.currency || "INR"} />;
}
