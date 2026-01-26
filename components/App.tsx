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
  
  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>(() => (localStorage.getItem('esmael_anim') as AnimationStyle) || 'soft-zoom');
  const [isCyberMode, setIsCyberMode] = useState(() => localStorage.getItem('esmael_cyber') === 'true');
  const [glassIntensity, setGlassIntensity] = useState(() => parseInt(localStorage.getItem('esmael_glass') || '30'));

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
    document.documentElement.style.setProperty('--glass-blur', `${glassIntensity}px`);
    localStorage.setItem('esmael_glass', glassIntensity.toString());
  }, [glassIntensity]);

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
        setTimeout(() => setIsBooting(false), 800);
      }
    };
    initApp();
  }, []);

  const fetchApps = async () => {
    const { data: dbApps } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
    setApps(dbApps || []);
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
      <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center p-8 text-center">
        <div className={`w-32 h-32 mb-10 relative flex items-center justify-center`}>
           <div className={`absolute inset-0 border-2 border-${colorBase}-500/10 rounded-[2.5rem] animate-pulse`}></div>
           <i className="fa-solid fa-screwdriver-wrench text-5xl text-white"></i>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-6 italic">{t.maintenanceTitle}</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed font-medium text-lg italic">"{maintenance.maintenance_message}"</p>
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
           <h2 className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">{t.tickerMsgs[0]}</h2>
           <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-${colorBase}-500 animate-[progress_2s_ease-in-out_forwards]`}></div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${isCyberMode ? 'cyber-mode' : ''}`} onMouseMove={handleMouseMove}>
      {showAuth && <AuthModal onSuccess={(data) => { setUserProfile(data); setShowAuth(false); }} onShowPricing={() => { setShowPricing(true); setShowAuth(false); }} onClose={() => setShowAuth(false)} activeColor={themeColors[theme]} language={lang} />}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} activeColor={themeColors[theme]} language={lang} />}
      
      {!isEnergySaving && (
        <div 
          className={`fixed w-[80%] h-[80%] bg-${colorBase}-600/5 rounded-full blur-[180px] pointer-events-none transition-all duration-[3s] ease-out aurora-blob`}
          style={{ top: `${mousePos.y * 0.4 - 20}%`, left: `${mousePos.x * 0.4 - 20}%`, transform: `translate(-50%, -50%)` }}
        />
      )}

      <Navbar onSearch={setSearchQuery} language={lang} activeColor={themeColors[theme]} />

      <main className={`container mx-auto px-6 pt-48 md:pt-60 pb-40 min-h-[80vh]`}>
        <header key={`header-${animationStyle}`} className={`mb-16 md:mb-24 space-y-6 text-center lg:text-left animate-${animationStyle}`}>
           <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className={`h-[1px] w-12 bg-gradient-to-r from-${colorBase}-500 to-transparent`}></div>
              <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>
                {userProfile?.is_premium ? 'PREMIUM ACCESS' : 'PUBLIC NODE'}
              </span>
           </div>
           <h1 className="text-5xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black tracking-tighter mb-4 leading-[0.9]">
             {t.heroTitle.split(' ')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 italic`}>{t.heroTitle.split(' ').slice(1).join(' ')}</span>
           </h1>
           <p className="text-gray-500 max-w-2xl mx-auto lg:mx-0 text-sm md:text-xl font-medium opacity-60 uppercase tracking-[0.2em]">
              {t.heroDesc}
           </p>
        </header>

        {/* Abas de Categorias */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-10 mb-12 md:mb-20">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 px-1">
            {(['All', 'Games', 'Tools', 'Social', 'Streaming', 'Premium'] as Category[]).map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-6 md:px-10 py-3.5 md:py-4 rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${selectedCategory === cat ? `bg-${colorBase}-500 text-white border-${colorBase}-500 shadow-2xl scale-105` : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div key={`grid-${selectedCategory}-${searchQuery}-${animationStyle}`} className={`animate-${animationStyle}`}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="glass p-10 rounded-[2.5rem] md:rounded-[3rem] aspect-video animate-pulse bg-white/[0.02]" />)}
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredApps.map(app => (
                <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} activeColor={themeColors[theme]} isFavorite={false} onToggleFavorite={() => {}} />
              ))}
            </div>
          ) : searchQuery !== '' ? (
            /* MENSAGEM QUANDO A BUSCA NÃO RETORNA RESULTADOS */
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center max-w-3xl mx-auto space-y-10 animate-fade-in">
               <div className="relative">
                  <div className={`absolute inset-0 bg-${colorBase}-500/20 blur-[80px] rounded-full`}></div>
                  <div className={`w-32 h-32 md:w-40 md:h-40 glass rounded-[3rem] flex items-center justify-center border-${colorBase}-500/20 relative z-10`}>
                     <i className={`fa-solid fa-magnifying-glass-chart text-5xl md:text-6xl text-${colorBase}-500 animate-pulse`}></i>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white">{t.requestAppTitle}</h3>
                  <p className="text-gray-500 text-sm md:text-lg font-medium leading-relaxed uppercase tracking-wider opacity-60">
                     O aplicativo <strong>"{searchQuery}"</strong> não foi localizado no nosso banco de dados. Solicite agora aos nossos desenvolvedores!
                  </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <a href="https://t.me/all_uk_mods" target="_blank" className={`flex items-center justify-center gap-4 bg-[#0088cc] text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95`}><i className="fa-brands fa-telegram text-2xl"></i> {t.requestWithDev}</a>
                  <a href="https://t.me/Modder_mr_robot" target="_blank" className={`flex items-center justify-center gap-4 glass border-white/10 text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95`}><i className="fa-solid fa-robot text-2xl opacity-40"></i> {t.requestWithPartner}</a>
               </div>
            </div>
          ) : (
            /* MENSAGEM QUANDO A CATEGORIA ESTÁ VAZIA OU DB ESTÁ VAZIO */
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center max-w-xl mx-auto space-y-6 opacity-40">
               <i className={`fa-solid fa-box-open text-6xl text-gray-800`}></i>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">Catálogo em Sincronização</h3>
                  <p className="text-xs font-medium text-gray-500 mt-2 uppercase tracking-tighter">Nenhum APK disponível nesta categoria no momento.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={themeColors[theme]} user={userProfile} onRequireAuth={() => setShowAuth(true)} onShowPricing={() => setShowPricing(true)} />}
      
      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} 
        activeColor={themeColors[theme]} isEnergySaving={isEnergySaving}
        setIsEnergySaving={setIsEnergySaving} onOpenDev={() => setShowDevProfile(true)}
        user={userProfile} onLogout={handleLogout} onRequireAuth={() => setShowAuth(true)}
        onShowPricing={() => setShowPricing(true)} animationStyle={animationStyle} setAnimationStyle={setAnimationStyle}
        isCyberMode={isCyberMode} setIsCyberMode={setIsCyberMode} glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity}
      />

      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}
    </div>
  );
};

export default App;