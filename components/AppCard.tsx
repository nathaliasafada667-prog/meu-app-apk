
import React from 'react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
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
      className={`glass glass-hover p-3 rounded-[1.8rem] cursor-pointer group border-transparent hover:border-${colorName}-500/30 transition-all relative overflow-hidden flex flex-col items-center text-center`}
    >
      <div className="relative mb-3 w-full">
        <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-${colorName}-500/10 transition-all">
          <img 
            src={app.icon} 
            alt={app.name} 
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        <button 
          onClick={handleFavClick}
          className={`absolute top-2 left-2 w-7 h-7 flex items-center justify-center glass rounded-lg backdrop-blur-xl transition-all active:scale-90 ${isFavorite ? 'text-rose-500' : 'text-white/60 hover:text-white'}`}
        >
          <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-[10px]`}></i>
        </button>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          {app.isPremium && (
            <div className={`bg-${colorName}-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-lg shadow-black/40`}>
              PRO
            </div>
          )}
          {app.isVerified && (
            <div className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-blue-500/40 border border-black/20" title="Verificado Oficial">
              <i className="fa-solid fa-check text-[10px]"></i>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full space-y-1">
        {app.isVerified && (
          <div className="flex items-center justify-center gap-1 mb-0.5">
             <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">
                {app.author}
             </span>
             <i className="fa-solid fa-circle-check text-blue-500 text-[8px]"></i>
          </div>
        )}
        {!app.isVerified && (
          <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest block mb-0.5">
            {app.author}
          </span>
        )}
        
        <h3 className={`font-black text-sm truncate group-hover:text-${colorName}-400 transition-colors px-1 tracking-tight`}>
          {app.name}
        </h3>
        
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-0.5 text-yellow-400 text-[9px] font-bold">
            <i className="fa-solid fa-star"></i>
            <span>{app.rating}</span>
          </div>
          <div className="w-[1px] h-2 bg-white/10"></div>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
            {app.size}
          </span>
        </div>
        
        <div className="pt-1">
          <span className={`text-[8px] text-${colorName}-400 font-black bg-${colorName}-500/5 px-2.5 py-1 rounded-lg uppercase border border-${colorName}-500/10 inline-block`}>
            {app.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
