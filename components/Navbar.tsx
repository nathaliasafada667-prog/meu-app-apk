
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  onSearch: (query: string) => void;
  language: Language;
  activeColor: string;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
  onOpenDev: () => void; // Nova prop para abrir o perfil do dev
  favoritesCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, language, activeColor, onOpenFavorites, onOpenProfile, onOpenDev, favoritesCount
}) => {
  const [searchValue, setSearchValue] = useState("");
  const colorBase = activeColor.split('-')[0];
  const t = translations[language];

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* LOGO DA LOJA - AGORA ABRE O PERFIL DO DEV */}
        <div 
          className="flex items-center gap-3 cursor-pointer flex-shrink-0 group" 
          onClick={onOpenDev}
          title="Sobre o Desenvolvedor"
        >
           <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${colorBase}-500 to-${colorBase}-700 flex items-center justify-center text-white shadow-lg shadow-${colorBase}-500/20 group-hover:scale-110 transition-transform duration-300`}>
              <span className="font-black text-lg tracking-tighter">E</span>
           </div>
           <div className="hidden md:flex flex-col group-hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-lg leading-none tracking-tight">ESMAEL<span className={`text-${colorBase}-500`}>STORE</span></span>
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">Dev Profile & Info</span>
           </div>
        </div>

        {/* BARRA DE BUSCA ESTILO LOJA */}
        <div className="flex-1 max-w-2xl relative group">
           <input
              type="text" 
              value={searchValue} 
              placeholder="O que você procura hoje?"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/20 transition-all placeholder:text-gray-600"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
        </div>

        {/* ÍCONES DE AÇÃO */}
        <div className="flex items-center gap-4 flex-shrink-0">
           {/* Botão de Favoritos (Antigo Notificação) */}
           <button 
             onClick={onOpenFavorites}
             className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-red-500 transition-all relative group"
           >
              <i className={`fa-${favoritesCount > 0 ? 'solid' : 'regular'} fa-heart`}></i>
              {favoritesCount > 0 && (
                <span className={`absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse`}></span>
              )}
           </button>

           {/* Botão de Perfil */}
           <button 
             onClick={onOpenProfile}
             className={`w-10 h-10 rounded-full bg-gradient-to-tr from-${colorBase}-500 to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform`}
           >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                 <i className="fa-solid fa-user text-xs text-white"></i>
              </div>
           </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
