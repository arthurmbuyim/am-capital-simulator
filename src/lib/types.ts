// Types pour les données de simulation
export interface SimulationData {
  price: number;
  surface: number;
  rooms: 'studio' | 't2' | 't3' | 't4';
  exploitationType: 'long' | 'short';
  city: string;
}

// Types pour les résultats de calcul
export interface CalculationResult {
  monthlyRent: number;
  grossReturn: number;
  netReturn: number;
  cashflow: number;
  totalCosts: number;
  notaryFees: number;
  commissionFees: number;
  architectFees: number;
  monthlyCharges: number;
  taxesAndInsurance: number;
  managementFees: number;
  vacancyLoss: number;
  roi: number;
  paybackPeriod: number;
}

// Types pour les données d'API
export interface RentDataResponse {
  city: string;
  rooms: string;
  rentPerSqm: number;
  marketTrend: 'up' | 'down' | 'stable';
  confidence: 'low' | 'medium' | 'high';
  source: string;
  lastUpdated: string;
  dataPoints: number;
}

export interface AirbnbDataResponse {
  city: string;
  rooms: string;
  surface: number;
  dailyRate: number;
  occupancyRate: number;
  monthlyRevenue: number;
  annualRevenue: number;
  seasonalData: SeasonalData[];
  marketAnalysis: MarketAnalysis;
  source: string;
  confidence: 'low' | 'medium' | 'high';
  lastUpdated: string;
  dataQuality: number;
}

export interface SeasonalData {
  month: string;
  dailyRate: number;
  occupancy: number;
  revenue: number;
}

export interface MarketAnalysis {
  averageDailyRate: number;
  competitorCount: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very_high';
  priceRecommendation: PriceRecommendation;
}

export interface PriceRecommendation {
  recommended: number;
  current: number;
  change: 'increase' | 'decrease' | 'stable';
  percentage: number;
}

// Types pour les données de ville
export interface CityData {
  rentPerSqm: number;
  marketMultiplier: number;
}

// Types pour les coefficients de pièces
export type RoomType = 'studio' | 't2' | 't3' | 't4';
export type RoomCoefficients = Record<RoomType, number>;

// Types pour les formulaires
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  projectType: 'investment' | 'advice' | 'management' | 'other';
  budget?: string;
  timeline?: string;
}

// Types pour l'état de l'application
export interface AppState {
  simulationData: SimulationData;
  results: CalculationResult | null;
  loading: boolean;
  error: string | null;
  activeTab: 'simulation' | 'contact' | 'results';
}

// Types pour les composants UI
export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Types pour les notifications
export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Types pour l'analytics
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Types pour le PDF
export interface PDFReportData {
  simulation: SimulationData;
  results: CalculationResult;
  rentData?: RentDataResponse;
  airbnbData?: AirbnbDataResponse;
  generatedAt: string;
  reportId: string;
}

// Types utilitaires
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';

// Types pour les erreurs
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Types pour les réponses d'API
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
  timestamp: string;
}

// Export des types de constantes depuis constants.ts
// Les types RoomCoefficients et CityData sont déjà définis dans constants.ts

// Helpers de type
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;