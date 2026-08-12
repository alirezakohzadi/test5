import { SITE_DOMAIN } from '../utils/seo';
import { Product, Article, DjangoCategory } from '../types';

/**
 * Interface for Django Backend Sitemap Endpoint Response
 */
export interface DjangoSitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: { loc: string; title?: string }[];
}

export interface DjangoSitemapResponse {
  urls: DjangoSitemapUrl[];
}

/**
 * Fetches dynamic sitemap from Django API backend (/api/sitemap/)
 * Fallbacks to generating XML from current product, article, and category lists if backend endpoint is unavailable.
 */
export async function fetchDynamicSitemapXML(
  products: Product[] = [],
  categories: DjangoCategory[] = [],
  articles: Article[] = []
): Promise<string> {
  try {
    const res = await fetch('/api/sitemap/');
    if (res.ok) {
      const data: DjangoSitemapResponse = await res.json();
      return buildXMLFromSitemapUrls(data.urls);
    }
  } catch {
    // API endpoint not connected yet; fall through to client-side builder
  }

  return generateSitemapXMLFromData(products, categories, articles);
}

/**
 * Builds standard Sitemap XML from a list of sitemap URLs
 */
export function buildXMLFromSitemapUrls(urls: DjangoSitemapUrl[]): string {
  const urlNodes = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : '<changefreq>weekly</changefreq>'}
    ${u.priority !== undefined ? `<priority>${u.priority.toFixed(1)}</priority>` : '<priority>0.7</priority>'}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

/**
 * Dynamic builder that turns arrays of Products, Categories, and Articles into Sitemap XML
 */
export function generateSitemapXMLFromData(
  products: Product[],
  categories: DjangoCategory[],
  articles: Article[]
): string {
  const today = new Date().toISOString().split('T')[0];

  const urls: DjangoSitemapUrl[] = [
    { loc: `${SITE_DOMAIN}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${SITE_DOMAIN}/shop`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${SITE_DOMAIN}/magazine`, lastmod: today, changefreq: 'daily', priority: 0.8 },
  ];

  // Dynamic Categories
  categories.forEach((cat) => {
    urls.push({
      loc: `${SITE_DOMAIN}/categories/${cat.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Dynamic Products
  products.forEach((prod) => {
    const slug = prod.slug || prod.id;
    urls.push({
      loc: `${SITE_DOMAIN}/products/${slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7,
      images: prod.image ? [{ loc: prod.image.startsWith('http') ? prod.image : `${SITE_DOMAIN}${prod.image}`, title: prod.name }] : [],
    });
  });

  // Dynamic Articles
  articles.forEach((art) => {
    const slug = art.slug || art.id;
    urls.push({
      loc: `${SITE_DOMAIN}/blog/${slug}`,
      lastmod: art.datePublished || today,
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  return buildXMLFromSitemapUrls(urls);
}
