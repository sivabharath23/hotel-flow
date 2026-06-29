import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SalesView } from "@/components/sales/sales-view";

export default async function SalesPage() {
  const session = await getSession();
  if (!session) return null;

  const [hotel, sales] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: session.hotelId } }),
    prisma.sale.findMany({
      where: { hotelId: session.hotelId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <SalesView sales={sales} currency={hotel?.currency || "INR"} />;
}
