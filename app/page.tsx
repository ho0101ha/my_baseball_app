import FoodRanking from '@/components/home/FoodRanking';
import Logout from '@/components/Logout';
import NextTarget from '@/components/NextTarget';
import OpponentSelector from '@/components/OpponentSelector';
import TopOpponents from '@/components/TopOpponents';
import Hero from '@/components/home/Hero';
import VisitedWinRat from '@/components/home/VisitedWinRate';
import { auth } from '@/lib/auth';
import { GameResult } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { NPB_STADIUMS } from '@/lib/stadiums';
import QuickAddForm from '@/components/QuickAddForm';

interface OpponentStat {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
}

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isLogin = !!session?.user;

  const [userData, userLogs, publicVisits] = await Promise.all([
    userId ? await prisma.user.findUnique({
      where: { id: userId },
      include: { visits: true }
    }) : null,
    userId ? await prisma.gameLog.findMany({
      where: { userId: userId }
    }) : [],
    !userId ? prisma.visit.findMany() : Promise.resolve([])
  ]);

  const allVisits = userData?.visits || (isLogin ? [] : publicVisits);

  const totalWins = allVisits.reduce((sum, v) => sum + v.wins, 0);
  const totalLosses = allVisits.reduce((sum, v) => sum + v.losses, 0);
  const totalDraws = allVisits.reduce((sum, v) => sum + v.draws, 0);
  const totalGames = totalWins + totalLosses;
  const totalWinRate = totalGames > 0 ? (totalWins / totalGames).toFixed(3) : ".000";

  const stadiumStats = NPB_STADIUMS.map(stadium => {
    const stadiumRecords = allVisits.filter(v => v.stadiumId === stadium.id);
    const wins = stadiumRecords.reduce((sum, r) => sum + r.wins, 0);
    const losses = stadiumRecords.reduce((sum, r) => sum + r.losses, 0);
    const draws = stadiumRecords.reduce((sum, r) => sum + r.draws, 0);
    
    const stadiumTotal = wins + losses;

    return {
      ...stadium,
      wins,
      losses,
      draws,
      winRate: stadiumTotal > 0 ? (wins / stadiumTotal).toFixed(3) : ".000",
      isVisited: (wins + losses + draws) > 0
    };
  });

  const visitedCount = stadiumStats.filter(s => s.isVisited).length;

  const statsMap = userLogs.reduce((acc: Record<string, OpponentStat>, log) => {
    const name = log.opponent || "未設定";
    if (!acc[name]) {
      acc[name] = { name, wins: 0, losses: 0, draws: 0, winRate: ".000" };
    }

    const stats = acc[name];
    const res = log.result;
    if (res === GameResult.WIN) stats.wins += 1;
    if (res === GameResult.LOSS) stats.losses += 1;
    if (res === GameResult.DRAW) stats.draws += 1;

    return acc;
  }, {});

  const opponentStats = Object.values(statsMap).map((stat) => {
    const total = stat.wins + stat.losses;
    return {
      ...stat,
      winRate: total > 0 ? (stat.wins / total).toFixed(3) : ".000"
    };
  }).sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

  const topOpponents = opponentStats.slice(0, 3);

  const foodMap = userLogs.reduce((acc: Record<string, { name: string, count: number, stadiumIds: Set<string> }>, log) => {
    if (!log.food || log.food.trim() === "") return acc;
    
    const foodName = log.food.trim();
    if (!acc[foodName]) {
      acc[foodName] = { name: foodName, count: 0, stadiumIds: new Set() };
    }
    
    acc[foodName].count += 1;
    acc[foodName].stadiumIds.add(log.stadiumId);
    return acc;
  }, {});

  const topFoods = Object.values(foodMap).map((f) => ({
    name: f.name,
    count: f.count,
    stadiumCount: f.stadiumIds.size,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased text-slate-900">
      
      <Hero
        isLogin={isLogin} 
        session={session} 
        visitedCount={visitedCount} 
        totalWins={totalWins} 
        totalLosses={totalLosses} 
        totalDraws={totalDraws} 
        totalWinRate={totalWinRate}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-col gap-10">
          
          <section className="bg-white p-8 rounded-none border-t-4 border-slate-900 shadow-xl relative overflow-hidden ">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 transform rotate-45 translate-x-12 -translate-y-12 transition-transform "></div>
            
            <h2 className="text-xl font-black italic tracking-wider mb-6 text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 block"></span>
              STADIUM LOGS
            </h2>
            <VisitedWinRat stadiumStats={stadiumStats}/>
          </section>
           
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {topFoods.length > 0 && (
              <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md">
                <div className="absolute top-0 left-0 bg-slate-900 h-1.5 w-16"></div>
                <h2 className="text-lg font-black italic tracking-widest mb-4 text-slate-800 flex items-center gap-2">
                  <span className="text-slate-300">/</span> STADIUM GOURMET
                </h2>
                <FoodRanking foods={topFoods}/>
              </div>
            )}
            
            {topOpponents.length > 0 && (
              <div className="bg-white p-6 rounded-none border border-slate-200 relative shadow-md">
                <div className="absolute top-0 left-0 bg-slate-900 h-1.5 w-16"></div>
                <h2 className="text-lg font-black italic tracking-widest mb-4 text-slate-800 flex items-center gap-2">
                  <span className="text-slate-300">/</span> MATCHUP TOP 3
                </h2>
                <TopOpponents stats={topOpponents} />
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-none border-b-4 border-slate-400 shadow-md">
            <h2 className="text-xl font-black italic tracking-wider mb-4 text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-400 block"></span>
              OPPONENT SELECTOR
            </h2>
            <OpponentSelector stats={opponentStats}/>
          </section>
         <section>
          <QuickAddForm/>
         </section>
          {isLogin && (
            <section className="bg-white p-8 rounded-none border-l-4 border-slate-900 shadow-lg relative overflow-hidden ">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 transform rotate-45 translate-x-12 -translate-y-12 transition-transform "></div>
              <h2 className="text-xl font-black italic tracking-wider mb-4 text-slate-900 flex items-center gap-2">
                <span className="text-slate-300">/</span> NEXT MISSION
              </h2>
              <NextTarget isLogin={isLogin} stadiumStats={stadiumStats}/>
            </section>
          )} 
        </div>
      </div>
    </main>
  );
}