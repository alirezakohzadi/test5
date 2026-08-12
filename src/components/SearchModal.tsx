'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingBag, Sparkles, Star, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { searchService } from '../services/searchService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const DEFAULT_PRODUCTS: Product[] = [];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products = DEFAULT_PRODUCTS,
  onSelectProduct,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults((prev) => (prev.length === 0 ? prev : []));
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchService.globalSearch(searchTerm);
        setSearchResults(res.products);
      } catch {
        // Local fallback
        const q = searchTerm.toLowerCase();
        setSearchResults(
          products.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q)
          )
        );
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  const popularTags = [
    'ضدآفتاب',
    'سرم ویتامین سی',
    'کرم ضد لک',
    'شامپو کافئین',
    'بایومارین',
    'ویتاپلکس',
    'مولتی ویتامین',
    'رتینول'
  ];

  const filteredProducts = searchResults;

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Search className="w-6 h-6 text-[#0D7366] flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="نام دارو، برند یا محصول بهداشتی مورد نظر را بنویسید..."
                autoFocus
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 text-xs bg-slate-200/60 px-2 py-1 rounded-lg"
                >
                  پاک کردن
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* Popular Tags */}
              {!searchTerm && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>جستجوهای محبوب کاربران:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0D7366]/10 hover:text-[#0D7366] text-slate-600 text-xs font-medium transition-colors border border-slate-200/60"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchTerm && (
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-3 flex justify-between items-center">
                    <span>نتایج یافته شده ({filteredProducts.length})</span>
                    {filteredProducts.length > 0 && (
                      <span className="text-[10px] text-[#0D7366]">برای جزییات بیشتر روی محصول کلیک کنید</span>
                    )}
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <p className="text-sm">محصولی با مشخصات «{searchTerm}» پیدا نشد.</p>
                      <p className="text-xs mt-1 text-slate-400">
                        کلمات کلیدی دیگری مانند برند یا دسته‌بندی را امتحان کنید.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-[#0D7366]/30 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 p-1 border border-slate-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400 font-medium">{product.brand}</span>
                            <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-[#0D7366] transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-extrabold text-xs text-[#0D7366]">
                                {formatPrice(product.price)} <span className="text-[10px] font-normal text-slate-400">تومان</span>
                              </span>
                              {product.rating && (
                                <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {product.rating}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="p-2 rounded-xl bg-[#0D7366] text-white hover:bg-[#0A584E] transition-colors flex-shrink-0"
                            title="افزودن به سبد خرید"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
              داروخانه آنلاین نوژاشاپ - ضمانت اصالت و برچسب سلامت کالا
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
