import { NextRequest, NextResponse } from 'next/server';
import { CITIES_DATA, ROOM_COEFFICIENTS } from '@/src/lib/constants';

// Cache pour les données Airbnb
const airbnbCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.toLowerCase();
  const rooms = searchParams.get('rooms') as keyof typeof ROOM_COEFFICIENTS;
  const surface = parseInt(searchParams.get('surface') || '0');

  if (!city || !rooms || !surface) {
    return NextResponse.json(
      { error: 'Paramètres manquants: city, rooms et surface requis' },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `${city}-${rooms}-${surface}`;
    const cached = airbnbCache.get(cacheKey);
    
    // Vérifier le cache
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Appel à l'API AirDNA (simulé)
    const airbnbData = await fetchAirDNAData(city, rooms, surface);
    
    // Mettre en cache
    airbnbCache.set(cacheKey, {
      data: airbnbData,
      timestamp: Date.now()
    });

    return NextResponse.json(airbnbData);
  } catch (error) {
    console.error('Erreur API airbnb-data:', error);
    
    // Fallback sur calcul estimé
    const fallbackData = getAirbnbFallbackData(city, rooms, surface);
    return NextResponse.json({
      ...fallbackData,
      source: 'fallback',
      warning: 'Estimation basée sur les données locales'
    });
  }
}

async function fetchAirDNAData(city: string, rooms: string, surface: number) {
  // Simuler latence API
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 800));

  const cityData = CITIES_DATA[city];
  if (!cityData) {
    throw new Error(`Ville non supportée: ${city}`);
  }

  const roomCoefficient = ROOM_COEFFICIENTS[rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  
  // Calcul du prix par nuit basé sur les données de marché
  const baseRentPerSqm = cityData.rentPerSqm * roomCoefficient;
  const monthlyRent = baseRentPerSqm * surface;
  
  // Multiplicateur Airbnb (généralement 2.5-3.5x la location longue)
  const airbnbMultiplier = 2.8 + Math.random() * 0.7; // 2.8-3.5x
  const dailyRate = (monthlyRent * airbnbMultiplier) / 30;
  
  // Taux d'occupation (varie selon la ville et la saison)
  const occupancyRate = getOccupancyRate(city, rooms);
  const monthlyRevenue = dailyRate * 30 * occupancyRate;
  
  // Données saisonnières simulées
  const seasonalData = generateSeasonalData(dailyRate, city);

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    rooms,
    surface,
    dailyRate: Math.round(dailyRate),
    occupancyRate: Math.round(occupancyRate * 100),
    monthlyRevenue: Math.round(monthlyRevenue),
    annualRevenue: Math.round(monthlyRevenue * 12),
    seasonalData,
    marketAnalysis: {
      averageDailyRate: Math.round(dailyRate * (0.9 + Math.random() * 0.2)),
      competitorCount: Math.floor(Math.random() * 100) + 50,
      demandLevel: getDemandLevel(city),
      priceRecommendation: getPriceRecommendation(dailyRate),
    },
    source: 'airdna',
    confidence: 'high',
    lastUpdated: new Date().toISOString(),
    dataQuality: Math.round(80 + Math.random() * 20), // 80-100%
  };
}

function getOccupancyRate(city: string, rooms: string): number {
  const baseRates = {
    'paris': 0.75,
    'lyon': 0.68,
    'marseille': 0.62,
    'toulouse': 0.65,
    'nice': 0.78,
    'nantes': 0.60,
    'montpellier': 0.63,
    'strasbourg': 0.58,
    'bordeaux': 0.66,
  };
  
  const baseRate = baseRates[city as keyof typeof baseRates] || 0.65;
  
  // Ajustement selon le type de bien
  const roomAdjustment = {
    'studio': -0.05,
    't2': 0,
    't3': 0.03,
    't4': 0.05,
  };
  
  return Math.min(0.95, baseRate + (roomAdjustment[rooms as keyof typeof roomAdjustment] || 0));
}

function generateSeasonalData(baseDailyRate: number, city: string) {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];
  
  // Coefficients saisonniers par ville
  const seasonalMultipliers = {
    'paris': [0.8, 0.85, 0.95, 1.0, 1.1, 1.2, 1.3, 1.25, 1.15, 1.05, 0.9, 0.85],
    'nice': [0.7, 0.75, 0.9, 1.1, 1.3, 1.5, 1.6, 1.5, 1.2, 1.0, 0.8, 0.7],
    'lyon': [0.75, 0.8, 0.9, 1.0, 1.15, 1.25, 1.3, 1.2, 1.1, 1.0, 0.85, 0.8],
  };
  
  const multipliers = seasonalMultipliers[city as keyof typeof seasonalMultipliers] || 
    seasonalMultipliers['lyon'];
  
  return months.map((month, index) => ({
    month,
    dailyRate: Math.round(baseDailyRate * multipliers[index]),
    occupancy: Math.round((0.6 + Math.random() * 0.3) * 100), // 60-90%
    revenue: Math.round(baseDailyRate * multipliers[index] * 30 * (0.6 + Math.random() * 0.3))
  }));
}

function getDemandLevel(city: string): 'low' | 'medium' | 'high' | 'very_high' {
  const demandLevels: Record<string, 'low' | 'medium' | 'high' | 'very_high'> ={
    'paris': 'very_high',
    'nice': 'high',
    'lyon': 'high',
    'bordeaux': 'medium',
    'toulouse': 'medium',
    'marseille': 'medium',
    'montpellier': 'medium',
    'nantes': 'medium',
    'strasbourg': 'low',
  };
  
  return demandLevels[city as keyof typeof demandLevels] || 'medium';
}

function getPriceRecommendation(currentRate: number) {
  const variation = Math.random() * 0.2 - 0.1; // ±10%
  const recommendedRate = currentRate * (1 + variation);
  
  return {
    recommended: Math.round(recommendedRate),
    current: Math.round(currentRate),
    change: variation > 0 ? 'increase' : 'decrease',
    percentage: Math.round(Math.abs(variation) * 100),
  };
}

function getAirbnbFallbackData(city: string, rooms: string, surface: number) {
  const cityData = CITIES_DATA[city] || CITIES_DATA['paris'];
  const roomCoefficient = ROOM_COEFFICIENTS[rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  
  const baseRentPerSqm = cityData.rentPerSqm * roomCoefficient;
  const monthlyRent = baseRentPerSqm * surface;
  const dailyRate = (monthlyRent * 3) / 30; // Multiplicateur 3x simplifié
  const occupancyRate = 0.70; // 70% par défaut
  const monthlyRevenue = dailyRate * 30 * occupancyRate;

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    rooms,
    surface,
    dailyRate: Math.round(dailyRate),
    occupancyRate: 70,
    monthlyRevenue: Math.round(monthlyRevenue),
    annualRevenue: Math.round(monthlyRevenue * 12),
    seasonalData: [],
    marketAnalysis: {
      averageDailyRate: Math.round(dailyRate),
      competitorCount: 75,
      demandLevel: 'medium',
      priceRecommendation: {
        recommended: Math.round(dailyRate),
        current: Math.round(dailyRate),
        change: 'stable',
        percentage: 0,
      },
    },
    source: 'local_estimate',
    confidence: 'medium',
    lastUpdated: new Date().toISOString(),
    dataQuality: 75,
  };
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  airbnbCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => airbnbCache.delete(key));
}, CACHE_DURATION);