
import React, { useEffect, useState } from 'react';
import { AppItem, Language } from '../types';
import { translations } from '../translations';
import { translateAppDetails } from '../services/geminiService';

interface AppDetailsProps {
  app: AppItem;
  onClose: () => void;
  language: Language;
  activeColor: string;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  
  const [displayDescription, setDisplayDescription] = useState(app.description);
  const [displayFeatures, setDisplayFeatures] = useState<string[]>(app.modFeatures);
  const [isTranslating, setIsTranslating] = useState(false);

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    if (language !== 'pt' && !app.isVerified) {
      setIsTranslating(true);
      translateAppDetails(app.name, app.description, app.modFeatures, language)
        .then(data => {
          if (data.description) setDisplayDescription(data.description);
          if (data.features) setDisplayFeatures(data.features);
        })
        .finally(() => setIsTranslating(false));
    }

    let step = 0;
    const scanInterval = setInterval(() => {
      setScanStep(step);
      step++;
      if (step >= t.scanSteps.length) {
        clearInterval(scanInterval);
        setTimeout(() => setIsScanning(false), 400);
      }
    }, 500);

    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(scanInterval);
    };
  }, [language, app, t.scanSteps.length]);

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 15) + 5; 
      current += increment;
      
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setRedirecting(true);
        setTimeout(() => {
          window.open(app.downloadUrl, '_blank');
          setDownloading(false);
          setRedirecting(false);
          setProgress(0);
        }, 1000);
      } else {
        setProgress(current);
      }
    }, 80);
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black backdrop-blur-3xl animate-fade-in">
        <div className="w-24 h-24 mb-8 relative">
           <div className={`absolute inset-0 border-4 border-${colorBase}-500/10 rounded-full`}></div>
           <div className={`absolute inset-0 border-4 border-t-${colorBase}-500 rounded-full animate-spin`}></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fa-solid fa-shield-check text-3xl text-${colorBase}-500 animate-pulse`}></i>
           </div>
        </div>
        <div className="text-center space-y-3">
           <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">{t.secureProtocol}</h2>
           <p className={`text-[10px] font-black uppercase tracking-widest text-${colorBase}-400 h-4`}>
             {t.scanSteps[scanStep]}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] relative p-6 md:p-10 scrollbar-hide animate-soft-zoom border-white/10 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-10 border-white/10 active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-6">
            <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl aspect-square">
               <img src={app.icon} alt={app.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent`}></div>
               <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`}></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{t.verifiedBy}</span>
               </div>
            </div>
            
            <div className="glass p-5 rounded-3xl space-y-4 border border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{t.version}</span>
                <span className={`px-3 py-1 bg-${colorBase}-500/10 text-${colorBase}-400 rounded-lg text-[10px] font-black`}>{app.version}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{t.size}</span>
                <span className="font-black text-white text-xs">{app.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{t.rating}</span>
                <span className="text-yellow-400 font-black text-xs">{app.rating} <i className="fa-solid fa-star text-[9px] ml-1"></i></span>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 relative overflow-hidden ${
                redirecting 
                ? 'bg-emerald-600 text-white' 
                : `bg-white text-black hover:bg-gray-100 disabled:opacity-50`
              }`}
            >
              {redirecting ? (
                <><i className="fa-solid fa-check"></i>{t.redirecting}</>
              ) : downloading ? (
                <span className="relative z-10 uppercase tracking-widest">{t.generatingLink} {progress}%</span>
              ) : (
                <><i className="fa-solid fa-download"></i>{t.downloadBtn}</>
              )}
              {downloading && !redirecting && (
                 <div className={`absolute bottom-0 left-0 h-1 bg-${colorBase}-500 transition-all duration-300`} style={{ width: `${progress}%` }}></div>
              )}
            </button>
          </div>

          <div className="md:col-span-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className={`text-[9px] font-black text-${colorBase}-500 uppercase tracking-widest`}>{t.modEdition}</span>
                 <div className="h-[1px] flex-1 bg-white/5"></div>
              </div>
              
              <div className="flex items-center gap-2 mb-4 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl w-fit">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {t.officialDev}: {app.author}
                  </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{app.name}</h2>
              <div className="flex gap-2 flex-wrap">
                {displayFeatures.map((f, i) => (
                  <span key={i} className="text-[8px] font-black bg-white/5 text-gray-400 px-4 py-2 rounded-xl uppercase border border-white/5">
                    <i className={`fa-solid fa-bolt-lightning text-${colorBase}-400 mr-2`}></i>{f}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t.aboutMod}</h4>
              <div className={`text-gray-400 leading-relaxed text-lg font-medium transition-opacity duration-300 ${isTranslating ? 'opacity-30' : 'opacity-100'}`}>
                {displayDescription}
                <br />
                <span className="text-white font-bold mt-2 block">{t.optimizedText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
