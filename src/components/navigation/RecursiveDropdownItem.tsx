import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { DjangoCategory } from '../../types';

interface RecursiveDropdownItemProps {
  category: DjangoCategory;
  onSelectCategory?: (category: DjangoCategory) => void;
  depth?: number;
}

export const RecursiveDropdownItem: React.FC<RecursiveDropdownItemProps> = React.memo(
  ({ category, onSelectCategory, depth = 0 }) => {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const hasChildren = Boolean(category.children && category.children.length > 0);

    const handleMouseEnter = () => {
      if (hasChildren) setIsSubmenuOpen(true);
    };

    const handleMouseLeave = () => {
      if (hasChildren) setIsSubmenuOpen(false);
    };

    const handleClick = (e: React.MouseEvent) => {
      if (category.url && category.url.startsWith('#')) {
        // Allow anchor links
      } else {
        e.preventDefault();
      }
      onSelectCategory?.(category);
    };

    return (
      <li
        className="relative group/item list-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          href={category.url || `#category-${category.slug}`}
          onClick={handleClick}
          className="flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#0D7366] hover:bg-[#0D7366]/5 rounded-xl transition-all duration-150 group-hover/item:pr-5"
        >
          <div className="flex items-center gap-2 truncate">
            {category.icon && (
              <span className="material-symbols-outlined text-[#0D7366] text-lg font-normal">
                {category.icon}
              </span>
            )}
            <span className="truncate">{category.name}</span>
            {category.badge && (
              <span className="bg-amber-100 text-[#8A6D0B] text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#D4AF37]/30">
                {category.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            {category.product_count !== undefined && (
              <span className="text-[10px] font-normal text-slate-400">
                ({category.product_count})
              </span>
            )}
            {hasChildren && (
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover/item:text-[#0D7366] transition-transform group-hover/item:-translate-x-0.5" />
            )}
          </div>
        </a>

        {/* Recursive Submenu Flyout (Supports unlimited depth) */}
        {hasChildren && (
          <AnimatePresence>
            {isSubmenuOpen && (
              <motion.ul
                initial={{ opacity: 0, x: 8, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-full top-0 -mr-1 w-56 sm:w-64 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-xl shadow-[#0D7366]/10 rounded-2xl p-2 z-50 space-y-0.5 max-h-[75vh] overflow-y-auto scrollbar-thin"
              >
                {category.children!.map((child) => (
                  <RecursiveDropdownItem
                    key={child.id}
                    category={child}
                    onSelectCategory={onSelectCategory}
                    depth={depth + 1}
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  }
);

RecursiveDropdownItem.displayName = 'RecursiveDropdownItem';
