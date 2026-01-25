
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
  const [showConfig, setShowConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('esmael_tmdb_key') || '');
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];

  const handleSaveApiKey = () => {
    localStorage.setItem('esmael_tmdb_key', apiKeyInput.trim());
    window.location.reload();
  };

  return (
    <>
      {showConfig && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Configurações Avançadas</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">API TMDB (v3)</label>
              <input 
                type="password" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <button onClick={handleSaveApiKey} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-${colorBase}-600 text-white`}>
              Salvar Configurações
            </button>
            <button onClick={() => setShowConfig(false)} className="w-full text-[9px] font-black uppercase text-gray-600">Fechar</button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2 animate-soft-zoom w-[260px]">
            <div className="glass p-5 rounded-[2rem] border-white/10 shadow-2xl space-y-5 w-full bg-black/80">
              <div className="space-y-3">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Temas AMOLED</span>
                <div className="flex flex-wrap gap-2.5">
                  {['rose', 'blue', 'emerald', 'purple', 'amber', 'cyan', 'red'].map(c => (
                    <button key={c} onClick={() => setTheme(c as any)} className={`w-7 h-7 rounded-full bg-${c === 'cyan' ? 'cyan-400' : c + '-500'} border-2 transition-all ${activeColor.includes(c) ? 'border-white scale-110' : 'border-transparent opacity-30'}`} />
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-white/5 w-full"></div>

              <button onClick={() => setIsEnergySaving(!isEnergySaving)} className={`w-full px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between transition-all ${isEnergySaving ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400'}`}>
                <span className="text-[9px] font-black uppercase">{isEnergySaving ? 'AMOLED Puro' : 'Brilho Aurora'}</span>
                <i className={`fa-solid ${isEnergySaving ? 'fa-moon' : 'fa-sun'} text-[10px]`}></i>
              </button>

              <button onClick={() => { setShowConfig(true); setIsOpen(false); }} className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-gray-500 hover:text-white transition-all">
                <span className="text-[9px] font-black uppercase">Ajustes Técnicos</span>
                <i className="fa-solid fa-gear text-[10px]"></i>
              </button>
              
              <div className="w-full py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>
                <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Acesso Vitalício Ativo</span>
              </div>
            </div>

            <button onClick={() => { onOpenDev(); setIsOpen(false); }} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl border border-white/10 shadow-xl w-full flex justify-between items-center transition-all">
              <span className="text-[9px] font-black uppercase tracking-widest">Esmael Vision</span>
              <i className="fa-solid fa-id-badge opacity-40"></i>
            </button>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-zinc-900 border-white/10 rotate-90' : `bg-${colorBase}-600 shadow-${colorBase}-500/30`}`}>
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-clapperboard'} text-3xl text-white`}></i>
        </button>
      </div>
    </>
  );
};

export default CineHub;
