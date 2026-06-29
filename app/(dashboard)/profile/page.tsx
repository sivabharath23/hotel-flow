import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/profile/profile-view";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  const hotel = await prisma.hotel.findUnique({
    where: { id: session.hotelId },
  });

  return <ProfileView hotel={hotel} />;
}
