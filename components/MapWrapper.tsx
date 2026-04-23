"use client";

import dynamic from 'next/dynamic';

// VisitDataの型を定義（または共通ファイルからimport）
interface VisitData {
  id: string;
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
  userId: string;
  visitedAt: Date;
}

// MapComponentをSSR: falseで読み込む
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Map Loading...</span>
    </div>
  )
});

export default function MapWrapper({ userVisits }: { userVisits: VisitData[] }) {
  return (
    <div className="h-full w-full relative">
      <MapComponent userVisits={userVisits} />
    </div>
  );
}