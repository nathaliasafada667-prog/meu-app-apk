
import React, { useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface DevProfileProps {
  onClose: () => void;
  language: Language;
  activeColor: string;
}

const DevProfile: React.FC<DevProfileProps> = ({ onClose, language, activeColor }) => {
  const t = translations[language];
  const colorName = activeColor.split('-')[0];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-[3rem] overflow-hidden relative border border-white/20 animate-soft-zoom">
        <div className={`h-32 bg-gradient-to-r from-${colorName}-600/40 to-black relative`}>
           <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="text-4xl font-black uppercase tracking-[1em]">{t.reverseEngineering}</span>
           </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="px-8 pb-10 -mt-16 text-center">
          <div className="inline-block p-2 glass rounded-full mb-6 relative">
            <img 
              src="https://picsum.photos/seed/esmael/300/300" 
              alt="Esmael" 
              className={`w-36 h-36 rounded-full border-4 border-${colorName}-500 shadow-2xl object-cover`}
            />
            <div className={`absolute bottom-2 right-2 w-8 h-8 bg-${colorName}-500 rounded-full border-4 border-black flex items-center justify-center text-[10px]`}>
               <i className="fa-solid fa-check text-white"></i>
            </div>
          </div>
          
          <h2 className="text-4xl font-black mb-1">Esmael</h2>
          <p className={`text-${colorName}-400 font-black uppercase tracking-widest text-xs mb-6`}>{t.devSpecialist}</p>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="glass px-5 py-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{t.age}</p>
              <p className="font-black text-2xl tracking-tighter">23</p>
            </div>
            <div className="glass px-5 py-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{t.level}</p>
              <p className="font-black text-2xl tracking-tighter text-yellow-400">ELITE</p>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 mb-8 text-left">
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i className={`fa-solid fa-terminal text-${colorName}-400`}></i> {t.aboutSystem}
             </h4>
             <p className="text-gray-400 text-base leading-relaxed font-medium">
               {t.devDesc}
             </p>
          </div>

          <div className="w-full">
            <a 
              href="https://t.me/all_uk_mods" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center justify-center gap-4 bg-[#0088cc] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,136,204,0.4)] active:scale-95 w-full group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
