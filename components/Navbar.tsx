
import React, { useState, useCallback, useEffect } from 'react';
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
  const [isListening, setIsListening] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % t.tickerMsgs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t.tickerMsgs.length]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearch(val);
  };

  const handleVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'pt' ? 'pt-BR' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => handleSearchChange(event.results[0][0].transcript);
    recognition.start();
  }, [language]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 backdrop-blur-3xl transition-all duration-500">
      <div className="bg-black/80 border-b border-white/5 py-1 px-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}></div>
            <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">{t.tickerMsgs[tickerIndex]}</span>
         </div>
         <div className="hidden md:flex gap-4">
            <span className="text-[8px] font-black text-gray-600 uppercase">ESMAELX CINE CORE: v4.0</span>
            <span className="text-[8px] font-black text-gray-600 uppercase">ENCRYPTED: YES</span>
         </div>
      </div>

      <div className="container mx-auto py-5 px-6 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className={`w-12 h-12 bg-${colorBase}-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${colorBase}-500/20 group-hover:rotate-12 transition-all duration-500`}>
            <i className="fa-solid fa-clapperboard text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter leading-none">EsmaelX</span>
            <span className={`text-[10px] font-black text-${colorBase}-500 uppercase tracking-[0.3em]`}>PREMIUM</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl relative group">
          <i className={`fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-${colorBase}-500 transition-colors`}></i>
          <input
            type="text" value={searchValue} placeholder={t.searchPlaceholder}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-${colorBase}-500/50 text-sm transition-all focus:bg-white/10 focus:ring-4 focus:ring-${colorBase}-500/10`}
          />
          <button onClick={handleVoiceSearch} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-white transition-colors'}`}>
            <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
