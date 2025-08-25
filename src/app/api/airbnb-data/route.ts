import { NextRequest, NextResponse } from 'next/server';

// Cache en mémoire
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Multiplicateurs Airbnb par ville (basés sur l'attractivité touristique)
const AIRBNB_MULTIPLIERS: Record<string, number> = {
  'paris': 3.5,
  'lyon': 2.8,
  'marseille': 2.5,
  'toulouse': 2.4,
  'nice': 3.8,
  'nantes': 2.3,
  'montpellier': 2.6,
  'strasbourg': 2.5,
  'bordeaux': 2.7,
  'lille': 2.2,
  'cannes': 4.2,
  'antibes': 3.9,
  'biarritz': 4.0,
  'deauville': 3.7,
  'arcachon': 3.5,
  'saint-malo': 3.3,
  'la-rochelle': 3.0
};

// Taux d'occupation moyens par ville (en %)
const OCCUPANCY_RATES: Record<string, number> = {
  'paris': 75,
  'lyon': 68,
  'marseille': 65,
  'nice': 72,
  'cannes': 78,
  'bordeaux': 70,
  'toulouse': 66,
  'montpellier': 69,
  'strasbourg': 67,
  'biarritz': 74,
  'default': 70
};

// Saisonnalité par mois (multiplicateur)
const SEASONALITY = [
  0.7,  // Janvier
  0.75, // Février
  0.85, // Mars
  0.95, // Avril
  1.1,  // Mai
  1.3,  // Juin
  1.5,  // Juillet
  1.5,  // Août
  1.2,  // Septembre
  0.95, // Octobre
  0.8,  // Novembre
  0.9   // Décembre
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city')?.toLowerCase() || 'paris';
    const rooms = searchParams.get('rooms')?.toLowerCase() || 't2';
    const surface = parseInt(searchParams.get('surface') || '50');

    // Clé de cache
    const cacheKey = `airbnb-${city}-${rooms}-${surface}`;
    
    // Vérifier le cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Calculer le prix de base (récupération depuis l'API rent-data)
    // Utiliser une URL relative pour que ça fonctionne en local et en production
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const baseRentResponse = await fetch(
      `${baseUrl}/api/rent-data?city=${city}&rooms=${rooms}&surface=${surface}`
    );
    
    let baseMonthlyRent = 1750; // Valeur par défaut
    if (baseRentResponse.ok) {
      const baseData = await baseRentResponse.json();
      baseMonthlyRent = baseData.totalMonthlyRent;
    }

    // Obtenir le multiplicateur Airbnb pour la ville
    const multiplier = AIRBNB_MULTIPLIERS[city] || 3.0;
    const occupancyRate = (OCCUPANCY_RATES[city] || OCCUPANCY_RATES['default']) / 100;

    // Si vous avez une clé API AirDNA (optionnel)
    const airdnaKey = process.env.AIRDNA_API_KEY;
    let realData = false;
    let nightlyRate = Math.round((baseMonthlyRent * multiplier) / 30);
    
    if (airdnaKey) {
      try {
        // Tentative d'appel API AirDNA
        const response = await fetch(
          `https://api.airdna.co/v1/market/rental_rates`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${airdnaKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              city: city,
              bedrooms: parseInt(rooms.replace(/\D/g, '')) || 1,
              property_type: 'apartment'
            })
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          nightlyRate = data.average_daily_rate || nightlyRate;
          realData = true;
        }
      } catch (error) {
        console.log('API AirDNA non disponible, utilisation des estimations');
      }
    }

    // Calculs des revenus
    const monthlyRevenue = Math.round(nightlyRate * 30 * occupancyRate);
    const annualRevenue = monthlyRevenue * 12;
    
    // Calcul des revenus par saison
    const seasonalRevenues = SEASONALITY.map((factor, index) => ({
      month: index + 1,
      revenue: Math.round(monthlyRevenue * factor),
      occupancy: Math.round(occupancyRate * 100 * factor)
    }));

    // Frais spécifiques Airbnb
    const airbnbFees = {
      cleaning: Math.round(surface * 2), // 2€/m² par passage
      management: monthlyRevenue * 0.20, // 20% de frais de gestion
      supplies: 50, // Consommables mensuels
      utilities: 100, // Charges supplémentaires
      total: 0
    };
    airbnbFees.total = airbnbFees.cleaning * 4 + airbnbFees.management + airbnbFees.supplies + airbnbFees.utilities;

    // Préparer la réponse
    const responseData = {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      rooms: rooms.toUpperCase(),
      surface,
      nightlyRate,
      occupancyRate: occupancyRate * 100,
      monthlyRevenue,
      annualRevenue,
      netMonthlyRevenue: monthlyRevenue - airbnbFees.total,
      multiplierVsLongTerm: multiplier,
      fees: airbnbFees,
      seasonalRevenues,
      dataSource: realData ? 'airdna' : 'estimation',
      lastUpdated: new Date().toISOString(),
      marketInsights: {
        competitionLevel: 'medium',
        averageRating: 4.3,
        bookingWindow: 21, // jours à l'avance
        topAmenities: ['wifi', 'cuisine équipée', 'lave-linge'],
        priceOptimization: 'dynamic pricing recommended'
      }
    };

    // Mettre en cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Erreur API airbnb-data:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données Airbnb',
        fallback: true,
        monthlyRevenue: 5250,
        occupancyRate: 70,
        nightlyRate: 250
      },
      { status: 500 }
    );
  }
}

// Health check
export async function HEAD() {
  return new Response(null, { status: 200 });
}