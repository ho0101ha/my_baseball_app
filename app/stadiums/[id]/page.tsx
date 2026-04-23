import { NPB_STADIUMS } from "@/lib/stadiums";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import LogForm from "@/components/LogForm";
import Link from "next/link";
import { GameResult } from "@/lib/constants";
import DeleteLogButton from "@/components/DeleteLogButton";
import QuickAddForm from "@/components/QuickAddForm";
import StatsSwitcher from "@/components/StatsSwitcher";
import OpponentStats from "@/components/OpponentStats";
import EditLogModal from "@/components/EditLogModal";
import FoodRanking from "@/components/home/FoodRanking";
import TopOpponents from "@/components/TopOpponents";
import Image from "next/image"; // 👈 Imageコンポーネントをインポート

interface OpponentStat {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
}

export default async function StadiumDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const session = await auth();

  const stadium = NPB_STADIUMS.find((s) => s.id === id);
  if (!stadium) notFound();

  // 1. 各球場の画像パスを設定
  // 画像は public/images/stadiums/ ディレクトリにスタジアムID名で保存されていると想定
  const stadiumImageUrl = `/images/stadiums/${stadium.id}.jpg`;

  const [visit, logs, userLogs] = await Promise.all([
    prisma.visit.findUnique({
      where: {
        userId_stadiumId: {
          userId: session?.user?.id || "",
          stadiumId: id,
        },
      },
    }),
    prisma.gameLog.findMany({
      where: {
        userId: session?.user?.id || "",
        stadiumId: id,
        NOT: {comment: "AUTO_GENERATED"}, 
      },
      orderBy: {date: "desc"},
    }),
    prisma.gameLog.findMany({
      where: {
        userId: session?.user?.id || "",
        stadiumId: id,
      },
      orderBy: {date: "desc"},
    })
  ]);

  const wins = visit?.wins || 0;
  const losses = visit?.losses || 0;
  const draws = visit?.draws || 0;
  const total = wins + losses + draws;

  const statsMap = userLogs.reduce((acc: Record<string, OpponentStat>, log) => {
    const name = log.opponent || "未設定";
    if (!acc[name]) {
      acc[name] = {name, wins: 0, losses: 0, draws: 0, winRate: ".000"};
    }

    const stats = acc[name];
    const res = log.result;
    if (res === GameResult.WIN) stats.wins += 1;
    if (res === GameResult.LOSS) stats.losses += 1;
    if (res === GameResult.DRAW) stats.draws += 1;

    return acc;
  }, {});

  const opponentStats = Object.values(statsMap)
    .map((stat) => {
      const total = stat.wins + stat.losses;
      const calculatedRate =
        total > 0 ? (stat.wins / total).toFixed(3) : "0.00";

      return {
        ...stat,
        winRate: calculatedRate,
      };
    })
    .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));

  const topOpponents = opponentStats.slice(0, 3);

  const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

  const dayStatsMap = logs.reduce((acc, log) => {
    const date = new Date(log.date);
    const dayIndex = date.getDay();
    const dayName = DAYS[dayIndex];

    if (!acc[dayName]) {
      acc[dayName] = {day: dayName, wins: 0, losses: 0, draws: 0, total: 0};
    }

    const stats = acc[dayName];
    stats.total += 1;
    if (log.result === GameResult.WIN) stats.wins += 1;
    else if (log.result === GameResult.LOSS) stats.losses += 1;
    else if (log.result === GameResult.DRAW) stats.draws += 1;

    return acc;
  }, {} as Record<string, {day: string; wins: number; losses: number; draws: number; total: number}>);

  const chartDate = DAYS.map(
    (day) => dayStatsMap[day] || {day, wins: 0, losses: 0, draws: 0, total: 0}
  );

  const maxGames = Math.max(...chartDate.map((d) => d.total), 1);

  const foodMap = userLogs.reduce(
    (
      acc: Record<string, {name: string; count: number; stadiumIds: Set<string>}>,
      log
    ) => {
      if (!log.food || log.food.trim() === "") return acc;

      const foodName = log.food.trim();
      if (!acc[foodName]) {
        acc[foodName] = {name: foodName, count: 0, stadiumIds: new Set()};
      }

      acc[foodName].count += 1;
      acc[foodName].stadiumIds.add(log.stadiumId);
      return acc;
    },
    {}
  );

  const topFoods = Object.values(foodMap)
    .map((f) => ({
      name: f.name,
      count: f.count,
      stadiumCount: f.stadiumIds.size,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 pb-16 font-sans antialiased">
      {/* 2. スタジアム画像セクション（PC・スマホ対応） */}
      <div className="flex  flex-col md:flex-row justify-center mb-6">
      <div className="w-full md:w-1/2 mx-auto relative h-[40vh] sm:h-[50vh] md:h-[60vh] bg-slate-900 group">
        <Image
          src={stadiumImageUrl}
          alt={`${stadium.name}の画像`}
          fill
          priority
          className="object-cover rounded-none transition-transform duration-700 group-hover:scale-105"
        />
        {/* 直線的なグラデーションオーバーレイ（下部の文字の視認性向上） */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        {/* スタジアム画像内にタイトル情報を配置（ベイスターズ風） */}
        <div className="max-w-4xl mx-auto absolute  inset-x-0 bottom-0 px-8 pb-12 z-10">
        
          <div>
           
            <h1 className="text-2xl  md:text-5xl ml-20 md:ml-40 font-black italic tracking-tighter  leading-none flex items-center gap-2 text-white">
              <span className="w-1.5 h-8 md:h-12 bg-white block"></span>
              {stadium.name}
            </h1>
            <p className="text-white/70 font-bold mt-4 text-center  text-lg uppercase tracking-wider ml-4">
              {stadium.team}
            </p>
          </div>
        </div>
      </div>
      <div className=" gap-8 items-start  md:w-1/2 mb-3 mx-auto">
          {/* 戦績・勝率グラフ */}
          <StatsSwitcher logs={logs} visit={visit} />
          
          {/* Total Games カード（スタジアム画像セクションから移動し、直線的なデザインに） */}
          <div className="bg-white p-6 rounded-none text-center 
            md:self-stretch md:flex md:flex-col md:justify-center">
            <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Total Games
            </p>
            <p className="text-2xl font-black italic tracking-tighter text-slate-950 leading-none">
              {total}
            </p>
          </div>
        </div>
      </div>
     

      <div className="max-w-4xl mx-auto px-6 -mt-10 space-y-8 relative z-20">
      

        {/* 曜日別 */}
        <section className="bg-white p-8 rounded-none shadow-lg border border-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 transform rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-slate-100 relative z-10">
            <h3 className="text-lg font-black italic text-slate-800 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-1.5 h-5 bg-slate-900 block"></span>
              曜日別
            </h3>
          </div>

          <div className="flex items-end justify-between gap-2 h-48 px-2 relative z-10">
            {chartDate.map((data) => {
              const winHeight = (data.wins / maxGames) * 100;
              const lossHeight = (data.losses / maxGames) * 100;
              const drawHeight = (data.draws / maxGames) * 100;

              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                  <div className="w-full max-w-6 md:max-w-8 flex flex-col-reverse h-32 bg-slate-100 rounded-none overflow-hidden border border-slate-200">
                    <div
                      style={{ height: `${winHeight}%` }}
                      className="bg-blue-600 w-full transition-all duration-500"
                    />
                    <div
                      style={{ height: `${lossHeight}%` }}
                      className="bg-red-500 w-full transition-all duration-500"
                    />
                    <div
                      style={{ height: `${drawHeight}%` }}
                      className="bg-slate-400 w-full transition-all duration-500"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900">
                      {data.day}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400">
                      {data.total}G
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mt-8 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-none bg-blue-600" />
              <span className="text-[12px] font-black text-slate-500 uppercase">勝</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-none bg-red-500" />
              <span className="text-[12px] font-black text-slate-500 uppercase">負</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-none bg-slate-400" />
              <span className="text-[12px] font-black text-slate-500 uppercase">分</span>
            </div>
          </div>
        </section>

        {topOpponents.length > 0 && <TopOpponents stats={topOpponents} />}

        <OpponentStats opponentStats={opponentStats} stadiumName={stadium.name} />

        {topFoods.length > 0 && <FoodRanking foods={topFoods} />}

        <QuickAddForm stadiumId={id} />

        {/* 観戦歴（シャープな直線デザインに） */}
        <section className="bg-white p-6 rounded-none shadow-lg border border-slate-200 relative">
          <div className="absolute top-0 left-0 bg-slate-900 h-1.5 w-16"></div>
          <div className="p-4 text-center border-b border-slate-100">
            <span className=" font-black text-slate-500 uppercase tracking-widest">
              数値を直接編集する
            </span>
          </div>
          <div className="pt-4">
            <LogForm key={total} stadium={stadium} current={visit || undefined} />
          </div>
        </section>

        <section className="pb-10">
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-xl font-black italic text-slate-800 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 block"></span>
              観戦歴
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {logs.length} Records
            </span>
          </div>

          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white px-6 py-5 rounded-none border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition-all relative group gap-4"
                >
                  <div className="absolute top-0 left-0 bg-slate-900 h-1 w-12 group-hover:w-full transition-all duration-300"></div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-5 flex-1 min-w-0 w-full">
                    <div
                      className={`w-12 h-12 shrink-0 rounded-none flex items-center justify-center text-xl font-black italic shadow-sm mt-1 ${
                        log.result === GameResult.WIN
                          ? "bg-blue-600 text-white"
                          : log.result === GameResult.LOSS
                          ? "bg-red-500 text-white"
                          : "bg-slate-400 text-white"
                      }`}
                    >
                      {log.result === GameResult.WIN ? "勝" : log.result === GameResult.LOSS ? "負" : "分"}
                    </div>

                    <div className="min-w-0 flex-1 w-full">
                      <p className="text-[12px] font-black text-slate-400 tracking-wider">
                        {new Date(log.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] font-black text-slate-300 italic uppercase">
                          vs
                        </span>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none truncate">
                          {log.opponent || "対戦相手なし"}
                        </h4>
                      </div>

                      <p className="text-[9px] font-bold text-blue-500/60 uppercase tracking-[0.2em] mt-1 ml-4">
                        レギュラーシーズン
                      </p>

                      {(log.food || log.comment) && (
                        <div className="flex flex-col sm:flex-row flex-wrap mt-3 gap-3 w-full">
                          {log.food && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="font-black text-orange-700 text-xs italic bg-orange-50 px-3 py-1.5 rounded-none border border-orange-200 flex items-center gap-1 truncate">
                                <span className="shrink-0">🍴</span>
                                <span className="truncate">{log.food}</span>
                              </p>
                            </div>
                          )}
                          {log.comment && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="font-bold text-slate-700 text-xs italic bg-slate-50 px-3 py-1.5 rounded-none border border-slate-200 flex items-center gap-1 truncate">
                                <span className="shrink-0">💬</span>
                                <span className="truncate">{log.comment}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <EditLogModal log={log} />
                    <div className="opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                      <DeleteLogButton logId={log.id} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-none border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-black italic tracking-widest uppercase">
                  まだ観戦履歴がありません
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}