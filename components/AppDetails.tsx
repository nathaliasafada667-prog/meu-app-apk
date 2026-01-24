
import React, { useEffect, useState } from 'react';
import { MovieItem, Language } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPremiumUser, setIsPremiumUser] = useState(() => localStorage.getItem('esmael_premium_status') === 'active');
  
  const [showDownloadHub, setShowDownloadHub] = useState(false);
  const [downloadStage, setDownloadStage] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [genStep, setGenStep] = useState(0);

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  const actorsList = Array.isArray(app.actors) ? app.actors : [];

  const genSteps = [
    "CONTORNANDO RESTRIÇÕES...",
    "ALOCANDO LARGURA DE BANDA...",
    "GERANDO TOKEN 4K...",
    "LINK PRONTO!"
  ];

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

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
    }
    return url;
  };

  const handleWatch = () => {
    if (app.isPremium && !isPremiumUser) {
      setErrorMsg("Acesso VIP Necessário.");
      setShowCodeEntry(true);
      return;
    }
    if (app.videoUrl.includes('drive.google.com') || app.videoUrl.includes('.mp4')) {
      setIsPlaying(true);
    } else {
      window.open(app.videoUrl, '_blank');
    }
  };

  const handleDownloadClick = () => {
    if (!isPremiumUser) {
      setErrorMsg("Downloads exclusivos para Membros VIP.");
      setShowCodeEntry(true);
      return;
    }
    setShowDownloadHub(true);
    startDownloadGeneration();
  };

  const startDownloadGeneration = () => {
    setDownloadStage('generating');
    let step = 0;
    const interval = setInterval(() => {
      setGenStep(step);
      step++;
      if (step >= genSteps.length) {
        clearInterval(interval);
        setTimeout(() => setDownloadStage('ready'), 500);
      }
    }, 800);
  };

  const handleVerifyCode = async () => {
    if (!activationCode.trim()) return;
    setIsVerifying(true);
    setErrorMsg('');

    try {
      // APENAS VERIFICA SE O CÓDIGO EXISTE NO BANCO - SEM TRAVA DE USO ÚNICO
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', activationCode.trim())
        .single();

      if (error || !data) {
        setErrorMsg('Código incorreto ou inválido.');
      } else {
        // Sucesso: Ativa o premium no navegador localmente para sempre
        localStorage.setItem('esmael_premium_status', 'active');
        setIsPremiumUser(true);
        setShowCodeEntry(false);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão com CineDB.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShare = () => {
    const shareText = `Confira "${app.title}" no EsmaelX Cine!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      });
    }
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black backdrop-blur-3xl">
        <div className="w-24 h-24 mb-8 relative">
           <div className={`absolute inset-0 border-4 border-${colorBase}-500/10 rounded-full`}></div>
           <div className={`absolute inset-0 border-4 border-t-${colorBase}-500 rounded-full animate-spin`}></div>
           <i className="fa-solid fa-film text-3xl text-white absolute inset-0 flex items-center justify-center animate-pulse"></i>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-widest text-${colorBase}-400`}>{t.scanSteps[scanStep]}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/98 backdrop-blur-xl animate-fade-in">
      
      {showDownloadHub && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
          <div className="glass max-w-lg w-full p-10 rounded-[3rem] border-white/10 space-y-8 animate-soft-zoom relative overflow-hidden bg-black">
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${colorBase}-500/10 blur-[80px] rounded-full`}></div>
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-3xl bg-${colorBase}-500/20 flex items-center justify-center text-3xl text-${colorBase}-500 border border-${colorBase}-500/30`}>
                <i className={`fa-solid ${downloadStage === 'ready' ? 'fa-cloud-arrow-down' : 'fa-microchip animate-pulse'}`}></i>
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase">Download VIP</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Acesso Premium Liberado</p>
            </div>

            {downloadStage === 'generating' && (
              <div className="space-y-6">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-${colorBase}-500 transition-all duration-700`} style={{ width: `${((genStep + 1) / genSteps.length) * 100}%` }}></div>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest text-${colorBase}-400 text-center animate-pulse`}>{genSteps[genStep]}</p>
              </div>
            )}

            {downloadStage === 'ready' && (
              <div className="space-y-4 animate-fade-in">
                <button onClick={() => window.open(app.downloadUrl, '_blank')} className="w-full p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-${colorBase}-500/10 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"><i className="fa-solid fa-file-video text-xl"></i></div>
                    <div className="text-left"><p className="text-xs font-black text-white">BAIXAR MP4 (Full HD)</p><p className="text-[9px] font-bold text-gray-500 uppercase">SERVER VIP 01</p></div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-800"></i>
                </button>
                <button onClick={() => setShowDownloadHub(false)} className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-all pt-6">Fechar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCodeEntry && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
          <div className="glass max-w-md w-full p-12 rounded-[3.5rem] border-white/10 text-center space-y-8 animate-soft-zoom bg-black">
            <div className={`w-24 h-24 bg-${colorBase}-500/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl text-${colorBase}-500 border border-${colorBase}-500/20`}>
              <i className="fa-solid fa-crown animate-bounce"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black tracking-tighter uppercase text-white">EsmaelX Elite</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{errorMsg || "Insira seu Token VIP para ativar o acesso ilimitado."}</p>
            </div>
            <div className="space-y-5">
              <input 
                type="text" value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="TOKEN"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 text-center font-black tracking-[0.3em] text-white focus:outline-none focus:border-${colorBase}-500/50 uppercase"
              />
              <button 
                onClick={handleVerifyCode} disabled={isVerifying || !activationCode.trim()}
                className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isVerifying ? 'bg-white/5 text-gray-700' : `bg-${colorBase}-600 text-white shadow-2xl shadow-${colorBase}-500/20`}`}
              >
                {isVerifying ? 'Verificando no DB...' : 'Ativar Agora'}
              </button>
              <button onClick={() => setShowCodeEntry(false)} className="w-full py-2 text-gray-700 text-[9px] font-black uppercase hover:text-white transition-all">Voltar</button>
            </div>
          </div>
        </div>
      )}

      <div className={`glass w-full ${isPlaying ? 'h-full md:h-[95vh]' : 'max-h-[90vh]'} max-w-6xl overflow-hidden rounded-none md:rounded-[4rem] relative animate-soft-zoom border-white/10 shadow-[0_60px_120px_rgba(0,0,0,1)] flex flex-col bg-black/40`}>
        {isPlaying ? (
          <div className="flex-1 flex flex-col bg-black relative">
            <button onClick={() => setIsPlaying(false)} className="absolute top-8 left-10 z-20 px-8 py-4 glass rounded-[1.5rem] text-[10px] font-black uppercase text-white active:scale-95"><i className="fa-solid fa-arrow-left mr-2"></i> Fechar Player</button>
            <iframe src={getEmbedUrl(app.videoUrl)} className="w-full h-full border-none" allow="autoplay; fullscreen" allowFullScreen></iframe>
          </div>
        ) : (
          <div className="overflow-y-auto scrollbar-hide flex-1">
            <div className="relative h-[45vh] min-h-[350px] w-full">
               <img src={app.backdrop} alt="" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
               <div className="absolute top-8 right-10 flex gap-4">
                  <button onClick={handleShare} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white"><i className="fa-solid fa-share-nodes"></i></button>
                  <button onClick={onClose} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white"><i className="fa-solid fa-xmark"></i></button>
               </div>
               <div className="absolute bottom-10 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                     <span className={`px-4 py-1.5 bg-${colorBase}-600 text-white text-[10px] font-black rounded-xl uppercase`}>{app.category}</span>
                     <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">{app.title}</h2>
                  </div>
                  <div className="flex gap-5">
                     <button onClick={handleWatch} className={`px-12 py-6 bg-${colorBase}-600 text-white rounded-[2.5rem] font-black text-sm uppercase transition-all shadow-2xl active:scale-95`}>
                        {app.isPremium && !isPremiumUser ? <i className="fa-solid fa-lock mr-2"></i> : <i className="fa-solid fa-play mr-2"></i>}
                        {app.isPremium && !isPremiumUser ? 'LIBERAR VIP' : 'ASSISTIR AGORA'}
                     </button>
                     <button onClick={handleDownloadClick} className="px-8 py-6 glass text-white rounded-[2.5rem] font-black text-sm uppercase transition-all active:scale-95"><i className="fa-solid fa-download"></i></button>
                  </div>
               </div>
            </div>
            <div className="p-12 grid grid-cols-1 md:grid-cols-12 gap-16">
               <div className="md:col-span-8 space-y-10">
                  <div className="space-y-5">
                     <h4 className="text-[12px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-3"><i className={`fa-solid fa-align-left text-${colorBase}-500`}></i> Sinopse</h4>
                     <p className="text-gray-400 leading-relaxed text-2xl font-medium">{app.description}</p>
                  </div>
               </div>
               <div className="md:col-span-4 space-y-8">
                  <div className="glass p-8 rounded-[3rem] border-white/5 space-y-8 bg-white/[0.01]">
                     <div className="flex justify-between items-center"><span className="text-gray-600 text-[10px] font-black uppercase">Direção</span><span className="text-white font-black text-sm">{app.director}</span></div>
                     <div className="flex justify-between items-center"><span className="text-gray-600 text-[10px] font-black uppercase">Nota IMDb</span><span className="text-white font-black text-sm">{app.rating}</span></div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDetails;
