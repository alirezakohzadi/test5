# گزارش آماده‌سازی معماری فرانت‌اند (React + Vite) برای اتصال به Django CMS

این مستند گزارش کامل اصلاح معماری و آماده‌سازی کل پروژه Frontend جهت اتصال مستقیم و بی‌واسطه به APIهای واقعی **Django CMS** را ارائه می‌دهد.

---

## 1. آماده‌سازی Navbar برای API
- **سرویس جدید**: `src/services/navbarService.ts`
- **تایپ جدید**: `DjangoNavbarItem` در `src/types.ts`
- **کامپوننت جدید**: `src/components/navigation/NavbarNavigation.tsx`
- **آدرس API متناظر**: `GET /api/v1/navbar/`
- **توضیحات**:
  - منوی ناوبری اصلی هدر (`Header.tsx`) و منوی موبایل کاملاً از لیست دسته‌بندی‌ها (Categories) تفکیک شد.
  - تایپ `DjangoNavbarItem` شامل فیلدهای `id`, `title`, `slug`, `link_url`, `parent`, `order`, `is_active`, `icon`, `image_url`, `badge_text`, `children` می‌باشد.
  - در صورت عدم وجود پاسخ از بک‌اند، هیچ آیتم جعلی نمایش داده نمی‌شود و وضعیت Empty / Error تمیز مدیریت می‌گردد.

---

## 2. مستقل‌سازی Quick Access
- **تایپ اختصاصی**: `DjangoQuickAccessItem`
- **متد سرویس**: `homepageService.getQuickAccessItems()`
- **آدرس API متناظر**: `GET /api/v1/homepage/quick-access/`
- **توضیحات**:
  - بخش دکمه‌های دسترسی سریع کاملاً از Category و Banner جدا شد.
  - فیلدها شامل `id`, `title`, `subtitle`, `icon`, `image_url`, `link_url`, `order`, `is_active`, `badge` است.
  - هیچ کلاسی منطق Fallback به دسته‌بندی‌ها یا بنرها را در صورت عدم وجود API اجرا نمی‌کند.

---

## 3. مستقل‌سازی گروه محصولات صفحه اصلی (Product Groups)
- **تایپ اختصاصی**: `DjangoProductGroup`
- **متد سرویس**: `homepageService.getProductGroups()`
- **آدرس API متناظر**: `GET /api/v1/homepage/product-groups/`
- **توضیحات**:
  - گروه‌های محصولات مستقل از لیست عمومی Categories مدیریت می‌شوند.
  - ایجاد دسته‌بندی جدید در سیستم به خودی خود باعث ایجاد گروه محصول در صفحه اصلی نخواهد شد.

---

## 4. ساختار بخش‌های محصول (Product Sections)
- **تایپ اختصاصی**: `DjangoProductSection`
- **متد سرویس**: `homepageService.getSectionConfig(sectionType)` و `homepageService.getProductSections()`
- **آدرس API متناظر**: `GET /api/v1/homepage/product-sections/?type={sectionType}`
  - `type=most_popular` (محبوب‌ترین محصولات)
  - `type=best_sellers` (پرفروش‌ترین محصولات)
  - `type=new_arrivals` (جدیدترین محصولات)
  - `type=offers` (پیشنهادات ویژه)
  - `type=highlights` (محصولات منتخب)
- **توضیحات**:
  - انتخاب و فیلتر محصولات در سمت کلاینت حذف گردید.
  - فرانت‌اند صرفاً آرایه `products` دریافتی از پاسخ API را رندر می‌کند و انتخاب محصولات بر عهده پنل ادمین/بک‌اند Django است.

---

## 5. معماری تفکیک‌شده بنرها (Banner Architecture)
- **سرویس**: `src/services/bannerService.ts`
- **آدرس API متناظر**: `GET /api/v1/banners/?position={position}`
- **موقعیت‌های دقیق (Position Types)**:
  - `hero`: اسلایدر اصلی هیرو
  - `sidebar`: بنر عمودی کنار اسلایدر هیرو
  - `quick_access`: بنرهای زیر دکمه‌های دسترسی سریع
  - `specialized`: کارت‌های مراقبت تخصصی
  - `splash`: بنر عریض تبلیغاتی
  - `row`: بنرهای ردیفی ۴تایی (واقع در بالای بخش محبوب‌ترین محصولات)
  - `bottom`: بنرهای پایینی
  - `offers_top`: بنر بالای بخش پیشنهادات
  - `offers_golden`: بنر عمودی فرصت طلایی
  - `new_arrivals_top`: بنر بالای جدیدترین‌ها
  - `new_arrivals_vertical`: بنر عمودی جدیدترین‌ها
  - `new_arrivals_bottom`: بنر پایین جدیدترین‌ها
  - `bestsellers_vertical`: بنر عمودی پرفروش‌ترین‌ها
- **توضیحات**:
  - تمامی کامپوننت‌های بنر از تگ ساختاریافته `<picture>` با قابلیت بارگذاری `mobile_image_url` استفاده می‌کنند.
  - ترتیب و موقعیت بنرهای ۴تایی دقیقاً به بالای بخش «محبوب‌ترین محصولات» انتقال یافت تا ساختار بصری کاملاً با وب‌سایت همخوانی داشته باشد.

---

## 6. غیرفعالسازی داده‌های استاتیک و پاکسازی
- فایل `src/services/mockDjangoCategories.ts` حذف گردید.
- کلیه منطق‌های جایگزین کلاینتی (Local Fallback arrays) داخل `homepageService.ts` حذف شدند.

---

## 7. وضعیت Mockها
- **صفر Mock جدید یا جعلی ایجاد نشد.**
- کامپوننت‌ها در صورت عدم پاسخ‌دهی سرور، دارای حالت‌های استاندارد **Loading Skeleton**، **Error + Retry** و **Empty State** هستند.

---

## 8. تایپ‌های اضافه/به‌روزرسانی شده (`src/types.ts`)
1. `DjangoNavbarItem`
2. `DjangoQuickAccessItem`
3. `DjangoProductGroup`
4. `DjangoProductSection`
5. `DjangoBanner`

---

## 9. فایلهای تغییریافته و ایجاده‌شده
- `src/types.ts`: اضافه شدن تایپ‌های مستقل CMS.
- `src/services/navbarService.ts`: ایجاد سرویس فراخوانی Navbar API.
- `src/services/homepageService.ts`: بازنویسی کامل جهت حذف وابستگی‌ها و Fallbackهای کلاینتی.
- `src/components/navigation/NavbarNavigation.tsx`: ایجاد کامپوننت ناوبری مستقل بر پایه `DjangoNavbarItem`.
- `src/components/Header.tsx`: اتصال به `NavbarNavigation`.
- `src/services/mockDjangoCategories.ts`: حذف فایل غیرضروری.

---

## 10. نتیجه Build و Lint
- **`npm run lint` (`tsc --noEmit`)**: ✅ بدون هیچ خطا یا انذار (Passed with 0 errors)
- **`npm run build` (`vite build`)**: ✅ بیلد موفقیت‌آمیز کامل (Build succeeded)

---

## 11. راهنما و قراردادهای لازم برای توسعه‌دهنده بک‌اند (Django CMS Developer)

جهت تکمیل اتصال کامل، ایجنت یا توسعه‌دهنده بک‌اند Django باید سرویس‌های زیر را در آدرس‌های مشخص‌شده پیاده‌سازی نماید:

1. **`GET /api/v1/navbar/`**
   - **خروجی نمونه**:
     ```json
     [
       {
         "id": 1,
         "title": "فروشگاه",
         "slug": "shop",
         "link_url": "/shop",
         "parent": null,
         "order": 1,
         "is_active": true,
         "icon": "store",
         "badge_text": "جدید",
         "children": []
       }
     ]
     ```

2. **`GET /api/v1/homepage/quick-access/`**
   - **خروجی نمونه**:
     ```json
     [
       {
         "id": 1,
         "title": "مکمل‌های ورزشی",
         "subtitle": "انواع پروتئین و کراتین",
         "icon": "fitness_center",
         "image_url": "/media/quick_access/supplements.png",
         "link_url": "/shop?category=supplements",
         "order": 1,
         "is_active": true
       }
     ]
     ```

3. **`GET /api/v1/homepage/product-groups/`**
   - **خروجی نمونه**:
     ```json
     [
       {
         "id": 1,
         "title": "بهداشت دهان و دندان",
         "slug": "dental-care",
         "image_url": "/media/groups/dental.jpg",
         "order": 1,
         "is_active": true,
         "products": []
       }
     ]
     ```

4. **`GET /api/v1/homepage/product-sections/?type={sectionType}`**
   - **خروجی نمونه**:
     ```json
     [
       {
         "id": 1,
         "title": "محبوب‌ترین محصولات",
         "slug": "most_popular",
         "type": "most_popular",
         "is_active": true,
         "products": [
           {
             "id": 101,
             "slug": "vitaplex-supplement",
             "name": "قرص ویتاپلکس",
             "price": 350000,
             "image_url": "/media/products/vitaplex.jpg",
             "in_stock": true
           }
         ]
       }
     ]
     ```

5. **`GET /api/v1/banners/?position={position}`**
   - **خروجی نمونه**:
     ```json
     [
       {
         "id": 1,
         "title": "پیشنهاد شگفت‌انگیز",
         "image_url": "/media/banners/hero_1.jpg",
         "mobile_image_url": "/media/banners/hero_1_mobile.jpg",
         "link_url": "/shop?discount=true",
         "position": "hero",
         "order": 1,
         "is_active": true
       }
     ]
     ```

---

## 10. کنترل کامل گزینه‌ها و اطلاعات صفحه جزئیات محصول (Product Detail Page CMS API)

تمامی بخش‌های **صفحه جزئیات محصول (`ProductDetailPage.tsx`)** کاملاً پویا گردیده و مستقیماً توسط پاسخ API جنگو مدیریت می‌شوند:

- **آدرس API متناظر**: `GET /api/v1/products/{id_or_slug}/`
- **ساختار خروجی کامل JSON برای صفحه محصول**:
```json
{
  "id": 101,
  "slug": "hydroderm-sunscreen-cream",
  "name": "کرم ضد آفتاب و آبرسان هیدرودرم SPF50",
  "sku": "NZH-HD-50",
  "barcode": "6260123456789",
  "brand": {
    "id": 12,
    "name": "هیدرودرم",
    "persian_name": "هیدرودرم",
    "slug": "hydroderm"
  },
  "category": {
    "id": 4,
    "name": "مراقبت از پوست",
    "slug": "skin-care"
  },
  "image_url": "/media/products/hydroderm_main.jpg",
  "gallery_images": [
    "/media/products/hydroderm_main.jpg",
    "/media/products/hydroderm_angle1.jpg",
    "/media/products/hydroderm_back.jpg"
  ],
  "price": 285000,
  "original_price": 320000,
  "discount_percentage": 11,
  "in_stock": true,
  "stock_quantity": 45,
  "volume_or_size": "۵۰ میلی‌لیتر",
  "rating": 4.9,
  "rating_count": 52,
  "badge": "پیشنهاد طلایی",
  "club_points": 20,
  "viewers_count": 8,
  "recent_orders_count": 24,
  "pharmacist_note": "داروسازان نوژاشاپ مصرف این ضدآفتاب را روزانه ۲ بار پیشنهاد می‌کنند.",
  "irc_code": "۱۶۲۸۴۹۵۰۰۳۹۲۸۱",
  "lot_number": "NZ-2024-8849",
  "key_features": [
    "دارای سیب سلامت و پروانه رسمی غذا و دارو",
    "بافت بسیار سبک با جذب سریع بدون چربی",
    "هایپوآلرژنیک و مناسب حساس‌ترین پوست‌ها"
  ],
  "specifications": [
    { "label": "کشور سازنده", "value": "ایران (تحت لیسانس)" },
    { "label": "نوع پوست", "value": "پوست‌های چرب و مختلط" },
    { "label": "میزان SPF", "value": "SPF 50+" },
    { "label": "پروانه بهره‌برداری", "value": "۵۶/۲۱۸۷۴" }
  ],
  "variants": [
    {
      "id": 1001,
      "name": "بی‌رنگ ۵۰ میلی‌لیتر",
      "price": 285000,
      "original_price": 320000,
      "discount_percentage": 11,
      "in_stock": true,
      "sku": "NZH-HD-50-NC"
    },
    {
      "id": 1002,
      "name": "بژ روشن ۵۰ میلی‌لیتر",
      "price": 295000,
      "original_price": 330000,
      "discount_percentage": 10,
      "in_stock": true,
      "sku": "NZH-HD-50-LB"
    }
  ],
  "description": "کرم ضد آفتاب و آبرسان هیدرودرم با بهره‌گیری از فیلترهای پیشرفته UVA/UVB حداکثر محافظت را فراهم می‌سازد...",
  "usage_instructions": "روزانه ۲۰ دقیقه قبل از قرار گرفتن در معرض آفتاب روی پوست تمیز استفاده شود.",
  "ingredients": "حاوی هیالورونیک اسید، نیاسینامید، عصاره چای سبز و ویتامین E.",
  "reviews": [
    {
      "id": 1,
      "author": "مریم کاظمی",
      "rating": 5,
      "date": "۱۲ مرداد ۱۴۰۳",
      "comment": "عالی و باکیفیت بود. سریع جذب میشه و اصلاً سفیدک نمی‌زنه.",
      "verified": true,
      "likes": 14
    }
  ],
  "qa_items": [
    {
      "id": 1,
      "question": "آیا برای پوست‌های جوش‌دار مناسب است؟",
      "author": "رضا سلیمانی",
      "date": "۱۰ مرداد ۱۴۰۳",
      "answer": "بله، کاملاً فاقد چربی و غیرکومدون‌زا است.",
      "pharmacist_name": "دکتر سمیرا نوری"
    }
  ],
  "routine_products": [
    {
      "id": 201,
      "slug": "gentle-cleanser-gel",
      "name": "ژل شستشوی ملایم صورت",
      "price": 180000,
      "image_url": "/media/products/cleanser.jpg"
    }
  ]
}
```
