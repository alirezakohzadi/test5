import { apiClient } from './apiClient';
import { SEOData } from '../types';
import { fetchDynamicSitemapXML } from './sitemapService';

export const seoService = {
  /**
   * Fetch custom SEO Meta configuration from Django Backend if configured via CMS
   */
  async getSEOPageMeta(pagePath: string): Promise<Partial<SEOData> | null> {
    try {
      return await apiClient.get<Partial<SEOData>>('/seo/meta/', { path: pagePath });
    } catch {
      return null;
    }
  },

  /**
   * Retrieve XML sitemap content directly from backend Endpoint or dynamic fallback generator
   */
  getDynamicSitemapXML: fetchDynamicSitemapXML,
};
