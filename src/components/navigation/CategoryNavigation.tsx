import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DjangoCategory } from '../../types';
import { fetchCategoriesFromApi, getCachedCategoriesSync } from '../../services/categoryService';
import { CategoryMenuItem } from './CategoryMenuItem';
import { MobileCategoryAccordion } from './MobileCategoryAccordion';

interface CategoryNavigationProps {
  initialCategories?: DjangoCategory[];
  apiUrl?: string;
  onSelectCategory?: (category: DjangoCategory) => void;
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = React.memo(
  ({ initialCategories, apiUrl, onSelectCategory, isMobile = false, onCloseMobileMenu }) => {
    const [categories, setCategories] = useState<DjangoCategory[]>(() => {
      if (initialCategories && initialCategories.length > 0) return initialCategories;
      return getCachedCategoriesSync() || [];
    });
    const [loading, setLoading] = useState<boolean>(!categories.length);

    useEffect(() => {
      let isMounted = true;

      async function loadCategories() {
        if (initialCategories && initialCategories.length > 0) {
          setLoading(false);
          return;
        }

        try {
          const data = await fetchCategoriesFromApi();
          if (isMounted) {
            setCategories(data);
            setLoading(false);
          }
        } catch {
          if (isMounted) setLoading(false);
        }
      }

      loadCategories();

      return () => {
        isMounted = false;
      };
    }, [initialCategories?.length, apiUrl]);

    const handleSelect = useCallback(
      (cat: DjangoCategory) => {
        onSelectCategory?.(cat);
      },
      [onSelectCategory]
    );

    const memoizedCategories = useMemo(() => categories, [categories]);

    // Loading Skeleton
    if (loading && !memoizedCategories.length) {
      if (isMobile) {
        return (
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        );
      }
      return (
        <div className="flex items-center gap-6 py-1 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-6 w-24 bg-slate-100 rounded-lg" />
          ))}
        </div>
      );
    }

    if (isMobile) {
      return (
        <div className="flex flex-col space-y-1">
          {memoizedCategories.map((cat) => (
            <MobileCategoryAccordion
              key={cat.id}
              category={cat}
              onSelectCategory={handleSelect}
              onCloseMenu={onCloseMobileMenu}
            />
          ))}
        </div>
      );
    }

    return (
      <nav className="flex items-center gap-5 xl:gap-7 text-sm font-medium relative">
        {memoizedCategories.map((cat, idx) => (
          <CategoryMenuItem
            key={cat.id}
            category={cat}
            isLastItem={idx >= memoizedCategories.length - 2}
            onSelectCategory={handleSelect}
          />
        ))}
      </nav>
    );
  }
);

CategoryNavigation.displayName = 'CategoryNavigation';
