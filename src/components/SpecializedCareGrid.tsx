import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface SpecializedCareGridProps {
  onExploreCategory?: (category: string) => void;
}

export const SpecializedCareGrid: React.FC<SpecializedCareGridProps> = ({
  onExploreCategory,
}) => {
  const [banners, setBanners] = useState<DjangoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners('specialized_care').then((res) => (res.length > 0 ? res : bannerService.getBanners('specialized')));
      setBanners(data);
    } catch {
      setError('خطا در بارگذاری بنرهای مراقبت تخصصی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-6 mb-8 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && banners.length === 0) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-xs text-rose-500 mb-1">{error}</p>
        <button
          onClick={loadBanners}
          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تلاش مجدد</span>
        </button>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-6 mb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onExploreCategory?.(banner.link_url || banner.title)}
              className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-slate-100 shadow-xs hover:shadow-md transition-all"
            >
              <picture>
                {banner.mobile_image_url && (
                  <source media="(max-width: 639px)" srcSet={banner.mobile_image_url} />
                )}
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block object-cover rounded-xl sm:rounded-2xl"
                />
              </picture>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

