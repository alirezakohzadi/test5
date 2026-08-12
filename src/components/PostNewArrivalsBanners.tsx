import React, { useEffect, useState } from 'react';
import { DjangoBanner } from '../types';
import { bannerService } from '../services/bannerService';

interface PostNewArrivalsBannersProps {
  onBannerClick?: (linkUrlOrTitle: string) => void;
}

export const PostNewArrivalsBanners: React.FC<PostNewArrivalsBannersProps> = ({ onBannerClick }) => {
  const [full1, setFull1] = useState<DjangoBanner[]>([]);
  const [doubleBanners, setDoubleBanners] = useState<DjangoBanner[]>([]);
  const [quadBanners, setQuadBanners] = useState<DjangoBanner[]>([]);
  const [full2, setFull2] = useState<DjangoBanner[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAllBanners = async () => {
      try {
        const [resFull1, resDouble, resQuad, resFull2] = await Promise.all([
          bannerService.getBanners('new_arrivals_full_1').catch(() => []),
          bannerService.getBanners('new_arrivals_double').catch(() => []),
          bannerService.getBanners('new_arrivals_quad').catch(() => []),
          bannerService.getBanners('new_arrivals_full_2').catch(() => []),
        ]);

        if (isMounted) {
          setFull1(resFull1);
          setDoubleBanners(resDouble);
          setQuadBanners(resQuad);
          setFull2(resFull2);
        }
      } catch {
        // Ignore or handle error silently
      }
    };

    fetchAllBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full space-y-4 my-4">
      {/* 1. First Single Full Width Banner */}
      {full1.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div
              onClick={() => onBannerClick?.(full1[0].link_url || full1[0].title)}
              className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <picture>
                {full1[0].mobile_image_url && (
                  <source media="(max-width: 639px)" srcSet={full1[0].mobile_image_url} />
                )}
                <img
                  src={full1[0].image_url}
                  alt={full1[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                />
              </picture>
            </div>
          </div>
        </section>
      )}

      {/* 2. Two Banners in 1 Row */}
      {doubleBanners.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {doubleBanners.slice(0, 2).map((banner) => (
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

      {/* 3. Four Banners in 1 Row */}
      {quadBanners.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {quadBanners.slice(0, 4).map((banner) => (
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
      )}

      {/* 4. Second Single Full Width Banner */}
      {full2.length > 0 && (
        <section className="w-full bg-white py-1">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div
              onClick={() => onBannerClick?.(full2[0].link_url || full2[0].title)}
              className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <picture>
                {full2[0].mobile_image_url && (
                  <source media="(max-width: 639px)" srcSet={full2[0].mobile_image_url} />
                )}
                <img
                  src={full2[0].image_url}
                  alt={full2[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover block rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                />
              </picture>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
