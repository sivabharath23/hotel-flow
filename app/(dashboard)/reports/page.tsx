import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReportData } from "@/actions/reports";
import { ReportsView } from "@/components/reports/reports-view";

export default async function ReportsPage() {
  const session = await getSession();
  if (!session) return null;

  const [hotel, initialData] = await Promise.all([
    prisma.hotel.findUnique({ where: { id: session.hotelId } }),
    getReportData("7days"),
  ]);

  return <ReportsView initialData={initialData} currency={hotel?.currency || "INR"} />;
}
