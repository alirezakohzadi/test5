import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingBag, RefreshCw } from 'lucide-react';
import { homepageService } from '../services/homepageService';
import { Product, HomepageProductSection } from '../types';

interface MostPopularSectionProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const MostPopularSection: React.FC<MostPopularSectionProps> = ({
  onQuickView,
  onAddToCart,
  onSelectProduct,
}) => {
  const [sectionConfig, setSectionConfig] = useState<HomepageProductSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const loadPopularProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = await homepageService.getSectionConfig('most_popular');
      setSectionConfig(config);
    } catch {
      setError('خطا در دریافت لیست محبوب‌ترین محصولات از سرور.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularProducts();
  }, [loadPopularProducts]);

  if (!loading && sectionConfig && sectionConfig.is_active === false) {
    return null;
  }

  const popularProducts = sectionConfig?.products || [];
  const displayTitle = sectionConfig?.title || 'محبوب‌ترین محصولات';

  return (
    <section className="w-full py-6 mb-8 bg-slate-50/50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-[#0D7366]/10">
          <h2 className="text-base sm:text-lg font-black text-[#0D7366]">
            {displayTitle}
          </h2>
          <div className="flex items-center gap-1 text-[#8A6D0B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 text-[11px] font-bold">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>انتخاب خریداران نوژاشاپ</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-64 border border-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100 text-center space-y-3">
            <p className="text-xs sm:text-sm font-bold text-rose-700">{error}</p>
            <button
              onClick={loadPopularProducts}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">هیچ محصولی یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-4.5 pb-2">
            {popularProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onSelectProduct ? onSelectProduct(product) : onQuickView(product)}
                className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-slate-100 cursor-pointer"
              >
                {product.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="gold-badge text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                )}

                <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-xl bg-slate-50 p-2 flex items-center justify-center w-full shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block mb-0.5 truncate">
                      {product.brand}
                    </span>
                    <h3 className="font-bold text-[10px] sm:text-xs text-slate-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-[#0D7366] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      <span className="font-black text-[11px] sm:text-xs lg:text-sm text-[#0D7366]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-400">تومان</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="bg-[#0D7366] text-white p-1 sm:p-1.5 rounded-md hover:bg-[#0A584E] active:scale-95 transition-all shadow-sm"
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
