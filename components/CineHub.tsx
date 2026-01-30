
import React, { useState, useEffect } from 'react';
import { Language, ThemeColor, UserProfile, AnimationStyle, ModAppItem } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase.ts';

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
  onOpenDownloader: () => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, 
  isEnergySaving, setIsEnergySaving, onOpenDev, user, onLogout, 
  onRequireAuth, onShowPricing, animationStyle, setAnimationStyle,
  isCyberMode, setIsCyberMode, glassIntensity, setGlassIntensity,
  activeFont, setActiveFont, favorites, apps, onSelectApp, onOpenDownloader
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'access' | 'collection' | 'tools' | 'settings'>('access');
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  const fonts = ['Inter', 'Orbitron', 'JetBrains Mono', 'Bebas Neue', 'Syncopate'];
  const animations: { id: AnimationStyle; label: string }[] = [
    { id: 'soft-zoom', label: 'Soft Zoom' },
    { id: 'cyber-glitch', label: 'Cyber Glitch' },
    { id: 'slide-deep', label: 'Slide Deep' },
    { id: 'rotate-3d', label: 'Rotate 3D' }
  ];
  const themes: ThemeColor[] = ['blue', 'emerald', 'rose', 'amber', 'purple', 'cyan', 'red', 'orange', 'lime', 'fuchsia'];

  const getDynamicHeader = () => {
    switch (activeTab) {
      case 'access': return { small: 'Identidade Digital', big: t.accessTab };
      case 'collection': return { small: 'Biblioteca Local', big: t.collectionTab };
      case 'tools': return { small: 'Recursos Extraordinários', big: 'Tools' };
      case 'settings': return { small: 'Kernel do Sistema', big: t.settingsTab };
      default: return { small: 'CineHub v4.1', big: t.agentPanel };
    }
  };

  const headerInfo = getDynamicHeader();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const favoriteApps = apps.filter(app => favorites.includes(app.id));

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-50 w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-all group">
        <i className="fa-solid fa-ghost text-xl md:text-2xl"></i>
        {favorites.length > 0 && <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black animate-pulse">{favorites.length}</div>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end p-0 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          <div className="glass w-full md:w-[450px] lg:w-[500px] h-[85vh] md:h-[90vh] bg-black/60 border-t md:border border-white/10 rounded-t-[3rem] md:rounded-[3.5rem] relative flex flex-col overflow-hidden animate-slide-deep shadow-[0_0_100px_rgba(0,0,0,1)]">
            
            <div className="p-8 pb-4 flex items-center justify-between">
               <div className="flex flex-col min-h-[60px] justify-center">
                  <span key={`small-${activeTab}`} className={`text-${colorBase}-500 text-[9px] font-black uppercase tracking-[0.4em] animate-title-slide`}>
                    {headerInfo.small}
                  </span>
                  <h2 key={`big-${activeTab}`} className="text-2xl font-black text-white italic tracking-tighter animate-title-slide">
                    {headerInfo.big}
                  </h2>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="flex px-8 mb-6 overflow-x-auto no-scrollbar">
              <div className="flex-1 bg-white/5 p-1 rounded-2xl flex gap-1">
                {(['access', 'collection', 'tools', 'settings'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-3 rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? `bg-${colorBase}-600 text-white` : 'text-gray-500'}`}
                  >
                    {tab === 'access' ? t.accessTab : tab === 'collection' ? t.collectionTab : tab === 'tools' ? 'Tools' : t.settingsTab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-20">
              {activeTab === 'access' && (
                <div className="space-y-6 animate-soft-zoom">
                   {user ? (
                       <div className="glass p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
                          <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-24 h-24 rounded-full border-4 border-black shadow-2xl mb-6" />
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{user.username}</h3>
                          <p className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8`}>{user.is_premium ? 'Elite Member' : 'Guest Member'}</p>
                          <button onClick={onLogout} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all">{t.disconnectBtn}</button>
                       </div>
                   ) : (
                     <div className="glass p-10 rounded-[2.5rem] border-white/10 text-center space-y-8">
                        <i className={`fa-solid fa-user-secret text-3xl text-${colorBase}-500`}></i>
                        <button onClick={onRequireAuth} className={`w-full py-5 rounded-2xl bg-${colorBase}-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl`}>{t.validateProtocol}</button>
                     </div>
                   )}
                </div>
              )}
              {activeTab === 'collection' && (
                <div className="space-y-4 animate-soft-zoom">
                   {favoriteApps.length === 0 ? <div className="py-20 flex flex-col items-center text-center space-y-4 text-white/20"><i className="fa-solid fa-heart-crack text-5xl"></i><p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.noFavorites}</p></div> : <div className="grid grid-cols-1 gap-3">{favoriteApps.map(app => (<div key={app.id} onClick={() => { onSelectApp(app); setIsOpen(false); }} className="flex items-center gap-4 p-4 glass border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer group"><img src={app.icon} className="w-14 h-14 rounded-xl" /><div className="flex-1 min-w-0"><h4 className="text-sm font-black text-white truncate italic">{app.title}</h4></div><i className="fa-solid fa-chevron-right text-[10px] text-gray-800"></i></div>))}</div>}
                </div>
              )}
              {activeTab === 'tools' && (
                 <div className="space-y-6 animate-soft-zoom">
                    <div 
                      onClick={() => { onOpenDownloader(); setIsOpen(false); }}
                      className={`glass p-8 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer hover:bg-${colorBase}-500/5 transition-all active:scale-95`}
                    >
                       <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
                       <div className={`w-20 h-20 bg-${colorBase}-600/10 rounded-3xl flex items-center justify-center mb-6 border border-${colorBase}-500/20 group-hover:scale-110 transition-transform`}>
                          <i className={`fa-solid fa-video text-3xl text-${colorBase}-500`}></i>
                       </div>
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Social Downloader Elite</h3>
                       <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] mt-2">Baixar Vídeos do Instagram e TikTok</p>
                    </div>

                    <div className="glass p-6 rounded-3xl border-white/5 opacity-50 flex items-center gap-4">
                       <i className="fa-solid fa-microchip text-gray-600"></i>
                       <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Mais recursos em breve...</span>
                    </div>
                 </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-8 animate-soft-zoom">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-2">{t.protocolColor}</h4>
                      <div className="grid grid-cols-5 gap-3">
                         {themes.map(th => (
                           <button 
                            key={th} onClick={() => setTheme(th)}
                            className={`w-full aspect-square rounded-xl border-2 transition-all flex items-center justify-center ${theme === th ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: `var(--tw-color-${th})`, background: `linear-gradient(135deg, ${th === 'rose' ? '#f43f5e' : th === 'blue' ? '#3b82f6' : th === 'emerald' ? '#10b981' : th === 'amber' ? '#f59e0b' : th === 'purple' ? '#a855f7' : th === 'cyan' ? '#06b6d4' : th === 'red' ? '#dc2626' : th === 'orange' ? '#f97316' : th === 'lime' ? '#84cc16' : '#d946ef'}, black)` }}
                           >
                             {theme === th && <i className="fa-solid fa-check text-xs text-white"></i>}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-2">{t.siteAnimations}</h4>
                      <div className="grid grid-cols-2 gap-3">
                         {animations.map(anim => (
                           <button 
                            key={anim.id} onClick={() => setAnimationStyle(anim.id)}
                            className={`p-4 rounded-2xl glass border-white/5 text-[9px] font-black uppercase tracking-widest transition-all ${animationStyle === anim.id ? `bg-${colorBase}-600/20 border-${colorBase}-500/50 text-white` : 'text-gray-500'}`}
                           >
                             {anim.label}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{t.glassBlur}</h4>
                        <span className="text-[10px] font-black text-white">{glassIntensity}px</span>
                      </div>
                      <input 
                        type="range" min="0" max="60" value={glassIntensity} 
                        onChange={(e) => setGlassIntensity(parseInt(e.target.value))}
                        className={`w-full accent-${colorBase}-500 h-1.5 bg-white/10 rounded-full appearance-none`}
                      />
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-2">Tipografia</h4>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                         {fonts.map(font => (
                           <button 
                            key={font} onClick={() => setActiveFont(font)}
                            className={`px-5 py-3 rounded-xl glass border-white/5 text-[10px] font-black whitespace-nowrap transition-all ${activeFont === font ? `bg-${colorBase}-600/20 border-${colorBase}-500/50 text-white` : 'text-gray-500'}`}
                            style={{ fontFamily: font }}
                           >
                             {font}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="glass p-5 rounded-[2rem] border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4"><i className="fa-solid fa-earth-americas text-gray-600"></i><span className="text-[10px] font-black text-white uppercase tracking-widest">{t.terminalLang}</span></div>
                      <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-white/5 text-white text-[10px] font-black px-4 py-2 rounded-xl border-none outline-none">
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="ru">Русский</option>
                        <option value="fr">Français</option>
                        <option value="it">Italiano</option>
                        <option value="ko">한국어</option>
                        <option value="ja">日本語</option>
                      </select>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setIsCyberMode(!isCyberMode)} className={`p-5 rounded-[2rem] glass border-white/5 flex flex-col items-center gap-3 transition-all ${isCyberMode ? `bg-${colorBase}-600/20 border-${colorBase}-500/30 text-${colorBase}-500` : 'text-gray-500'}`}><i className="fa-solid fa-bolt"></i><span className="text-[8px] font-black uppercase tracking-widest">{t.cyberMode}</span></button>
                      <button onClick={() => setIsEnergySaving(!isEnergySaving)} className={`p-5 rounded-[2rem] glass border-white/5 flex flex-col items-center gap-3 transition-all ${isEnergySaving ? `bg-emerald-600/20 border-emerald-500/30 text-emerald-500` : 'text-gray-500'}`}><i className="fa-solid fa-leaf"></i><span className="text-[8px] font-black uppercase tracking-widest">{t.amoledEconomy}</span></button>
                   </div>

                   <button onClick={onOpenDev} className="w-full py-5 rounded-[2rem] bg-white text-black font-black text-[10px] uppercase tracking-widest mt-6">{t.devProfileBtn}</button>
                </div>
              )}
            </div>
            <div className="p-8 pt-4 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between"><span className="text-[12px] font-black text-white italic tracking-widest">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
          </div>
        </div>
      )}
    </>
  );
};

export default CineHub;
