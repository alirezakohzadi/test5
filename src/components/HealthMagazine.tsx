import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Clock, Calendar, User, X, BookOpen, Share2, RefreshCw } from 'lucide-react';
import { blogService } from '../services/blogService';
import { Article } from '../types';

interface HealthMagazineProps {
  onSelectArticle?: (article: Article) => void;
  onNavigateMagazine?: () => void;
}

export const HealthMagazine: React.FC<HealthMagazineProps> = ({ onSelectArticle, onNavigateMagazine }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogService.getArticles();
      setArticles(response.results.slice(0, 8));
    } catch {
      setError('خطا در دریافت مقالات از سرور.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleArticleClick = (art: Article) => {
    if (onSelectArticle) {
      onSelectArticle(art);
    } else {
      setSelectedArticle(art);
    }
  };

  return (
    <section id="blog" className="w-full py-6 mb-8 bg-white border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
          <div>
            <span className="text-[8px] sm:text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
              HEALTH & BEAUTY JOURNAL
            </span>
            <h2 className="text-xs sm:text-lg font-black text-[#0D7366]">خواندنی‌های تخصصی نوژا</h2>
          </div>
          <button
            onClick={() => onNavigateMagazine?.()}
            className="text-[10px] sm:text-xs font-bold text-slate-600 hover:text-[#0D7366] transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <span>مشاهده همه مقالات</span>
            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 animate-pulse h-48 border border-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100 text-center space-y-3">
            <p className="text-xs sm:text-sm font-bold text-rose-700">{error}</p>
            <button
              onClick={loadArticles}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">هیچ مقاله‌ای یافت نشد.</div>
        ) : (
          /* Article Cards Container - 2 Rows of 4 Columns (8 articles total) */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {articles.map((art, idx) => (
              <motion.article
                key={art.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => handleArticleClick(art)}
                className="group cursor-pointer bg-white rounded-lg sm:rounded-2xl p-1.5 sm:p-3 border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#0D7366]/20 transition-all flex flex-col justify-between snap-start"
              >
                <div>
                  <div className="aspect-video rounded overflow-hidden mb-1 sm:mb-3 shadow-sm group-hover:shadow-md transition-all relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 bg-white/90 backdrop-blur-md text-[#0D7366] text-[7px] sm:text-[9px] font-bold px-1 py-0.2 rounded border border-white/50 shadow-sm truncate max-w-[65px]">
                      {art.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-[9px] sm:text-xs text-slate-800 mb-0.5 leading-tight group-hover:text-[#0D7366] transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-[8px] sm:text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 mb-1 leading-tight font-normal">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-1 sm:pt-2 border-t border-slate-100 flex justify-between items-center text-[7.5px] sm:text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                    {art.date}
                  </span>
                  <span className="flex items-center gap-0.5 bg-slate-50 px-0.5 py-0.2 rounded border border-slate-100">
                    <Clock className="w-2 h-2 sm:w-3 sm:h-3 text-[#0D7366]" />
                    {art.readTime}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0D7366]" />
                  <span className="text-xs font-bold text-[#0D7366]">{selectedArticle.category}</span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#0D7366]" />
                    {selectedArticle.authorName} ({selectedArticle.authorRole})
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#0D7366]" />
                    {selectedArticle.readTime}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h1>

                <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedArticle.content || selectedArticle.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>مجله تخصصی نوژاشاپ</span>
                <button
                  onClick={() => alert('لینک مقاله در حافظه کپی شد.')}
                  className="flex items-center gap-1 text-[#0D7366] font-semibold hover:underline"
                >
                  <Share2 className="w-4 h-4" /> به اشتراک‌گذاری
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
