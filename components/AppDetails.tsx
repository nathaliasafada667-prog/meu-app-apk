
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
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({ 
  app, onClose, language, activeColor, user, onRequireAuth, onShowPricing,
  isFavorite, onToggleFavorite
}) => {
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

  const renderDownloadButton = () => {
    if (isDownloading) {
      return (
        <><i className="fa-solid fa-circle-notch animate-spin"></i><span>PROCESSANDO...</span></>
      );
    }
    if (!app.isPremium) {
      return (
        <><i className="fa-solid fa-download"></i><span>{t.downloadBtn}</span></>
      );
    }
    if (!user) {
      return (
        <><i className="fa-solid fa-lock text-amber-500"></i><span className="text-amber-500">DESBLOQUEAR PREMIUM</span></>
      );
    }
    if (!user.is_premium) {
      return (
        <><i className="fa-solid fa-crown text-amber-500"></i><span className="text-amber-500">UPGRADE NECESSÁRIO</span></>
      );
    }
    return (
      <><i className="fa-solid fa-circle-check text-emerald-400"></i><span>DOWNLOAD ELITE</span></>
    );
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
      {/* Verify Modal */}
      {showVerifyInfo && (
        <div className="absolute inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setShowVerifyInfo(false)}>
           <div className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-white/10 text-center space-y-6 animate-soft-zoom bg-black shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 mx-auto">
                <i className="fa-solid fa-shield-check text-4xl text-emerald-500"></i>
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white">{t.authSelo}</h3>
              <p className="text-gray-400 text-xs">{t.authDesc}</p>
              <button onClick={() => setShowVerifyInfo(false)} className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest">{t.understandBtn}</button>
           </div>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setShowPaywall(false)}>
           <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 text-center space-y-8 animate-soft-zoom bg-black" onClick={e => e.stopPropagation()}>
              <i className="fa-solid fa-crown text-5xl text-amber-500"></i>
              <h3 className="text-3xl font-black uppercase italic text-white">RESTRITO</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.premiumRequired}</p>
              <button onClick={() => { setShowPaywall(false); onShowPricing(); }} className={`w-full py-5 rounded-2xl bg-${colorBase}-600 text-white font-black text-[10px] uppercase tracking-widest`}>{t.pricingTitle}</button>
           </div>
        </div>
      )}

      <div className="w-full h-full relative overflow-y-auto no-scrollbar bg-black pb-20">
        {/* Banner */}
        <div className="relative h-[40vh] md:h-[65vh] w-full">
           <img src={app.banner} alt="" className="w-full h-full object-cover opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           
           <div className="absolute top-6 right-6 z-20 flex gap-4">
              {onToggleFavorite && (
                <button onClick={() => onToggleFavorite(app.id)} className={`w-12 h-12 glass rounded-xl flex items-center justify-center border-white/10 ${isFavorite ? 'text-rose-500' : 'text-white/40'}`}>
                  <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-lg`}></i>
                </button>
              )}
              <button onClick={onClose} className="w-12 h-12 glass rounded-xl flex items-center justify-center text-white border-white/10"><i className="fa-solid fa-xmark text-lg"></i></button>
           </div>

           <div className="absolute bottom-6 left-6 md:bottom-20 md:left-20 flex flex-col md:flex-row items-center md:items-end gap-6 animate-soft-zoom">
              <img src={app.icon} className="w-28 h-28 md:w-48 md:h-48 rounded-[2.5rem] shadow-2xl border-4 border-black" />
              <div className="space-y-2 text-center md:text-left">
                 <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <span className={`px-3 py-1 bg-${colorBase}-600 text-white text-[8px] font-black rounded-lg uppercase tracking-widest`}>{app.category}</span>
                    {app.isVerified && <span className="text-emerald-500 text-[9px] font-black uppercase flex items-center gap-1"><i className="fa-solid fa-circle-check"></i> {t.verifiedBadge}</span>}
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">{app.title}</h2>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{app.packageName} • v{app.version}</p>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
           <div className="lg:col-span-8 space-y-16">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: t.sizeLabel, val: app.size, icon: 'fa-box' },
                   { label: t.downloadsLabel, val: app.downloads, icon: 'fa-download' },
                   { label: t.authorLabel, val: app.author, icon: 'fa-user-ninja' },
                   { label: t.updateLabel, val: app.lastUpdate, icon: 'fa-clock' }
                 ].map((stat, i) => (
                   <div key={i} className="glass p-5 rounded-[2rem] border-white/5 text-center flex flex-col items-center">
                      <i className={`fa-solid ${stat.icon} text-${colorBase}-500 text-lg mb-2`}></i>
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-white text-sm font-black">{stat.val}</p>
                   </div>
                 ))}
              </div>

              {/* Mod Features (A LISTA QUE VOCÊ QUERIA, MEU AMOR) */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">MOD FEATURES ELITE</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {app.modFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-5 rounded-2xl group hover:bg-white/[0.06] transition-all">
                         <div className={`w-8 h-8 rounded-lg bg-${colorBase}-500/20 flex items-center justify-center text-${colorBase}-500`}>
                            <i className="fa-solid fa-bolt-lightning text-xs"></i>
                         </div>
                         <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{feat}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t.aboutAppLabel}</h4>
                 <div className="text-gray-400 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-line border-l-2 border-white/5 pl-6">
                    {app.description}
                 </div>
              </div>
           </div>

           {/* Sidebar Download */}
           <div className="lg:col-span-4 h-fit lg:sticky lg:top-10">
              <div className="glass p-8 rounded-[3rem] border-white/5 flex flex-col items-center text-center space-y-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                 <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center relative">
                    <i className={`fa-solid fa-cloud-arrow-down text-3xl text-${colorBase}-500 animate-bounce`}></i>
                 </div>
                 <div className="space-y-1">
                    <h5 className="text-xl font-black text-white uppercase italic tracking-tighter">TRANSFERÊNCIA SEGURA</h5>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocolo v11.4</p>
                 </div>
                 
                 <button 
                    onClick={handleDownloadAttempt}
                    disabled={isDownloading}
                    className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isDownloading ? 'bg-zinc-900 text-gray-600' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-2xl shadow-white/5'}`}
                 >
                    {renderDownloadButton()}
                 </button>
                 <p className="text-[7px] font-black text-gray-800 uppercase tracking-widest">Verificado e Assinado por EsmaelX</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
