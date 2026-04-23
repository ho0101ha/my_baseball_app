import AccountSettingsForm from "@/components/AccountSettingsForm";
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export default  async function Accountpage() {
    const session = await auth();
    if(!session?.user?.id){
        redirect("/login");
    }
    const user = await prisma.user.findUnique({
        where:{id:session.user.id}
    });
    if(!user){
        return redirect("/login");
    }
  return (
    <div className="min-h-screen bg-slate-50">
        <AccountSettingsForm user={user}/>
    </div>
  )
}

