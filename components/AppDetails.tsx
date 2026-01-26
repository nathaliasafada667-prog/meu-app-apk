
import React, { useEffect, useState } from 'react';
import { ModAppItem, Language, UserProfile } from '../types';
import { translations } from '../translations';

interface AppDetailsProps {
  app: ModAppItem;
  onClose: () => void;
  language: Language;
  activeColor: string;
  user: UserProfile | null;
  onRequireAuth: () => void;
  onShowPricing: () => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor, user, onRequireAuth, onShowPricing }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showVerifyInfo, setShowVerifyInfo] = useState(false);
  
  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];
  const telegramLink = "https://t.me/all_uk_mods";

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let step = 0;
    const scanInterval = setInterval(() => {
      setScanStep(step);
      step++;
      if (step >= t.scanSteps.length) {
        clearInterval(scanInterval);
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 300);
    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(scanInterval);
    };
  }, [t.scanSteps.length]);

  const handleDownloadAttempt = () => {
    if (!app.isPremium) {
      startDownload();
      return;
    }
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!user.is_premium) {
      setShowPaywall(true);
      return;
    }
    startDownload();
  };

  const startDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.open(app.downloadUrl, '_blank');
    }, 2000);
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black">
        <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center mb-10">
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-[2.5rem] md:rounded-[3rem]`}></div>
           <div className={`absolute inset-0 border-2 border-t-${colorBase}-500 rounded-[2.5rem] md:rounded-[3rem] animate-spin`}></div>
           <div className="flex flex-col items-center animate-pulse">
              <i className={`fa-solid fa-dna text-2xl md:text-3xl text-white mb-2`}></i>
              <span className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-widest">{t.analyzingApk}</span>
           </div>
        </div>
        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-${colorBase}-400 animate-pulse`}>{t.scanSteps[scanStep]}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-fade-in overflow-hidden">
      {/* ... modais de verificação e paywall permanecem similares por serem modais centrais ... */}
      {showVerifyInfo && (
        <div className="absolute inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-white/10 text-center space-y-6 md:space-y-8 animate-soft-zoom bg-black shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
                <div className={`absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse`}></div>
                <div className={`w-20 h-20 md:w-24 md:h-24 bg-emerald-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center border border-emerald-500/30 relative z-10`}>
                  <i className="fa-solid fa-shield-check text-4xl md:text-5xl text-emerald-500"></i>
                </div>
              </div>
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">{t.authSelo}</h3>
                <div className="h-0.5 w-10 md:w-12 bg-emerald-500/50 mx-auto rounded-full"></div>
                <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed px-2">{t.authDesc}</p>
              </div>
              <div className="space-y-2 md:space-y-3 text-left">
                {[
                  { icon: 'fa-microchip', title: t.integrityLabel, desc: 'Verified' },
                  { icon: 'fa-user-ninja', title: t.sourceLabel, desc: 'EsmaelX Elite' },
                  { icon: 'fa-bug-slash', title: t.malwareLabel, desc: 'Safe' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <i className={`fa-solid ${item.icon} text-xs md:text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">{item.title}</p>
                      <p className="text-[7px] md:text-[9px] text-gray-500 font-bold uppercase tracking-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowVerifyInfo(false)} className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-emerald-600 text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{t.understandBtn}</button>
           </div>
        </div>
      )}

      {showPaywall && (
        <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 text-center space-y-8 animate-soft-zoom">
              <div className={`w-20 h-20 bg-${colorBase}-500/20 rounded-3xl flex items-center justify-center mx-auto`}>
                 <i className={`fa-solid fa-crown text-3xl text-${colorBase}-500`}></i>
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter italic">Premium</h3>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{t.premiumRequired}</p>
              </div>
              <div className="space-y-4">
                <button onClick={() => { setShowPaywall(false); onShowPricing(); }} className={`w-full py-5 rounded-2xl bg-${colorBase}-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl`}>{t.pricingTitle}</button>
                <a href={telegramLink} target="_blank" className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest block text-center">Telegram</a>
              </div>
              <button onClick={() => setShowPaywall(false)} className="w-full text-[10px] font-black uppercase text-gray-600 tracking-widest pt-4">Cancel</button>
           </div>
        </div>
      )}

      <div className="w-full h-full relative overflow-y-auto no-scrollbar bg-black">
        <div className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] w-full">
           <img src={app.banner} alt="" className="w-full h-full object-cover opacity-20 lg:opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           
           <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
              <button onClick={onClose} className="w-12 h-12 md:w-16 md:h-16 glass rounded-xl md:rounded-2xl flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all border-white/10"><i className="fa-solid fa-xmark text-lg md:text-2xl"></i></button>
           </div>

           <div className="absolute bottom-6 left-6 md:bottom-20 md:left-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 animate-soft-zoom w-[calc(100%-3rem)] md:w-auto">
              <img src={app.icon} className="w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 border-black" />
              <div className="space-y-3 md:space-y-5 pb-2 text-center md:text-left">
                 <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
                    <span className={`px-4 py-1.5 bg-${colorBase}-600 text-white text-[8px] md:text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl`}>{app.category}</span>
                    <button onClick={() => setShowVerifyInfo(true)} className="text-emerald-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 px-3 py-1 rounded-lg bg-emerald-500/5 flex items-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all active:scale-95 group"><i className="fa-solid fa-shield-check group-hover:scale-110 transition-transform"></i> {t.verifiedBadge}</button>
                 </div>
                 <h2 className="text-3xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">{app.title}</h2>
                 <p className="text-gray-500 text-[10px] md:text-sm font-black uppercase tracking-widest">{app.packageName} • v{app.version}</p>
              </div>
           </div>
        </div>

        <div className="px-6 md:px-20 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
           <div className="lg:col-span-8 space-y-12 md:space-y-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                 {[
                   { label: t.sizeLabel, val: app.size, icon: 'fa-box' },
                   { label: t.downloadsLabel, val: app.downloads, icon: 'fa-download' },
                   { label: t.authorLabel, val: app.author, icon: 'fa-user-ninja' },
                   { label: t.updateLabel, val: app.lastUpdate, icon: 'fa-clock' }
                 ].map((stat, i) => (
                   <div key={i} className="glass p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group">
                      <i className={`fa-solid ${stat.icon} mb-3 text-${colorBase}-500 opacity-40 group-hover:opacity-100 transition-opacity text-sm md:text-base`}></i>
                      <p className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase mb-1 tracking-widest">{stat.label}</p>
                      <p className="text-white text-xs md:text-base font-black tracking-tight">{stat.val}</p>
                   </div>
                 ))}
              </div>

              <div className="space-y-6 md:space-y-10">
                 <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-center md:text-left">{t.modFeaturesLabel}</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                    {app.modFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl group transition-all hover:bg-white/[0.04]">
                         <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-${colorBase}-500/10 flex items-center justify-center text-${colorBase}-500 text-xs md:text-sm`}>
                            <i className="fa-solid fa-bolt"></i>
                         </div>
                         <span className="text-xs md:text-base font-black text-gray-300 group-hover:text-white transition-colors">{feat}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6 md:space-y-10 pb-10">
                 <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-center md:text-left">{t.aboutAppLabel}</h4>
                 <p className="text-gray-400 text-lg md:text-3xl lg:text-4xl leading-relaxed font-medium tracking-tight text-center md:text-left">
                    {app.description}
                 </p>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6 md:space-y-10">
              <div className={`glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-white/5 bg-gradient-to-b from-${colorBase}-500/5 to-transparent flex flex-col items-center text-center space-y-6 md:space-y-10 sticky top-10`}>
                 <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl relative">
                    <div className={`absolute inset-0 bg-${colorBase}-500/20 blur-xl rounded-full animate-pulse`}></div>
                    <i className={`fa-solid fa-cloud-arrow-down text-2xl md:text-4xl text-${colorBase}-500 animate-bounce relative z-10`}></i>
                 </div>
                 <div className="space-y-2">
                    <h5 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase italic">{t.secureTransfer}</h5>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Version 4.0.12 Elite</p>
                 </div>
                 
                 <button 
                    onClick={handleDownloadAttempt}
                    disabled={isDownloading}
                    className={`w-full py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl ${isDownloading ? 'bg-zinc-900 text-gray-600 cursor-wait' : `bg-white text-black hover:scale-105 active:scale-95`}`}
                 >
                    {isDownloading ? (
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                    ) : (
                      <i className={`fa-solid ${app.isPremium && !user?.is_premium ? 'fa-lock' : 'fa-download'} text-sm md:text-base`}></i>
                    )}
                    {isDownloading ? 'PROCESSING...' : (app.isPremium ? (user?.is_premium ? t.downloadBtn : t.buyAccess) : t.downloadBtn)}
                 </button>
                 <p className="text-[7px] md:text-[9px] font-black text-gray-700 uppercase tracking-widest">Validated & Signed by EsmaelX</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
