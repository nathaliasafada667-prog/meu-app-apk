import React, { useState, useEffect } from 'react';
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
  const [tickerIndex, setTickerIndex] = useState(0);
  const [signal, setSignal] = useState(4);
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % t.tickerMsgs.length);
      setSignal(Math.floor(Math.random() * 2) + 3); // Simula oscilação de sinal 3-5
    }, 4000);
    return () => clearInterval(interval);
  }, [t.tickerMsgs.length]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 backdrop-blur-3xl">
      <div className="bg-black/80 border-b border-white/5 py-1 px-4 md:px-10 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}></div>
            <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">{t.tickerMsgs[tickerIndex]}</span>
         </div>
         <div className="flex gap-6 items-center">
            <div className="flex items-end gap-0.5 h-2.5">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className={`w-0.5 rounded-full transition-all duration-500 ${i <= signal ? `bg-${colorBase}-500` : 'bg-white/10'}`} style={{ height: `${i * 20}%` }}></div>
               ))}
            </div>
            <span className="hidden lg:inline text-[8px] font-black text-gray-600 uppercase tracking-widest">NODE: {window.innerWidth > 1024 ? 'DESKTOP_ENV' : 'MOBILE_ENV'}</span>
            <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest italic">SECURE CONNECTION</span>
         </div>
      </div>

      <div className="container mx-auto py-4 md:py-6 px-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        <div className="flex items-center gap-3 cursor-pointer group w-full lg:w-auto justify-center lg:justify-start" onClick={() => window.location.reload()}>
          <div className={`w-10 h-10 md:w-12 md:h-12 bg-${colorBase}-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${colorBase}-500/20 group-hover:rotate-12 transition-all duration-500`}>
            <i className="fa-solid fa-code-branch text-lg md:text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none italic">MOD ELITE</span>
            <span className={`text-[9px] md:text-[10px] font-black text-${colorBase}-500 uppercase tracking-[0.3em]`}>STORE</span>
          </div>
        </div>

        <div className="w-full lg:max-w-2xl relative group">
          <i className={`fa-solid fa-terminal absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-${colorBase}-500 transition-colors`}></i>
          <input
            type="text" value={searchValue} placeholder={t.searchPlaceholder}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-12 focus:outline-none focus:border-${colorBase}-500/50 text-sm transition-all focus:bg-white/10`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;