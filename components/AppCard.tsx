
import React from 'react';
import { MovieItem } from '../types';

interface AppCardProps {
  app: MovieItem;
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
      className={`glass glass-hover p-2 rounded-[1.5rem] cursor-pointer group border-transparent hover:border-${colorName}-500/30 transition-all relative overflow-hidden flex flex-col items-center text-center`}
    >
      <div className="relative mb-3 w-full">
        {/* Poster Proporção 2:3 */}
        <div className="relative overflow-hidden rounded-xl shadow-xl group-hover:shadow-${colorName}-500/10 transition-all aspect-[2/3]">
          <img 
            src={app.poster} 
            alt={app.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Badge Watch Now Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
             <div className={`w-12 h-12 bg-${colorName}-500 rounded-full flex items-center justify-center shadow-2xl shadow-${colorName}-500/50`}>
                <i className="fa-solid fa-play text-white ml-1"></i>
             </div>
          </div>
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
              4K HDR
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full space-y-1">
        <div className="flex items-center justify-center gap-1 mb-0.5">
           <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">
              {app.year}
           </span>
           {app.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-[8px]"></i>}
        </div>
        
        <h3 className={`font-black text-sm truncate group-hover:text-${colorName}-400 transition-colors px-1 tracking-tight`}>
          {app.title}
        </h3>
        
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-0.5 text-yellow-400 text-[9px] font-bold">
            <i className="fa-solid fa-star"></i>
            <span>{app.rating}</span>
          </div>
          <div className="w-[1px] h-2 bg-white/10"></div>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
            {app.duration}
          </span>
        </div>
        
        <div className="pt-1">
          <span className={`text-[7px] text-${colorName}-400 font-black bg-${colorName}-500/5 px-2 py-0.5 rounded-md uppercase border border-${colorName}-500/10 inline-block`}>
            {app.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
