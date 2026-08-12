import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Gift, Sparkles, Star, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Product, HomepageProductSection, DjangoBanner } from '../types';
import { homepageService } from '../services/homepageService';
import { bannerService } from '../services/bannerService';

interface DetailedOffersProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const DetailedOffers: React.FC<DetailedOffersProps> = ({
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigateCategory,
}) => {
  const [activeTab, setActiveTab] = useState('همه پیشنهادات');
  const [sectionConfig, setSectionConfig] = useState<HomepageProductSection | null>(null);
  const [topBanner, setTopBanner] = useState<DjangoBanner | null>(null);
  const [goldenBanner, setGoldenBanner] = useState<DjangoBanner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadSectionData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [configRes, topBannersRes, goldenBannersRes] = await Promise.allSettled([
        homepageService.getSectionConfig('offers'),
        bannerService.getBanners('offers_top'),
        bannerService.getBanners('offers_golden'),
      ]);

      if (configRes.status === 'fulfilled') {
        setSectionConfig(configRes.value);
      }
      if (topBannersRes.status === 'fulfilled' && topBannersRes.value.length > 0) {
        setTopBanner(topBannersRes.value[0]);
      } else {
        setTopBanner(null);
      }
      if (goldenBannersRes.status === 'fulfilled' && goldenBannersRes.value.length > 0) {
        setGoldenBanner(goldenBannersRes.value[0]);
      } else {
        setGoldenBanner(null);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSectionData();
  }, [loadSectionData]);

  if (!loading && sectionConfig && sectionConfig.is_active === false) {
    return null;
  }

  const products = sectionConfig?.products || [];

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const tabs = [
    'همه پیشنهادات',
    'ضد ریزش و تقویتی',
    'سرم پوستی',
    'دئودورانت',
    'ضد آفتاب و آبرسان',
    'مکمل‌های دارویی',
    'مراقبت از بدن',
    'مراقبت از کودک',
  ];

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const filteredProducts = products.filter(
    (p) => activeTab === 'همه پیشنهادات' || p.category === activeTab || p.category?.includes(activeTab)
  );

  return (
    <section className="w-full mb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Top Banner for Vitaplex / Special Offers */}
        {topBanner && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => onNavigateCategory?.(topBanner.link_url || 'vitaplex-hairloss')}
            className="w-full aspect-[16/5] sm:aspect-[4/1] rounded-xl sm:rounded-2xl overflow-hidden mb-5 group cursor-pointer relative"
          >
            <picture className="w-full h-full block">
              {topBanner.mobile_image_url && (
                <source media="(max-width: 639px)" srcSet={topBanner.mobile_image_url} />
              )}
              <img
                src={topBanner.image_url}
                alt={topBanner.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </picture>
          </motion.div>
        )}

        {/* Category Filter Chips & Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#0D7366] text-white shadow-sm shadow-[#0D7366]/20'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredProducts.length > 4 && (
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              <button
                onClick={scrollPrev}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#0D7366] hover:text-white hover:border-[#0D7366] text-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                title="قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-[#0D7366] hover:text-white hover:border-[#0D7366] text-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                title="بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-64 flex flex-col justify-between">
                <div className="bg-slate-100 rounded-xl aspect-square w-full" />
                <div className="space-y-2 mt-3">
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-700">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm mb-3">خطا در دریافت لیست پیشنهادات ویژه</p>
            <button
              onClick={loadSectionData}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-2.5 sm:gap-4 items-stretch">
            {/* Golden Offers Banner Box (Right side in RTL, 220px wide) */}
            {goldenBanner && (
              <div 
                className="w-[140px] sm:w-[180px] lg:w-[220px] flex-shrink-0 rounded-2xl overflow-hidden relative group cursor-pointer self-stretch"
                onClick={() => onNavigateCategory?.(goldenBanner.link_url || 'فرصت-طلایی')}
              >
                <picture className="absolute inset-0 w-full h-full block">
                  {goldenBanner.mobile_image_url && (
                    <source media="(max-width: 639px)" srcSet={goldenBanner.mobile_image_url} />
                  )}
                  <img
                    src={goldenBanner.image_url}
                    alt={goldenBanner.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
              </div>
            )}

            {/* Product Cards Slider (Max 4 in view on Desktop) */}
            <div
              ref={scrollContainerRef}
              className="flex-1 min-w-0 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 sm:gap-3 lg:gap-4 scroll-smooth items-stretch"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group cursor-pointer flex-shrink-0 w-[155px] sm:w-[190px] lg:w-[calc((100%-48px)/4)] snap-start self-stretch"
                  onClick={() => onSelectProduct ? onSelectProduct(product) : onQuickView(product)}
                >
                  {/* Product Image */}
                  <div className="aspect-square mb-2.5 overflow-hidden rounded-xl bg-slate-50 p-2 sm:p-2.5 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPercentage && (
                      <span className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        ٪{product.discountPercentage}
                      </span>
                    )}
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block mb-0.5">{product.brand}</span>
                    <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-[#0D7366] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      {product.originalPrice && (
                        <span className="text-[9px] text-slate-400 line-through block">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="font-extrabold text-xs text-[#0D7366]">
                        {formatPrice(product.price)} <span className="text-[9px] font-normal text-slate-400">تومان</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#0D7366] text-white flex items-center justify-center hover:bg-[#0A584E] active:scale-90 transition-transform shadow-xs shrink-0 cursor-pointer"
                      title="افزودن به سبد"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
