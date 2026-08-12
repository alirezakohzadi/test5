import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { QuickAccess } from './components/QuickAccess';
import { ProductHighlights } from './components/ProductHighlights';
import { DetailedOffers } from './components/DetailedOffers';
import { BrandsCarousel } from './components/BrandsCarousel';
import { NewestProductGroups } from './components/NewestProductGroups';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { PostNewArrivalsBanners } from './components/PostNewArrivalsBanners';
import { SpecializedCareGrid } from './components/SpecializedCareGrid';
import { HydrodermSplashBanner } from './components/HydrodermSplashBanner';
import { BestSellersSection } from './components/BestSellersSection';
import { CircleCategorySlider } from './components/CircleCategorySlider';
import { BottomBannersSection } from './components/BottomBannersSection';
import { MostPopularSection } from './components/MostPopularSection';
import { PopularProductsTopBanners } from './components/PopularProductsTopBanners';
import { PopularProductsBottomBanners } from './components/PopularProductsBottomBanners';
import { SupplementBannersRow } from './components/SupplementBannersRow';
import { HealthMagazine } from './components/HealthMagazine';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { BlogDetailPage } from './components/BlogDetailPage';
import { MagazinePage } from './components/MagazinePage';
import { ShopPage } from './components/ShopPage';
import { AuthModal, UserProfile } from './components/AuthModal';
import { ToastContainer } from './components/Toast';
import { SEOHead } from './components/SEOHead';
import { Product, CartItem, ToastMessage, Article, SEOData } from './types';
import { productService } from './services/productService';
import { blogService } from './services/blogService';
import {
  SITE_DOMAIN,
  DEFAULT_SITE_TITLE,
  DEFAULT_SITE_DESC,
  getCanonicalUrl,
  generateProductSchema,
  generateArticleSchema,
  generateCollectionPageSchema,
  generateOrganizationSchema,
} from './utils/seo';
import {
  getProductSlug,
  getCategorySlug,
  getCategoryNameFromSlug,
  navigateTo,
} from './utils/router';

export default function App() {
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Dynamic Product & Article Details State
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [activeArticleDetail, setActiveArticleDetail] = useState<Article | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Current Route location tracking
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  const normPath = currentPath.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';

  useEffect(() => {
    if (normPath.startsWith('/products/')) {
      const slug = normPath.replace('/products/', '');
      productService.getProductBySlug(slug).then((p) => {
        setActiveProductDetail(p);
        if (p) {
          productService.getRelatedProducts(slug).then((rel) => setRelatedProducts(rel)).catch(() => {});
        }
      }).catch(() => setActiveProductDetail(null));
    } else {
      setActiveProductDetail(null);
    }

    if (normPath.startsWith('/blog/')) {
      const idOrSlug = normPath.replace('/blog/', '');
      blogService.getArticleBySlug(idOrSlug).then((a) => setActiveArticleDetail(a)).catch(() => setActiveArticleDetail(null));
    } else {
      setActiveArticleDetail(null);
    }
  }, [normPath]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // User Profile state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('nozha_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nozha_user_profile', JSON.stringify(user));
    } catch {
      // Ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nozha_user_profile');
    } catch {
      // Ignore
    }
  };

  // Toast messages
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'init-toast',
      type: 'success',
      title: 'خوش آمدید به نوژاشاپ',
      message: 'مرجع تخصصی دارو آنلاین، مکمل‌ها و مجله سلامت و زیبایی',
    },
  ]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 20000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    showToast(
      'افزوده شد به سبد خرید',
      `«${product.name}» به سبد خرید شما اضافه گردید.`
    );
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('حذف کالا', 'محصول از سبد خرید شما کسر شد.', 'info');
  };

  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('علاقه‌مندی‌ها', `«${product.name}» از لیست علاقه‌مندی‌ها حذف شد.`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('علاقه‌مندی‌ها', `«${product.name}» به لیست علاقه‌مندی‌ها اضافه شد.`);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Route Parser Resolution logic
  let isShopActive = false;
  let isMagazineActive = false;
  let shopCategoryFilter = '';
  let shopBrandFilter = '';
  let shopQueryFilter = '';

  if (
    normPath === '/magazine' ||
    normPath === '/blog' ||
    normPath === '/health-journal' ||
    normPath.startsWith('/magazine') ||
    normPath.includes('journal') ||
    normPath.includes('magazine') ||
    (normPath.startsWith('/categories/') && (
      normPath.includes('health-journal') ||
      normPath.includes('blog') ||
      normPath.includes('journal')
    ))
  ) {
    isMagazineActive = true;
  } else if (normPath.startsWith('/categories/')) {
    const slug = normPath.replace('/categories/', '');
    isShopActive = true;
    shopCategoryFilter = getCategoryNameFromSlug(slug);
  } else if (normPath.startsWith('/brands/')) {
    const slug = normPath.replace('/brands/', '');
    isShopActive = true;
    shopBrandFilter = getCategoryNameFromSlug(slug);
  } else if (normPath === '/shop' || normPath.startsWith('/shop')) {
    isShopActive = true;
  }

  const handleSelectProduct = (prod: Product) => {
    navigateTo('/products/' + getProductSlug(prod));
  };

  const handleSelectCategory = (catInput: string) => {
    if (catInput.startsWith('/')) {
      navigateTo(catInput);
    } else {
      navigateTo('/categories/' + getCategorySlug(catInput));
    }
  };

  const handleSelectBrand = (brandName: string) => {
    navigateTo('/brands/' + getCategorySlug(brandName));
  };

  // Dynamic SEO Metadata & Structured Data Calculation
  let seoData: SEOData;

  if (activeProductDetail) {
    const prodSlug = getProductSlug(activeProductDetail);
    const canonical = getCanonicalUrl('/products/' + prodSlug);
    seoData = {
      title: activeProductDetail.seoTitle || `${activeProductDetail.name} | قیمت و خرید از نوژاشاپ`,
      description: activeProductDetail.seoDescription || `خرید اینترنتی ${activeProductDetail.name} از برند ${activeProductDetail.brand} با تضمین اصالت فیزیکی، قیمت مناسب و ارسال سریع از داروخانه آنلاین نوژاشاپ.`,
      canonicalUrl: canonical,
      ogType: 'product',
      ogImage: activeProductDetail.ogImage || activeProductDetail.image,
      schemaJson: generateProductSchema(activeProductDetail, canonical),
      breadcrumbs: [
        { name: 'فروشگاه', url: '/shop' },
        { name: activeProductDetail.category || 'مراقبت تخصصی', url: '/categories/' + getCategorySlug(activeProductDetail.category) },
        { name: activeProductDetail.name, url: '/products/' + prodSlug },
      ],
    };
  } else if (activeArticleDetail) {
    const canonical = getCanonicalUrl('/blog/' + activeArticleDetail.id);
    seoData = {
      title: activeArticleDetail.seoTitle || `${activeArticleDetail.title} | مجله سلامت نوژاشاپ`,
      description: activeArticleDetail.seoDescription || activeArticleDetail.summary,
      canonicalUrl: canonical,
      ogType: 'article',
      ogImage: activeArticleDetail.ogImage || activeArticleDetail.image,
      schemaJson: generateArticleSchema(activeArticleDetail, canonical),
      breadcrumbs: [
        { name: 'مجله سلامت', url: '/magazine' },
        { name: activeArticleDetail.category, url: '/magazine' },
        { name: activeArticleDetail.title, url: '/blog/' + activeArticleDetail.id },
      ],
    };
  } else if (normPath.startsWith('/categories/')) {
    const catSlug = normPath.replace('/categories/', '');
    const catName = shopCategoryFilter || getCategoryNameFromSlug(catSlug);
    const canonical = getCanonicalUrl('/categories/' + catSlug);
    const desc = `خرید آنلاین و لیست قیمت انواع محصولات ${catName} با ضمانت اصالت کالا، مشاوره تخصصی و ارسال رایگان از داروخانه آنلاین نوژاشاپ.`;
    seoData = {
      title: `خرید اینترنتی محصولات ${catName} | نوژاشاپ`,
      description: desc,
      canonicalUrl: canonical,
      ogType: 'website',
      schemaJson: generateCollectionPageSchema(catName, desc, canonical),
      breadcrumbs: [
        { name: 'فروشگاه', url: '/shop' },
        { name: catName, url: '/categories/' + catSlug },
      ],
    };
  } else if (normPath.startsWith('/brands/')) {
    const brandSlug = normPath.replace('/brands/', '');
    const brandName = shopBrandFilter || getCategoryNameFromSlug(brandSlug);
    const canonical = getCanonicalUrl('/brands/' + brandSlug);
    const desc = `خرید محصولات آنلاین برند ${brandName} اصل با برچسب اصالت سازمان غذا و دارو، بهترین قیمت و تخفیف ویژه در نوژاشاپ.`;
    seoData = {
      title: `محصولات برند ${brandName} | قیمت و خرید آنلاین | نوژاشاپ`,
      description: desc,
      canonicalUrl: canonical,
      ogType: 'website',
      schemaJson: generateCollectionPageSchema(brandName, desc, canonical),
      breadcrumbs: [
        { name: 'فروشگاه', url: '/shop' },
        { name: brandName, url: '/brands/' + brandSlug },
      ],
    };
  } else if (isShopActive) {
    const canonical = getCanonicalUrl('/shop');
    const desc = 'فروشگاه تخصصی داروخانه آنلاین نوژاشاپ، مرجع مکمل‌های ورزشی، رژیمی، دارویی، مراقبت پوست و مو با ارسال رایگان.';
    seoData = {
      title: 'فروشگاه آنلاین داروخانه، مکمل و آرایشی بهداشتی | نوژاشاپ',
      description: desc,
      canonicalUrl: canonical,
      ogType: 'website',
      schemaJson: generateCollectionPageSchema('فروشگاه نوژاشاپ', desc, canonical),
      breadcrumbs: [{ name: 'فروشگاه', url: '/shop' }],
    };
  } else if (isMagazineActive) {
    const canonical = getCanonicalUrl('/magazine');
    seoData = {
      title: 'مجله تخصصی پزشکی، سلامت و زیبایی | نوژاشاپ',
      description: 'جدیدترین مقالات علمی پزشکی، دانستنی‌های دارویی، راهنمای روتین پوستی و مراقبت از مو توسط متخصصان نوژاشاپ.',
      canonicalUrl: canonical,
      ogType: 'website',
      breadcrumbs: [{ name: 'مجله سلامت', url: '/magazine' }],
    };
  } else {
    const canonical = getCanonicalUrl('/');
    seoData = {
      title: DEFAULT_SITE_TITLE,
      description: DEFAULT_SITE_DESC,
      canonicalUrl: canonical,
      ogType: 'website',
      schemaJson: [
        generateOrganizationSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'داروخانه آنلاین نوژاشاپ',
          'url': SITE_DOMAIN,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${SITE_DOMAIN}/shop?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };
  }

  return (
    <div className="min-h-screen bg-white text-[#191C1D] flex flex-col font-['Vazirmatn'] selection:bg-[#0D7366] selection:text-white">
      {/* Dynamic SEO Metadata Manager */}
      <SEOHead seo={seoData} />

      {/* Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenShop={() => navigateTo('/shop')}
        onOpenMagazine={() => navigateTo('/magazine')}
        currentUser={currentUser}
        onGoHome={() => navigateTo('/')}
        onSelectCategory={(category) => {
          if (
            category.slug === 'health-journal' ||
            category.name === 'مجله سلامت' ||
            category.slug?.startsWith('blog') ||
            category.url === '#blog' ||
            category.id === 6
          ) {
            navigateTo('/magazine');
            return;
          }
          handleSelectCategory(category.name);
          showToast('دسته‌بندی', `ورود به دسته «${category.name}»`, 'info');
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full overflow-x-hidden pt-20 md:pt-32 lg:pt-36">
        {activeProductDetail ? (
          <ProductDetailPage
            product={activeProductDetail}
            allProducts={relatedProducts}
            onBack={() => navigateTo('/')}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(activeProductDetail.id)}
            onSelectProduct={handleSelectProduct}
            onShowToast={showToast}
          />
        ) : activeArticleDetail ? (
          <BlogDetailPage
            article={activeArticleDetail}
            allArticles={[]}
            relatedProducts={relatedProducts}
            onBack={() => navigateTo('/')}
            onSelectArticle={(art) => navigateTo('/blog/' + art.id)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onShowToast={showToast}
          />
        ) : isMagazineActive ? (
          <MagazinePage
            allProducts={relatedProducts}
            onSelectArticle={(art) => navigateTo('/blog/' + art.id)}
            onBackToHome={() => navigateTo('/')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onShowToast={showToast}
          />
        ) : isShopActive ? (
          <ShopPage
            products={[]}
            initialCategory={shopCategoryFilter}
            initialBrand={shopBrandFilter}
            initialQuery={shopQueryFilter}
            onBackToHome={() => navigateTo('/')}
            onSelectProduct={handleSelectProduct}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={handleAddToCart}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* Hero Banner Section */}
            <HeroSection
              onExploreProducts={() => navigateTo('/shop')}
              onNavigateCategory={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Quick Access Bubbles & Banners */}
            <QuickAccess
              onCategoryClick={(cat) => handleSelectCategory(cat)}
              onNavigateCategory={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Product Highlights with Spotlight Glow */}
            <ProductHighlights
              onQuickView={(p) => setQuickViewProduct(p)}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />

            {/* Detailed Offers (Vitaplex & Golden Offers) */}
            <DetailedOffers
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onNavigateCategory={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Brands Carousel Bar */}
            <BrandsCarousel
              onSelectBrand={(brandName) => handleSelectBrand(brandName)}
            />

            {/* Newest Product Groups */}
            <NewestProductGroups
              onSelectCategory={(catName) => handleSelectCategory(catName)}
            />

            {/* Single Banner directly below Newest Product Groups */}
            <SupplementBannersRow
              onBannerClick={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Middle Promotional Banners & New Arrivals Slider */}
            <NewArrivalsSection
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onNavigateCategory={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Banners Layout Below New Arrivals: 1 full -> 2 banners -> 4 banners -> 1 full */}
            <PostNewArrivalsBanners
              onBannerClick={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Specialized Care Grid */}
            <SpecializedCareGrid
              onExploreCategory={(cat) => handleSelectCategory(cat)}
            />

            {/* Full-width Hydroderm Body Splash Panoramic Banner */}
            <HydrodermSplashBanner
              onBannerClick={() => navigateTo('/categories/hydroderm-body-splash')}
            />

            {/* Best Sellers Section */}
            <BestSellersSection
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onNavigateCategory={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Circle Category Quick Slider */}
            <CircleCategorySlider
              onSelectCategory={(cat) => handleSelectCategory(cat)}
            />

            {/* Featured Collections / Bottom Banners */}
            <BottomBannersSection
              onBannerClick={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* 2 Rows of 2 Banners directly above Most Popular Products */}
            <PopularProductsTopBanners
              onBannerClick={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Most Popular Products Grid */}
            <MostPopularSection
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />

            {/* 1 Row of 4 Banners directly below Most Popular Products */}
            <PopularProductsBottomBanners
              onBannerClick={(slug) => navigateTo('/categories/' + slug)}
            />

            {/* Health Magazine / Blog */}
            <HealthMagazine
              onSelectArticle={(art) => navigateTo('/blog/' + art.id)}
              onNavigateMagazine={() => navigateTo('/magazine')}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onShowToast={showToast}
        onNavigateMagazine={() => navigateTo('/magazine')}
        onOpenShop={() => navigateTo('/shop')}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onViewFullDetails={(prod) => {
          setQuickViewProduct(null);
          handleSelectProduct(prod);
        }}
      />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          handleSelectProduct(p);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Online Pharmacist & Prescription Upload Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onShowToast={showToast}
      />

      {/* User Auth & Login/Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
