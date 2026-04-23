"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* ハンバーガーボタン */}
      <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full  h-screen bg-slate-900 border-t border-slate-800 p-6 flex flex-col  space-y-4 z-100 shadow-xl">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:underline text-white font-bold tracking-tighter italic uppercase">ダッシュボード</Link>
          <Link href="/map" onClick={() => setIsOpen(false)} className="hover:underline text-white font-bold tracking-tighter italic uppercase">マップ</Link>
          {isLoggedIn && (
            <Link href="/account" onClick={() => setIsOpen(false)} className="hover:underline text-blue-400 font-black tracking-tighter italic uppercase">アカウント設定</Link>
          )}
        </div>
      )}
    </div>
  );
}

