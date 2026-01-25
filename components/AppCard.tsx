
import React from 'react';
import { ModAppItem } from '../types';

interface AppCardProps {
  app: ModAppItem;
  onClick: () => void;
  activeColor: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick, activeColor, isFavorite, onToggleFavorite }) => {
  const colorName = activeColor.split('-')[0];

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div 
      onClick={onClick}
      className={`glass glass-hover p-4 rounded-[2.5rem] cursor-pointer group border-transparent hover:border-${colorName}-500/30 transition-all relative overflow-hidden flex flex-col bg-black/40`}
    >
      <div className="flex items-start gap-5 mb-5">
        {/* App Icon */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className={`absolute inset-0 bg-${colorName}-500/10 blur-xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
          <img 
            src={app.icon} 
            alt={app.title} 
            className="w-full h-full object-cover rounded-[1.8rem] relative z-10 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-[8px] font-black uppercase tracking-widest text-${colorName}-400 bg-${colorName}-500/5 px-2 py-0.5 rounded-md border border-${colorName}-500/10`}>
                {app.category}
             </span>
             {app.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>}
          </div>
          <h3 className="font-black text-xl text-white truncate group-hover:text-white transition-colors tracking-tighter">
            {app.title}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{app.version}</p>
        </div>
      </div>
      
      <div className="w-full grid grid-cols-3 gap-2 mb-4">
         <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 text-center">
            <p className="text-[7px] text-gray-600 font-black uppercase">Tamanho</p>
            <p className="text-[10px] text-white font-black">{app.size}</p>
         </div>
         <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 text-center">
            <p className="text-[7px] text-gray-600 font-black uppercase">Rating</p>
            <p className="text-[10px] text-yellow-500 font-black">{app.rating}★</p>
         </div>
         <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 text-center">
            <p className="text-[7px] text-gray-600 font-black uppercase">Downloads</p>
            <p className="text-[10px] text-emerald-500 font-black">{app.downloads}</p>
         </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto">
         <div className="flex -space-x-2">
            {app.modFeatures.slice(0, 2).map((feat, i) => (
              <div key={i} className={`w-6 h-6 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center`} title={feat}>
                <i className={`fa-solid ${i === 0 ? 'fa-shield' : 'fa-bolt'} text-[8px] text-${colorName}-400`}></i>
              </div>
            ))}
         </div>
         <button onClick={handleFavClick} className={`w-10 h-10 flex items-center justify-center glass rounded-xl transition-all active:scale-90 ${isFavorite ? 'text-rose-500' : 'text-white/20'}`}>
            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-xs`}></i>
         </button>
      </div>
    </div>
  );
};

export default AppCard;
