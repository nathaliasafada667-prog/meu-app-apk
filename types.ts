
export interface ModAppItem {
  id: string;
  title: string;
  packageName: string;
  version: string;
  size: string;
  category: 'Games' | 'Tools' | 'Social' | 'Streaming' | 'Premium' | 'System';
  rating: number;
  downloads: string;
  icon: string;
  banner: string;
  description: string;
  modFeatures: string[];
  isPremium: boolean;
  isVerified: boolean;
  author: string;
  downloadUrl: string;
  lastUpdate: string;
}

// Added MovieItem interface to support CineHub and fix import errors in movieApiService.ts
export interface MovieItem {
  id: string;
  tmdbId: string;
  mediaType: 'movie' | 'tv';
  title: string;
  category: Category;
  rating: number;
  year: string;
  duration: string;
  poster: string;
  backdrop: string;
  description: string;
  actors: string[];
  isPremium: boolean;
  isVerified: boolean;
  director: string;
  videoUrl: string;
  downloadUrl: string;
}

export interface SystemSettings {
  maintenance_enabled: boolean;
  maintenance_message: string;
}

// Expanded Category to include Movie genres and "Série" to fix comparison and assignment errors in movieApiService.ts
export type Category = 'All' | 'Games' | 'Tools' | 'Social' | 'Streaming' | 'Premium' | 'Ação' | 'Terror' | 'Comédia' | 'Ficção' | 'Drama' | 'Série';
export type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'it' | 'ko' | 'ja';
export type ThemeColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan' | 'red' | 'orange' | 'lime' | 'fuchsia';

export interface TranslationSchema {
  heroTitle: string;
  heroDesc: string;
  searchPlaceholder: string;
  systemOnline: string;
  tickerMsgs: string[];
  categoryAll: string;
  categoryGames: string;
  categoryTools: string;
  categorySocial: string;
  categoryStreaming: string;
  categoryPremium: string;
  noResults: string;
  downloadBtn: string;
  maintenanceTitle: string;
  backSoon: string;
  // Added missing translation fields required by AppDetails and DevProfile components
  scanSteps: string[];
  devSpecialist: string;
  aboutSystem: string;
  devDesc: string;
  telegram: string;
}
