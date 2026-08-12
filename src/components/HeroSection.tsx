import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import { DjangoBanner } from '../types';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onNavigateCategory?: (categorySlug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreProducts, onNavigateCategory }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<DjangoBanner[]>([]);
  const [sidebarBanner, setSidebarBanner] = useState<DjangoBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const [heroRes, sidebarRes] = await Promise.allSettled([
        bannerService.getBanners('main_slider').then((res) => (res.length > 0 ? res : bannerService.getBanners('hero'))),
        bannerService.getBanners('main_side').then((res) => (res.length > 0 ? res : bannerService.getBanners('sidebar'))),
      ]);

      if (heroRes.status === 'fulfilled' && heroRes.value.length > 0) {
        setSlides(heroRes.value);
      }
      if (sidebarRes.status === 'fulfilled' && sidebarRes.value.length > 0) {
        setSidebarBanner(sidebarRes.value[0]);
      }
    } catch {
      setError('خطا در بارگذاری بنرهای اصلی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="w-full mb-8 pt-2 sm:pt-3 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full sm:w-[30%] h-[150px] sm:h-[270px] lg:h-[320px] bg-slate-200 rounded-2xl" />
            <div className="w-full sm:w-[70%] h-[165px] sm:h-[270px] lg:h-[320px] bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error && slides.length === 0 && !sidebarBanner) {
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

  if (slides.length === 0 && !sidebarBanner) {
    return null;
  }

  return (
    <section className="w-full mb-8 pt-2 sm:pt-3">
      <h1 className="sr-only">
        داروخانه آنلاین و مرجع تخصصی سلامت، زیبایی و مکمل‌های دارویی نوژاشاپ
      </h1>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Left Sidebar Banner */}
          {sidebarBanner && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() =>
                sidebarBanner.link_url
                  ? onNavigateCategory?.(sidebarBanner.link_url)
                  : onExploreProducts()
              }
              className="w-full sm:w-[30%] lg:w-[28%] h-[150px] sm:h-[270px] lg:h-[320px] rounded-xl sm:rounded-2xl overflow-hidden relative group cursor-pointer"
            >
              <picture className="w-full h-full block">
                {sidebarBanner.mobile_image_url && (
                  <source media="(max-width: 639px)" srcSet={sidebarBanner.mobile_image_url} />
                )}
                <img
                  src={sidebarBanner.image_url}
                  alt={sidebarBanner.title}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </picture>
            </motion.div>
          )}

          {/* Right Main Hero Banner Slider */}
          {slides.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`w-full ${
                sidebarBanner ? 'sm:w-[70%] lg:w-[72%]' : 'w-full'
              } h-[165px] sm:h-[270px] lg:h-[320px] rounded-xl sm:rounded-2xl overflow-hidden relative group`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() =>
                    slides[activeSlide]?.link_url
                      ? onNavigateCategory?.(slides[activeSlide].link_url)
                      : onExploreProducts()
                  }
                  className="absolute inset-0 cursor-pointer"
                >
                  <picture className="w-full h-full block">
                    {slides[activeSlide]?.mobile_image_url && (
                      <source media="(max-width: 639px)" srcSet={slides[activeSlide].mobile_image_url} />
                    )}
                    <img
                      src={slides[activeSlide]?.image_url}
                      alt={slides[activeSlide]?.title}
                      loading={activeSlide === 0 ? "eager" : "lazy"}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {slides.length > 1 && (
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeSlide === idx ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/60 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                      }
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

