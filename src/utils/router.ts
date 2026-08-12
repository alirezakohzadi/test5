import { Product } from '../types';

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  'skin-care': 'مراقبت پوست',
  'sunscreen': 'ضد آفتاب',
  'hair-care': 'مراقبت مو',
  'anti-spot': 'ضد لک',
  'moisturizers': 'آبرسانی و مرطوب‌کننده',
  'cleansers': 'پاک‌کننده و شوینده صورت',
  'anti-aging': 'ضد چروک و جوانساز',
  'shampoo': 'شامپو تخصصی',
  'hair-treatment': 'سرم، ماسک و روغن مو',
  'supplements': 'مکمل‌های دارویی',
  'dietary': 'مکمل رژیمی غذایی',
  'bodybuilding': 'مکمل بدنسازی',
  'women': 'محصولات بانوان',
  'child-care': 'مراقبت از کودک',
  'body-care': 'مراقبت از بدن',
  'deodorant': 'دئودورانت',
  'express': 'دارو اکسپرس',
  'installment': 'پرداخت اقساطی',
  'facedoux': 'فیس دوکس',
  'ardene-sebuma': 'آردن سبوما',
  'prime-matex': 'پرایم ماتکس',
  'sebycta-skin-hydra': 'سبیکتا هیدرا',
  'hydroderm-body-splash': 'هیدرودرم بادی اسپلش',
  'hydroderm-splash': 'هیدرودرم',
  'sunsafe-maquisun': 'سان سیف',
  'hydroderm-essence': 'هیدرودرم',
  'vitaplex-hairloss': 'ویتاپلکس',
  'best-sellers': 'پرفروش‌ترین‌ها',
  'new-arrivals': 'جدیدترین‌ها',
  'cosmetics-and-beauty': 'آرایشی و بهداشتی',
};

export function getProductSlug(product: Product): string {
  if (product.slug) return product.slug;
  const map: Record<string, string> = {
    'hl-1': 'derma-clear-anti-spot-cream',
    'hl-2': 'uria-sunscreen-spf50',
    'hl-3': 'aura-multivitamin-capsules',
    'hl-4': 'vitalia-hyaluronic-serum',
    'vp-1': 'vitaplex-hair-tonic',
    'vp-2': 'vitaplex-hair-mask',
    'vp-3': 'vitaplex-hair-shampoo',
    'vp-4': 'vitaplex-cleansing-foam',
    'vp-5': 'dermacare-vitamin-c-serum',
    'vp-6': 'hydroderm-deodorant-stick',
    'vp-7': 'biomarine-sunscreen-spf50',
    'vp-8': 'vitallife-multivitamin-daily',
    'vp-9': 'pureskin-body-lotion',
    'vp-10': 'dermacare-baby-cream',
    'arr-1': 'sebuma-cleansing-gel',
    'arr-2': 'prime-matex-anti-wrinkle-cream',
    'arr-3': 'fulica-keratin-shampoo',
    'arr-4': 'hydroderm-body-splash',
    'bs-1': 'biomarine-collagen-serum',
    'bs-2': 'l-carnitine-1000',
    'bs-3': 'magnesium-b6-capsules',
    'bs-4': 'memory-booster-supplement',
    'pop-1': 'sunsafe-tinted-sunscreen',
    'pop-2': 'hydroderm-essence-bodymist',
    'pop-3': 'vitaplex-keratin-hair-mask',
    'pop-4': 'sebycta-hydra-moisturizer',
  };
  return map[product.id] || product.id;
}

export function findProductBySlug(slug: string, products: Product[]): Product | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  return products.find((p) => {
    const pSlug = getProductSlug(p).toLowerCase();
    const pId = p.id.toLowerCase();
    const pName = p.name.toLowerCase();
    const slugifiedName = pName.replace(/\s+/g, '-');
    return (
      pSlug === decoded ||
      pId === decoded ||
      slugifiedName === decoded ||
      pName === decoded
    );
  });
}

export function getCategorySlug(categoryName: string): string {
  if (!categoryName) return 'all';
  const norm = categoryName.trim();
  for (const [slug, name] of Object.entries(CATEGORY_SLUG_MAP)) {
    if (name === norm || norm.includes(name)) {
      return slug;
    }
  }
  return encodeURIComponent(norm.replace(/\s+/g, '-').toLowerCase());
}

export function getCategoryNameFromSlug(slug: string): string {
  if (!slug) return '';
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  if (CATEGORY_SLUG_MAP[decoded]) {
    return CATEGORY_SLUG_MAP[decoded];
  }
  return decoded.replace(/-/g, ' ');
}

export function navigateTo(path: string) {
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
