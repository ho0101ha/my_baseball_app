"use client";

import dynamic from 'next/dynamic';

// MapComponentをSSR: falseで読み込む
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Map Loading...</span>
    </div>
  )
});

// Wrapper自体はSSR時に「何も読み込まない」という動作を徹底させる
export default function MapWrapper({ userVisits }: { userVisits: any[] }) {
  return (
    <div className="h-full w-full relative">
      <MapComponent userVisits={userVisits} />
    </div>
  );
}