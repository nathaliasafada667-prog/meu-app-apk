
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
  isVerified: boolean;
  author: string;
  downloadUrl: string;
}

export type Category = 'All' | 'Game' | 'App' | 'Utility' | 'Social';
export type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'it' | 'ko' | 'ja';
export type ThemeColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan' | 'red' | 'orange' | 'lime' | 'fuchsia';
export type SortOption = 'default' | 'rating' | 'name' | 'size';

export interface TranslationSchema {
  // Hero & Navbar
  heroTitle: string;
  heroDesc: string;
  searchPlaceholder: string;
  devLabel: string;
  systemOnline: string;
  latency: string;
  uptime: string;
  tickerMsgs: string[];
  
  // Categorias
  categoryAll: string;
  categoryGame: string;
  categoryApp: string;
  categoryUtility: string;
  categorySocial: string;
  
  // UI Geral
  noResults: string;
  sortBy: string;
  sortName: string;
  sortRating: string;
  sortSize: string;
  recent: string;
  favorites: string;
  tryAgain: string;
  
  // Seções
  verifiedOfficial: string;
  qualityCertified: string;
  systemLibrary: string;
  exploringDatabase: string;
  waitingProjects: string;
  supabaseError: string;
  
  // Detalhes do App
  aboutMod: string;
  downloadBtn: string;
  generatingLink: string;
  redirecting: string;
  modEdition: string;
  officialDev: string;
  version: string;
  size: string;
  rating: string;
  optimizedText: string;
  verifiedBy: string;
  
  // Protocolo de Segurança
  secureProtocol: string;
  scanSteps: string[];
  
  // Perfil Dev
  reverseEngineering: string;
  devSpecialist: string;
  age: string;
  level: string;
  devDesc: string;
  aboutSystem: string;
  connect: string;
  message: string;
  telegram: string;
  
  // IA
  aiChatTitle: string;
  aiChatPlaceholder: string;
  aiWelcome: string;
  aiMaintenance: string;
  aiError: string;
  aiLoading: string;
  aiAnalysis: string;
  experimentalTip: string;
  mainFeatures: string;

  // Settings
  amoledOptimization: string;
  auroraOn: string;
  amoledOn: string;
  visualAtmosphere: string;
  languageSelect: string;
}
