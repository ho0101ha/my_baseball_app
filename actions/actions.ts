"use server";

import {prisma} from "@/lib/prisma";

import {revalidatePath} from "next/cache";
import {auth} from "../lib/auth";
import {GameResult} from "@/lib/constants";
import {NPB_STADIUMS} from "@/lib/stadiums";

// 戻り値の型を定義
export type FormState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

// 第1引数に prevState (state) を必ず入れる
export async function updateVisitAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "認証が必要です" };

  const stadiumId = formData.get("stadiumId") as string;
  const wins = parseInt(formData.get("wins") as string) || 0;
  const losses = parseInt(formData.get("losses") as string) || 0;
  const draws = parseInt(formData.get("draws") as string) || 0;
  const userId = session.user.id;

  const stadiumInfo = NPB_STADIUMS.find((s) => s.id === stadiumId);
  const opponentName = stadiumInfo ? stadiumInfo.team : "未設定";

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Visit (スタジアムの通算成績) を更新
      await tx.visit.upsert({
        where: { userId_stadiumId: { userId, stadiumId } },
        update: { wins, losses, draws },
        create: { userId, stadiumId, wins, losses, draws },
      });

      // 2. この球場の「自動生成ログ」のみを一旦すべて削除
      await tx.gameLog.deleteMany({
        where: { 
          userId, 
          stadiumId, 
          comment: "AUTO_GENERATED" 
        },
      });

      
      const trueLogs = await tx.gameLog.findMany({
        where: { 
          userId, 
          stadiumId, 
          NOT: { comment: "AUTO_GENERATED" } 
        },
      });

      const trueWins = trueLogs.filter((l) => l.result === GameResult.WIN).length;
      const trueLosses = trueLogs.filter((l) => l.result === GameResult.LOSS).length;
      const trueDraws = trueLogs.filter((l) => l.result === GameResult.DRAW).length;

      // 4. 足りない分（ユーザー指定合計 - 詳細ログ数）を計算して補填
      const createDiffLogs = async (count: number, result: string) => {
        if (count <= 0) return;
        const data = Array.from({ length: count }).map(() => ({
          userId,
          stadiumId,
          result,
          opponent: opponentName,
          comment: "AUTO_GENERATED", // リスト非表示用
          date: new Date(),
        }));
        await tx.gameLog.createMany({ data });
      };

      // 計算式: (画面で入力した合計値) - (既に存在している詳細ログの数)
      await createDiffLogs(wins - trueWins, GameResult.WIN);
      await createDiffLogs(losses - trueLosses, GameResult.LOSS);
      await createDiffLogs(draws - trueDraws, GameResult.DRAW);
    });

    revalidatePath(`/stadiums/${stadiumId}`);
    revalidatePath("/");
    return { success: true, message: "数値を同期しました！" };
  } catch (e) {
    console.error(e);
    return { success: false, error: "保存に失敗しました" };
  }
}

export async function addGameAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return {success: false, error: "認証されていません"};

  const stadiumId = formData.get("stadiumId") as string;
  const result = formData.get("result") as string;
  const dateStr = formData.get("date") as string; // 日付を取得
  const userId = session.user.id;
  const comment = formData.get("comment") as string;
  const opponent = formData.get("opponent") as string;
  const food = formData.get("food") as string;

  // 文字列をDateオブジェクトに変換（入力がない場合は今日にする）
  const gameDate = dateStr ? new Date(dateStr) : new Date();
  try {
    await prisma.$transaction(async (tx) => {
      await tx.gameLog.create({
        data: {
          userId,
          stadiumId,
          result,
          comment,
          date: gameDate, // 入力された日付を使用
          opponent,
          food,
        },
      });

      // 2. 集計 (Visit) を更新
      await tx.visit.upsert({
        where: {userId_stadiumId: {userId, stadiumId}},
        update: {
          wins: result === GameResult.WIN ? {increment: 1} : undefined,
          losses: result === GameResult.LOSS ? {increment: 1} : undefined,
          draws: result === GameResult.DRAW ? {increment: 1} : undefined,
        },
        create: {
          userId,
          stadiumId,
          wins: result === GameResult.WIN ? 1 : 0,
          losses: result === GameResult.LOSS ? 1 : 0,
          draws: result === GameResult.DRAW ? 1 : 0,
        },
      });
    });

    revalidatePath(`/stadiums/${stadiumId}`);
    return {success: true, message: "保存しました！"};
  } catch (error) {
    console.log(error);
    return {success: false, error: "保存に失敗しました"};
  }
  // 1. 履歴 (GameLog) を作成
}

export async function deleteGameLogAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  const logId = formData.get("logId") as string;
  if (!session?.user?.id) {
    return {success: false, error: "認証が必要です"};
  }
  const userId = session.user.id;
  const log = await prisma.gameLog.findUnique({
    where: {id: logId},
  });

  if (!log || log.userId !== session.user.id) {
    return {success: false, error: "権限がありません"};
  }
  try {
    await prisma.$transaction(async (tx) => {
      await tx.visit.update({
        where: {
          userId_stadiumId: {
            userId: userId,
            stadiumId: log.stadiumId,
          },
        },
        data: {
          wins: log.result === GameResult.WIN ? {decrement: 1} : undefined,
          losses: log.result === GameResult.LOSS ? {decrement: 1} : undefined,
          draws: log.result === GameResult.DRAW ? {decrement: 1} : undefined,
        },
      });
      await tx.gameLog.delete({
        where: {id: logId},
      });
    });

    revalidatePath(`/stadiums/${log.stadiumId}`);
    revalidatePath("/");
    return {success: true, message: "削除に成功しました"};
  } catch (error) {
    return {success: false, error: "削除に失敗しました"};
  }
}

export async function updateGameAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) return {success: false, error: "認証されていません"};

  const logId = formData.get("logId") as string;
  // const stadiumId = formData.get("stadiumId") as string;
  const result = formData.get("result") as string;
  const dateStr = formData.get("date") as string; // 日付を取得
  const userId = session.user.id;
  const comment = formData.get("comment") as string;
  const food = formData.get("food") as string;

  // const opponent = formData.get("opponent") as string;

  // 文字列をDateオブジェクトに変換（入力がない場合は今日にする）
  const gameDate = dateStr ? new Date(dateStr) : new Date();

  try {
    await prisma.$transaction(async (tx) => {
      const oldLog = await tx.gameLog.findUnique({
        where: {id: logId},
      });

      if (!oldLog || oldLog.userId !== userId) {
        return {success: false, error: "認証に失敗しました"};
      }
      await tx.visit.update({
        where: {userId_stadiumId: {userId, stadiumId: oldLog.stadiumId}},
        data: {
          wins: oldLog.result === GameResult.WIN ? {decrement: 1} : undefined,
          losses:
            oldLog.result === GameResult.LOSS ? {decrement: 1} : undefined,
          draws: oldLog.result === GameResult.DRAW ? {decrement: 1} : undefined,
        },
      });

      // 2. 集計 (Visit) を更新
      await tx.visit.update({
        where: {userId_stadiumId: {userId, stadiumId: oldLog.stadiumId}},
        data: {
          wins: result === GameResult.WIN ? {increment: 1} : undefined,
          losses: result === GameResult.LOSS ? {increment: 1} : undefined,
          draws: result === GameResult.DRAW ? {increment: 1} : undefined,
        },
      });

      await tx.gameLog.update({
        where: {id: logId},
        data: {
          result,
          comment,
          date: gameDate,
          food,
          // opponent,
        },
      });
    });
    const log = await prisma.gameLog.findUnique({
      where: {id: logId},
      select: {stadiumId: true},
    });
    if (log) revalidatePath(`/stadiums/${log.stadiumId}`);
    revalidatePath("/");
    return {success: true, message: "更新に成功しました！"};
  } catch (error) {
    console.log(error);
    return {success: false, error: "更新に失敗しました"};
  }
  // 1. 履歴 (GameLog) を作成
}
