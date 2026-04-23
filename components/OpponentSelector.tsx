'use client';

import { useState, ChangeEvent } from 'react';

interface OpponentStat {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
}

export default function OpponentSelector({ stats }: { stats: OpponentStat[] }) {
  const [selectedTeam, setSelectedTeam] = useState<OpponentStat | null>(
    stats.length > 0 ? stats[0] : null
  );

  // 選択変更時の処理を外に定義
  const handleTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const team = stats.find((s) => s.name === e.target.value)  || stats[0];
    if (team) {
      setSelectedTeam(team);
    }
  };

  if (!selectedTeam || stats.length === 0) return null;

  return (
    <section className="my-12 space-y-6 px-2">
      <div className=" md:items-center  gap-4">
        <div className="flex items-center flex-col md:flex-row  gap-3">
          <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-xl shadow-lg">
            <span className="font-black italic text-sm">VS</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">
            対戦相手別成績
          </h2>
        </div>
         <div>
            
         </div>
        <select 
          className=" block mt-10 bg-white border-2 border-slate-200 text-slate-700 py-3 px-5  shadow-sm focus:border-red-500 outline-none font-bold transition-all cursor-pointer"
          onChange={handleTeamChange}
          value={selectedTeam.name}
        >
          {stats.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-md">
        <div className="bg-white p-8  border border-slate-100 shadow-xl relative overflow-hidden">
          {/* 背景の装飾 */}
          <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl italic">VS</div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {selectedTeam.name}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Team Statistics</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-red-600 italic tracking-tighter block">
                {selectedTeam.winRate}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-6  border border-slate-100 text-center relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">勝
              </p>
              <p className="text-2xl font-black text-blue-600">{selectedTeam.wins}</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">負</p>
              <p className="text-2xl font-black text-red-500">{selectedTeam.losses}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">分
              </p>
              <p className="text-2xl font-black text-slate-500">{selectedTeam.draws}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}