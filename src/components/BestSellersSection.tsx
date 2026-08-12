import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Plus, Star, ShoppingBag, ShoppingBasket, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Product, HomepageProductSection, DjangoBanner } from '../types';
import { homepageService } from '../services/homepageService';
import { bannerService } from '../services/bannerService';

interface BestSellersSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigateCategory,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('بایومارین');
  const [sectionConfig, setSectionConfig] = useState<HomepageProductSection | null>(null);
  const [verticalBanner, setVerticalBanner] = useState<DjangoBanner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadSectionData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [configRes, bannerRes] = await Promise.allSettled([
        homepageService.getSectionConfig('best_sellers'),
        bannerService.getBanners('best_sellers_vertical').then((res) => (res.length > 0 ? res : bannerService.getBanners('bestsellers_vertical'))),
      ]);

      if (configRes.status === 'fulfilled') {
        setSectionConfig(configRes.value);
      }
      if (bannerRes.status === 'fulfilled' && bannerRes.value.length > 0) {
        setVerticalBanner(bannerRes.value[0]);
      } else {
        setVerticalBanner(null);
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
  const displayTitle = sectionConfig?.title || 'پرفروش‌ترین محصولات';

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

  const filterChips = [
    'بایومارین',
    'مکمل ضدلک و روشن کننده',
    'ال کارنیتین',
    'منیزیم',
    'تقویت حافظه',
    'ضد ریزش'
  ];

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <section className="w-full py-6 mb-8 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Filter Buttons & Desktop Carousel Navigation */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedFilter(chip)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer ${
                  selectedFilter === chip
                    ? 'bg-[#0D7366] text-white border-[#0D7366] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

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
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-60" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-700">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm mb-3">خطا در دریافت پرفروش‌ترین محصولات</p>
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
            {/* Vertical Image Banner for Best Sellers (Right side in RTL) */}
            {verticalBanner && (
              <div
                onClick={() => onNavigateCategory?.(verticalBanner.link_url || 'best-sellers')}
                className="w-[140px] sm:w-[185px] lg:w-[230px] flex-shrink-0 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all border border-slate-200/60 self-stretch"
              >
                <picture className="absolute inset-0 w-full h-full block">
                  {verticalBanner.mobile_image_url && (
                    <source media="(max-width: 639px)" srcSet={verticalBanner.mobile_image_url} />
                  )}
                  <img
                    src={verticalBanner.image_url}
                    alt={verticalBanner.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4 pointer-events-none z-10">
                  <span className="text-[9px] sm:text-[10px] font-black text-white bg-[#2E7D32] px-2 py-0.5 rounded-md self-start mb-1.5 shadow-xs uppercase tracking-wider">
                    {verticalBanner.badge_text || 'TOP SELLERS'}
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-md">
                    {verticalBanner.title || displayTitle}
                  </h2>
                  <p className="text-[9px] sm:text-[11px] text-slate-200 mt-0.5 font-medium">
                    محبوب‌ترین‌های نوژاشاپ
                  </p>
                </div>
              </div>
            )}

            {/* Product Cards (Left side in RTL) */}
            <div
              ref={scrollContainerRef}
              className="flex-1 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 sm:gap-3 lg:gap-4 items-stretch scroll-smooth"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  onClick={() => onSelectProduct ? onSelectProduct(product) : onQuickView(product)}
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer flex-shrink-0 w-[155px] sm:w-[190px] lg:w-[calc((100%-48px)/4)] snap-start self-stretch"
                >
                  <div>
                    <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-xl bg-slate-50 p-2 flex items-center justify-center w-full shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#0D7366] text-white rounded-md sm:rounded-lg w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-md hover:bg-[#0A584E] active:scale-90 transition-transform z-10 cursor-pointer"
                        title="افزودن"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-[10px] sm:text-xs lg:text-sm text-slate-800 mb-0.5 leading-tight line-clamp-2 group-hover:text-[#0D7366] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[8px] sm:text-[10px] lg:text-xs text-slate-400 mb-1 truncate">{product.brand}</p>

                    <div className="flex items-center gap-0.5 sm:gap-1 mb-1">
                      <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[8px] sm:text-xs font-bold text-slate-700">{product.rating}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
                    {product.discountPercentage && (
                      <span className="bg-emerald-100 text-[#0D7366] px-1.5 py-0.5 rounded text-[9px] font-bold">
                        ٪{product.discountPercentage}
                      </span>
                    )}

                    <div className="text-left flex flex-col items-end">
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="font-extrabold text-xs sm:text-sm text-[#0D7366]">
                        {formatPrice(product.price)}{' '}
                        <span className="text-[10px] font-normal text-slate-400">تومان</span>
                      </span>
                    </div>
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
