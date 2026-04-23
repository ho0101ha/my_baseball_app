'use client';

import { adminUpdateVisitDirectly } from "@/actions/admin";
import { useActionState } from "react";


interface ActionState{
  success:boolean;
  error:string | null;

}


interface AdminVisitEditorProps {
  userId:string;
  stadiumId:string;
  initialStats:{
    wins:number;
    losses:number;
    draws:number;
  }
}
  
export default function AdminVisitEditor({ userId, stadiumId, initialStats }: AdminVisitEditorProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
      const stats = {
        wins: parseInt(formData.get("wins") as string) || 0,
        losses: parseInt(formData.get("losses") as string) || 0,
        draws: parseInt(formData.get("draws") as string) || 0,
      };

      if (!window.confirm("集計を直接修正します。調整用ログが1件作成/更新されますがよろしいですか？")) {
        return prevState || { success: false, error: null };
      }

      return await adminUpdateVisitDirectly(userId, stadiumId, stats);
    },
    { success: false, error: null }

 
  );

  const statsFiels = [
    {name:"wins",label:"wins",color:"text-blue-600"},
    {name:"losses",label:"losses",color:"text-red-600"},
    {name:"draws",label:"draws",color:"text-slate-600"},  
   ] as const ;
    return (
      <div className="space-y-2">
        <form action={formAction} 
      className="flex flex-wrap gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-200">
        {statsFiels.map((field)  =>(
          <div key={field.name} className="flex flex-col gap-1">
            <label className={`text-[14px] font-black uppercase px-1 ${field.color}`}>
              {field.label}
            </label>
            <input type="number"
            name={field.name}
            defaultValue={initialStats[field.name]}
            className="w-20 border border-slate-200 rounded-lg p-2 text-sm font-bold text-center shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
           
          </div>
          
        ))}
          <button
             disabled={isPending}
             className="bg-blue-600 text-white font-blck px-6 py-3 rounded-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-30  shadow-lg shadow-blue-200"
             >
              {isPending? "同期中":"集計"}
             </button>
        </form>
         <div className="min-h-[20px] px-2">
          {state.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
          )}
            {state.success && (
            <p className="text-red-500 text-sm">正常に更新されました</p>
          )}
         </div>
      </div>
      
    )
  }
  

