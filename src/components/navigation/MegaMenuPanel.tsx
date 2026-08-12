import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowLeft, Sparkles } from 'lucide-react';
import { DjangoCategory } from '../../types';

interface MegaMenuPanelProps {
  category: DjangoCategory;
  onSelectCategory?: (category: DjangoCategory) => void;
  onClose?: () => void;
}

export const MegaMenuPanel: React.FC<MegaMenuPanelProps> = React.memo(
  ({ category, onSelectCategory, onClose }) => {
    const children = category.children || [];
    const hasFeaturedCard = Boolean(category.image || category.description);

    const handleCategoryClick = (cat: DjangoCategory, e: React.MouseEvent) => {
      if (!cat.url || !cat.url.startsWith('#')) {
        e.preventDefault();
      }
      onSelectCategory?.(cat);
      onClose?.();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full right-0 mt-2 w-[720px] lg:w-[920px] xl:w-[1060px] max-w-full bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-[#0D7366]/10 rounded-3xl p-6 z-50 text-right grid grid-cols-12 gap-6 overflow-hidden"
      >
        {/* Main Categories Columns Grid */}
        <div
          className={`${
            hasFeaturedCard ? 'col-span-8 lg:col-span-9' : 'col-span-12'
          } grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[68vh] overflow-y-auto pr-1 scrollbar-thin`}
        >
          {children.map((subCat) => (
            <div key={subCat.id} className="space-y-2.5">
              {/* Level 2 Subcategory Header */}
              <a
                href={subCat.url || `#category-${subCat.slug}`}
                onClick={(e) => handleCategoryClick(subCat, e)}
                className="group flex items-center justify-between font-bold text-sm text-slate-800 hover:text-[#0D7366] pb-1.5 border-b border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {subCat.icon && (
                    <span className="material-symbols-outlined text-[#0D7366] text-lg font-normal">
                      {subCat.icon}
                    </span>
                  )}
                  <span className="truncate">{subCat.name}</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D7366] group-hover:-translate-x-1 transition-all" />
              </a>

              {/* Level 3 & Level 4 Items (Recursive rendering or list) */}
              {subCat.children && subCat.children.length > 0 && (
                <ul className="space-y-1.5 pt-0.5">
                  {subCat.children.map((child) => (
                    <li key={child.id} className="list-none">
                      <a
                        href={child.url || `#category-${child.slug}`}
                        onClick={(e) => handleCategoryClick(child, e)}
                        className="group/child flex items-center justify-between text-xs font-medium text-slate-600 hover:text-[#0D7366] py-1 px-2 rounded-lg hover:bg-slate-50 transition-all"
                      >
                        <span className="truncate group-hover/child:translate-x-[-2px] transition-transform">
                          {child.name}
                        </span>
                        {child.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-[#8A6D0B] border border-amber-200/50">
                            {child.badge}
                          </span>
                        )}
                      </a>

                      {/* Level 4 Nested Inline Links (if present) */}
                      {child.children && child.children.length > 0 && (
                        <div className="mr-3 pr-2 border-r border-slate-100 mt-1 space-y-1">
                          {child.children.map((grandChild) => (
                            <a
                              key={grandChild.id}
                              href={grandChild.url || `#category-${grandChild.slug}`}
                              onClick={(e) => handleCategoryClick(grandChild, e)}
                              className="block text-[11px] text-slate-500 hover:text-[#0D7366] py-0.5 truncate transition-colors"
                            >
                              • {grandChild.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Featured Category Card (Right Column in Persian RTL) */}
        {hasFeaturedCard && (
          <div className="col-span-4 lg:col-span-3 bg-gradient-to-br from-slate-900 via-[#0A4D45] to-[#0D7366] text-white rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg group">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-0" />

            <div className="relative z-10 space-y-2">
              {category.badge && (
                <span className="inline-flex items-center gap-1 bg-[#D4AF37] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3 h-3" />
                  {category.badge}
                </span>
              )}
              <h4 className="font-extrabold text-lg text-white leading-tight">
                {category.name}
              </h4>
              {category.description && (
                <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-3 font-normal">
                  {category.description}
                </p>
              )}
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 mt-4">
              <a
                href={category.url || `#category-${category.slug}`}
                onClick={(e) => handleCategoryClick(category, e)}
                className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all text-xs font-bold active:scale-95 group/btn"
              >
                <span>مشاهده همه محصولات</span>
                <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover/btn:-translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

MegaMenuPanel.displayName = 'MegaMenuPanel';
