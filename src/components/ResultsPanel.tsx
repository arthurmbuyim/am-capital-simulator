'use client';

import { ChevronRight, Download, AlertCircle, TrendingUp, DollarSign, Home } from 'lucide-react';
import { CalculationResult, SimulationData } from '@/src/lib/types';
import { formatCurrency, formatPercentage } from '@/src/lib/calculations';

interface ResultsPanelProps {
  results: CalculationResult | null;
  simulationData: SimulationData;
  loading: boolean;
  error: string | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  results, 
  simulationData, 
  loading, 
  error 
}) => {
  const handleGeneratePDF = () => {
    // TODO: Implémenter la génération de PDF
    console.log('Génération PDF...');
  };

  const getReturnColor = (returnRate: number) => {
    if (returnRate >= 8) return 'text-green-600 bg-green-50';
    if (returnRate >= 5) return 'text-blue-600 bg-blue-50';
    if (returnRate >= 3) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getReturnLabel = (returnRate: number) => {
    if (returnRate >= 8) return 'Excellent';
    if (returnRate >= 5) return 'Bon';
    if (returnRate >= 3) return 'Correct';
    return 'Faible';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-am-navy-text">
          Résultats en temps réel
        </h3>
        {loading && (
          <div className="flex items-center space-x-2 text-am-navy-text">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
            <span className="text-sm">Calcul...</span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Erreur de calcul</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      )}

      {/* Results Display */}
      {results && !loading && (
        <div className="space-y-6">
          {/* Main Return Rate */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-3 ${getReturnColor(results.grossReturn)}`}>
              <TrendingUp className="w-4 h-4 text-[#e90]" />
              <span className="text-sm font-medium text-am-navy-text">
                {getReturnLabel(results.grossReturn)}
              </span>
            </div>
            <div className="text-4xl font-bold text-am-navy mb-2">
              {formatPercentage(results.grossReturn)}
            </div>
            <p className="text-am-navy-light">Rendement brut annuel</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(results.monthlyRent)}
              </div>
              <p className="text-sm text-blue-700">Loyer mensuel</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(Math.max(0, results.cashflow))}
              </div>
              <p className="text-sm text-purple-700">Cash-flow mensuel</p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-am-navy-text">Rendement net</span>
              <span className="font-semibold text-[#e90]">
                {formatPercentage(results.netReturn)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="am-navy-text">ROI sur fonds propres</span>
              <span className="font-semibold text-[#e90]">
                {formatPercentage(results.roi)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="am-navy-text">Temps de retour</span>
              <span className="font-semibold text-[#e90]">
                {results.paybackPeriod.toFixed(1)} ans
              </span>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-am-navy-text mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-[#e90]" />
              Résumé de l'investissement
            </h4>
            <div className="text-sm text-am-navy-text space-y-2">
              <div className="flex justify-between">
                <span>Bien:</span>
                <span className="font-medium">
                  {simulationData.surface}m² ({simulationData.rooms.toUpperCase()})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ville:</span>
                <span className="font-medium capitalize">
                  {simulationData.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">
                  {simulationData.exploitationType === 'long' 
                    ? 'Location longue durée' 
                    : 'Location courte durée (Airbnb)'
                  }
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Investissement total:</span>
                <span className="font-semibold">
                  {formatCurrency(results.totalCosts)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Revenus annuels:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(results.monthlyRent * 12)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGeneratePDF}
              className="w-full bg-gradient-to-r from-am-navy to-am-navy-light hover:from-am-navy hover:to-am-navy hover:text-[#e90] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Générer le rapport PDF</span>
            </button>
            
            <button className="w-full bg-white hover:bg-gray-50 text-am-navy-text border-2 border-gray-200 hover:border-gray-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2">
              <span>Programmer un rendez-vous</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-am-navy-text bg-gray-50 p-3 rounded-lg">
            <p>
              <strong>Avertissement:</strong> Ces calculs sont basés sur des estimations 
              et des données de marché. Les résultats réels peuvent varier selon 
              les conditions du marché et votre situation fiscale.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Prêt pour l'analyse
          </h4>
          <p className="text-gray-600">
            Configurez vos paramètres pour obtenir une estimation détaillée 
            de votre investissement locatif.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;