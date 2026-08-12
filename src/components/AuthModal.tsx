import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  Lock,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  LogOut,
  ShoppingBag,
  Clock,
  Wallet,
  Sparkles,
  MapPin,
  ChevronLeft,
} from 'lucide-react';

export interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  walletBalance: number;
  registeredDate: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'otp' | 'password' | 'register'>('otp');
  
  // Form fields
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  
  // OTP step
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpCode, setOtpCode] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      onShowToast('خطای شماره همراه', 'لطفاً یک شماره موبایل معتبر (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.', 'warning');
      return;
    }
    setOtpStep('code');
    setTimer(60);
    setIsTimerActive(true);
    onShowToast('کد تایید ارسال شد', 'کد تایید ۴ رقمی آزمایشی «1234» به شماره شما پیامک شد.', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode.length < 4) {
      onShowToast('کد اشتباه است', 'کد ورود آزمایشی 1234 می‌باشد.', 'warning');
      return;
    }
    const user: UserProfile = {
      name: fullName || 'کاربر عزیز نوژاشاپ',
      phone: phone,
      walletBalance: 150000,
      registeredDate: 'امروز',
    };
    onLoginSuccess(user);
    onShowToast('ورود موفقیت‌آمیز', 'به داروخانه آنلاین نوژاشاپ خوش آمدید!', 'success');
    resetForms();
    onClose();
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      onShowToast('اطلاعات ناقص', 'لطفا شماره موبایل و کلمه عبور را وارد کنید.', 'warning');
      return;
    }
    const user: UserProfile = {
      name: 'کاربر محترم نوژاشاپ',
      phone: phone,
      walletBalance: 200000,
      registeredDate: '۱۴۰۲/۰۶/15',
    };
    onLoginSuccess(user);
    onShowToast('ورود موفق', 'خوش آمدید!', 'success');
    resetForms();
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !password) {
      onShowToast('اطلاعات ثبت نام', 'لطفا تمام فیلدها را تکمیل کنید.', 'warning');
      return;
    }
    const user: UserProfile = {
      name: fullName,
      phone: phone,
      walletBalance: 50000, // Welcome gift
      registeredDate: 'امروز',
    };
    onLoginSuccess(user);
    onShowToast('ثبت نام موفق', 'حساب کاربری شما ایجاد شد + ۵۰,۰۰۰ تومان هدیه خوش‌آمدگویی!', 'success');
    resetForms();
    onClose();
  };

  const resetForms = () => {
    setOtpStep('phone');
    setOtpCode('');
    setPhone('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm dir-rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0D7366] via-[#129383] to-[#0D7366] p-6 text-white text-right relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                {currentUser ? 'حساب کاربری شما' : 'ورود / ثبت‌نام در نوژاشاپ'}
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {currentUser ? 'مدیریت اطلاعات و سفارشات' : 'سریع، امن و تاییدشده توسط سازمان غذا و دارو'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Logged In User Profile View */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0D7366] text-white font-black text-xl flex items-center justify-center shadow-md">
                  {currentUser.name[0] || 'ک'}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    {currentUser.name}
                    <CheckCircle2 className="w-4 h-4 text-[#0D7366]" />
                  </h3>
                  <span className="text-xs text-slate-500 dir-ltr font-mono block">
                    {currentUser.phone}
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold inline-block">
                    عضویت: {currentUser.registeredDate}
                  </span>
                </div>
              </div>

              {/* Wallet & Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-[#0D7366]" />
                    اعتبار کیف پول
                  </span>
                  <strong className="text-sm font-black text-[#0D7366] block">
                    {currentUser.walletBalance.toLocaleString('fa-IR')} <span className="text-[10px]">تومان</span>
                  </strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    سفارشات موفق
                  </span>
                  <strong className="text-sm font-black text-slate-800 block">
                    ۲ سفارش ثبت‌شده
                  </strong>
                </div>
              </div>

              {/* Profile Links */}
              <div className="space-y-2 text-xs font-bold text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>تاریخچه سفارشات دارویی و بهداشتی</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>آدرس‌های تحویل گیرنده</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    onLogout();
                    onShowToast('خروج', 'از حساب کاربری خود خارج شدید.', 'info');
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب کاربری</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out - Auth Tabs */
            <div className="space-y-5">
              {/* Tabs Switcher */}
              <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveTab('otp');
                    setOtpStep('phone');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    activeTab === 'otp'
                      ? 'bg-white text-[#0D7366] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  کد یکبار مصرف
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    activeTab === 'password'
                      ? 'bg-white text-[#0D7366] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ورود با رمز عبور
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-[#0D7366] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ثبت‌نام
                </button>
              </div>

              {/* Tab 1: OTP Flow */}
              {activeTab === 'otp' && (
                <div className="space-y-4">
                  {otpStep === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          شماره همراه خود را وارد کنید:
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-slate-900 text-sm font-bold dir-ltr outline-none"
                            required
                          />
                          <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-[#0D7366] hover:bg-[#0A584E] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>دریافت کد تایید ورود</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-bold text-slate-700">کد تایید ۴ رقمی:</label>
                          <span className="text-[#0D7366] font-mono dir-ltr">{phone}</span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="کد آزمایشی: 1234"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={4}
                            className="w-full h-12 text-center text-xl tracking-widest font-mono font-bold rounded-xl border border-slate-200 focus:border-[#0D7366] text-slate-900 outline-none"
                            required
                          />
                          <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => setOtpStep('phone')}
                          className="text-[#0D7366] font-bold hover:underline"
                        >
                          تغییر شماره همراه
                        </button>
                        <span>
                          {isTimerActive ? (
                            `ارسال مجدد تا ${timer} ثانیه`
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setTimer(60);
                                setIsTimerActive(true);
                                onShowToast('ارسال مجدد', 'کد جدید ارسال گردید (کد 1234).');
                              }}
                              className="text-[#0D7366] font-bold hover:underline"
                            >
                              ارسال مجدد کد
                            </button>
                          )}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-[#0D7366] hover:bg-[#0A584E] text-white font-extrabold text-xs shadow-md transition-all"
                      >
                        تایید و ورود به سیستم
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 2: Password Login */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">شماره همراه:</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-sm font-bold dir-ltr outline-none"
                        required
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">کلمه عبور:</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-sm font-bold dir-ltr outline-none"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#0D7366] hover:bg-[#0A584E] text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    ورود با کلمه عبور
                  </button>
                </form>
              )}

              {/* Tab 3: Register */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">نام و نام خانوادگی:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثلا: علی رضایی"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-xs font-bold outline-none"
                        required
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">شماره همراه:</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-xs font-bold dir-ltr outline-none"
                        required
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">تعیین رمز عبور:</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="حداقل ۶ کاراکتر"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#0D7366] text-xs font-bold dir-ltr outline-none"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>۵۰,۰۰۰ تومان اعتبار کیف پول به مناسبت ثبت‌نام دریافت می‌کنید!</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#0D7366] hover:bg-[#0A584E] text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    ثبت‌نام و دریافت هدیه
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
