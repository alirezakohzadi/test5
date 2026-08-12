/**
 * Central API Client for Django REST Framework Backend
 */

const getApiBaseUrl = (): string => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_DJANGO_API_URL
    : undefined;
  
  if (envUrl && envUrl.trim().length > 0) {
    const clean = envUrl.trim();
    return clean.endsWith('/') ? clean.slice(0, -1) : clean;
  }

  return 'http://127.0.0.1:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string;
}

/**
 * Builds full URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If cleanEndpoint starts with /v1/ and API_BASE_URL already ends with /v1, strip duplicate /v1
  if (cleanEndpoint.startsWith('/v1/') && API_BASE_URL.endsWith('/v1')) {
    cleanEndpoint = cleanEndpoint.substring(3);
  }

  const url = `${API_BASE_URL}${cleanEndpoint}`;

  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Generic Fetch Wrapper for Django REST API
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, token, headers: customHeaders, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // Attach auth token if provided or stored in localStorage
  const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('nozha_auth_token') : null;
  const authToken = token || storedToken;
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.detail || errorData.message || `API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network error occurred', 0);
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};
