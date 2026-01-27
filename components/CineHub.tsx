
import React, { useState, useEffect } from 'react';
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
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, 
  isEnergySaving, setIsEnergySaving, onOpenDev, user, onLogout, 
  onRequireAuth, onShowPricing, animationStyle, setAnimationStyle,
  isCyberMode, setIsCyberMode, glassIntensity, setGlassIntensity,
  activeFont, setActiveFont, favorites, apps, onSelectApp
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'access' | 'collection' | 'settings'>('access');
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fonts = ['Inter', 'Orbitron', 'JetBrains Mono', 'Bebas Neue', 'Syncopate'];
  const favoriteApps = apps.filter(app => favorites.includes(app.id));

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-all group`}
      >
        <i className={`fa-solid fa-ghost text-xl md:text-2xl group-hover:rotate-12 transition-transform`}></i>
        {favorites.length > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black animate-pulse">
            {favorites.length}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end p-0 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          
          <div className="glass w-full md:w-[450px] lg:w-[500px] h-[85vh] md:h-[90vh] bg-black/60 border-t md:border border-white/10 rounded-t-[3rem] md:rounded-[3.5rem] relative flex flex-col overflow-hidden animate-slide-deep shadow-[0_0_100px_rgba(0,0,0,1)]">
            
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className={`text-${colorBase}-500 text-[9px] font-black uppercase tracking-[0.4em]`}>CineHub v4.0</span>
                  <h2 className="text-2xl font-black text-white italic tracking-tighter">{t.agentPanel}</h2>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Tab Selector */}
            <div className="flex px-8 mb-6">
              <div className="flex-1 bg-white/5 p-1 rounded-2xl flex">
                <button 
                  onClick={() => setActiveTab('access')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'access' ? `bg-${colorBase}-600 text-white shadow-lg` : 'text-gray-500'}`}
                >
                  {t.accessTab}
                </button>
                <button 
                  onClick={() => setActiveTab('collection')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'collection' ? `bg-${colorBase}-600 text-white shadow-lg` : 'text-gray-500'}`}
                >
                  {t.collectionTab}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? `bg-${colorBase}-600 text-white shadow-lg` : 'text-gray-500'}`}
                >
                  {t.settingsTab}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-20">
              {activeTab === 'access' && (
                <div className="space-y-6 animate-soft-zoom">
                   {user ? (
                     <>
                       <div className="glass p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
                          <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
                          <div className="relative mb-6">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-24 h-24 rounded-full border-4 border-black shadow-2xl relative z-10" />
                             <div className={`absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-black flex items-center justify-center text-white shadow-lg`}>
                                <i className="fa-solid fa-check-double text-xs"></i>
                             </div>
                          </div>
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{user.username}</h3>
                          <p className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8`}>{user.is_premium ? 'Elite Member' : 'Guest Member'}</p>
                          
                          <div className="w-full space-y-3">
                             <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t.activeCodeLabel}</span>
                                <span className="text-[10px] font-black text-white">{user.access_code}</span>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t.daysRemainingLabel}</span>
                                <span className="text-[10px] font-black text-emerald-500">
                                   {Math.ceil((new Date(user.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} Dias
                                </span>
                             </div>
                          </div>
                          <button onClick={onLogout} className="mt-10 w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all">{t.disconnectBtn}</button>
                       </div>
                     </>
                   ) : (
                     <div className="glass p-10 rounded-[2.5rem] border-white/10 text-center space-y-8">
                        <div className={`w-20 h-20 bg-${colorBase}-500/10 rounded-3xl flex items-center justify-center mx-auto border border-${colorBase}-500/20`}>
                           <i className={`fa-solid fa-user-secret text-3xl text-${colorBase}-500`}></i>
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{t.restrictedAccess}</h4>
                          <p className="text-gray-500 text-xs">{t.loginTitle}</p>
                        </div>
                        <button onClick={onRequireAuth} className={`w-full py-5 rounded-2xl bg-${colorBase}-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-${colorBase}-500/20`}>{t.validateProtocol}</button>
                        <button onClick={onShowPricing} className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">{t.buyAccess}</button>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'collection' && (
                <div className="space-y-4 animate-soft-zoom">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Favoritos ❤️</span>
                      <span className={`px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-lg`}>{favoriteApps.length}</span>
                   </div>
                   
                   {favoriteApps.length === 0 ? (
                     <div className="py-20 flex flex-col items-center text-center space-y-4 text-white/20">
                        <i className="fa-solid fa-heart-crack text-5xl"></i>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.noFavorites}</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 gap-3">
                        {favoriteApps.map(app => (
                          <div 
                            key={app.id} 
                            onClick={() => { onSelectApp(app); setIsOpen(false); }}
                            className="flex items-center gap-4 p-4 glass border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer group"
                          >
                             <img src={app.icon} className="w-14 h-14 rounded-xl border border-white/5 group-hover:scale-105 transition-transform" />
                             <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-white truncate italic">{app.title}</h4>
                                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">{app.category}</p>
                             </div>
                             <i className={`fa-solid fa-chevron-right text-[10px] text-gray-800 group-hover:text-${colorBase}-500 group-hover:translate-x-1 transition-all`}></i>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 animate-soft-zoom">
                   {/* Personalização UI */}
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">{t.accountSettings}</h4>
                      
                      {/* Idioma */}
                      <div className="glass p-5 rounded-3xl border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <i className="fa-solid fa-earth-americas text-gray-500"></i>
                            <span className="text-xs font-black text-white uppercase tracking-tighter">{t.terminalLang}</span>
                         </div>
                         <select 
                           value={language} onChange={(e) => {setLanguage(e.target.value as any); localStorage.setItem('esmael_lang', e.target.value);}}
                           className="bg-white/5 text-white text-[10px] font-black px-4 py-2 rounded-xl outline-none border border-white/10 uppercase"
                         >
                            <option value="pt">PT-BR</option>
                            <option value="en">EN-US</option>
                         </select>
                      </div>

                      {/* Fontes */}
                      <div className="glass p-5 rounded-3xl border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <i className="fa-solid fa-font text-gray-500"></i>
                            <span className="text-xs font-black text-white uppercase tracking-tighter">Tipografia</span>
                         </div>
                         <select 
                           value={activeFont} onChange={(e) => setActiveFont(e.target.value)}
                           className="bg-white/5 text-white text-[10px] font-black px-4 py-2 rounded-xl outline-none border border-white/10 uppercase"
                         >
                            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                         </select>
                      </div>

                      {/* Cores */}
                      <div className="glass p-5 rounded-3xl border-white/5 space-y-4">
                         <div className="flex items-center gap-4">
                            <i className="fa-solid fa-palette text-gray-500"></i>
                            <span className="text-xs font-black text-white uppercase tracking-tighter">{t.protocolColor}</span>
                         </div>
                         <div className="flex flex-wrap gap-2.5">
                            {['blue', 'emerald', 'rose', 'amber', 'purple', 'cyan', 'red', 'orange', 'lime', 'fuchsia'].map((c) => (
                              <button 
                                key={c} onClick={() => {setTheme(c as any); localStorage.setItem('esmael_theme', c);}}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${theme === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                style={{ backgroundColor: c === 'rose' ? '#f43f5e' : c === 'blue' ? '#3b82f6' : c === 'emerald' ? '#10b981' : c === 'amber' ? '#f59e0b' : c === 'purple' ? '#a855f7' : c === 'cyan' ? '#06b6d4' : c === 'red' ? '#dc2626' : c === 'orange' ? '#f97316' : c === 'lime' ? '#84cc16' : '#d946ef' }}
                              />
                            ))}
                         </div>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-3">
                         <button 
                           onClick={() => {setIsEnergySaving(!isEnergySaving); localStorage.setItem('esmael_energy', (!isEnergySaving).toString());}}
                           className="w-full glass p-5 rounded-3xl border-white/5 flex items-center justify-between group"
                         >
                            <div className="flex items-center gap-4">
                               <i className={`fa-solid fa-bolt ${isEnergySaving ? 'text-amber-500' : 'text-gray-500'}`}></i>
                               <span className="text-xs font-black text-white uppercase tracking-tighter">{t.amoledEconomy}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-all ${isEnergySaving ? `bg-${colorBase}-600` : 'bg-white/10'}`}>
                               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isEnergySaving ? 'right-1' : 'left-1'}`}></div>
                            </div>
                         </button>

                         <button 
                           onClick={() => {setIsCyberMode(!isCyberMode); localStorage.setItem('esmael_cyber', (!isCyberMode).toString());}}
                           className="w-full glass p-5 rounded-3xl border-white/5 flex items-center justify-between group"
                         >
                            <div className="flex items-center gap-4">
                               <i className={`fa-solid fa-microchip ${isCyberMode ? `text-${colorBase}-500` : 'text-gray-500'}`}></i>
                               <span className="text-xs font-black text-white uppercase tracking-tighter">{t.cyberMode}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-all ${isCyberMode ? `bg-${colorBase}-600` : 'bg-white/10'}`}>
                               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isCyberMode ? 'right-1' : 'left-1'}`}></div>
                            </div>
                         </button>
                      </div>

                      {/* Glass Intensity */}
                      <div className="glass p-5 rounded-3xl border-white/5 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <i className="fa-solid fa-droplet text-gray-500"></i>
                               <span className="text-xs font-black text-white uppercase tracking-tighter">{t.glassBlur}</span>
                            </div>
                            <span className="text-[10px] font-black text-white">{glassIntensity}px</span>
                         </div>
                         <input 
                           type="range" min="0" max="60" value={glassIntensity} 
                           onChange={(e) => setGlassIntensity(parseInt(e.target.value))}
                           className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-${colorBase}-500`}
                         />
                      </div>

                      <button onClick={onOpenDev} className="w-full py-5 rounded-3xl bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4">{t.devProfileBtn}</button>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Clock */}
            <div className="p-8 pt-4 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${colorBase}-500 animate-pulse`}></div>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">{t.networkTime}</span>
               </div>
               <span className="text-[12px] font-black text-white italic tracking-widest">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CineHub;