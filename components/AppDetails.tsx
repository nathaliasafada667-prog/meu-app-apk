
import React, { useEffect, useState } from 'react';
import { ModAppItem, Language, UserProfile } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showVerifyInfo, setShowVerifyInfo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Estado para contagem real de downloads
  const [realDownloads, setRealDownloads] = useState(app.downloads);

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

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

  // Efeito para simular o progresso do download visual
  useEffect(() => {
    let interval: any;
    if (isDownloading) {
      setDownloadProgress(0);
      interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      setDownloadProgress(0);
    }
    return () => clearInterval(interval);
  }, [isDownloading]);

  // Função para incrementar downloads reais no banco
  const incrementDownloadCount = async () => {
    try {
      // Tenta limpar a string para obter apenas números (remove 'M', 'K', etc para começar a contar real)
      // Se for a primeira vez e tiver "1.2M", vai virar "12" e começar a contar dali, ou podemos assumir 0 se for string complexa.
      // Para manter simples e funcional: extrai números, se vazio assume 0.
      let currentString = realDownloads.replace(/[^0-9]/g, '');
      let currentVal = currentString ? parseInt(currentString, 10) : 0;

      const newVal = currentVal + 1;
      const newValString = newVal.toString();

      // Atualiza visualmente na hora
      setRealDownloads(newValString);

      // Atualiza no Supabase (silenciosamente)
      await supabase
        .from('apps')
        .update({ downloads: newValString })
        .eq('id', app.id);
        
    } catch (error) {
      console.error("Erro ao contabilizar download:", error);
    }
  };

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
    incrementDownloadCount(); // Incrementa o contador real
    
    setTimeout(() => {
      setIsDownloading(false);
      window.open(app.downloadUrl, '_blank');
    }, 2200);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?app_id=${app.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const renderDownloadButton = () => {
    if (isDownloading) {
      return (
        <span className="relative z-10 flex items-center gap-2">
          <i className={`fa-solid ${downloadProgress === 100 ? 'fa-check' : 'fa-circle-notch animate-spin'}`}></i>
          <span>{downloadProgress === 100 ? 'CONCLUÍDO' : 'PROCESSANDO...'}</span>
        </span>
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

  // Cálculos para o SVG Circular
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (downloadProgress / 100) * circumference;

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
              {/* Botão Share */}
              <button onClick={handleShare} className="relative w-12 h-12 glass rounded-xl flex items-center justify-center text-white/70 border-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-95 group">
                <i className={`fa-solid ${copiedLink ? 'fa-check text-emerald-500' : 'fa-share-nodes'} text-lg`}></i>
                {copiedLink && (
                  <span className="absolute -bottom-8 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wide animate-fade-in whitespace-nowrap">
                    {t.linkCopied}
                  </span>
                )}
              </button>

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
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.9] text-shadow-lg">
                    {app.title}
                 </h2>
                 <p className="text-gray-400 text-sm font-medium">v{app.version} • {app.size} • <span className="text-white font-bold"><i className="fa-solid fa-download text-xs ml-1"></i> {realDownloads}</span></p>
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-4 relative z-10 space-y-8">
           
           {/* Download Action Area */}
           <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleDownloadAttempt}
                disabled={isDownloading}
                className={`flex-1 h-20 md:h-24 rounded-[2rem] bg-${colorBase}-600 text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-${colorBase}-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 overflow-hidden relative`}
              >
                {/* Background Progress Bar */}
                <div 
                   className={`absolute left-0 top-0 h-full bg-white/20 transition-all duration-300 ease-linear`}
                   style={{ width: `${downloadProgress}%` }}
                ></div>
                {renderDownloadButton()}
              </button>
              
              <button onClick={() => setShowVerifyInfo(true)} className="h-20 md:h-24 px-8 rounded-[2rem] glass border-white/10 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 min-w-[100px]">
                 <i className="fa-solid fa-shield-halved text-emerald-500 text-xl"></i>
                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{t.authSelo}</span>
              </button>
           </div>

           {/* Descrição e Features */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
              <div className="lg:col-span-2 space-y-8">
                 <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-6">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                       <i className={`fa-solid fa-align-left text-${colorBase}-500`}></i> {t.aboutAppLabel}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                       {app.description}
                    </p>
                 </div>

                 {app.modFeatures && app.modFeatures.length > 0 && (
                   <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-6">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                         <i className={`fa-solid fa-microchip text-${colorBase}-500`}></i> {t.modFeaturesLabel}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {app.modFeatures.map((feat, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                              <div className={`w-8 h-8 rounded-full bg-${colorBase}-500/10 flex items-center justify-center text-${colorBase}-500`}>
                                 <i className="fa-solid fa-check text-xs"></i>
                              </div>
                              <span className="text-sm font-bold text-gray-300">{feat}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                 <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Info Técnica</h3>
                    
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                       <span className="text-xs text-gray-500 font-bold uppercase">{t.authorLabel}</span>
                       <span className="text-xs text-white font-bold">{app.author}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                       <span className="text-xs text-gray-500 font-bold uppercase">{t.updateLabel}</span>
                       <span className="text-xs text-white font-bold">{app.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                       <span className="text-xs text-gray-500 font-bold uppercase">{t.sizeLabel}</span>
                       <span className="text-xs text-white font-bold">{app.size}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                       <span className="text-xs text-gray-500 font-bold uppercase">Versão</span>
                       <span className="text-xs text-white font-bold">{app.version}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-xs text-gray-500 font-bold uppercase">Package</span>
                       <span className="text-xs text-gray-500 font-mono truncate max-w-[150px]">{app.packageName}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
