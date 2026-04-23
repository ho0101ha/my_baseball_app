// app/log/page.tsx

import { NPB_STADIUMS } from "@/lib/stadiums";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogForm from "@/components/LogForm"; // ここでインポート
import { auth } from "@/lib/auth";

export default async function LogPage() {
  const session = await auth();
  
  // ログインしていない場合はリダイレクト
  if (!session?.user?.id) {
    redirect("/login");
  }

  // ログインユーザーの訪問データを取得
  const userVisits = await prisma.visit.findMany({
    where: { userId: session.user.id },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">
            Game Record
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2">
            観戦成績の更新
          </p>
        </header>

        <div className="space-y-4">
          {NPB_STADIUMS.map((stadium) => {
            // 現在の球場に対応するデータを特定
            const currentVisit = userVisits.find(
              (v) => v.stadiumId === stadium.id
            );

            return (
              <LogForm 
                key={stadium.id} 
                stadium={stadium} 
                current={currentVisit} 
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}