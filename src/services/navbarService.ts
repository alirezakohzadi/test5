import { apiClient } from './apiClient';
import { DjangoNavbarItem } from '../types';
import { getMediaUrl } from '../utils/media';

export const navbarService = {
  /**
   * Fetch independent Navbar items from Django CMS API
   * Endpoint: GET /api/v1/navbar/
   */
  async getNavbarItems(): Promise<DjangoNavbarItem[]> {
    try {
      const response = await apiClient.get<DjangoNavbarItem[]>('/navbar/');
      if (Array.isArray(response)) {
        return response
          .filter((item) => item.is_active !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => ({
            ...item,
            icon: item.icon ? getMediaUrl(item.icon) : undefined,
            image_url: item.image_url ? getMediaUrl(item.image_url) : undefined,
            children: Array.isArray(item.children)
              ? item.children
                  .filter((child) => child.is_active !== false)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((child) => ({
                    ...child,
                    icon: child.icon ? getMediaUrl(child.icon) : undefined,
                    image_url: child.image_url ? getMediaUrl(child.image_url) : undefined,
                  }))
              : undefined,
          }));
      }
    } catch {
      // API endpoint pending or unavailable on backend
    }
    return [];
  },
};
