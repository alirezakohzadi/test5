import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Product, HomepageProductSection, DjangoBanner } from '../types';
import { homepageService } from '../services/homepageService';
import { bannerService } from '../services/bannerService';

interface NewArrivalsSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigateCategory,
}) => {
  const [sectionConfig, setSectionConfig] = useState<HomepageProductSection | null>(null);
  const [topBanner, setTopBanner] = useState<DjangoBanner | null>(null);
  const [bottomBanner, setBottomBanner] = useState<DjangoBanner | null>(null);
  const [verticalBanner, setVerticalBanner] = useState<DjangoBanner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadSectionData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [configRes, topBannerRes, vertBannerRes, botBannerRes] = await Promise.allSettled([
        homepageService.getSectionConfig('new_arrivals'),
        bannerService.getBanners('new_arrivals_top'),
        bannerService.getBanners('new_arrivals_vertical'),
        bannerService.getBanners('new_arrivals_bottom'),
      ]);

      if (configRes.status === 'fulfilled') {
        setSectionConfig(configRes.value);
      }
      if (topBannerRes.status === 'fulfilled' && topBannerRes.value.length > 0) {
        setTopBanner(topBannerRes.value[0]);
      } else {
        setTopBanner(null);
      }
      if (vertBannerRes.status === 'fulfilled' && vertBannerRes.value.length > 0) {
        setVerticalBanner(vertBannerRes.value[0]);
      } else {
        setVerticalBanner(null);
      }
      if (botBannerRes.status === 'fulfilled' && botBannerRes.value.length > 0) {
        setBottomBanner(botBannerRes.value[0]);
      } else {
        setBottomBanner(null);
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
  const displayTitle = sectionConfig?.title || 'جدیدترین محصولات';

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <section className="w-full py-6 mb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Top Banner 1: SunSafe / New Arrivals */}
        {topBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => onNavigateCategory?.(topBanner.link_url || 'sunsafe-maquisun')}
            className="relative aspect-[21/9] sm:aspect-[24/8] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer mb-5 shadow-xs hover:shadow-md transition-shadow"
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

        {/* New Arrivals Title Bar & Slider Container (Inside the two banners) */}
        <div className="mb-5 bg-slate-50/70 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100/90 shadow-2xs">
          <div className="mb-3.5 border-b border-slate-200/80 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-base sm:text-lg font-black text-[#0D7366]">{displayTitle}</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">تازه رسیده‌های انبارهای نوژاشاپ</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-56" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
              <p className="font-semibold text-sm mb-3">خطا در دریافت جدیدترین محصولات</p>
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
              {/* Vertical Poster Banner */}
              {verticalBanner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  onClick={() => onNavigateCategory?.(verticalBanner.link_url || 'new-arrivals')}
                  className="w-[140px] sm:w-[185px] lg:w-[230px] flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden relative group cursor-pointer shadow-xs hover:shadow-md transition-all border border-slate-200/60 self-stretch"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-2.5 sm:p-3.5 pointer-events-none z-10">
                    <span className="text-[10px] sm:text-xs font-black text-white bg-[#0D7366] px-2 py-0.5 rounded-md self-start mb-1 shadow-xs">
                      {verticalBanner.badge_text || 'جدیدترین‌ها'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-sm">
                      {verticalBanner.title || 'مجموعه محصولات جدید'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Horizontal Slider of Cards */}
              <div className="flex-1 min-w-0 flex gap-2 sm:gap-3.5 overflow-x-auto scrollbar-hide snap-x items-stretch">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    onClick={() => onSelectProduct ? onSelectProduct(product) : onQuickView(product)}
                    className="flex-shrink-0 w-[155px] sm:w-[190px] lg:w-[220px] bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs hover:shadow-lg transition-all group cursor-pointer border border-slate-100 flex flex-col justify-between snap-start self-stretch"
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2 sm:mb-3 bg-slate-50 p-2 flex items-center justify-center w-full shrink-0">
                        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#0D7366] text-white text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded z-10">
                          جدید
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <span className="text-[8px] sm:text-[10px] text-slate-400 font-semibold truncate block">{product.brand}</span>
                      <h4 className="font-bold text-[10px] sm:text-xs text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-[#0D7366] transition-colors">
                        {product.name}
                      </h4>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between mt-1">
                      <span className="font-extrabold text-[10px] sm:text-xs lg:text-sm text-[#0D7366]">
                        {formatPrice(product.price)}{' '}
                        <span className="text-[8px] sm:text-[10px] font-normal text-slate-400">تومان</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#0D7366] text-white flex items-center justify-center hover:bg-[#0A584E] active:scale-90 transition-transform shadow-sm flex-shrink-0 cursor-pointer"
                        title="افزودن به سبد"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner 2: Hydroderm / Essence */}
        {bottomBanner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => onNavigateCategory?.(bottomBanner.link_url || 'hydroderm-essence')}
            className="relative aspect-[21/9] sm:aspect-[24/8] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-shadow"
          >
            <picture className="w-full h-full block">
              {bottomBanner.mobile_image_url && (
                <source media="(max-width: 639px)" srcSet={bottomBanner.mobile_image_url} />
              )}
              <img
                src={bottomBanner.image_url}
                alt={bottomBanner.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </picture>
          </motion.div>
        )}
      </div>
    </section>
  );
};
