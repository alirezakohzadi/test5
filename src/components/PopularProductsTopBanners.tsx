import React, { useEffect, useState } from 'react';
import { DjangoBanner } from '../types';
import { bannerService } from '../services/bannerService';

interface PopularProductsTopBannersProps {
  onBannerClick?: (linkUrlOrTitle: string) => void;
}

export const PopularProductsTopBanners: React.FC<PopularProductsTopBannersProps> = ({ onBannerClick }) => {
  const [row1, setRow1] = useState<DjangoBanner[]>([]);
  const [row2, setRow2] = useState<DjangoBanner[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const [resRow1, resRow2, resGeneral] = await Promise.all([
          bannerService.getBanners('most_popular_top_row1').catch(() => []),
          bannerService.getBanners('most_popular_top_row2').catch(() => []),
          bannerService.getBanners('most_popular_top').catch(() => []),
        ]);

        if (isMounted) {
          if (resRow1.length > 0 || resRow2.length > 0) {
            setRow1(resRow1);
            setRow2(resRow2);
          } else if (resGeneral.length > 0) {
            // Split 4 banners into 2 rows of 2
            setRow1(resGeneral.slice(0, 2));
            setRow2(resGeneral.slice(2, 4));
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

  if (row1.length === 0 && row2.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3 sm:space-y-4 my-4">
      {/* Row 1: Two banners */}
      {row1.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {row1.slice(0, 2).map((banner) => (
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
                      className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Row 2: Two banners */}
      {row2.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {row2.slice(0, 2).map((banner) => (
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
                      className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
