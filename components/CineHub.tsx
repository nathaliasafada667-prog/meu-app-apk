
import React, { useState, useEffect } from 'react';
import { Language, ThemeColor, UserProfile, AnimationStyle } from '../types';
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
  setAnimationStyle: (a: AnimationStyle) => void;
  isCyberMode: boolean;
  setIsCyberMode: (v: boolean) => void;
  glassIntensity: number;
  setGlassIntensity: (v: number) => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, isEnergySaving, setIsEnergySaving, onOpenDev, user, onLogout, onRequireAuth, onShowPricing,
  animationStyle, setAnimationStyle, isCyberMode, setIsCyberMode, glassIntensity, setGlassIntensity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'access' | 'settings'>('access');
  const [showConfig, setShowConfig] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  
  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    if (user?.expiry_date) {
      const expiry = new Date(user.expiry_date);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }
  }, [user]);

  const flags: Record<Language, string> = {
    pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸', ru: '🇷🇺',
    fr: '🇫🇷', it: '🇮🇹', ko: '🇰🇷', ja: '🇯🇵'
  };

  const animations: { id: AnimationStyle, name: string }[] = [
    { id: 'soft-zoom', name: 'Soft Zoom' },
    { id: 'cyber-glitch', name: 'Cyber Glitch' },
    { id: 'slide-deep', name: 'Slide Deep' },
    { id: 'rotate-3d', name: 'Rotate 3D' }
  ];

  return (
    <>
      {showConfig && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 space-y-8 bg-black">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">{t.agentPanel}</h3>
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-500">{t.usernameLabel}</span>
                  <span className="text-sm font-black text-white uppercase">{user?.username}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-500">{t.activeCodeLabel}</span>
                  <span className="text-sm font-black text-white italic">{t.verifiedBadge}</span>
               </div>
               <div className="pt-4 border-t border-white/5">
                  <p className="text-[9px] font-black uppercase text-amber-500 mb-2">{t.validityLabel}</p>
                  <div className="flex items-end gap-2">
                     <span className="text-4xl font-black text-white italic leading-none">{daysRemaining}</span>
                     <span className="text-[10px] font-black uppercase text-gray-500 mb-1">{t.daysRemainingLabel}</span>
                  </div>
               </div>
            </div>

            <button onClick={onLogout} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">
              {t.disconnectBtn}
            </button>
            <button onClick={() => setShowConfig(false)} className="w-full text-[9px] font-black uppercase text-gray-600 tracking-widest">{t.closePanel}</button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        {isOpen && (
          <div className={`flex flex-col items-end gap-3 mb-2 w-[320px] animate-${animationStyle}`}>
            <div className="glass p-6 rounded-[2.5rem] border-white/10 shadow-2xl space-y-6 w-full bg-black/95 overflow-hidden">
              
              <div className="flex bg-white/5 p-1 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('access')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'access' ? `bg-${colorBase}-600 text-white shadow-lg` : 'text-gray-500'}`}
                >
                  <i className="fa-solid fa-shield-halved mr-2"></i> {t.accessTab}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? `bg-${colorBase}-600 text-white shadow-lg` : 'text-gray-500'}`}
                >
                  <i className="fa-solid fa-gear mr-2"></i> {t.settingsTab}
                </button>
              </div>

              {activeTab === 'access' ? (
                <div className="space-y-6 animate-fade-in">
                  {user && (
                    <div 
                      onClick={() => { setShowConfig(true); setIsOpen(false); }}
                      className={`p-4 rounded-2xl bg-${colorBase}-500/5 border border-${colorBase}-500/20 relative overflow-hidden group cursor-pointer hover:bg-${colorBase}-500/10 transition-all`}
                    >
                      <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{t.networkTime}</p>
                            <p className={`text-2xl font-black text-white italic`}>{daysRemaining} <span className="text-[10px] opacity-40 uppercase">{t.daysRemainingLabel.split(' ')[0]}</span></p>
                          </div>
                          <i className={`fa-solid fa-hourglass-half text-xs text-${colorBase}-500 animate-pulse`}></i>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${colorBase}-500 transition-all duration-1000`} 
                            style={{ width: `${Math.min(((daysRemaining || 0) / 30) * 100, 100)}%` }}
                          ></div>
                      </div>
                      <p className="text-[7px] font-black uppercase text-white/20 mt-2 text-center tracking-[0.2em]">{t.accountSettings}</p>
                    </div>
                  )}

                  {!user && (
                    <div className="space-y-3">
                      <button 
                        onClick={() => { onShowPricing(); setIsOpen(false); }}
                        className={`w-full px-4 py-4 rounded-xl border border-${colorBase}-500/30 bg-${colorBase}-500/10 flex items-center justify-center gap-3 text-white transition-all hover:bg-${colorBase}-500/20`}
                      >
                        <i className="fa-solid fa-gem text-[10px] text-amber-500"></i>
                        <span className="text-[9px] font-black uppercase tracking-widest">{t.buyAccess}</span>
                      </button>
                      
                      <button 
                        onClick={() => { onRequireAuth(); setIsOpen(false); }}
                        className="w-full px-4 py-4 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center gap-3 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <i className="fa-solid fa-key text-[10px]"></i>
                        <span className="text-[9px] font-black uppercase tracking-widest">{t.validateProtocol}</span>
                      </button>
                    </div>
                  )}
                  
                  <button onClick={() => { onOpenDev(); setIsOpen(false); }} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl border border-white/10 shadow-xl w-full flex justify-between items-center transition-all group">
                    <span className="text-[9px] font-black uppercase tracking-widest">{t.devProfileBtn}</span>
                    <i className="fa-solid fa-id-badge opacity-40 group-hover:opacity-100 transition-opacity"></i>
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                  
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">{t.terminalLang}</span>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(flags) as Language[]).map(l => (
                        <button 
                          key={l} 
                          onClick={() => setLanguage(l)}
                          className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${language === l ? `border-${colorBase}-500 bg-${colorBase}-500/10 scale-105` : 'border-white/5 bg-white/[0.02]'}`}
                        >
                          <span className="text-xl">{flags[l]}</span>
                          <span className="text-[7px] font-black uppercase opacity-40">{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">{t.siteAnimations}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {animations.map(anim => (
                        <button 
                          key={anim.id}
                          onClick={() => setAnimationStyle(anim.id)}
                          className={`py-3 rounded-xl border text-[8px] font-black uppercase tracking-tighter transition-all ${animationStyle === anim.id ? `border-${colorBase}-500 bg-${colorBase}-500/10 text-white` : 'border-white/5 bg-white/[0.02] text-gray-500 hover:text-gray-300'}`}
                        >
                          {anim.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">{t.protocolColor}</span>
                    <div className="flex flex-wrap gap-2.5">
                      {['rose', 'blue', 'emerald', 'purple', 'amber', 'cyan', 'red', 'orange', 'lime', 'fuchsia'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => setTheme(c as any)} 
                          style={{ backgroundColor: c === 'cyan' ? '#22d3ee' : c === 'fuchsia' ? '#d946ef' : c === 'lime' ? '#a3e635' : undefined }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${activeColor.includes(c) ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-30 hover:opacity-100'} ${c !== 'cyan' && c !== 'fuchsia' && c !== 'lime' ? `bg-${c}-500` : ''}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t.glassBlur}</span>
                      <span className="text-[9px] font-black text-white">{glassIntensity}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={glassIntensity}
                      onChange={(e) => setGlassIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <button onClick={() => setIsEnergySaving(!isEnergySaving)} className={`w-full px-4 py-4 rounded-xl border border-white/10 flex items-center justify-between transition-all ${isEnergySaving ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400'}`}>
                      <span className="text-[9px] font-black uppercase">{t.amoledEconomy}</span>
                      <i className={`fa-solid ${isEnergySaving ? 'fa-battery-full' : 'fa-battery-empty'} text-[10px]`}></i>
                    </button>
                    
                    <button onClick={() => setIsCyberMode(!isCyberMode)} className={`w-full px-4 py-4 rounded-xl border border-white/10 flex items-center justify-between transition-all ${isCyberMode ? `bg-${colorBase}-500/10 text-${colorBase}-400 border-${colorBase}-500/20` : 'bg-white/5 text-gray-400'}`}>
                      <span className="text-[9px] font-black uppercase">{t.cyberMode}</span>
                      <i className={`fa-solid fa-ghost text-[10px]`}></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-zinc-900 border-white/10 rotate-90 shadow-none' : `bg-${colorBase}-600 shadow-${colorBase}-500/40`}`}
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : (user ? 'fa-user-check' : 'fa-gears')} text-3xl text-white`}></i>
        </button>
      </div>
    </>
  );
};

export default CineHub;
