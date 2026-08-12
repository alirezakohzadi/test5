import { apiClient } from './apiClient';
import { DjangoSearchResponse, Product } from '../types';
import { mapDjangoProductToUI } from './dataMappers';

export const searchService = {
  /**
   * Unified global search across Products, Categories, and Brands
   */
  async globalSearch(query: string): Promise<{
    products: Product[];
    totalResults: number;
  }> {
    if (!query.trim()) {
      return { products: [], totalResults: 0 };
    }

    const response = await apiClient.get<DjangoSearchResponse>('/search/', { q: query });
    return {
      products: (response.products || []).map(mapDjangoProductToUI),
      totalResults: response.total_results || 0,
    };
  },

  /**
   * Live search query autocomplete suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    try {
      const response = await apiClient.get<{ suggestions: string[] }>('/search/suggestions/', { q: query });
      return response.suggestions || [];
    } catch {
      return [];
    }
  },
};
