import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DynamicAppIcon } from "@/components/ui/dynamic-app-icon";

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
    select: { name: true, hotelType: true, logoUrl: true },
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <DynamicAppIcon logoUrl={hotel?.logoUrl} />
      <Sidebar logoUrl={hotel?.logoUrl} />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header hotelName={hotel?.name} hotelType={hotel?.hotelType} logoUrl={hotel?.logoUrl} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
