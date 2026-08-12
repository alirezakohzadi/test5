import { DjangoCategory, DjangoCategoryListResponse } from '../types';
import { apiClient } from './apiClient';
import { mapDjangoCategoryToUI } from './dataMappers';

const CATEGORY_CACHE_KEY = 'nozha_categories_cache_v1';
const CATEGORY_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface CacheEnvelope {
  timestamp: number;
  data: DjangoCategory[];
}

let inMemoryCache: CacheEnvelope | null = null;

/**
 * Normalizes raw response from Django REST Framework endpoint.
 */
function normalizeDjangoResponse(data: unknown): DjangoCategory[] {
  let list: DjangoCategory[] = [];
  if (Array.isArray(data)) {
    list = data as DjangoCategory[];
  } else if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as DjangoCategoryListResponse).results)) {
    list = (data as DjangoCategoryListResponse).results || [];
  }
  return list.map(mapDjangoCategoryToUI);
}

/**
 * Fetches category tree from Django REST API
 */
export async function fetchCategoriesFromApi(): Promise<DjangoCategory[]> {
  const now = Date.now();

  // 1. Check in-memory cache first
  if (inMemoryCache && now - inMemoryCache.timestamp < CATEGORY_CACHE_TTL) {
    return inMemoryCache.data;
  }

  // 2. Check localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CATEGORY_CACHE_KEY);
      if (stored) {
        const envelope: CacheEnvelope = JSON.parse(stored);
        if (now - envelope.timestamp < CATEGORY_CACHE_TTL && Array.isArray(envelope.data) && envelope.data.length > 0) {
          inMemoryCache = envelope;
          return envelope.data;
        }
      }
    } catch {
      // Ignore
    }
  }

  // 3. Request API
  const rawJson = await apiClient.get<unknown>('/categories/');
  const categories = normalizeDjangoResponse(rawJson);

  if (categories.length > 0) {
    const envelope: CacheEnvelope = { timestamp: now, data: categories };
    inMemoryCache = envelope;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(envelope));
      } catch {
        // Ignore storage errors
      }
    }
    return categories;
  }

  return [];
}

/**
 * Gets cached categories synchronously if available
 */
export function getCachedCategoriesSync(): DjangoCategory[] | null {
  if (inMemoryCache) {
    return inMemoryCache.data;
  }
  return null;
}

/**
 * Clears category cache
 */
export function clearCategoryCache(): void {
  inMemoryCache = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CATEGORY_CACHE_KEY);
    } catch {
      // Ignore
    }
  }
}

/**
 * Synchronous flat search in categories tree
 */
export function searchCategories(categories: DjangoCategory[], query: string): DjangoCategory[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: DjangoCategory[] = [];

  function traverse(list: DjangoCategory[]) {
    for (const item of list) {
      if (item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))) {
        results.push(item);
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(categories);
  return results;
}

export const categoryService = {
  getCategories: fetchCategoriesFromApi,
  getCategoryBySlug: async (slug: string): Promise<DjangoCategory | null> => {
    try {
      const raw = await apiClient.get<DjangoCategory>(`/categories/${slug}/`);
      return mapDjangoCategoryToUI(raw);
    } catch (err: any) {
      if (err?.status === 404) {
        return null;
      }
      throw err;
    }
  },
  searchCategories,
  clearCache: clearCategoryCache,
};
