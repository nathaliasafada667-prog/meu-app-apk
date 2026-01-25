
import { MovieItem, Category } from '../types';

const DEFAULT_TMDB_KEY = 'b973cc20efe73b51c50dd198d64630d8'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

function getApiKey() {
  return localStorage.getItem('esmael_tmdb_key') || DEFAULT_TMDB_KEY;
}

const GENRE_MAP: Record<number, Category> = {
  28: 'Ação',
  27: 'Terror',
  35: 'Comédia',
  878: 'Ficção',
  18: 'Drama',
  10759: 'Ação',
  10765: 'Ficção',
};

export async function fetchTrendingMovies(page: number = 1): Promise<MovieItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${getApiKey()}&language=pt-BR&page=${page}`);
    const data = await response.json();
    return data.results.map((item: any) => mapToMovieItem(item));
  } catch (error) {
    return [];
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<MovieItem[]> {
  if (!query) return fetchTrendingMovies(page);
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`);
    const data = await response.json();
    return data.results.map((item: any) => mapToMovieItem(item));
  } catch (error) {
    return [];
  }
}

export async function fetchByCategory(category: Category, page: number = 1): Promise<MovieItem[]> {
  if (category === 'All') return fetchTrendingMovies(page);
  
  const genreId = Object.keys(GENRE_MAP).find(key => GENRE_MAP[Number(key)] === category);
  const type = category === 'Série' ? 'tv' : 'movie';
  
  try {
    const endpoint = category === 'Série' ? `${BASE_URL}/tv/popular` : `${BASE_URL}/discover/movie`;
    const genreParam = category === 'Série' ? '' : `&with_genres=${genreId}`;
    
    const response = await fetch(`${endpoint}?api_key=${getApiKey()}${genreParam}&language=pt-BR&sort_by=popularity.desc&page=${page}`);
    const data = await response.json();
    return data.results.map((item: any) => mapToMovieItem(item));
  } catch (error) {
    return [];
  }
}

function mapToMovieItem(item: any): MovieItem {
  const genreId = item.genre_ids?.[0];
  const isTV = item.media_type === 'tv' || !item.title;
  const category = isTV ? 'Série' : (GENRE_MAP[genreId] || 'Ficção');

  return {
    id: `tmdb-${item.id}`,
    tmdbId: String(item.id),
    mediaType: isTV ? 'tv' : 'movie',
    title: item.title || item.name || 'Título Indisponível',
    category: category as any,
    rating: Number(item.vote_average?.toFixed(1) || 0),
    year: (item.release_date || item.first_air_date || '2024').split('-')[0],
    duration: isTV ? 'Série' : '115 min',
    poster: item.poster_path ? `${IMAGE_URL}/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop',
    backdrop: item.backdrop_path ? `${IMAGE_URL}/original${item.backdrop_path}` : `${IMAGE_URL}/original${item.poster_path}`,
    description: item.overview || 'Sinopse oficial aguardando tradução no servidor TMDB.',
    actors: ['Conteúdo Original', 'Qualidade Premium'],
    isPremium: (item.vote_average || 0) > 7.5,
    isVerified: true,
    director: isTV ? 'Produção de TV' : 'Cinema Global',
    videoUrl: '', // Será gerada dinamicamente no player
    downloadUrl: '#'
  };
}
