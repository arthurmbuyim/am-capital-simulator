import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SimulationData, CalculationResult } from './types';

/**
 * Service de génération de PDF pour les rapports d'investissement
 */
export class PDFService {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
  }

  /**
   * Génère un rapport PDF complet
   */
  async generateInvestmentReport(
    simulation: SimulationData,
    results: CalculationResult,
    includeCharts: boolean = false
  ): Promise<void> {
    try {
      // Page 1: Résumé exécutif
      this.addHeader();
      this.addExecutiveSummary(simulation, results);
      
      // Page 2: Détail des calculs
      this.doc.addPage();
      this.addCalculationDetails(simulation, results);
      
      // Page 3: Analyse financière
      this.doc.addPage();
      this.addFinancialAnalysis(results);
      
      // Page 4: Recommandations (optionnel)
      if (includeCharts) {
        this.doc.addPage();
        await this.addChartsAndRecommendations(simulation, results);
      }
      
      // Footer sur toutes les pages
      this.addFooters();
      
      // Téléchargement
      const filename = `AM-Capital-Simulation-${simulation.city}-${new Date().toISOString().split('T')[0]}.pdf`;
      this.doc.save(filename);
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw new Error('Impossible de générer le rapport PDF');
    }
  }

  /**
   * En-tête A&M Capital
   */
  private addHeader(): void {
    // Logo et titre (simulé avec du texte stylé)
    this.doc.setFillColor(18, 31, 62); // #121f3e
    this.doc.rect(0, 0, 210, 30, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('A&M CAPITAL', 20, 15);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Simulateur d\'Investissement Locatif', 20, 22);
    
    // Date et heure
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.text(`Généré le ${dateStr}`, 140, 15);
    
    // Reset couleur
    this.doc.setTextColor(0, 0, 0);
  }

  /**
   * Résumé exécutif
   */
  private addExecutiveSummary(simulation: SimulationData, results: CalculationResult): void {
    let yPos = 50;
    
    // Titre
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RÉSUMÉ EXÉCUTIF', 20, yPos);
    yPos += 15;
    
    // Informations du bien
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Caractéristiques du bien', 20, yPos);
    yPos += 10;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const propertyInfo = [
      `Ville: ${simulation.city.charAt(0).toUpperCase() + simulation.city.slice(1)}`,
      `Surface: ${simulation.surface} m²`,
      `Type: ${simulation.rooms.toUpperCase()}`,
      `Prix d'acquisition: ${this.formatCurrency(simulation.price)}`,
      `Type d'exploitation: ${simulation.exploitationType === 'long' ? 'Location longue durée' : 'Location courte durée (Airbnb)'}`
    ];
    
    propertyInfo.forEach(info => {
      this.doc.text(info, 25, yPos);
      yPos += 7;
    });
    
    yPos += 10;
    
    // Résultats clés
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Résultats de la simulation', 20, yPos);
    yPos += 10;
    
    // Box pour les résultats principaux
    this.doc.setDrawColor(18, 31, 62);
    this.doc.setLineWidth(1);
    this.doc.rect(20, yPos, 170, 60);
    
    yPos += 15;
    
    // Rendement brut (grosse police)
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(34, 197, 94); // Vert
    this.doc.text(`${results.grossReturn.toFixed(2)}%`, 30, yPos);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Rendement brut annuel', 80, yPos);
    yPos += 15;
    
    // Autres métriques importantes
    const keyMetrics = [
      { label: 'Loyer mensuel:', value: this.formatCurrency(results.monthlyRent) },
      { label: 'Cash-flow mensuel:', value: this.formatCurrency(Math.max(0, results.cashflow)) },
      { label: 'Coût total d\'acquisition:', value: this.formatCurrency(results.totalCosts) }
    ];
    
    this.doc.setFontSize(11);
    keyMetrics.forEach(metric => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(metric.label, 30, yPos);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(metric.value, 100, yPos);
      yPos += 8;
    });
    
    yPos += 20;
    
    // Recommandation
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recommandation', 20, yPos);
    yPos += 10;
    
    const recommendation = this.getRecommendation(results.grossReturn);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    // Couleur selon la recommandation
    if (recommendation.includes('Excellent')) {
      this.doc.setTextColor(34, 197, 94); // Vert
    } else if (recommendation.includes('Bon')) {
      this.doc.setTextColor(59, 130, 246); // Bleu
    } else if (recommendation.includes('Correct')) {
      this.doc.setTextColor(245, 158, 11); // Orange
    } else {
      this.doc.setTextColor(239, 68, 68); // Rouge
    }
    
    const lines = this.doc.splitTextToSize(recommendation, 170);
    this.doc.text(lines, 20, yPos);
    
    this.doc.setTextColor(0, 0, 0); // Reset couleur
  }

  /**
   * Détail des calculs
   */
  private addCalculationDetails(simulation: SimulationData, results: CalculationResult): void {
    let yPos = 40;
    
    // Titre
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DÉTAIL DES CALCULS', 20, yPos);
    yPos += 20;
    
    // Coûts d'acquisition
    this.addSectionTitle('Coûts d\'acquisition', yPos);
    yPos += 15;
    
    const acquisitionCosts = [
      { label: 'Prix du bien', value: simulation.price },
      { label: 'Frais de notaire (9%)', value: results.notaryFees },
      { label: 'Commission A&M Capital (8,5%)', value: results.commissionFees },
      { label: 'Frais d\'architecte', value: results.architectFees },
      { label: 'TOTAL', value: results.totalCosts, isTotal: true }
    ];
    
    yPos = this.addTable(acquisitionCosts, yPos);
    yPos += 15;
    
    // Revenus et charges
    this.addSectionTitle('Revenus et charges mensuelles', yPos);
    yPos += 15;
    
    const monthlyData = [
      { label: 'Loyer mensuel', value: results.monthlyRent },
      { label: 'Charges mensuelles', value: -results.monthlyCharges },
      { label: 'Cash-flow net', value: results.cashflow, isTotal: true }
    ];
    
    yPos = this.addTable(monthlyData, yPos);
    yPos += 15;
    
    // Indicateurs de performance
    this.addSectionTitle('Indicateurs de performance', yPos);
    yPos += 15;
    
    const performanceData = [
      { label: 'Rendement brut', value: `${results.grossReturn.toFixed(2)}%`, isPercentage: true },
      { label: 'Rendement net', value: `${results.netReturn.toFixed(2)}%`, isPercentage: true },
      { label: 'ROI sur fonds propres', value: `${results.roi.toFixed(2)}%`, isPercentage: true },
      { label: 'Temps de retour', value: `${results.paybackPeriod.toFixed(1)} ans`, isPercentage: true }
    ];
    
    performanceData.forEach(item => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, 25, yPos);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.value, 120, yPos);
      yPos += 8;
    });
  }

  /**
   * Analyse financière approfondie
   */
  private addFinancialAnalysis(results: CalculationResult): void {
    let yPos = 40;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ANALYSE FINANCIÈRE', 20, yPos);
    yPos += 20;
    
    // Répartition des charges
    this.addSectionTitle('Répartition des charges mensuelles', yPos);
    yPos += 15;
    
    const chargesBreakdown = [
      { label: 'Frais de gestion', value: results.managementFees },
      { label: 'Provision vacance locative', value: results.vacancyLoss },
      { label: 'Taxes et assurances', value: results.taxesAndInsurance },
      { label: 'TOTAL CHARGES', value: results.monthlyCharges, isTotal: true }
    ];
    
    yPos = this.addTable(chargesBreakdown, yPos);
    yPos += 20;
    
    // Analyse de sensibilité
    this.addSectionTitle('Analyse de sensibilité', yPos);
    yPos += 15;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const sensitivityText = [
      'Cette simulation est basée sur les hypothèses suivantes:',
      '• Taux de vacance: 5% du loyer annuel',
      '• Frais de gestion: 8% du loyer',
      '• Frais d\'entretien: 2% de la valeur du bien par an',
      '• Taux d\'imposition: 30% (TMI moyen)',
      '',
      'Facteurs de risque à considérer:',
      '• Évolution des prix immobiliers',
      '• Changements réglementaires (encadrement des loyers)',
      '• Évolution des taux d\'intérêt',
      '• Situation économique locale'
    ];
    
    sensitivityText.forEach(line => {
      if (line === '') {
        yPos += 5;
      } else {
        this.doc.text(line, 25, yPos);
        yPos += 7;
      }
    });
  }

  /**
   * Ajoute des graphiques (simulé avec du texte pour cette version)
   */
  private async addChartsAndRecommendations(simulation: SimulationData, results: CalculationResult): Promise<void> {
    let yPos = 40;
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECOMMANDATIONS', 20, yPos);
    yPos += 20;
    
    // Recommandations personnalisées
    const recommendations = this.getDetailedRecommendations(simulation, results);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    recommendations.forEach(rec => {
      if (rec.title) {
        yPos += 5;
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(rec.title, 20, yPos);
        yPos += 10;
        this.doc.setFont('helvetica', 'normal');
      }
      
      const lines = this.doc.splitTextToSize(rec.content, 170);
      this.doc.text(lines, 25, yPos);
      yPos += lines.length * 7 + 10;
    });
  }

  /**
   * Ajoute les footers sur toutes les pages
   */
  private addFooters(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Ligne de séparation
      this.doc.setDrawColor(200, 200, 200);
      this.doc.line(20, 280, 190, 280);
      
      // Informations A&M Capital
      this.doc.setFontSize(9);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('A&M Capital - 20 Rue Ampère, 91300 Massy', 20, 290);
      this.doc.text('Tél: +33 1 42 86 83 85 - Email: contact@am-capital.fr', 20, 295);
      
      // Numéro de page
      this.doc.text(`Page ${i}/${pageCount}`, 180, 290);
      
      // Disclaimer
      this.doc.setFontSize(8);
      this.doc.text('Ce rapport est fourni à titre informatif uniquement et ne constitue pas un conseil en investissement.', 20, 285);
    }
  }

  /**
   * Utilitaires
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private addSectionTitle(title: string, yPos: number): void {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(18, 31, 62);
    this.doc.text(title, 20, yPos);
    this.doc.setTextColor(0, 0, 0);
  }

  private addTable(data: Array<{label: string, value: number | string, isTotal?: boolean, isPercentage?: boolean}>, startY: number): number {
    let yPos = startY;
    
    data.forEach(item => {
      if (item.isTotal) {
        this.doc.setDrawColor(18, 31, 62);
        this.doc.line(25, yPos - 2, 160, yPos - 2);
        this.doc.setFont('helvetica', 'bold');
      } else {
        this.doc.setFont('helvetica', 'normal');
      }
      
      this.doc.text(item.label, 25, yPos);
      
      const valueStr = typeof item.value === 'number' && !item.isPercentage 
        ? this.formatCurrency(item.value)
        : item.value.toString();
      
      this.doc.text(valueStr, 120, yPos);
      yPos += 8;
    });
    
    return yPos;
  }

  private getRecommendation(grossReturn: number): string {
    if (grossReturn >= 8) {
      return 'Excellent investissement ! Ce bien présente une rentabilité très attractive supérieure à 8%. Les conditions sont favorables pour un investissement locatif de qualité.';
    } else if (grossReturn >= 5) {
      return 'Bon investissement. Avec un rendement entre 5% et 8%, ce bien offre une rentabilité correcte dans le contexte actuel du marché immobilier.';
    } else if (grossReturn >= 3) {
      return 'Investissement correct mais prudence recommandée. Le rendement est dans la moyenne basse du marché. Vérifiez les possibilités d\'optimisation.';
    } else {
      return 'Attention : rendement faible. Ce bien présente un rendement inférieur aux standards du marché. Il est recommandé de revoir les paramètres ou chercher d\'autres opportunités.';
    }
  }

  private getDetailedRecommendations(simulation: SimulationData, results: CalculationResult): Array<{title?: string, content: string}> {
    const recommendations = [];
    
    if (results.grossReturn >= 7) {
      recommendations.push({
        title: '✅ Investissement recommandé',
        content: 'Ce bien présente une excellente rentabilité. Nous recommandons de procéder rapidement à l\'acquisition en négociant si possible le prix d\'achat pour optimiser encore davantage le rendement.'
      });
    }
    
    if (simulation.exploitationType === 'short') {
      recommendations.push({
        title: '🏖️ Location courte durée',
        content: 'La location Airbnb nécessite une gestion active et une veille réglementaire constante. Assurez-vous de respecter les réglementations locales et de prévoir du temps pour la gestion.'
      });
    }
    
    recommendations.push({
      title: '📊 Optimisations possibles',
      content: 'Considérez les travaux d\'amélioration qui pourraient augmenter le loyer, la recherche de financements avantageux, et l\'optimisation fiscale (statut LMNP, SCI, etc.).'
    });
    
    recommendations.push({
      title: '⚠️ Points de vigilance',
      content: 'Vérifiez l\'état du bien, l\'environnement proche, les projets d\'urbanisme, la demande locative locale et préparez une provision pour les travaux imprévus.'
    });
    
    return recommendations;
  }
}

/**
 * Fonction helper pour générer un PDF depuis un composant
 */
export const generatePDF = async (
  simulation: SimulationData,
  results: CalculationResult,
  includeCharts: boolean = false
): Promise<void> => {
  const pdfService = new PDFService();
  await pdfService.generateInvestmentReport(simulation, results, includeCharts);
};

export default PDFService;