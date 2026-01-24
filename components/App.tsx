
import React, { useState, useMemo, useEffect } from 'react';
import { AppItem, Category, Language, ThemeColor, SortOption } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import AppCard from './AppCard';
import AppDetails from './AppDetails';
import DevProfile from './DevProfile';
import AIAssistant from './AIAssistant';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isEnergySaving, setIsEnergySaving] = useState(() => {
    const saved = localStorage.getItem('esmael_energy');
    return saved === 'true';
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('esmael_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('esmael_lang');
    return (savedLang as Language) || 'pt';
  });
  
  const [theme, setTheme] = useState<ThemeColor>(() => {
    const savedTheme = localStorage.getItem('esmael_theme');
    return (savedTheme as ThemeColor) || 'blue';
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEnergySaving) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  };

  const fetchApps = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('is_verified', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedData: AppItem[] = data.map(item => ({
          id: item.id?.toString(),
          name: item.name,
          category: item.category as any,
          rating: item.rating || 5.0,
          downloads: item.downloads || '0',
          version: item.version || '1.0',
          size: item.size || '0MB',
          icon: item.icon || 'https://picsum.photos/200',
          description: item.description || '',
          modFeatures: Array.isArray(item.mod_features) 
            ? item.mod_features 
            : (typeof item.mod_features === 'string' ? JSON.parse(item.mod_features) : []),
          isPremium: item.is_premium === true,
          isVerified: item.is_verified === true,
          author: item.author_name || 'EsmaelX',
          downloadUrl: item.download_url || '#'
        }));
        setApps(formattedData);
      }
    } catch (err: any) {
      console.error("Supabase Error:", err);
      setErrorMsg(err.message || "Erro de conexão com o Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const t = translations[lang] || translations['pt'];
  
  const themeColors: Record<ThemeColor, string> = {
    blue: 'blue-500', 
    emerald: 'emerald-500', 
    rose: 'rose-500', 
    amber: 'amber-500', 
    purple: 'purple-500', 
    cyan: 'cyan-400',
    red: 'red-600',
    orange: 'orange-500',
    lime: 'lime-400',
    fuchsia: 'fuchsia-500'
  };

  const activeColor = themeColors[theme];
  const colorBase = activeColor.split('-')[0];

  const filteredApps = useMemo(() => {
    let result = apps.filter(app => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortOption === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'size') result.sort((a, b) => (parseFloat(b.size) || 0) - (parseFloat(a.size) || 0));

    return result;
  }, [apps, selectedCategory, searchQuery, sortOption]);

  const verifiedApps = useMemo(() => apps.filter(a => a.isVerified), [apps]);

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden theme-${theme}`} onMouseMove={handleMouseMove}>
      {!isEnergySaving && (
        <div 
          className={`fixed w-[80%] h-[80%] bg-${colorBase}-600/10 rounded-full blur-[180px] pointer-events-none transition-all duration-[2s] ease-out aurora-blob`}
          style={{ top: `${mousePos.y * 0.5 - 20}%`, left: `${mousePos.x * 0.5 - 20}%`, transform: `translate(-50%, -50%)` }}
        />
      )}

      <Navbar 
        onSearch={setSearchQuery} 
        onOpenDev={() => setShowDevProfile(true)}
        language={lang}
        setLanguage={setLang}
        theme={theme}
        setTheme={setTheme}
        activeColor={activeColor}
        sortOption={sortOption}
        setSortOption={setSortOption}
        isEnergySaving={isEnergySaving}
        setIsEnergySaving={setIsEnergySaving}
      />

      <main className="container mx-auto px-6 pt-32 pb-20">
        {!searchQuery && selectedCategory === 'All' && verifiedApps.length > 0 && (
          <section className="mb-16 animate-soft-zoom">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${colorBase}-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${colorBase}-500/40`}>
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">{t.verifiedOfficial}</h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                    {t.qualityCertified} <i className={`fa-solid fa-circle-check text-${colorBase}-500`}></i>
                  </p>
                </div>
              </div>
              <button onClick={fetchApps} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all border border-white/5 active:scale-90">
                <i className={`fa-solid fa-arrows-rotate ${loading ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {verifiedApps.map(app => (
                <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} activeColor={activeColor} isFavorite={favorites.includes(app.id)} onToggleFavorite={() => {
                  setFavorites(prev => prev.includes(app.id) ? prev.filter(f => f !== app.id) : [...prev, app.id]);
                }} />
              ))}
            </div>
            <div className="mt-12 h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </section>
        )}

        <header className="mb-10">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{t.systemLibrary}</h2>
          <p className="text-gray-400 text-sm max-w-2xl font-medium tracking-tight">{t.exploringDatabase}</p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {(['All', 'Game', 'App', 'Utility', 'Social'] as Category[]).map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? `bg-${colorBase}-500 text-white border-${colorBase}-500 shadow-lg shadow-${colorBase}-500/20` : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}>
                {t[`category${cat as 'All' | 'Game' | 'App' | 'Utility' | 'Social'}`]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-gray-500 border-white/5">
            <i className="fa-solid fa-sort"></i>
            <span>{t.sortBy}:</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="bg-transparent border-none focus:outline-none text-white cursor-pointer ml-1 text-[9px] font-black uppercase">
              <option value="default" className="bg-black">{t.recent}</option>
              <option value="name" className="bg-black">{t.sortName}</option>
              <option value="rating" className="bg-black">{t.sortRating}</option>
              <option value="size" className="bg-black">{t.sortSize}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass p-3 rounded-[1.8rem] aspect-[3/4] animate-pulse bg-white/5" />)}
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-4 bg-rose-500/10 rounded-full mb-4">
              <i className="fa-solid fa-circle-exclamation text-4xl text-rose-500"></i>
            </div>
            <p className="font-black uppercase tracking-widest text-xs text-rose-400 mb-2">{t.supabaseError}</p>
            <p className="text-gray-500 text-[10px] max-w-md mx-auto">{errorMsg}</p>
            <button onClick={fetchApps} className="mt-6 px-6 py-2 glass rounded-xl text-[10px] font-black uppercase hover:bg-white/10 border-white/10">{t.tryAgain}</button>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => setSelectedApp(app)} 
                activeColor={activeColor} 
                isFavorite={favorites.includes(app.id)} 
                onToggleFavorite={() => setFavorites(prev => prev.includes(app.id) ? prev.filter(f => f !== app.id) : [...prev, app.id])} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in opacity-50">
            <i className="fa-solid fa-database text-4xl mb-4 text-emerald-500"></i>
            <p className="font-black uppercase tracking-widest text-xs">{t.waitingProjects}</p>
          </div>
        )}
      </main>

      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={activeColor} />}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={activeColor} />}
      <AIAssistant language={lang} activeColor={activeColor} apps={apps} onSelectApp={(app) => { setSelectedApp(app); setSearchQuery(''); }} />
    </div>
  );
};

export default App;
