import { apiClient } from './apiClient';
import { DjangoBanner } from '../types';
import { getMediaUrl } from '../utils/media';

const bannerCache: Record<string, { promise: Promise<DjangoBanner[]>; timestamp: number }> = {};
const CACHE_TTL_MS = 10000; // 10s cache to avoid duplicate requests during render while allowing fast Django updates

export const bannerService = {
  /**
   * Fetch banners for a specific position or all active promotional banners
   */
  async getBanners(position?: DjangoBanner['position']): Promise<DjangoBanner[]> {
    const key = position || 'all';
    const now = Date.now();

    if (bannerCache[key] && now - bannerCache[key].timestamp < CACHE_TTL_MS) {
      return bannerCache[key].promise;
    }

    const params = position ? { position } : undefined;

    const fetchPromise = (async () => {
      const response = await apiClient.get<DjangoBanner[]>('/banners/', params);
      const banners = (response || []).map((b) => ({
        ...b,
        image_url: getMediaUrl(b.image_url),
        mobile_image_url: b.mobile_image_url ? getMediaUrl(b.mobile_image_url) : undefined,
      }));
      return banners
        .filter((b) => b.is_active !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    })();

    bannerCache[key] = { promise: fetchPromise, timestamp: now };

    try {
      return await fetchPromise;
    } catch (err) {
      delete bannerCache[key];
      throw err;
    }
  },

  /**
   * Invalidate banner cache
   */
  clearCache() {
    Object.keys(bannerCache).forEach((k) => delete bannerCache[k]);
  },
};

