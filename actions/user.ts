"use server";

import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

// インターフェースの定義
export interface ActionState {
  success: boolean;
  error: string | null;
}

interface UserUpdateInput {
  name: string;
  email: string;
  favoriteTeam: string | null;
  password?: string;
}

export async function registerAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const favoriteTeam = formData.get("favoriteTeam") as string;

  // 1. バリデーション
  if (!name || !email || !password) {
    return { success: false, error: "すべての項目を入力してください。" };
  }

  try {
    // 2. 重複チェック
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "このメールアドレスは既に登録されています。" };
    }

    // 3. ハッシュ化と保存
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        favoriteTeam: favoriteTeam || null,
      },
    });

  } catch (e) {
    console.log(e);
    return { success: false, error: "登録中にエラーが発生しました。" };
  }

  // 成功時の処理

  redirect("/login");
}

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "メールアドレスとパスワードを入力してください。" };
  }

  try {
    // Auth.js v5 の signIn を実行
  
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", 
    });

    return { success: true, error: null };
  } catch (error: unknown) {
    // 【重要】Next.jsのリダイレクト処理を邪魔しないようにする
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      // CredentialsSignin などの特定のエラーをハンドリング
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "メールアドレスまたはパスワードが正しくありません。" };
      }
      return { success: false, error: "認証に失敗しました。入力内容を確認してください。" };
    }

    // デバッグ用：何のエラーが出ているかサーバーログに出力
    console.error("Login Action Error:", error);
    
    return { success: false, error: "予期せぬエラーが発生しました。" };
  }
}

export async function updateAccountAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
const session = await auth();

if(!session?.user?.id){
  return {success:false,error:"認証が必要です"};

 
}
const userId = session?.user?.id;
const name= formData.get("name") as string  | null;
const email = formData.get("email") as string | null;
const favoriteTeam = formData.get("favoriteTeam") as string | null;
const currentPassword = formData.get("currentPassword") as string | null; 
const newPassword = formData.get("newPassword") as string | null;

if(!name || !email || !currentPassword){
  return { success:false,error:"名前、メールアドレス、パスワードが必要です"};
}
try {
  const user = await prisma.user.findUnique({
    where:{id:userId}
  });

  if(!user || !user.password){
    return { success:false,error:"ユーザーが見つかりません"};
  }

  const isPasswordVaild = await bcrypt.compare(currentPassword,user.password);
  if(!isPasswordVaild){
    return {success:false,error:"現在のパスワードが正しくありません"};
  }

  if(user.email !== email){
    const emailExsits = await prisma.user.findUnique({where:{email}});

    if(emailExsits){
      return { success:false,error:"使われているmメールアドレスです"};
    }
  }

  const upDateData:UserUpdateInput ={
    name,
    email,
    favoriteTeam:favoriteTeam || null,
  };

  if(newPassword && newPassword.length >=1){
    upDateData.password = await bcrypt.hash(newPassword,10);
  }
   
  await prisma.user.update({
    where:{id:userId},
    data:upDateData,
  });
  revalidatePath("/profile");
  revalidatePath("/settings");
  return {success:true,error:null }
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Account Update Error:", error.message);
  }
  return { success: false, error: "更新中にエラーが発生しました。" };
}
}


