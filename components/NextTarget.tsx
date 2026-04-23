import Link from "next/link";

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

interface NextTargetProps {
  isLogin: boolean;
  stadiumStats: StadiumStat[];
}

export default function NextTarget({ isLogin, stadiumStats }: NextTargetProps) {
  const unvisitedStadiums = stadiumStats.filter((s) => !s.isVisited);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-none shadow-lg text-xl shrink-0">
          <span className="font-bold">!</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">
            次はどこへ?
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {unvisitedStadiums.map((s) => (
          <Link 
            href={isLogin ? `/stadiums/${s.id}` : "/login"} 
            key={s.id} 
            className="block h-full group" 
          >
            <div className="bg-white p-6 h-full rounded-none border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all relative gap-4">
              <div className="absolute top-0 left-0 bg-orange-500 h-1 w-12 group-hover:w-full transition-all duration-300"></div>

              <div className="min-w-0 flex-1 mt-1">
                <h3 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1 truncate">
                  <span className="text-slate-300">/</span> {s.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-3">
                  {s.team}
                </p>
              </div>

              <div className="w-10 h-10 rounded-l bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0 ml-2 mt-1">
                <span className="text-lg font-bold">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}