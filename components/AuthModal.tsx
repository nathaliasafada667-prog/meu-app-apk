
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onSuccess: () => void;
  activeColor: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, activeColor }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorBase = activeColor.split('-')[0];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Verifica se o usuário já existe é feito automaticamente pelo Supabase Auth (retorna erro se já houver)
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        alert("Conta criada com sucesso! Agora você pode se autenticar.");
        setIsLogin(true);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro de Protocolo: Falha na identificação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
      <div className="glass max-w-md w-full p-8 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-soft-zoom">
        <div className={`absolute top-0 left-0 w-full h-1 bg-${colorBase}-500`}></div>
        
        <div className="text-center mb-10">
          <div className={`w-20 h-20 bg-${colorBase}-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-${colorBase}-500/20`}>
             <i className={`fa-solid ${isLogin ? 'fa-fingerprint' : 'fa-user-shield'} text-3xl text-${colorBase}-500`}></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
            {isLogin ? 'Autenticação' : 'Registro Elite'}
          </h2>
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Rede Privada EsmaelX v4.0</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Identificação Nominal</label>
              <input 
                required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
                placeholder="Seu nome ou Nickname"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Canal de E-mail</label>
            <input 
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Chave de Acesso (Senha)</label>
            <input 
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className={`p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start animate-pulse`}>
               <i className={`fa-solid fa-triangle-exclamation text-red-500 mt-1`}></i>
               <div className="space-y-1">
                 <p className="text-[10px] text-white font-black uppercase">AVISO CRÍTICO DE SEGURANÇA</p>
                 <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed">
                   Guarde seu e-mail e senha em local seguro. Se você perder o acesso, não existe recuperação automática nesta rede e você perderá todo o status Premium adquirido.
                 </p>
               </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10">
              <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>
            </div>
          )}

          <button 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all bg-${colorBase}-600 text-white shadow-xl shadow-${colorBase}-500/20 active:scale-95 disabled:opacity-50`}
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isLogin ? 'INICIAR SESSÃO' : 'CRIAR ACESSO ELITE')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest"
          >
            {isLogin ? 'Novo por aqui? Criar conta de membro' : 'Já possui acesso? Voltar ao Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
