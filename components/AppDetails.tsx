
import React, { useEffect, useState } from 'react';
import { MovieItem, Language } from '../types';
import { translations } from '../translations';

interface AppDetailsProps {
  app: MovieItem;
  onClose: () => void;
  language: Language;
  activeColor: string;
}

/** 
 * SERVIDORES OTIMIZADOS
 * Delta Fast e Brasil VIP configurados para máxima compatibilidade.
 */
const SERVERS = [
  { id: 'autoembed', name: 'Delta Fast', desc: 'Player Rápido (Mais Estável)', url: (id: string, type: string) => `https://player.autoembed.cc/embed/${type}/${id}` },
  { id: 'warez_br', name: 'Brasil VIP', desc: 'Conteúdo Dublado BR', url: (id: string, type: string) => `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}` },
  { id: 'vidsrc_to', name: 'Alpha HD', desc: '4K / Multi-legenda', url: (id: string, type: string) => `https://vidsrc.to/embed/${type}/${id}` },
  { id: 'vidsrc_me', name: 'Beta Multi', desc: 'Global Server', url: (id: string, type: string) => `https://vidsrc.me/embed/${type}?tmdb=${id}` },
  { id: 'embed_su', name: 'Gamma Pro', desc: 'Ultra Estabilidade', url: (id: string, type: string) => `https://embed.su/embed/${type}/${id}` }
];

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0); 
  
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
    }, 250);
    return () => {
      document.body.style.overflow = 'unset';
      clearInterval(scanInterval);
    };
  }, [t.scanSteps.length]);

  const handleWatch = () => {
    setIsPlaying(true);
  };

  const currentVideoUrl = SERVERS[selectedServer].url(app.tmdbId, app.mediaType);

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black">
        <div className={`w-24 h-24 mb-10 relative flex items-center justify-center`}>
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-2xl`}></div>
           <div className={`absolute inset-0 border-2 border-t-${colorBase}-500 rounded-2xl animate-spin`}></div>
           <i className="fa-solid fa-bolt-lightning text-2xl text-white animate-pulse"></i>
        </div>
        <p className={`text-[9px] font-black uppercase tracking-[0.5em] text-${colorBase}-400 animate-pulse`}>{t.scanSteps[scanStep]}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-fade-in">
      <div className={`w-full h-full relative overflow-hidden flex flex-col bg-black`}>
        {isPlaying ? (
          <div className="w-full h-full bg-black relative flex flex-col animate-fade-in">
            {/* Header do Player AMOLED */}
            <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 justify-between items-center z-20 glass border-b border-white/5 bg-black/95">
               <button onClick={() => setIsPlaying(false)} className="w-full md:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-3 transition-all border border-white/5">
                  <i className="fa-solid fa-chevron-left"></i> Voltar ao Catálogo
               </button>
               
               <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:max-w-3xl px-1">
                  {SERVERS.map((srv, idx) => (
                    <button 
                      key={srv.id}
                      onClick={() => setSelectedServer(idx)}
                      className={`px-5 py-2.5 rounded-xl text-[8px] font-black uppercase border transition-all whitespace-nowrap flex flex-col items-center justify-center min-w-[120px] ${selectedServer === idx ? `bg-${colorBase}-500 border-${colorBase}-500 text-white shadow-lg` : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                    >
                      <span>{srv.name}</span>
                      <span className="text-[6px] opacity-40 font-bold lowercase tracking-normal">{srv.desc}</span>
                    </button>
                  ))}
               </div>
            </div>
            
            {/* Area do Video */}
            <div className="flex-1 w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
                <iframe 
                   key={currentVideoUrl}
                   src={currentVideoUrl} 
                   className="w-full h-full border-0" 
                   // Adicionadas permissões vitais para o funcionamento do Delta Fast e outros players
                   allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; display-capture" 
                   allowFullScreen
                   referrerPolicy="no-referrer"
                ></iframe>
                
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center -z-10 bg-black">
                   <div className={`w-12 h-12 border-2 border-${colorBase}-500/10 border-t-${colorBase}-500 rounded-full animate-spin mb-4`}></div>
                   <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">Estabelecendo Link Seguro...</p>
                </div>
            </div>

            <div className="p-3 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                   <p className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500">Fluxo de Dados: 1080p Ultra HD</p>
                </div>
                <p className="text-[6px] font-black uppercase text-gray-800 tracking-widest italic">Pressione o Play do servidor para iniciar</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto no-scrollbar pb-32">
            <div className="relative h-[60vh] md:h-[70vh] w-full">
               <img src={app.backdrop} alt="" className="w-full h-full object-cover opacity-30 scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>
               
               <div className="absolute top-6 right-6 z-20">
                  <button onClick={onClose} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all border-white/10 active:scale-90"><i className="fa-solid fa-xmark text-lg"></i></button>
               </div>

               <div className="absolute bottom-10 left-6 md:left-20 max-w-5xl space-y-6 md:space-y-8 animate-soft-zoom">
                  <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 bg-${colorBase}-600 text-white text-[8px] font-black rounded-lg uppercase tracking-widest shadow-xl`}>{app.category}</span>
                     <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                        <i className="fa-solid fa-star"></i>
                        <span>{app.rating}</span>
                     </div>
                     <span className="text-white/40 text-[9px] font-black uppercase tracking-widest border-l border-white/10 pl-4">{app.year} • {app.duration}</span>
                  </div>
                  <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] uppercase italic">{app.title}</h2>
                  <div className="flex flex-wrap items-center gap-6">
                     <button onClick={handleWatch} className={`group px-12 py-6 bg-white text-black rounded-2xl font-black text-xs uppercase transition-all hover:scale-105 active:scale-95 flex items-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)]`}>
                        <i className="fa-solid fa-play"></i>
                        Assistir Agora
                     </button>
                     <div className="flex items-center gap-3 px-5 py-3 glass rounded-xl border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Servidores VIP Liberados</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="px-6 md:px-20 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Sinopse Oficial</h4>
                     <p className="text-gray-400 text-lg md:text-2xl leading-relaxed font-medium tracking-tight">
                        {app.description}
                     </p>
                  </div>
               </div>

               <div className="lg:col-span-4">
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6 bg-white/[0.01]">
                     <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Painel de Sinal</h5>
                     <div className="space-y-4">
                        {SERVERS.slice(0, 4).map(s => (
                           <div key={s.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                              <span className="text-[9px] font-black uppercase text-gray-400">{s.name}</span>
                              <span className="text-[8px] font-black text-emerald-500">DISPONÍVEL</span>
                           </div>
                        ))}
                     </div>
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
