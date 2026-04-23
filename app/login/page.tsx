"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/user";
import { ActionState } from "@/actions/user";
import Link from "next/link";

const initialState: ActionState = {
  success: false,
  error: null,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl border border-slate-100 p-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            Login
          </h1>
          <p className="text-slate-400 text-sm font-bold mt-2">
            ログイン
          </p>
        </header>

        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black rounded-2xl flex items-center gap-2">
            <span className="shrink-0 w-5 h-5 bg-red-600 text-white  flex items-center justify-center text-[10px]">!</span>
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
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
              className="w-full px-6 py-4 bg-slate-50 border  border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold disabled:opacity-50 transition-all"
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


          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 bg-slate-900 text-white font-black italic tracking-wide hover:bg-blue-600 hover:cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-slate-200 mt-4 disabled:bg-slate-300">
            {isPending ? "ロード中" : "ログイン "}
          </button>
        </form>

        <footer className="mt-10 text-center pt-6 border-t border-slate-50">
          <p className="text-sm font-bold text-slate-400">
            アカウントをお持ちでないですか？{" "}
            <Link href="/register" className="text-blue-600 hover:underline">SIGN UP</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}