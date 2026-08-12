'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, CheckCircle, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onShowToast: (title: string, message: string) => void;
  onNavigateMagazine?: () => void;
  onOpenShop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowToast, onNavigateMagazine, onOpenShop }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('لطفاً آدرس ایمیل معتبر وارد کنید.');
      return;
    }
    onShowToast('عضویت در خبرنامه', 'ایمیل شما با موفقیت ثبت شد. کدهای تخفیف به ایمیل ارسال می‌شود.');
    setEmail('');
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200/80 pt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Top Section: Brand Story & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Brand Intro (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0D7366] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0D7366]/20">
                <span className="material-symbols-outlined text-white text-3xl">spa</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-[#0D7366]">نوژاشاپ</span>
                <span className="text-[10px] tracking-widest text-[#D4AF37] font-semibold -mt-1">
                  NOZHA SHOP ONLINE PHARMACY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              نوژاشاپ به عنوان مرجع تخصصی سلامت و زیبایی، با ارائه برترین برندهای جهانی و محصولات اصل،
              همراه شما در مسیر تندرستی و مراقبت‌های شخصی است. ما به کیفیت، اصالت و لبخند رضایت شما متعهدیم.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {['instagram', 'telegram', 'linkedin', 'twitter'].map((platform, idx) => (
                <a
                  key={idx}
                  href={`#${platform}`}
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0D7366] hover:text-white transition-all shadow-sm active:scale-95"
                  title={platform}
                >
                  <span className="text-xs font-bold capitalize">{platform[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Box (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 rounded-3xl p-6 sm:p-10 border border-emerald-100 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-[#0D7366] mb-2">از جدیدترین تخفیف‌ها باخبر شوید</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              با عضویت در خبرنامه نوژاشاپ، کدهای تخفیف اختصاصی و آخرین مقالات سلامت را دریافت کنید.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="آدرس ایمیل خود را وارد کنید..."
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-[#0D7366] outline-none text-xs font-medium text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-8 bg-[#0D7366] hover:bg-[#0A584E] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#0D7366]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>عضویت</span>
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Footer Links 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pt-8 border-t border-slate-100">
          <div>
            <h4 className="font-bold text-sm text-[#0D7366] mb-4">درباره ما</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">داستان برند نوژا</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">چرا نوژاشاپ؟</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">فرصت‌های شغلی</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">همکاری با تامین‌کنندگان</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#0D7366] mb-4">خدمات مشتریان</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">پاسخ به پرسش‌های متداول</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">رویه‌های بازگرداندن کالا</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">شرایط استفاده</a></li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">حریم خصوصی</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#0D7366] mb-4">دسترسی سریع</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={onNavigateMagazine}
                  className="hover:text-[#0D7366] transition-colors text-right cursor-pointer"
                >
                  مجله سلامت و زیبایی
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenShop}
                  className="hover:text-[#0D7366] transition-colors text-right cursor-pointer"
                >
                  تخفیف‌ها و پیشنهادها
                </button>
              </li>
              <li><a href="#" className="hover:text-[#0D7366] transition-colors">پیگیری سفارش</a></li>
              <li><a href="/sitemap.xml" className="hover:text-[#0D7366] transition-colors" title="نقشه سایت نوژاشاپ">نقشه سایت</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#0D7366] mb-4">اطلاعات تماس</h4>
            <ul className="flex flex-col gap-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0D7366]" />
                <span dir="ltr" className="font-semibold">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0D7366]" />
                <span>support@nozhashop.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0D7366] flex-shrink-0 mt-0.5" />
                <span>تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳۴</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-slate-100">
          <div className="flex items-center justify-center gap-4">
            <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0D7366] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">نماد اعتماد</span>
              <span className="text-[9px] text-slate-400">ای‌نماد الکترونیکی</span>
            </div>
            <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">نشان ساماندهی</span>
              <span className="text-[9px] text-slate-400">وزارت ارشاد</span>
            </div>
            <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">عضو اتحادیه</span>
              <span className="text-[9px] text-slate-400">کسب‌وکار اینترنتی</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1 justify-center md:justify-end">
              <ShieldCheck className="w-4 h-4 text-[#0D7366]" /> دارای تاییدیه از وزارت بهداشت و سازمان غذا و دارو
            </p>
            <p className="text-xs font-bold text-[#0D7366] flex items-center gap-1 justify-center md:justify-end">
              <HeartHandshake className="w-4 h-4 text-[#0D7366]" /> تضمین بازگشت وجه در صورت عدم رضایت
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-100 py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <span>تمامی حقوق مادی و معنوی این سایت متعلق به داروخانه آنلاین نوژاشاپ می‌باشد. © ۱۴۰۴ - ۲۰۲۶</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#0D7366]">شرایط و قوانین</a>
            <a href="#" className="hover:text-[#0D7366]">حریم خصوصی</a>
            <a href="#" className="hover:text-[#0D7366]">شکایات</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
