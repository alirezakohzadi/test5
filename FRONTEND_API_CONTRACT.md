# 🚀 FRONTEND API CONTRACT & BACKEND INTEGRATION SPECIFICATION

This document outlines the exact API contracts, JSON request/response shapes, data models, and backend expectations required by the React Frontend application. 

A Django REST Framework (DRF) backend developer or AI Agent can implement the API endpoints based strictly on this specification without guessing.

---

## 📌 1. OVERVIEW & BASE CONFIGURATION

- **Base API URL:** `http://127.0.0.1:8000/api/v1` (Overridden in production via `VITE_DJANGO_API_URL`).
- **HTTP Headers:**
  ```http
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer <token>
  ```
- **Token Storage:** Frontend retrieves the token from `localStorage.getItem('nozha_auth_token')` or user profile `localStorage.getItem('nozha_user_profile')`.
- **Media / Image Handling:**
  - All image URLs returned by the API can be either relative (e.g. `/media/banners/hero.webp`) or absolute URLs (e.g. `https://cdn.example.com/banners/hero.webp`).
  - The frontend automatically passes all image URLs through `getMediaUrl()`, prepending the Django base server URL to relative paths.

---

## 📋 2. API INVENTORY

The frontend consumes the following exact endpoints:

| # | Endpoint | Method | Query Parameters | Description |
|---|---|---|---|---|
| 1 | `/api/v1/navbar/` | `GET` | - | Retrieves independent navigation menu items tree |
| 2 | `/api/v1/banners/` | `GET` | `position={position_name}` | Retrieves active banners filtered by layout position |
| 3 | `/api/v1/products/` | `GET` | `page`, `page_size`, `q`, `category`, `brand`, `ordering`, `min_price`, `max_price` | Paginated product catalog |
| 4 | `/api/v1/products/{slug}/` | `GET` | - | Single product detail by slug or ID |
| 5 | `/api/v1/products/{slug}/related/` | `GET` | - | Related products list for a product |
| 6 | `/api/v1/products/featured/` | `GET` | `limit` | Golden offer / spotlight products |
| 7 | `/api/v1/products/new-arrivals/` | `GET` | `limit` | New arrivals list |
| 8 | `/api/v1/products/best-sellers/` | `GET` | `limit` | Best-selling products list |
| 9 | `/api/v1/categories/` | `GET` | - | Full hierarchical category tree |
| 10 | `/api/v1/categories/{slug}/` | `GET` | - | Single category detail |
| 11 | `/api/v1/brands/` | `GET` | - | List of all brands |
| 12 | `/api/v1/brands/{slug}/` | `GET` | - | Single brand detail |
| 13 | `/api/v1/blog/articles/` | `GET` | `category_slug`, `page` | Paginated blog articles list |
| 14 | `/api/v1/blog/articles/{slug_or_id}/` | `GET` | - | Single blog article detail |
| 15 | `/api/v1/homepage/quick-access/` | `GET` | - | Quick access bubble links |
| 16 | `/api/v1/homepage/product-groups/` | `GET` | - | Product groups |
| 17 | `/api/v1/homepage/product-sections/` | `GET` | `type`, `slug` | Dynamic homepage product section configs and products |
| 18 | `/api/v1/search/` | `GET` | `q={query}` | Global search across products |
| 19 | `/api/v1/search/suggestions/` | `GET` | `q={query}` | Search input autocomplete suggestions |
| 20 | `/api/v1/seo/meta/` | `GET` | `path={pagePath}` | Page-specific SEO meta tags override |
| 21 | `/api/sitemap/` | `GET` | - | XML / JSON dynamic sitemap urls |

---

## 🧭 3. NAVBAR API (`navbarService.ts`)

The Navbar is **100% decoupled from Categories** and manages header navigation independently.

### `GET /api/v1/navbar/`

#### Expected Response JSON (`DjangoNavbarItem[]`):
```json
[
  {
    "id": 1,
    "title": "مکمل‌های غذایی",
    "slug": "supplements",
    "url": "/categories/supplements",
    "parent": null,
    "order": 1,
    "is_active": true,
    "icon": "medication",
    "badge_text": "ویژه",
    "children": [
      {
        "id": 11,
        "title": "ویتامین C",
        "slug": "vitamin-c",
        "url": "/categories/vitamin-c",
        "parent": 1,
        "order": 1,
        "is_active": true,
        "icon": null,
        "badge_text": null,
        "children": []
      }
    ]
  }
]
```

---

## 🖼️ 4. BANNER API & COMPONENT POSITIONS (`bannerService.ts`)

### `GET /api/v1/banners/?position={position_name}`

#### Expected Response JSON (`DjangoBanner[]`):
```json
[
  {
    "id": 101,
    "title": "بنر ویژه مکمل‌های ورزشی",
    "image_url": "/media/banners/hero_desktop.webp",
    "mobile_image_url": "/media/banners/hero_mobile.webp",
    "link_url": "supplements",
    "position": "main_slider",
    "order": 1,
    "is_active": true,
    "badge_text": "HOT"
  }
]
```

#### 📊 Banner Positions Contract Table

| Component | Position Query Param | Fallback Position Param | Layout & Expected Banner Count |
|---|---|---|---|
| `HeroSection` (Slider) | `main_slider` | `hero` | Carousel slider (1-5 banners) |
| `HeroSection` (Side) | `main_side` | `sidebar` | 1 static side banner |
| `SupplementBannersRow` | `supplements_row` | - | 1 full-width horizontal banner |
| `NewArrivalsSection` (Top) | `new_arrivals_top` | - | 1 top horizontal banner |
| `NewArrivalsSection` (Poster) | `new_arrivals_vertical` | - | 1 vertical poster banner |
| `NewArrivalsSection` (Bottom) | `new_arrivals_bottom` | - | 1 bottom horizontal banner |
| `PostNewArrivalsBanners` (Full 1) | `new_arrivals_full_1` | - | 1 full-width banner |
| `PostNewArrivalsBanners` (Double) | `new_arrivals_double` | - | 2 banners side-by-side (2 columns) |
| `PostNewArrivalsBanners` (Quad) | `new_arrivals_quad` | - | 4 banners side-by-side (4 columns) |
| `PostNewArrivalsBanners` (Full 2) | `new_arrivals_full_2` | - | 1 full-width banner |
| `SpecializedCareGrid` | `specialized_care` | `specialized` | 3 grid banners (3 columns) |
| `HydrodermSplashBanner` | `splash` | - | 1 panoramic splash banner |
| `BestSellersSection` | `best_sellers_vertical` | `bestsellers_vertical` | 1 vertical poster banner |
| `BottomBannersSection` | `bottom_row` | `bottom` | 4 grid banners (2x2) |
| `PopularProductsTopBanners` (Row 1) | `most_popular_top_row1` | `most_popular_top` | 2 banners side-by-side |
| `PopularProductsTopBanners` (Row 2) | `most_popular_top_row2` | `most_popular_top` | 2 banners side-by-side |
| `PopularProductsBottomBanners` | `most_popular_bottom_quad` | `most_popular_bottom` | 4 banners side-by-side (4 columns) |

---

## 📦 5. PRODUCT API (`productService.ts`)

### `GET /api/v1/products/`
#### Query Params:
- `page` (integer, default `1`)
- `page_size` (integer, default `12`)
- `q` (search string)
- `category` (category slug)
- `brand` (brand slug)
- `ordering` (e.g. `-created_at`, `price`, `-price`, `-rating`, `-sales_count`)

#### Response JSON (`DjangoPaginatedResponse<DjangoProduct>`):
```json
{
  "count": 14200,
  "next": "http://127.0.0.1:8000/api/v1/products/?page=2",
  "previous": null,
  "results": [ ... array of DjangoProduct objects ... ]
}
```

### `GET /api/v1/products/{slug}/`

#### Full `DjangoProduct` Response JSON:
```json
{
  "id": 501,
  "slug": "biomarine-anti-spot-cream",
  "name": "کرم ضد لک و روشن کننده بایومارین",
  "price": 480000,
  "original_price": 550000,
  "discount_percentage": 13,
  "rating": 4.8,
  "rating_count": 124,
  "is_new": true,
  "is_popular": true,
  "is_golden_offer": false,
  "badge": "پیشنهاد ویژه",
  "bg_glow_color": "#0D7366",
  "description": "کرم روشن‌کننده بایومارین حاوی عصاره جلبک‌های دریایی...",
  "usage_instructions": "روزانه دو بار روی پوست تمیز مالیده شود.",
  "ingredients": "عصاره جلبک قهوه‌ای، ویتامین C، هیالورونیک اسید",
  "in_stock": true,
  "stock_quantity": 45,
  "volume_or_size": "50 میلی‌لیتر",
  "image_url": "/media/products/biomarine_cream.jpg",
  "gallery_images": [
    "/media/products/biomarine_cream_1.jpg",
    "/media/products/biomarine_cream_2.jpg"
  ],
  "features": [
    "روشن کننده و ضد لک قوی",
    "مناسب انواع پوست"
  ],
  "specifications": [
    { "label": "حجم", "value": "50ml" },
    { "label": "کشور سازنده", "value": "ایران (تحت لیسانس فرانسه)" }
  ],
  "variants": [
    {
      "id": 1001,
      "name": "حجم 50 میلی‌لیتر",
      "price": 480000,
      "original_price": 550000,
      "discount_percentage": 13,
      "in_stock": true,
      "sku": "BM-CREAM-50",
      "volume_or_size": "50ml"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "author": "مریم احمدی",
      "rating": 5,
      "date": "1402/11/15",
      "comment": "عالی بود، بعد از دو هفته لک‌ها کم‌رنگ شدن.",
      "verified": true,
      "likes": 12
    }
  ],
  "qa_items": [
    {
      "id": 1,
      "question": "آیا برای پوست چرب مناسب است؟",
      "author": "رضا",
      "date": "1402/11/10",
      "answer": "بله، بافت بسیار سبکی دارد و فاقد چربی اضافه است.",
      "pharmacist_name": "دکتر داروساز نوژاشاپ"
    }
  ],
  "irc_code": "1234567890123456",
  "lot_number": "LOT-2026-X9",
  "pharmacist_note": "توصیه می‌شود همراه با ضدآفتاب استفاده شود.",
  "club_points": 25,
  "viewers_count": 310,
  "recent_orders_count": 48,
  "brand": {
    "id": 10,
    "name": "BioMarine",
    "persian_name": "بایومارین",
    "logo_url": "/media/brands/biomarine.png"
  },
  "category": {
    "id": 5,
    "name": "مراقبت پوست",
    "slug": "skin-care"
  },
  "sku": "BM-5001",
  "barcode": "6260000000000",
  "seo_title": "خرید کرم ضد لک بایومارین اصل | نوژاشاپ",
  "seo_description": "خرید با تخفیف ویژه کرم ضد لک بایومارین با ارسال سریع.",
  "canonical_url": "http://nozhashop.com/products/biomarine-anti-spot-cream",
  "og_image": "/media/products/biomarine_cream.jpg",
  "meta_keywords": "ضد لک, بایومارین, روشن کننده",
  "schema_json": null
}
```

---

## 🏷️ 6. CATEGORIES API (`categoryService.ts`)

### `GET /api/v1/categories/`

#### Expected Response JSON (`DjangoCategory[]`):
```json
[
  {
    "id": 1,
    "name": "مراقبت پوست",
    "slug": "skin-care",
    "description": "انواع کرم، سرم و پاک‌کننده پوست",
    "icon": "/media/categories/skin_icon.png",
    "image": "/media/categories/skin_bg.jpg",
    "order": 1,
    "parent": null,
    "children": [
      {
        "id": 101,
        "name": "ضدآفتاب",
        "slug": "sunscreen",
        "description": "انواع کرم‌های ضدآفتاب بی‌رنگ و رنگی",
        "icon": null,
        "image": null,
        "order": 1,
        "parent": 1,
        "children": []
      }
    ],
    "seo_title": "خرید محصولات مراقبت پوست | نوژاشاپ",
    "seo_description": "بهترین محصولات مراقبت از پوست اصل با ارسال سریع.",
    "canonical_url": "http://nozhashop.com/categories/skin-care",
    "og_image": "/media/categories/skin_bg.jpg"
  }
]
```

---

## 🏛️ 7. BRANDS API (`brandService.ts`)

### `GET /api/v1/brands/`

#### Expected Response JSON (`DjangoBrand[]`):
```json
[
  {
    "id": 1,
    "name": "Hydroderm",
    "persian_name": "هیدرودرم",
    "logo_url": "/media/brands/hydroderm.png",
    "description": "برند تخصصی مراقبت از پوست و مو",
    "seo_title": "محصولات برند هیدرودرم | نوژاشاپ",
    "seo_description": "خرید اینترنتی محصولات اصل هیدرودرم با تخفیف ویژه.",
    "canonical_url": "http://nozhashop.com/brands/hydroderm",
    "og_image": "/media/brands/hydroderm_og.png"
  }
]
```

---

## 📰 8. BLOG / MAGAZINE API (`blogService.ts`)

### `GET /api/v1/blog/articles/?category_slug={slug}&page={page}`
### `GET /api/v1/blog/articles/{slug_or_id}/`

#### Expected Response JSON (`DjangoArticle`):
```json
{
  "id": 12,
  "slug": "best-skincare-routine-for-winter",
  "title": "بهترین روتین پوستی در فصل زمستان",
  "summary": "راهنمای کامل مراقبت از پوست خشک و حساس در روزهای سرد سال.",
  "content": "<p>پوست انسان در فصل زمستان دچار خشکی شدید می‌شود...</p>",
  "image_url": "/media/blog/winter_skincare.jpg",
  "category_name": "روتین پوستی",
  "published_at": "1402/11/20",
  "updated_at": "1402/11/22",
  "read_time": "5 دقیقه",
  "author": {
    "name": "دکتر مریم شریفی",
    "role": "متخصص پوست و مو",
    "avatar_url": "/media/authors/dr_sharifi.jpg"
  },
  "seo_title": "بهترین روتین پوستی زمستان | مجله نوژاشاپ",
  "seo_description": "راهنمای مراقبت از پوست در زمستان.",
  "canonical_url": "http://nozhashop.com/blog/best-skincare-routine-for-winter",
  "og_image": "/media/blog/winter_skincare.jpg",
  "meta_keywords": "پوست, زمستان, روتین پوستی",
  "schema_json": null
}
```

---

## 🏠 9. DYNAMIC HOMEPAGE CONFIG APIS (`homepageService.ts`)

### `GET /api/v1/homepage/quick-access/`
```json
[
  {
    "id": 1,
    "title": "دارو اکسپرس",
    "subtitle": "تحویل سریع",
    "icon": "local_shipping",
    "image_url": null,
    "link_url": "/express",
    "order": 1,
    "is_active": true,
    "badge": "فوری"
  }
]
```

### `GET /api/v1/homepage/product-groups/`
```json
[
  {
    "id": 1,
    "title": "گروه مکمل‌های ورزشی",
    "slug": "sports-supplements",
    "description": "پروتئین وی، کراتین و آمینو",
    "image_url": "/media/groups/sports.jpg",
    "order": 1,
    "is_active": true,
    "products": [ ... Array of DjangoProduct objects ... ]
  }
]
```

### `GET /api/v1/homepage/product-sections/?type={section_type}`
Valid section types: `featured`, `new_arrivals`, `best_sellers`, `most_popular`, `golden_offers`.

```json
{
  "id": 1,
  "title": "جدیدترین محصولات نوژاشاپ",
  "slug": "new_arrivals",
  "subtitle": "تازه رسیده‌های انبار",
  "type": "new_arrivals",
  "badge": "جدید",
  "display_type": "carousel",
  "order": 1,
  "is_active": true,
  "max_products": 8,
  "products": [ ... Array of DjangoProduct objects ... ]
}
```

---

## 🔍 10. SEARCH API (`searchService.ts`)

### `GET /api/v1/search/?q={query}`
```json
{
  "products": [ ... Array of DjangoProduct objects ... ],
  "total_results": 14
}
```

### `GET /api/v1/search/suggestions/?q={query}`
```json
{
  "suggestions": [
    "مکمل کراتین",
    "کرم ضدآفتاب سان سِیف",
    "سرم ویتامین سی"
  ]
}
```

---

## 🔄 11. DATA MAPPER REFERENCE (`dataMappers.ts`)

The frontend transforms Django snake_case responses to UI camelCase models via `dataMappers.ts`:

| Django DRF Backend Field | Frontend UI Component Field | Notes |
|---|---|---|
| `id` | `id` | Converted to string in UI |
| `name` | `name` | Product title |
| `image_url` | `image` | Processed via `getMediaUrl()` |
| `gallery_images` | `galleryImages` | Processed via `getMediaUrl()` |
| `price` | `price` | Integer Toman |
| `original_price` | `originalPrice` | Integer Toman |
| `discount_percentage` | `discountPercentage` | Integer |
| `is_new` | `isNew` | Boolean |
| `is_popular` | `isPopular` | Boolean |
| `is_golden_offer` | `isGoldenOffer` | Boolean |
| `in_stock` | `inStock` | Boolean |
| `stock_quantity` | `stockQuantity` | Integer |
| `usage_instructions` | `usageInstructions` | String |
| `ingredients` | `ingredients` | String |
| `specifications` | `specifications` | Standardized `[{label, value}]` |
| `key_features` / `features` | `features` | String Array |
| `irc_code` | `ircCode` | String |
| `lot_number` | `lotNumber` | String |
| `pharmacist_note` | `pharmacistNote` | String |
| `club_points` | `clubPoints` | Integer |
| `seo_title` | `seoTitle` | String |
| `seo_description` | `seoDescription` | String |
| `canonical_url` | `canonicalUrl` | String |
| `og_image` | `ogImage` | String URL |

---

## 🛠️ 12. BACKEND IMPLEMENTATION NOTES FOR DJANGO AGENT

1. **Recommended Django Apps:**
   - `navbar`: Manages `NavbarItem` model and `/api/v1/navbar/` API.
   - `banners`: Manages `Banner` model with position choices and `/api/v1/banners/` API.
   - `products`: Manages `Product`, `ProductVariant`, `ProductSpecification`, `Review`, `QuestionAnswer` models.
   - `categories`: Manages `Category` hierarchical tree model.
   - `brands`: Manages `Brand` model.
   - `blog`: Manages `Article` and `Author` models.
   - `homepage`: Manages `QuickAccessItem`, `ProductGroup`, and `ProductSection` configuration.
   - `search`: Handles query filtering across products.

2. **Database Relationships:**
   - `NavbarItem`: Self-referencing `ForeignKey('self', null=True, blank=True, related_name='children')`.
   - `Category`: Self-referencing `ForeignKey('self', null=True, blank=True, related_name='children')`.
   - `Product`: `ForeignKey` to `Brand` and `Category`.
   - `ProductVariant`: `ForeignKey` to `Product` (`related_name='variants'`).
   - `Review`: `ForeignKey` to `Product` (`related_name='reviews'`).
   - `QuestionAnswer`: `ForeignKey` to `Product` (`related_name='qa_items'`).

3. **CORS Headers:**
   Ensure `django-cors-headers` is configured in `settings.py` to allow requests from the Vite frontend domain/port.

4. **Public vs Auth Permissions:**
   - All `GET` endpoints listed in this specification are **public read-only** (`AllowAny`).
