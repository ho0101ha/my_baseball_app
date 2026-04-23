"use client";

import { deleteGameLogAction } from "@/actions/actions";
import { useActionState } from "react";


interface DeleteLogButtonProps{
    logId:string;
}

export default function DeleteLogButton({logId}:DeleteLogButtonProps){
   const [state,formAction,isPending] = useActionState(deleteGameLogAction,null);
   const deleteAction = (formData:FormData) =>{
    const isCofirmed = confirm("この観戦記録を削除しますか？");
    if(isCofirmed){
       formAction(formData);
    }
   }
    return(
<form action={deleteAction}>
      <input type="hidden" name="logId" value={logId} />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-white bg-slate-900  hover:bg-blue-600  rounded-xl transition-all group-hover:scale-110" 
      >
        {isPending ?
        "削除中・・・":"削除"}
      </button>
      {state?.error && <p className="text-[8px] text-red-500 mt-1">{state.error}</p>}
    </form>
    )
 

}

