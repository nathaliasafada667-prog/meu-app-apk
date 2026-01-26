
import React, { useState } from 'react';
import { translations } from '../translations';
import { Language } from '../types';

interface PricingModalProps {
  onClose: () => void;
  activeColor: string;
  language: Language;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose, activeColor, language }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];
  
  const sellers = [
    { name: 'ALL UK MODS', link: 'https://t.me/all_uk_mods', icon: 'fa-user-tie' },
    { name: '➦ 𝗠𝗥.𝐑𝐎𝗕𝐎𝗧', link: 'https://t.me/Modder_mr_robot', icon: 'fa-robot' }
  ];

  const plans = [
    { id: 1, days: `30 ${t.daysRemainingLabel.split(' ')[0]}`, price: '10', icon: 'fa-calendar-check', desc: '...' },
    { id: 2, days: `60 ${t.daysRemainingLabel.split(' ')[0]}`, price: '20', icon: 'fa-calendar-plus', desc: '...', popular: true },
    { id: 3, days: `90 ${t.daysRemainingLabel.split(' ')[0]}`, price: '30', icon: 'fa-crown', desc: '...' },
    { id: 4, days: 'Lifetime', price: '80', icon: 'fa-infinity', desc: '...' },
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 overflow-y-auto">
      <div className="glass w-full max-w-4xl p-8 md:p-12 rounded-[3.5rem] border-white/10 relative animate-soft-zoom my-auto bg-black">
        
        {!selectedPlan && (
          <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-20">
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        {selectedPlan && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-8 md:p-12 bg-black rounded-[3.5rem] animate-fade-in border border-white/5">
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-8 right-8 w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-50"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div className={`w-20 h-20 bg-${colorBase}-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20`}>
                   <i className={`fa-solid fa-paper-plane text-3xl text-${colorBase}-500 animate-bounce`}></i>
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t.supportTitle}</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">{t.validityLabel}: {selectedPlan.days}</p>
              </div>

              <div className="space-y-4">
                {sellers.map((seller, idx) => (
                  <a 
                    key={idx}
                    href={seller.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full p-6 rounded-[2rem] glass border-white/10 flex items-center justify-between group hover:border-${colorBase}-500/40 transition-all active:scale-95 bg-white/[0.02]`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 bg-${colorBase}-500/10 rounded-2xl flex items-center justify-center text-${colorBase}-500 border border-${colorBase}-500/20`}>
                        <i className={`fa-solid ${seller.icon} text-2xl`}></i>
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Vendedor Oficial</p>
                        <p className="text-lg font-black text-white uppercase tracking-tighter italic">{seller.name}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-800 group-hover:text-white transition-colors group-hover:translate-x-1"></i>
                  </a>
                ))}
              </div>

              <button 
                onClick={() => setSelectedPlan(null)}
                className="w-full py-4 text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] hover:text-gray-400 transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Back
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>{t.pricingTitle}</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic mt-2">{t.eliteProtocol}</h2>
          <p className="text-gray-500 text-sm mt-4 font-medium max-w-md mx-auto">{t.pricingDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`glass p-8 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group relative hover:border-${colorBase}-500/30 transition-all duration-500 ${plan.popular ? `bg-${colorBase}-500/[0.03] border-${colorBase}-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]` : ''}`}
            >
              {plan.popular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-${colorBase}-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl`}>
                  {t.popularTag}
                </div>
              )}
              
              <div className={`w-14 h-14 bg-${colorBase}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${plan.icon} text-2xl text-${colorBase}-500`}></i>
              </div>

              <h4 className="text-white font-black text-xl mb-1 uppercase italic tracking-tighter">{plan.days}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-6 h-8 leading-tight">{plan.desc}</p>

              <div className="mb-8">
                <span className="text-gray-500 text-sm font-black italic mr-1">R$</span>
                <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
              </div>

              <button 
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${plan.popular ? `bg-${colorBase}-600 text-white shadow-lg shadow-${colorBase}-500/20` : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}
              >
                {t.buyNow}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-comments-dollar text-xl"></i>
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{t.supportTitle}</p>
                <p className="text-xs text-gray-500 font-medium">{t.supportDesc}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
