import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  User,
  Share2,
  Heart,
  Bookmark,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Star,
  Send,
  Award,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import { Article, Product } from '../types';
import { SEOPageBreadcrumb } from './SEOPageBreadcrumb';

interface BlogDetailPageProps {
  article: Article;
  allArticles: Article[];
  relatedProducts: Product[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  article,
  allArticles,
  relatedProducts,
  onBack,
  onSelectArticle,
  onSelectProduct,
  onAddToCart,
  onShowToast,
}) => {
  const [likesCount, setLikesCount] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // New Comment state
  const [commentName, setCommentName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'دکتر مریم امینی',
      role: 'متخصص تغذیه و سلامت',
      date: '۲ ساعت پیش',
      text: 'مقاله بسیار جامع و کاربردی بود. توجه به ریتم شبانه‌روزی و جذب ویتامین‌ها نکته کلیدی است که متاسفانه خیلی‌ها رعایت نمی‌کنند.',
      likes: 12,
      verified: true,
    },
    {
      id: 'c2',
      author: 'امیرحسین کاظمی',
      role: 'کاربر نوژاشاپ',
      date: 'دیروز',
      text: 'با رعایت همین نکات ساده در کمتر از ۲ هفته نتیجه خیلی خوبی روی پوستم دیدم. ممنون از تیم علمی نوژاشاپ.',
      likes: 8,
      verified: true,
    },
  ]);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHasLiked(false);
  }, [article.id]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      onShowToast('ثبت پسندیدن', 'دیدگاه شما در پسندیدن این مقاله ثبت شد.', 'success');
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      onShowToast('ذخیره مقاله', 'این مقاله به لیست ذخیره‌شده‌های شما اضافه گردید.', 'info');
    } else {
      onShowToast('حذف ذخیره', 'مقاله از لیست ذخیره‌شده‌ها برداشته شد.', 'info');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onShowToast('لینک کپی شد', 'لینک اشتراک‌گذاری این مقاله در حافظه کپی گردید.', 'info');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      onShowToast('خطا', 'لطفا نام و نظر خود را وارد کنید.', 'warning');
      return;
    }
    const newComment = {
      id: Date.now().toString(),
      author: commentName,
      role: 'کاربر نوژاشاپ',
      date: 'هم‌اکنون',
      text: commentText,
      likes: 0,
      verified: true,
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentName('');
    setCommentText('');
    onShowToast('ثبت دیدگاه', 'نظر شما پس از تایید مدیریت در وبلاگ نمایش داده خواهد شد.');
  };

  // Other articles excluding current
  const otherArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <div className="w-full bg-slate-50/50 pb-24 pt-3 sm:pt-6">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Breadcrumb Navigation */}
        <nav className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <SEOPageBreadcrumb
            items={[
              { name: 'مجله سلامت', url: '/magazine' },
              { name: article.category, url: '/magazine' },
              { name: article.title, url: '/blog/' + article.id },
            ]}
          />

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#0D7366] hover:text-white transition-all text-xs font-bold flex-shrink-0 mr-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت</span>
          </button>
        </nav>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm border border-slate-100 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0D7366] text-xs font-black border border-emerald-100 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                دسته‌بندی: {article.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                زمان مطالعه: {article.readTime}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                ۱,۲۴۰ بازدید علمی
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight sm:leading-snug">
              {article.title}
            </h1>

            {/* Author & Action buttons row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0D7366] to-teal-500 text-white font-black flex items-center justify-center text-lg shadow-md">
                  {article.authorName ? article.authorName[0] : 'د'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-900 text-sm font-bold">
                      {article.authorName || 'دکتر مریم سجادی'}
                    </strong>
                    <ShieldCheck className="w-4 h-4 text-[#0D7366]" />
                  </div>
                  <span className="text-xs text-slate-500">
                    {article.authorRole || 'عضو هیئت علمی و داروساز مسئول فنی'} • {article.date}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                    hasLiked
                      ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
                  <span>{likesCount} پسند</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isBookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="ذخیره مقاله"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#0D7366] hover:text-white transition-all"
                  title="اشتراک گذاری"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Hero Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-slate-100 group">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 right-4 left-4 text-white text-xs font-medium flex items-center justify-between">
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg">
                تصویر اختصاصی داروسازی نوژاشاپ
              </span>
              <span className="hidden sm:inline bg-emerald-600/80 backdrop-blur-md px-3 py-1 rounded-lg font-bold">
                تایید علمی محتوا
              </span>
            </div>
          </div>

          {/* Key Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-100/80 space-y-2">
            <div className="flex items-center gap-2 text-[#0D7366] font-extrabold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>چکیده و نکات کلیدی مقاله:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {article.summary}
            </p>
          </div>

          {/* Full Content Body */}
          <div className="space-y-6 text-slate-800 text-sm sm:text-base leading-loose font-normal">
            <p>
              {article.content ||
                'سلامت و شادابی ارگان‌های بدن نیازمند روتین‌های روزانه منظم و انتخاب آگاهانه محصولات استاندارد است. با ورود به فصول مختلف، نیازهای تغذیه‌ای و درماتولوژیک تغییر کرده و شناخت ترکیبات موثره دارویی کمک شایانی به پیشگیری از آسیب‌های محیطی می‌نماید.'}
            </p>

            <h2 className="text-lg sm:text-xl font-extrabold text-[#0D7366] pt-2 border-r-4 border-[#0D7366] pr-3">
              ۱. گام اول: پاکسازی عمیق و آماده‌سازی
            </h2>
            <p className="text-slate-700">
              استفاده از شوینده‌های ملایم، فاقد سولفات و متناسب با تیپ پوستی یا گوارشی اولین قدم در ایجاد یک رژیم سلامت موفق است. آلودگی‌های سطحی مانع جذب ترکیبات مغذی سرم‌ها و مکمل‌های غذایی شده و اثربخشی آن‌ها را تا ۵۰ درصد کاهش می‌دهند.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border-r-4 border-amber-400 space-y-2 text-xs sm:text-sm">
              <strong className="text-amber-900 font-bold block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                توصیه داروساز مسئول فنی:
              </strong>
              <p className="text-slate-600 leading-relaxed">
                همواره مکمل‌ها و فرآورده‌های تخصصی را طبق دوز پیشنهادی پزشک یا داروساز مصرف نمایید. مصرف همزمان برخی داروها با مکمل‌های خاص ممکن است اثرگذاری یکدیگر را تغییر دهد.
              </p>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-[#0D7366] pt-2 border-r-4 border-[#0D7366] pr-3">
              ۲. گام دوم: آبرسانی، ترمیم و تثبیت
            </h2>
            <p className="text-slate-700">
              ترکیباتی همچون هیالورونیک اسید، آنتی‌اکسیدان‌ها، نیاسینامید و ویتامین‌های گروه B نقش بازسازی‌کننده در سدهای دفاعی دارند. مداومت در مصرف فرآورده‌های تاییدشده درماتولوژی ضمانت‌بخش سلامت بلندمدت شماست.
            </p>

            {/* Checklist of benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <span>تقویت سیستم ایمنی و شادابی سلولی</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <span>کاهش التهابات مزمن پوستی و داخلی</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <span>افزایش خاصیت ارتجاعی و شفافیت</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D7366] flex-shrink-0" />
                <span>محافظت در برابر رادیکال‌های آزاد</span>
              </div>
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D7366] text-white font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              {article.authorName ? article.authorName[0] : 'ن'}
            </div>
            <div className="space-y-1 text-center sm:text-right flex-1">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                نویسنده مقاله: {article.authorName || 'تیم تخصصی علوم دارویی نوژاشاپ'}
              </h3>
              <p className="text-xs text-[#0D7366] font-bold">
                {article.authorRole || 'کارشناس ارشد درماتولوژی و مشاور دارویی'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                تمامی مطالب ارائه‌شده در این مقاله مطابق با آخرین یافته‌های علمی بین‌المللی و تاییدشده توسط داروسازان کشیک نوژاشاپ نگارش یافته است.
              </p>
            </div>
          </div>

        </article>

        {/* Related Products Showcase for this Article */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#0D7366] uppercase tracking-wider block">
                  RECOMMENDED PRODUCTS FOR THIS ARTICLE
                </span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0D7366]" />
                  محصولات پیشنهادی مکمل این مقاله
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-100 hover:border-[#0D7366]/30 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="aspect-square rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#0D7366] bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                      {prod.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0D7366] transition-colors">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-black text-[#0D7366]">
                      {formatPrice(prod.price)} <span className="text-[10px]">تومان</span>
                    </span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="p-2 rounded-xl bg-[#0D7366] text-white hover:bg-[#0A584E] transition-colors shadow-sm"
                      title="افزودن به سبد"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Comments & Discussion */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0D7366]" />
              دیدگاه و تبادل نظر کاربران ({commentsList.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">پاسخگویی توسط کارشناسان دارویی</span>
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">ارسال دیدگاه جدید شما:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="نام و نام خانوادگی..."
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0D7366] text-xs font-medium outline-none"
              />
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ارسال دیدگاه کاملاً محرمانه و ایمن است.</span>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="نظر یا سوال خود را درباره این مقاله بنویسید..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#0D7366] text-xs font-medium outline-none resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0D7366] hover:bg-[#0A584E] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت دیدگاه</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {commentsList.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{c.author}</strong>
                    <span className="bg-emerald-100 text-[#0D7366] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {c.role}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{c.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Recommended Articles */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0D7366]" />
              سایر مقالات خواندنی مجله نوژاشاپ
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-100 hover:border-[#0D7366]/30 hover:shadow-lg transition-all space-y-3"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#0D7366] bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                    {art.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0D7366] transition-colors">
                    {art.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                  <span>{art.date}</span>
                  <span className="text-[#0D7366] font-semibold flex items-center gap-0.5">
                    مطالعه <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
