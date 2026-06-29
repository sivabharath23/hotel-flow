import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const hotel = await prisma.hotel.findUnique({
    where: { id: session.hotelId },
  });

  return <ProfileView hotel={hotel} />;
}
