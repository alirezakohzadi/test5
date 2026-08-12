import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingBag, Menu, X, FileText, PhoneCall, User, Store } from 'lucide-react';
import { NavbarNavigation } from './navigation/NavbarNavigation';
import { DjangoCategory } from '../types';
import { UserProfile } from './AuthModal';

export interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenPrescription: () => void;
  onOpenAuth: () => void;
  onOpenShop: () => void;
  onOpenMagazine?: () => void;
  currentUser: UserProfile | null;
  apiUrl?: string;
  onSelectCategory?: (category: DjangoCategory) => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenPrescription,
  onOpenAuth,
  onOpenShop,
  onOpenMagazine,
  currentUser,
  apiUrl,
  onSelectCategory,
  onGoHome,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategorySelect = (category: DjangoCategory) => {
    onSelectCategory?.(category);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-300 ${
        scrolled
          ? 'shadow-md border-b border-slate-200/80'
          : 'border-b border-slate-200/60'
      }`}
    >
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#0D7366] via-[#129383] to-[#D4AF37]" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* ROW 1: Logo | Wide Search Bar | Shop Button | Login/Register & Cart */}
        <div className="flex items-center justify-between py-3 gap-2 sm:gap-4">
          
          {/* Right Side: Logo & Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0D7366] rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="منو"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onGoHome?.();
              }}
              className="flex items-center gap-2 group text-right cursor-pointer"
              title="صفحه اصلی نوژاشاپ"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0D7366] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0D7366] text-2xl font-bold">
                    spa
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-[#0D7366]">
                  نوژاشاپ
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 font-bold -mt-1 hidden sm:block">
                  NOZHA PHARMACY
                </span>
              </div>
            </a>
          </div>

          {/* Middle: Prominent Wide Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-2 lg:mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between bg-[#f4f5f7] hover:bg-[#eaecef] border border-slate-200/80 rounded-full px-4 py-2 text-slate-400 text-xs sm:text-sm font-medium transition-all shadow-inner group"
            >
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                عبارت مورد نظرتان را جهت جستجو وارد نمایید...
              </span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 group-hover:text-[#0D7366] shadow-sm shrink-0">
                <Search className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Left Side: Shop Button + Login / Register Pill Button + Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href="/magazine"
              onClick={(e) => {
                e.preventDefault();
                onOpenMagazine?.();
              }}
              className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-slate-500 hover:text-[#0D7366] hover:bg-[#0D7366]/5 border border-transparent hover:border-[#0D7366]/20 transition-all text-[11px] sm:text-xs font-bold active:scale-95 cursor-pointer"
              title="مجله تخصصی سلامت نوژاشاپ"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>مجله سلامت</span>
            </a>

            {/* Direct Shop Button in Header */}
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                onOpenShop();
              }}
              className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-[#0D7366] border border-emerald-200/80 transition-all text-[11px] sm:text-xs font-black shadow-sm active:scale-95 cursor-pointer"
              title="فروشگاه آنلاین داروخانه نوژاشاپ"
            >
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D7366]" />
              <span>فروشگاه</span>
            </a>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-full bg-slate-100 text-slate-700 hover:text-[#0D7366] active:scale-95 transition-transform"
              aria-label="جستجو"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Cart Button Circle */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 rounded-full border border-slate-300 text-slate-700 hover:text-[#0D7366] hover:border-[#0D7366] hover:bg-[#0D7366]/5 transition-all active:scale-95 group cursor-pointer"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0D7366] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Register Pill Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border transition-all text-[11px] sm:text-xs font-bold active:scale-95 cursor-pointer ${
                currentUser
                  ? 'bg-emerald-50 border-emerald-300 text-[#0D7366]'
                  : 'border-slate-300 hover:border-[#0D7366] text-slate-700 hover:text-[#0D7366] hover:bg-[#0D7366]/5'
              }`}
            >
              <User className="w-4 h-4 text-[#0D7366]" />
              <span className="hidden sm:inline truncate max-w-[100px]">
                {currentUser ? currentUser.name : 'ورود / ثبت‌نام'}
              </span>
            </button>
          </div>

        </div>

        {/* ROW 2: Horizontal Navigation Menu */}
        <div className="hidden lg:block border-t border-slate-100 py-2">
          <NavbarNavigation
            onNavigate={(url) => {
              if (url.includes('/shop') || url.includes('category=')) {
                onOpenShop();
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 px-5 py-4 shadow-2xl overflow-hidden max-h-[82vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShop();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0D7366] text-white font-black text-xs shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>ورود به فروشگاه آنلاین</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrescription();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-50 border border-[#D4AF37]/50 text-[#8A6D0B] font-bold text-xs"
              >
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>مشاوره داروساز & ارسال نسخه</span>
              </button>

              {/* Dynamic Mobile Navbar Navigation */}
              <NavbarNavigation
                isMobile={true}
                onCloseMobileMenu={() => setMobileMenuOpen(false)}
                onNavigate={(url) => {
                  if (url.includes('/shop') || url.includes('category=')) {
                    onOpenShop();
                  }
                }}
              />

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-[#0D7366]" />
                  <span>پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
                </span>
                <span className="text-[#0D7366] font-semibold">پاسخگویی ۲۴ ساعته</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
