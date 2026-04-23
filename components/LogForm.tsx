"use client";

import { useActionState } from "react";
import { updateVisitAction, type FormState } from "@/actions/actions";

interface LogFormProps {
  stadium: { id: string; name: string; team: string };
  current?: { wins: number; losses: number; draws: number };
}

export default function LogForm({ stadium, current }: LogFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateVisitAction,
    null
  );

  return (
    <form 
      action={formAction}
      className="bg-white p-6  border border-slate-200 shadow-sm flex flex-wrap md:flex-nowrap items-center justify-between gap-6 hover:shadow-md transition-shadow"
    >
      <input type="hidden" name="stadiumId" value={stadium.id} />
      
      {/* 球場情報セクション */}
      <div className="w-full md:w-1/3">
        <h3 className="font-bold text-slate-900">{stadium.name}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase">{stadium.team}</p>
        {state?.success && <p className="text-[10px] text-green-600 font-bold mt-1">✓ {state.message}</p>}
        {state?.error && <p className="text-[10px] text-red-600 font-bold mt-1">× {state.error}</p>}
      </div>

      {/* 入力項目セクション：mapを使わず直接記述 */}
      <div className="flex items-center gap-4 flex-1">
        {/* WINS */}
        <div className="flex-1 text-center">
          <p className=" font-black text-blue-500 mb-1">勝</p>
          <input 
            type="number" 
            name="wins" 
            defaultValue={current?.wins ?? 0} 
            min="0"
            className="w-full bg-slate-50 border-none text-center font-bold py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LOSSES */}
        <div className="flex-1 text-center">
          <p className=" font-black text-red-500 mb-1">負</p>
          <input 
            type="number" 
            name="losses" 
            defaultValue={current?.losses ?? 0} 
            min="0"
            className="w-full bg-slate-50 border-none  text-center font-bold py-2 focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* DRAWS */}
        <div className="flex-1 text-center">
          <p className="  font-black text-slate-400 mb-1">分</p>
          <input 
            type="number" 
            name="draws" 
            defaultValue={current?.draws ?? 0} 
            min="0"
            className="w-full bg-slate-50 border-none text-center font-bold py-2 focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <button 
        type="submit"
        disabled={isPending}
        className={`w-full md:w-auto px-6 py-3 mt-7 rounded-l text-white text-xs font-black transition-colors ${
          isPending ? "bg-slate-400" : "bg-slate-900 hover:bg-blue-600"
        }`}
      >
        {isPending ? "保存中..." : "保存"}
      </button>
    </form>
  );
}