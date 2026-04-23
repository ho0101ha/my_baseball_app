'use client';

import { useActionState, useState } from "react";
import { toggleAdmin, deleteUser } from "@/actions/admin";
import AdminVisitEditor from "./AdminVisitEditor"; // パスは適宜調整してください

interface Visit {
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  visits?: Visit[]; // 修正: Visitデータを受け取れるように拡張
}

export function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [toggleState, toggleFormAction, isTogglePending] = useActionState(
    async () => await toggleAdmin(user.id, user.isAdmin),
    null
  );

  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    async () => {
      if (!window.confirm(`${user.email}を削除しますか？`)) return null;
      return await deleteUser(user.id);
    },
    null
  );

  const isPending = isTogglePending || isDeletePending;

  return (
    <>
      {/* ユーザー基本情報行 */}
      <tr 
        className={`hover:bg-slate-50/50 transition-opacity cursor-pointer ${isPending ? 'opacity-40' : 'opacity-100'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-8 py-5">
          <p className="font-black text-slate-900 leading-tight mb-1">
            {isExpanded ? "▼ " : "▶ "} {user.name || "Unknown"}
          </p>
          <p className="text-[12px] font-bold text-slate-400 italic leading-none">{user.email}</p>
        </td>
        <td className="px-8 py-5 text-center">
          <span className={`text-[12px] font-black px-3 py-1 rounded-full uppercase italic ${
            user.isAdmin ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
          }`}>
            {user.isAdmin ? 'Admin' : 'User'}
          </span>
        </td>
        <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-3">
            {!isSelf ? (
              <>
                <form action={toggleFormAction}>
                  <button
                    disabled={isPending}
                    className={`text-[12px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-30 ${
                      user.isAdmin 
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {user.isAdmin ? "User" : "Admin"}
                  </button>
                </form>
                <form action={deleteFormAction}>
                  <button 
                    disabled={isPending} 
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-30"
                  >
                    🗑️
                  </button>
                </form>
              </>
            ) : (
              <span className="text-[14px] font-black text-slate-300 italic px-4 py-2 tracking-widest uppercase">YOU</span>
            )}
          </div>
        </td>
      </tr>

      {/* エラー表示エリア */}
      {(toggleState?.error || deleteState?.error) && (
        <tr>
          <td colSpan={3} className="px-8 py-2">
            <p className="text-[12px] text-red-500 font-bold text-right italic">
              {toggleState?.error || deleteState?.error}
            </p>
          </td>
        </tr>
      )}

      {/* 展開される集計エディタエリア */}
      {isExpanded && (
        <tr className="bg-slate-50/30">
          <td colSpan={3} className="px-8 py-6 border-l-4 border-blue-500">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest">
                  球場別集計データの直接修正
                </h4>
              </div>

              <div className="grid gap-4">
                {user.visits && user.visits.length > 0 ? (
                  user.visits.map((visit) => (
                    <div key={visit.stadiumId} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-black text-slate-400 mb-3 px-1 italic">
                        📍 {visit.stadiumId}
                      </p>
                      <AdminVisitEditor 
                        userId={user.id} 
                        stadiumId={visit.stadiumId} 
                        initialStats={{
                          wins: visit.wins,
                          losses: visit.losses,
                          draws: visit.draws
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] font-bold text-slate-300 italic ml-4">
                    このユーザーの観戦データはありません。
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}