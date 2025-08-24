import { SimulationData, CalculationResult, RentDataResponse, AirbnbDataResponse } from './types';
import { FEES, INTEREST_RATES, AIRBNB_MULTIPLIERS, ROOM_COEFFICIENTS, CITIES_DATA } from './constants';

/**
 * Interface pour les données API brutes
 */
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
  totalMonthlyRent?: number;
  netMonthlyRevenue?: number;
}

/**
 * Calcule tous les indicateurs de rentabilité d'un investissement immobilier
 * Version améliorée pour utiliser les données API
 */
export function calculateInvestmentReturns(
  simulation: SimulationData,
  apiData?: ApiData | RentDataResponse | AirbnbDataResponse
): CalculationResult {
  // Calcul des coûts initiaux
  const notaryFees = simulation.price * FEES.NOTARY_RATE;
  const commissionFees = simulation.price * FEES.COMMISSION_RATE;
  const architectFees = simulation.surface * (
    simulation.exploitationType === 'long' 
      ? FEES.ARCHITECT_LONG 
      : FEES.ARCHITECT_SHORT
  );
  const totalCosts = simulation.price + notaryFees + commissionFees + architectFees;

  // Calcul des revenus locatifs avec priorité aux données API
  let monthlyRent: number;
  let dataSource = 'local'; // Pour tracer l'origine des données
  
  if (apiData) {
    console.log('Données API disponibles:', apiData);
    
    if (simulation.exploitationType === 'short') {
      // Pour Airbnb, utiliser les revenus de l'API
      if ('monthlyRevenue' in apiData && apiData.monthlyRevenue) {
        monthlyRent = apiData.monthlyRevenue;
        dataSource = 'api-airbnb';
        console.log('Utilisation revenus Airbnb API:', monthlyRent);
      } else if ('netMonthlyRevenue' in apiData && apiData.netMonthlyRevenue) {
        monthlyRent = apiData.netMonthlyRevenue;
        dataSource = 'api-airbnb-net';
        console.log('Utilisation revenus nets Airbnb API:', monthlyRent);
      } else {
        // Fallback sur calcul local pour Airbnb
        monthlyRent = calculateLocalShortTermRent(simulation);
        console.log('Fallback calcul local Airbnb:', monthlyRent);
      }
    } else {
      // Pour location longue durée
      if ('totalMonthlyRent' in apiData && apiData.totalMonthlyRent) {
        monthlyRent = apiData.totalMonthlyRent;
        dataSource = 'api-rent';
        console.log('Utilisation loyer total API:', monthlyRent);
      } else if ('monthlyRent' in apiData && apiData.monthlyRent) {
        monthlyRent = apiData.monthlyRent;
        dataSource = 'api-rent-base';
        console.log('Utilisation loyer mensuel API:', monthlyRent);
      } else if ('rentPerSqm' in apiData && apiData.rentPerSqm) {
        monthlyRent = apiData.rentPerSqm * simulation.surface;
        dataSource = 'api-rent-calculated';
        console.log('Calcul basé sur prix/m² API:', monthlyRent);
      } else {
        // Fallback sur calcul local
        monthlyRent = calculateLocalLongTermRent(simulation);
        console.log('Fallback calcul local location longue:', monthlyRent);
      }
    }
  } else {
    // Pas de données API, utilisation du calcul local
    if (simulation.exploitationType === 'short') {
      monthlyRent = calculateLocalShortTermRent(simulation);
    } else {
      monthlyRent = calculateLocalLongTermRent(simulation);
    }
    console.log('Calcul local (pas de données API):', monthlyRent);
  }

  // Ajustement des charges pour Airbnb si données API disponibles
  let additionalFees = 0;
  if (simulation.exploitationType === 'short' && apiData && 'fees' in apiData && apiData.fees) {
    // Si on a des frais spécifiques Airbnb de l'API
    additionalFees = (apiData.fees.total || 0) / 12; // Mensualiser si nécessaire
    console.log('Frais Airbnb supplémentaires:', additionalFees);
  }

  // Calcul des charges mensuelles
  const managementFees = monthlyRent * FEES.MANAGEMENT_RATE;
  const vacancyLoss = simulation.exploitationType === 'long' 
    ? monthlyRent * FEES.VACANCY_RATE 
    : 0; // Pas de vacance pour Airbnb (déjà dans le taux d'occupation)
  const monthlyInsurance = FEES.INSURANCE_ANNUAL / 12;
  const monthlyPropertyTax = (simulation.price * FEES.PROPERTY_TAX_RATE) / 12;
  const monthlyMaintenance = (simulation.price * FEES.MAINTENANCE_RATE) / 12;
  
  const monthlyCharges = managementFees + vacancyLoss + monthlyInsurance + 
                        monthlyPropertyTax + monthlyMaintenance + additionalFees;
  
  const taxesAndInsurance = monthlyInsurance + monthlyPropertyTax;

  // Calcul des rendements
  const annualRent = monthlyRent * 12;
  const annualNetRent = (monthlyRent - monthlyCharges) * 12;

  const grossReturn = (annualRent / totalCosts) * 100;
  const netReturn = (annualNetRent / totalCosts) * 100;
  
  // Calcul du cash-flow (après crédit)
  const monthlyLoanPayment = calculateMonthlyLoanPayment(totalCosts * 0.8, 20, INTEREST_RATES.MORTGAGE_RATE); // 80% financement
  const cashflow = monthlyRent - monthlyCharges - monthlyLoanPayment;
  
  // Calcul du ROI et temps de retour
  const initialEquity = totalCosts * 0.2; // 20% d'apport
  const roi = ((monthlyRent - monthlyCharges - monthlyLoanPayment) * 12 / initialEquity) * 100;
  const paybackPeriod = initialEquity / Math.max(1, (monthlyRent - monthlyCharges) * 12); // en années

  // Log final pour debug
  console.log(`Calcul final - Source: ${dataSource}, Loyer: ${monthlyRent}€, Rendement brut: ${grossReturn.toFixed(2)}%`);

  return {
    monthlyRent: Math.round(monthlyRent),
    grossReturn: Math.round(grossReturn * 100) / 100,
    netReturn: Math.round(netReturn * 100) / 100,
    cashflow: Math.round(cashflow),
    totalCosts: Math.round(totalCosts),
    notaryFees: Math.round(notaryFees),
    commissionFees: Math.round(commissionFees),
    architectFees: Math.round(architectFees),
    monthlyCharges: Math.round(monthlyCharges),
    taxesAndInsurance: Math.round(taxesAndInsurance),
    managementFees: Math.round(managementFees),
    vacancyLoss: Math.round(vacancyLoss),
    roi: Math.round(roi * 100) / 100,
    paybackPeriod: Math.round(paybackPeriod * 100) / 100,
  };
}

/**
 * Fonction helper pour calculer le loyer en location longue durée (fallback local)
 */
function calculateLocalLongTermRent(simulation: SimulationData): number {
  const cityData = CITIES_DATA[simulation.city.toLowerCase()] || CITIES_DATA['paris'];
  const roomCoeff = ROOM_COEFFICIENTS[simulation.rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  return cityData.rentPerSqm * simulation.surface * roomCoeff;
}

/**
 * Fonction helper pour calculer le loyer en location courte durée (fallback local)
 */
function calculateLocalShortTermRent(simulation: SimulationData): number {
  const longTermRent = calculateLocalLongTermRent(simulation);
  return longTermRent * AIRBNB_MULTIPLIERS.BASE * AIRBNB_MULTIPLIERS.OCCUPANCY_RATE;
}

/**
 * Calcule la mensualité d'un prêt immobilier
 */
export function calculateMonthlyLoanPayment(
  principal: number,
  years: number,
  annualRate: number
): number {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return monthlyPayment;
}

/**
 * Calcule le prix de revient total d'un investissement
 */
export function calculateTotalInvestmentCost(simulation: SimulationData): number {
  const notaryFees = simulation.price * FEES.NOTARY_RATE;
  const commissionFees = simulation.price * FEES.COMMISSION_RATE;
  const architectFees = simulation.surface * (
    simulation.exploitationType === 'long' 
      ? FEES.ARCHITECT_LONG 
      : FEES.ARCHITECT_SHORT
  );
  
  return simulation.price + notaryFees + commissionFees + architectFees;
}

/**
 * Calcule les revenus estimés en location longue durée
 */
export function calculateLongTermRent(
  city: string,
  surface: number,
  rooms: string,
  rentData?: RentDataResponse | ApiData
): number {
  if (rentData) {
    if ('totalMonthlyRent' in rentData && rentData.totalMonthlyRent) {
      return rentData.totalMonthlyRent;
    }
    if ('rentPerSqm' in rentData && rentData.rentPerSqm) {
      return rentData.rentPerSqm * surface;
    }
  }
  
  // Fallback sur données locales
  const cityData = CITIES_DATA[city.toLowerCase()] || CITIES_DATA['paris'];
  const roomCoeff = ROOM_COEFFICIENTS[rooms as keyof typeof ROOM_COEFFICIENTS] || 1;
  
  return cityData.rentPerSqm * surface * roomCoeff;
}

/**
 * Calcule les revenus estimés en location courte durée
 */
export function calculateShortTermRent(
  city: string,
  surface: number,
  rooms: string,
  airbnbData?: AirbnbDataResponse | ApiData
): number {
  if (airbnbData) {
    if ('monthlyRevenue' in airbnbData && airbnbData.monthlyRevenue) {
      return airbnbData.monthlyRevenue;
    }
    if ('netMonthlyRevenue' in airbnbData && airbnbData.netMonthlyRevenue) {
      return airbnbData.netMonthlyRevenue;
    }
  }
  
  // Fallback sur estimation basée sur la location longue
  const longTermRent = calculateLongTermRent(city, surface, rooms);
  return longTermRent * AIRBNB_MULTIPLIERS.BASE * AIRBNB_MULTIPLIERS.OCCUPANCY_RATE;
}

/**
 * Calcule la rentabilité comparative entre location longue et courte
 */
export interface ComparisonResult {
  longTerm: {
    monthlyRent: number;
    grossReturn: number;
    netReturn: number;
    cashflow: number;
  };
  shortTerm: {
    monthlyRent: number;
    grossReturn: number;
    netReturn: number;
    cashflow: number;
  };
  difference: {
    monthlyRentDiff: number;
    grossReturnDiff: number;
    netReturnDiff: number;
    cashflowDiff: number;
  };
  recommendation: 'long' | 'short' | 'equal';
}

export function calculateComparison(
  simulation: SimulationData,
  longTermData?: RentDataResponse | ApiData,
  shortTermData?: AirbnbDataResponse | ApiData
): ComparisonResult {
  // Calcul pour location longue durée
  const longTermSimulation = { ...simulation, exploitationType: 'long' as const };
  const longTermResults = calculateInvestmentReturns(longTermSimulation, longTermData);
  
  // Calcul pour location courte durée
  const shortTermSimulation = { ...simulation, exploitationType: 'short' as const };
  const shortTermResults = calculateInvestmentReturns(shortTermSimulation, shortTermData);
  
  // Calcul des différences
  const monthlyRentDiff = shortTermResults.monthlyRent - longTermResults.monthlyRent;
  const grossReturnDiff = shortTermResults.grossReturn - longTermResults.grossReturn;
  const netReturnDiff = shortTermResults.netReturn - longTermResults.netReturn;
  const cashflowDiff = shortTermResults.cashflow - longTermResults.cashflow;
  
  // Recommandation basée sur le rendement net
  let recommendation: 'long' | 'short' | 'equal';
  if (netReturnDiff > 1) {
    recommendation = 'short';
  } else if (netReturnDiff < -1) {
    recommendation = 'long';
  } else {
    recommendation = 'equal';
  }
  
  return {
    longTerm: {
      monthlyRent: longTermResults.monthlyRent,
      grossReturn: longTermResults.grossReturn,
      netReturn: longTermResults.netReturn,
      cashflow: longTermResults.cashflow,
    },
    shortTerm: {
      monthlyRent: shortTermResults.monthlyRent,
      grossReturn: shortTermResults.grossReturn,
      netReturn: shortTermResults.netReturn,
      cashflow: shortTermResults.cashflow,
    },
    difference: {
      monthlyRentDiff: Math.round(monthlyRentDiff),
      grossReturnDiff: Math.round(grossReturnDiff * 100) / 100,
      netReturnDiff: Math.round(netReturnDiff * 100) / 100,
      cashflowDiff: Math.round(cashflowDiff),
    },
    recommendation,
  };
}

/**
 * Calcule l'impact fiscal selon le régime choisi
 */
export interface TaxCalculation {
  regime: 'micro' | 'reel';
  taxableIncome: number;
  taxAmount: number;
  netIncomeAfterTax: number;
  effectiveRate: number;
}

export function calculateTaxes(
  annualRent: number,
  annualCharges: number,
  marginalRate: number = 0.3, // TMI à 30% par défaut
  exploitationType: 'long' | 'short' = 'long'
): { micro: TaxCalculation; reel: TaxCalculation; recommendation: 'micro' | 'reel' } {
  
  // Régime micro (abattement automatique)
  const microAbatement = exploitationType === 'long' ? 0.3 : 0.5; // 30% BIC ou 50% BNC
  const microTaxableIncome = annualRent * (1 - microAbatement);
  const microTaxAmount = microTaxableIncome * marginalRate;
  const microNetIncome = annualRent - microTaxAmount;
  
  // Régime réel (déduction des charges réelles)
  const reelTaxableIncome = Math.max(0, annualRent - annualCharges);
  const reelTaxAmount = reelTaxableIncome * marginalRate;
  const reelNetIncome = annualRent - annualCharges - reelTaxAmount;
  
  const micro: TaxCalculation = {
    regime: 'micro',
    taxableIncome: Math.round(microTaxableIncome),
    taxAmount: Math.round(microTaxAmount),
    netIncomeAfterTax: Math.round(microNetIncome),
    effectiveRate: Math.round((microTaxAmount / annualRent) * 10000) / 100,
  };
  
  const reel: TaxCalculation = {
    regime: 'reel',
    taxableIncome: Math.round(reelTaxableIncome),
    taxAmount: Math.round(reelTaxAmount),
    netIncomeAfterTax: Math.round(reelNetIncome),
    effectiveRate: Math.round((reelTaxAmount / annualRent) * 10000) / 100,
  };
  
  const recommendation = reelNetIncome > microNetIncome ? 'reel' : 'micro';
  
  return { micro, reel, recommendation };
}

/**
 * Valide les données de simulation
 */
export function validateSimulationData(data: SimulationData): string[] {
  const errors: string[] = [];
  
  if (data.price < 50000 || data.price > 1000000) {
    errors.push('Le prix doit être entre 50 000€ et 1 000 000€');
  }
  
  if (data.surface < 10 || data.surface > 200) {
    errors.push('La surface doit être entre 10m² et 200m²');
  }
  
  if (!['studio', 't2', 't3', 't4'].includes(data.rooms)) {
    errors.push('Type de bien invalide');
  }
  
  if (!['long', 'short'].includes(data.exploitationType)) {
    errors.push('Type d\'exploitation invalide');
  }
  
  if (!data.city || data.city.trim().length < 2) {
    errors.push('Ville requise');
  }
  
  return errors;
}

/**
 * Formate un nombre en devise européenne
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(rate: number, decimals: number = 2): string {
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Calcule les indicateurs de performance sur plusieurs années
 */
export interface YearlyProjection {
  year: number;
  rent: number;
  charges: number;
  netIncome: number;
  cumulativeReturn: number;
  propertyValue: number;
}

export function calculateYearlyProjections(
  simulation: SimulationData,
  results: CalculationResult,
  years: number = 10,
  rentGrowth: number = 0.02, // 2% par an
  propertyGrowth: number = 0.03 // 3% par an
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let cumulativeReturn = 0;
  
  for (let year = 1; year <= years; year++) {
    const rentMultiplier = Math.pow(1 + rentGrowth, year);
    const propertyMultiplier = Math.pow(1 + propertyGrowth, year);
    
    const annualRent = results.monthlyRent * 12 * rentMultiplier;
    const annualCharges = results.monthlyCharges * 12 * rentMultiplier;
    const netIncome = annualRent - annualCharges;
    
    cumulativeReturn += netIncome;
    
    projections.push({
      year,
      rent: Math.round(annualRent),
      charges: Math.round(annualCharges),
      netIncome: Math.round(netIncome),
      cumulativeReturn: Math.round(cumulativeReturn),
      propertyValue: Math.round(simulation.price * propertyMultiplier),
    });
  }
  
  return projections;
}