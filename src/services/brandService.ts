import { apiClient } from './apiClient';
import { Brand, DjangoBrand } from '../types';
import { mapDjangoBrandToUI } from './dataMappers';

export const brandService = {
  /**
   * Fetch all brands or popular brands from Django REST API
   */
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<DjangoBrand[]>('/brands/');
    return (response || []).map(mapDjangoBrandToUI);
  },

  /**
   * Fetch single brand detail by slug
   */
  async getBrandBySlug(slug: string): Promise<Brand | null> {
    try {
      const response = await apiClient.get<DjangoBrand>(`/brands/${slug}/`);
      return mapDjangoBrandToUI(response);
    } catch (err: any) {
      if (err?.status === 404) {
        return null;
      }
      throw err;
    }
  },
};
