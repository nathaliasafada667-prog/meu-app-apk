
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

  // Lock scroll when profile is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-[3rem] overflow-hidden relative border border-white/20 animate-soft-zoom">
        {/* Banner */}
        <div className={`h-32 bg-gradient-to-r from-${colorName}-600 to-black`}></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 glass flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="px-8 pb-8 -mt-16 text-center">
          <div className="inline-block p-2 glass rounded-full mb-6">
            <img 
              src="https://picsum.photos/seed/esmael/200/200" 
              alt="Esmael" 
              className={`w-32 h-32 rounded-full border-4 border-${colorName}-500 shadow-2xl object-cover`}
            />
          </div>
          
          <h2 className="text-4xl font-black mb-2">Esmael</h2>
          <p className={`text-${colorName}-400 font-bold text-lg mb-4`}>Senior Frontend Engineer & APK Modder</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <div className="glass px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.age}</p>
              <p className="font-black text-xl">23</p>
            </div>
            <div className="glass px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t.level}</p>
              <p className="font-black text-xl text-yellow-400">Elite</p>
            </div>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 px-4">
            {t.devDesc}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black hover:bg-gray-200 transition-colors">
              <i className="fa-brands fa-linkedin text-xl"></i>
              {t.connect}
            </a>
            <a href="#" className={`flex items-center justify-center gap-3 glass py-4 rounded-2xl font-black hover:bg-white/10 transition-colors border border-${colorName}-500/20`}>
              <i className={`fa-solid fa-envelope text-xl text-${colorName}-400`}></i>
              {t.message}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
