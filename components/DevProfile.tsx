
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
      const { error } = await supabase.from('movies').select('id').limit(1);
      if (error) throw error;
      setDbStatus('online');
    } catch (err) {
      console.error(err);
      setDbStatus('offline');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-[3rem] overflow-hidden relative border border-white/10 animate-soft-zoom shadow-[0_0_100px_rgba(0,0,0,1)]">
        {/* Banner com efeito de scanner */}
        <div className={`h-40 bg-gradient-to-br from-${colorName}-900/40 via-black to-black relative overflow-hidden`}>
           <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-6xl font-black uppercase tracking-[1em] whitespace-nowrap">ESMAELX CINE</span>
           </div>
           <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${colorName}-500 to-transparent animate-pulse`}></div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-20 border-white/5"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="px-10 pb-12 -mt-20 text-center relative z-10">
          <div className="inline-block p-2 glass rounded-full mb-6 relative group">
            <img 
              src="https://picsum.photos/seed/esmael_dev/400/400" 
              alt="Esmael" 
              className={`w-40 h-40 rounded-full border-4 border-${colorName}-500 shadow-2xl object-cover transition-transform duration-700 group-hover:scale-105`}
            />
            <div className={`absolute bottom-3 right-3 w-10 h-10 bg-${colorName}-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg`}>
               <i className="fa-solid fa-shield-halved text-white text-xs"></i>
            </div>
          </div>
          
          <h2 className="text-5xl font-black mb-2 tracking-tighter">Esmael</h2>
          <p className={`text-${colorName}-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8`}>
             <i className="fa-solid fa-microchip mr-2"></i> {t.devSpecialist}
          </p>
          
          {/* Status do Banco de Dados em tempo real */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass px-6 py-4 rounded-3xl border-white/5 flex flex-col items-center">
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Status DB</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${dbStatus === 'online' ? 'bg-emerald-500' : dbStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <span className={`font-black text-sm uppercase tracking-tighter ${dbStatus === 'online' ? 'text-emerald-500' : dbStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}`}>
                  {dbStatus === 'online' ? 'Sincronizado' : dbStatus === 'offline' ? 'Erro SQL' : 'Checando...'}
                </span>
              </div>
            </div>
            <div className="glass px-6 py-4 rounded-3xl border-white/5">
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Nível</p>
              <p className="font-black text-xl tracking-tighter text-yellow-400">ADMIN ELITE</p>
            </div>
            <div className="glass px-6 py-4 rounded-3xl border-white/5">
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Linguagem</p>
              <p className="font-black text-xl tracking-tighter text-white">Fullstack</p>
            </div>
          </div>

          <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 mb-8 text-left relative overflow-hidden">
             <div className={`absolute top-0 right-0 p-4 opacity-10 text-4xl text-${colorName}-500`}>
                <i className="fa-solid fa-terminal"></i>
             </div>
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className={`fa-solid fa-code text-${colorName}-400`}></i> {t.aboutSystem}
             </h4>
             <p className="text-gray-300 text-base leading-relaxed font-medium">
               {t.devDesc}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={checkConnection}
              className={`flex-1 flex items-center justify-center gap-3 glass border-white/10 hover:bg-white/5 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95`}
            >
              <i className="fa-solid fa-rotate text-sm"></i>
              Reconectar DB
            </button>
            <a 
              href="https://t.me/all_uk_mods" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex-[1.5] flex items-center justify-center gap-4 bg-[#0088cc] text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_15px_35px_rgba(0,136,204,0.3)] active:scale-95 group overflow-hidden relative`}
            >
              <i className="fa-brands fa-telegram text-2xl group-hover:scale-110 transition-transform"></i>
              {t.telegram}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
