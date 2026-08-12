import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { DjangoCategory } from '../../types';

interface MobileCategoryAccordionProps {
  category: DjangoCategory;
  onSelectCategory?: (category: DjangoCategory) => void;
  onCloseMenu?: () => void;
  depth?: number;
}

export const MobileCategoryAccordion: React.FC<MobileCategoryAccordionProps> = React.memo(
  ({ category, onSelectCategory, onCloseMenu, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = Boolean(category.children && category.children.length > 0);

    const handleToggle = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
      } else {
        onSelectCategory?.(category);
        onCloseMenu?.();
      }
    };

    const handleLinkClick = (e: React.MouseEvent) => {
      onSelectCategory?.(category);
      onCloseMenu?.();
    };

    const indentPadding = depth === 0 ? 'pr-2' : depth === 1 ? 'pr-4' : depth === 2 ? 'pr-7' : 'pr-10';

    return (
      <div className="border-b border-slate-100/80 last:border-none">
        <div className={`flex items-center justify-between py-2.5 ${indentPadding}`}>
          <a
            href={category.url || `#category-${category.slug}`}
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-slate-700 hover:text-[#0D7366] text-sm font-medium truncate flex-1"
          >
            {category.icon && depth === 0 && (
              <span className="material-symbols-outlined text-[#0D7366] text-lg">
                {category.icon}
              </span>
            )}
            <span className={depth === 0 ? 'font-bold text-slate-800' : 'font-medium'}>
              {category.name}
            </span>
            {category.badge && (
              <span className="bg-amber-100 text-[#8A6D0B] text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#D4AF37]/30">
                {category.badge}
              </span>
            )}
          </a>

          {hasChildren && (
            <button
              onClick={handleToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0D7366] hover:bg-slate-100 transition-colors"
              aria-label={`باز کردن دسته ${category.name}`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#0D7366]' : ''
                }`}
              />
            </button>
          )}
        </div>

        {hasChildren && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-slate-50/70 rounded-xl my-1 border-r-2 border-[#0D7366]/40 mr-2"
              >
                {category.children!.map((child) => (
                  <MobileCategoryAccordion
                    key={child.id}
                    category={child}
                    onSelectCategory={onSelectCategory}
                    onCloseMenu={onCloseMenu}
                    depth={depth + 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }
);

MobileCategoryAccordion.displayName = 'MobileCategoryAccordion';
