"use server";

import {auth} from "@/lib/auth";
import {GameResult} from "@/lib/constants";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

interface ActionState {
  success: boolean;
  error: string | null;
}
export async function checkAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {success: false, error: "認証が必要です"};
  }
  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    select: {isAdmin: true},
  });
  if (!user?.isAdmin) {
    return {success: false, error: "権限がありません"};
  }
}

export async function deleteUser(userId: string) {
  await checkAdmin();

  try {
    await prisma.user.delete({
      where: {id: userId},
    });
    revalidatePath("/admin");
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error: "削除に失敗しました"};
  }
}
export async function toggleAdmin(userId: string, currentStatus: boolean) {
  await checkAdmin();

  try {
    await prisma.user.update({
      where: {id: userId},
      data: {isAdmin: !currentStatus},
    });
    revalidatePath("/admin");
    return {sucess: true};
  } catch (error) {
    console.log(error);
    return {success: false, error: "権限の変更に失敗しました"};
  }
}

export async function adminDeleteComment(logId: string) {
  const error = await checkAdmin();
  if (error) return {success: false, error: " 認証が必要です"};
  try {
    await prisma.gameLog.update({
      where: {id: logId},
      data: {comment: "このコメントを管理者により削除されました"},
    });
    revalidatePath("/admin");
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error: "コメントの削除に失敗しました"};
  }
}

export async function adminUpdateGameLogWithSync(
  logId: string,
  data: {result: string; opponent?: string; date: Date}
): Promise<ActionState> {
  const adminError = await checkAdmin();
  if (adminError) return {success: false, error: "認証が必要です"};

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 指定されたログを更新
      const updatedLog = await tx.gameLog.update({
        where: {id: logId},
        data: {
          result: data.result,
          opponent: data.opponent,
          date: data.date,
        },
      });

      // 2. そのユーザー・球場の全てのログを取得して再集計
      const allLogs = await tx.gameLog.findMany({
        where: {
          userId: updatedLog.userId,
          stadiumId: updatedLog.stadiumId,
        },
      });

      const wins = allLogs.filter((l) => l.result === GameResult.WIN).length;
      const losses = allLogs.filter((l) => l.result === GameResult.LOSS).length;
      const draws = allLogs.filter((l) => l.result === GameResult.DRAW).length;

      // 3. Visitテーブルを最新の状態に更新（または作成）
      await tx.visit.upsert({
        where: {
          userId_stadiumId: {
            userId: updatedLog.userId,
            stadiumId: updatedLog.stadiumId,
          },
        },
        update: {wins, losses, draws},
        create: {
          userId: updatedLog.userId,
          stadiumId: updatedLog.stadiumId,
          wins,
          losses,
          draws,
        },
      });
    });

    revalidatePath("/admin");
    return {success: true, error: null};
  } catch (error) {
    console.error("Transaction Error:", error);
    return {success: false, error: "データの同期更新に失敗しました"};
  }
}

export async function adminUpdateVisitDirectly(
    userId: string,
    stadiumId: string,
    stats: { wins: number; losses: number; draws: number }
  ): Promise<ActionState> {
    const adminError = await checkAdmin();
    if (adminError) return adminError;
  
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Visit (集計テーブル) の更新
        await tx.visit.upsert({
          where: { userId_stadiumId: { userId, stadiumId } },
          update: stats,
          create: { userId, stadiumId, ...stats },
        });
  
        // 2. 調整用ログの処理
        // 「管理者が直接数値をいじった」という証拠として、特別なコメント付きのログを1つ用意します
        const adjustmentComment = "ADMIN_ADJUSTMENT";
        
        // 既存の調整用ログがあるか確認
        const existingAdjustment = await tx.gameLog.findFirst({
          where: {
            userId,
            stadiumId,
            comment: adjustmentComment
          }
        });
  
        const resultText = `勝:${stats.wins} 負:${stats.losses} 分:${stats.draws}`;
  
        if (existingAdjustment) {
          // 既存の調整ログを更新
          await tx.gameLog.update({
            where: { id: existingAdjustment.id },
            data: {
              result: "分", // 集計用なので固定値、または特定の意味を持たせない
              comment: adjustmentComment,
              opponent: `管理者による一括修正: ${resultText}`,
              date: new Date(),
            }
          });
        } else {
          // 新しく調整ログを作成
          await tx.gameLog.create({
            data: {
              userId,
              stadiumId,
              result: "分",
              opponent: `管理者による一括修正: ${resultText}`,
              comment: adjustmentComment,
              date: new Date(),
            }
          });
        }
      });
  
      revalidatePath("/admin");
      return { success: true, error: null };
    } catch (error) {
      console.error("Direct Update Transaction Error:", error);
      return { success: false, error: "集計およびログの更新に失敗しました" };
    }
  }
  
  