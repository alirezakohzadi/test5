import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface HydrodermSplashBannerProps {
  onBannerClick?: () => void;
}

export const HydrodermSplashBanner: React.FC<HydrodermSplashBannerProps> = ({ onBannerClick }) => {
  const [banner, setBanner] = useState<DjangoBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanner = async () => {
    setLoading(true);
    setError(null);
    try {
      const banners = await bannerService.getBanners('splash');
      if (banners && banners.length > 0) {
        setBanner(banners[0]);
      }
    } catch {
      setError('خطا در بارگذاری بنر اسپلش');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-4 mb-8 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="w-full aspect-[4/1] bg-slate-200 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (error && !banner) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-xs text-rose-500 mb-1">{error}</p>
        <button
          onClick={loadBanner}
          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تلاش مجدد</span>
        </button>
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
    <section className="w-full py-4 mb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onClick={onBannerClick}
          className="relative w-full aspect-[21/9] sm:aspect-[4/1] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
        >
          <picture className="w-full h-full">
            {banner.mobile_image_url && (
              <source media="(max-width: 639px)" srcSet={banner.mobile_image_url} />
            )}
            <img
              src={banner.image_url}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
        </motion.div>
      </div>
    </section>
  );
};

