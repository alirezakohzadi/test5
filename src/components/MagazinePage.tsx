import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Bookmark,
  ThumbsUp,
  Share2,
  Stethoscope,
  Send,
  CheckCircle2,
  HelpCircle,
  Award,
  ShoppingCart,
  Eye,
  Star,
  RefreshCw,
  BookOpen,
  Filter,
  ArrowLeft,
  Check,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Article, Product } from '../types';
import { blogService } from '../services/blogService';

interface MagazinePageProps {
  allProducts?: Product[];
  onSelectArticle: (article: Article) => void;
  onBackToHome: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, event?: React.MouseEvent) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CATEGORIES = [
  'همه مقالات',
  'سلامت پوست',
  'مکمل‌ها',
  'تغذیه',
  'مراقبت مو',
  'سلامت روان',
  'سبک زندگی',
  'محافظت آفتاب',
];

const DOCTORS = [
  {
    id: 1,
    name: 'دکتر مریم سجادی',
    role: 'متخصص پوست، مو و زیبایی',
    medicalCode: 'نظام پزشکی: ۱۲۸۴۵',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    articlesCount: 18,
    specialty: 'روتین‌های مراقبت پوستی و درمان آکنه',
  },
  {
    id: 2,
    name: 'دکتر کامران رضایی',
    role: 'دکترای تخصصی داروسازی',
    medicalCode: 'نظام پزشکی: ۹۸۷۴۱',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    articlesCount: 24,
    specialty: 'مکمل‌های ورزشی و تداخلات دارویی',
  },
  {
    id: 3,
    name: 'دکتر سارا نوری',
    role: 'مشاور تغذیه و سلامت خانواده',
    medicalCode: 'نظام پزشکی: ۶۵۴۱۲',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a87162b322?w=300&auto=format&fit=crop&q=80',
    articlesCount: 12,
    specialty: 'آنتی‌اکسیدان‌ها و تغذیه سالم',
  },
];

const FAQS = [
  {
    question: 'چگونه می‌توانم از اصالت مقالات پزشکی مجله نوژا مطمئن شوم؟',
    answer: 'تمام مقالات منتشر شده در مجله نوژا توسط داروسازان و پزشکان متخصص بررسی و نگارش شده و دارای ارجاعات علمی معتبر می‌باشند.',
  },
  {
    question: 'آیا امکان مشاوره مستقیم با داروساز نوژا وجود دارد؟',
    answer: 'بله، شما می‌توانید سوالات دارویی و پوستی خود را از طریق فرم مشاوره آنلاین ارسال کنید تا در کمتر از ۲ ساعت پاسخ تخصصی دریافت نمایید.',
  },
  {
    question: 'محصولات معرفی شده در مقالات را از کجا تهیه کنیم؟',
    answer: 'در زیر هر مقاله و در بخش اسلایدر ویژه مجله، محصولات تایید شده با تخفیف مخصوص خوانندگان قابل خریداری مستقیم هستند.',
  },
];

export const MagazinePage: React.FC<MagazinePageProps> = ({
  allProducts = [],
  onSelectArticle,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('همه مقالات');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'readTime'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const articlesSectionRef = useRef<HTMLDivElement>(null);
  
  // Bookmarks & Likes state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0); // 0: start, 1: q1, 2: q2, 3: q3, 4: result
  const [quizAnswers, setQuizAnswers] = useState({
    skinType: '',
    concern: '',
    ageGroup: '',
  });

  // Pharmacist Modal state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultationText, setConsultationText] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Carousel ref
  const productSliderRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: 'left' | 'right') => {
    if (productSliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      productSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
      onShowToast?.('نشان‌شده‌ها', 'مقاله از لیست نشان‌شده‌ها حذف شد', 'info');
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
      onShowToast?.('نشان‌شده‌ها', 'مقاله به لیست نشان‌شده‌های شما اضافه شد', 'success');
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.includes(id)) {
      setLikedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setLikedIds((prev) => [...prev, id]);
      onShowToast?.('پسندیدن مقاله', 'با تشکر از بازخورد مثبت شما!', 'success');
    }
  };

  const handleShare = (art: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast?.('اشتراک‌گذاری', 'لینک مقاله در حافظه کپی شد', 'success');
    } else {
      onShowToast?.('اشتراک‌گذاری', `مقاله: ${art.title}`, 'info');
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationText.trim()) return;
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setIsConsultModalOpen(false);
      setConsultationText('');
      onShowToast?.('ارسال موفق', 'سوال شما برای داروساز ارسال شد و بزودی پاسخ داده می‌شود.', 'success');
    }, 1200);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    onShowToast?.('خبرنامه سلامت', 'ایمیل شما با موفقیت در خبرنامه مجله ثبت شد', 'success');
  };

  // API Articles state
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const catSlug = selectedCategory === 'همه مقالات' ? undefined : selectedCategory;
      const res = await blogService.getArticles(catSlug, currentPage);
      setArticlesList(res.results);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Featured Hero Article
  const heroArticle = articlesList[0] || null;

  // Filtered Articles
  const filteredArticles = articlesList.filter((art) => {
    const matchesCategory =
      selectedCategory === 'همه مقالات' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'readTime') {
      const timeA = parseInt(a.readTime) || 0;
      const timeB = parseInt(b.readTime) || 0;
      return timeA - timeB;
    }
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredArticles.length);
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: 'newest' | 'readTime') => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  // Recommended products slider items
  const sliderProducts = allProducts.length > 0 ? allProducts.slice(0, 8) : [];

  return (
    <div className="w-full bg-slate-50/80 min-h-screen pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0D7366] via-[#0b6257] to-[#128a7b] text-white py-10 px-4 sm:px-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-[1240px] mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="flex items-center text-xs text-emerald-100/80 hover:text-white transition-colors mb-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit border border-white/10"
          >
            <span className="material-symbols-outlined text-sm ml-1">home</span>
            بازگشت به فروشگاه
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  مرجع تخصصی پزشکی و سلامت
                </span>
                <span className="text-xs text-emerald-100/70 hidden sm:inline">| بروزرسانی روزانه</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 leading-tight">
                مجله سلامت، زیبایی و داروسازی نوژا
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50/90 max-w-2xl leading-relaxed">
                جامع‌ترین مقالات علمی، راهنمای روتین پوستی، دانستنی‌های دارویی و مشاوره مستقیم با تیمی از داروسازان و متخصصان پوست.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-base font-bold text-white">+۲۵۰</span>
                  <span className="text-[10px] text-emerald-100/80">مقاله تخصصی</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-200">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-base font-bold text-white">۱۰۰٪</span>
                  <span className="text-[10px] text-emerald-100/80">تایید داروساز</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 -mt-4 relative z-20 space-y-10">

        {/* Hero Featured Article Card */}
        {heroArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    مقاله ویژه هفته
                  </span>
                  <span className="bg-emerald-50 text-[#0D7366] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {heroArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mr-auto">
                    <Clock className="w-3.5 h-3.5" />
                    زمان مطالعه: {heroArticle.readTime}
                  </span>
                </div>

                <h2
                  onClick={() => onSelectArticle(heroArticle)}
                  className="text-xl sm:text-2xl font-black text-slate-900 hover:text-[#0D7366] transition-colors cursor-pointer leading-tight"
                >
                  {heroArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {heroArticle.content || heroArticle.summary}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#0D7366] font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
                        alt={heroArticle.authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800">
                        {heroArticle.authorName || 'دکتر مریم سجادی'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {heroArticle.authorRole || 'متخصص پوست و مو'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectArticle(heroArticle)}
                    className="bg-[#0D7366] hover:bg-[#0b6257] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#0D7366]/20 transition-all flex items-center gap-2 group active:scale-95"
                  >
                    <span>مطالعه مقاله کامل</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div
                onClick={() => onSelectArticle(heroArticle)}
                className="lg:col-span-5 aspect-[16/10] sm:aspect-[16/9] lg:aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md group relative"
              >
                <img
                  src={heroArticle.image}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    مشاهده جزئیات مقاله
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Carousel Slider Section (گروه محصولات کشویی معرفی‌شده) */}
        {sliderProducts.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#0D7366]" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    🛒 محصولات منتخب مشاوران و پزشکان نوژا
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  محصولات استاندارد و تایید شده در مقالات آموزشی جهت مکمل روتین پوستی شما
                </p>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => scrollProducts('right')}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0D7366] hover:text-white text-slate-600 transition-all flex items-center justify-center border border-slate-200 shadow-sm active:scale-90"
                  title="قبلی"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollProducts('left')}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0D7366] hover:text-white text-slate-600 transition-all flex items-center justify-center border border-slate-200 shadow-sm active:scale-90"
                  title="بعدی"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Container */}
            <div
              ref={productSliderRef}
              className="flex items-stretch gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
            >
              {sliderProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="w-[220px] sm:w-[240px] shrink-0 bg-slate-50/70 hover:bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0D7366]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Badge */}
                    <div
                      onClick={() => onSelectProduct?.(prod)}
                      className="aspect-square rounded-xl overflow-hidden bg-white p-2 mb-3 relative cursor-pointer border border-slate-100"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      {prod.discountPercentage ? (
                        <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          %{prod.discountPercentage}
                        </span>
                      ) : null}
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      {prod.brand}
                    </span>
                    <h4
                      onClick={() => onSelectProduct?.(prod)}
                      className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-[#0D7366] transition-colors cursor-pointer mb-2 min-h-[32px]"
                    >
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-500 text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{prod.rating || 4.8}</span>
                      </div>

                      <div className="text-left">
                        {prod.originalPrice && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            {prod.originalPrice.toLocaleString('fa-IR')}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#0D7366]">
                          {prod.price.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={(e) => onAddToCart?.(prod, e)}
                        className="w-full bg-[#0D7366] hover:bg-[#0b6257] text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>خرید</span>
                      </button>
                      <button
                        onClick={() => onSelectProduct?.(prod)}
                        className="w-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>مشاهده</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skin Type Quiz & Interactive Tool (تست هوشمند نوع پوست) */}
        <div className="bg-gradient-to-br from-emerald-900 via-[#0D7366] to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="bg-white/15 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              ابزار آنلاین تشخیصی نوژا
            </span>

            <h3 className="text-xl sm:text-3xl font-black text-white mb-2">
              تست هوشمند تشخیص نوع پوست و پیشنهاد روتین
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mb-6">
              در کمتر از ۱ دقیقه با پاسخ به ۳ سوال ساده، نوع دقیق پوست خود را به همراه روتین مراقبتی پیشنهادی پزشک دریافت کنید.
            </p>

            {quizStep === 0 && (
              <button
                onClick={() => setQuizStep(1)}
                className="bg-white text-[#0D7366] hover:bg-emerald-50 font-black text-sm px-8 py-3 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                شروع تست رایگان نوع پوست 👈
              </button>
            )}

            {/* Quiz Question 1 */}
            {quizStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-right">
                <span className="text-xs text-emerald-200 font-bold block mb-2">سوال ۱ از ۳:</span>
                <p className="font-bold text-sm sm:text-base text-white mb-4">
                  احساس پوست شما ۲ ساعت پس از شستشو با شوینده معمولی چگونه است؟
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'براق و چرب در تمام نقاط صورت', value: 'oily' },
                    { label: 'خشک، کشیده و پوسته پوسته', value: 'dry' },
                    { label: 'چرب در پیشانی و بینی، نرم در گونه‌ها', value: 'combination' },
                    { label: 'قرمز، دارای خارش یا التهاب', value: 'sensitive' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setQuizAnswers((p) => ({ ...p, skinType: opt.value }));
                        setQuizStep(2);
                      }}
                      className="bg-white/15 hover:bg-white text-white hover:text-[#0D7366] text-xs font-bold p-3 rounded-xl transition-all text-right border border-white/20 active:scale-98"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quiz Question 2 */}
            {quizStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-right">
                <span className="text-xs text-emerald-200 font-bold block mb-2">سوال ۲ از ۳:</span>
                <p className="font-bold text-sm sm:text-base text-white mb-4">
                  اصلی‌ترین دغدغه یا مشکلی که دوست دارید برطرف شود چیست؟
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'جوش‌های سرسیاه و آکنه فعال', value: 'acne' },
                    { label: 'لک‌های آفتاب و تیرگی پوست', value: 'spots' },
                    { label: 'خطوط ریز و دهیدراته بودن شدید', value: 'dehydration' },
                    { label: 'منافذ باز و براقیت مداوم', value: 'pores' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setQuizAnswers((p) => ({ ...p, concern: opt.value }));
                        setQuizStep(3);
                      }}
                      className="bg-white/15 hover:bg-white text-white hover:text-[#0D7366] text-xs font-bold p-3 rounded-xl transition-all text-right border border-white/20 active:scale-98"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quiz Question 3 */}
            {quizStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-right">
                <span className="text-xs text-emerald-200 font-bold block mb-2">سوال ۳ از ۳:</span>
                <p className="font-bold text-sm sm:text-base text-white mb-4">
                  رده سنی شما کدام گزینه است؟
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'زیر ۲۰ سال', value: 'under20' },
                    { label: '۲۰ تا ۳۵ سال', value: '20to35' },
                    { label: 'بالای ۳۵ سال', value: 'over35' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setQuizAnswers((p) => ({ ...p, ageGroup: opt.value }));
                        setQuizStep(4);
                      }}
                      className="bg-white/15 hover:bg-white text-white hover:text-[#0D7366] text-xs font-bold p-3 rounded-xl transition-all text-center border border-white/20 active:scale-98"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quiz Result */}
            {quizStep === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white text-slate-900 rounded-2xl p-6 text-right shadow-xl">
                <div className="flex items-center gap-2 text-[#0D7366] font-black text-lg mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  نتیجه ارزیابی هوشمند پوست شما:
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-4 text-xs text-slate-700 leading-relaxed">
                  بر اساس پاسخ‌های شما، پوست شما <strong className="text-[#0D7366]">مختلط و مستعد دهیدراتاسیون</strong> تشخیص داده شد. نیاز اصلی پوست شما آبرسانی عمقی بدون استفاده از چربی‌های سنگین مسدودکننده منافذ است.
                </div>
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => {
                      setQuizStep(0);
                    }}
                    className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-200"
                  >
                    تکرار مجدد تست
                  </button>
                  <button
                    onClick={() => articlesList[0] && onSelectArticle(articlesList[0])}
                    className="bg-[#0D7366] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#0b6257]"
                  >
                    مطالعه مقاله روتین اختصاصی شما 👈
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Filter Bar & Search */}
        <div ref={articlesSectionRef} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو در مقالات و عنوان‌ها..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium pr-9 pl-4 py-2.5 rounded-xl focus:outline-none focus:border-[#0D7366] focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Sort & Quick Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                مرتب‌سازی:
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-white text-[#0D7366] shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  onClick={() => handleSortChange('readTime')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    sortBy === 'readTime'
                      ? 'bg-white text-[#0D7366] shadow-sm'
                      : 'hover:text-slate-900'
                  }`}
                >
                  کوتاه‌ترین زمان
                </button>
              </div>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0D7366] text-white shadow-md shadow-[#0D7366]/20 scale-102'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Articles Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📚 تمامی مقالات و دانستنی‌ها</span>
              <span className="text-xs text-slate-400 font-normal">
                ({filteredArticles.length} مقاله)
              </span>
            </h3>

            {/* Items Per Page Selector */}
            {filteredArticles.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
                <span>نمایش در هر صفحه:</span>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                  {[12, 24, 36].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleItemsPerPageChange(num)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        itemsPerPage === num
                          ? 'bg-[#0D7366] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                هیچ مقاله‌ای با مشخصات جستجو شده یافت نشد
              </p>
              <p className="text-xs text-slate-400">
                لطفاً عبارت جستجو یا دسته‌بندی انتخابی را تغییر دهید.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {paginatedArticles.map((art, idx) => {
                  const isBookmarked = bookmarkedIds.includes(art.id);
                  const isLiked = likedIds.includes(art.id);

                  return (
                    <motion.article
                      key={art.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#0D7366]/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container */}
                        <div
                          onClick={() => onSelectArticle(art)}
                          className="aspect-[16/10] rounded-xl overflow-hidden mb-3 relative cursor-pointer shadow-sm"
                        >
                          <img
                            src={art.image}
                            alt={art.title}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-[#0D7366] text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-white/50 shadow-sm">
                            {art.category}
                          </span>

                          {/* Top Left Action Icons */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                            <button
                              onClick={(e) => handleToggleBookmark(art.id, e)}
                              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                                isBookmarked
                                  ? 'bg-amber-500 text-white shadow-md'
                                  : 'bg-white/80 hover:bg-white text-slate-700'
                              }`}
                              title="نشان کردن"
                            >
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => onSelectArticle(art)}
                          className="font-bold text-sm text-slate-800 mb-2 leading-tight group-hover:text-[#0D7366] transition-colors line-clamp-2 cursor-pointer"
                        >
                          {art.title}
                        </h4>

                        {/* Summary */}
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed font-normal">
                          {art.summary}
                        </p>
                      </div>

                      <div>
                        {/* Author Info */}
                        <div className="flex items-center gap-2 mb-3 pt-2 border-t border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-[#0D7366] overflow-hidden">
                            {art.authorName ? art.authorName.charAt(0) : 'د'}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600 truncate">
                            {art.authorName || 'دکتر مریم سجادی'}
                          </span>
                        </div>

                        {/* Footer Metadata & Interactions */}
                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {art.date}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleToggleLike(art.id, e)}
                              className={`flex items-center gap-0.5 hover:text-rose-500 transition-colors ${
                                isLiked ? 'text-rose-500 font-bold' : ''
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{isLiked ? '۱' : ''}</span>
                            </button>
                            
                            <button
                              onClick={(e) => handleShare(art, e)}
                              className="hover:text-[#0D7366] transition-colors"
                              title="اشتراک گذاری"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>

                            <span className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-[#0D7366] font-medium">
                              <Clock className="w-3 h-3" />
                              {art.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-medium">
                    نمایش <strong className="text-slate-800 font-bold">{startIndex + 1}</strong> تا{' '}
                    <strong className="text-slate-800 font-bold">{endIndex}</strong> از{' '}
                    <strong className="text-[#0D7366] font-black">{filteredArticles.length}</strong> مقاله علمی
                  </div>

                  <div className="flex items-center gap-1.5 dir-rtl">
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>صفحه قبل</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#0D7366] text-white shadow-md shadow-[#0D7366]/20 scale-105'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>صفحه بعد</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ask the Pharmacist Banner & Doctor Team (تیم تخصصی پزشکی) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Ask Pharmacist Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0D7366] to-[#084941] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="bg-white/20 text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-3">
                پاسخگویی رایگان داروساز
              </span>
              <h3 className="text-xl font-black mb-2">
                سوال دارویی یا پوستی دارید؟
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                درباره عوارض داروها، تداخلات مکمل‌ها و یا انتخاب محصول مناسب ابهام دارید؟ سوال خود را ثبت کنید تا پزشکان نوژا پاسخ دهند.
              </p>
            </div>

            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-white text-[#0D7366] hover:bg-emerald-50 text-xs font-bold py-3 px-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ارسال سوال از داروساز آنلاین</span>
            </button>
          </div>

          {/* Doctors Team Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#0D7366]" />
              <span>تیم مشاوره و نویسندگان تخصصی نوژا</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DOCTORS.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center flex flex-col items-center justify-between"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/30 mb-2 shadow-sm">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-0.5">
                      {doc.name}
                    </h4>
                    <span className="text-[10px] text-[#0D7366] font-semibold block mb-1">
                      {doc.role}
                    </span>
                    <span className="text-[9px] text-slate-400 block mb-2">
                      {doc.medicalCode}
                    </span>
                  </div>
                  <span className="bg-emerald-100/60 text-[#0D7366] text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {doc.articlesCount} مقاله منتشرشده
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0D7366]" />
            <span>سوالات متداول خوانندگان مجله</span>
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D7366]" />
                  {faq.question}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pr-3">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              خبرنامه سلامت و تخفیف‌های ویژه
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              جدیدترین مقالات و نکات دارویی در ایمیل شما
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              با عضویت در خبرنامه، هر هفته یک بسته محتوایی شامل نکات کلیدی روتین پوستی و کدهای تخفیف خوانندگان دریافت کنید.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                placeholder="آدرس ایمیل خود را وارد کنید..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-[#0D7366] hover:bg-[#0b6257] text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all active:scale-95 cursor-pointer"
              >
                {newsletterSuccess ? 'ثبت شد ✓' : 'عضویت در خبرنامه'}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Pharmacist Consult Modal */}
      <AnimatePresence>
        {isConsultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setIsConsultModalOpen(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-[#0D7366] font-black text-base mb-2">
                <Stethoscope className="w-5 h-5 text-[#0D7366]" />
                <span>طرح سوال از داروساز نوژا</span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                سوال یا ابهام دارویی/پوستی خود را ثبت کنید. پاسخ داروساز تا حداکثر ۲ ساعت دیگر از طریق پیامک یا ایمیل ارسال می‌گردد.
              </p>

              <form onSubmit={handleConsultSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    متن سوال یا شرح دغدغه پوستی:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={consultationText}
                    onChange={(e) => setConsultationText(e.target.value)}
                    placeholder="مثال: من پوست چربی دارم اما بعد از شستشو پوسته پوسته می‌شود، چه مرطوب‌کننده‌ای پیشنهاد می‌دهید؟"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0D7366]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={consultSubmitted}
                  className="w-full bg-[#0D7366] hover:bg-[#0b6257] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{consultSubmitted ? 'در حال ارسال...' : 'ثبت و ارسال نهایی سوال'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
