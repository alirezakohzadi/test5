import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { DjangoCategory } from '../../types';
import { MegaMenuPanel } from './MegaMenuPanel';
import { RecursiveDropdownItem } from './RecursiveDropdownItem';

interface CategoryMenuItemProps {
  category: DjangoCategory;
  isLastItem?: boolean;
  onSelectCategory?: (category: DjangoCategory) => void;
}

export const CategoryMenuItem: React.FC<CategoryMenuItemProps> = React.memo(
  ({ category, isLastItem, onSelectCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hasChildren = Boolean(category.children && category.children.length > 0);

    // Determine if we should use Mega Menu:
    // Category uses Mega Menu if it has children that also have children, or if explicitly marked is_featured
    const isMegaMenu =
      hasChildren &&
      (category.is_featured ||
        category.children!.some((child) => child.children && child.children.length > 0) ||
        category.children!.length >= 4);

    const handleMouseEnter = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hasChildren) {
        setIsOpen(true);
      }
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 180); // Slight delay for smooth cursor traversal
    };

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onSelectCategory?.(category);
    };

    return (
      <div
        className={`${isMegaMenu ? 'static' : 'relative'} group py-1`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a
          href={category.url || `#category-${category.slug}`}
          onClick={handleClick}
          className={`flex items-center gap-1.5 text-slate-700 hover:text-[#0D7366] font-medium text-sm transition-colors py-1 px-1.5 rounded-lg group-hover:bg-[#0D7366]/5 ${
            isOpen ? 'text-[#0D7366] font-semibold' : ''
          }`}
        >
          {category.icon && (
            <span className="material-symbols-outlined text-lg text-[#0D7366] opacity-80 group-hover:opacity-100 transition-opacity">
              {category.icon}
            </span>
          )}
          <span>{category.name}</span>

          {category.badge && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
              {category.badge}
            </span>
          )}

          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D7366] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#0D7366]' : ''
              }`}
            />
          )}

          {/* Underline hover effect */}
          <span
            className={`absolute bottom-0 right-0 h-0.5 bg-[#0D7366] transition-all duration-300 rounded-full ${
              isOpen ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </a>

        {/* Dropdown or Mega Menu */}
        {hasChildren && (
          <AnimatePresence>
            {isOpen &&
              (isMegaMenu ? (
                <MegaMenuPanel
                  category={category}
                  onSelectCategory={onSelectCategory}
                  onClose={() => setIsOpen(false)}
                />
              ) : (
                <motion.ul
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={`absolute top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl shadow-[#0D7366]/10 rounded-2xl p-2 z-50 space-y-0.5 list-none max-h-[75vh] overflow-y-auto scrollbar-thin ${
                    isLastItem ? 'left-0' : 'right-0'
                  }`}
                >
                  {category.children!.map((child) => (
                    <RecursiveDropdownItem
                      key={child.id}
                      category={child}
                      onSelectCategory={onSelectCategory}
                    />
                  ))}
                </motion.ul>
              ))}
          </AnimatePresence>
        )}
      </div>
    );
  }
);

CategoryMenuItem.displayName = 'CategoryMenuItem';
