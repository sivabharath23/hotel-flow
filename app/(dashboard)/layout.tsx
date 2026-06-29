import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: session.hotelId },
    select: { name: true, hotelType: true, logoUrl: true, owner: true },
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <Sidebar logoUrl={hotel?.logoUrl} hotelName={hotel?.name} ownerName={hotel?.owner} />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header hotelName={hotel?.name} hotelType={hotel?.hotelType} />
        <main className="flex-1 p-3 md:p-5 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
