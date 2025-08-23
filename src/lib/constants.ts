import { RoomCoefficients, CityData } from './types';

// Coefficients par nombre de pièces (données marché 2025)
/* export const ROOM_COEFFICIENTS: RoomCoefficients = {
  studio: 1.39, // +39% du prix de base
  t2: 1.0,      // Prix de référence (100%)
  t3: 0.81,     // -19% du prix de base
  t4: 0.8,      // -20% du prix de base
}; */

// Coefficients par nombre de pièces (données marché 2025)
export const ROOM_COEFFICIENTS = {
  studio: 1.39, // +39% du prix de base
  t2: 1.0,      // Prix de référence (100%)
  t3: 0.81,     // -19% du prix de base
  t4: 0.8,      // -20% du prix de base
} as const;

//export type RoomCoefficients = typeof ROOM_COEFFICIENTS;

// Base de données locale des villes (minimum 27 villes requis)
export const CITIES_DATA: Record<string, CityData> = {
  // Grandes métropoles
  'paris': { rentPerSqm: 35, marketMultiplier: 1.2 },
  'lyon': { rentPerSqm: 18, marketMultiplier: 1.1 },
  'marseille': { rentPerSqm: 15, marketMultiplier: 1.0 },
  'toulouse': { rentPerSqm: 16, marketMultiplier: 1.05 },
  'nice': { rentPerSqm: 22, marketMultiplier: 1.15 },
  'nantes': { rentPerSqm: 14, marketMultiplier: 1.0 },
  'montpellier': { rentPerSqm: 16, marketMultiplier: 1.0 },
  'strasbourg': { rentPerSqm: 15, marketMultiplier: 0.95 },
  'bordeaux': { rentPerSqm: 17, marketMultiplier: 1.08 },
  'lille': { rentPerSqm: 13, marketMultiplier: 0.95 },
  
  // Villes moyennes
  'rennes': { rentPerSqm: 13, marketMultiplier: 1.0 },
  'reims': { rentPerSqm: 11, marketMultiplier: 0.9 },
  'saint-etienne': { rentPerSqm: 9, marketMultiplier: 0.85 },
  'toulon': { rentPerSqm: 14, marketMultiplier: 1.0 },
  'grenoble': { rentPerSqm: 14, marketMultiplier: 1.0 },
  'dijon': { rentPerSqm: 12, marketMultiplier: 0.95 },
  'angers': { rentPerSqm: 11, marketMultiplier: 0.9 },
  'nimes': { rentPerSqm: 12, marketMultiplier: 0.95 },
  'villeurbanne': { rentPerSqm: 16, marketMultiplier: 1.05 },
  'clermont-ferrand': { rentPerSqm: 11, marketMultiplier: 0.9 },
  
  // Villes côtières et touristiques
  'cannes': { rentPerSqm: 28, marketMultiplier: 1.3 },
  'antibes': { rentPerSqm: 24, marketMultiplier: 1.2 },
  'biarritz': { rentPerSqm: 20, marketMultiplier: 1.15 },
  'la-rochelle': { rentPerSqm: 16, marketMultiplier: 1.1 },
  'saint-malo': { rentPerSqm: 18, marketMultiplier: 1.1 },
  'deauville': { rentPerSqm: 22, marketMultiplier: 1.2 },
  'arcachon': { rentPerSqm: 19, marketMultiplier: 1.15 },
  
  // Villes universitaires
  'poitiers': { rentPerSqm: 10, marketMultiplier: 0.85 },
  'tours': { rentPerSqm: 12, marketMultiplier: 0.9 },
  'orleans': { rentPerSqm: 12, marketMultiplier: 0.9 },
  'caen': { rentPerSqm: 12, marketMultiplier: 0.9 },
  'limoges': { rentPerSqm: 9, marketMultiplier: 0.8 },
  'besancon': { rentPerSqm: 11, marketMultiplier: 0.85 },
};

//export type CityData = typeof CITIES_DATA;

// Frais et taux fixes
export const FEES = {
  NOTARY_RATE: 0.09,           // 9% du prix
  COMMISSION_RATE: 0.085,      // 8.5% du prix A&M Capital
  ARCHITECT_LONG: 90,          // 90€/m² longue durée
  ARCHITECT_SHORT: 120,        // 120€/m² courte durée
  MANAGEMENT_RATE: 0.08,       // 8% du loyer pour gestion
  VACANCY_RATE: 0.05,          // 5% de vacance locative
  INSURANCE_ANNUAL: 400,       // Assurance PNO annuelle
  PROPERTY_TAX_RATE: 0.015,    // 1.5% de la valeur par an
  MAINTENANCE_RATE: 0.02,      // 2% de la valeur par an
};

// Taux d'intérêt par défaut
export const INTEREST_RATES = {
  MORTGAGE_RATE: 0.048,        // 4.8% taux moyen crédit immobilier
  CASH_FLOW_RATE: 0.04,       // 4% pour calcul cash-flow
};

// Multiplicateurs location courte durée
export const AIRBNB_MULTIPLIERS = {
  BASE: 3.0,                   // Multiplicateur de base
  MIN: 2.5,                    // Minimum
  MAX: 3.5,                    // Maximum
  OCCUPANCY_RATE: 0.7,         // Taux d'occupation 70%
};

// Limites des sliders
export const SLIDER_LIMITS = {
  PRICE: { min: 50000, max: 1000000, step: 5000 },
  SURFACE: { min: 10, max: 200, step: 5 },
};

// Types de bien disponibles
export const ROOM_TYPES = [
  { key: 'studio', label: 'Studio', description: 'Idéal pour étudiants' },
  { key: 't2', label: 'T2', description: 'Référence du marché' },
  { key: 't3', label: 'T3', description: 'Parfait pour familles' },
  { key: 't4', label: 'T4', description: 'Grand appartement' },
] as const;

// Types d'exploitation
export const EXPLOITATION_TYPES = [
  { 
    key: 'long', 
    label: 'Longue durée', 
    description: 'Location traditionnelle',
    icon: 'Home',
    pros: ['Revenus stables', 'Moins de gestion', 'Fiscalité avantageuse'],
    cons: ['Rendement plus faible', 'Vacance plus longue']
  },
  { 
    key: 'short', 
    label: 'Courte durée', 
    description: 'Location Airbnb/saisonnière',
    icon: 'Calendar',
    pros: ['Revenus élevés', 'Flexibilité', 'Usage personnel'],
    cons: ['Gestion intensive', 'Volatilité', 'Réglementation']
  },
] as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  API_ERROR: 'Erreur lors de la récupération des données. Veuillez réessayer.',
  VALIDATION_ERROR: 'Veuillez vérifier les informations saisies.',
  CITY_NOT_FOUND: 'Ville non trouvée dans notre base de données.',
  CALCULATION_ERROR: 'Erreur lors du calcul. Veuillez réessayer.',
  PDF_GENERATION_ERROR: 'Erreur lors de la génération du PDF.',
  FORM_SUBMISSION_ERROR: 'Erreur lors de l\'envoi du formulaire.',
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  CALCULATION_SUCCESS: 'Calcul effectué avec succès',
  FORM_SUBMITTED: 'Formulaire envoyé avec succès',
  PDF_GENERATED: 'Rapport PDF généré avec succès',
  DATA_SAVED: 'Données sauvegardées',
};

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,      // 5 secondes
  SUCCESS_DURATION: 3000,      // 3 secondes
  ERROR_DURATION: 8000,        // 8 secondes
  MAX_NOTIFICATIONS: 5,        // Nombre maximum de notifications simultanées
};

// URLs des APIs externes
export const API_ENDPOINTS = {
  RENT_DATA: '/api/rent-data',
  AIRBNB_DATA: '/api/airbnb-data',
  CONTACT_FORM: '/api/contact',
  GENERATE_PDF: '/api/generate-pdf',
  MEILLEURSAGENTS_BASE: 'https://www.meilleursagents.com/prix-immobilier',
  AIRDNA_BASE: 'https://api.airdna.co/v1',
};

// Configuration du cache
export const CACHE_CONFIG = {
  RENT_DATA_TTL: 10 * 60 * 1000,    // 10 minutes
  AIRBNB_DATA_TTL: 15 * 60 * 1000,   // 15 minutes
  CITY_DATA_TTL: 60 * 60 * 1000,     // 1 heure
  MAX_CACHE_SIZE: 1000,               // Nombre maximum d'entrées
};

// Configuration analytics
export const ANALYTICS_EVENTS = {
  SIMULATION_STARTED: 'simulation_started',
  CALCULATION_COMPLETED: 'calculation_completed',
  PDF_DOWNLOADED: 'pdf_downloaded',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  TAB_CHANGED: 'tab_changed',
  SLIDER_CHANGED: 'slider_changed',
  CITY_CHANGED: 'city_changed',
  EXPLOITATION_TYPE_CHANGED: 'exploitation_type_changed',
};

// Configuration responsive
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Configuration des couleurs A&M Capital
export const BRAND_COLORS = {
  primary: '#2563eb',      // Bleu principal
  primaryDark: '#1d4ed8',  // Bleu foncé
  secondary: '#64748b',    // Gris
  success: '#10b981',      // Vert
  warning: '#f59e0b',      // Jaune
  error: '#ef4444',        // Rouge
  info: '#3b82f6',         // Bleu info
};

// Configuration des métadonnées
export const SEO_CONFIG = {
  title: 'A&M Capital - Simulateur d\'Investissement Locatif',
  description: 'Simulateur professionnel avec données de marché en temps réel. Calculez instantanément votre rentabilité locative.',
  keywords: 'investissement, immobilier, locatif, rentabilité, airbnb, simulation, A&M Capital',
  author: 'A&M Capital',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://amcapital-simulator.vercel.app',
  image: '/og-image.jpg',
};

// Export par défaut des constantes principales
export default {
  ROOM_COEFFICIENTS,
  CITIES_DATA,
  FEES,
  INTEREST_RATES,
  AIRBNB_MULTIPLIERS,
  SLIDER_LIMITS,
};