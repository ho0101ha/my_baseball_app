import Link from 'next/link';
import React from 'react';

interface StadiumStat {
  id: string;
  name: string;
  team: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
  isVisited: boolean;
}

interface VisitedWinRateProps {
  stadiumStats: StadiumStat[];
}

export default function VisitedWinRat({ stadiumStats }: VisitedWinRateProps) {
  const visitedStadiums = stadiumStats.filter((s) => s.isVisited);

  return (
    <>
      <section className="lg:col-span-2 space-y-6 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-none shadow-lg shadow-blue-200">
            <span className="font-bold">#</span>
          </span>
          <h2 className="text-2xl font-black text-slate-800 italic">球場別観戦成績</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visitedStadiums.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-none border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
            >
              <div className="absolute top-0 left-0 bg-black h-1 w-12 group-hover:w-full transition-all duration-300"></div>

              <Link href={`stadiums/${s.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-1">
                      <span className="text-slate-300">/</span> {s.name}
                    </h3>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 ml-3">
                      {s.team}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-black italic tracking-tighter">
                    {s.winRate}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-5 py-3 rounded-none border-l-4 border-black">
                  <span className="text-blue-600">{s.wins} 勝</span>
                  <span className="text-red-500">{s.losses} 負</span>
                  <span className="text-slate-400">{s.draws} 分</span>
                </div>
              </Link>
            </div>
          ))}
          {stadiumStats.filter((s) => s.isVisited).length === 0 && (
            <div className="col-span-full py-10 text-center bg-white rounded-none border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium text-sm">訪問済みの球場はまだありません</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}