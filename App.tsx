
import React, { useState, useMemo, useEffect } from 'react';
import { AppItem, Category, Language, ThemeColor, SortOption } from './types';
import { translations } from './translations';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import AppCard from './components/AppCard';
import AppDetails from './components/AppDetails';
import DevProfile from './components/DevProfile';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedData: AppItem[] = (data || []).map(item => {
          let features: string[] = [];
          try {
            if (Array.isArray(item.mod_features)) {
              features = item.mod_features;
            } else if (typeof item.mod_features === 'string') {
              features = JSON.parse(item.mod_features);
            }
          } catch (e) {
            features = ["Mod Estável", "Performance Otimizada"];
          }

          return {
            id: item.id,
            name: item.name,
            category: item.category,
            rating: item.rating || 5.0,
            downloads: item.downloads || '0',
            version: item.version || 'v1.0',
            size: item.size || '0MB',
            icon: item.icon || 'https://picsum.photos/200',
            description: item.description || '',
            modFeatures: features,
            isPremium: item.is_premium || false,
            downloadUrl: item.download_url || '#'
          };
        });

        setApps(formattedData);
      } catch (err) {
        console.error('Erro ao buscar apps do Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  useEffect(() => {
    localStorage.setItem('esmael_favs', JSON.stringify(favorites));
    localStorage.setItem('esmael_lang', lang);
    localStorage.setItem('esmael_theme', theme);
    localStorage.setItem('esmael_energy', String(isEnergySaving));
  }, [favorites, lang, theme, isEnergySaving]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const t = translations[lang];

  const themeColors: Record<ThemeColor, string> = {
    blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', 
    amber: 'amber-500', purple: 'purple-500', cyan: 'cyan-400'
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

  const favoriteApps = useMemo(() => apps.filter(app => favorites.includes(app.id)), [apps, favorites]);

  return (
    <div 
      className={`min-h-screen bg-black text-white relative overflow-x-hidden theme-${theme}`}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Interactive Aurora Blobs - Hidden in Energy Saving */}
      {!isEnergySaving && (
        <>
          <div 
            className={`fixed w-[80%] h-[80%] bg-${colorBase}-600/10 rounded-full blur-[180px] pointer-events-none transition-all duration-[2s] ease-out aurora-blob`}
            style={{ top: `${mousePos.y * 0.5 - 20}%`, left: `${mousePos.x * 0.5 - 20}%`, transform: `translate(-50%, -50%)` }}
          ></div>
          <div 
            className={`fixed w-[60%] h-[60%] bg-${colorBase}-400/5 rounded-full blur-[180px] pointer-events-none transition-all duration-[3s] ease-out aurora-blob`}
            style={{ bottom: `${(100 - mousePos.y) * 0.4 - 10}%`, right: `${(100 - mousePos.x) * 0.4 - 10}%`, transform: `translate(50%, 50%)` }}
          ></div>
        </>
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

      <main className="container mx-auto px-4 pt-32 pb-12 relative z-10">
        <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="animate-fade-in">
            <h1 className={`text-5xl md:text-8xl font-black mb-6 bg-gradient-to-br from-white via-white to-${colorBase}-900 bg-clip-text text-transparent transition-all duration-700 tracking-tighter leading-none`}>
              {t.heroTitle}
            </h1>
            <p className="text-gray-500 text-lg md:text-2xl max-w-2xl font-medium leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
             <div className="glass px-8 py-4 rounded-[2rem] flex items-center gap-4 border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl group transition-all hover:border-white/10">
                <div className="flex -space-x-3">
                   <div className="w-8 h-8 rounded-full border-2 border-black bg-blue-500 shadow-lg"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-black bg-emerald-500 shadow-lg"></div>
                   <div className="w-8 h-8 rounded-full border-2 border-black bg-rose-500 shadow-lg"></div>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Global Link</span>
                   <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">SECURE ACTIVE</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex gap-4 mb-12 overflow-x-auto pb-6 no-scrollbar animate-fade-in snap-x">
          {(['All', 'Game', 'App', 'Utility', 'Social'] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-10 py-4 rounded-[1.75rem] transition-all duration-500 font-black whitespace-nowrap border snap-center ${
                selectedCategory === cat 
                ? `bg-white text-black border-white scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.15)]` 
                : 'glass border-white/5 text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? t.categoryAll : cat === 'Game' ? t.categoryGame : cat === 'App' ? t.categoryApp : cat === 'Utility' ? t.categoryUtility : t.categorySocial}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-48">
            <div className={`w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin mb-6`}></div>
            <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Interface</p>
          </div>
        ) : (
          <>
            {favoriteApps.length > 0 && searchQuery === '' && selectedCategory === 'All' && (
              <div className="mb-16 animate-fade-in">
                 <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                   <div className="w-1.5 h-8 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                   {t.favorites}
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteApps.map((app) => (
                      <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} activeColor={activeColor} isFavorite={true} onToggleFavorite={() => toggleFavorite(app.id)} />
                    ))}
                 </div>
                 <div className="h-px bg-white/5 w-full mt-16 shadow-inner"></div>
              </div>
            )}

            <h2 className="text-3xl font-black mb-8 flex items-center gap-4 animate-fade-in">
               <div className={`w-1.5 h-8 bg-${colorBase}-500 rounded-full shadow-[0_0_15px_rgba(var(--active-rgb),0.5)]`}></div>
               {selectedCategory === 'All' ? 'Neural Market' : `Filter: ${selectedCategory}`}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredApps.map((app, index) => (
                <div key={app.id} className="animate-soft-zoom" style={{ animationDelay: `${index * 0.05}s` }}>
                  <AppCard app={app} onClick={() => setSelectedApp(app)} activeColor={activeColor} isFavorite={favorites.includes(app.id)} onToggleFavorite={() => toggleFavorite(app.id)} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <AIAssistant language={lang} activeColor={activeColor} apps={apps} onSelectApp={setSelectedApp} />
      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={activeColor} />}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={activeColor} />}

      <footer className="border-t border-white/5 py-16 bg-[#030303] mt-24 relative z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-${colorBase}-500/50 to-transparent`}></div>
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-2 font-black uppercase tracking-[0.5em] text-xs">EsmaelX Premium Ecosystem v4.0</p>
          <p className="text-gray-800 text-[10px] font-bold uppercase tracking-widest italic opacity-50">Interactive Glass UI Core Ready</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
