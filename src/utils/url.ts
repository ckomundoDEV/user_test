import type { PageSize } from '@/types/user';

/**
 * Build query string from filter parameters
 */
export const buildQueryString = (params: {
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: PageSize;
}): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  return searchParams.toString();
};

/**
 * Parse query string to filter parameters
 */
export const parseQueryString = (queryString: string) => {
  const params = new URLSearchParams(queryString);
  
  return {
    q: params.get('q') || undefined,
    sort: params.get('sort') || undefined,
    page: params.get('page') ? parseInt(params.get('page')!) : undefined,
    pageSize: params.get('pageSize') ? parseInt(params.get('pageSize')!) as PageSize : undefined,
  };
};

/**
 * Get full API URL
 */
export const getApiUrl = (endpoint: string, baseUrl = '/api'): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
