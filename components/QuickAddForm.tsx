"use client";

import { addGameAction } from "@/actions/actions";
import { GameResult } from "@/lib/constants";
import { TEAMS, NPB_STADIUMS } from "@/lib/stadiums";
import { useActionState } from "react";

export default function QuickAddForm({ stadiumId }: { stadiumId?: string }) {
  const [state, formAction, isPending] = useActionState(addGameAction, null);

  return (
    <section className="bg-slate-900 p-8 shadow-2xl border-b-4 border-blue-600">
      <h3 className="text-xl font-black text-white mb-8 text-center uppercase tracking-[0.3em]">
        観戦記録追加
      </h3>
      <form action={formAction} className="max-w-xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 球場選択 */}
          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Stadium</label>
            {stadiumId ? (
              <>
                <input type="hidden" name="stadiumId" value={stadiumId} />
                <div className="bg-slate-800 text-white px-4 py-3 font-bold border border-slate-700">
                  {NPB_STADIUMS.find(s => s.id === stadiumId)?.name}
                </div>
              </>
            ) : (
              <select
                name="stadiumId"
                required
                className="bg-white border-none font-bold px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">球場を選択</option>
                {NPB_STADIUMS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="bg-white border-none font-bold px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Opponent</label>
            <select
              name="opponent"
              disabled={isPending}
              className="bg-white border-none font-bold px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none w-full appearance-none cursor-pointer">
              <option value="">未選択</option>
              {TEAMS.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Stadium Food</label>
            <input
              name="food"
              placeholder="何食べた？"
              className="bg-white border-none font-bold px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Comment</label>
          <input
            type="text"
            name="comment"
            placeholder="今日のひとことメモ"
            className="bg-white border-none font-bold px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" name="result" value={GameResult.WIN} disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 font-black text-xl shadow-lg transition-all active:scale-95">勝</button>
          <button type="submit" name="result" value={GameResult.LOSS} disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 font-black text-xl shadow-lg transition-all active:scale-95">負</button>
          <button type="submit" name="result" value={GameResult.DRAW} disabled={isPending}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-4 font-black text-xl shadow-lg transition-all active:scale-95">分</button>
        </div>

        {state?.error && <p className="text-red-400 text-center font-bold text-sm mt-4">{state.error}</p>}
      </form>
    </section>
  );
}