import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Product, HomepageProductSection } from '../types';
import { homepageService } from '../services/homepageService';

interface ProductHighlightsProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductHighlights: React.FC<ProductHighlightsProps> = ({
  onQuickView,
  onAddToCart,
  onSelectProduct,
}) => {
  const [sectionConfig, setSectionConfig] = useState<HomepageProductSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadSectionData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const config = await homepageService.getSectionConfig('highlights');
      setSectionConfig(config);
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
  const displayTitle = sectionConfig?.title || 'برجسته‌ترین محصولات سلامتی و زیبایی';

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handleCardClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onQuickView(product);
    }
  };

  return (
    <section className="w-full py-6 mb-8 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-200/60">
          <div>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
              SPOTLIGHT COLLECTION
            </span>
            <h2 className="text-lg font-black text-slate-800">{displayTitle}</h2>
          </div>
          <span className="text-xs font-medium text-slate-400 block">انتخاب اختصاصی کارشناسان نوژاشاپ</span>
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
            <p className="font-semibold text-sm mb-3">خطا در دریافت لیست محصولات برجسته</p>
            <button
              onClick={loadSectionData}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-sm">
            محصولی جهت نمایش یافت نشد.
          </div>
        ) : (
          <div className="flex overflow-x-auto scrollbar-hide snap-x gap-2 sm:gap-3.5 lg:grid lg:grid-cols-4 lg:gap-4 pb-2">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                onClick={() => handleCardClick(product)}
                className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-100 shadow-xs hover:shadow-lg hover:border-[#0D7366]/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden flex-shrink-0 w-[155px] sm:w-[190px] lg:w-auto lg:flex-shrink snap-start cursor-pointer"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 sm:mb-3 bg-slate-50 w-full shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 z-20 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-white text-slate-800 hover:bg-[#0D7366] hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
                      title="مشاهده سریع"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-[#0D7366] text-white hover:bg-[#0A584E] transition-all shadow-md active:scale-95 cursor-pointer"
                      title="افزودن به سبد"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {product.discountPercentage && (
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-rose-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm">
                      ٪{product.discountPercentage}
                    </span>
                  )}
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-semibold mb-0.5">
                      <span className="truncate max-w-[50px] sm:max-w-none">{product.brand}</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold bg-amber-50 px-1 py-0.5 rounded text-[8px] sm:text-[9px]">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>

                    <h3 className="font-bold text-[10px] sm:text-xs text-slate-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-[#0D7366] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
                    <div>
                      {product.originalPrice && (
                        <span className="text-[8px] sm:text-[10px] text-slate-400 line-through block -mb-0.5">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="font-extrabold text-[10px] sm:text-xs lg:text-sm text-[#0D7366]">
                        {formatPrice(product.price)}{' '}
                        <span className="text-[8px] sm:text-[10px] font-normal text-slate-400">تومان</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#0D7366] text-white flex items-center justify-center hover:bg-[#0A584E] active:scale-90 transition-transform shadow-xs shrink-0 cursor-pointer"
                      title="افزودن به سبد"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
