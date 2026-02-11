
import React from 'react';
import { Language, ThemeColor, UserProfile, AnimationStyle, ModAppItem } from '../types';
import { translations } from '../translations';

interface CineHubProps {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  activeColor: string;
  isEnergySaving: boolean;
  setIsEnergySaving: (val: boolean) => void;
  isSnowing?: boolean;
  setIsSnowing?: (val: boolean) => void;
  onOpenDev: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onRequireAuth: () => void;
  onShowPricing: () => void;
  animationStyle: AnimationStyle;
  setAnimationStyle: (s: AnimationStyle) => void;
  isCyberMode: boolean;
  setIsCyberMode: (v: boolean) => void;
  glassIntensity: number;
  setGlassIntensity: (v: number) => void;
  activeFont: string;
  setActiveFont: (f: string) => void;
  favorites: string[];
  apps: ModAppItem[];
  onSelectApp: (app: ModAppItem) => void;
  // Props de controle
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeTab: 'access' | 'collection' | 'settings';
  setActiveTab: (t: 'access' | 'collection' | 'settings') => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, 
  isEnergySaving, setIsEnergySaving, isSnowing, setIsSnowing,
  onOpenDev, user, onLogout, 
  onRequireAuth, onShowPricing, favorites, apps, onSelectApp,
  isOpen, setIsOpen, activeTab, setActiveTab
}) => {
  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];
  const themes: ThemeColor[] = ['blue', 'emerald', 'rose', 'amber', 'purple', 'cyan', 'red', 'orange', 'lime', 'fuchsia'];

  return (
    <>
      <button 
        onClick={() => {
          setActiveTab('settings'); // Botão flutuante abre opções por padrão
          setIsOpen(true);
        }} 
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-${colorBase}-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all`}
      >
        <i className="fa-solid fa-bars text-xl"></i>
        {favorites.length > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">{favorites.length}</div>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative w-full max-w-sm h-full bg-[#0f0f0f] border-l border-white/5 shadow-2xl flex flex-col animate-slide-in-right">
            
            {/* Header do Menu */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
               <h2 className="text-xl font-bold text-white">
                 {activeTab === 'access' ? 'Minha Conta' : activeTab === 'collection' ? 'Favoritos' : 'Ajustes'}
               </h2>
               <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Abas */}
            <div className="flex p-4 gap-2">
               <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeTab === 'settings' ? `bg-${colorBase}-600 text-white` : 'bg-white/5 text-gray-500'}`}>Ajustes</button>
               <button onClick={() => setActiveTab('collection')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeTab === 'collection' ? `bg-${colorBase}-600 text-white` : 'bg-white/5 text-gray-500'}`}>Favoritos</button>
               <button onClick={() => setActiveTab('access')} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${activeTab === 'access' ? `bg-${colorBase}-600 text-white` : 'bg-white/5 text-gray-500'}`}>Conta</button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               
               {activeTab === 'settings' && (
                 <div className="space-y-8 animate-fade-in">
                    <div>
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Aparência</h3>
                       <div className="grid grid-cols-5 gap-2">
                         {themes.map(th => (
                           <button 
                            key={th} onClick={() => setTheme(th)}
                            className={`w-full aspect-square rounded-full transition-all flex items-center justify-center ${theme === th ? 'ring-2 ring-white scale-110' : ''}`}
                            style={{ backgroundColor: `var(--tw-color-${th})`, background: th === 'rose' ? '#f43f5e' : th === 'blue' ? '#3b82f6' : th === 'emerald' ? '#10b981' : th === 'amber' ? '#f59e0b' : th === 'purple' ? '#a855f7' : th === 'cyan' ? '#06b6d4' : th === 'red' ? '#dc2626' : th === 'orange' ? '#f97316' : th === 'lime' ? '#84cc16' : '#d946ef' }}
                           ></button>
                         ))}
                       </div>
                    </div>

                    <div>
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Sistema</h3>
                       <div className="space-y-3">
                          <button onClick={() => setIsEnergySaving(!isEnergySaving)} className="w-full p-4 rounded-xl bg-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                             <div className="flex items-center gap-3">
                                <i className="fa-solid fa-leaf text-emerald-500"></i>
                                <span className="text-sm font-medium text-gray-300">Modo Economia</span>
                             </div>
                             <div className={`w-10 h-5 rounded-full relative transition-colors ${isEnergySaving ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isEnergySaving ? 'left-6' : 'left-1'}`}></div>
                             </div>
                          </button>
                          
                          {/* Opção de Neve - Winter Mode */}
                          {setIsSnowing && (
                            <button onClick={() => setIsSnowing(!isSnowing)} className="w-full p-4 rounded-xl bg-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                               <div className="flex items-center gap-3">
                                  <i className="fa-regular fa-snowflake text-sky-300"></i>
                                  <span className="text-sm font-medium text-gray-300">{t.winterMode}</span>
                               </div>
                               <div className={`w-10 h-5 rounded-full relative transition-colors ${isSnowing ? 'bg-sky-400' : 'bg-gray-700'}`}>
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isSnowing ? 'left-6' : 'left-1'}`}></div>
                               </div>
                            </button>
                          )}
                       </div>
                    </div>

                    <button onClick={onOpenDev} className="w-full py-4 rounded-xl border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest hover:bg-white/5">Desenvolvedor</button>
                 </div>
               )}

               {activeTab === 'collection' && (
                  <div className="space-y-3 animate-fade-in">
                     {favorites.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                           <i className="fa-regular fa-heart text-4xl mb-3"></i>
                           <p className="text-sm text-gray-400">Sua lista de favoritos está vazia.</p>
                        </div>
                     ) : (
                        apps.filter(a => favorites.includes(a.id)).map(app => (
                        <div key={app.id} onClick={() => { onSelectApp(app); setIsOpen(false); }} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 group">
                           <img src={app.icon} className="w-12 h-12 rounded-lg" />
                           <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{app.title}</h4>
                              <p className="text-[10px] text-gray-500">{app.category}</p>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); onSelectApp(app); setIsOpen(false); }}
                             className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-${colorBase}-500 hover:bg-white/20`}
                           >
                              <i className="fa-solid fa-download text-xs"></i>
                           </button>
                        </div>
                     )))
                     }
                  </div>
               )}

               {activeTab === 'access' && (
                  <div className="text-center space-y-6 animate-fade-in">
                     {user ? (
                        <div className="p-6 bg-white/5 rounded-2xl relative overflow-hidden">
                           <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
                           <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden border-4 border-[#151515] shadow-lg">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                           </div>
                           <h3 className="text-xl font-black text-white mb-1 uppercase italic">{user.username}</h3>
                           <p className={`text-xs font-bold uppercase tracking-widest mb-6 ${user.is_premium ? 'text-amber-500' : 'text-gray-500'}`}>{user.is_premium ? 'Membro Elite' : 'Visitante'}</p>
                           
                           <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="p-3 bg-black/40 rounded-xl">
                                 <p className="text-[9px] text-gray-500 uppercase font-bold">Status</p>
                                 <p className="text-emerald-500 text-xs font-bold">Ativo</p>
                              </div>
                              <div className="p-3 bg-black/40 rounded-xl">
                                 <p className="text-[9px] text-gray-500 uppercase font-bold">Expira</p>
                                 <p className="text-white text-xs font-bold">{new Date(user.expiry_date).toLocaleDateString()}</p>
                              </div>
                           </div>

                           <button onClick={onLogout} className="text-red-500 text-xs font-bold uppercase hover:bg-red-500/10 w-full py-3 rounded-xl transition-all">Sair da Conta</button>
                        </div>
                     ) : (
                        <div className="p-8 bg-white/5 rounded-2xl space-y-6 border border-white/5">
                           <div className={`w-16 h-16 rounded-2xl bg-${colorBase}-500/10 flex items-center justify-center mx-auto text-${colorBase}-500`}>
                              <i className="fa-solid fa-user-lock text-3xl"></i>
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white">Identifique-se</h3>
                              <p className="text-xs text-gray-400 mt-2">Faça login para gerenciar sua assinatura e downloads exclusivos.</p>
                           </div>
                           <button onClick={() => { setIsOpen(false); onRequireAuth(); }} className={`w-full py-3.5 rounded-xl bg-${colorBase}-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110`}>Entrar / Registrar</button>
                        </div>
                     )}
                  </div>
               )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CineHub;
