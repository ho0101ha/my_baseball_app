'use client';

import { useActionState } from "react";
import { adminDeleteComment } from "@/actions/admin";

interface ActionState {
  success: boolean;
  error: string | null;
}

interface GameLog {
  id: string;
  date: Date | string;
  stadiumId: string;
  comment: string | null;
}

export function UserCommentManager({ logs }: { logs: GameLog[] }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
      const logId = formData.get("logId") as string;
      
      if (!window.confirm("このコメントを不適切として削除しますか？")) {
        return prevState || { success: false, error: null };
      }
      
      const result = await adminDeleteComment(logId);

      // --- ここで型の不一致を解消 ---
      // result.error が undefined の場合に確実に null を入れる
      return {
        success: result.success,
        error: result.error ?? null 
      };
    },
    { success: false, error: null }
  );

  return (
    <div className={`mt-6 space-y-3 border-t pt-5 ${isPending ? 'opacity-50' : ''}`}>
      <header>
        <h4 className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-widest">
          コメント監視・ブロック
        </h4>
      </header>

      {state.error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4">
          <p className="text-xs text-red-600 font-bold italic">
            エラー: {state.error}
          </p>
        </div>
      )}
      
      {logs.filter(log => log.comment).length > 0 ? (
        logs.map(log => log.comment && (
          <article key={log.id} className="flex items-start justify-between bg-slate-50 p-4  border border-slate-100">
            <div className="flex-1 mr-4">
              <p className="text-[10px] text-slate-400 font-bold mb-1 italic">
                {new Date(log.date).toLocaleDateString('ja-JP')} / {log.stadiumId}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                {log.comment}
              </p>
            </div>

            <form action={formAction}>
              <input type="hidden" name="logId" value={log.id} />
              <button
                disabled={isPending}
                className="shrink-0 text-[14px] font-black bg-white border border-red-100 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-30"
              >
                {isPending ? "処理中..." : "削除"}
              </button>
            </form>
          </article>
        ))
      ) : (
        <p className="text-[10px] font-bold text-slate-300 italic px-2">投稿されたコメントはありません</p>
      )}
    </div>
  );
}