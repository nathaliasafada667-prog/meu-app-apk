
import React, { useState } from 'react';
import { Language, ThemeColor, UserProfile } from '../types';
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
  user: UserProfile | null;
  onLogout: () => void;
  onRequireAuth: () => void;
  onOpenPublish: () => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, isEnergySaving, setIsEnergySaving, onOpenDev, user, onLogout, onRequireAuth, onOpenPublish
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('esmael_tmdb_key') || '');
  
  const colorBase = activeColor.split('-')[0];

  const handleSaveApiKey = () => {
    localStorage.setItem('esmael_tmdb_key', apiKeyInput.trim());
    window.location.reload();
  };

  return (
    <>
      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 space-y-8 text-center">
            <div className={`w-16 h-16 bg-${colorBase}-500/20 rounded-2xl flex items-center justify-center mx-auto`}>
               <i className={`fa-solid fa-crown text-2xl text-${colorBase}-500`}></i>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Upgrade de Protocolo</h3>
            
            <div className="space-y-4">
               <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex justify-between items-center group cursor-pointer hover:border-white/10 transition-all">
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase text-white tracking-widest">Plano 30 Dias</p>
                     <p className="text-gray-500 text-[8px] font-black uppercase">Standard Elite</p>
                  </div>
                  <span className={`text-lg font-black text-${colorBase}-500 italic`}>R$ 10</span>
               </div>
               
               <div className={`p-4 rounded-2xl border border-${colorBase}-500/30 bg-${colorBase}-500/5 flex justify-between items-center group cursor-pointer hover:bg-${colorBase}-500/10 transition-all`}>
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase text-white tracking-widest">Plano 60 Dias</p>
                     <p className="text-gray-500 text-[8px] font-black uppercase">Ultimate Elite</p>
                  </div>
                  <span className={`text-lg font-black text-${colorBase}-500 italic`}>R$ 20</span>
               </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
               <p className="text-[8px] text-emerald-500 font-black uppercase">Envie seu e-mail para validação manual.</p>
            </div>

            <button onClick={() => setShowUpgrade(false)} className="w-full text-[9px] font-black uppercase text-gray-600">Voltar</button>
          </div>
        </div>
      )}

      {showConfig && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Painel de Controle</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">API TMDB (v3)</label>
              <input 
                type="password" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <button onClick={handleSaveApiKey} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-${colorBase}-600 text-white shadow-lg shadow-${colorBase}-500/20`}>
              Salvar Alterações
            </button>
            <button onClick={onLogout} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600/10 text-red-500 border border-red-500/20">
              Sair da Conta
            </button>
            <button onClick={() => setShowConfig(false)} className="w-full text-[9px] font-black uppercase text-gray-600">Voltar</button>
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
                <span className="text-[9px] font-black uppercase">{isEnergySaving ? 'Economia Ativa' : 'Brilho Aurora'}</span>
                <i className={`fa-solid ${isEnergySaving ? 'fa-moon' : 'fa-sun'} text-[10px]`}></i>
              </button>

              <button 
                onClick={() => { 
                  if (!user) { onRequireAuth(); setIsOpen(false); }
                  else { onOpenPublish(); setIsOpen(false); }
                }} 
                className={`w-full px-4 py-3 rounded-xl border border-${colorBase}-500/20 bg-${colorBase}-500/5 flex items-center justify-between text-${colorBase}-400 hover:bg-${colorBase}-500/10 transition-all`}
              >
                <span className="text-[9px] font-black uppercase">Publicar Projeto</span>
                <i className="fa-solid fa-cloud-arrow-up text-[10px]"></i>
              </button>

              <button 
                onClick={() => { 
                  if (!user) { onRequireAuth(); setIsOpen(false); }
                  else { setShowConfig(true); setIsOpen(false); }
                }} 
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-gray-500 hover:text-white transition-all"
              >
                <span className="text-[9px] font-black uppercase">Configurações</span>
                <i className="fa-solid fa-gear text-[10px]"></i>
              </button>
              
              <button 
                onClick={() => {
                  if (!user) { onRequireAuth(); setIsOpen(false); }
                  else if (!user.is_premium) { setShowUpgrade(true); setIsOpen(false); }
                }}
                className={`w-full py-3 rounded-xl border ${user?.is_premium ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-amber-500/20 bg-amber-500/5 text-amber-500'} flex items-center justify-center gap-2`}
              >
                <i className={`fa-solid ${user?.is_premium ? 'fa-crown' : 'fa-user'} text-[10px]`}></i>
                <span className="text-[8px] font-black uppercase tracking-widest">{user?.is_premium ? 'Protocolo Premium' : (user ? 'Membro Comum' : 'Não Identificado')}</span>
              </button>
            </div>

            <button onClick={() => { onOpenDev(); setIsOpen(false); }} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl border border-white/10 shadow-xl w-full flex justify-between items-center transition-all">
              <span className="text-[9px] font-black uppercase tracking-widest">Esmael Profile</span>
              <i className="fa-solid fa-id-badge opacity-40"></i>
            </button>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-zinc-900 border-white/10 rotate-90' : `bg-${colorBase}-600 shadow-${colorBase}-500/30`}`}>
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : (user ? 'fa-user-gear' : 'fa-user-secret')} text-3xl text-white`}></i>
        </button>
      </div>
    </>
  );
};

export default CineHub;
