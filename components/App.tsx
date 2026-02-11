
import React, { useState, useMemo, useEffect } from 'react';
import { ModAppItem, Category, Language, ThemeColor, SystemSettings, UserProfile, AnimationStyle } from '../types.ts';
import { translations } from '../translations.ts';
import { supabase } from '../lib/supabase.ts';
import Navbar from './Navbar.tsx';
import AppCard from './AppCard.tsx';
import AppDetails from './AppDetails.tsx';
import DevProfile from './DevProfile.tsx';
import CineHub from './CineHub.tsx';
import AuthModal from './AuthModal.tsx';
import PricingModal from './PricingModal.tsx';
import SnowEffect from './SnowEffect.tsx';

interface ExtendedSettings extends SystemSettings {
  maintenance_start_at?: string;
}

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [apps, setApps] = useState<ModAppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [maintenance, setMaintenance] = useState<ExtendedSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ModAppItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  
  // Controle do Menu Lateral (CineHub)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<'access' | 'collection' | 'settings'>('settings');
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('esmael_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [isSnowing, setIsSnowing] = useState(() => localStorage.getItem('esmael_snow') !== 'false'); // Default true
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('soft-zoom');
  const [isCyberMode, setIsCyberMode] = useState(false); 
  const [glassIntensity, setGlassIntensity] = useState(() => parseInt(localStorage.getItem('esmael_glass') || '30'));
  const [activeFont, setActiveFont] = useState(() => localStorage.getItem('esmael_font') || 'Inter');
  
  const themeColors: Record<ThemeColor, string> = { 
    blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', amber: 'amber-500', 
    purple: 'purple-500', cyan: 'cyan-400', red: 'red-600', orange: 'orange-500', 
    lime: 'lime-400', fuchsia: 'fuchsia-500' 
  };
  const colorBase = themeColors[theme].split('-')[0];

  const t = translations[lang] || translations['pt'];

  const categories: { id: Category; label: string }[] = [
    { id: 'All', label: t.categoryAll },
    { id: 'Apps', label: t.categoryApps },
    { id: 'Games', label: t.categoryGames },
    { id: 'Premium', label: t.categoryPremium },
  ];

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${glassIntensity}px`);
    localStorage.setItem('esmael_glass', String(glassIntensity));
  }, [glassIntensity]);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-font', `'${activeFont}', sans-serif`);
    localStorage.setItem('esmael_font', activeFont);
  }, [activeFont]);

  useEffect(() => {
    localStorage.setItem('esmael_theme', theme);
  }, [theme]);

  // Persist Snow State
  useEffect(() => {
    localStorage.setItem('esmael_snow', String(isSnowing));
  }, [isSnowing]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 1).maybeSingle();
        if (settings) setMaintenance(settings);
        const { data: dbApps } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
        setApps(dbApps || []);
      } finally { setLoading(false); setTimeout(() => setIsBooting(false), 1500); }
    };
    initApp();
  }, []);

  const openFavorites = () => {
    setActiveMenuTab('collection');
    setIsMenuOpen(true);
  };

  const openProfile = () => {
    setActiveMenuTab('access');
    setIsMenuOpen(true);
  };

  // Função para rolar suavemente até o conteúdo
  const scrollToContent = () => {
    const element = document.getElementById('content-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (maintenance?.maintenance_enabled) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center">
         <h1 className="text-4xl font-bold text-white mb-4">{maintenance.maintenance_message}</h1>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center">
         <div className={`w-16 h-16 border-4 border-${colorBase}-500 border-t-transparent rounded-full animate-spin`}></div>
         <p className="mt-4 text-white font-bold tracking-widest text-xs uppercase">Carregando Loja...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white pb-32">
      
      {/* Snow Effect Component */}
      {isSnowing && <SnowEffect />}

      {showAuth && <AuthModal onSuccess={(data) => { setUserProfile(data); setShowAuth(false); }} onShowPricing={() => { setShowPricing(true); setShowAuth(false); }} onClose={() => setShowAuth(false)} activeColor={themeColors[theme]} language={lang} />}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} activeColor={themeColors[theme]} language={lang} />}
      
      {selectedApp && (
        <AppDetails 
          app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={themeColors[theme]} 
          user={userProfile} onRequireAuth={() => setShowAuth(true)} onShowPricing={() => setShowPricing(true)}
          isFavorite={favorites.includes(selectedApp.id)} onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
        />
      )}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}

      <Navbar 
        onSearch={setSearchQuery} 
        language={lang} 
        activeColor={themeColors[theme]} 
        onOpenFavorites={openFavorites}
        onOpenProfile={openProfile}
        onOpenDev={() => setShowDevProfile(true)}
        favoritesCount={favorites.length}
      />

      <main className="container mx-auto px-4 md:px-8 pt-24 md:pt-28 animate-fade-in relative z-10">
        
        {/* HERO BANNER - REDESIGNED PREMIUM CLEAN */}
        {!searchQuery && (
          <div className="relative w-full rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group">
             
             {/* Background Effects (Subtle Glows) */}
             <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${colorBase}-600/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 transition-all duration-1000 group-hover:bg-${colorBase}-600/20`}></div>
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
             
             {/* Content Grid */}
             <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* Left Text Content */}
                <div className="max-w-2xl space-y-8 text-center md:text-left">
                   
                   {/* Badge */}
                   <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md mx-auto md:mx-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-${colorBase}-500 animate-pulse shadow-[0_0_10px_currentColor]`}></span>
                      <span className={`text-[9px] font-black text-${colorBase}-400 uppercase tracking-[0.25em]`}>Update v11.5 Elite</span>
                   </div>

                   {/* Headline */}
                   <div className="space-y-2">
                      <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter italic">
                         {t.heroTitle} <br/>
                         <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${colorBase}-400 to-${colorBase}-600`}>UNLOCKED.</span>
                      </h1>
                   </div>

                   {/* Description */}
                   <p className="text-gray-400 text-xs md:text-sm font-medium max-w-lg leading-relaxed mx-auto md:mx-0">
                      {t.heroDesc}
                   </p>

                   {/* Buttons */}
                   <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                      <button 
                        onClick={scrollToContent}
                        className={`px-8 py-4 bg-${colorBase}-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-${colorBase}-500/20`}
                      >
                         Explorar Agora
                      </button>
                      <button 
                        onClick={() => setShowPricing(true)}
                        className="px-8 py-4 bg-white/5 text-white border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                      >
                         Ver Benefícios
                      </button>
                   </div>
                </div>

                {/* Right Visual Element (Abstract 3D Icon Representation) */}
                <div className="hidden md:flex relative w-64 h-64 items-center justify-center perspective-[1000px]">
                   {/* Orbit Rings */}
                   <div className={`absolute inset-0 border border-${colorBase}-500/20 rounded-full animate-[spin_8s_linear_infinite]`}></div>
                   <div className={`absolute inset-8 border border-white/5 rounded-full animate-[spin_12s_linear_infinite_reverse]`}></div>
                   
                   {/* Center Cube/Box */}
                   <div className={`w-32 h-32 bg-gradient-to-br from-[#1a1a1a] to-black rounded-3xl rotate-[15deg] flex items-center justify-center shadow-2xl border border-white/10 z-10 group-hover:rotate-12 transition-transform duration-700`}>
                      <i className={`fa-solid fa-layer-group text-5xl text-${colorBase}-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}></i>
                   </div>
                   
                   {/* Floating Elements */}
                   <div className={`absolute -top-4 -right-4 w-12 h-12 glass rounded-xl flex items-center justify-center animate-bounce delay-75`}>
                      <i className="fa-solid fa-shield-halved text-gray-400 text-xs"></i>
                   </div>
                   <div className={`absolute -bottom-2 -left-2 w-10 h-10 glass rounded-xl flex items-center justify-center animate-bounce delay-150`}>
                      <i className="fa-solid fa-bolt text-amber-500 text-xs"></i>
                   </div>
                </div>

             </div>
          </div>
        )}

        {/* CATEGORY TABS - ID adicionado para o scroll funcionar */}
        <div id="content-start" className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
           {categories.map((cat) => (
             <button
               key={cat.id}
               onClick={() => handleCategoryChange(cat.id)}
               className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === cat.id ? `bg-white text-black border-white` : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white'}`}
             >
               {cat.label}
             </button>
           ))}
        </div>

        {/* PRODUTOS GRID (MASONRY FEEL) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredApps.map((app, index) => (
            <div key={app.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <AppCard app={app} onClick={() => setSelectedApp(app)} activeColor={themeColors[theme]} isFavorite={favorites.includes(app.id)} onToggleFavorite={() => setFavorites(prev => prev.includes(app.id) ? prev.filter(f => f !== app.id) : [...prev, app.id])} />
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
           <div className="py-20 text-center">
              <i className="fa-solid fa-ghost text-4xl text-gray-800 mb-4"></i>
              <p className="text-gray-600 font-medium">{t.noResults}</p>
           </div>
        )}

      </main>

      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} activeColor={themeColors[theme]}
        isEnergySaving={isEnergySaving} setIsEnergySaving={setIsEnergySaving} 
        isSnowing={isSnowing} setIsSnowing={setIsSnowing}
        onOpenDev={() => setShowDevProfile(true)}
        user={userProfile} onLogout={() => { setUserProfile(null); localStorage.removeItem('esmael_session'); }} onRequireAuth={() => setShowAuth(true)} onShowPricing={() => setShowPricing(true)}
        animationStyle={animationStyle} setAnimationStyle={setAnimationStyle} isCyberMode={isCyberMode} setIsCyberMode={setIsCyberMode}
        glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity} activeFont={activeFont} setActiveFont={setActiveFont}
        favorites={favorites} apps={apps} onSelectApp={setSelectedApp}
        isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} activeTab={activeMenuTab} setActiveTab={setActiveMenuTab}
      />
    </div>
  );
};

export default App;
