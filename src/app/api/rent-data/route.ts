import { NextRequest, NextResponse } from 'next/server';
import { CITIES_DATA, ROOM_COEFFICIENTS } from '@/src/lib/constants';

// Cache pour éviter trop d'appels API
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.toLowerCase();
  const rooms = searchParams.get('rooms') as keyof typeof ROOM_COEFFICIENTS;

  if (!city || !rooms) {
    return NextResponse.json(
      { error: 'Paramètres manquants: city et rooms requis' },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `${city}-${rooms}`;
    const cached = cache.get(cacheKey);
    
    // Vérifier le cache
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Simuler un appel à l'API MeilleursAgents
    const rentData = await fetchMeilleursAgentsData(city, rooms);
    
    // Mettre en cache
    cache.set(cacheKey, {
      data: rentData,
      timestamp: Date.now()
    });

    return NextResponse.json(rentData);
  } catch (error) {
    console.error('Erreur API rent-data:', error);
    
    // Fallback sur données locales
    const fallbackData = getFallbackData(city, rooms);
    return NextResponse.json({
      ...fallbackData,
      source: 'fallback',
      warning: 'Données de fallback utilisées'
    });
  }
}

async function fetchMeilleursAgentsData(city: string, rooms: string) {
  // Simuler latence réseau
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

  const cityData = CITIES_DATA[city];
  if (!cityData) {
    throw new Error(`Ville non supportée: ${city}`);
  }

  const roomCoefficient = ROOM_COEFFICIENTS[rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  
  // En réalité, ici on ferait un scraping de meilleursagents.com
  // ou un appel à leur API s'ils en ont une
  const baseRentPerSqm = cityData.rentPerSqm * roomCoefficient;
  
  // Ajouter une variation aléatoire pour simuler les données réelles
  const variation = 0.9 + Math.random() * 0.2; // ±10%
  const rentPerSqm = Math.round(baseRentPerSqm * variation);

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    rooms,
    rentPerSqm,
    marketTrend: Math.random() > 0.5 ? 'up' : 'stable',
    confidence: 'high',
    source: 'meilleursagents',
    lastUpdated: new Date().toISOString(),
    dataPoints: Math.floor(Math.random() * 50) + 20, // Nombre d'annonces analysées
  };
}

function getFallbackData(city: string, rooms: string) {
  const cityData = CITIES_DATA[city] || CITIES_DATA['paris'];
  const roomCoefficient = ROOM_COEFFICIENTS[rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  
  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    rooms,
    rentPerSqm: Math.round(cityData.rentPerSqm * roomCoefficient),
    marketTrend: 'stable',
    confidence: 'medium',
    source: 'local_database',
    lastUpdated: new Date().toISOString(),
    dataPoints: 15,
  };
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  cache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
}, CACHE_DURATION);