
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  onSearch: (query: string) => void;
  language: Language;
  activeColor: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, language, activeColor
}) => {
  const [searchValue, setSearchValue] = useState("");
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 backdrop-blur-3xl pt-6 pb-4 md:pt-8 md:pb-6">
      <div className="container mx-auto px-6 flex flex-col items-center gap-4">
        
        {/* TÍTULO CENTRALIZADO */}
        <div className="flex flex-col items-center text-center space-y-1 mb-1">
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
             {t.heroTitle.split(' ')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20`}>{t.heroTitle.split(' ').slice(1).join(' ')}</span>
           </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4">
          {/* LOGO SIMPLIFICADO */}
          <div className="hidden lg:flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className={`w-10 h-10 bg-${colorBase}-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-${colorBase}-500/20 group-hover:rotate-12 transition-all duration-500`}>
              <i className="fa-solid fa-code-branch text-lg"></i>
            </div>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="w-full lg:max-w-3xl relative group">
            <i className={`fa-solid fa-terminal absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-${colorBase}-500 transition-colors`}></i>
            <input
              type="text" value={searchValue} placeholder={t.searchPlaceholder}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-12 focus:outline-none focus:border-${colorBase}-500/50 text-sm transition-all focus:bg-white/10 shadow-2xl`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full bg-${colorBase}-500 animate-pulse`}></div>
               <span className="text-[8px] font-black text-white/20 uppercase tracking-widest hidden md:inline">Secure</span>
            </div>
          </div>

          <div className="hidden lg:block w-10"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
