import { Product, Article, SEOData, BreadcrumbItem } from '../types';

export const SITE_DOMAIN = 'https://nozhashop.com';
export const DEFAULT_SITE_TITLE = 'نوژاشاپ | داروخانه آنلاین و مرجع تخصصی سلامت و زیبایی';
export const DEFAULT_SITE_DESC = 'داروخانه آنلاین نوژاشاپ، خرید اینترنتی انواع مکمل‌های دارویی و رژیمی، محصولات مراقبت از پوست و مو، آرایشی، بهداشتی و تجهیزات پزشکی با ضمانت اصالت کالا.';
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/og-default.jpg`;

/**
 * Normalizes absolute canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanedPath = path.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return `${SITE_DOMAIN}${cleanedPath.startsWith('/') ? cleanedPath : '/' + cleanedPath}`;
}

/**
 * Updates DOM head metadata tags
 */
export function updateSEOHead(seo: SEOData): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = seo.title || DEFAULT_SITE_TITLE;

  // Helper to create or update meta/link tags
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // 2. Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', seo.description || DEFAULT_SITE_DESC);

  // 3. Robots
  setMetaTag('meta[name="robots"]', 'name', 'robots', seo.robots || 'index, follow');

  // 4. Canonical Link
  setLinkTag('canonical', seo.canonicalUrl || SITE_DOMAIN);

  // 5. Open Graph Meta Tags
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'نوژاشاپ - داروخانه آنلاین');
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'fa_IR');
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', seo.ogType || 'website');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.ogTitle || seo.title || DEFAULT_SITE_TITLE);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.ogDescription || seo.description || DEFAULT_SITE_DESC);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.ogImage || DEFAULT_OG_IMAGE);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonicalUrl || SITE_DOMAIN);

  // 6. Twitter Card Meta Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', seo.twitterCard || 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.ogTitle || seo.title || DEFAULT_SITE_TITLE);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.ogDescription || seo.description || DEFAULT_SITE_DESC);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', seo.ogImage || DEFAULT_OG_IMAGE);

  // 7. Inject Schema.org JSON-LD
  let scriptEl = document.getElementById('nozha-json-ld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'nozha-json-ld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const schemas: any[] = [];

  // Always include Organization / Website schema if root or combined
  if (seo.schemaJson) {
    if (Array.isArray(seo.schemaJson)) {
      schemas.push(...seo.schemaJson);
    } else {
      schemas.push(seo.schemaJson);
    }
  }

  // If breadcrumbs exist, generate BreadcrumbList schema
  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(seo.breadcrumbs));
  }

  scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
}

/**
 * Schema.org BreadcrumbList generator
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${SITE_DOMAIN}${item.url.startsWith('/') ? item.url : '/' + item.url}`,
    })),
  };
}

/**
 * Schema.org Organization / Pharmacy generator
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    'name': 'داروخانه آنلاین نوژاشاپ',
    'url': SITE_DOMAIN,
    'logo': `${SITE_DOMAIN}/logo.png`,
    'description': DEFAULT_SITE_DESC,
    'telephone': '+98-21-12345678',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Tehran',
      'addressCountry': 'IR',
    },
    'priceRange': '$$',
  };
}

/**
 * Schema.org Product generator (Dynamic API Ready)
 */
export function generateProductSchema(product: Product, canonicalUrl: string) {
  if (product.schemaJson) {
    return product.schemaJson;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': product.image ? (product.image.startsWith('http') ? [product.image] : [`${SITE_DOMAIN}${product.image}`]) : [],
    'description': product.description || `خرید ${product.name} از برند ${product.brand} با تضمین اصالت کالا و ارسال سریع از داروخانه آنلاین نوژاشاپ.`,
    'sku': product.sku || product.id,
    'mpn': product.id,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'نوژاشاپ',
    },
    'offers': {
      '@type': 'Offer',
      'url': canonicalUrl,
      'priceCurrency': 'IRT', // Toman
      'price': product.price,
      'priceValidUntil': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'داروخانه آنلاین نوژاشاپ',
      },
    },
    ...(product.rating
      ? {
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': product.rating,
            'reviewCount': product.ratingCount || 12,
          },
        }
      : {}),
  };
}

/**
 * Schema.org Article generator (Dynamic API Ready)
 */
export function generateArticleSchema(article: Article, canonicalUrl: string) {
  if (article.schemaJson) {
    return article.schemaJson;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.summary,
    'image': article.image ? (article.image.startsWith('http') ? [article.image] : [`${SITE_DOMAIN}${article.image}`]) : [],
    'datePublished': article.datePublished || '2026-01-01',
    'dateModified': article.dateModified || article.datePublished || '2026-01-01',
    'author': {
      '@type': 'Person',
      'name': article.authorName || 'تیم تحریریه مجله نوژاشاپ',
      'jobTitle': article.authorRole || 'کارشناس سلامت و دارو',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'داروخانه آنلاین نوژاشاپ',
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_DOMAIN}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
}

/**
 * Schema.org CollectionPage / ItemList for Categories & Brands
 */
export function generateCollectionPageSchema(title: string, description: string, canonicalUrl: string, itemCount?: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'numberOfItems': itemCount || 0,
  };
}
