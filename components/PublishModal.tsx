
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

interface PublishModalProps {
  onClose: () => void;
  onRefresh: () => void;
  activeColor: string;
}

const PublishModal: React.FC<PublishModalProps> = ({ onClose, onRefresh, activeColor }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    packageName: '',
    version: '1.0.0',
    size: '',
    category: 'Tools' as Category,
    icon: '',
    banner: '',
    description: '',
    modFeatures: '',
    downloadUrl: '',
    isPremium: false
  });

  const colorBase = activeColor.split('-')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('apps').insert([{
        ...formData,
        modFeatures: formData.modFeatures.split(',').map(f => f.trim())
      }]);
      
      if (error) throw error;
      
      alert('Projeto publicado com sucesso na Rede Elite!');
      onRefresh();
      onClose();
    } catch (err: any) {
      alert('Erro ao publicar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 overflow-y-auto">
      <div className="glass w-full max-w-2xl p-10 rounded-[3rem] border-white/10 my-8 animate-soft-zoom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white">Publicar Projeto</h2>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-1">Sincronização com Protocolo EsmaelX</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white hover:bg-white/10 border-white/5 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Título do App</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="Ex: Spotify Premium" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Package Name</label>
            <input required value={formData.packageName} onChange={e => setFormData({...formData, packageName: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="com.example.app" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Versão / Tamanho</label>
            <div className="flex gap-2">
              <input value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="1.0" />
              <input required value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="50 MB" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Categoria</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20 appearance-none">
              {['Games', 'Tools', 'Social', 'Streaming', 'Premium'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">URLs (Ícone / Banner)</label>
            <div className="flex flex-col gap-2">
              <input required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="URL do Ícone (PNG)" />
              <input required value={formData.banner} onChange={e => setFormData({...formData, banner: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="URL do Banner (JPG)" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Recursos Mod (Separados por vírgula)</label>
            <input value={formData.modFeatures} onChange={e => setFormData({...formData, modFeatures: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="Ex: No Ads, Unlocked, HQ Audio" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-2">Download Link</label>
            <input required value={formData.downloadUrl} onChange={e => setFormData({...formData, downloadUrl: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-white/20" placeholder="https://..." />
          </div>

          <div className="md:col-span-2 py-4">
             <button type="button" onClick={() => setFormData({...formData, isPremium: !formData.isPremium})} className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between ${formData.isPremium ? `bg-${colorBase}-500/10 border-${colorBase}-500/30 text-${colorBase}-500` : 'bg-white/5 border-white/10 text-gray-500'}`}>
                <div className="flex items-center gap-4">
                  <i className={`fa-solid ${formData.isPremium ? 'fa-crown' : 'fa-lock-open'}`}></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Definir como Projeto PREMIUM</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-all ${formData.isPremium ? `bg-${colorBase}-500` : 'bg-white/10'}`}>
                   <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.isPremium ? 'right-1' : 'left-1'}`}></div>
                </div>
             </button>
             <p className="text-[8px] text-gray-600 font-black uppercase mt-2 px-4">Apps Premium exigem conta verificada para download.</p>
          </div>

          <button disabled={loading} className={`md:col-span-2 py-6 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all shadow-2xl active:scale-95 disabled:opacity-50`}>
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'SINCRONIZAR COM A REDE ELITE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishModal;
