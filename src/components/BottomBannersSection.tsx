import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface BottomBannersProps {
  onBannerClick?: (title: string) => void;
}

export const BottomBannersSection: React.FC<BottomBannersProps> = ({ onBannerClick }) => {
  const [banners, setBanners] = useState<DjangoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners('bottom_row').then((res) => (res.length > 0 ? res : bannerService.getBanners('bottom')));
      setBanners(data);
    } catch {
      setError('خطا در بارگذاری بنرهای پایینی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-4 mb-6 bg-white border-t border-slate-100 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[16/7] rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && banners.length === 0) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-sm text-rose-500 mb-2">{error}</p>
        <button
          onClick={loadBanners}
          className="px-4 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تلاش مجدد</span>
        </button>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 mb-6 bg-white border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {banners.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onBannerClick?.(item.link_url || item.title)}
              className="relative aspect-[16/8] sm:aspect-[16/7] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all border border-slate-100"
            >
              <picture className="w-full h-full">
                {item.mobile_image_url && (
                  <source media="(max-width: 639px)" srcSet={item.mobile_image_url} />
                )}
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </picture>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

