import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  ShoppingBag,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
  Tag,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
  LayoutGrid,
  List,
  Percent,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Product, Brand, DjangoCategory } from '../types';
import { productService } from '../services/productService';
import { categoryService, fetchCategoriesFromApi } from '../services/categoryService';
import { brandService } from '../services/brandService';

interface ShopPageProps {
  products?: Product[];
  initialCategory?: string;
  initialBrand?: string;
  initialQuery?: string;
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = '',
  initialBrand = '',
  initialQuery = '',
  onBackToHome,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onShowToast,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Sorting & View States
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination & API Response States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Sidebar dynamic options
  const [categoriesList, setCategoriesList] = useState<DjangoCategory[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);

  // Mobile Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Category & Brand Search inputs in sidebar
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [brandSearch, setBrandSearch] = useState<string>('');

  // Fetch sidebar options once
  useEffect(() => {
    fetchCategoriesFromApi().then((cats) => setCategoriesList(cats)).catch(() => {});
    brandService.getBrands().then((b) => setBrandsList(b)).catch(() => {});
  }, []);

  // Map sorting options to Django ordering parameter
  const getOrderingParam = (sort: string): 'price' | '-price' | 'rating' | '-rating' | 'created_at' | '-created_at' | 'popularity' => {
    switch (sort) {
      case 'price-asc': return 'price';
      case 'price-desc': return '-price';
      case 'newest': return '-created_at';
      case 'rating': return '-rating';
      default: return 'popularity';
    }
  };

  // Master Products Fetcher from API Service
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await productService.getProducts({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
        category_slug: selectedCategory || undefined,
        brand_slug: selectedBrand || undefined,
        min_price: minPrice !== '' ? Number(minPrice) : undefined,
        max_price: maxPrice !== '' ? Number(maxPrice) : undefined,
        in_stock: onlyInStock || undefined,
        is_discounted: onlyDiscounted || undefined,
        ordering: getOrderingParam(sortBy),
      });

      setApiProducts(response.results);
      setTotalCount(response.count);
      setTotalPages(response.total_pages || Math.ceil(response.count / pageSize) || 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    onlyInStock,
    onlyDiscounted,
    sortBy,
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setMinRating(0);
    setSortBy('popular');
    setCurrentPage(1);
    onShowToast('بازنشانی فیلترها', 'تمام فیلترها با موفقیت پاک شدند.', 'info');
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
      selectedBrand ||
      searchQuery ||
      onlyInStock ||
      onlyDiscounted ||
      minRating > 0 ||
      minPrice !== '' ||
      maxPrice !== ''
  );

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categoriesList;
    return categoriesList.filter((c) => c.name.toLowerCase().includes(categorySearch.toLowerCase().trim()));
  }, [categoriesList, categorySearch]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brandsList;
    return brandsList.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [brandsList, brandSearch]);

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="w-full bg-slate-50/60 pb-24 pt-3 sm:pt-6 dir-rtl">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Breadcrumb & Store Title */}
        <div className="bg-gradient-to-r from-[#0D7366] via-[#129383] to-[#0D7366] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -ml-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl -mr-20 -mb-20 pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="hover:underline text-emerald-100 font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                صفحه اصلی
              </button>
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-200" />
              <span className="font-extrabold text-white">فروشگاه تخصصی محصولات دارویی و بهداشتی</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black border border-white/20 shadow-inner">
                {totalCount.toLocaleString('fa-IR')} محصول یافت شد
              </span>
            </div>
          </div>

          <div className="space-y-1.5 relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              فروشگاه آنلاین داروخانه نوژاشاپ
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-3xl leading-relaxed">
              مرجع جامع مکمل‌های ورزشی و دارویی، مراقبت پوستی تخصصی، آرایشی و ملزومات کودک با ضمانت اصالت فیزیکی و برچسب شبنم سازمان غذا و دارو
            </p>
          </div>
        </div>

        {/* Filter Controls Header Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <input
                type="text"
                placeholder="جستجوی نام کالا، برند یا دسته‌بندی..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
                className="w-full h-11 pr-10 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D7366] focus:bg-white text-xs font-bold outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleFilterChange();
                  }}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0D7366] shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="نمایش شبکه‌ای"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0D7366] shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="نمایش لیستی"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-500 whitespace-nowrap hidden sm:inline-flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#0D7366]" />
                مرتب‌سازی:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  handleFilterChange();
                }}
                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs outline-none focus:border-[#0D7366] cursor-pointer"
              >
                <option value="popular">پیش‌فرض (محبوب‌ترین)</option>
                <option value="newest">جدیدترین محصولات</option>
                <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
                <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
                <option value="rating">بالاترین امتیاز کاربران</option>
              </select>
            </div>

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 h-11 rounded-xl bg-[#0D7366] text-white font-extrabold text-xs shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>فیلترها ({hasActiveFilters ? 'فعال' : 'همه'})</span>
            </button>
          </div>

          {/* Page Stats Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium gap-2">
            <div>
              نمایش <strong className="text-slate-800 font-black">{totalCount > 0 ? startIndex + 1 : 0}</strong> تا{' '}
              <strong className="text-slate-800 font-black">
                {Math.min(startIndex + pageSize, totalCount)}
              </strong>{' '}
              از کل <strong className="text-[#0D7366] font-black">{totalCount.toLocaleString('fa-IR')}</strong> کالا
            </div>

            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2">
              <span>تعداد در صفحه:</span>
              {[6, 9, 12, 18].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pageSize === size
                      ? 'bg-[#0D7366] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs">
            <span className="font-extrabold text-[#0D7366] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              فیلترهای اعمال‌شده:
            </span>

            {selectedCategory && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                دسته: <strong className="text-[#0D7366]">{selectedCategory}</strong>
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setSelectedCategory('');
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            {selectedBrand && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                برند: <strong className="text-[#0D7366]">{selectedBrand}</strong>
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setSelectedBrand('');
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            {minPrice !== '' && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                حداقل قیمت: <strong className="text-[#0D7366]">{formatPrice(Number(minPrice))} تومان</strong>
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setMinPrice('');
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            {maxPrice !== '' && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                حداکثر قیمت: <strong className="text-[#0D7366]">{formatPrice(Number(maxPrice))} تومان</strong>
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setMaxPrice('');
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            {onlyInStock && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                فقط کالا‌های موجود
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setOnlyInStock(false);
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            {onlyDiscounted && (
              <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                فقط تخفیف‌دار
                <X
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-rose-500"
                  onClick={() => {
                    setOnlyDiscounted(false);
                    handleFilterChange();
                  }}
                />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="mr-auto text-xs text-rose-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              حذف همه فیلترها
            </button>
          </div>
        )}

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block space-y-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0D7366]" />
                فیلترهای حرفه‌ای فروشگاه
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
                >
                  پاک‌سازی
                </button>
              )}
            </div>

            {/* Quick Toggle Switches */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-colors">
                <span className="text-xs font-extrabold text-slate-800">فقط کالاهای موجود</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => {
                    setOnlyInStock(e.target.checked);
                    handleFilterChange();
                  }}
                  className="w-4 h-4 accent-[#0D7366] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-colors">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-rose-500" />
                  فقط کالاهای تخفیف‌دار
                </span>
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => {
                    setOnlyDiscounted(e.target.checked);
                    handleFilterChange();
                  }}
                  className="w-4 h-4 accent-[#0D7366] rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Price Filter Box */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-900 border-r-3 border-[#0D7366] pr-2">
                محدوده قیمت (تومان)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">از قیمت:</label>
                  <input
                    type="number"
                    placeholder="مثلاً ۱۰۰,۰۰۰"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value ? Number(e.target.value) : '');
                      handleFilterChange();
                    }}
                    className="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D7366] text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">تا قیمت:</label>
                  <input
                    type="number"
                    placeholder="مثلاً ۱,۵۰۰,۰۰۰"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value ? Number(e.target.value) : '');
                      handleFilterChange();
                    }}
                    className="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D7366] text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter List with Search */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 border-r-3 border-[#0D7366] pr-2">
                  دسته‌بندی‌های کالا
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">{categoriesList.length} دسته</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی دسته..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full h-8 px-2.5 pr-7 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5" />
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin pl-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    handleFilterChange();
                  }}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                    !selectedCategory ? 'bg-emerald-50 text-[#0D7366]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>همه دسته‌ها</span>
                </button>
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id || cat.slug || cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug);
                      handleFilterChange();
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug ? 'bg-emerald-50 text-[#0D7366]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter List with Search */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 border-r-3 border-[#0D7366] pr-2">
                  برندهای تخصصی
                </h4>
                <span className="text-[10px] text-slate-400 font-bold">{brandsList.length} برند</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی برند..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full h-8 px-2.5 pr-7 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5" />
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin pl-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedBrand('');
                    handleFilterChange();
                  }}
                  className={`w-full text-right px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                    !selectedBrand ? 'bg-emerald-50 text-[#0D7366]' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>همه برندها</span>
                </button>
                {filteredBrands.map((b) => (
                  <button
                    key={b.id || b.name}
                    onClick={() => {
                      setSelectedBrand(b.name === selectedBrand ? '' : b.name);
                      handleFilterChange();
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedBrand === b.name ? 'bg-emerald-50 text-[#0D7366]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0D7366]/5 to-teal-50 border border-[#0D7366]/20 space-y-1.5">
              <div className="flex items-center gap-2 text-[#0D7366] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>ضمانت اصالت و سلامت دارویی</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                تمامی مکمل‌ها و محصولات بهداشتی مستقیماً از شرکت‌های پخش رسمی تامین می‌گردند.
              </p>
            </div>
          </div>

          {/* Products Grid & Pagination Content */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-80 flex flex-col justify-between">
                    <div className="bg-slate-100 rounded-xl aspect-square w-full" />
                    <div className="space-y-2 mt-3">
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center text-rose-700 space-y-3">
                <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
                <h3 className="font-extrabold text-base">خطا در ارتباط با سرور فروشگاه</h3>
                <p className="text-xs text-rose-600">عدم دریافت اطلاعات از API Django. دریافت محتوا با خطا مواجه شد.</p>
                <button
                  onClick={loadProducts}
                  className="px-5 py-2.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-rose-700 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تلاش مجدد</span>
                </button>
              </div>
            ) : apiProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg">
                  هیچ محصولی مطابق با فیلترهای انتخابی شما پیدا نشد
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  لطفاً فیلترها را کمی گسترده‌تر کنید یا با کلیک روی دکمه زیر، فیلترها را بازنشانی نمایید.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#0D7366] text-white font-bold text-xs shadow-md hover:bg-[#0A584E] transition-all cursor-pointer"
                >
                  نمایش تمام محصولات
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW MODE */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiProducts.map((prod, idx) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#0D7366]/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Badges */}
                    <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1">
                      {prod.discountPercent && (
                        <span className="bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
                          %{prod.discountPercent} تخفیف
                        </span>
                      )}
                      {prod.isNew && (
                        <span className="bg-[#0D7366] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
                          جدید
                        </span>
                      )}
                    </div>

                    {/* Image & Card Content */}
                    <div onClick={() => onSelectProduct(prod)} className="cursor-pointer space-y-3">
                      <div className="relative aspect-square rounded-2xl bg-slate-50 p-2 flex items-center justify-center overflow-hidden group-hover:bg-slate-100/80 transition-colors w-full shrink-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(prod);
                          }}
                          className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md p-2 rounded-xl text-slate-700 hover:text-[#0D7366] opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                          title="مشاهده سریع"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block mb-1">
                          {prod.brand}
                        </span>
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-[#0D7366] transition-colors leading-snug line-clamp-2">
                          {prod.name}
                        </h3>
                      </div>
                    </div>

                    {/* Price & Action Footer */}
                    <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                      <div>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through block font-bold">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                        <div className="flex items-center gap-1 font-black text-sm text-[#0D7366]">
                          <span>{formatPrice(prod.price)}</span>
                          <span className="text-[10px] font-normal text-slate-400">تومان</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(prod)}
                        className="h-9 px-3 bg-[#0D7366] text-white font-extrabold text-xs rounded-xl hover:bg-[#0A584E] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>خرید</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* LIST VIEW MODE */
              <div className="space-y-3">
                {apiProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 group"
                  >
                    <div
                      onClick={() => onSelectProduct(prod)}
                      className="w-24 h-24 rounded-xl bg-slate-50 p-2 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-lg" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 text-center sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">{prod.brand}</span>
                      <h3
                        onClick={() => onSelectProduct(prod)}
                        className="font-extrabold text-sm text-slate-800 hover:text-[#0D7366] transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 font-medium">{prod.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 gap-3">
                      <div className="text-right">
                        {prod.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through block font-bold">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                        <div className="font-black text-sm text-[#0D7366]">
                          {formatPrice(prod.price)} <span className="text-[10px] font-normal text-slate-400">تومان</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(prod)}
                        className="h-9 px-4 bg-[#0D7366] text-white font-bold text-xs rounded-xl hover:bg-[#0A584E] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>افزودن به سبد</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Control Bar */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-bold">
                  صفحه <strong className="text-slate-800">{currentPage}</strong> از <strong className="text-[#0D7366]">{totalPages}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="صفحه اول"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="صفحه قبل"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-slate-400 font-bold text-xs">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(p)}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              currentPage === p
                                ? 'bg-[#0D7366] text-white shadow-md shadow-[#0D7366]/20'
                                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="صفحه بعد"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="صفحه آخر"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
