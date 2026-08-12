import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { DjangoCategory } from '../types';

interface CircleCategorySliderProps {
  onSelectCategory?: (title: string) => void;
}

export const CircleCategorySlider: React.FC<CircleCategorySliderProps> = ({
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<DjangoCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch {
      setError('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="w-full py-4 mb-8 bg-white border-y border-slate-100 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex justify-around items-center gap-4 py-1">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="w-16 h-16 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-xs text-rose-500 mb-1">{error}</p>
        <button
          onClick={loadCategories}
          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>تلاش مجدد</span>
        </button>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-4 mb-8 bg-white border-y border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D7366] hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex justify-around items-center gap-4 overflow-x-auto scrollbar-hide py-1"
          >
            {categories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                onClick={() => {
                  if (cat.url) {
                    if (onSelectCategory) onSelectCategory(cat.url);
                  } else if (cat.slug) {
                    if (onSelectCategory) onSelectCategory(cat.slug);
                  } else {
                    if (onSelectCategory) onSelectCategory(cat.name);
                  }
                }}
                className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[60px] sm:min-w-[76px] group cursor-pointer"
              >
                <div
                  className="w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] rounded-full bg-emerald-50/80 flex items-center justify-center p-1 sm:p-1.5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-[#D4AF37] overflow-hidden"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[#0D7366] text-2xl sm:text-3xl">
                      category
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[11px] font-semibold text-slate-700 group-hover:text-[#0D7366] transition-colors text-center line-clamp-1">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D7366] hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

