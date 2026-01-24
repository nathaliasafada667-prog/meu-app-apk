
import React, { useState } from 'react';
import { Language, ThemeColor } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

interface CineHubProps {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  activeColor: string;
  isEnergySaving: boolean;
  setIsEnergySaving: (val: boolean) => void;
  onOpenDev: () => void;
}

const CineHub: React.FC<CineHubProps> = ({ 
  language, setLanguage, theme, setTheme, activeColor, isEnergySaving, setIsEnergySaving, onOpenDev 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActivate, setShowQuickActivate] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const t = translations[language];
  const colorBase = activeColor.split('-')[0];
  const isPremium = localStorage.getItem('esmael_premium_status') === 'active';

  const handleActivate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // APENAS VERIFICA SE O CÓDIGO EXISTE NO DB - SEM ATUALIZAR STATUS DE USO
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', code.trim())
        .single();

      if (error || !data) {
        setStatus({ type: 'error', msg: 'Inválido.' });
      } else {
        localStorage.setItem('esmael_premium_status', 'active');
        setStatus({ type: 'success', msg: 'Ativado!' });
        setTimeout(() => {
          setShowQuickActivate(false);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Erro de rede.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showQuickActivate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass max-w-sm w-full p-8 rounded-[2.5rem] border-white/10 text-center space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Ativar VIP</h3>
            <input 
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="TOKEN"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center font-black tracking-widest text-white uppercase focus:outline-none"
            />
            {status.msg && (
              <p className={`text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                {status.msg}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleActivate}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-${colorBase}-500 text-white shadow-lg`}
              >
                {loading ? 'Sincronizando...' : 'Confirmar'}
              </button>
              <button onClick={() => setShowQuickActivate(false)} className="text-[9px] font-black uppercase text-gray-600">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-2 animate-soft-zoom w-[280px]">
            <div className="glass p-5 rounded-[2.5rem] border-white/10 shadow-2xl space-y-5 w-full bg-black/60">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block px-1">Temas</span>
                <div className="flex flex-wrap gap-2.5">
                  {['rose', 'blue', 'emerald', 'purple', 'amber', 'cyan', 'red'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setTheme(c as any)}
                      className={`w-7 h-7 rounded-full bg-${c === 'cyan' ? 'cyan-400' : c + '-500'} border-2 transition-all ${activeColor.includes(c) ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-30'}`}
                    />
                  ))}
                </div>
              </div>

              {!isPremium && (
                <button 
                  onClick={() => setShowQuickActivate(true)}
                  className={`w-full p-4 rounded-2xl border border-${colorBase}-500/30 bg-${colorBase}-500/10 flex items-center justify-between group transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid fa-crown text-${colorBase}-500`}></i>
                    <span className={`text-[10px] font-black uppercase text-${colorBase}-500`}>Virar VIP</span>
                  </div>
                </button>
              )}

              {isPremium && (
                <div className="w-full p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center gap-3">
                  <i className="fa-solid fa-check-circle text-emerald-500"></i>
                  <span className="text-[10px] font-black uppercase text-emerald-500">Membro Premium</span>
                </div>
              )}

              <button 
                onClick={() => setIsEnergySaving(!isEnergySaving)}
                className={`w-full px-4 py-3.5 rounded-2xl border border-white/10 flex items-center justify-between transition-all ${isEnergySaving ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-gray-400'}`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${isEnergySaving ? 'fa-moon' : 'fa-sun'} text-xs`}></i>
                  <span className="text-[10px] font-black uppercase">{isEnergySaving ? 'AMOLED Black' : 'Cine Aurora'}</span>
                </div>
              </button>
            </div>

            <button onClick={() => { onOpenDev(); setIsOpen(false); }} className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-[2rem] border border-white/10 shadow-xl w-full flex justify-between items-center transition-all">
              <div className="flex items-center gap-4">
                <i className="fa-solid fa-user-shield text-sm opacity-50"></i>
                <span className="text-[10px] font-black uppercase">Esmael Profile</span>
              </div>
            </button>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 active:scale-90 ${isOpen ? 'bg-zinc-900 border-white/10 rotate-90' : `bg-${colorBase}-600`}`}>
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-clapperboard'} text-3xl text-white`}></i>
        </button>
      </div>
    </>
  );
};

export default CineHub;
