
export interface ModAppItem {
  id: string;
  title: string;
  packageName: string;
  version: string;
  size: string;
  category: Category;
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

export interface MovieItem {
  id: string;
  tmdbId: string;
  mediaType: 'tv' | 'movie';
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

export interface UserProfile {
  id: string;
  username: string;
  access_code: string;
  full_name: string;
  is_premium: boolean;
  expiry_date: string;
}

export interface SystemSettings {
  maintenance_enabled: boolean;
  maintenance_message: string;
  maintenance_start_at?: string;
}

export type Category = 'All' | 'Apps' | 'Games' | 'Premium' | 'Ação' | 'Terror' | 'Comédia' | 'Ficção' | 'Drama' | 'Série';
export type Language = 'pt' | 'en' | 'es' | 'ru' | 'fr' | 'it' | 'ko' | 'ja';
export type ThemeColor = 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan' | 'red' | 'orange' | 'lime' | 'fuchsia';
export type AnimationStyle = 'soft-zoom' | 'cyber-glitch' | 'slide-deep' | 'rotate-3d';

export interface TranslationSchema {
  heroTitle: string;
  heroDesc: string;
  searchPlaceholder: string;
  systemOnline: string;
  tickerMsgs: string[];
  noResults: string;
  downloadBtn: string;
  maintenanceTitle: string;
  backSoon: string;
  categoryAll: string;
  categoryApps: string;
  categoryGames: string;
  categoryPremium: string;
  scanSteps: string[];
  devSpecialist: string;
  aboutSystem: string;
  devDesc: string;
  telegram: string;
  accessTab: string;
  collectionTab: string;
  settingsTab: string;
  requestsTab: string;
  noFavorites: string;
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
  aiVoiceToggle: string; // Nova tradução
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
  requestAppTitle: string;
  requestAppDesc: string;
  requestWithDev: string;
  requestWithPartner: string;
  requestPlaceholderApp: string;
  requestPlaceholderDetails: string;
  requestSubmitBtn: string;
  requestSuccessTitle: string;
  requestTicketLabel: string;
}
