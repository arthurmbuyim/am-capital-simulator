'use client';

import { useState } from 'react';
import { Download, Eye, FileText, X } from 'lucide-react';
import { SimulationData, CalculationResult } from '@/src/lib/types';

interface PDFPreviewProps {
  simulationData: SimulationData;
  results: CalculationResult;
  isOpen: boolean;
  onClose: () => void;
}

// Fonctions utilitaires locales
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(rate: number, decimals: number = 2): string {
  return `${rate.toFixed(decimals)}%`;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  simulationData, 
  results, 
  isOpen, 
  onClose 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const { generatePDF } = await import('@/src/lib/pdf-service');
      await generatePDF(simulationData, results, true);
      onClose();
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPDF = async () => {
    setIsGenerating(true);
    try {
      // Génération d'une version preview (sans téléchargement automatique)
      const { PDFService } = await import('@/src/lib/pdf-service');
      const pdfService = new PDFService();
      
      // Ici on pourrait ouvrir le PDF dans un nouvel onglet
      // Pour cette version, on génère et télécharge directement
      await pdfService.generateInvestmentReport(simulationData, results, true);
      
    } catch (error) {
      console.error('Erreur preview PDF:', error);
      alert('Erreur lors de la prévisualisation');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Rapport d'Investissement
              </h3>
              <p className="text-gray-600">
                {simulationData.city.charAt(0).toUpperCase() + simulationData.city.slice(1)} • {simulationData.rooms.toUpperCase()} • {simulationData.surface}m²
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 space-y-6">
          {/* Résumé */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3">Aperçu du rapport</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Rendement brut :</span>
                <div className="font-bold text-lg text-green-600">
                  {formatPercentage(results.grossReturn)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Loyer mensuel :</span>
                <div className="font-bold text-lg text-blue-600">
                  {formatCurrency(results.monthlyRent)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Cash-flow :</span>
                <div className="font-bold text-lg text-purple-600">
                  {formatCurrency(Math.max(0, results.cashflow))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Investissement :</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(results.totalCosts)}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu du rapport */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Le rapport PDF inclura :</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Résumé Exécutif</h5>
                  <p className="text-sm text-gray-600">
                    Caractéristiques du bien, résultats clés et recommandation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Détail des Calculs</h5>
                  <p className="text-sm text-gray-600">
                    Coûts d'acquisition, revenus, charges et indicateurs
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Analyse Financière</h5>
                  <p className="text-sm text-gray-600">
                    Répartition des charges et analyse de sensibilité
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Recommandations</h5>
                  <p className="text-sm text-gray-600">
                    Conseils personnalisés et points de vigilance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Informations du rapport</h5>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Format : PDF A4</div>
              <div>Pages : 4</div>
              <div>Taille : ~500 KB</div>
              <div>Brandé A&M Capital</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          
          <button
            onClick={handlePreviewPDF}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>Aperçu</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Télécharger PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;