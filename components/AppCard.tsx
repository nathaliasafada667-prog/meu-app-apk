
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
      className="group relative flex flex-col glass-card rounded-3xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden"
    >
      {/* Label de Categoria / Versão */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
         {app.isVerified && (
           <span className={`bg-${colorName}-500 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-lg`}>
             Elite
           </span>
         )}
      </div>

      {/* Botão de Favorito Flutuante */}
      <button 
        onClick={handleFavClick}
        className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white text-white hover:text-red-500 ${isFavorite ? 'text-red-500' : ''}`}
      >
        <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-xs`}></i>
      </button>

      {/* Ícone / Imagem do Produto */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-[#151515]">
        <img 
          src={app.icon} 
          alt={app.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay Escuro ao passar o mouse */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate group-hover:text-white/90 transition-colors">
          {app.title}
        </h3>
        <p className="text-gray-500 text-xs font-medium mb-4 truncate">
          {app.category} • {app.size}
        </p>

        {/* Botão de Ação Limpo (Sem preços) */}
        <div className="mt-auto flex items-center justify-end">
           <button className={`w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform active:scale-90 group-hover:bg-${colorName}-500 group-hover:text-white shadow-lg`}>
              <i className="fa-solid fa-arrow-down text-sm"></i>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
