
import React, { useState, useMemo, useEffect } from 'react';
import { MovieItem, Category, Language, ThemeColor, SortOption } from '../types';
import { translations } from '../translations';
import { fetchByCategory, searchMovies } from '../services/movieApiService';
import Navbar from './Navbar';
import AppCard from './AppCard';
import AppDetails from './AppDetails';
import DevProfile from './DevProfile';
import CineHub from './CineHub';
import AIAssistant from './AIAssistant';

const App: React.FC = () => {
  const [apps, setApps] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<MovieItem | null>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [page, setPage] = useState(1);
  
  const [isEnergySaving, setIsEnergySaving] = useState(() => localStorage.getItem('esmael_energy') === 'true');
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('esmael_cine_favs') || '[]'));
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('esmael_lang') as Language) || 'pt');
  const [theme, setTheme] = useState<ThemeColor>(() => (localStorage.getItem('esmael_theme') as ThemeColor) || 'rose');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEnergySaving) return;
    setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  };

  const fetchContent = async (category: Category, query: string = '', pageNum: number = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let results: MovieItem[] = [];
      if (query) {
        results = await searchMovies(query, pageNum);
      } else {
        results = await fetchByCategory(category, pageNum);
      }
      
      setApps(prev => pageNum === 1 ? results : [...prev, ...results]);
    } catch (error) {
      console.error("Erro ao carregar TMDB:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Reseta a lista e volta para a página 1 quando muda categoria ou busca
  useEffect(() => {
    if (!isBooting) {
      setPage(1);
      fetchContent(selectedCategory, searchQuery, 1);
    }
  }, [selectedCategory, searchQuery, isBooting]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchContent(selectedCategory, searchQuery, nextPage);
  };

  useEffect(() => { 
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 2500);
    return () => clearTimeout(bootTimer);
  }, []);

  const t = translations[lang] || translations['pt'];
  const themeColors: Record<ThemeColor, string> = { blue: 'blue-500', emerald: 'emerald-500', rose: 'rose-500', amber: 'amber-500', purple: 'purple-500', cyan: 'cyan-400', red: 'red-600', orange: 'orange-500', lime: 'lime-400', fuchsia: 'fuchsia-500' };
  const colorBase = themeColors[theme].split('-')[0];

  const sortedMovies = useMemo(() => {
    let result = [...apps];
    if (sortOption === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'year') result.sort((a, b) => b.year.localeCompare(a.year));
    return result;
  }, [apps, sortOption]);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center space-y-8">
        <div className={`w-24 h-24 border-2 border-${colorBase}-500/20 rounded-full flex items-center justify-center relative`}>
           <div className={`absolute inset-0 border-t-2 border-${colorBase}-500 rounded-full animate-spin`}></div>
           <i className="fa-solid fa-clapperboard text-3xl animate-pulse"></i>
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">Sincronizando EsmaelX Cine</h2>
           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
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
              <span className={`text-${colorBase}-500 text-[10px] font-black uppercase tracking-[0.5em]`}>Sua Chave API está Ativa</span>
           </div>
           <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter mb-4 leading-[0.8]">
             PURE <span className={`text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5`}>VISION</span>
           </h1>
           <p className="text-gray-500 max-w-2xl mx-auto lg:mx-0 text-lg font-medium opacity-60">
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
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => <div key={i} className="glass p-2 rounded-[2rem] aspect-[2/3] animate-pulse bg-white/[0.02]" />)}
          </div>
        ) : sortedMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {sortedMovies.map(movie => (
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
            
            <div className="mt-24 flex flex-col items-center justify-center gap-6">
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`group relative px-14 py-6 glass rounded-[2rem] border-white/10 overflow-hidden transition-all hover:border-${colorBase}-500/50 active:scale-95`}
              >
                <div className={`absolute inset-0 bg-${colorBase}-500/10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="flex items-center gap-4 relative z-10">
                   {loadingMore ? (
                     <i className="fa-solid fa-circle-notch animate-spin text-lg text-white/40"></i>
                   ) : (
                     <i className="fa-solid fa-plus text-sm"></i>
                   )}
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                      {loadingMore ? 'Explorando...' : 'Carregar Mais'}
                   </span>
                </div>
              </button>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">Explorando página {page} do catálogo TMDB</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-fade-in">
             <i className="fa-solid fa-box-open text-5xl text-gray-700"></i>
             <p className="text-gray-500 font-medium">Nenhum título encontrado. Tente outra busca!</p>
          </div>
        )}
      </main>

      {selectedApp && <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} language={lang} activeColor={themeColors[theme]} />}
      {showDevProfile && <DevProfile onClose={() => setShowDevProfile(false)} language={lang} activeColor={themeColors[theme]} />}
      <AIAssistant language={lang} activeColor={themeColors[theme]} apps={apps} onSelectApp={setSelectedApp} />
      <CineHub 
        language={lang} setLanguage={setLang} theme={theme} setTheme={setTheme} 
        activeColor={themeColors[theme]} isEnergySaving={isEnergySaving}
        setIsEnergySaving={setIsEnergySaving} onOpenDev={() => setShowDevProfile(true)}
      />
    </div>
  );
};

export default App;
