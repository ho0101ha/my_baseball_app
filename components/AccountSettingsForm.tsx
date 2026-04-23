"use client";

import { updateAccountAction } from "@/actions/user";
import { TEAMS } from "@/lib/stadiums";
import React, { useActionState } from "react";

interface AccountSettingsFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    favoriteTeam: string | null;
  };
}

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateAccountAction,
    null
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 ">
      <form action={formAction} className="bg-white  shadow-2xl border border-slate-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-slate-900 p-8 md:p-10 text-white">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">アカウント設定</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">プロフィールとセキュリティ設定</p>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          {/* プロフィール設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-400 uppercase ml-2 tracking-widest">お名前</label>
              <input 
                name="name" 
                defaultValue={user.name ?? ""} 
                className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6  font-bold outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-400 uppercase ml-2 tracking-widest">応援チーム</label>
              <div className="relative">
                <select 
                  name="favoriteTeam" 
                  defaultValue={user.favoriteTeam ?? ""}
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6  font-bold outline-none appearance-none focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="">設定無し</option>
                  {TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">メールアドレス</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={user.email ?? ""} 
              className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6  font-bold outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* パスワード設定セクション */}
          <div className="pt-8 mt-8 border-t border-slate-100">
            <div className="bg-slate-50 p-6 md:p-8  border border-slate-100 space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600  inline-block"></span>
                パスワード設定
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-slate-400 uppercase ml-2 tracking-widest">新しいパスワード</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full bg-white border-2 border-slate-100 py-4 px-6  font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-blue-600 uppercase ml-2 tracking-widest italic">現在のパスワード</label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    className="w-full bg-white border-2 border-blue-100 py-4 px-6  font-bold outline-none focus:border-blue-600 transition-all shadow-sm shadow-blue-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* エラー・成功メッセージ */}
          <div className="min-h-6">
            {state?.error && (
              <p className="bg-red-50 text-red-500 text-xs font-bold py-3 px-6 rounded-xl border border-red-100 text-center uppercase tracking-tight">
                {state.error}
              </p>
            )}
            {state?.success && (
              <p className="bg-emerald-50 text-emerald-600 text-xs font-bold py-3 px-6 rounded-xl border border-emerald-100 text-center uppercase tracking-tight">
                変更が完了しました
              </p>
            )}
          </div>

          {/* 送信ボタン */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-slate-900 text-white py-5 rounded-l font-black italic uppercase tracking-tighter text-xl shadow-xl hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:cursor-not-allowed
            hover:opacity-50"
          >
            {isPending ? "変更中・・・" : "変更"}
          </button>
        </div>
      </form>
    </div>
  );
}