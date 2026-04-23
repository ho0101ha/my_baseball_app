import Link from 'next/link'
import React from 'react'
import Logout from '../Logout'
import { Session } from 'next-auth';

interface HeroProps {
  isLogin: boolean;
  session: Session | null;
  visitedCount: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalWinRate: string;
}

export default function Hero({
  isLogin, session, visitedCount, totalWins, totalLosses, totalDraws, totalWinRate
}: HeroProps) {
  return (
    <div className="bg-slate-900 text-white pt-8 pb-8 md:pt-12 md:pb-12 px-4 md:px-6 rounded-none shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white transform rotate-45"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-slate-700 pb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase flex items-center gap-2">
              <span className="w-1.5 h-6 md:h-8 bg-white block"></span>
              My Baseball Log
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium mt-1 flex items-center gap-1">
              <span className="text-white">/</span> マイ球場別記録:{' '}
              <span className="text-white">
                {isLogin ? `${session?.user?.name}様` : "みんなの成績"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {!isLogin ? (
              <Link href="/login" className="px-5 md:px-6 py-2 bg-white text-slate-900 rounded-none font-black italic text-xs hover:bg-yellow-400 transition-all active:scale-95 shadow-lg flex items-center gap-1">
                <span>/</span> ログイン
              </Link>
            ) : (
              <div className="flex justify-end sm:justify-center gap-4 md:gap-8 w-full sm:w-auto">
                <div className="text-right border-r border-slate-700 pr-4 md:pr-6">
                  <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">制覇率</p>
                  <p className="text-xl md:text-3xl font-black text-yellow-400 mt-1">
                    {visitedCount} <span className="text-sm md:text-xl text-white">/ 12</span>
                  </p>
                </div>
                <Logout />
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <span>/</span> Total Win Rate
            </p>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tighter text-white leading-none">
                {totalWinRate}
              </span>
              <div className="text-sm md:text-xl font-bold text-slate-400 bg-slate-800 px-3 md:px-4 py-2 border-l-4 border-white inline-block w-fit">
                {totalWins}勝 {totalLosses}敗 {totalDraws}分
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            {isLogin ? (
              <div className="space-y-2">
                <div className="w-full h-4 bg-white/10 rounded-none overflow-hidden border border-white/5 p-0.5">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                    style={{ width: `${(visitedCount / 12) * 100}%` }}
                  />
                </div>
                <p className="text-right text-xs md:text-sm text-slate-400 font-bold uppercase tracking-tighter">Stadium Complete</p>
              </div>
            ) : (
              <div className="text-right space-y-2 pl-6 border-l border-slate-700">
                <p className="text-xl md:text-2xl font-black italic leading-tight">TRACK YOUR JOURNEY.</p>
                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">
                  全国の球場を制覇して、<br />自分だけの観戦ログを作ろう。
                </p>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex justify-start mt-2 md:mt-5 col-span-1 md:col-span-2">
              <Link href="/map" className="text-sm md:text-base  text-center px-5 md:px-6 py-2.5 bg-white text-slate-900 rounded-none font-black hover:bg-yellow-400 transition-all active:scale-95 shadow-lg flex items-center gap-1 w-full sm:w-auto justify-center">
                <span>/</span> 観戦記録を追加する
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}