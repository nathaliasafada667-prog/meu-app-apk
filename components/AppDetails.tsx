
import React, { useEffect, useState } from 'react';
import { MovieItem, Language } from '../types';
import { translations } from '../translations';

interface AppDetailsProps {
  app: MovieItem;
  onClose: () => void;
  language: Language;
  activeColor: string;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  
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
        setTimeout(() => setIsScanning(false), 400);
      }
    }, 400);

    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(scanInterval);
    };
  }, [t.scanSteps.length]);

  const handleWatch = () => {
    window.open(app.videoUrl, '_blank');
  };

  const handleDownload = () => {
    window.open(app.downloadUrl, '_blank');
  };

  const handleShare = () => {
    const shareText = `🍿 Assista "${app.title}" em 4K HDR no EsmaelX Cine!`;
    if (navigator.share) {
      navigator.share({ title: app.title, text: shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(shareText + "\n" + window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black backdrop-blur-3xl animate-fade-in">
        <div className="w-24 h-24 mb-8 relative">
           <div className={`absolute inset-0 border-4 border-${colorBase}-500/10 rounded-full`}></div>
           <div className={`absolute inset-0 border-4 border-t-${colorBase}-500 rounded-full animate-spin`}></div>
           <div className="absolute inset-0 flex items-center justify-center text-3xl text-white">
              <i className="fa-solid fa-film animate-pulse"></i>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl animate-fade-in">
      {showShareToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] glass px-6 py-3 rounded-full border-emerald-500/50 flex items-center gap-3 animate-soft-zoom">
          <i className="fa-solid fa-circle-check text-emerald-500"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Link do Filme Copiado!</span>
        </div>
      )}

      {/* Background Image Desfocada */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={app.backdrop} alt="" className="w-full h-full object-cover blur-3xl" />
      </div>

      <div className="glass w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] relative scrollbar-hide animate-soft-zoom border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-x-hidden">
        
        {/* Header com Banner */}
        <div className="relative h-[40vh] min-h-[300px] w-full">
           <img src={app.backdrop} alt={app.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           
           <div className="absolute top-6 right-6 flex items-center gap-3">
              <button onClick={handleShare} className="w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all border-white/10 active:scale-90 text-white">
                <i className="fa-solid fa-share-nodes"></i>
              </button>
              <button onClick={onClose} className="w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all border-white/10 active:scale-90 text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
           </div>

           <div className="absolute bottom-8 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 bg-${colorBase}-500 text-white text-[10px] font-black rounded-lg uppercase`}>{app.category}</span>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{app.year} • {app.duration}</span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">{app.title}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                 <button 
                  onClick={handleWatch}
                  className={`px-10 py-5 bg-${colorBase}-500 hover:bg-${colorBase}-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-${colorBase}-500/30 flex items-center gap-3 active:scale-95`}
                 >
                    <i className="fa-solid fa-play"></i> {t.watchBtn}
                 </button>
                 <button 
                  onClick={handleDownload}
                  className="px-6 py-5 glass hover:bg-white/10 text-white rounded-[2rem] font-black text-sm uppercase transition-all flex items-center gap-3 active:scale-95 border border-white/10"
                 >
                    <i className="fa-solid fa-download"></i>
                 </button>
              </div>
           </div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-12 gap-12">
           <div className="md:col-span-8 space-y-8">
              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <i className={`fa-solid fa-quote-left text-${colorBase}-500`}></i> {t.aboutMovie}
                 </h4>
                 <p className="text-gray-300 leading-relaxed text-xl font-medium">
                    {app.description}
                 </p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">{t.mainFeatures}</h4>
                 <div className="flex flex-wrap gap-2">
                    {app.actors.map((actor, i) => ( // Usando actors agora
                      <span key={actor} className="px-5 py-2 glass border border-white/5 rounded-full text-xs font-bold text-gray-400">
                         {actor}
                      </span>
                    ))}
                 </div>
              </div>
           </div>

           <div className="md:col-span-4 space-y-6">
              <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-6 bg-white/[0.02]">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.directorLabel}</span>
                    <span className="text-white font-black text-xs">{app.director}</span>
                 </div>
                 <div className="h-[1px] w-full bg-white/5"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.ratingLabel}</span>
                    <div className="flex items-center gap-2">
                       <i className="fa-solid fa-star text-yellow-500 text-[10px]"></i>
                       <span className="text-white font-black text-xs">{app.rating}</span>
                    </div>
                 </div>
                 <div className="h-[1px] w-full bg-white/5"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.yearLabel}</span>
                    <span className="text-white font-black text-xs">{app.year}</span>
                 </div>
              </div>

              <div className={`p-6 rounded-[2rem] border border-${colorBase}-500/20 bg-${colorBase}-500/5`}>
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                    "{t.optimizedText}"
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
