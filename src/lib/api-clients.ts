import { RentDataResponse, AirbnbDataResponse, ApiResponse } from './types';

/**
 * Configuration de l'API client
 */
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 10000, // 10 secondes
  retries: 3,
};

/**
 * Classe d'erreur personnalisée pour les APIs
 */
export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: any;

  constructor(message: string, status: number = 500, code: string = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Client HTTP de base avec gestion d'erreurs et retry
 */
class HttpClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;

  constructor(baseURL: string, timeout: number = 10000, retries: number = 3) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.retries = retries;
  }

  /**
   * Effectue une requête HTTP avec retry automatique
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code || 'HTTP_ERROR',
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Retry logic
      if (attempt < this.retries && this.shouldRetry(error)) {
        console.warn(`API request failed, retrying (${attempt}/${this.retries})...`);
        await this.delay(1000 * attempt); // Exponential backoff
        return this.request<T>(endpoint, options, attempt + 1);
      }

      // Re-throw as ApiError if it's not already
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  /**
   * Détermine si une erreur doit déclencher un retry
   */
  private shouldRetry(error: any): boolean {
    if (error instanceof ApiError) {
      // Retry sur les erreurs serveur (5xx) mais pas sur les erreurs client (4xx)
      return error.status >= 500 || error.status === 0;
    }
    // Retry sur les erreurs réseau
    return error.name === 'AbortError' || error.name === 'TypeError';
  }

  /**
   * Ajoute un délai (pour le retry)
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instance globale du client HTTP
const httpClient = new HttpClient(API_CONFIG.baseURL, API_CONFIG.timeout, API_CONFIG.retries);

/**
 * Client pour l'API des données de location longue durée
 */
export class RentDataClient {
  /**
   * Récupère les données de location pour une ville et un type de bien
   */
  static async getRentData(
    city: string,
    rooms: string,
    surface?: number
  ): Promise<RentDataResponse> {
    try {
      const params: Record<string, string> = {
        city: city.toLowerCase(),
        rooms: rooms.toLowerCase(),
      };

      if (surface) {
        params.surface = surface.toString();
      }

      const response = await httpClient.get<ApiResponse<RentDataResponse>>('/api/rent-data', params);
      
      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to fetch rent data',
          500,
          response.error?.code || 'RENT_DATA_ERROR'
        );
      }

      return response.data!;
    } catch (error) {
      console.error('Error fetching rent data:', error);
      throw error;
    }
  }

  /**
   * Récupère les données de location pour plusieurs villes
   */
  static async getRentDataBatch(
    requests: Array<{ city: string; rooms: string; surface?: number }>
  ): Promise<RentDataResponse[]> {
    try {
      const promises = requests.map(req => 
        this.getRentData(req.city, req.rooms, req.surface)
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching batch rent data:', error);
      throw error;
    }
  }
}

/**
 * Client pour l'API des données Airbnb
 */
export class AirbnbDataClient {
  /**
   * Récupère les données Airbnb pour une ville et un type de bien
   */
  static async getAirbnbData(
    city: string,
    rooms: string,
    surface: number
  ): Promise<AirbnbDataResponse> {
    try {
      const params = {
        city: city.toLowerCase(),
        rooms: rooms.toLowerCase(),
        surface: surface.toString(),
      };

      const response = await httpClient.get<ApiResponse<AirbnbDataResponse>>('/api/airbnb-data', params);
      
      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to fetch Airbnb data',
          500,
          response.error?.code || 'AIRBNB_DATA_ERROR'
        );
      }

      return response.data!;
    } catch (error) {
      console.error('Error fetching Airbnb data:', error);
      throw error;
    }
  }

  /**
   * Récupère les données Airbnb avec analyse saisonnière
   */
  static async getAirbnbDataWithSeasonality(
    city: string,
    rooms: string,
    surface: number
  ): Promise<AirbnbDataResponse> {
    const data = await this.getAirbnbData(city, rooms, surface);
    
    // Les données saisonnières sont déjà incluses dans la réponse de l'API
    // Ici on pourrait ajouter des calculs supplémentaires si nécessaire
    
    return data;
  }
}

/**
 * Client pour les formulaires de contact
 */
export class ContactClient {
  /**
   * Envoie un formulaire de contact
   */
  static async submitContactForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
        '/api/contact',
        formData
      );

      if (!response.success) {
        throw new ApiError(
          response.error?.message || 'Failed to submit contact form',
          500,
          response.error?.code || 'CONTACT_FORM_ERROR'
        );
      }

      return response.data!;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
}

/**
 * Client pour la génération de PDF
 */
export class PdfClient {
  /**
   * Génère un rapport PDF
   */
  static async generatePdfReport(reportData: {
    simulation: any;
    results: any;
    rentData?: RentDataResponse;
    airbnbData?: AirbnbDataResponse;
  }): Promise<Blob> {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new ApiError(
          `Failed to generate PDF: ${response.statusText}`,
          response.status,
          'PDF_GENERATION_ERROR'
        );
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Télécharge un rapport PDF
   */
  static async downloadPdfReport(
    reportData: any,
    filename: string = 'rapport-investissement.pdf'
  ): Promise<void> {
    try {
      const blob = await this.generatePdfReport(reportData);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
}

/**
 * Client principal qui regroupe tous les autres
 */
export class ApiClient {
  static rent = RentDataClient;
  static airbnb = AirbnbDataClient;
  static contact = ContactClient;
  static pdf = PdfClient;

  /**
   * Teste la connectivité de l'API
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await httpClient.get<{ status: string; timestamp: string }>('/api/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations de version de l'API
   */
  static async getVersion(): Promise<{ version: string; buildDate: string }> {
    try {
      const response = await httpClient.get<{ version: string; buildDate: string }>('/api/version');
      return response;
    } catch (error) {
      console.error('Failed to get version:', error);
      throw error;
    }
  }
}

// Export par défaut
export default ApiClient;