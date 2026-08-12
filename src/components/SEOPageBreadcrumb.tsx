import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types';
import { navigateTo } from '../utils/router';

interface SEOPageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const SEOPageBreadcrumb: React.FC<SEOPageBreadcrumbProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto scrollbar-hide py-2 ${className}`}
    >
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigateTo('/');
        }}
        className="flex items-center gap-1 hover:text-[#0D7366] transition-colors shrink-0 font-medium"
        title="صفحه اصلی نوژاشاپ"
      >
        <Home className="w-3.5 h-3.5" />
        <span>خانه</span>
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronLeft className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs" title={item.name}>
                {item.name}
              </span>
            ) : (
              <a
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.url);
                }}
                className="hover:text-[#0D7366] transition-colors truncate max-w-[150px] shrink-0 font-medium"
                title={item.name}
              >
                {item.name}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
