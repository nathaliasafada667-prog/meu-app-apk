
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Language, ThemeColor, SortOption } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenDev: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  activeColor: string;
  sortOption: SortOption;
  setSortOption: (s: SortOption) => void;
  isEnergySaving: boolean;
  setIsEnergySaving: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, onOpenDev, language, setLanguage, theme, setTheme, activeColor, sortOption, setSortOption, isEnergySaving, setIsEnergySaving
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tickerMsg, setTickerMsg] = useState("SISTEMA ONLINE - AGUARDANDO COMANDO");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    const msgs = ["ENCRYPTED CONNECTION", "MODS UPDATED", "AI CORE SYNC", "SECURITY ACTIVE"];
    let i = 0;
    const interval = setInterval(() => {
      setTickerMsg(msgs[i]);
      i = (i + 1) % msgs.length;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' }, { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }, { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const themes: { id: ThemeColor; class: string }[] = [
    { id: 'blue', class: 'bg-blue-500' }, { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'rose', class: 'bg-rose-500' }, { id: 'amber', class: 'bg-amber-500' },
    { id: 'purple', class: 'bg-purple-500' }, { id: 'cyan', class: 'bg-cyan-400' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 backdrop-blur-3xl transition-all duration-500">
      <div className="bg-black/80 border-b border-white/5 py-1 px-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}></div>
            <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">{tickerMsg}</span>
         </div>
      </div>

      <div className="container mx-auto py-3 px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className={`w-10 h-10 bg-${colorBase}-600 rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <i className="fa-solid fa-bolt"></i>
          </div>
          <span className="text-xl font-black uppercase hidden md:block">EsmaelX <span className={`text-${colorBase}-500`}>PRO</span></span>
        </div>

        <div className="flex-1 max-w-xl relative">
          <i className={`fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500`}></i>
          <input
            type="text" value={searchValue} placeholder={t.searchPlaceholder}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:border-${colorBase}-500/50 text-sm`}
          />
          <button onClick={handleVoiceSearch} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
            <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
          </button>
        </div>

        <div className="flex items-center gap-3 relative">
          <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white">
            <i className={`fa-solid fa-sliders ${showSettings ? 'rotate-90' : ''} transition-all`}></i>
          </button>

          {showSettings && (
            <div ref={dropdownRef} className="absolute top-14 right-0 w-[22rem] rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-2xl p-7 animate-soft-zoom space-y-8">
              <div className="flex items-center justify-between p-4 glass rounded-2xl">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-400">AMOLED Optimization</span>
                    <span className="text-xs font-black text-white">{isEnergySaving ? 'PURE BLACK ON' : 'AURORA 4D ON'}</span>
                 </div>
                 <button 
                  onClick={() => setIsEnergySaving(!isEnergySaving)}
                  className={`w-12 h-6 rounded-full relative transition-all ${isEnergySaving ? 'bg-emerald-600' : 'bg-white/10'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isEnergySaving ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Atmosfera Visual</p>
                <div className="grid grid-cols-6 gap-3">
                  {themes.map(th => (
                    <button key={th.id} onClick={() => setTheme(th.id)} className={`w-full aspect-square rounded-full ${th.class} border-2 ${theme === th.id ? 'border-white scale-110' : 'border-transparent opacity-30'}`} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Idioma</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-4 py-2 rounded-xl text-[10px] whitespace-nowrap border ${language === l.code ? `bg-${colorBase}-500/20 border-${colorBase}-500/50 text-white` : 'bg-white/5 border-transparent text-gray-500'}`}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
