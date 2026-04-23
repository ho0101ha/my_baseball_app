'use client';

import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NPB_STADIUMS } from '@/lib/stadiums';
import LogForm from '@/components/LogForm';

interface VisitData {
  id: string;
  stadiumId: string;
  wins: number;
  losses: number;
  draws: number;
  userId: string;
  visitedAt: Date;
}

export default function MapComponent({ userVisits }: { userVisits: VisitData[] }) {
  const [selectedStadiumId, setSelectedStadiumId] = useState<string | null>(null);

  // アイコン定義（ブラウザ環境のみで初期化）
  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return {
      defaultIcon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
      visitedIcon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    };
  }, []);

  // サーバーサイド（またはアイコン未生成時）はスケルトンを表示
  if (!icons) return <div className="h-full w-full bg-slate-100 animate-pulse" />;

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex-1 relative min-h-125">
        <MapContainer 
          center={[36.5, 137.5]} 
          zoom={7} 
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {NPB_STADIUMS.map((stadium) => {
            const currentData = userVisits.find(v => v.stadiumId === stadium.id);
            const isVisited = !!currentData;

            return (
              <Marker 
                key={stadium.id} 
                position={[stadium.lat, stadium.lng]}
                icon={isVisited ? icons.visitedIcon : icons.defaultIcon}
                eventHandlers={{
                  click: () => setSelectedStadiumId(stadium.id),
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {selectedStadiumId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-1001">
          <div className="bg-white rounded-xl shadow-2xl p-2 relative border border-slate-200">
             <button 
              onClick={() => setSelectedStadiumId(null)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-full z-10 font-bold shadow-xl flex items-center justify-center"
            >
              x
            </button>
            <LogForm 
              key={selectedStadiumId} 
              stadium={NPB_STADIUMS.find(s => s.id === selectedStadiumId)!}
              current={userVisits.find(v => v.stadiumId === selectedStadiumId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}