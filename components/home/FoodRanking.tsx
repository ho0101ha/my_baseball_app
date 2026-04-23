interface FoodItem {
  name: string;
  count: number;
  stadiumCount: number;
}

export default function FoodRanking({ foods }: { foods: FoodItem[] }) {
  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-none shadow-lg text-xl shrink-0">
          <span>🍴</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">
            よく食べた球場飯ランキング
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {foods.map((food, index) => (
          <div 
            key={food.name}
            className="bg-white p-6 rounded-none border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all relative gap-4"
          >
            <div className="absolute top-0 left-0 bg-orange-500 h-1 w-12 group-hover:w-full transition-all duration-300"></div>
            
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className={`
                w-10 h-10 shrink-0 rounded-none flex items-center justify-center font-black italic
                ${index === 0 ? 'bg-yellow-400 text-white shadow-yellow-200' : 
                  index === 1 ? 'bg-slate-300 text-white shadow-slate-100' :
                  index === 2 ? 'bg-orange-400 text-white shadow-orange-100' :
                  'bg-slate-100 text-slate-400'} shadow-lg
              `}>
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1 truncate">
                  <span className="text-slate-300">/</span> {food.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-3">
                  {food.stadiumCount} Stadiums
                </p>
              </div>
            </div>
            
            <div className="text-right shrink-0 ml-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">
                {food.count}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap leading-none">
                Times
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}