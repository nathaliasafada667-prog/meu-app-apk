
import React, { useState, useEffect } from 'react';
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

  // CHAVE FORNECIDA PELO USUÁRIO
  const RAPID_API_KEY = "1d80d00177mshe8600b6e02dc697p162870jsn2aefc4fe1707";

  const analysisSteps = [
    "ACESSANDO SERVIDORES RAPIDAPI...",
    "VERIFICANDO PROTOCOLO DE MÍDIA...",
    "RIPPING DE BUFFER EM ALTA VELOCIDADE...",
    "GERANDO LINKS DE DOWNLOAD DIRETO..."
  ];

  const handleAnalyze = async () => {
    if (!url) return;
    setIsProcessing(true);
    setMetadata(null);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);

    try {
      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      let data;

      if (isYouTube) {
        // API DO YOUTUBE (GET)
        const response = await fetch(`https://youtube-info-download-api.p.rapidapi.com/ajax/download.php?format=mp4&url=${encodeURIComponent(url)}&audio_quality=128`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': 'youtube-info-download-api.p.rapidapi.com'
          }
        });
        data = await response.json();
        
        if (data.status === 'ok' || data.link) {
          setMetadata({
            title: data.title || "YouTube Video",
            thumbnail: data.thumb || "https://picsum.photos/seed/yt/400/225",
            videoUrl: data.link || "",
            qualities: [
              { label: "MP4 Video (HD)", url: data.link || "", size: "Alta Qualidade" },
              { label: "MP3 Audio", url: data.link || "", size: "128kbps" }
            ]
          });
        } else {
          throw new Error("Link não gerado");
        }
      } else {
        // API SOCIAL ALL-IN-ONE (POST)
        const response = await fetch('https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com'
          },
          body: JSON.stringify({ url: url })
        });
        data = await response.json();

        const videoInfo = data.medias?.[0] || data;
        if (videoInfo.url) {
          setMetadata({
            title: data.title || "Social Media Video",
            thumbnail: data.thumbnail || "https://picsum.photos/seed/social/400/225",
            videoUrl: videoInfo.url || "",
            qualities: (data.medias || []).map((m: any) => ({
              label: `${m.quality} (${m.extension})`,
              url: m.url,
              size: m.formattedSize || "N/A"
            })).slice(0, 4)
          });
        } else {
          throw new Error("Link não gerado");
        }
      }

      setIsProcessing(false);
      clearInterval(stepInterval);
    } catch (error) {
      console.error("Erro na extração:", error);
      setIsProcessing(false);
      clearInterval(stepInterval);
      alert("Falha na extração. Verifique se o link é público ou tente novamente.");
    }
  };

  const handleDownload = async (downloadUrl: string, label: string) => {
    if (!downloadUrl || downloadUrl === "#") {
      alert("Erro: Link de download vazio.");
      return;
    }

    setDownloading(true);
    setProgress(10);

    // Início visual do progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 5;
      });
    }, 100);

    try {
      // Técnica 1: Tentativa de download via Blob (Melhor experiência, força o "Salvar Como")
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("CORS or Network Error");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `EsmaelX_v11_${metadata?.title.substring(0, 10) || 'video'}_${label}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setTimeout(() => setDownloading(false), 1000);
      clearInterval(progressInterval);

    } catch (err) {
      // Técnica 2: Fallback - Se o Blob falhar (geralmente por erro de CORS), abrimos em nova aba
      console.log("Fallback: Abrindo em nova aba devido a restrições de segurança do servidor.");
      
      setProgress(100);
      
      // Criar o link e clicar imediatamente
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // Tentamos o atributo download, mas browsers ignoram se for cross-origin
      link.setAttribute('download', 'video.mp4'); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloading(false);
        clearInterval(progressInterval);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
      <div className="glass max-w-2xl w-full p-8 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-soft-zoom">
        <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500 shadow-[0_0_20px_var(--tw-shadow-color)] shadow-${colorBase}-500`}></div>
        
        <button 
          onClick={onClose}
          disabled={downloading}
          className="absolute top-6 right-6 w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-20 active:scale-90 disabled:opacity-30"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="text-center mb-10">
          <div className={`w-20 h-20 bg-${colorBase}-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20`}>
             <i className={`fa-solid fa-cloud-bolt text-3xl text-${colorBase}-500 ${isProcessing ? 'animate-bounce' : ''}`}></i>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white italic">{metadata ? 'CAPTURA PRONTA' : t.downloaderTitle}</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{metadata ? 'CLIQUE NO BOTÃO ABAIXO PARA BAIXAR' : t.downloaderDesc}</p>
        </div>

        <div className="space-y-6">
           {!metadata && !isProcessing && (
             <div className="space-y-6 animate-fade-in">
                <div className="relative group">
                  <i className={`fa-solid fa-link absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-${colorBase}-500 transition-colors`}></i>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Cole o link do vídeo aqui..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                  />
                </div>
                <button 
                  onClick={handleAnalyze}
                  className={`w-full py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] transition-all bg-${colorBase}-600 text-white shadow-2xl shadow-${colorBase}-500/30 hover:scale-[1.02] active:scale-95`}
                >
                    {t.downloaderBtn}
                </button>
             </div>
           )}

           {isProcessing && (
             <div className="py-12 flex flex-col items-center gap-6 animate-fade-in text-center">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                   <div className={`h-full bg-${colorBase}-500 transition-all duration-500`} style={{ width: `${(step + 1) * 25}%` }}></div>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] text-${colorBase}-500 animate-pulse`}>{analysisSteps[step]}</p>
             </div>
           )}

           {metadata && !downloading && (
             <div className="space-y-6 animate-slide-deep">
                <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 glass bg-black group">
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
                        className={`flex items-center justify-between p-5 glass border-white/5 rounded-2xl hover:bg-${colorBase}-500/20 transition-all group active:scale-95 shadow-xl`}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl bg-${colorBase}-500/10 flex items-center justify-center text-${colorBase}-500`}>
                              <i className={`fa-solid ${q.label.includes('MP3') ? 'fa-music' : 'fa-download'}`}></i>
                           </div>
                           <div className="text-left">
                              <span className="text-[12px] font-black text-white uppercase italic block">{q.label}</span>
                              <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{q.size}</span>
                           </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-800"></i>
                     </button>
                   )) : (
                     <button 
                        onClick={() => handleDownload(metadata.videoUrl, "HD")}
                        className={`flex items-center justify-center gap-3 p-6 bg-${colorBase}-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all`}
                     >
                        <i className="fa-solid fa-download"></i> BAIXAR EM ALTA QUALIDADE
                     </button>
                   )}
                </div>
                
                <button onClick={() => setMetadata(null)} className="w-full py-4 text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-[0.4em] transition-colors">
                  <i className="fa-solid fa-rotate-left mr-2"></i> Capturar Outro Link
                </button>
             </div>
           )}

           {downloading && (
             <div className="py-12 space-y-8 animate-fade-in">
                <div className="space-y-6">
                   <div className="flex justify-between items-end px-2">
                      <div className="flex flex-col">
                         <span className={`text-[10px] font-black text-${colorBase}-500 uppercase tracking-[0.4em] animate-pulse`}>Iniciando Transferência</span>
                         <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1">NÃO FECHE ESTA TELA</span>
                      </div>
                      <span className="text-4xl font-black text-white italic tracking-tighter">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                      <div 
                        className={`h-full bg-gradient-to-r from-${colorBase}-600 to-${colorBase}-400 transition-all duration-300 rounded-full shadow-[0_0_20px_var(--tw-shadow-color)] shadow-${colorBase}-500`}
                        style={{ width: `${progress}%` }}
                      ></div>
                   </div>
                </div>
                <div className="glass p-6 rounded-2xl border-white/5 text-center">
                   <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-relaxed">
                      Processando arquivo para o armazenamento local...
                   </p>
                </div>
             </div>
           )}
        </div>

        <div className="mt-12 text-center border-t border-white/5 pt-8">
           <p className="text-[8px] font-black text-gray-800 uppercase tracking-widest italic">Acesso Restrito: Protocolo de Extração EsmaelX v11.4</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDownloader;
