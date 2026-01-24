
import React, { useState } from 'react';
import { Language, ThemeColor } from '../types';
import { translations } from '../translations';

interface CineHubProps {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  activeColor: string;
  isEnergySaving: boolean;
  setIsEnergySaving: (val: boolean) => void;
  onOpenDev: () => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, isEnergySaving, setIsEnergySaving, onOpenDev 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  const themes: { id: ThemeColor; class: string }[] = [
    { id: 'rose', class: 'bg-rose-500' }, 
    { id: 'blue', class: 'bg-blue-500' }, 
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'purple', class: 'bg-purple-500' }, 
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'cyan', class: 'bg-cyan-400' },
    { id: 'red', class: 'bg-red-600' }
  ];

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: 'pt', flag: '🇧🇷', name: 'PT' }, 
    { code: 'en', flag: '🇺🇸', name: 'EN' },
    { code: 'es', flag: '🇪🇸', name: 'ES' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Menu Expandido */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-soft-zoom w-[280px]">
          
          {/* Painel de Controle Glass */}
          <div className="glass p-5 rounded-[2.5rem] border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] space-y-5 w-full backdrop-blur-3xl">
            {/* Seletor de Cores */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block px-1">Atmosfera</span>
              <div className="flex flex-wrap gap-2.5">
                {themes.map(th => (
                  <button 
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`w-7 h-7 rounded-full ${th.class} border-2 transition-all duration-300 ${theme === th.id ? 'border-white scale-125 shadow-lg shadow-white/20' : 'border-transparent opacity-30 hover:opacity-100 hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5"></div>

            {/* Seletor de Idiomas */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block px-1">Idioma</span>
              <div className="flex gap-2">
                {languages.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all border ${language === l.code ? `bg-${colorBase}-500/20 border-${colorBase}-500/40 text-white shadow-lg` : 'bg-white/5 border-transparent text-gray-500 hover:text-white'}`}
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5"></div>

            {/* AMOLED Switch */}
            <button 
              onClick={() => setIsEnergySaving(!isEnergySaving)}
              className={`w-full px-4 py-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 transition-all duration-500 ${isEnergySaving ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3">
                <i className={`fa-solid ${isEnergySaving ? 'fa-moon' : 'fa-sun'} text-xs`}></i>
                <span className="text-[10px] font-black uppercase tracking-widest">{isEnergySaving ? 'Modo AMOLED' : 'Modo Aurora'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${isEnergySaving ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isEnergySaving ? 'left-4.5' : 'left-0.5'}`}></div>
              </div>
            </button>
          </div>

          {/* Botão: Sobre o Criador (Sobre Mim) */}
          <button 
            onClick={() => {
              onOpenDev();
              setIsOpen(false);
            }}
            className="flex items-center justify-between bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-[2rem] border border-white/10 shadow-xl transition-all active:scale-95 group w-full"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-${colorBase}-500/20 flex items-center justify-center border border-${colorBase}-500/30`}>
                <i className={`fa-solid fa-user-tie text-${colorBase}-400 text-sm`}></i>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sobre Mim</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-600 group-hover:translate-x-1 transition-transform"></i>
          </button>

          {/* Botão: Telegram Master */}
          <a 
            href="https://t.me/all_uk_mods" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-gradient-to-r from-[#0088cc] to-[#00aaff] hover:scale-[1.02] text-white px-7 py-5 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,136,204,0.4)] transition-all active:scale-95 group w-full"
          >
            <i className="fa-brands fa-telegram text-2xl group-hover:rotate-12 transition-transform duration-500"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.telegram}</span>
          </a>
        </div>
      )}

      {/* Botão Principal: O Pulsar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 active:scale-90 relative group ${isOpen ? 'bg-zinc-900 border border-white/10 rotate-90 scale-90' : `bg-${colorBase}-600 hover:scale-110`}`}
      >
        <div className={`absolute inset-0 bg-${colorBase}-500 rounded-full animate-ping opacity-20 group-hover:opacity-40`}></div>
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-clapperboard'} text-3xl text-white relative z-10`}></i>
      </button>
    </div>
  );
};

export default CineHub;
