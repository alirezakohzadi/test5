import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { homepageService } from '../services/homepageService';
import { HomepageProductGroup } from '../types';

interface NewestProductGroupsProps {
  onSelectCategory?: (title: string) => void;
}

export const NewestProductGroups: React.FC<NewestProductGroupsProps> = ({ onSelectCategory }) => {
  const [groups, setGroups] = useState<HomepageProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homepageService.getProductGroups();
      setGroups(data);
    } catch {
      setError('خطا در دریافت گروه‌های محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-6 mb-8 animate-pulse">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="h-6 w-48 bg-slate-200 rounded mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-100 h-40 rounded-2xl p-4" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && groups.length === 0) {
    return (
      <div className="w-full py-6 text-center">
        <p className="text-sm text-rose-500 mb-2">{error}</p>
        <button
          onClick={loadGroups}
          className="px-4 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-6 mb-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-200/80 pb-3">
          <h2 className="text-base sm:text-lg font-black text-[#0D7366]">
            جدیدترین گروه‌های محصولات
          </h2>
          <a
            href="#all"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory?.('همه');
            }}
            className="text-xs font-bold text-[#0D7366] hover:text-[#0A584E] transition-colors flex items-center gap-1"
          >
            <span>مشاهده همه دسته‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grid of Product Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, groupIdx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIdx * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#0D7366]/20 transition-all group cursor-pointer"
              onClick={() => onSelectCategory?.(group.slug || group.title)}
            >
              <h3 className="text-sm font-bold text-slate-800 text-center mb-4 group-hover:text-[#0D7366] transition-colors">
                {group.title}
              </h3>

              {group.products && group.products.length > 0 ? (
                <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                  {group.products.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory?.(item.name);
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group/item"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D4AF37] p-0.5 overflow-hidden shadow-sm group-hover/item:border-[#0D7366] group-hover/item:scale-105 transition-all">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-slate-600 text-center line-clamp-1 font-medium group-hover/item:text-[#0D7366] transition-colors">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  {group.image && (
                    <div className="w-16 h-16 rounded-full border border-[#D4AF37] p-0.5 overflow-hidden">
                      <img
                        src={group.image}
                        alt={group.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                  {group.description && (
                    <p className="text-xs text-slate-500 text-center line-clamp-2">
                      {group.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

