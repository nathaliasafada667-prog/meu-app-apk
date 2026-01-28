
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
    { id: 1, days: `30 ${t.daysRemainingLabel.split(' ')[0]}`, price: '10', icon: 'fa-calendar-check', desc: 'Acesso Mensal Elite', popular: false },
    { id: 2, days: `60 ${t.daysRemainingLabel.split(' ')[0]}`, price: '20', icon: 'fa-calendar-plus', desc: 'Acesso Bimestral VIP', popular: true },
    { id: 3, days: `90 ${t.daysRemainingLabel.split(' ')[0]}`, price: '30', icon: 'fa-crown', desc: 'Acesso Trimestral Premium', popular: false },
    { id: 4, days: 'Lifetime', price: '80', icon: 'fa-infinity', desc: 'Acesso Vitalício Total', popular: false },
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl overflow-y-auto no-scrollbar flex justify-center items-start md:items-center p-4 py-10 md:p-8">
      {/* Container Principal */}
      <div className="glass w-full max-w-5xl p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-white/10 relative animate-soft-zoom bg-black min-h-fit mb-10">
        
        {/* Botão de Fechar Principal */}
        {!selectedPlan && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-50 active:scale-90"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        {/* View de Vendedores (Overlay interno) */}
        {selectedPlan && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-6 md:p-12 bg-black rounded-[2.5rem] md:rounded-[3.5rem] animate-fade-in border border-white/5 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-[70] active:scale-90"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="w-full max-w-md space-y-8 py-10">
              <div className="text-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-${colorBase}-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20`}>
                   <i className={`fa-solid fa-paper-plane text-2xl md:text-3xl text-${colorBase}-500 animate-bounce`}></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">{t.supportTitle}</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Plano selecionado: {selectedPlan.days}</p>
              </div>

              <div className="space-y-4">
                {sellers.map((seller, idx) => (
                  <a 
                    key={idx}
                    href={seller.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] glass border-white/10 flex items-center justify-between group hover:border-${colorBase}-500/40 transition-all active:scale-95 bg-white/[0.02]`}
                  >
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-${colorBase}-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-${colorBase}-500 border border-${colorBase}-500/20`}>
                        <i className={`fa-solid ${seller.icon} text-xl md:text-2xl`}></i>
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest">Suporte Oficial</p>
                        <p className="text-base md:text-lg font-black text-white uppercase tracking-tighter italic">{seller.name}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-800 group-hover:text-white transition-colors group-hover:translate-x-1"></i>
                  </a>
                ))}
              </div>

              <button 
                onClick={() => setSelectedPlan(null)}
                className="w-full py-4 text-[9px] font-black text-gray-700 hover:text-white uppercase tracking-[0.4em] transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar aos planos
              </button>
            </div>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="text-center mb-10 md:mb-16">
          <span className={`text-${colorBase}-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]`}>{t.pricingTitle}</span>
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white italic mt-2">{t.eliteProtocol}</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-4 font-medium max-w-md mx-auto px-4">{t.pricingDesc}</p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 flex flex-col items-center text-center group relative hover:border-${colorBase}-500/30 transition-all duration-500 ${plan.popular ? `bg-${colorBase}-500/[0.03] border-${colorBase}-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]` : ''}`}
            >
              {plan.popular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-${colorBase}-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl z-10`}>
                  {t.popularTag}
                </div>
              )}
              
              <div className={`w-12 h-12 md:w-14 md:h-14 bg-${colorBase}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${plan.icon} text-xl md:text-2xl text-${colorBase}-500`}></i>
              </div>

              <h4 className="text-white font-black text-lg md:text-xl mb-1 uppercase italic tracking-tighter">{plan.days}</h4>
              <p className="text-[9px] text-gray-500 font-bold uppercase mb-6 h-auto md:h-8 leading-tight">{plan.desc}</p>

              <div className="mb-8">
                <span className="text-gray-500 text-xs font-black italic mr-1">R$</span>
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">{plan.price}</span>
              </div>

              <button 
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-4 rounded-xl md:rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${plan.popular ? `bg-${colorBase}-600 text-white shadow-lg shadow-${colorBase}-500/20` : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}
              >
                {t.buyNow}
              </button>
            </div>
          ))}
        </div>

        {/* Footer / Suporte - Agora com margem de segurança no fundo */}
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
             <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <i className="fa-solid fa-comments-dollar text-2xl"></i>
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{t.supportTitle}</p>
                <p className="text-xs text-gray-500 font-medium">{t.supportDesc}</p>
             </div>
          </div>
          <div className="flex gap-4">
             <a href="https://t.me/all_uk_mods" target="_blank" className="px-6 py-3 glass border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Telegram Central</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
