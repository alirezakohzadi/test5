'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onViewFullDetails?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewFullDetails,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Image Panel */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-50 to-emerald-50/40 p-8 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-[260px] rounded-2xl overflow-hidden bg-white p-2 shadow-lg border border-slate-100">
              {product.discountPercentage && (
                <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg z-10 shadow-md">
                  ٪{product.discountPercentage} تخفیف
                </span>
              )}
              {product.badge && (
                <span className="absolute top-3 left-3 gold-badge text-xs font-bold px-2.5 py-1 rounded-lg z-10 shadow-md">
                  {product.badge}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Product Details Panel */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>برند: <strong className="text-slate-700">{product.brand}</strong></span>
                {product.volumeOrSize && <span>حجم: {product.volumeOrSize}</span>}
              </div>

              <h2 className="text-lg font-bold text-slate-800 leading-snug mb-2">
                {product.name}
              </h2>

              {/* Rating & In-stock badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{product.rating || 4.8}</span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> موجود در انبار نوژاشاپ
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {product.description ||
                  'محصول اورجینال با تاییدیه غذا و دارو. حاوی ترکیبات پیشرفته و غنی‌شده برای بالاترین بازدهی سلامت و زیبایی.'}
              </p>

              {/* Price section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500 font-medium">قیمت مصرف‌کننده:</span>
                <div className="text-left">
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block -mb-1">
                      {formatPrice(product.originalPrice)} تومان
                    </span>
                  )}
                  <span className="text-lg font-black text-[#0D7366]">
                    {formatPrice(product.price)} <span className="text-xs font-normal text-slate-500">تومان</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">تعداد:</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1">
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="font-bold text-slate-700 hover:text-[#0D7366]"
                  >
                    +
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="font-bold text-slate-700 hover:text-rose-600"
                  >
                    -
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0D7366] text-white font-bold text-xs shadow-lg shadow-[#0D7366]/20 hover:bg-[#0A584E] active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن به سبد خرید</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title="علاقه‌مندی"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {onViewFullDetails && (
                <button
                  onClick={() => {
                    onClose();
                    onViewFullDetails(product);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>مشاهده جزئیات کامل و تخصصی محصول</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D7366]" /> اصالت تضمین‌شده
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#0D7366]" /> ارسال سریع دارو اکسپرس
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
