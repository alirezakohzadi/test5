import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface SupplementBannersRowProps {
  onBannerClick?: (categorySlug: string) => void;
}

export const SupplementBannersRow: React.FC<SupplementBannersRowProps> = ({ onBannerClick }) => {
  const [banners, setBanners] = useState<DjangoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners('supplements_row');
      setBanners(data);
    } catch {
      setError('خطا در بارگذاری بنر');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-2 my-2 bg-white animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="h-28 sm:h-36 bg-slate-200 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (error && banners.length === 0) {
    return null;
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[0];

  return (
    <section className="w-full py-2 my-2 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div
          onClick={() => onBannerClick?.(banner.link_url || banner.title)}
          className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <picture>
            {banner.mobile_image_url && (
              <source media="(max-width: 639px)" srcSet={banner.mobile_image_url} />
            )}
            <img
              src={banner.image_url}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
            />
          </picture>
        </div>
      </div>
    </section>
  );
};

