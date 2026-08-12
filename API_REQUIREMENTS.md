# مستندات و الزامات API بک‌اند چنگو (Django REST Framework)
## داروخانه آنلاین و مرجع سلامت نوژاشاپ (NozhaShop API Specification)

این مستند شامل مشخصات کامل، ساختار داده‌ها، پارامترهای درخواست و پاسخ تمام Endpointهای موردنیاز لایه وب React نوژاشاپ برای اتصال به Django REST Framework است.

---

## ۱. تنظیمات عمومی و معماری سیستم (General Setup & High Scale)

### ۱.۱. Base URL
آدرس پایه APIها از طریق متغیر محیطی زیر در لایه فرانت‌اند دریافت می‌شود:
```env
VITE_DJANGO_API_URL=http://localhost:8000/api
```

### ۱.۲. پشتیبانی از کاتالوگ ۱۴٬۰۰۰ محصولی (Scalability & Performance)
با توجه به وجود **۱۴٬۰۰۰ محصول** در دیتابیس:
1. **Server-side Pagination**: تمام لیست‌های محصولات باید به صورت صفحه‌بندی شده (`PageNumberPagination`) تحویل داده شوند. مقدار پیش‌فرض هر صفحه `page_size=12` تا `page_size=36` می‌باشد.
2. **Database Indexing**: فیلدهای `slug`, `brand_id`, `category_id`, `price`, `in_stock`, `created_at`, `rating`, `is_featured` در Django Models باید دارای `db_index=True` یا `Compound Index` باشند.
3. **Full-Text Search (PostgreSQL)**: جستجوی متنی روی عنوان و برند محصول باید از امکانات PostgreSQL Full-Text Search (`SearchVector`, `SearchQuery`, `TrigramSimilarity`) استفاده کند.
4. **Caching Layer (Redis)**: درخت دسته‌بندی‌ها (`/api/v1/categories/`)، برندهای محبوب (`/api/v1/brands/`) و بنرهای تبلیغاتی (`/api/v1/banners/`) باید در سیستم کش Redis ذخیره گردند.

---

## ۲. مشخصات کامل Endpointها (API Endpoints Specifications)

### ۲.۱. محصولات (Products Endpoint)

#### `GET /api/v1/products/`
* **کاربرد**: دریافت لیست محصولات صفحه‌بندی شده همراه با فیلتر، جستجو و مرتب‌سازی.
* **Method**: `GET`
* **Query Parameters**:
  * `page` (number, optional, default: 1): شماره صفحه
  * `page_size` (number, optional, default: 12): تعداد آیتم در هر صفحه
  * `category_slug` (string, optional): فیلتر بر اساس اسلاگ دسته‌بندی
  * `brand_slug` (string, optional): فیلتر بر اساس اسلاگ برند
  * `search` (string, optional): عبارات جستجو در نام، برند یا کد محصول
  * `min_price` (number, optional): حداقل قیمت (تومان)
  * `max_price` (number, optional): حداکثر قیمت (تومان)
  * `in_stock` (boolean, optional): فقط کالاهای موجود
  * `is_discounted` (boolean, optional): فقط کالاهای تخفیف‌دار
  * `ordering` (string, optional): مرتب‌سازی (`price`, `-price`, `rating`, `-rating`, `-created_at`, `popularity`)
* **Response Body Example (200 OK)**:
```json
{
  "count": 14250,
  "next": "http://localhost:8000/api/v1/products/?page=2",
  "previous": null,
  "total_pages": 1188,
  "current_page": 1,
  "page_size": 12,
  "results": [
    {
      "id": 101,
      "slug": "anti-spot-derma-clear-cream",
      "name": "کرم ضد لک و روشن‌کننده درما کلیر",
      "sku": "NZ-DS-101",
      "barcode": "6260123456789",
      "brand": {
        "id": 12,
        "name": "Derma Clear",
        "persian_name": "درما کلیر",
        "slug": "derma-clear"
      },
      "category": {
        "id": 5,
        "name": "مراقبت از پوست",
        "slug": "skin-care"
      },
      "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "gallery_images": [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03"
      ],
      "price": 385000,
      "original_price": 450000,
      "discount_percentage": 14,
      "in_stock": true,
      "stock_quantity": 42,
      "volume_or_size": "۵۰ میلی‌لیتر",
      "rating": 4.8,
      "rating_count": 24,
      "is_new": true,
      "is_popular": true,
      "is_golden_offer": true,
      "badge": "تخفیف ویژه",
      "seo_title": "خرید کرم ضد لک درما کلیر اصل | قیمت داروخانه نوژاشاپ",
      "seo_description": "کرم ضد لک و روشن‌کننده درما کلیر ۵۰ میل با تضمین اصالت کالا و ارسال سریع.",
      "canonical_url": "https://nozhashop.com/products/anti-spot-derma-clear-cream",
      "og_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03"
    }
  ]
}
```

---

#### `GET /api/v1/products/{slug}/`
* **کاربرد**: دریافت جزئیات کامل یک محصول بر اساس اسلاگ یا شناسه.
* **Method**: `GET`
* **Response Body Example (200 OK)**:
```json
{
  "id": 101,
  "slug": "anti-spot-derma-clear-cream",
  "name": "کرم ضد لک و روشن‌کننده درما کلیر",
  "sku": "NZ-DS-101",
  "barcode": "6260123456789",
  "brand": {
    "id": 12,
    "name": "Derma Clear",
    "persian_name": "درما کلیر",
    "slug": "derma-clear"
  },
  "category": {
    "id": 5,
    "name": "مراقبت از پوست",
    "slug": "skin-care"
  },
  "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
  "gallery_images": [],
  "price": 385000,
  "original_price": 450000,
  "discount_percentage": 14,
  "in_stock": true,
  "stock_quantity": 42,
  "volume_or_size": "۵۰ میلی‌لیتر",
  "rating": 4.8,
  "rating_count": 24,
  "description": "توضیحات تخصصی و نحوه مصرف محصول...",
  "usage_instructions": "روزانه ۲ بار روی پوست تمیز استفاده شود.",
  "ingredients": "ویتامین C، هیالورونیک اسید، نیاسینامید",
  "seo_title": "خرید کرم ضد لک درما کلیر اصل | نوژاشاپ",
  "seo_description": "خرید آنلاین کرم ضد لک درما کلیر با ضمانت اصالت فیزیکی.",
  "canonical_url": "https://nozhashop.com/products/anti-spot-derma-clear-cream",
  "schema_json": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "کرم ضد لک درما کلیر",
    "sku": "NZ-DS-101"
  }
}
```

---

#### `GET /api/v1/products/{slug}/related/`
* **کاربرد**: دریافت لیست محصولات مرتبط (بر اساس هم‌دسته‌بندی یا هم‌برند بودن).
* **Method**: `GET`
* **Response Body Example (200 OK)**: آرایه‌ای از محصولات هم‌گروه (مشابه `GET /api/v1/products/`).

---

### ۲.۲. دسته‌بندی‌ها (Categories Endpoint)

#### `GET /api/v1/categories/`
* **کاربرد**: دریافت درخت کامل دسته‌بندی‌ها (Hierarchical Tree) جهت مگامنو و فیلترها.
* **Method**: `GET`
* **Response Body Example (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "مراقبت از پوست",
    "slug": "skin-care",
    "description": "انواع کرم، سرم و لوسیون پوستی",
    "icon": "Sparkles",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    "is_featured": true,
    "product_count": 3420,
    "seo_title": "خرید محصولات مراقبت از پوست | داروخانه نوژاشاپ",
    "seo_description": "لیست قیمت و خرید اینترنتی انواع محصولات مراقبت پوستی اصل.",
    "canonical_url": "https://nozhashop.com/categories/skin-care",
    "children": [
      {
        "id": 11,
        "name": "ضد آفتاب",
        "slug": "sunscreen",
        "parent": 1,
        "product_count": 820,
        "children": []
      }
    ]
  }
]
```

---

### ۲.۳. برندها (Brands Endpoint)

#### `GET /api/v1/brands/`
* **کاربرد**: دریافت لیست برندها (محبوب و عمومی).
* **Method**: `GET`
* **Response Body Example (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Bioderma",
    "persian_name": "بایودرما",
    "slug": "bioderma",
    "logo_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
    "description": "برند تخصصی فرانسوی مراقبت از پوست",
    "is_popular": true,
    "product_count": 140,
    "seo_title": "محصولات برند بایودرما اصل | نوژاشاپ",
    "seo_description": "خرید محصولات اصل بایودرما با تضمین اصالت کالا.",
    "canonical_url": "https://nozhashop.com/brands/bioderma"
  }
]
```

---

### ۲.۴. بنرهای تبلیغاتی (Banners Endpoint)

#### `GET /api/v1/banners/`
* **کاربرد**: دریافت بنرهای اسلایدر اصلی، بنر شناور هیدرودرم، اسلایدر مکمل‌ها و بنرهای انتهای صفحه.
* **Method**: `GET`
* **Query Parameters**:
  * `position` (string, optional): فیلتر موقعیت (`hero`, `splash`, `row`, `bottom`)
* **Response Body Example (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "فیس دوکس | مراقبت خورشیدی",
    "subtitle": "تخفیف ویژه ضدآفتاب‌های تخصصی",
    "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
    "link_url": "/categories/sunscreen",
    "position": "hero",
    "order": 1,
    "is_active": true,
    "button_text": "خرید ویژه"
  }
]
```

---

### ۲.۵. مجله سلامت و مقالات (Blog Articles Endpoint)

#### `GET /api/v1/blog/articles/`
* **کاربرد**: دریافت مقالات مجله سلامت نوژاشاپ.
* **Method**: `GET`
* **Query Parameters**:
  * `category_slug` (string, optional)
  * `page` (number, default: 1)
* **Response Body Example (200 OK)**:
```json
{
  "count": 45,
  "next": null,
  "previous": null,
  "total_pages": 1,
  "current_page": 1,
  "page_size": 10,
  "results": [
    {
      "id": 1,
      "title": "راهنمای کامل روتین پوستی در فصل تابستان",
      "slug": "summer-skincare-routine-guide",
      "summary": "تکنیک‌های علمی متخصصان پوست برای حفظ شادابی و جلوگیری از دهیدراته شدن پوست.",
      "content": "<p>متن کامل مقاله با فرمت HTML...</p>",
      "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03",
      "category_name": "روتین پوستی",
      "category_slug": "skin-routine",
      "read_time": "۵ دقیقه",
      "author": {
        "name": "دکتر سارا احمدی",
        "role": "متخصص داروسازی و پوست",
        "avatar_url": "https://images.unsplash.com/photo-1594824813571-2153349aed06"
      },
      "published_at": "۱۴۰۴/۰۵/۱۵",
      "seo_title": "راهنمای روتین پوستی تابستان | مجله نوژاشاپ",
      "seo_description": "آموزش کامل روتین پوستی تابستان برای انواع پوست.",
      "canonical_url": "https://nozhashop.com/blog/summer-skincare-routine-guide"
    }
  ]
}
```

---

### ۲.۶. جستجوی سراسری و پیشنهادات (Global Search & Suggestions Endpoint)

#### `GET /api/v1/search/`
* **کاربرد**: نتایج جامع جستجوی همزمان در محصولات، برندها و دسته‌بندی‌ها.
* **Method**: `GET`
* **Query Parameters**: `q` (string, required)
* **Response Body Example (200 OK)**:
```json
{
  "query": "ضد آفتاب",
  "total_results": 142,
  "products": [...],
  "categories": [...],
  "brands": [...],
  "suggestions": [
    { "text": "ضد آفتاب لافارر", "type": "product" },
    { "text": "ضد آفتاب مای", "type": "product" }
  ]
}
```

---

### ۲.۷. سئو و نقشه‌سایت (SEO & Dynamic Sitemap Endpoints)

#### `GET /api/v1/seo/meta/`
* **کاربرد**: دریافت متادیتای سفارشی هر صفحه از CMS چنگو.
* **Method**: `GET`
* **Query Parameters**: `path` (string, e.g. `/shop`, `/categories/skin-care`)

#### `GET /api/sitemap/` (یا `/api/v1/sitemap/`)
* **کاربرد**: تولید دینامیک نقشه‌سایت برای گوگل سنترال و سئو موتورهای جستجو.
* **Method**: `GET`
* **Response Body Example (200 OK)**:
```json
{
  "urls": [
    {
      "loc": "https://nozhashop.com/",
      "lastmod": "2026-08-10",
      "changefreq": "daily",
      "priority": 1.0
    },
    {
      "loc": "https://nozhashop.com/products/anti-spot-derma-clear-cream",
      "lastmod": "2026-08-10",
      "changefreq": "weekly",
      "priority": 0.8
    }
  ]
}
```

---

### ۲.۸. سبد خرید و سفارشات (Cart & Orders Endpoints)

#### `POST /api/v1/cart/` & `GET /api/v1/cart/`
* **کاربرد**: همگام‌سازی سبد خرید کاربر با سرور (کوکی یا JWT Token).

#### `POST /api/v1/orders/`
* **کاربرد**: ثبت سفارش نهایی و دریافت شناسه درگاه پرداخت (مثل زرین‌پال یا سامان‌کیش).

---

### ۲.۹. احراز هویت پیامکی (OTP Authentication Endpoints)

#### `POST /api/v1/auth/otp/send/`
* **Body**: `{ "phone_number": "09123456789" }`

#### `POST /api/v1/auth/otp/verify/`
* **Body**: `{ "phone_number": "09123456789", "code": "12345" }`
* **Response**: `{ "access_token": "JWT_ACCESS...", "refresh_token": "JWT_REFRESH...", "user": {...} }`
