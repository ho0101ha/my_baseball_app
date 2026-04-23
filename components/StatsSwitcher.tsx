"use client";

import { useState } from "react";
import { GameResult } from "@/lib/constants";

type Log = {
  result: string;
};

// visit データの型定義を追加
interface StatsSwitcherProps {
  logs: Log[];
  visit: {
    wins: number;
    losses: number;
    draws: number;
  } | null;
}

export default function StatsSwitcher({ logs, visit }: StatsSwitcherProps) {
  const [filter, setFilter] = useState<"all" | "5" | "10">("all");

  // --- 表示データの算出 ---
  let win, lose, draw, total;

  if (filter === "all") {
    // 通算の場合は、DBの集計テーブル（visit）を優先する
    win = visit?.wins || 0;
    lose = visit?.losses || 0;
    draw = visit?.draws || 0;
  } else {
    // 直近の場合は、履歴（logs）から計算する
    const count = parseInt(filter);
    const sliced = logs.slice(0, count);
    win = sliced.filter((log) => log.result === GameResult.WIN).length;
    lose = sliced.filter((log) => log.result === GameResult.LOSS).length;
    draw = sliced.filter((log) => log.result === GameResult.DRAW).length;
  }

  total = win + lose + draw;
  const winRate = total - draw > 0 ? ((win / (total - draw)) * 100).toFixed(1) : "0.0";

  const buttons = [
    { label: "通算", value: "all" },
    { label: "直近5戦", value: "5" },
    { label: "直近10戦", value: "10" },
  ] as const;

  return (
    <section className="bg-white p-8  shadow-xl border  border-slate-200">
      <div className="flex bg-slate-100 p-1  mb-8 w-fit">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-6 py-2  text-xs font-black transition-all ${
              filter === btn.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            {filter === "all" ? "通算" : ` 最近 ${filter}`} 勝率
          </p>
          <h2 className="text-7xl font-black italic text-slate-900 tracking-tighter">
            {winRate}
            <span className="text-3xl ml-1">%</span>
          </h2>
        </div>
      </div>

      <div className="w-full h-10 bg-slate-100 rounded-2xl overflow-hidden flex border-[6px] border-slate-50 shadow-inner">
        {total > 0 ? (
          <>
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${(win / total) * 100}%` }}
            />
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${(lose / total) * 100}%` }}
            />
            <div
              className="bg-slate-300 h-full transition-all duration-500"
              style={{ width: `${(draw / total) * 100}%` }}
            />
          </>
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-blue-50 py-3 ">
          <p className="text-[10px] font-black text-blue-400 uppercase">勝</p>
          <p className="text-2xl font-black text-blue-600 italic">{win}</p>
        </div>
        <div className="bg-red-50 py-3 ">
          <p className="text-[10px] font-black text-red-400 uppercase">負</p>
          <p className="text-2xl font-black text-red-600 italic">{lose}</p>
        </div>
        <div className="bg-slate-50 py-3 ">
          <p className="text-[10px] font-black text-slate-400 uppercase">分</p>
          <p className="text-2xl font-black text-slate-600 italic">{draw}</p>
        </div>
      </div>
    </section>
  );
}