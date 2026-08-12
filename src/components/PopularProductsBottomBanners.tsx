import React, { useEffect, useState } from 'react';
import { DjangoBanner } from '../types';
import { bannerService } from '../services/bannerService';

interface PopularProductsBottomBannersProps {
  onBannerClick?: (linkUrlOrTitle: string) => void;
}

export const PopularProductsBottomBanners: React.FC<PopularProductsBottomBannersProps> = ({ onBannerClick }) => {
  const [banners, setBanners] = useState<DjangoBanner[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const [resQuad, resBottom] = await Promise.all([
          bannerService.getBanners('most_popular_bottom_quad').catch(() => []),
          bannerService.getBanners('most_popular_bottom').catch(() => []),
        ]);

        if (isMounted) {
          if (resQuad.length > 0) {
            setBanners(resQuad);
          } else {
            setBanners(resBottom);
          }
        }
      } catch {
        // silent fallback
      }
    };

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-2 my-4">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {banners.slice(0, 4).map((banner) => (
            <div
              key={banner.id}
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
                  className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
