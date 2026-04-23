"use client";

import { updateGameAction } from "@/actions/actions";
import { GameResult } from "@/lib/constants";
import { useActionState, useRef } from "react";

const results = [
{ val: GameResult.WIN, label: '勝', color: 'peer-checked:bg-blue-600 peer-checked:text-white' },
{ val: GameResult.LOSS, label: '負', color: 'peer-checked:bg-red-500 peer-checked:text-white' },
{ val: GameResult.DRAW, label: '分', color: 'peer-checked:bg-slate-500 peer-checked:text-white' },
];
export default function EditLogModal({log}:{log:any}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [state,originalAction,isPending] = useActionState(updateGameAction,null);

    const wrappdeAction = async (formData:FormData) =>{
      await originalAction(formData);
     dialogRef.current?.close();
    }
  return (
    <>
    <button onClick={() =>dialogRef.current?.showModal()}
       className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        </button>
        <dialog ref={dialogRef}
        className="rounded-[2.5rem] shadow-2xl p-0 w-full max-w-md mt-10 mx-auto backdrop:backdrop-blur-sm backdrop:bg-slate-900/50 outline-none">
          <div className="p-8">
            <div className="flex justify-between items-center pb-6">
              <h3 className="text-xl font-black italic text-slate-800 uppercase tracking-tighter">
                 EDIT</h3>
              <button onClick={()=>dialogRef.current?.close()}
                 className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
            </div>
            <form action={wrappdeAction} className="space-y-5">
              <input type="hidden" name="logId" value={log.id}/>
              <div>
                <label className="block  font-black text-slate-400 uppercase mb-1 ml-1">日付</label>
                <input type="date" name="date"   defaultValue={new Date(log.date).toISOString().split('T')[0]} required
                  className="w-full bg-slate-50 border-2 border-slate-100 py-3 px-5 rounded-2xl font-bold outline-none"/>
              </div>
              {/* <div>
                <label className="block  font-black text-slate-400 uppercase mb-1 ml-1"></label>
                <select name="opponent" defaultValue={log.opponent || ""}
                  className="w-full bg-slate-50 border-2 border-slate-100 py-3 px-5 rounded-2xl font-bold outline-none appearance-none">
                  {TEAMS.map((team) =>(
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div> */}
              <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Result</label>
              <div className="grid grid-cols-3 gap-3">
                {results.map((item) => (
                  <label key={item.val} className="cursor-pointer">
                    <input
                      type="radio"
                      name="result"
                      value={item.val}
                      className="hidden peer"
                      defaultChecked={log.result === item.val}
                    />
                    <div className={`text-center py-3 rounded-2xl font-black bg-slate-100 text-slate-400 transition-all ${item.color}`}>
                      {item.label}
                    </div>
                  </label>
                ))}
              </div>
              </div>
              <div>
              <label className="block  font-black text-slate-400 uppercase mb-1 ml-1">コメント</label>
              <textarea
                name="comment"
                defaultValue={log.comment || ""}
                className="w-full bg-slate-50 border-2 border-slate-100 py-3 px-5 rounded-2xl font-bold outline-none h-24 resize-none"
              />
            </div>
            <div>
              <label className="block  font-black text-slate-400 uppercase mb-1 ml-1">球場飯</label>
              <textarea
                name="food"
                defaultValue={log.food || ""}
                className="w-full bg-slate-50 border-2 border-slate-100 py-3 px-5 rounded-2xl font-bold outline-none h-24 resize-none"
              />
            </div>

            {state?.error && (
              <p className="text-red-500 text-xs font-bold text-center">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black italic shadow-lg disabled:bg-slate-400 transition-all active:scale-95"
            >
                {isPending? "ロード中" : "更新"}</button>
            </form>
          </div>
        </dialog>
        </>
  )
}

