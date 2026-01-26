import React, { useState } from 'react';
import { supabase } from '../lib/supabase.ts';
import { translations } from '../translations.ts';
import { Language } from '../types.ts';

interface AuthModalProps {
  onSuccess: (userData: any) => void;
  onShowPricing: () => void;
  onClose: () => void;
  activeColor: string;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onShowPricing, onClose, activeColor, language }) => {
  const [username, setUsername] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language] || translations['pt'];
  const colorBase = activeColor.split('-')[0];

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('members')
        .select('*')
        .eq('username', username.toLowerCase().trim())
        .eq('access_code', accessCode.trim())
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        throw new Error(t.noResults);
      }

      const expiryDate = new Date(data.expiry_date);
      if (expiryDate < new Date()) {
        throw new Error('Expired');
      }

      localStorage.setItem('esmael_session', JSON.stringify(data));
      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
      <div className="glass max-w-md w-full p-8 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-soft-zoom">
        <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all border-white/5 z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-10">
          <div className={`w-20 h-20 bg-${colorBase}-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20`}>
             <i className={`fa-solid fa-key text-3xl text-${colorBase}-500`}></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">{t.restrictedAccess}</h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mt-2">{t.loginTitle}</p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">{t.inputUser}</label>
            <input 
              required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all uppercase"
              placeholder="..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">{t.inputCode}</label>
            <input 
              required type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
              placeholder="ELITE-XXXX"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>
            </div>
          )}

          <button 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all bg-${colorBase}-600 text-white shadow-xl shadow-${colorBase}-500/20 active:scale-95 disabled:opacity-50`}
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : t.verifyAccessBtn}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest">{t.noCodeText}</p>
          <button 
            onClick={onShowPricing}
            className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-2`}
          >
            <i className="fa-solid fa-shopping-cart"></i> {t.acquireElite}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;