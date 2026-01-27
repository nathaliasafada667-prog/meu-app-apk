
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

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [apps, setApps] = useState<ModAppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [maintenance, setMaintenance] = useState<SystemSettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<ModAppItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('esmael_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>(() => (localStorage.getItem('esmael_anim') as AnimationStyle) || 'soft-zoom');
  const [isCyberMode, setIsCyberMode] = useState(() => localStorage.getItem('esmael_cyber') === 'true');
  const [glassIntensity, setGlassIntensity] = useState(() => parseInt(localStorage.getItem('esmael_glass') || '30'));
  const [activeFont, setActiveFont] = useState(() => localStorage.getItem('esmael_font') || 'Inter');

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
    localStorage.setItem('esmael_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${glassIntensity}px`);
    localStorage.setItem('esmael_glass', glassIntensity.toString());
  }, [glassIntensity]);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-font', `'${activeFont}', sans-serif`);
    localStorage.setItem('esmael_font', activeFont);
  }, [activeFont]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedSession = localStorage.getItem('esmael_session');
        if (savedSession) {
          const userData = JSON.parse(savedSession);
          const { data } = await supabase.from('members').select('*').eq('username', userData.username).eq('access_code', userData.access_code).maybeSingle();
          if (data && new Date(data.expiry_date) > new Date()) setUserProfile(data);
        }
        const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 1).maybeSingle();
        if (settings) setMaintenance(settings);
        await fetchApps();
      } catch (err) {
        setApps([]);
      } finally {
        setLoading(false);
        setTimeout(() => setIsBooting(false), 2000);
      }
    };
    initApp();
  }, []);

  const fetchApps = async () => {
    const { data: dbApps } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
    setApps(dbApps || []);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchSearch = searchQuery === '' || 
                          app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery !== '') return matchSearch;
      return selectedCategory === 'All' || app.category === selectedCategory;
    });
  }, [apps, selectedCategory, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('esmael_session');
    setUserProfile(null);
    window.location.reload(); 
  };

  const categoryLabels: Record<string, string> = {
    All: t.categoryAll, Games: t.categoryGames, Tools: t.categoryTools, 
    Social: t.categorySocial, Streaming: t.categoryStreaming, Premium: t.categoryPremium
  };

  if (maintenance?.maintenance_enabled) {
    return (
      <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl animate-soft-zoom">
           <div className="glass p-10 rounded-[4rem] border-white/10 w-full bg-black/60 backdrop-blur-3xl relative">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8 italic">SISTEMA EM <span className={`text-${colorBase}-500`}>REPARO</span></h1>
              <p className="text-gray-400 font-bold text-lg md:text-2xl italic">{maintenance.maintenance_message}</p>
           </div>
        </div>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex items-center justify-center">
        <i className={`fa-solid fa-microchip text-4xl text-${colorBase}-500 animate-pulse`}></i>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${isCyberMode ? 'cyber-mode' : ''}`} onMouseMove={handleMouseMove}>
      {showAuth && <AuthModal onSuccess={(data) => { setUserProfile(data); setShowAuth(false); }} onShowPricing={() => { setShowPricing(true); setShowAuth(false); }} onClose={() => setShowAuth(false)} activeColor={themeColors[theme]} language={lang} />}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} activeColor={themeColors[theme]} language={lang} />}
      {selectedApp && (
        <AppDetails 
          app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} 
          activeColor={themeColors[theme]} user={userProfile} onRequireAuth={() => setShowAuth(true)} 
          onShowPricing={() => setShowPricing(true)}
          isFavorite={favorites.includes(selectedApp.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}

      {!isEnergySaving && (
        <div 
          className={`fixed w-[80%] h-[80%] bg-${colorBase}-600/5 rounded-full blur-[180px] pointer-events-none transition-all duration-[3s] ease-out aurora-blob`}
          style={{ top: `${mousePos.y * 0.4 - 20}%`, left: `${mousePos.x * 0.4 - 20}%`, transform: `translate(-50%, -50%)` }}
        />
      )}

      <Navbar onSearch={setSearchQuery} language={lang} activeColor={themeColors[theme]} />

      <main className="container mx-auto px-6 pt-72 md:pt-96 pb-40">
        <header className={`mb-16 md:mb-24 space-y-6 animate-${animationStyle}`}>
           <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>
                {userProfile?.is_premium ? 'PREMIUM ACCESS' : 'PUBLIC NODE'}
           </span>
           <p className="text-gray-500 text-sm md:text-xl font-medium uppercase tracking-[0.2em]">{t.heroDesc}</p>
        </header>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 mb-12">
            {(['All', 'Games', 'Tools', 'Social', 'Streaming', 'Premium'] as Category[]).map(cat => (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)} 
                className={`px-6 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border whitespace-nowrap transition-all ${selectedCategory === cat ? `bg-${colorBase}-500 border-${colorBase}-500 shadow-2xl scale-105` : 'bg-white/5 border-white/5 text-gray-500'}`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-${animationStyle}`}>
          {filteredApps.map(app => (
            <AppCard 
              key={app.id} app={app} onClick={() => setSelectedApp(app)} 
              activeColor={themeColors[theme]} isFavorite={favorites.includes(app.id)} 
              onToggleFavorite={() => toggleFavorite(app.id)} 
            />
          ))}
        </div>
      </main>

      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} activeColor={themeColors[theme]}
        isEnergySaving={isEnergySaving} setIsEnergySaving={setIsEnergySaving} onOpenDev={() => setShowDevProfile(true)}
        user={userProfile} onLogout={handleLogout} onRequireAuth={() => setShowAuth(true)} onShowPricing={() => setShowPricing(true)}
        animationStyle={animationStyle} setAnimationStyle={setAnimationStyle} isCyberMode={isCyberMode} setIsCyberMode={setIsCyberMode}
        glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity} activeFont={activeFont} setActiveFont={setActiveFont}
        favorites={favorites} apps={apps} onSelectApp={setSelectedApp}
      />
    </div>
  );
};

export default App;