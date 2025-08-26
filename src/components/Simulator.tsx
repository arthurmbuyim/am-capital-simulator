'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, Users, TrendingUp, Home, Calendar, MapPin, Globe, Database, AlertCircle } from 'lucide-react';
import { SimulationData, CalculationResult } from '@/src/lib/types';
import { calculateInvestmentReturns, validateSimulationData } from '@/src/lib/calculations';
import { CITIES_DATA, ROOM_TYPES, EXPLOITATION_TYPES } from '@/src/lib/constants';
import ResultsPanel from './ResultsPanel';
import ContactForm from './ContactForm';

interface SimulatorProps {
  simulationData: SimulationData;
  setSimulationData: (data: SimulationData) => void;
}

interface ApiData {
  monthlyRent?: number;
  monthlyRevenue?: number;
  pricePerSqm?: number;
  nightlyRate?: number;
  occupancyRate?: number;
  dataSource?: string;
  marketTrends?: any;
  fees?: any;
  seasonalRevenues?: any[];
}

// Composant indicateur de source de données
const DataSourceIndicator: React.FC<{
  source?: string;
  loading?: boolean;
  error?: string;
}> = ({ source, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-blue-600 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span>Récupération des données du marché...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-orange-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Données locales utilisées</span>
      </div>
    );
  }

  const isApiData = source === 'api' || source === 'airdna';
  
  return (
    <div className="flex items-center space-x-2 text-sm">
      {isApiData ? (
        <>
          <Globe className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Données temps réel</span>
        </>
      ) : (
        <>
          <Database className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600">Données de référence</span>
        </>
      )}
    </div>
  );
};

const Simulator: React.FC<SimulatorProps> = ({ simulationData, setSimulationData }) => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fonction pour récupérer les données depuis les APIs
  const fetchRentData = useCallback(async (
    city: string,
    rooms: string,
    surface: number,
    exploitationType: 'long' | 'short'
  ) => {
    try {
      setApiLoading(true);
      setApiError(null);
      
      // Déterminer quelle API appeler
      const endpoint = exploitationType === 'long' 
        ? '/api/rent-data' 
        : '/api/airbnb-data';
      
      // Construire l'URL avec les paramètres
      const params = new URLSearchParams({
        city: city.toLowerCase(),
        rooms: rooms.toLowerCase(),
        surface: surface.toString()
      });
      
      console.log(`Appel API: ${endpoint}?${params.toString()}`);
      
      // Appel API
      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const data = await response.json();
      console.log('Données reçues de l\'API:', data);
      
      // Mettre à jour les données API
      if (exploitationType === 'long') {
        // Données location longue durée
        setApiData({
          monthlyRent: data.totalMonthlyRent,
          pricePerSqm: data.pricePerSqm,
          dataSource: data.dataSource,
          marketTrends: data.marketTrends
        });
      } else {
        // Données Airbnb
        setApiData({
          monthlyRevenue: data.monthlyRevenue || data.netMonthlyRevenue,
          nightlyRate: data.nightlyRate,
          occupancyRate: data.occupancyRate,
          fees: data.fees,
          seasonalRevenues: data.seasonalRevenues,
          dataSource: data.dataSource
        });
      }
      
      console.log(`Données récupérées depuis: ${data.dataSource}`);
      
    } catch (err) {
      console.error('Erreur API:', err);
      setApiError('Utilisation des données locales');
      // Les calculs utiliseront les valeurs par défaut
      setApiData(null);
    } finally {
      setApiLoading(false);
    }
  }, []);

  // useEffect pour appeler l'API quand les paramètres changent
  useEffect(() => {
  const timer = setTimeout(() => {
    if (simulationData.city && simulationData.rooms) {
      fetchRentData(
        simulationData.city,
        simulationData.rooms,
        simulationData.surface,
        simulationData.exploitationType
      );
    }
  }, 200); // Au lieu de 500ms
  
  return () => clearTimeout(timer);
}, [
    simulationData.city,
    simulationData.rooms,
    simulationData.surface,
    simulationData.exploitationType,
    fetchRentData
  ]);

  // Fonction de calcul modifiée pour utiliser les données API
  const performLocalCalculation = useCallback((data: SimulationData) => {
  try {
    // Validation
    const validationErrors = validateSimulationData(data);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    // Calcul immédiat avec données locales ou API si déjà disponibles
    const result = calculateInvestmentReturns(data, apiData || undefined);
    setResults(result);
    setError(null);
  } catch (err) {
    console.error('Erreur de calcul:', err);
    setError('Erreur lors du calcul. Veuillez réessayer.');
  }
}, [apiData]);

  // Debounced calculation
  /* const calculateResults = useCallback(
  (() => {
    let timeoutId: NodeJS.Timeout;
    return (data: SimulationData) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        performCalculation(data);
      }, 100); // Au lieu de 600ms
    };
  })(),
  [performCalculation]
); */

  useEffect(() => {
  performLocalCalculation(simulationData);
}, [simulationData, performLocalCalculation]); 

  const updateSimulationData = (updates: Partial<SimulationData>) => {
    setSimulationData({ ...simulationData, ...updates });
  };

  return (
    <section id="simulator" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-am-navy-text mb-4">
            Simulateur d'investissement
          </h2>
          <p className="text-lg text-am-navy-text max-w-2xl mx-auto">
            Configurez votre projet et obtenez une analyse complète en temps réel
          </p>
        </div>

        {/* Indicateur de source de données */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4 max-w-md mx-auto">
          <DataSourceIndicator 
            source={apiData?.dataSource} 
            loading={apiLoading} 
            error={apiError || undefined} 
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: 'simulation', label: 'Simulation', icon: Calculator },
            { id: 'contact', label: 'Contact', icon: Users },
            { id: 'results', label: 'Résultats', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                activeTab === id
                  ? 'bg-am-navy-light text-[#e90] shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Simulation Tab */}
            {activeTab === 'simulation' && (
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h3 className="text-2xl font-bold am-navy-text mb-6">
                  Paramètres de simulation
                </h3>
                
                {/* Price Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-am-navy-text">
                      Prix du bien
                    </label>
                    <span className="text-lg font-semibold text-am-navy-text">
                      {simulationData.price.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={5000}
                    value={simulationData.price}
                    onChange={(e) => updateSimulationData({ price: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>50 000€</span>
                    <span>1 000 000€</span>
                  </div>
                </div>

                {/* Surface Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-am-navy-light">
                      Surface
                    </label>
                    <span className="text-lg font-semibold text-am-navy-text">
                      {simulationData.surface} m²
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={simulationData.surface}
                    onChange={(e) => updateSimulationData({ surface: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10 m²</span>
                    <span>200 m²</span>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-am-navy-light">
                    Type de bien
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ROOM_TYPES.map(({ key, label, description }) => (
                      <button
                        key={key}
                        onClick={() => updateSimulationData({ rooms: key })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                          simulationData.rooms === key
                            ? 'border-am-navy-light bg-blue-50 text-am-navy-light'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold">{label}</div>
                        <div className="text-xs opacity-75">{description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exploitation Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-am-navy-light">
                    Type d'exploitation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {EXPLOITATION_TYPES.map(({ key, label, description, pros, cons }) => (
                      <button
                        key={key}
                        onClick={() => updateSimulationData({ exploitationType: key })}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          simulationData.exploitationType === key
                            ? 'border-am-navy-light bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {key === 'long' ? (
                            <Home className="w-6 h-6 text-am-navy" />
                          ) : (
                            <Calendar className="w-6 h-6 text-am-navy" />
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{description}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium text-green-600 mb-1">Avantages:</div>
                            <ul className="text-gray-600 space-y-1">
                              {pros.slice(0, 2).map((pro, index) => (
                                <li key={index}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium text-orange-600 mb-1">Inconvénients:</div>
                            <ul className="text-gray-600 space-y-1">
                              {cons.slice(0, 2).map((con, index) => (
                                <li key={index}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-am-navy-light flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Ville</span>
                  </label>
                  <select
                    value={simulationData.city}
                    onChange={(e) => updateSimulationData({ city: e.target.value })}
                    className="w-full p-3 border border-am-navy-light rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {Object.keys(CITIES_DATA).map(city => (
                      <option key={city} value={city}>
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Affichage des données API si disponibles */}
                {apiData && (
                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <div className="font-medium text-blue-900 mb-2">Données de marché</div>
                    {simulationData.exploitationType === 'long' && apiData.monthlyRent && (
                      <div className="text-blue-700">
                        Loyer estimé : {apiData.monthlyRent.toLocaleString('fr-FR')}€/mois
                      </div>
                    )}
                    {simulationData.exploitationType === 'short' && apiData.monthlyRevenue && (
                      <>
                        <div className="text-blue-700">
                          Revenus Airbnb : {apiData.monthlyRevenue.toLocaleString('fr-FR')}€/mois
                        </div>
                        {apiData.occupancyRate && (
                          <div className="text-blue-700">
                            Taux d'occupation : {apiData.occupancyRate}%
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <ContactForm />
            )}

            {/* Results Tab */}
            {activeTab === 'results' && results && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Analyse détaillée
                </h3>
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.monthlyRent.toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-sm text-blue-700">Loyer mensuel</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.grossReturn.toFixed(2)}%
                      </div>
                      <div className="text-sm text-green-700">Rendement brut</div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-am-navy-text mb-3">Détail des coûts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Prix du bien</span>
                        <span className="font-medium">{simulationData.price.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="flex justify-between text-am-navy-text">
                        <span>Frais de notaire (9%)</span>
                        <span>{results.notaryFees.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="flex justify-between text-am-navy-text">
                        <span>Commission A&M (8.5%)</span>
                        <span>{results.commissionFees.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="flex justify-between text-am-navy-text">
                        <span>Frais d'architecte</span>
                        <span>{results.architectFees.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Coût total</span>
                        <span>{results.totalCosts.toLocaleString('fr-FR')}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {results.netReturn.toFixed(2)}%
                      </div>
                      <div className="text-xs text-purple-700">Rendement net</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {Math.max(0, results.cashflow).toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-xs text-orange-700">Cash-flow mensuel</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results Display */}
          <ResultsPanel
            results={results}
            simulationData={simulationData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
};

export default Simulator;