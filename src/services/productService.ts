import { apiClient } from './apiClient';
import {
  Product,
  DjangoProduct,
  DjangoPaginatedResponse,
  ProductFilterParams,
} from '../types';
import { mapDjangoProductToUI } from './dataMappers';

export const productService = {
  /**
   * Fetch paginated products list with filtering, searching, and sorting from Django REST API
   * Designed for 14,000+ catalog items with server-side pagination
   */
  async getProducts(params?: ProductFilterParams): Promise<DjangoPaginatedResponse<Product>> {
    const response = await apiClient.get<DjangoPaginatedResponse<DjangoProduct>>('/products/', params);
    return {
      ...response,
      results: (response.results || []).map(mapDjangoProductToUI),
    };
  },

  /**
   * Fetch single product details by slug or ID
   */
  async getProductBySlug(slugOrId: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<DjangoProduct>(`/products/${slugOrId}/`);
      return mapDjangoProductToUI(response);
    } catch (err: any) {
      if (err?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Fetch related products for a product
   */
  async getRelatedProducts(slugOrId: string): Promise<Product[]> {
    const response = await apiClient.get<DjangoProduct[]>(`/products/${slugOrId}/related/`);
    return (response || []).map(mapDjangoProductToUI);
  },

  /**
   * Fetch highlight / golden offer products with optional limit
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const params = limit ? { limit, page_size: limit, max_products: limit } : undefined;
    const response = await apiClient.get<DjangoProduct[]>('/products/featured/', params);
    return (response || []).map(mapDjangoProductToUI);
  },

  /**
   * Fetch new arrivals with optional limit
   */
  async getNewArrivals(limit?: number): Promise<Product[]> {
    const params = limit ? { limit, page_size: limit, max_products: limit } : undefined;
    const response = await apiClient.get<DjangoProduct[]>('/products/new-arrivals/', params);
    return (response || []).map(mapDjangoProductToUI);
  },

  /**
   * Fetch best seller / popular products with optional limit
   */
  async getBestSellers(limit?: number): Promise<Product[]> {
    const params = limit ? { limit, page_size: limit, max_products: limit } : undefined;
    const response = await apiClient.get<DjangoProduct[]>('/products/best-sellers/', params);
    return (response || []).map(mapDjangoProductToUI);
  },
};
