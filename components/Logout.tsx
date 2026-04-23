"use client";
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation';
import React from 'react'

export default function Logout() {
    const logout = () =>{
        signOut();
        redirect("/")
    }
  return (
    <button onClick={ logout}
    className=" font-black bg-white/10 hover:bg-red-500 hover:text-white text-white px-3 py-1  transition-all border border-white/5 uppercase tracking-tighter">
    ログアウト
    </button>
  )
}


