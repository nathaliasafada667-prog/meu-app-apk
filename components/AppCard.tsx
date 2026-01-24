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
      className={glass glass-hover p-4 rounded-[2rem] cursor-pointer group border-transparent hover:border-${colorName}-500/30 transition-all relative overflow-hidden}
    >
      <div className="relative mb-4">
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full aspect-square object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavClick}
          className={absolute top-3 left-3 w-9 h-9 flex items-center justify-center glass rounded-xl backdrop-blur-xl transition-all active:scale-90 ${isFavorite ? 'text-rose-500' : 'text-white/60 hover:text-white'}}
        >
          <i className={fa-${isFavorite ? 'solid' : 'regular'} fa-heart}></i>
        </button>

        {app.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
            PREMIUM
          </div>
        )}
        <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full text-xs font-bold text-white/90 backdrop-blur-md">
          {app.version}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className={font-black text-lg truncate pr-2 group-hover:text-${colorName}-400 transition-colors}>
            {app.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-400 text-sm shrink-0">
            <i className="fa-solid fa-star"></i>
            <span className="font-bold">{app.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
          {app.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
            <i className="fa-solid fa-download mr-1"></i> {app.downloads}
          </span>
          <span className={text-[10px] text-${colorName}-400 font-black bg-${colorName}-500/10 px-3 py-1.5 rounded-xl uppercase border border-${colorName}-500/10}>
            {app.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
