
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
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, language, activeColor, user, onRequireAuth }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  
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

  const handleDownloadAttempt = () => {
    // Se o APP NÃO FOR PREMIUM, qualquer um baixa (mesmo deslogado ou conta free)
    if (!app.isPremium) {
      startDownload();
      return;
    }

    // Se o APP FOR PREMIUM, exige login
    if (!user) {
      onRequireAuth();
      return;
    }

    // Se o APP FOR PREMIUM e usuário está logado, exige status Premium
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
        <div className="relative w-48 h-48 flex items-center justify-center mb-10">
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-[3rem]`}></div>
           <div className={`absolute inset-0 border-2 border-t-${colorBase}-500 rounded-[3rem] animate-spin`}></div>
           <div className="flex flex-col items-center animate-pulse">
              <i className={`fa-solid fa-dna text-3xl text-white mb-2`}></i>
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Analisando APK</span>
           </div>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-[0.6em] text-${colorBase}-400 animate-pulse`}>{t.scanSteps[scanStep]}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-fade-in">
      {/* Paywall Modal */}
      {showPaywall && (
        <div className="absolute inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="glass max-w-md w-full p-10 rounded-[3rem] border-white/10 text-center space-y-8 animate-soft-zoom">
              <div className={`w-20 h-20 bg-${colorBase}-500/20 rounded-3xl flex items-center justify-center mx-auto`}>
                 <i className={`fa-solid fa-crown text-3xl text-${colorBase}-500`}></i>
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-tighter italic">Acesso Restrito</h3>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                   Este aplicativo requer uma assinatura ativa do Protocolo Elite. Escolha seu plano de ativação:
                 </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 <div className={`p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all text-left group cursor-pointer`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Plano Elite 30</span>
                       <span className={`text-xl font-black text-${colorBase}-500 tracking-tighter italic`}>R$ 10</span>
                    </div>
                    <p className="text-white font-black text-sm uppercase">30 Dias de Acesso Total</p>
                 </div>
                 
                 <div className={`p-6 rounded-3xl border border-${colorBase}-500/30 bg-${colorBase}-500/5 hover:bg-${colorBase}-500/10 transition-all text-left group cursor-pointer relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 px-4 py-1 bg-${colorBase}-500 text-black text-[8px] font-black uppercase tracking-widest`}>Melhor Valor</div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Plano Elite 60</span>
                       <span className={`text-xl font-black text-${colorBase}-500 tracking-tighter italic`}>R$ 20</span>
                    </div>
                    <p className="text-white font-black text-sm uppercase">60 Dias de Acesso Total</p>
                 </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl space-y-3">
                 <div className="flex items-center gap-2 justify-center">
                    <i className="fa-solid fa-paper-plane text-emerald-500 text-xs"></i>
                    <p className="text-[10px] text-emerald-500 font-black uppercase">Como Ativar:</p>
                 </div>
                 <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed">
                   Envie o e-mail cadastrado <strong>({user?.email})</strong> para o administrador via Telegram para validar seu pagamento e liberar o acesso.
                 </p>
              </div>

              <button onClick={() => setShowPaywall(false)} className="w-full text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors tracking-widest pt-4">Agora não, obrigado</button>
           </div>
        </div>
      )}

      <div className="w-full h-full relative overflow-y-auto no-scrollbar bg-black">
        <div className="relative h-[40vh] md:h-[50vh] w-full">
           <img src={app.banner} alt="" className="w-full h-full object-cover opacity-30" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
           
           <div className="absolute top-6 right-6 z-20">
              <button onClick={onClose} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all border-white/10"><i className="fa-solid fa-xmark text-xl"></i></button>
           </div>

           <div className="absolute bottom-10 left-6 md:left-20 flex flex-col md:flex-row items-end gap-8 animate-soft-zoom">
              <img src={app.icon} className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] shadow-2xl border-4 border-black" />
              <div className="space-y-4 pb-2">
                 <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 bg-${colorBase}-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl`}>{app.category}</span>
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 px-3 py-1 rounded-lg bg-emerald-500/5 flex items-center gap-2">
                       <i className="fa-solid fa-shield-check"></i> Verificado
                    </span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">{app.title}</h2>
                 <p className="text-gray-500 text-xs md:text-sm font-black uppercase tracking-widest">{app.packageName} • v{app.version}</p>
              </div>
           </div>
        </div>

        <div className="px-6 md:px-20 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 {[
                   { label: 'Tamanho', val: app.size, icon: 'fa-box' },
                   { label: 'Downloads', val: app.downloads, icon: 'fa-download' },
                   { label: 'Autor', val: app.author, icon: 'fa-user-ninja' },
                   { label: 'Update', val: app.lastUpdate, icon: 'fa-clock' }
                 ].map((stat, i) => (
                   <div key={i} className="glass p-5 rounded-[2rem] border-white/5 flex flex-col items-center text-center group">
                      <i className={`fa-solid ${stat.icon} mb-3 text-${colorBase}-500 opacity-40 group-hover:opacity-100 transition-opacity`}></i>
                      <p className="text-[8px] font-black text-gray-600 uppercase mb-1 tracking-widest">{stat.label}</p>
                      <p className="text-white text-sm font-black tracking-tight">{stat.val}</p>
                   </div>
                 ))}
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Recursos do Mod</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.modFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl group">
                         <div className={`w-8 h-8 rounded-lg bg-${colorBase}-500/10 flex items-center justify-center text-${colorBase}-500 text-xs`}>
                            <i className="fa-solid fa-bolt"></i>
                         </div>
                         <span className="text-sm font-black text-gray-300 group-hover:text-white transition-colors">{feat}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Sobre o App</h4>
                 <p className="text-gray-400 text-xl md:text-3xl leading-relaxed font-medium tracking-tight">
                    {app.description}
                 </p>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className={`glass p-10 rounded-[3.5rem] border-white/5 bg-gradient-to-b from-${colorBase}-500/5 to-transparent flex flex-col items-center text-center space-y-8`}>
                 <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center shadow-2xl">
                    <i className={`fa-solid fa-cloud-arrow-down text-3xl text-${colorBase}-500 animate-bounce`}></i>
                 </div>
                 <div className="space-y-2">
                    <h5 className="text-xl font-black text-white tracking-tighter uppercase">Transferência Segura</h5>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocolo EsmaelX v4.0 Ativo</p>
                 </div>
                 
                 <button 
                    onClick={handleDownloadAttempt}
                    disabled={isDownloading}
                    className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl ${isDownloading ? 'bg-zinc-900 text-gray-600 cursor-wait' : `bg-white text-black hover:scale-105 active:scale-95`}`}
                 >
                    {isDownloading ? (
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                    ) : (
                      <i className={`fa-solid ${app.isPremium && !user?.is_premium ? 'fa-lock' : 'fa-download'}`}></i>
                    )}
                    {isDownloading ? 'Processando...' : (app.isPremium ? (user?.is_premium ? 'Baixar Agora' : 'Liberar Acesso Premium') : 'Download Direto')}
                 </button>

                 {app.isPremium && !user?.is_premium && (
                   <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest px-4">Usuários comuns possuem download restrito por segurança.</p>
                 )}

                 <div className="flex flex-col gap-3 w-full opacity-40">
                    <div className="flex justify-between items-center px-4">
                       <span className="text-[8px] font-black uppercase text-gray-500">Node Status</span>
                       <span className="text-[8px] font-black uppercase text-emerald-500">Live</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-${colorBase}-500 w-[70%]`}></div>
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
