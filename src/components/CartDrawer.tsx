'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const freeShippingThreshold = 1500000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49000;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toLowerCase() === 'nozha10' || couponCode.trim() === 'نوژا') {
      setDiscountApplied(true);
    } else {
      alert('کد تخفیف معتبر نیست. (کد تست: nozha10)');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0D7366]/10 text-[#0D7366] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#191C1D]">سبد خرید شما</h3>
                  <p className="text-xs text-slate-500">{items.length} کالا در سبد وجود دارد</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-4 bg-emerald-50/60 border-b border-emerald-100">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#0D7366]" />
                  {subtotal >= freeShippingThreshold ? (
                    <span className="font-bold text-[#0D7366]">ارسال رایگان شامل سفارش شما شد! 🎉</span>
                  ) : (
                    <span>
                      {formatPrice(freeShippingThreshold - subtotal)} تومان تا ارسال رایگان
                    </span>
                  )}
                </span>
                <span className="font-bold">{progressPercentage}٪</span>
              </div>
              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0D7366] to-[#129383] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-base mb-1">سبد خرید شما خالی است</h4>
                  <p className="text-xs text-slate-400 mb-6 max-w-xs">
                    محصولات سلامت و زیبایی نوژاشاپ را بررسی کنید و اقلام مورد نیاز خود را اضافه کنید.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-[#0D7366] text-white font-semibold text-xs shadow-md shadow-[#0D7366]/20 hover:bg-[#0A584E] transition-colors"
                  >
                    مشاهده محصولات
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors relative group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 p-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">{item.product.brand}</span>
                        <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">
                          {item.product.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-sm text-[#0D7366]">
                            {formatPrice(item.product.price)}
                          </span>
                          <span className="text-[10px] text-slate-500">تومان</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-2 py-1 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="text-slate-600 hover:text-[#0D7366] p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="text-slate-600 hover:text-rose-600 p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors self-start"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف (تست: nozha10)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0D7366] focus:outline-none bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    اعمال
                  </button>
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                  <div className="flex justify-between">
                    <span>جمع کل کالاها</span>
                    <span className="font-semibold text-slate-800">{formatPrice(subtotal)} تومان</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>تخفیف (۱۰٪)</span>
                      <span className="font-semibold">-{formatPrice(discount)} تومان</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>هزینه ارسال</span>
                    <span className="font-semibold text-slate-800">
                      {shippingFee === 0 ? (
                        <span className="text-[#0D7366]">رایگان</span>
                      ) : (
                        `${formatPrice(shippingFee)} تومان`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-[#0D7366] text-base">{formatPrice(grandTotal)} تومان</span>
                  </div>
                </div>

                {/* Checkout CTA Button */}
                <button
                  onClick={() => alert('انتقال به درگاه پرداخت امن نوژاشاپ...')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0D7366] to-[#129383] text-white font-bold text-sm shadow-xl shadow-[#0D7366]/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>تکمیل و ثبت سفارش</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D7366]" />
                  <span>تضمین اصالت کالا و پرداخت ۱۰۰٪ امن</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
