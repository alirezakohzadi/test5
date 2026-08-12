import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { homepageService } from '../services/homepageService';
import { bannerService } from '../services/bannerService';
import { HomepageQuickAccessItem, DjangoBanner } from '../types';

interface QuickAccessProps {
  onCategoryClick: (title: string) => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ onCategoryClick, onNavigateCategory }) => {
  const [items, setItems] = useState<HomepageQuickAccessItem[]>([]);
  const [banners, setBanners] = useState<DjangoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [qaRes, bannerRes] = await Promise.allSettled([
        homepageService.getQuickAccessItems(),
        bannerService.getBanners('quick_access'),
      ]);

      if (qaRes.status === 'fulfilled') {
        setItems(qaRes.value);
      }
      if (bannerRes.status === 'fulfilled') {
        setBanners(bannerRes.value);
      }
    } catch {
      setError('خطا در دریافت اطلاعات دسترسی سریع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-4 mb-6 animate-pulse">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
          <div className="flex items-center sm:justify-center gap-5 sm:gap-8 overflow-x-auto py-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[76px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200" />
                <div className="w-12 h-3 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && items.length === 0 && banners.length === 0) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-sm text-rose-500 mb-2">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (items.length === 0 && banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 mb-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Category Icons Row */}
        {items.length > 0 && (
          <div className="flex items-center sm:justify-center gap-5 sm:gap-8 overflow-x-auto scrollbar-hide py-2">
            {items.map((item, idx) => (
              <motion.a
                key={item.id}
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(item.title);
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex flex-col items-center gap-2 sm:gap-2.5 group cursor-pointer flex-shrink-0 min-w-[76px] sm:min-w-[96px]"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0D7366]/20 scale-105" />

                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-md shadow-slate-200/70 border border-slate-100 flex items-center justify-center relative z-10 group-hover:scale-105 group-hover:border-[#0D7366]/40 transition-all duration-300 overflow-hidden p-2">
                    {(() => {
                      const imgUrl = item.image_url || item.image;
                      const iconVal = item.icon || '';
                      if (imgUrl || (iconVal && (iconVal.includes('/') || iconVal.includes('http') || iconVal.includes('.')))) {
                        return (
                          <img
                            src={imgUrl || iconVal}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                          />
                        );
                      }
                      return (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-teal-50/80 text-[#0D7366]">
                          <span className="material-symbols-outlined text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                            {iconVal || 'category'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-[#0D7366] transition-colors text-center whitespace-nowrap">
                  {item.title}
                </span>
              </motion.a>
            ))}
          </div>
        )}

        {/* Banners Directly Under Icons */}
        {banners.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-3 pb-2 sm:pt-5 sm:pb-3">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => {
                  if (onNavigateCategory) {
                    onNavigateCategory(banner.link_url || banner.title);
                  } else {
                    onCategoryClick(banner.title);
                  }
                }}
                className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block object-cover rounded-xl sm:rounded-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


