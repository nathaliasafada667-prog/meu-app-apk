
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

interface DevProfileProps {
  onClose: () => void;
  language: Language;
  activeColor: string;
}

const DevProfile: React.FC<DevProfileProps> = ({ onClose, language, activeColor }) => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const t = translations[language];
  const colorName = activeColor.split('-')[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    checkConnection();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const checkConnection = async () => {
    setDbStatus('checking');
    try {
      const { error } = await supabase.from('apps').select('id').limit(1);
      if (error) throw error;
      setDbStatus('online');
    } catch (err) {
      console.error(err);
      setDbStatus('offline');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl animate-fade-in">
      {/* Overlay de fechar ao clicar fora */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="glass w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] md:rounded-[3.5rem] relative border border-white/10 animate-soft-zoom shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden z-10">
        
        {/* Banner fixo no topo */}
        <div className={`h-32 md:h-44 bg-gradient-to-br from-${colorName}-900/40 via-black to-black relative flex-shrink-0`}>
           <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-4xl md:text-6xl font-black uppercase tracking-[1em] whitespace-nowrap">ESMAELX</span>
           </div>
           <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${colorName}-500 to-transparent animate-pulse`}></div>
           
           <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 glass flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all z-20 border-white/5 active:scale-90"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>
        
        {/* Conteúdo com Rolagem */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-10 pb-10">
          <div className="text-center -mt-12 md:-mt-16 mb-8 relative">
            <div className="inline-block p-1.5 md:p-2 glass rounded-full mb-4 relative group bg-black/50 backdrop-blur-xl">
              <img 
                src="https://picsum.photos/seed/esmael_dev/400/400" 
                alt="Esmael" 
                className={`w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-${colorName}-500 shadow-2xl object-cover transition-transform duration-700 group-hover:scale-105`}
              />
              <div className={`absolute bottom-1 right-1 md:bottom-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-${colorName}-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg`}>
                 <i className="fa-solid fa-shield-halved text-white text-[10px] md:text-xs"></i>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-1 tracking-tighter italic">Esmael</h2>
            <p className={`text-${colorName}-400 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] mb-6 md:mb-8`}>
               <i className="fa-solid fa-microchip mr-2"></i> {t.devSpecialist}
            </p>
            
            {/* Status Grid Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="glass px-4 py-3 md:py-4 rounded-2xl md:rounded-3xl border-white/5 flex flex-col items-center justify-center">
                <p className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Status DB</p>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dbStatus === 'online' ? 'bg-emerald-500' : dbStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <span className={`font-black text-[10px] md:text-xs uppercase tracking-tighter ${dbStatus === 'online' ? 'text-emerald-500' : dbStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}`}>
                    {dbStatus === 'online' ? 'Sincronizado' : dbStatus === 'offline' ? 'Erro SQL' : 'Checando...'}
                  </span>
                </div>
              </div>
              <div className="glass px-4 py-3 md:py-4 rounded-2xl md:rounded-3xl border-white/5 flex flex-col items-center justify-center">
                <p className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Nível</p>
                <p className="font-black text-xs md:text-sm tracking-tighter text-yellow-400 uppercase italic">Admin Elite</p>
              </div>
              <div className="glass px-4 py-3 md:py-4 rounded-2xl md:rounded-3xl border-white/5 flex flex-col items-center justify-center">
                <p className="text-[7px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Linguagem</p>
                <p className="font-black text-xs md:text-sm tracking-tighter text-white uppercase italic">Fullstack</p>
              </div>
            </div>

            {/* Descrição com ajuste de leitura */}
            <div className="bg-white/[0.02] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 mb-8 text-left relative overflow-hidden group hover:bg-white/[0.04] transition-all">
               <div className={`absolute top-0 right-0 p-4 opacity-5 text-4xl text-${colorName}-500 group-hover:opacity-10 transition-opacity`}>
                  <i className="fa-solid fa-terminal"></i>
               </div>
               <h4 className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className={`fa-solid fa-code text-${colorName}-400`}></i> {t.aboutSystem}
               </h4>
               <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                 {t.devDesc}
               </p>
            </div>

            {/* Ações de Contato Responsivas */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button 
                onClick={checkConnection}
                className={`flex-1 flex items-center justify-center gap-3 glass border-white/10 hover:bg-white/5 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all active:scale-95`}
              >
                <i className="fa-solid fa-rotate text-sm"></i>
                Reconectar DB
              </button>
              <a 
                href="https://t.me/all_uk_mods" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex-[1.5] flex items-center justify-center gap-4 bg-[#0088cc] text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_15px_35px_rgba(0,136,204,0.3)] active:scale-95 group overflow-hidden relative`}
              >
                <i className="fa-brands fa-telegram text-xl md:text-2xl group-hover:scale-110 transition-transform"></i>
                {t.telegram}
              </a>
            </div>
          </div>
        </div>
        
        {/* Rodapé fixo para indicar que há mais conteúdo */}
        <div className="h-4 bg-gradient-to-t from-black to-transparent absolute bottom-0 left-0 w-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default DevProfile;
