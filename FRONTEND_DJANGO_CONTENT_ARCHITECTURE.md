# Frontend & Django Content Management Architecture

این سند، معماری جدید اتصال تمامی بخش‌های دینامیک صفحه اصلی (Homepage) و محتوای فروشگاه React/Vite به Django REST API را تشریح می‌کند.

---

## ۱. اصول حاکم بر طراحی (Core Principles)

۱. **عدم هاردکد محتوای فروشگاه**: هیچ بنر، دسته، محصول، دسترسی سریع، بخش یا لوگوی برندی نباید در فایل‌های React به صورت Static تعریف شود.
۲. **حفظ کامل UI/UX و استایل**: ظاهر سایت، فونت‌ها، رنگ‌آمیزی برند (از جمله حاشیه طلایی `#D4AF37` و سبز `#0D7366`) و انیمیشن‌های Framer Motion دقیقاً طبق طرح اولیه حفظ شده‌اند.
۳. **عدم دستکاری کد Backend**: کدهای اصلی فرانت‌اند با قابلیت انعطاف برای APIهای استاندارد پیشنهادی آماده شده‌اند.
۴. **معماری حالت‌های سه‌گانه (UI States)**: تمام کامپوننت‌های دریافت داده شامل ۳ حالت زنده هستند:
   - **Loading State**: اسکلتون‌های انیمیشن‌دار هم‌اندازه با کامپوننت اصلی.
   - **Error State**: پیام خطای فارسی همراه با دکمه «تلاش مجدد» (Retry).
   - **Empty State**: عدم نمایش یا نمایش پیام مناسب بدون به هم ریختن چیدمان.

---

## ۲. ساختار مدل‌های پیشنهادی Django API برای Homepage

جهت مدیریت کامل و متمرکز صفحه اصلی از پانل مدیریت Django، ساختارهای زیر طراحی و در سرویس‌ها متصل شده‌اند:

### ۱) دسترسی سریع (Quick Access)
**Endpoint**: `GET /api/v1/homepage/quick-access/`

| فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | Integer | شناسه آیتم |
| `title` | String | عنوان (مثلاً: دارو اکسپرس، مکمل بدنسازی) |
| `subtitle` | String (Optional) | زیرعنوان / توضیحات کوتاه |
| `icon` | String (Optional) | آیکون یا تصویر آیکون |
| `image` | String (Optional) | تصویر پس‌زمینه/کارت |
| `link` | String | لینک هدایت (مثلاً `/shop?category=dietary`) |
| `order` | Integer | ترتیب نمایش |
| `is_active` | Boolean | وضعیت فعال بودن |
| `badge` | String (Optional) | نشان ویژه (مثلاً: ویژه، جدید) |

---

### ۲) گروه‌های محصولی جدید (Newest Product Groups / Bento Grid)
**Endpoint**: `GET /api/v1/homepage/product-groups/`

| فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | Integer | شناسه گروه |
| `title` | String | عنوان گروه |
| `slug` | String | اسلاگ جهت فیلتر و روتینگ |
| `description` | String (Optional) | شرح گروه |
| `image` | String | تصویر بنر کارت |
| `order` | Integer | ترتیب نمایش |
| `is_active` | Boolean | وضعیت |
| `products` | List[Product] | لیست محصولات مرتبط |

---

### ۳) بخش‌های محصولی هوم‌پبج (Product Sections: Highlights, Offers, Arrivals, Best Sellers, Popular)
**Endpoint**: `GET /api/v1/homepage/product-sections/`

| فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `id` | Integer | شناسه بخش |
| `section_type` | String | نوع بخش (`highlights`, `offers`, `new_arrivals`, `best_sellers`, `most_popular`) |
| `title` | String | عنوان بخش |
| `subtitle` | String (Optional) | زیرعنوان |
| `badge_text` | String (Optional) | متن نشان تایمر یا تخفیف |
| `banner_image` | String (Optional) | بنر کناری یا پس‌زمینه |
| `order` | Integer | ترتیب |
| `is_active` | Boolean | وضعیت |
| `products` | List[Product] | لیست محصولات شامل قیمت، قیمت قبلی، درصد تخفیف |

---

### ۴) مدیریت متمرکز بنرها (Banners)
**Endpoint**: `GET /api/v1/banners/?position={position}`

موقعیت‌های پشتیبانی‌شده (`position`):
- `hero`: اسلایدر بنر اصلی هدر
- `sidebar`: بنر عمودی سمت چپ اسلایدر اصلی
- `bottom`: بنرهای ۲ تایی / ۴ تایی انتهایی
- `row`: بنرهای ۴ تایی مکمل‌ها و پیشنهادها
- `specialized`: شبکه‌بندی بنرهای مراقبت تخصصی
- `splash`: بنر عریض بادی اسپلش هیدرودرم

---

## ۳. جدول ماتریس کامپوننت‌های فرانت‌اند و APIها

| کامپوننت React | سرویس فرانت‌اند | Endpointهای متصل در Django |
| :--- | :--- | :--- |
| `QuickAccess` | `homepageService.getQuickAccessItems()` | `GET /homepage/quick-access/` *(فال‌بک به `categoryService` / `bannerService`)* |
| `NewestProductGroups` | `homepageService.getProductGroups()` | `GET /homepage/product-groups/` *(فال‌بک به `categoryService`)* |
| `ProductHighlights` | `homepageService.getProductSections('highlights')` | `GET /homepage/product-sections/?type=highlights` *(فال‌بک به `/products/featured/`)* |
| `DetailedOffers` | `homepageService.getProductSections('offers')` | `GET /homepage/product-sections/?type=offers` *(فال‌بک به `/products/`)* |
| `NewArrivalsSection` | `homepageService.getProductSections('new_arrivals')` | `GET /homepage/product-sections/?type=new_arrivals` *(فال‌بک به `/products/new-arrivals/`)* |
| `BestSellersSection` | `homepageService.getProductSections('best_sellers')` | `GET /homepage/product-sections/?type=best_sellers` *(فال‌بک به `/products/best-sell/`)* |
| `MostPopularSection` | `homepageService.getProductSections('most_popular')` | `GET /homepage/product-sections/?type=most_popular` *(فال‌بک به `/products/most-popular/`)* |
| `HeroSection` | `bannerService.getBanners('hero' / 'sidebar')` | `GET /banners/?position=hero` & `GET /banners/?position=sidebar` |
| `BottomBannersSection` | `bannerService.getBanners('bottom')` | `GET /banners/?position=bottom` |
| `SupplementBannersRow` | `bannerService.getBanners('row')` | `GET /banners/?position=row` |
| `SpecializedCareGrid` | `bannerService.getBanners('specialized')` | `GET /banners/?position=specialized` |
| `HydrodermSplashBanner` | `bannerService.getBanners('splash')` | `GET /banners/?position=splash` |
| `BrandsCarousel` | `brandService.getBrands()` | `GET /brands/` |
| `CircleCategorySlider` | `categoryService.getCategories()` | `GET /categories/` |
| `HealthMagazine` | `blogService.getArticles()` | `GET /blog/articles/` |

---

## ۴. نرمال‌سازی داده‌ها (Data Normalization & Mapping)

تمام داده‌های محصول دریافتی از Django توسط متد `mapDjangoProductToUI` در `src/services/productService.ts` پردازش می‌شوند:
- تبدیل قیمت‌های ریال/تومان به عدد استاندارد.
- محاسبه خودکار درصد تخفیف (`discountPercentage`).
- تنظیم تصویر پیش‌فرض جابه‌جایی در صورت نبود تصویر دوم.
- نرمال‌سازی URLهای رسانه (`getMediaUrl`) جهت حل مشکل مسیرهای نسبی/مطلق Django Media.

---

## ۵. نتیجه و وضعیت اعتبارسنجی (Status & Validation)

- **نوع‌دهی TypeScript**: تمامی سرویس‌ها و کامپوننت‌ها بدون خطا متصل شدند (`tsc --noEmit` با موفقیت کامل اجرا شد).
- **بیلد پروژه**: اجرای `npm run build` با موفقیت ۱۰۰٪ صورت گرفت.
- **تست لینتر**: بدون هیچ اخطار یا باگ ایفا گردید.
