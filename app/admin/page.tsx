import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import AdminUserList from "@/components/AdminUserList";
import { UserCommentManager } from "@/components/UserCommentManager";
import AdminGameLogEditor from "@/components/AdminGameLogEditor";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const currentUser = await  prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  })
  if (!currentUser?.isAdmin) notFound();

   const [users,allLogs,trueLogs ,recentLogsFormEdit ] = await Promise.all([
    prisma.user.findMany({
      include:{visits:true},
      orderBy: { createdAt: "desc" },
    }),
    prisma.gameLog.findMany({
      where: {
        AND: [
          { comment: { not: null } },
          { comment: { not: "" } }
        ]
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.gameLog.findMany({
      where: { 
        NOT: { comment: "AUTO_GENERATED" } 
      },
    })
    ,
    prisma.gameLog.findMany({
      orderBy:{date:"desc"},
      take:140,
      include:{user:{select:{name:true}}}
    }),
   ])


  

  // const users = await prisma.user.findMany({
  //   include:{visits:true},
  //   orderBy: { createdAt: "desc" },
  // });

  // 修正箇所: AND を使って複数の条件（nullでない + 空文字でない）を指定
  // const allLogs = await prisma.gameLog.findMany({
  //   where: {
  //     AND: [
  //       { comment: { not: null } },
  //       { comment: { not: "" } }
  //     ]
  //   },
  //   orderBy: { date: "desc" },
  //   take: 50,
  // });
  // const recentLogsFormEdit = await prisma.gameLog.findMany({
  //   orderBy:{date:"desc"},
  //   take:140,
  //   include:{user:{select:{name:true}}}
  // });
    return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">
          管理画面
        </h1>
      </header>

      <div className="max-w-5xl mx-auto space-y-12">
        <section className="bg-white  shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-500">
              ユーザー管理
            </h2>
            <span className="text-lg font-bold text-slate-500 bg-slate-100 px-3 py-1 ">
              登録数: {users.length} 名
            </span>
          </div>
          <AdminUserList users={users} currentUserId={session.user.id!} />
        </section>
        
        <section className="bg-white shadow-xl border border-slate-100 p-8 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-widest text-slate-500">
            試合データ修正
          </h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">直近の試合内容を修正</h3>
            {recentLogsFormEdit.map((log) => (
              <div key={log.id} className="space-y-1 overflow-scroll max-h-125">
                <span className="text-[10px] text-slate-400 ml-4">User: {log.user.name}</span>
                <AdminGameLogEditor log={log} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white shadow-xl border border-slate-100 p-8">
          <h2 className="text-2xl font-black uppercase tracking-widest text-slate-500 mb-6">
            コメント監視
          </h2>
          <UserCommentManager logs={trueLogs} />
        </section>
     
      </div>
    </main>
  );
}