
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface VideoDownloaderProps {
  onClose: () => void;
  language: Language;
  activeColor: string;
}

interface VideoMetadata {
  title: string;
  thumbnail: string;
  videoUrl: string; 
  qualities: { label: string; url: string; size: string }[];
}

const VideoDownloader: React.FC<VideoDownloaderProps> = ({ onClose, language, activeColor }) => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [step, setStep] = useState(0);
  
  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  // CHAVE RAPIDAPI PARA REDES SOCIAIS (TIKTOK / INSTAGRAM)
  const RAPID_API_KEY = "1d80d00177mshe8600b6e02dc697p162870jsn2aefc4fe1707";

  const analysisSteps = [
    "SINCRONIZANDO PROTOCOLO...",
    "RIPPING DE BUFFER MÍDIA...",
    "LIMPANDO METADADOS...",
    "LINK PRONTO PARA DOWNLOAD"
  ];

  const handleAnalyze = async () => {
    if (!url) return;
    
    // Filtro para garantir que apenas links sociais sejam processados
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      alert("Este protocolo é exclusivo para TikTok e Instagram.");
      return;
    }

    setIsProcessing(true);
    setMetadata(null);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 500);

    try {
      const response = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com'
        },
        body: JSON.stringify({ url: url })
      });
      
      const data = await response.json();
      const videoInfo = data.medias?.[0] || data;

      if (videoInfo.url) {
        setMetadata({
          title: data.title || "Mídia Social Capturada",
          thumbnail: data.thumbnail || "https://picsum.photos/seed/social/400/225",
          videoUrl: videoInfo.url || "",
          qualities: (data.medias || []).map((m: any) => ({
            label: `${m.quality || 'HD'} (${m.extension || 'MP4'})`.toUpperCase(),
            url: m.url,
            size: m.formattedSize || "ALTA QUALIDADE"
          })).slice(0, 3)
        });
      } else {
        throw new Error("Mídia não encontrada");
      }

      setIsProcessing(false);
      clearInterval(stepInterval);
    } catch (error) {
      console.error("Erro na extração:", error);
      setIsProcessing(false);
      clearInterval(stepInterval);
      alert("Falha na captura. Verifique o link e tente novamente.");
    }
  };

  const handleDownload = async (downloadUrl: string, label: string) => {
    if (!downloadUrl) return;

    setDownloading(true);
    setProgress(0);

    // Simulação visual de progresso enquanto o Blob é baixado
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 5;
      });
    }, 100);

    try {
      // Técnica robusta: Captura como Blob para forçar o download no dispositivo
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Erro de rede ao baixar o arquivo.");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `EsmaelX_${label}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setTimeout(() => {
        setDownloading(false);
        clearInterval(progressInterval);
      }, 800);
    } catch (err) {
      // Fallback: Abre em nova aba se o Blob falhar (geralmente por CORS)
      console.warn("Falha no download direto, usando fallback...");
      setProgress(100);
      window.open(downloadUrl, '_blank');
      setTimeout(() => {
        setDownloading(false);
        clearInterval(progressInterval);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
      <div className="glass max-w-lg w-full p-8 md:p-10 rounded-[3rem] border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-soft-zoom">
        <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500 shadow-[0_0_20px_var(--tw-shadow-color)] shadow-${colorBase}-500`}></div>
        
        <button 
          onClick={onClose}
          disabled={downloading}
          className="absolute top-6 right-6 w-10 h-10 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-20 active:scale-90 disabled:opacity-30"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-8">
          <div className={`w-14 h-14 bg-${colorBase}-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20 shadow-2xl`}>
             <i className={`fa-solid fa-bolt text-xl text-${colorBase}-500 ${isProcessing ? 'animate-pulse' : ''}`}></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic leading-tight">SOCIAL CAPTURE</h2>
          <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.4em] mt-2">INSTAGRAM & TIKTOK PROTOCOL</p>
        </div>

        <div className="space-y-6">
           {!metadata && !isProcessing && (
             <div className="space-y-5 animate-fade-in">
                <div className="relative group">
                  <i className={`fa-solid fa-link absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-${colorBase}-500 transition-colors`}></i>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Cole o link do vídeo aqui..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                  />
                </div>
                <button 
                  onClick={handleAnalyze}
                  className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all bg-${colorBase}-600 text-white shadow-2xl shadow-${colorBase}-500/30 hover:scale-[1.01] active:scale-95`}
                >
                    CAPTURAR VÍDEO
                </button>
             </div>
           )}

           {isProcessing && (
             <div className="py-10 flex flex-col items-center gap-4 animate-fade-in text-center">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full bg-${colorBase}-500 transition-all duration-500`} style={{ width: `${(step + 1) * 25}%` }}></div>
                </div>
                <p className={`text-[8px] font-black uppercase tracking-[0.5em] text-${colorBase}-500 animate-pulse`}>{analysisSteps[step]}</p>
             </div>
           )}

           {metadata && !downloading && (
             <div className="space-y-6 animate-slide-deep">
                <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 glass bg-black group shadow-2xl">
                   <video 
                     src={metadata.videoUrl} 
                     controls 
                     className="w-full h-full object-contain"
                     poster={metadata.thumbnail}
                   />
                </div>

                <div className="grid grid-cols-1 gap-2">
                   {metadata.qualities.length > 0 ? metadata.qualities.map((q, i) => (
                     <button 
                        key={i}
                        onClick={() => handleDownload(q.url, q.label)}
                        className={`flex items-center justify-between p-4 glass border-white/5 rounded-2xl hover:bg-${colorBase}-500/10 transition-all active:scale-95 group shadow-lg`}
                     >
                        <div className="flex items-center gap-3">
                           <i className={`fa-solid fa-circle-down text-white/20 group-hover:text-${colorBase}-500 transition-colors`}></i>
                           <span className="text-[10px] font-black text-white uppercase italic">{q.label}</span>
                        </div>
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{q.size}</span>
                     </button>
                   )) : (
                     <button 
                        onClick={() => handleDownload(metadata.videoUrl, "HD")}
                        className={`w-full py-5 bg-${colorBase}-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all`}
                     >
                        <i className="fa-solid fa-download mr-2"></i> BAIXAR AGORA
                     </button>
                   )}
                </div>
                
                <button onClick={() => setMetadata(null)} className="w-full py-4 text-[8px] font-black text-gray-800 hover:text-white uppercase tracking-[0.4em] transition-colors">
                   TENTAR OUTRO LINK
                </button>
             </div>
           )}

           {downloading && (
             <div className="py-12 space-y-6 animate-fade-in">
                <div className="flex justify-between items-end px-2">
                   <div className="flex flex-col">
                      <span className={`text-[8px] font-black text-${colorBase}-500 uppercase tracking-[0.4em] animate-pulse`}>Transferindo arquivo...</span>
                      <span className="text-[6px] text-gray-700 font-black uppercase tracking-widest">NÃO FECHE O PROTOCOLO</span>
                   </div>
                   <span className="text-4xl font-black text-white italic tracking-tighter">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div 
                     className={`h-full bg-${colorBase}-500 transition-all duration-300 shadow-[0_0_15px_var(--tw-shadow-color)] shadow-${colorBase}-500`}
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
             </div>
           )}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
           <p className="text-[7px] font-black text-gray-800 uppercase tracking-[0.5em] italic">EsmaelX | Security Layer v11.4.2</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDownloader;
