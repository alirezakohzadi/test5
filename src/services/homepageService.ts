import { apiClient } from './apiClient';
import {
  DjangoQuickAccessItem,
  DjangoProductGroup,
  DjangoProductSection,
  DjangoProduct,
} from '../types';
import { getMediaUrl } from '../utils/media';
import { mapDjangoProductToUI } from './dataMappers';

const DEFAULT_QUICK_ACCESS_ITEMS: DjangoQuickAccessItem[] = [
  { id: 1, title: 'دارو اکسپرس', icon: 'local_shipping', link_url: '/express' },
  { id: 2, title: 'پرداخت اقساطی', icon: 'credit_card', link_url: '/installments' },
  { id: 3, title: 'مکمل رژیمی غذایی', icon: 'medication', link_url: '/supplements' },
  { id: 4, title: 'مکمل بدنسازی', icon: 'fitness_center', link_url: '/fitness' },
  { id: 5, title: 'محصولات بانوان', icon: 'spa', link_url: '/women' },
  { id: 6, title: 'ضدآفتاب', icon: 'light_mode', link_url: '/sunscreen' },
  { id: 7, title: 'ضد لک', icon: 'face_retouching_natural', link_url: '/anti-spot' },
];

export const homepageService = {
  /**
   * Fetch quick access items from Django API GET /api/v1/homepage/quick-access/
   * Fully decoupled from Categories and Banners.
   */
  async getQuickAccessItems(): Promise<DjangoQuickAccessItem[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/quick-access/');
      if (Array.isArray(response) && response.length > 0) {
        return response.map((item, idx) => {
          const rawIcon = item.icon || '';
          const isIconPath = rawIcon.includes('/') || rawIcon.includes('http') || rawIcon.includes('.');
          return {
            id: item.id || idx,
            title: item.title || item.name || '',
            subtitle: item.subtitle || '',
            icon: isIconPath ? getMediaUrl(rawIcon) : rawIcon || undefined,
            image_url: item.image_url || item.image ? getMediaUrl(item.image_url || item.image) : undefined,
            link_url: item.link_url || item.link || item.url || '',
            order: item.order ?? idx,
            is_active: item.is_active ?? true,
            badge: item.badge || item.badge_text || '',
          };
        });
      }
    } catch {
      // Endpoint pending or unavailable on backend
    }
    return DEFAULT_QUICK_ACCESS_ITEMS;
  },

  /**
   * Fetch product groups from Django API GET /api/v1/homepage/product-groups/
   * Fully decoupled from Category List.
   */
  async getProductGroups(): Promise<DjangoProductGroup[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/product-groups/');
      if (Array.isArray(response)) {
        return response.map((grp, idx) => ({
          id: grp.id || idx,
          title: grp.title || grp.name || '',
          slug: grp.slug || '',
          description: grp.description || grp.subtitle || '',
          image_url: grp.image_url || grp.image || grp.icon ? getMediaUrl(grp.image_url || grp.image || grp.icon) : undefined,
          order: grp.order ?? idx,
          is_active: grp.is_active ?? true,
          products: Array.isArray(grp.products)
            ? grp.products.map(mapDjangoProductToUI)
            : [],
        }));
      }
    } catch {
      // Endpoint pending or unavailable on backend
    }
    return [];
  },

  /**
   * Fetch custom dynamic product sections from Django API GET /api/v1/homepage/product-sections/
   */
  async getProductSections(): Promise<DjangoProductSection[]> {
    try {
      const response = await apiClient.get<any[]>('/homepage/product-sections/');
      if (Array.isArray(response)) {
        return response.map((sec, idx) => ({
          id: sec.id || idx,
          title: sec.title || '',
          slug: sec.slug || sec.type || sec.section_type || '',
          subtitle: sec.subtitle || '',
          type: sec.type || sec.section_type || 'featured',
          badge: sec.badge || sec.badge_text || '',
          display_type: sec.display_type || 'carousel',
          order: sec.order ?? idx,
          is_active: sec.is_active ?? true,
          max_products: sec.max_products || sec.limit || 8,
          products: Array.isArray(sec.products)
            ? sec.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
            : [],
        }));
      }
    } catch {
      // Endpoint pending or unavailable on backend
    }
    return [];
  },

  /**
   * Fetch specific product section configuration and products from GET /api/v1/homepage/product-sections/?type={sectionType}
   * Frontend displays backend-selected products directly without client-side filtering.
   */
  async getSectionConfig(sectionType: string): Promise<DjangoProductSection | null> {
    try {
      const response = await apiClient.get<any>('/homepage/product-sections/', { type: sectionType, slug: sectionType });
      if (Array.isArray(response) && response.length > 0) {
        const found = response.find(
          (s) => s.slug === sectionType || s.type === sectionType || s.section_type === sectionType
        ) || response[0];

        if (found) {
          return {
            id: found.id || 1,
            title: found.title || '',
            slug: found.slug || sectionType,
            subtitle: found.subtitle || '',
            type: found.type || found.section_type || sectionType,
            badge: found.badge || found.badge_text || '',
            display_type: found.display_type || 'carousel',
            order: found.order ?? 0,
            is_active: found.is_active ?? true,
            max_products: found.max_products || found.limit || 8,
            products: Array.isArray(found.products)
              ? found.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
              : [],
          };
        }
      } else if (response && typeof response === 'object' && !Array.isArray(response) && response.title) {
        return {
          id: response.id || 1,
          title: response.title || '',
          slug: response.slug || sectionType,
          subtitle: response.subtitle || '',
          type: response.type || response.section_type || sectionType,
          badge: response.badge || response.badge_text || '',
          display_type: response.display_type || 'carousel',
          order: response.order ?? 0,
          is_active: response.is_active ?? true,
          max_products: response.max_products || response.limit || 8,
          products: Array.isArray(response.products)
            ? response.products.map((p: DjangoProduct) => mapDjangoProductToUI(p))
            : [],
        };
      }
    } catch {
      // Backend section API unavailable
    }

    // Return empty section structure when backend endpoint is not yet present
    return {
      id: sectionType,
      title: '',
      slug: sectionType,
      type: sectionType,
      is_active: true,
      max_products: 8,
      products: [],
    };
  },
};
