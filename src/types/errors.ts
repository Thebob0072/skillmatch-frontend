import axios, { AxiosError } from 'axios';

/**
 * Proper error handling type for API calls
 * Safely extracts error information without using 'any'
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Handle API errors safely with proper typing
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Axios error with response
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = (data as Record<string, unknown>).message;
        return typeof message === 'string' ? message : 'Unknown error';
      }
      if (typeof data === 'string') {
        return data;
      }
    }
    // Axios error without response
    return error.message || 'Network error occurred';
  }

  // Non-axios errors
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error
  return 'An unexpected error occurred';
}

/**
 * Extract full API error information
 */
export function getApiError(error: unknown): ApiErrorResponse {
  const message = getApiErrorMessage(error);
  let status: number | undefined;
  let code: string | undefined;

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, unknown>;
      code = typeof data.code === 'string' ? data.code : undefined;
    }
  }

  return {
    message,
    code,
    status,
  };
}

/**
 * Type guard for development logging
 */
export function shouldLogError(isDevelopment: boolean = process.env.NODE_ENV === 'development'): boolean {
  return isDevelopment;
}

/**
 * Safe error message extraction from unknown error
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, unknown>;
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
      if ('error' in data && typeof data.error === 'string') {
        return data.error;
      }
    }
    return error.message || 'Network error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
