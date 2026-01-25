
import React, { useState, useMemo, useEffect } from 'react';
import { ModAppItem, Category, Language, ThemeColor, SystemSettings } from '../types';
import { translations } from '../translations';
import { APPS as MOCK_APPS } from '../data';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import AppCard from './AppCard';
import AppDetails from './AppDetails';
import DevProfile from './DevProfile';
import CineHub from './CineHub';

const App: React.FC = () => {
  const [apps, setApps] = useState<ModAppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [maintenance, setMaintenance] = useState<SystemSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ModAppItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');

  const t = translations[lang] || translations['pt'];
  const themeColors: Record<ThemeColor, string> = { 
    blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', amber: 'amber-500', 
    purple: 'purple-500', cyan: 'cyan-400', red: 'red-600', orange: 'orange-500', 
    lime: 'lime-400', fuchsia: 'fuchsia-500' 
  };
  const colorBase = themeColors[theme].split('-')[0];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEnergySaving) return;
    setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check Maintenance
        const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 1).single();
        if (settings) setMaintenance(settings);

        // Fetch Apps
        const { data: dbApps, error } = await supabase.from('apps').select('*');
        if (error || !dbApps || dbApps.length === 0) {
          setApps(MOCK_APPS); // Fallback to mocks if DB is empty
        } else {
          setApps(dbApps);
        }
      } catch (err) {
        setApps(MOCK_APPS);
      } finally {
        setLoading(false);
        setTimeout(() => setIsBooting(false), 1500);
      }
    };
    initApp();
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchCat = selectedCategory === 'All' || app.category === selectedCategory;
      const matchSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [apps, selectedCategory, searchQuery]);

  // Tela de Manutenção (Limpa conforme solicitado)
  if (maintenance?.maintenance_enabled) {
    return (
      <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className={`w-32 h-32 mb-10 relative flex items-center justify-center`}>
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-[2.5rem] animate-pulse`}></div>
           <i className="fa-solid fa-screwdriver-wrench text-5xl text-white"></i>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-6 italic">{t.maintenanceTitle}</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed font-medium text-lg italic">
          "{maintenance.maintenance_message}"
        </p>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center space-y-8">
        <div className="relative w-24 h-24">
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-3xl`}></div>
           <div className={`absolute inset-0 border-t-2 border-${colorBase}-500 rounded-3xl animate-spin`}></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fa-solid fa-microchip text-2xl text-${colorBase}-500 animate-pulse`}></i>
           </div>
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">Iniciando Rede Modificada</h2>
           <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-${colorBase}-500 animate-[progress_2s_ease-in-out_forwards]`}></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden`} onMouseMove={handleMouseMove}>
      {!isEnergySaving && (
        <div 
          className={`fixed w-[80%] h-[80%] bg-${colorBase}-600/5 rounded-full blur-[180px] pointer-events-none transition-all duration-[3s] ease-out aurora-blob`}
          style={{ top: `${mousePos.y * 0.4 - 20}%`, left: `${mousePos.x * 0.4 - 20}%`, transform: `translate(-50%, -50%)` }}
        />
      )}

      <Navbar onSearch={setSearchQuery} language={lang} activeColor={themeColors[theme]} />

      <main className="container mx-auto px-6 pt-52 pb-40 min-h-[80vh]">
        <header className="mb-24 space-y-6 text-center lg:text-left animate-soft-zoom">
           <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className={`h-[1px] w-12 bg-gradient-to-r from-${colorBase}-500 to-transparent`}></div>
              <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>Protocolo Seguro Ativo</span>
           </div>
           <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter mb-4 leading-[0.8]">
             APK <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5 italic`}>MODS</span>
           </h1>
           <p className="text-gray-500 max-w-2xl mx-auto lg:mx-0 text-lg font-medium opacity-60 uppercase tracking-widest">
              Explorando o melhor da engenharia reversa para Android.
           </p>
        </header>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-20">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {(['All', 'Games', 'Tools', 'Social', 'Streaming', 'Premium'] as Category[]).map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${selectedCategory === cat ? `bg-${colorBase}-500 text-white border-${colorBase}-500 shadow-2xl scale-105` : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass p-10 rounded-[3rem] aspect-video animate-pulse bg-white/[0.02]" />)}
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map(app => (
              <AppCard 
                key={app.id} app={app} onClick={() => setSelectedApp(app)} activeColor={themeColors[theme]} 
                isFavorite={false} onToggleFavorite={() => {}} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-fade-in">
             <i className="fa-solid fa-database text-5xl text-gray-800"></i>
             <p className="text-gray-600 font-black uppercase tracking-widest text-[10px]">O Banco de Dados de APKs está vazio ou inacessível.</p>
          </div>
        )}
      </main>

      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={themeColors[theme]} />}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}
      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} 
        activeColor={themeColors[theme]} isEnergySaving={isEnergySaving}
        setIsEnergySaving={setIsEnergySaving} onOpenDev={() => setShowDevProfile(true)}
      />
    </div>
  );
};

export default App;
