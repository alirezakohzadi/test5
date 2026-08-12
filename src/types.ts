// ==========================================
// Base & Shared Types
// ==========================================

export interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: T[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string; // e.g. 'index, follow' or 'noindex, nofollow'
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  schemaJson?: Record<string, any> | Record<string, any>[];
  breadcrumbs?: BreadcrumbItem[];
}

// ==========================================
// Category Types
// ==========================================

export interface DjangoCategory {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  is_featured?: boolean;
  badge?: string;
  product_count?: number;
  url?: string;
  parent?: number | string | null;
  children?: DjangoCategory[];
  // Django SEO attributes
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  meta_keywords?: string;
}

export interface DjangoCategoryListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: DjangoCategory[];
}

export interface QuickAccessCategory {
  id: string;
  title: string;
  iconName: string;
  bgColor: string;
  textColor: string;
  imageUrl?: string;
}

export interface GroupedCategoryProduct {
  id: string;
  name: string;
  image: string;
}

export interface ProductGroupCategory {
  id: string;
  title: string;
  products: GroupedCategoryProduct[];
}

// ==========================================
// Brand Types
// ==========================================

export interface Brand {
  id: string;
  name: string;
  logo: string;
  persianName: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface DjangoBrand {
  id: number | string;
  name: string;
  slug: string;
  persian_name?: string;
  logo_url?: string;
  description?: string;
  is_popular?: boolean;
  product_count?: number;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
}

// ==========================================
// Banner Types
// ==========================================

export interface DjangoBanner {
  id: number | string;
  title: string;
  subtitle?: string;
  image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  position: 'hero' | 'quick_access' | 'specialized' | 'splash' | 'row' | 'bottom' | 'sidebar' | 'offers_top' | 'offers_golden' | 'new_arrivals_top' | 'new_arrivals_vertical' | 'new_arrivals_bottom' | 'bestsellers_vertical' | string;
  order: number;
  is_active: boolean;
  badge_text?: string;
  button_text?: string;
}

// ==========================================
// Product Types
// ==========================================

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  inStock?: boolean;
  sku?: string;
  volumeOrSize?: string;
}

export interface ProductReview {
  id: number | string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified?: boolean;
  likes?: number;
}

export interface ProductQA {
  id: number | string;
  question: string;
  author: string;
  date: string;
  answer?: string;
  pharmacistName?: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  galleryImages?: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number;
  ratingCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
  isGoldenOffer?: boolean;
  badge?: string;
  bgGlowColor?: string; // e.g. 'bg-emerald-500/10'
  description?: string;
  usageInstructions?: string;
  ingredients?: string;
  inStock?: boolean;
  stockQuantity?: number;
  volumeOrSize?: string;
  features?: string[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  qaItems?: ProductQA[];
  ircCode?: string;
  lotNumber?: string;
  pharmacistNote?: string;
  clubPoints?: number;
  viewersCount?: number;
  recentOrdersCount?: number;
  routineProducts?: Product[];
  // Django SEO attributes & schema details
  sku?: string;
  barcode?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  metaKeywords?: string;
  schemaJson?: Record<string, any>;
}

export interface DjangoProduct {
  id: number | string;
  slug: string;
  name: string;
  sku: string;
  barcode?: string;
  brand: {
    id: number | string;
    name: string;
    persian_name?: string;
    slug: string;
  };
  category: {
    id: number | string;
    name: string;
    slug: string;
  };
  image_url: string;
  gallery_images?: string[];
  price: number;
  original_price?: number;
  discount_percentage?: number;
  in_stock: boolean;
  stock_quantity: number;
  volume_or_size?: string;
  rating?: number;
  rating_count?: number;
  is_new?: boolean;
  is_popular?: boolean;
  is_golden_offer?: boolean;
  badge?: string;
  description?: string;
  usage_instructions?: string;
  ingredients?: string;
  bg_glow_color?: string;
  features?: string[];
  key_features?: string[];
  specifications?: Array<{ label: string; value: string }> | Record<string, string>;
  variants?: Array<{
    id: number | string;
    name: string;
    price: number;
    original_price?: number;
    discount_percentage?: number;
    in_stock?: boolean;
    sku?: string;
    volume_or_size?: string;
  }>;
  reviews?: Array<{
    id: number | string;
    author: string;
    rating: number;
    date?: string;
    created_at?: string;
    comment: string;
    verified?: boolean;
    likes?: number;
  }>;
  qa_items?: Array<{
    id: number | string;
    question: string;
    author: string;
    date?: string;
    created_at?: string;
    answer?: string;
    pharmacist_name?: string;
  }>;
  irc_code?: string;
  lot_number?: string;
  pharmacist_note?: string;
  club_points?: number;
  viewers_count?: number;
  recent_orders_count?: number;
  routine_products?: DjangoProduct[];
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  meta_keywords?: string;
  schema_json?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilterParams {
  category_slug?: string;
  brand_slug?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_discounted?: boolean;
  is_new?: boolean;
  is_popular?: boolean;
  ordering?: 'price' | '-price' | 'rating' | '-rating' | 'created_at' | '-created_at' | 'popularity';
  page?: number;
  page_size?: number;
}

// ==========================================
// Article / Blog Types
// ==========================================

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content?: string;
  image: string;
  date: string;
  readTime: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  // Django SEO attributes & schema details
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  datePublished?: string;
  dateModified?: string;
  metaKeywords?: string;
  schemaJson?: Record<string, any>;
}

export interface DjangoArticle {
  id: number | string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  category_name: string;
  category_slug: string;
  read_time: string;
  author: {
    name: string;
    role?: string;
    avatar_url?: string;
  };
  published_at: string;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  meta_keywords?: string;
  schema_json?: Record<string, any>;
}

// ==========================================
// Cart, Order & User Types
// ==========================================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DjangoCartItem {
  id: number | string;
  product_id: number | string;
  product: DjangoProduct;
  quantity: number;
  item_total: number;
}

export interface DjangoCart {
  id: number | string;
  items: DjangoCartItem[];
  total_quantity: number;
  total_price: number;
  total_discount: number;
  final_price: number;
}

export interface DjangoUser {
  id: number | string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  is_authenticated: boolean;
  created_at?: string;
}

export interface DjangoOrderItem {
  id: number | string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface DjangoOrder {
  id: number | string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  items: DjangoOrderItem[];
  total_price: number;
  shipping_address?: string;
  created_at: string;
}

// ==========================================
// Search & Utility Types
// ==========================================

export interface DjangoSearchSuggestion {
  text: string;
  type: 'product' | 'brand' | 'category';
  slug?: string;
  image_url?: string;
}

export interface DjangoSearchResponse {
  query: string;
  total_results: number;
  products: DjangoProduct[];
  categories: DjangoCategory[];
  brands: DjangoBrand[];
  suggestions: DjangoSearchSuggestion[];
}

// ==========================================
// Navigation & CMS Types
// ==========================================

export interface DjangoNavbarItem {
  id: number | string;
  title: string;
  slug?: string;
  url?: string;
  link_url?: string;
  parent?: number | string | null;
  order?: number;
  is_active?: boolean;
  icon?: string;
  image_url?: string;
  badge_text?: string;
  children?: DjangoNavbarItem[];
}

export interface DjangoQuickAccessItem {
  id: number | string;
  title: string;
  subtitle?: string;
  icon?: string;
  image_url?: string;
  link_url?: string;
  order?: number;
  is_active?: boolean;
  badge?: string;
}

export interface DjangoProductGroup {
  id: number | string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  products?: Product[];
  order?: number;
  is_active?: boolean;
  slug?: string;
  description?: string;
}

export interface DjangoProductSection {
  id: number | string;
  title: string;
  subtitle?: string;
  type?: 'popular' | 'best_sellers' | 'new_arrivals' | 'featured' | 'offers' | 'highlights' | string;
  products: Product[];
  order?: number;
  is_active?: boolean;
  max_products?: number;
  badge?: string;
  slug?: string;
  display_type?: 'grid' | 'carousel' | 'slider' | 'list';
}

export interface HomepageQuickAccessItem extends DjangoQuickAccessItem {
  image?: string;
  link?: string;
}

export interface HomepageProductGroup extends DjangoProductGroup {
  image?: string;
}

export interface HomepageProductSection extends DjangoProductSection {}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}
