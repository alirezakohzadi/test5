import { getMediaUrl } from '../utils/media';
import {
  DjangoProduct,
  Product,
  DjangoCategory,
  DjangoBrand,
  Brand,
  DjangoArticle,
  Article,
} from '../types';

/**
 * Maps Django REST API Product object to UI Product interface
 */
export function mapDjangoProductToUI(item: DjangoProduct): Product {
  const mainImage = getMediaUrl(item.image_url);
  const gallery = Array.isArray(item.gallery_images) && item.gallery_images.length > 0
    ? item.gallery_images.map((img) => getMediaUrl(img))
    : [mainImage];

  // Parse specifications into standardized array
  let specs: Array<{ label: string; value: string }> = [];
  if (Array.isArray(item.specifications)) {
    specs = item.specifications;
  } else if (item.specifications && typeof item.specifications === 'object') {
    specs = Object.entries(item.specifications).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  }

  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    brand: item.brand?.name || item.brand?.persian_name || '',
    category: item.category?.name || '',
    image: mainImage,
    galleryImages: gallery,
    price: item.price,
    originalPrice: item.original_price,
    discountPercentage: item.discount_percentage,
    rating: item.rating,
    ratingCount: item.rating_count,
    isNew: item.is_new,
    isPopular: item.is_popular,
    isGoldenOffer: item.is_golden_offer,
    badge: item.badge,
    bgGlowColor: item.bg_glow_color,
    description: item.description,
    usageInstructions: item.usage_instructions,
    ingredients: item.ingredients,
    inStock: item.in_stock,
    stockQuantity: item.stock_quantity,
    volumeOrSize: item.volume_or_size,
    features: item.features || item.key_features || [],
    specifications: specs,
    variants: Array.isArray(item.variants)
      ? item.variants.map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          originalPrice: v.original_price,
          discountPercentage: v.discount_percentage,
          inStock: v.in_stock,
          sku: v.sku,
          volumeOrSize: v.volume_or_size,
        }))
      : undefined,
    reviews: Array.isArray(item.reviews)
      ? item.reviews.map((r) => ({
          id: r.id,
          author: r.author,
          rating: r.rating,
          date: r.date || r.created_at || '',
          comment: r.comment,
          verified: r.verified ?? true,
          likes: r.likes ?? 0,
        }))
      : undefined,
    qaItems: Array.isArray(item.qa_items)
      ? item.qa_items.map((q) => ({
          id: q.id,
          question: q.question,
          author: q.author,
          date: q.date || q.created_at || '',
          answer: q.answer,
          pharmacistName: q.pharmacist_name,
        }))
      : undefined,
    ircCode: item.irc_code,
    lotNumber: item.lot_number,
    pharmacistNote: item.pharmacist_note,
    clubPoints: item.club_points,
    viewersCount: item.viewers_count,
    recentOrdersCount: item.recent_orders_count,
    routineProducts: Array.isArray(item.routine_products)
      ? item.routine_products.map(mapDjangoProductToUI)
      : undefined,
    sku: item.sku,
    barcode: item.barcode,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
    metaKeywords: item.meta_keywords,
    schemaJson: item.schema_json,
  };
}

/**
 * Maps Django REST API Brand object to UI Brand interface
 */
export function mapDjangoBrandToUI(item: DjangoBrand): Brand {
  return {
    id: String(item.id),
    name: item.name,
    persianName: item.persian_name || item.name,
    logo: getMediaUrl(item.logo_url),
    description: item.description,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
  };
}

/**
 * Maps Django REST API Article object to UI Article interface
 */
export function mapDjangoArticleToUI(item: DjangoArticle): Article {
  return {
    id: String(item.id),
    title: item.title,
    summary: item.summary,
    content: item.content,
    image: getMediaUrl(item.image_url),
    category: item.category_name,
    date: item.published_at,
    readTime: item.read_time,
    authorName: item.author?.name,
    authorRole: item.author?.role,
    authorAvatar: getMediaUrl(item.author?.avatar_url),
    slug: item.slug,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    ogImage: getMediaUrl(item.og_image),
    datePublished: item.published_at,
    dateModified: item.updated_at,
    metaKeywords: item.meta_keywords,
    schemaJson: item.schema_json,
  };
}

/**
 * Maps Django REST API Category object recursively
 */
export function mapDjangoCategoryToUI(cat: DjangoCategory): DjangoCategory {
  return {
    ...cat,
    image: getMediaUrl(cat.image),
    icon: getMediaUrl(cat.icon),
    og_image: getMediaUrl(cat.og_image),
    children: cat.children ? cat.children.map(mapDjangoCategoryToUI) : [],
  };
}
