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
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar logoUrl={hotel?.logoUrl} hotelName={hotel?.name} ownerName={hotel?.owner} />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Header hotelName={hotel?.name} hotelType={hotel?.hotelType} />
        <main className="flex-1 overflow-y-auto p-3 md:p-5 pb-24 md:pb-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full space-y-5">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
