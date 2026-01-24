export interface AppItem {
  id: string;
  name: string;
  category: 'Game' | 'App' | 'Utility' | 'Social';
  rating: number;
  downloads: string;
  version: string;
  size: string;
  icon: string;
  description: string;
  modFeatures: string[];
  isPremium: boolean;
  downloadUrl: string;
}

export type Category = 'All' | 'Game' | 'App' | 'Utility' | 'Social';

export type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'it' | 'ko' | 'ja';

export type ThemeColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan';

export type SortOption = 'default' | 'rating' | 'name' | 'size';

export interface TranslationSchema {
  heroTitle: string;
  heroDesc: string;
  searchPlaceholder: string;
  devLabel: string;
  categoryAll: string;
  categoryGame: string;
  categoryApp: string;
  categoryUtility: string;
  categorySocial: string;
  noResults: string;
  aboutMod: string;
  downloadBtn: string;
  generatingLink: string;
  redirecting: string;
  aiAnalysis: string;
  aiLoading: string;
  experimentalTip: string;
  mainFeatures: string;
  version: string;
  size: string;
  rating: string;
  age: string;
  level: string;
  devDesc: string;
  connect: string;
  message: string;
  favorites: string;
  sortBy: string;
  sortName: string;
  sortRating: string;
  sortSize: string;
  aiChatTitle: string;
  aiChatPlaceholder: string;
}
