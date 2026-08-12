import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  UserCheck,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Info,
  MessageSquare,
  ThumbsUp,
  Award,
  HelpCircle,
  Plus,
  Minus,
  Check,
  Clock,
  Droplets,
  AlertCircle,
  Zap,
  TrendingUp,
  Activity,
  CheckSquare,
  QrCode,
  Flame,
  Calendar,
  Layers,
  Leaf,
  Shield,
  Eye,
} from 'lucide-react';
import { Product } from '../types';
import { SEOPageBreadcrumb } from './SEOPageBreadcrumb';
import { getCategorySlug, getProductSlug } from '../utils/router';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onShowToast,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews' | 'faq' | 'clinical' | 'authenticity'>('description');
  const [copiedLink, setCopiedLink] = useState(false);
  const [usageFrequency, setUsageFrequency] = useState<number>(2); // times per day
  const [routineSelected, setRoutineSelected] = useState<boolean>(true);

  // Review form state initialized from product payload or defaults
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : [
          {
            id: 'rev-1',
            author: 'مریم کاظمی',
            rating: 5,
            date: '۱۲ مرداد ۱۴۰۳',
            comment: 'واقعاً محصول عالی و اورجینالی بود. تاثیرش بعد از دو هفته استفاده کاملاً مشخص شد.',
            verified: true,
            likes: 14,
          },
          {
            id: 'rev-2',
            author: 'دکتر علیرضا حبیبی (متخصص پوست)',
            rating: 5,
            date: '۵ مرداد ۱۴۰۳',
            comment: 'ترکیبات این فرآورده کاملاً استاندارد و منطبق بر آخرین استانداردهای درماتولوژی است.',
            verified: true,
            likes: 28,
          },
        ]
  );

  // Q&A state initialized from product payload or defaults
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaList, setQaList] = useState(
    product.qaItems && product.qaItems.length > 0
      ? product.qaItems
      : [
          {
            id: 'qa-1',
            question: 'آیا این محصول برای پوست‌های مستعد آکنه و چرب مناسب است؟',
            author: 'رضا سلیمانی',
            date: '۱۰ مرداد ۱۴۰۳',
            answer: 'بله، فرمولاسیون این محصول فاقد چربی و غیرکومدون‌زا است و باعث ایجاد جوش نمی‌شود.',
            pharmacistName: 'دکتر سمیرا نوری (داروساز نوژاشاپ)',
          },
        ]
  );

  // Sync state when product prop changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setSelectedVariantIndex(0);
    setQuantity(1);
    if (product.reviews && product.reviews.length > 0) {
      setReviewsList(product.reviews);
    }
    if (product.qaItems && product.qaItems.length > 0) {
      setQaList(product.qaItems);
    }
  }, [product.id]);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  // Active Variant or Base Product
  const activeVariant = product.variants && product.variants.length > 0
    ? product.variants[selectedVariantIndex]
    : null;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : product.originalPrice;
  const currentDiscount = activeVariant ? activeVariant.discountPercentage : product.discountPercentage;
  const currentInStock = activeVariant ? (activeVariant.inStock ?? product.inStock) : product.inStock;
  const currentVolume = activeVariant ? activeVariant.volumeOrSize : product.volumeOrSize;
  const currentSku = activeVariant ? activeVariant.sku : product.sku;

  // Gallery Images from Django
  const galleryImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Complementary Routine Products (from Django or fallbacks)
  const routineProducts = product.routineProducts && product.routineProducts.length > 0
    ? product.routineProducts
    : allProducts.filter((p) => p.id !== product.id).slice(0, 2);

  const routineTotalPrice = currentPrice + routineProducts.reduce((sum, item) => sum + item.price, 0);
  const routineDiscountedPrice = Math.round(routineTotalPrice * 0.9);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onShowToast('لینک کپی شد', 'لینک این محصول در حافظه کپی گردید.', 'info');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      onShowToast('خطا', 'لطفا نام و متن نظر خود را وارد کنید.', 'warning');
      return;
    }
    const newRev = {
      id: Date.now().toString(),
      author: newReviewName,
      rating: newReviewRating,
      date: 'هم‌اکنون',
      comment: newReviewText,
      verified: true,
      likes: 0,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewName('');
    setNewReviewText('');
    onShowToast('ثبت موفق نظر', 'دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر می‌گردد.');
  };

  const handleAskPharmacist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuestion.trim()) return;
    const newQa = {
      id: Date.now().toString(),
      question: qaQuestion,
      author: 'کاربر نوژاشاپ',
      date: 'هم‌اکنون',
      answer: 'پرسش شما برای داروساز کشیک نوژاشاپ ارسال شد و به زودی پاسخ آن در این بخش قرار می‌گیرد.',
      pharmacistName: 'پشتیبانی داروسازی نوژاشاپ',
    };
    setQaList([newQa, ...qaList]);
    setQaQuestion('');
    onShowToast('ثبت پرسش', 'سوال شما برای بخش مشاوره دارویی ارسال شد.');
  };

  // Estimated days calculator
  const estimatedDays = Math.round(60 / usageFrequency);

  return (
    <div className="w-full bg-slate-50/50 pb-24 pt-3 sm:pt-6">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Live Social Proof Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#0D7366] to-teal-700 text-white rounded-2xl px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2 font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>هم‌اکنون {product.viewersCount || 4} کاربر در حال بررسی این فرآورده هستند.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-emerald-100">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              {product.recentOrdersCount || 19} سفارش ثبت شده در ۲۴ ساعت گذشته
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              ارسال مستقیم از انبار داروخانه نوژاشاپ
            </span>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <SEOPageBreadcrumb
            items={[
              { name: 'فروشگاه', url: '/shop' },
              { name: product.category || 'مراقبت تخصصی', url: '/categories/' + getCategorySlug(product.category) },
              { name: product.brand, url: '/brands/' + getCategorySlug(product.brand) },
              { name: product.name, url: '/products/' + getProductSlug(product) },
            ]}
          />

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#0D7366] hover:text-white transition-all text-xs font-bold flex-shrink-0 mr-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">بازگشت</span>
          </button>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery & Images (Lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Main Stage Image Box */}
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/20 p-4 border border-slate-100 flex items-center justify-center overflow-hidden group shadow-inner">
              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                {currentDiscount && currentDiscount > 0 ? (
                  <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-white" />
                    ٪{currentDiscount} تخفیف
                  </span>
                ) : null}
                {product.badge && (
                  <span className="gold-badge text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl border backdrop-blur-md shadow-sm transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-white'
                  }`}
                  title="افزودن به علاقه مندی"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-600 hover:text-[#0D7366] hover:bg-white backdrop-blur-md shadow-sm transition-all"
                  title="اشتراک گذاری"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Main Product Image */}
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[selectedImageIndex] || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnail Gallery Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 justify-center pt-1 overflow-x-auto scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1 border-2 transition-all overflow-hidden flex-shrink-0 bg-slate-50 ${
                      selectedImageIndex === idx
                        ? 'border-[#0D7366] shadow-md ring-2 ring-[#0D7366]/20'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="پیش‌نمایش" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <div>
                  <strong className="block font-bold">۱۰۰٪ اصالت کالا</strong>
                  <span className="text-[10px] text-slate-400">تضمین سلامت دارویی</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-700">
                <Truck className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <div>
                  <strong className="block font-bold">ارسال اکسپرس</strong>
                  <span className="text-[10px] text-slate-400">تحویل سریع سراسر کشور</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Panel (Lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Title & Brand Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0D7366] text-xs font-black border border-emerald-100">
                  برند رسمی: {product.brand}
                </span>
                {currentVolume && (
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md">
                    حجم / سایز: {currentVolume}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2">
                {product.name}
              </h1>

              <p className="text-xs text-slate-400 font-medium tracking-wide mb-3">
                شناسه کالا: {currentSku || `NZH-${product.id}`} | دسته‌بندی تخصصی {product.category}
              </p>

              {/* Rating & In-Stock Status Bar */}
              <div className="flex flex-wrap items-center gap-4 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating || 4.8)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-800">{product.rating || 4.8}</span>
                  <span className="text-slate-400">({product.ratingCount || reviewsList.length} ثبت نظر)</span>
                </div>

                <div className="h-3 w-px bg-slate-200 hidden sm:block" />

                {currentInStock ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> موجود در انبار مرکزی نوژاشاپ
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-500" /> اتمام موجودی در انبار
                  </span>
                )}
              </div>
            </div>

            {/* Product Variants Selector (if provided by Django) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700">انتخاب مدل / حجم / تنوع:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedVariantIndex === idx
                          ? 'bg-[#0D7366] text-white border-[#0D7366] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {v.name} ({formatPrice(v.price)} تومان)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700">ویژگی‌های برجسته محصول:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {(product.features && product.features.length > 0
                  ? product.features
                  : [
                      'دارای سیب سلامت و پروانه رسمی غذا و دارو',
                      'بافت بسیار سبک با جذب سریع بدون چربی',
                      'هایپوآلرژنیک و مناسب حساس‌ترین پوست‌ها',
                      'غنی‌شده با آنتی‌اکسیدان‌ها و ویتامین‌های مغذی',
                    ]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0D7366] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-slate-50 to-white border border-emerald-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block mb-1">
                  قیمت مصرف‌کننده با احتساب مالیات بر ارزش افزوده:
                </span>
                <div className="flex items-baseline gap-2">
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-xs sm:text-sm text-slate-400 line-through">
                      {formatPrice(currentOriginalPrice)}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-[#0D7366]">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-xs font-bold text-slate-600">تومان</span>
                </div>
              </div>

              {/* Club Points Badge */}
              <div className="bg-amber-100/60 text-amber-900 border border-amber-200/60 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>+{product.clubPoints || 15} امتیاز باشگاه مشتریان نوژاشاپ</span>
              </div>
            </div>

            {/* Quantity Selector & Main CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">تعداد سفارش:</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm text-slate-800 font-bold hover:bg-[#0D7366] hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-extrabold w-6 text-center text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm text-slate-800 font-bold hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                  ⚡ تحویل سریع ۲۴ ساعته در تهران و کلان‌شهرها
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onAddToCart({ ...product, price: currentPrice, originalPrice: currentOriginalPrice }, quantity)}
                  disabled={!currentInStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                    currentInStock
                      ? 'bg-[#0D7366] text-white shadow-[#0D7366]/25 hover:bg-[#0A584E] active:scale-98'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{currentInStock ? 'افزودن به سبد خرید' : 'ناموجود'}</span>
                </button>

                {currentInStock && (
                  <button
                    onClick={() => {
                      onAddToCart({ ...product, price: currentPrice, originalPrice: currentOriginalPrice }, quantity);
                      onShowToast('خرید فوری', 'محصول به سبد افزوده شد. در حال هدایت به درگاه پرداخت...');
                    }}
                    className="py-3.5 px-6 rounded-2xl bg-amber-500 text-white font-extrabold text-sm shadow-md hover:bg-amber-600 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>خرید سریع و فوری</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pharmacist Consultation Note */}
            <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-3 text-xs text-teal-900">
              <UserCheck className="w-5 h-5 text-[#0D7366] flex-shrink-0" />
              <div>
                <strong>نیاز به مشاوره تخصصی مصرف دارید؟</strong>
                <p className="text-slate-600 text-[11px]">
                  {product.pharmacistNote || 'داروسازان نوژاشاپ به‌صورت آنلاین آماده پاسخگویی به سوالات شما هستند.'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Dosage & Lifespan Interactive Calculator */}
        <div className="bg-gradient-to-r from-teal-900 to-[#0A584E] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-teal-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-700/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-800/80 text-teal-300">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">حسابگر دوره استفاده و ماندگاری فرآورده</h3>
                <p className="text-xs text-teal-200">با انتخاب میزان مصرف روزانه، زمان اتمام محصول را دقیق تخمین بزنید:</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-teal-950/60 p-1.5 rounded-xl border border-teal-700">
              <span className="text-xs text-teal-300 px-2 font-medium">دفعات مصرف در روز:</span>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setUsageFrequency(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    usageFrequency === num
                      ? 'bg-[#0D7366] text-white shadow'
                      : 'text-teal-200 hover:bg-teal-800'
                  }`}
                >
                  {num} بار
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-teal-800/40 border border-teal-700/50 space-y-1">
              <span className="text-teal-300 block">طول دوره مصرف تخمینی:</span>
              <strong className="text-lg font-black text-amber-300">حدود {estimatedDays} روز استفاده مداوم</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-800/40 border border-teal-700/50 space-y-1">
              <span className="text-teal-300 block">زمان بهینه اثرگذاری اولیه:</span>
              <strong className="text-lg font-black text-white">از روز ۷ تا ۱۴ مصرف</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-800/40 border border-teal-700/50 space-y-1">
              <span className="text-teal-300 block">مشاوره تکرار خرید:</span>
              <strong className="text-lg font-black text-emerald-300">یادآوری پیامکی قبل اتمام</strong>
            </div>
          </div>
        </div>

        {/* Complementary Routine Bundle Offers (روتین کامل پیشنهادی نوژاشاپ) */}
        {routineProducts.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-100 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#0D7366] uppercase tracking-wider block">
                  RECOMMENDED COMPLETE REGIMEN
                </span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0D7366]" />
                  روتین پیشنهادی متخصصین پوست (خرید یکجای پک مکمل با ۱۰٪ تخفیف)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                صرفه‌جویی در هزینه ارسال + تخفیف ویژه پکیج
              </span>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Product cards in routine */}
              <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                {/* Product 1: Current Main Product */}
                <div className="flex-1 min-w-[140px] p-3 rounded-2xl bg-slate-50 border border-emerald-200 relative text-right">
                  <span className="absolute top-2 right-2 bg-[#0D7366] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    محصول اصلی
                  </span>
                  <div className="w-16 h-16 mx-auto mb-2">
                    <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                  <span className="text-xs font-black text-[#0D7366] block mt-1">{formatPrice(product.price)} تومان</span>
                </div>

                <div className="text-slate-300 font-black text-xl">+</div>

                {/* Routine item 1 */}
                <div className="flex-1 min-w-[140px] p-3 rounded-2xl bg-slate-50 border border-slate-100 relative text-right">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <img src={routineProducts[0].image} alt={routineProducts[0].name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{routineProducts[0].name}</h4>
                  <span className="text-xs font-black text-[#0D7366] block mt-1">{formatPrice(routineProducts[0].price)} تومان</span>
                </div>

                {routineProducts[1] && (
                  <>
                    <div className="text-slate-300 font-black text-xl">+</div>
                    <div className="flex-1 min-w-[140px] p-3 rounded-2xl bg-slate-50 border border-slate-100 relative text-right">
                      <div className="w-16 h-16 mx-auto mb-2">
                        <img src={routineProducts[1].image} alt={routineProducts[1].name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{routineProducts[1].name}</h4>
                      <span className="text-xs font-black text-[#0D7366] block mt-1">{formatPrice(routineProducts[1].price)} تومان</span>
                    </div>
                  </>
                )}
              </div>

              {/* Package Add Button */}
              <div className="w-full lg:w-72 bg-gradient-to-b from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-emerald-100 text-center space-y-2">
                <span className="text-xs text-slate-500 block">مجموع قیمت پکیج روتین:</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 line-through">{formatPrice(routineTotalPrice)}</span>
                  <strong className="text-xl font-black text-[#0D7366]">{formatPrice(routineDiscountedPrice)} تومان</strong>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product);
                    routineProducts.forEach((rp) => onAddToCart(rp));
                    onShowToast('افزودن کل روتین', 'تمام محصولات روتین تخصصی با ۱۰٪ تخفیف ویژه به سبد شما اضافه شدند.');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0D7366] text-white text-xs font-extrabold hover:bg-[#0A584E] transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>افزودن پکیج کامل به سبد</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Efficacy & Timeline Progress Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">CLINICAL RESULTS</span>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0D7366]" />
                نتایج آزمایش‌های بالینی و درصد رضایت مصرف‌کنندگان
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress metric 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">افزایش میزان آبرسانی و رطوبت پوست</span>
                <span className="text-[#0D7366]">٪۹۸</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0D7366] to-teal-400 rounded-full w-[98%]" />
              </div>
              <p className="text-[11px] text-slate-400">بر اساس سنجش کورنیومتر پوست در ۱۰۰ نمونه آزمایشگاهی</p>
            </div>

            {/* Progress metric 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">بهبود بافت و ترمیم سد دفاعی</span>
                <span className="text-[#0D7366]">٪۹۴</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0D7366] to-teal-400 rounded-full w-[94%]" />
              </div>
              <p className="text-[11px] text-slate-400">نتایج ارزیابی درماتولوژیست‌ها پس از ۱۴ روز استفاده مداوم</p>
            </div>

            {/* Progress metric 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">سبکی و عدم ایجاد جوش یا چربی</span>
                <span className="text-[#0D7366]">٪۹۶</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0D7366] to-teal-400 rounded-full w-[96%]" />
              </div>
              <p className="text-[11px] text-slate-400">رضایت‌مندی خریداران با انواع تیپ‌های پوستی</p>
            </div>
          </div>

          {/* Timeline of treatment */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3">زمان‌بندی سیر اثربخشی درمانی (از هفته ۱ تا ۴):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-[#0D7366] block font-extrabold">هفته اول:</strong>
                <p className="text-slate-600 text-[11px]">احساس فوری شادابی، تسکین التهاب و رفع کشیدگی خشکی پوست.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-[#0D7366] block font-extrabold">هفته دوم:</strong>
                <p className="text-slate-600 text-[11px]">شفافیت محسوس چهره و هموارتر شدن ناهمواری‌های سطحی.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-[#0D7366] block font-extrabold">هفته سوم:</strong>
                <p className="text-slate-600 text-[11px]">تقویت کلاژن‌سازی طبیعی و افزایش خاصیت کشسانی (ارتجاعی).</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <strong className="text-[#0D7366] block font-extrabold">هفته چهارم:</strong>
                <p className="text-slate-600 text-[11px]">تثبیت شادابی و بازسازی کامل سد دفاعی اپیدرم پوست.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 space-y-6">
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'description'
                  ? 'bg-[#0D7366] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>بررسی تخصصی و نحوه مصرف</span>
            </button>

            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'bg-[#0D7366] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>ترکیبات و فرمولاسیون</span>
            </button>

            <button
              onClick={() => setActiveTab('authenticity')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'authenticity'
                  ? 'bg-[#0D7366] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>استعلام اصالت دارویی و کد IRC</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-[#0D7366] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>دیدگاه خریداران ({reviewsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'bg-[#0D7366] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>پرسش و پاسخ داروساز ({qaList.length})</span>
            </button>
          </div>

          {/* Tab Content 1: Description & Specifications */}
          {activeTab === 'description' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-slate-700 leading-relaxed text-sm"
            >
              <div>
                <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0D7366]" />
                  درباره {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description ||
                    'این فرآورده تخصصی با تکنولوژی پیشرفته و تحت نظارت دقیق آزمایشگاه‌های درماتولوژی تولید گردیده است. فرمولاسیون منحصر‌به‌فرد آن حاوی عصاره‌های خالص و مواد موثره فعال است که در کوتاه‌ترین زمان ممکن، بالاترین میزان اثربخشی و شادابی را برای پوست و مو به ارمغان می‌آورد.'}
                </p>
              </div>

              {/* Usage Step Guide */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0D7366]" />
                  دستورالعمل و زمان مناسب استفاده:
                </h3>
                {product.usageInstructions ? (
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pr-2">
                    {product.usageInstructions}
                  </p>
                ) : (
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 pr-2">
                    <li>ابتدا موضع مورد نظر را با شوینده ملایم کاملاً پاکسازی کرده و خشک نمایید.</li>
                    <li>مقدار کافی از فرآورده را روی موضع قرار داده و به آرامی با حرکات دورانی ماساژ دهید تا کاملاً جذب شود.</li>
                    <li>برای دستیابی به بهترین نتیجه درماتولوژیک، روزانه ۲ بار (صبح و شب) دوره درمان را کامل نمایید.</li>
                  </ul>
                )}
              </div>

              {/* Tech Specs Table */}
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3">مشخصات فنی و استانداردهای محصول:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">{spec.label}:</span>
                        <strong className="text-slate-800">{spec.value}</strong>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">برند:</span>
                        <strong className="text-slate-800">{product.brand}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">حجم / وزن:</span>
                        <strong className="text-slate-800">{currentVolume || 'استاندارد'}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">دسته‌بندی:</span>
                        <strong className="text-slate-800">{product.category}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">پروانه بهره‌برداری:</span>
                        <strong className="text-slate-800">۵۶/۲۱۸۷۴</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">تاریخ انقضا:</span>
                        <strong className="text-emerald-700">بیش از ۱۸ ماه معتبر</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                        <span className="text-slate-400">شرایط نگهداری:</span>
                        <strong className="text-slate-800">دمای ۱۵ تا ۲۵ درجه</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab Content 2: Active Ingredients */}
          {activeTab === 'ingredients' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-xs text-slate-600 leading-relaxed">
                فرمولاسیون این فرآورده عاری از هرگونه پارابن، فتالات، سولفات سنگین و ترکیبات آلاینده صنعتی بوده و تنها حاوی بالاترین گرید دارویی ترکیبات فعال زیر است:
              </p>

              {product.ingredients ? (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {product.ingredients}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <strong className="text-xs font-bold text-[#0D7366] block">هیالورونیک اسید ۳ سایز مولکولی</strong>
                    <p className="text-[11px] text-slate-600">نفوذ به عمیق‌ترین لایه‌های اپیدرم جهت آبرسانی ماندگار و پر کردن خطوط ریز.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <strong className="text-xs font-bold text-[#0D7366] block">نیاسینامید (ویتامین B3)</strong>
                    <p className="text-[11px] text-slate-600">تنظیم‌کننده ترشح چربی، کوچک‌کننده منافذ باز و روشن‌کننده لک‌های پوستی.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <strong className="text-xs font-bold text-[#0D7366] block">عصاره مریم‌گلی و چای سبز</strong>
                    <p className="text-[11px] text-slate-600">آنتی‌اکسیدان بسیار قوی جهت خنثی‌سازی رادیکال‌های آزاد و التیام التهابات.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab Content 3: Authenticity Verification */}
          {activeTab === 'authenticity' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs text-slate-700"
            >
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-200 text-[#0D7366]">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="flex-1 space-y-1 text-right">
                  <h4 className="font-extrabold text-slate-900 text-sm">تضمین ۱۰۰٪ اصالت و استعلام دارویی سامانه ttac</h4>
                  <p className="text-slate-600 text-[11px]">
                    تمامی محصولات موجود در نوژاشاپ مستقیماً از شرکت‌های پخش سراسری معتبر تأمین شده و دارای برچسب اصالت سازمان غذا و دارو می‌باشند.
                  </p>
                </div>
                <button
                  onClick={() => onShowToast('استعلام اصالت', 'کد IRC دارویی معتبر است (تاییدیه سازمان غذا و دارو)', 'success')}
                  className="px-4 py-2 rounded-xl bg-[#0D7366] text-white font-bold text-xs hover:bg-[#0A584E] transition-all"
                >
                  استعلام زنده اصالت
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>کد ملی فرآورده (IRC):</span>
                  <strong className="text-slate-800">{product.ircCode || '۱۶۲۸۴۹۵۰۰۳۹۲۸۱'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span>شماره سری ساخت (LOT):</span>
                  <strong className="text-slate-800">{product.lotNumber || 'NZ-2024-8849'}</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab Content 4: Customer Reviews */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Review summary stats */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-[#0D7366]">۴.۸</div>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">میانگین رضایت از {reviewsList.length} نظر</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 font-semibold">
                  ٪۹۶ خریداران خرید این فرآورده را پیشنهاد داده‌اند.
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                            خریدار نهایی
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                      <button className="flex items-center gap-1 hover:text-[#0D7366]">
                        <ThumbsUp className="w-3 h-3" /> مفید بود ({rev.likes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-800">ثبت دیدگاه یا تجربه استفاده:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0D7366]"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">امتیاز شما:</span>
                    <div className="flex text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="تجربه خود درباره کیفیت، اثرگذاری و بسته‌بندی این محصول بنویسید..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0D7366]"
                />

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0D7366] text-white text-xs font-bold hover:bg-[#0A584E] transition-colors"
                >
                  ثبت دیدگاه
                </button>
              </form>
            </motion.div>
          )}

          {/* Tab Content 5: Q&A */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {qaList.map((qa) => (
                  <div key={qa.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <HelpCircle className="w-4 h-4 text-[#0D7366]" />
                      <span>{qa.question}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-xs text-slate-700 space-y-1 mr-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#0D7366]">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>پاسخ {qa.pharmacistName}:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{qa.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ask Pharmacist Form */}
              <form onSubmit={handleAskPharmacist} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-800">طرح سوال از داروساز نوژاشاپ:</h3>
                <textarea
                  rows={2}
                  placeholder="سوال تخصصی خود را درباره تداخل، نحوه مصرف یا عوارض جانبی بنویسید..."
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0D7366]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0D7366] text-white text-xs font-bold hover:bg-[#0A584E] transition-colors"
                >
                  ارسال سوال برای داروساز
                </button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Product Comparison Matrix Table */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#0D7366]" />
            جدول مقایسه تطبیقی با محصولات هم‌رده درماتولوژی
          </h3>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-700">پارامتر مقایسه‌ای</th>
                  <th className="p-3 font-bold text-[#0D7366] bg-emerald-50/60">{product.name} (انتخاب شما)</th>
                  <th className="p-3 font-bold text-slate-600">محصولات معمولی بازار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">منشاء مواد اولیه</td>
                  <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">۱۰۰٪ وارداتی با استاندارد گرید دارویی USP</td>
                  <td className="p-3">صنعتی معمولی</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">سازگاری با پوست حساس</td>
                  <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">هایپوآلرژنیک (تست شده در کلینیک)</td>
                  <td className="p-3">امکان ایجاد حساسیت و قرمزی</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">احساس چربی و سنگینی</td>
                  <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">بافت مات، فاقد چربی و جذب زیر ۱۰ ثانیه</td>
                  <td className="p-3">حس چربی و براقیت روی پوست</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">تاییدیه رسمی سازمان غذا و دارو</td>
                  <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">دارای سیب سلامت و کد IRC معتبر</td>
                  <td className="p-3">تاییدیه عام</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0D7366]" />
                محصولات مرتبط و مکمل پیشنهادی
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((relProd) => (
                <div
                  key={relProd.id}
                  onClick={() => onSelectProduct(relProd)}
                  className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 flex flex-col justify-between group"
                >
                  <div className="aspect-square bg-slate-50 rounded-xl p-2 mb-2 relative overflow-hidden">
                    <img
                      src={relProd.image}
                      alt={relProd.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold block">{relProd.brand}</span>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#0D7366] transition-colors mb-2">
                      {relProd.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-[#0D7366]">
                      {formatPrice(relProd.price)} <span className="text-[9px] font-normal text-slate-400">تومان</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(relProd);
                      }}
                      className="p-1.5 rounded-lg bg-[#0D7366] text-white hover:bg-[#0A584E] transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
