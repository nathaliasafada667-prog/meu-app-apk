
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

export interface UserProfile {
  id: string;
  username: string;
  access_code: string;
  full_name: string;
  is_premium: boolean;
  expiry_date: string;
}

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

export type Category = 'All' | 'Games' | 'Tools' | 'Social' | 'Streaming' | 'Premium' | 'Ação' | 'Terror' | 'Comédia' | 'Ficção' | 'Drama' | 'Série';
export type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'it' | 'ko' | 'ja';
export type ThemeColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan' | 'red' | 'orange' | 'lime' | 'fuchsia';
export type AnimationStyle = 'soft-zoom' | 'cyber-glitch' | 'slide-deep' | 'rotate-3d';

export interface TranslationSchema {
  // General & Hero
  heroTitle: string;
  heroDesc: string;
  searchPlaceholder: string;
  systemOnline: string;
  tickerMsgs: string[];
  noResults: string;
  downloadBtn: string;
  maintenanceTitle: string;
  backSoon: string;
  
  // Navigation & Categories
  categoryAll: string;
  categoryGames: string;
  categoryTools: string;
  categorySocial: string;
  categoryStreaming: string;
  categoryPremium: string;
  
  // Components
  scanSteps: string[];
  devSpecialist: string;
  aboutSystem: string;
  devDesc: string;
  telegram: string;
  
  // CineHub / Settings Menu
  accessTab: string;
  settingsTab: string;
  agentPanel: string;
  usernameLabel: string;
  activeCodeLabel: string;
  verifiedBadge: string;
  validityLabel: string;
  daysRemainingLabel: string;
  disconnectBtn: string;
  closePanel: string;
  networkTime: string;
  accountSettings: string;
  buyAccess: string;
  validateProtocol: string;
  devProfileBtn: string;
  terminalLang: string;
  siteAnimations: string;
  protocolColor: string;
  glassBlur: string;
  amoledEconomy: string;
  cyberMode: string;
  
  // Auth & Pricing
  restrictedAccess: string;
  loginTitle: string;
  inputUser: string;
  inputCode: string;
  verifyAccessBtn: string;
  noCodeText: string;
  acquireElite: string;
  pricingTitle: string;
  eliteProtocol: string;
  pricingDesc: string;
  popularTag: string;
  buyNow: string;
  supportTitle: string;
  supportDesc: string;
  
  // Details & Security
  secureTransfer: string;
  analyzingApk: string;
  authSelo: string;
  authDesc: string;
  understandBtn: string;
  integrityLabel: string;
  sourceLabel: string;
  malwareLabel: string;
  sizeLabel: string;
  downloadsLabel: string;
  authorLabel: string;
  updateLabel: string;
  modFeaturesLabel: string;
  aboutAppLabel: string;
  premiumRequired: string;

  // New Search & Request
  requestAppTitle: string;
  requestAppDesc: string;
  requestWithDev: string;
  requestWithPartner: string;
}
