import axios from 'axios';

// API Health Check Service
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    postgres: string;
    redis: string;
    db_pool: string;
  };
  version: string;
}

// Check if API is available
export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await axios.get<HealthStatus>('/health', {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    throw new Error('API is not available');
  }
};

// Check if API is ready to serve requests
export const checkReadiness = async (): Promise<{ status: string }> => {
  try {
    const response = await axios.get('/health/ready', {
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    throw new Error('API is not ready');
  }
};

// Check if API is alive
export const checkLiveness = async (): Promise<{ status: string; time: string }> => {
  try {
    const response = await axios.get('/health/live', {
      timeout: 2000,
    });
    return response.data;
  } catch (error) {
    throw new Error('API is not responding');
  }
};

// Retry mechanism for API calls
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        console.log(`Retry attempt ${attempt}/${maxRetries}...`);
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
};

// Network status checker
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

// Add event listeners for network status
export const setupNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
