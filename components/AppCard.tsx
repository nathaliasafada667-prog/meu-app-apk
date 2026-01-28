
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
      className="relative group cursor-pointer transition-all duration-500 hover:scale-[1.03] active:scale-95"
    >
      {/* 
          BORDA GIGANTE EM COMPRIMENTO (FEIXE DE LUZ LATERAL) 
          Essa borda percorre todo o card verticalmente, sendo muito mais visível.
      */}
      <div className={`absolute -left-[2px] top-4 bottom-4 w-[4px] bg-${colorName}-500 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_15px_${colorName}-500]`}></div>
      <div className={`absolute -right-[2px] top-4 bottom-4 w-[4px] bg-${colorName}-500 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_15px_${colorName}-500]`}></div>

      {/* MOLDURA DISCRETA DE FUNDO */}
      <div className={`absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent opacity-20 group-hover:opacity-100 transition-all duration-700`}></div>
      
      {/* SOMBRA NEON DE FUNDO */}
      <div className={`absolute inset-0 rounded-[2.5rem] bg-${colorName}-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

      {/* CONTEÚDO DA CÁPSULA */}
      <div className="relative h-full glass rounded-[2.4rem] p-5 flex items-center gap-5 bg-black border border-white/5 overflow-hidden shadow-2xl">
        
        {/* REFLEXO DE VIDRO INTERNO */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

        {/* ICON CONTAINER */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 z-10">
          <div className={`absolute -inset-1 bg-gradient-to-tr from-${colorName}-500/20 to-transparent rounded-[1.8rem] blur-sm`}></div>
          <img 
            src={app.icon} 
            alt={app.title} 
            className="w-full h-full object-cover rounded-[1.7rem] border border-white/10 relative z-10 transition-transform duration-700 group-hover:scale-110"
          />
          {app.isVerified && (
            <div className={`absolute -bottom-1 -right-1 w-7 h-7 bg-${colorName}-600 rounded-full border-4 border-black flex items-center justify-center z-20 shadow-xl`}>
              <i className="fa-solid fa-check text-[10px] text-white"></i>
            </div>
          )}
        </div>

        {/* ÁREA DE INFORMAÇÃO */}
        <div className="flex-1 min-w-0 py-2 z-10">
          <div className="flex flex-col h-full justify-center space-y-2">
            <div>
              <h3 className="font-black text-xl md:text-2xl text-white truncate italic tracking-tighter leading-tight group-hover:text-${colorName}-400 transition-colors uppercase">
                {app.title}
              </h3>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
                {app.packageName}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 bg-${colorName}-500/10 border border-${colorName}-500/20 rounded-lg text-[8px] font-black text-${colorName}-400 uppercase tracking-widest`}>
                {app.category}
              </span>
              <div className="h-1 w-1 rounded-full bg-white/20"></div>
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">
                VER {app.version}
              </span>
            </div>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col items-center gap-3 z-10">
           <button 
             onClick={handleFavClick} 
             className={`w-11 h-11 flex items-center justify-center glass rounded-2xl transition-all active:scale-90 hover:bg-white/5 border-white/5 ${isFavorite ? 'text-rose-500' : 'text-white/20'}`}
           >
              <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-base`}></i>
           </button>
           
           <div className={`flex items-center justify-center w-10 h-10 rounded-2xl bg-${colorName}-500/10 border border-${colorName}-500/30 group-hover:bg-${colorName}-500 group-hover:text-black transition-all duration-500`}>
              <i className="fa-solid fa-arrow-right-long text-sm animate-bounce-x"></i>
           </div>
        </div>

        {/* EFEITO DE VARREDURA DE LUZ */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
           <div className={`absolute -left-full top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-[scan_1.5s_infinite]`}></div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default AppCard;
