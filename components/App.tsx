
import React, { useState, useMemo, useEffect } from 'react';
import { MovieItem, Category, Language, ThemeColor, SortOption } from '../types';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import AppCard from './AppCard';
import AppDetails from './AppDetails';
import DevProfile from './DevProfile';
import CineHub from './CineHub';
import AIAssistant from './AIAssistant';

const App: React.FC = () => {
  const [apps, setApps] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [maintenance, setMaintenance] = useState<{enabled: boolean, message: string}>({ enabled: false, message: '' });
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<MovieItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('esmael_cine_favs') || '[]'));
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEnergySaving) return;
    setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  };

  const checkSystemStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('maintenance_enabled, maintenance_message')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        setMaintenance({
          enabled: data.maintenance_enabled,
          message: data.maintenance_message
        });
        return data.maintenance_enabled;
      }
    } catch (err) {
      console.error("Erro ao checar status do sistema");
    }
    return false;
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const isMaint = await checkSystemStatus();
      if (isMaint) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      
      if (error) throw error;

      if (data && data.length > 0) {
        setApps(data.map(item => ({
          id: item.id.toString(),
          title: item.title,
          category: item.category as any,
          rating: item.rating || 0,
          year: item.year || '2024',
          duration: item.duration || '0min',
          poster: item.poster_url || 'https://picsum.photos/400/600',
          backdrop: item.backdrop_url || 'https://picsum.photos/1200/600',
          description: item.description || '',
          actors: Array.isArray(item.actors) ? item.actors : [],
          isPremium: item.is_premium === true,
          isVerified: item.is_verified === true,
          director: item.director || 'Desconhecido',
          videoUrl: item.video_url || '#',
          downloadUrl: item.download_url || '#'
        })));
      } else {
        setApps([]);
      }
    } catch (err: any) {
      console.error("Supabase fail:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      fetchMovies();
    }, 2000);
    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => { localStorage.setItem('esmael_cine_favs', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('esmael_energy', isEnergySaving.toString()); }, [isEnergySaving]);
  useEffect(() => { localStorage.setItem('esmael_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('esmael_theme', theme); }, [theme]);

  const t = translations[lang] || translations['pt'];
  const themeColors: Record<ThemeColor, string> = { blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', amber: 'amber-500', purple: 'purple-500', cyan: 'cyan-400', red: 'red-600', orange: 'orange-500', lime: 'lime-400', fuchsia: 'fuchsia-500' };
  const colorBase = themeColors[theme].split('-')[0];

  const filteredMovies = useMemo(() => {
    let result = apps.filter(m => (selectedCategory === 'All' || m.category === selectedCategory) && m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortOption === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'year') result.sort((a, b) => b.year.localeCompare(a.year));
    return result;
  }, [apps, selectedCategory, searchQuery, sortOption]);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center space-y-8">
        <div className={`w-24 h-24 border-2 border-${colorBase}-500/20 rounded-full flex items-center justify-center relative`}>
           <div className={`absolute inset-0 border-t-2 border-${colorBase}-500 rounded-full animate-spin`}></div>
           <i className="fa-solid fa-clapperboard text-3xl animate-pulse"></i>
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">EsmaelX Secure Boot</h2>
           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-${colorBase}-500 animate-[progress_2s_ease-in-out_forwards]`}></div>
           </div>
        </div>
        <style>{`
          @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        `}</style>
      </div>
    );
  }

  // TELA DE MANUTENÇÃO EXTRAORDINÁRIA (MODO HIBERNAÇÃO)
  if (maintenance.enabled) {
    return (
      <div className="fixed inset-0 bg-black z-[2000] flex items-center justify-center p-6 text-center overflow-hidden">
        {/* Efeito Aurora de Fundo para dar profundidade */}
        <div className={`absolute w-[120%] h-[120%] bg-${colorBase}-500/5 rounded-full blur-[150px] aurora-blob`}></div>
        
        <div className="glass max-w-2xl w-full p-12 md:p-20 rounded-[4rem] border-white/10 relative z-10 space-y-12 animate-soft-zoom shadow-[0_0_120px_rgba(0,0,0,0.8)] bg-black/40">
           <div className="relative inline-block">
              <div className={`absolute inset-0 bg-${colorBase}-500/20 blur-[50px] rounded-full animate-pulse`}></div>
              <div className={`w-36 h-36 rounded-[3rem] bg-${colorBase}-600/10 border border-${colorBase}-500/30 flex items-center justify-center text-6xl text-${colorBase}-500 relative`}>
                 <i className="fa-solid fa-cloud-moon animate-bounce"></i>
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                 <span className={`text-[11px] font-black uppercase tracking-[1em] text-${colorBase}-400`}>Acesso Restrito</span>
                 <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9]">Hibernação Ativa</h1>
              </div>
              <div className="h-[1px] w-24 bg-white/10 mx-auto"></div>
              <p className="text-gray-400 text-xl font-medium leading-relaxed px-4 opacity-90">
                 {maintenance.message || "O sistema está passando por otimizações de núcleo. Voltamos em breve com novidades extraordinárias."}
              </p>
           </div>

           <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 glass px-8 py-4 rounded-3xl border-white/5">
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                 <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Sincronizando Core...</span>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 glass px-8 py-4 rounded-3xl border-white/10 hover:bg-white/5 transition-all active:scale-95"
              >
                <i className="fa-solid fa-rotate-right text-xs"></i>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">Verificar Novamente</span>
              </button>
           </div>

           <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] pt-12">EsmaelX Cine • Exclusive Platform</p>
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

      <main className="container mx-auto px-6 pt-52 pb-20 min-h-[80vh]">
        <header className="mb-24 space-y-6 text-center lg:text-left animate-soft-zoom">
           <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className={`h-[1px] w-12 bg-gradient-to-r from-${colorBase}-500 to-transparent`}></div>
              <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>EsmaelX Originals</span>
           </div>
           <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter mb-4 leading-[0.8]">
             PURE <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5`}>VISION</span>
           </h1>
           <p className="text-gray-500 max-w-2xl mx-auto lg:mx-0 text-lg font-medium leading-relaxed opacity-60 border-l-0 lg:border-l-2 border-white/5 pl-0 lg:pl-6">
              {t.heroDesc}
           </p>
        </header>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-20">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {(['All', 'Ação', 'Terror', 'Comédia', 'Ficção', 'Drama', 'Série'] as Category[]).map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${selectedCategory === cat ? `bg-${colorBase}-500 text-white border-${colorBase}-500 shadow-2xl scale-105` : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {cat === 'All' ? t.categoryAll : cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5 glass px-8 py-4 rounded-2xl text-[9px] font-black uppercase text-gray-500 border-white/5 shadow-2xl">
            <i className="fa-solid fa-sort text-white/20"></i>
            <span>{t.sortBy}:</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="bg-transparent border-none focus:outline-none text-white cursor-pointer font-black uppercase">
              <option value="default" className="bg-black">{t.recent}</option>
              <option value="name" className="bg-black">{t.sortName}</option>
              <option value="rating" className="bg-black">{t.sortRating}</option>
              <option value="year" className="bg-black">{t.sortYear}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass p-2 rounded-[2rem] aspect-[2/3] animate-pulse bg-white/[0.02]" />)}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map(movie => (
              <AppCard 
                key={movie.id} 
                app={movie} 
                onClick={() => setSelectedApp(movie)} 
                activeColor={themeColors[theme]} 
                isFavorite={favorites.includes(movie.id)} 
                onToggleFavorite={() => setFavorites(f => f.includes(movie.id) ? f.filter(x => x !== movie.id) : [...f, movie.id])} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-fade-in">
             <div className="relative">
                <div className={`absolute inset-0 bg-${colorBase}-500/10 blur-[60px] rounded-full`}></div>
                <div className={`w-32 h-32 glass border border-white/10 rounded-full flex items-center justify-center text-5xl text-${colorBase}-500 shadow-2xl relative z-10`}>
                   <i className="fa-solid fa-box-open animate-pulse"></i>
                </div>
             </div>
             <div className="space-y-4 max-w-lg">
                <h3 className="text-2xl font-black tracking-tighter">Silêncio no Set...</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  Nossa videoteca está passando por uma manutenção criativa ou a curadoria está selecionando os próximos sucessos. Volte em breve!
                </p>
                <button 
                  onClick={fetchMovies}
                  className={`mt-6 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all active:scale-95`}
                >
                  <i className="fa-solid fa-rotate-right mr-2"></i> Recarregar Sistema
                </button>
             </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="glass p-12 rounded-[3.5rem] border border-white/5 bg-white/[0.01] flex flex-col lg:flex-row gap-16 items-center justify-between">
           <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <h4 className={`text-[10px] font-black text-${colorBase}-500 uppercase tracking-[0.5em]`}>Protocolo de Transparência</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium italic opacity-80">
                O <strong>EsmaelX Cine</strong> funciona estritamente como um indexador automático. Todos os fluxos de mídia e links exibidos são hospedados em servidores de terceiros de responsabilidade de seus proprietários. Não armazenamos nenhum conteúdo em nossos servidores. Devido à natureza dessas fontes externas, links podem sofrer instabilidades ou serem removidos sem aviso prévio. Agradecemos a compreensão.
              </p>
           </div>
           <div className="flex flex-col items-center lg:items-end gap-8 min-w-[220px]">
              <div className="flex gap-5">
                 <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/10 text-gray-600 hover:text-white transition-all cursor-help">
                    <i className="fa-solid fa-fingerprint"></i>
                 </div>
                 <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/10 text-gray-600 hover:text-white transition-all cursor-help">
                    <i className="fa-solid fa-eye-slash"></i>
                 </div>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-[10px] font-black text-white tracking-[0.2em] mb-1">ESMAELX PLATFORM</p>
                <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">© 2024 • Engineered for Excellence</p>
              </div>
           </div>
        </div>
      </footer>

      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={themeColors[theme]} />}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}
      
      <AIAssistant language={lang} activeColor={themeColors[theme]} apps={apps} onSelectApp={setSelectedApp} />
      
      <CineHub 
        language={lang} 
        setLanguage={setLang} 
        theme={theme} 
        setTheme={setTheme} 
        activeColor={themeColors[theme]} 
        isEnergySaving={isEnergySaving}
        setIsEnergySaving={setIsEnergySaving}
        onOpenDev={() => setShowDevProfile(true)}
      />
    </div>
  );
};

export default App;
