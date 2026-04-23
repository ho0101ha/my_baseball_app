"use client";

interface ActinState{
  success:boolean;
  error:string | null
}

import { adminUpdateGameLogWithSync } from '@/actions/admin';
import  { useActionState } from 'react'


export default function AdminGameLogEditor({log}:{log:{id:string;result:string;opponent:string | null; date:Date | string }}) {
  const [state,formAction,isPending] = useActionState(
    async (prevState:ActinState | null,formData:FormData):Promise<ActinState> =>{
      return await adminUpdateGameLogWithSync(log.id,{
        result:formData.get("result") as string,
        opponent:formData.get("opponent") as string,
        date: new Date(formData.get("date") as string),
      });
    }
  ,{success:false,error:null});
  return (
    <form
    action={formAction}
    className="flex flex-wrap gap-2 items-center p-3 bg-white  border border-slate-100 shadow-sm">
      <input type='date' 
      name='date'
      defaultValue={new Date(log.date).toISOString().split("T")[0]}
      className='text-xs border  p-2 outline-none focus:ring-2 focus:ring-blue-500"'
      />
      <select
      name='result'
      defaultValue={log.result}
      className='text-xs border  p-2 font-bold bg-slate-50'
      >
      <option value="勝">勝</option>
      <option value="負">負</option>
      <option value="分">分</option>
      </select>
      <input
      type='text'
      name='opponent'
      defaultValue={log.opponent  || ""}
      placeholder='対戦相手'
      className='text-xs border  p-2 w-32'
      />

      <button 
      disabled={isPending}
      className="bg-slate-900 text-white text-[14px] font-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-30"
      >
       {isPending? "同期中":"保存"}
      </button>
      {state.error  && <p className='text-red-500 text-[12px] font-bold'>
        {state.error}
        </p>}
    </form>
  );
}
