
import React, { useEffect, useState, useRef } from 'react';
import { AppItem, Language } from '../types';
import { getAppInsight, generateAudioInsight } from '../services/geminiService';
import { translations } from '../translations';

interface AppDetailsProps {
  app: AppItem;
  onClose: () => void;
  language: Language;
  activeColor: string;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor }) => {
  const [aiInsight, setAiInsight] = useState<{insight: string, experimentalMod: string} | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = translations[language];
  // FIX: Renamed colorName to colorBase to resolve undefined variable errors on lines 135, 207, and 208
  const colorBase = activeColor.split('-')[0];

  const scanProtocols = [
    "CHECKING DATABASE INTEGRITY...",
    "VERIFYING RSA SIGNATURE...",
    "SEARCHING FOR MALICIOUS CODE...",
    "ENCRYPTING DOWNLOAD CHANNEL...",
    "SECURE - ACCESS GRANTED"
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Security Scan Simulation
    let step = 0;
    const scanInterval = setInterval(() => {
      setScanStep(step);
      step++;
      if (step >= scanProtocols.length) {
        clearInterval(scanInterval);
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 600);

    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(scanInterval);
    };
  }, []);

  useEffect(() => {
    if (!isScanning) {
      async function loadInsight() {
        setLoadingInsight(true);
        const data = await getAppInsight(app.name, language);
        setAiInsight(data);
        setLoadingInsight(false);
      }
      loadInsight();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [app.name, language, isScanning]);

  const handlePlayAudio = async () => {
    if (!aiInsight || isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    const base64 = await generateAudioInsight(aiInsight.insight);
    
    if (base64) {
      const audioSrc = `data:audio/mp3;base64,${base64}`;
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 12) + 1; 
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
        }, 1200);
      } else {
        setProgress(current);
      }
    }, 100);
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black backdrop-blur-3xl animate-fade-in">
        <div className={`w-32 h-32 mb-10 relative`}>
           <div className={`absolute inset-0 border-4 border-${colorBase}-500/20 rounded-full`}></div>
           <div className={`absolute inset-0 border-4 border-t-${colorBase}-500 rounded-full animate-spin`}></div>
           <div className={`absolute inset-4 border-2 border-${colorBase}-500/40 rounded-full animate-pulse`}></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fa-solid fa-shield-halved text-4xl text-${colorBase}-500`}></i>
           </div>
        </div>
        <div className="text-center space-y-4">
           <h2 className="text-xl font-black uppercase tracking-[0.5em] text-white">Security Protocol</h2>
           <div className="h-6 overflow-hidden">
              <p className={`text-[10px] font-black uppercase tracking-widest text-${colorBase}-400 animate-bounce`}>
                {scanProtocols[scanStep]}
              </p>
           </div>
           <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto mt-6">
              <div className={`h-full bg-${colorBase}-500 transition-all duration-500`} style={{ width: `${(scanStep + 1) * 20}%` }}></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] relative p-6 md:p-12 scrollbar-hide animate-soft-zoom shadow-[0_0_100px_rgba(0,0,0,0.9)] border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-10 border-white/10 active:scale-90"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div className="relative group overflow-hidden rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <img src={app.icon} alt={app.name} className="w-full aspect-square rounded-[3rem] object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className={`absolute inset-0 bg-gradient-to-t from-${colorBase}-600/60 via-transparent to-transparent opacity-60`}></div>
               <div className="absolute top-4 left-4 glass px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
                 Verified Mod
               </div>
            </div>
            
            <div className="glass p-6 rounded-[2.5rem] space-y-5 border border-white/5 bg-white/5 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.version}</span>
                <span className={`px-4 py-1.5 bg-${colorBase}-500/20 text-${colorBase}-400 rounded-xl text-[10px] font-black border border-${colorBase}-500/20`}>{app.version}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.size}</span>
                <span className="font-black text-white text-sm">{app.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.rating}</span>
                <span className="text-yellow-400 font-black text-sm">{app.rating} <i className="fa-solid fa-star text-[10px] ml-1"></i></span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 relative overflow-hidden group ${
                  redirecting 
                  ? 'bg-emerald-500 text-white' 
                  : `bg-white text-black hover:bg-gray-100 disabled:bg-gray-900 disabled:text-gray-700`
                }`}
              >
                {redirecting ? (
                  <><i className="fa-solid fa-check-double animate-bounce"></i>{t.redirecting}</>
                ) : downloading ? (
                  <span className="relative z-10">{t.generatingLink}: {progress}%</span>
                ) : (
                  <><i className="fa-solid fa-download"></i>{t.downloadBtn}</>
                )}
                {downloading && !redirecting && (
                   <div 
                     className={`absolute bottom-0 left-0 h-1 bg-${colorBase}-500 transition-all duration-300 shadow-[0_0_15px_rgba(var(--active-rgb),0.8)]`} 
                     style={{ width: `${progress}%` }}
                   ></div>
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className={`text-[10px] font-black text-${colorBase}-500 uppercase tracking-[0.3em]`}>Premium Module Activated</span>
                 <div className={`h-px flex-1 bg-gradient-to-r from-${colorBase}-500/40 to-transparent`}></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">{app.name}</h2>
              <div className="flex gap-2 flex-wrap mb-6">
                {app.modFeatures.map((f, i) => (
                  <span key={i} className={`text-[9px] font-black bg-white/5 text-gray-300 px-5 py-2.5 rounded-2xl uppercase border border-white/10 hover:border-white/20 transition-colors`}>
                    <i className={`fa-solid fa-microchip text-${colorBase}-400 mr-2`}></i>{f}
                  </span>
                ))}
              </div>
            </div>

            <section className="animate-fade-in">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                <i className={`fa-solid fa-bars-staggered text-${colorBase}-400`}></i> {t.aboutMod}
              </h4>
              <p className="text-gray-400 leading-relaxed text-xl font-medium italic">
                {app.description} <span className="text-white not-italic font-bold">A versão EsmaelX remove todas as restrições de servidor e otimiza o código nativo.</span>
              </p>
            </section>

            <section className={`bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group`}>
              {loadingInsight && (
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${colorBase}-500 to-transparent animate-[scan_2s_infinite] z-20`}></div>
              )}
              
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-2xl font-black flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${colorBase}-600/10 flex items-center justify-center border border-${colorBase}-500/20 shadow-inner`}>
                    <i className="fa-solid fa-brain text-purple-400"></i>
                  </div>
                  {t.aiAnalysis}
                </h4>
                
                {!loadingInsight && (
                  <button 
                    onClick={handlePlayAudio}
                    disabled={isPlayingAudio}
                    className={`flex items-center gap-3 px-6 py-3 glass rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isPlayingAudio ? `text-${colorBase}-400 border-${colorBase}-500/40 bg-white/10` : 'hover:bg-white/10 active:scale-95'}`}
                  >
                    {isPlayingAudio ? (
                      <><div className="flex gap-1 items-end h-3"><div className="w-1.5 bg-current animate-[pulse_0.8s_infinite] h-2"></div><div className="w-1.5 bg-current animate-[pulse_0.6s_infinite] h-4"></div><div className="w-1.5 bg-current animate-[pulse_1s_infinite] h-1.5"></div></div> ANALYSING...</>
                    ) : (
                      <><i className="fa-solid fa-waveform-lines text-sm"></i> AUDIO INSIGHT</>
                    )}
                  </button>
                )}
              </div>

              {loadingInsight ? (
                <div className="space-y-5 py-4">
                  <div className="h-5 bg-white/5 rounded-full w-full animate-pulse"></div>
                  <div className="h-5 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-5 bg-white/5 rounded-full w-1/2 animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-gray-200 font-bold leading-relaxed text-2xl tracking-tight">
                    "{aiInsight?.insight}"
                  </p>
                  <div className={`p-6 bg-purple-500/5 rounded-[2rem] border border-purple-500/10 flex items-start gap-6 group hover:bg-purple-500/10 transition-colors`}>
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                      <i className="fa-solid fa-flask-vial text-2xl text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">{t.experimentalTip}</p>
                      <p className={`text-white font-black text-xl leading-snug`}>{aiInsight?.experimentalMod}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AppDetails;
