// app/map/page.tsx

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MapWrapper from "@/components/MapWrapper";
import { auth } from "@/lib/auth";

export default async function MapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // DBからユーザーの全観戦データを取得
  const userVisits = await prisma.visit.findMany({
    where: { userId: session.user.id },
  });

  return (
    <main className="h-screen w-full flex flex-col bg-slate-50">
      <MapWrapper userVisits={userVisits} />
    </main>
  );
}