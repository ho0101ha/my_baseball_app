import React from 'react';

type Stadium = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    team: string;
}
interface OpponentStat {
    name: string;
    wins: number;
    losses: number;
    draws: number;
    winRate: string;
    // stadium:Stadium
  }
 
function OpponentStats({
    opponentStats,
    stadiumName
}:{
    opponentStats: OpponentStat[],
    stadiumName: string
}) {
  return (
    <>
  {opponentStats.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 px-4">
              <span className="text-[12px] font-black bg-slate-900 text-white px-2 py-1 ">VS</span>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
                対戦別成績 {stadiumName}
              </h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {opponentStats.map((stat) => (
                <div 
                  key={stat.name} 
                  className="flex-shzrink-0 bg-white border border-slate-100 p-5  shadow-sm min-w-40"
                >
                  <p className="font-black text-slate-900 mb-2 truncate">{stat.name}</p>
                  <p className="font-black text-slate-900 mb-2 truncate">{stat.winRate}</p>
                  

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-blue-600 italic">{stat.wins}</span>
                    <span className="text-[10px] font-bold text-slate-400">勝</span>
                    <span className="text-xl font-black text-red-500 italic ml-1">{stat.losses}</span>
                    <span className="text-[10px] font-bold text-slate-400">敗</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
              </>
  )
}

export default OpponentStats