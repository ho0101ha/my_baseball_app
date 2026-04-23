"use client";

import {registerAction} from "@/actions/user";
import {useActionState} from "react";

const initialState = {
  success: false,
  error: null,
};
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl border border-slate-100 p-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            Create Account
          </h1>
        </header>

        {/* エラー発生時のアラート表示 */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-black flex items-center gap-2">
            <span className="shrink-0 w-5 h-5 bg-red-600 text-white flex items-center justify-center text-sm">
              !
            </span>
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-black  uppercase tracking-widest ml-4">
              {" "}
              お名前
            </label>
            <input
              name="name"
              type="text"
              required
              disabled={isPending}
              placeholder="山田 太郎"
              className="w-full px-6 py-4 bg-slate-50 border border-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold disabled:opacity-50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-black uppercase tracking-widest ml-4">
              メールアドレス
            </label>
            <input
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder="email@example.com"
              className="w-full px-6 py-4 bg-slate-50 border  border-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold disabled:opacity-50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-black uppercase tracking-widest ml-4">
              パスワード
            </label>
            <input
              name="password"
              type="password"
              required
              disabled={isPending}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 border  border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold disabled:opacity-50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-black uppercase tracking-widest ml-4">
              お気に入りチーム
            </label>
            <div className="relative">
              <select
                name="favoriteTeam"
                disabled={isPending}
                className="w-full px-6 py-4 bg-slate-50 border  border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none disabled:opacity-50 transition-all">
                <option value="">選択しない</option>
                <option value="tigers">阪神タイガース</option>
                <option value="baystars">横浜DeNAベイスターズ</option>
                <option value="giants">読売ジャイアンツ</option>
                <option value="swallows">東京ヤクルトスワローズ</option>
                <option value="dragons">中日ドラゴンズ</option>
                <option value="carp">広島東洋カープ</option>
                <option value="hawks">ソフトバンクホークス</option>
                <option value="figthers">北海道日本ハムファイターズ</option>
                <option value="buffaloes">オリックスバファローズ</option>
                <option value="eagles">楽天ゴールデンイーグルス</option>
                <option value="lions">埼玉西武ライオンズ</option>
                <option value="marines">千葉ロッテマリーンズ</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">
                ↓
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 bg-slate-900 text-white font-black italic tracking-wide hover:bg-blue-600 hover:cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-slate-200 mt-4 disabled:bg-slate-300">
            {isPending ? "ロード中" : "アカウント新規作成 "}
          </button>
        </form>

        <footer className=" text-center pt-6 border-t border-slate-50">
          <p className="text-sm font-bold text-slate-400">
            既にアカウントをお持ちですか？{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline hover:cursor-pointer">
              ログイン
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
