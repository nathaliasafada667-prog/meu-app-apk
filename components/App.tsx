
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  
  const themeColors: Record<ThemeColor, string> = { 
    blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', amber: 'amber-500', 
    purple: 'purple-500', cyan: 'cyan-400', red: 'red-600', orange: 'orange-500', 
    lime: 'lime-400', fuchsia: 'fuchsia-500' 
  };
  const colorHex: Record<ThemeColor, string> = {
    blue: '#3b82f6', emerald: '#10b981', rose: '#f43f5e', amber: '#f59e0b',
    purple: '#a855f7', cyan: '#06b6d4', red: '#dc2626', orange: '#f97316',
    lime: '#84cc16', fuchsia: '#d946ef'
  };
  const colorBase = themeColors[theme].split('-')[0];

  const t = translations[lang] || translations['pt'];

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'All', label: t.categoryAll, icon: 'fa-house' },
    { id: 'Apps', label: t.categoryApps, icon: 'fa-th-large' },
    { id: 'Games', label: t.categoryGames, icon: 'fa-gamepad' },
    { id: 'Premium', label: t.categoryPremium, icon: 'fa-crown' },
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
    if (maintenance?.maintenance_enabled && maintenance.maintenance_start_at) {
      const start = new Date(maintenance.maintenance_start_at).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - start;
        if (diff < 0) return;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setElapsedTime(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [maintenance]);

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

  useEffect(() => {
    localStorage.setItem('esmael_anim', animationStyle);
  }, [animationStyle]);

  useEffect(() => {
    if (isEnergySaving || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: any[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < (isCyberMode ? 150 : 60); i++) {
        particles.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.1, speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25, alpha: Math.random() * 0.5
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colorHex[theme];
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize); resize(); createParticles(); draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [theme, isEnergySaving, isCyberMode]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 1).maybeSingle();
        if (settings) setMaintenance(settings);
        const { data: dbApps } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
        setApps(dbApps || []);
      } finally { setLoading(false); setTimeout(() => setIsBooting(false), 3000); }
    };
    initApp();
  }, []);

  if (maintenance?.maintenance_enabled) {
    const startTime = maintenance.maintenance_start_at ? new Date(maintenance.maintenance_start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    return (
      <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        <div className={`absolute w-[600px] h-[600px] bg-${colorBase}-500/10 blur-[180px] rounded-full animate-pulse`}></div>
        <div className="relative z-10 w-full max-w-2xl animate-soft-zoom flex flex-col items-center">
           <div className="glass p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] border-white/10 w-full bg-black/40 backdrop-blur-3xl relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="relative mb-12">
                 <div className={`w-28 h-28 md:w-36 md:h-36 bg-black border-2 border-${colorBase}-500/30 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10`}><i className={`fa-solid fa-screwdriver-wrench text-5xl md:text-6xl text-${colorBase}-500 animate-bounce`}></i></div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 italic">MODO <span className={`text-${colorBase}-500`}>REPARO</span></h1>
              <p className="text-gray-400 font-bold text-sm md:text-xl italic mb-12 max-w-md mx-auto">{maintenance.maintenance_message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                 <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Iniciado em</span>
                    <span className="text-white font-black text-2xl italic">{startTime}</span>
                 </div>
                 <div className={`bg-${colorBase}-500/5 border border-${colorBase}-500/20 p-6 rounded-[2.5rem] flex flex-col items-center`}>
                    <span className={`text-[9px] font-black text-${colorBase}-500/60 uppercase tracking-[0.3em] mb-2`}>Tempo Decorrido</span>
                    <span className={`text-${colorBase}-500 font-black text-2xl italic font-mono`}>{elapsedTime}</span>
                 </div>
              </div>
           </div>
           <p className="mt-14 text-gray-800 font-black text-[11px] uppercase tracking-[0.8em] italic">By <span className="text-gray-600">Esmael</span></p>
        </div>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center">
           <div className={`w-24 h-24 md:w-32 md:h-32 bg-black border-2 border-${colorBase}-500/50 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative animate-soft-zoom`}>
             <i className={`fa-solid fa-robot text-4xl text-${colorBase}-500`}></i>
           </div>
           <div className="mt-10 text-center animate-pulse">
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-[1em] block mb-2">Iniciando Protocolo</span>
              <h2 className={`text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase`}>SISTEMA BY <span className={`text-${colorBase}-500 shadow-[0_0_15px_${colorHex[theme]}]`}>ESMAEL</span></h2>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${isCyberMode ? 'cyber-mode' : ''}`} onMouseMove={(e) => setMousePos({ x: (e.clientX/window.innerWidth)*100, y: (e.clientY/window.innerHeight)*100 })}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

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

      <Navbar onSearch={setSearchQuery} language={lang} activeColor={themeColors[theme]} />

      <main className="container mx-auto px-4 md:px-8 pt-44 md:pt-52 pb-40 relative z-10">
        
        <div className="mb-8 md:mb-12 px-4 md:px-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center justify-center gap-3 py-5 rounded-2xl glass transition-all border-white/5 active:scale-95 group ${selectedCategory === cat.id ? `bg-${colorBase}-600/20 border-${colorBase}-500/40 shadow-[0_0_40px_rgba(0,0,0,0.5)]` : 'hover:bg-white/[0.03]'}`}
                >
                  <i className={`fa-solid ${cat.icon} text-base ${selectedCategory === cat.id ? `text-${colorBase}-500` : 'text-gray-600 group-hover:text-white'}`}></i>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{cat.label}</span>
                </button>
              ))}
           </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 animate-${animationStyle} px-4 md:px-10`}>
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} onClick={() => setSelectedApp(app)} activeColor={themeColors[theme]} isFavorite={favorites.includes(app.id)} onToggleFavorite={() => setFavorites(prev => prev.includes(app.id) ? prev.filter(f => f !== app.id) : [...prev, app.id])} />
          ))}
        </div>
      </main>

      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} activeColor={themeColors[theme]}
        isEnergySaving={isEnergySaving} setIsEnergySaving={setIsEnergySaving} onOpenDev={() => setShowDevProfile(true)}
        user={userProfile} onLogout={() => { setUserProfile(null); localStorage.removeItem('esmael_session'); }} onRequireAuth={() => setShowAuth(true)} onShowPricing={() => setShowPricing(true)}
        animationStyle={animationStyle} setAnimationStyle={setAnimationStyle} isCyberMode={isCyberMode} setIsCyberMode={setIsCyberMode}
        glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity} activeFont={activeFont} setActiveFont={setActiveFont}
        favorites={favorites} apps={apps} onSelectApp={setSelectedApp}
      />
    </div>
  );
};

export default App;
