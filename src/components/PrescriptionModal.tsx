'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, FileCheck, PhoneCall, Shield, Send, CheckCircle2 } from 'lucide-react';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [patientNote, setPatientNote] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('لطفاً شماره تماس خود را وارد فرمایید.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast('ثبت موفق نسخه', 'نسخه شما تحویل داروساز نوژاشاپ شد. به‌زودی جهت هماهنگی با شما تماس می‌گیریم.');
    }, 1200);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFileName(null);
    setPatientNote('');
    setPhone('');
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#8A6D0B] flex items-center justify-center border border-[#D4AF37]/30">
                  <FileCheck className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">ارسال نسخه پزشک & مشاوره داروساز</h3>
                  <p className="text-xs text-slate-500">
                    تصویر نسخه خود را بارگذاری کنید؛ داروسازان نوژاشاپ با شما تماس می‌گیرند.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Drag & Drop File Upload area */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#0D7366] transition-colors relative bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 text-[#0D7366] mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-700">
                    {fileName ? (
                      <span className="text-[#0D7366]">فایل انتخاب شد: {fileName}</span>
                    ) : (
                      'برای بارگذاری عکس نسخه یا فایل PDF اینجا کلیک کنید'
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۱۰ مگابایت)</p>
                </div>

                {/* Phone number field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شماره همراه (جهت تماس داروساز) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0D7366] outline-none"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    توضیحات تکمیلی یا سوال از داروساز (اختیاری)
                  </label>
                  <textarea
                    rows={3}
                    value={patientNote}
                    onChange={(e) => setPatientNote(e.target.value)}
                    placeholder="مثال: برند ترجیحی داروها، نحوه مصرف یا شرایط بیمه..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#0D7366] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0D7366] to-[#129383] text-white font-bold text-xs shadow-lg shadow-[#0D7366]/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>در حال ارسال نسخه...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ارسال برای داروساز نوژاشاپ</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100 mt-4">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#0D7366]" /> اطلاعات شما نزد داروساز محرمانه می‌ماند
                </span>
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-[#0D7366]" /> مشاوره رایگان تلفنی
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-[#0D7366] mx-auto mb-3 animate-pulse" />
              <h3 className="font-bold text-lg text-slate-800 mb-1">نسخه با موفقیت دریافت شد!</h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                داروساز مسئول نوژاشاپ نسخه را بررسی کرده و تا حداکثر ۱۵ دقیقه آینده با شماره{' '}
                <strong className="text-slate-900" dir="ltr">{phone}</strong> تماس خواهد گرفت.
              </p>
              <button
                onClick={resetForm}
                className="px-8 py-2.5 rounded-xl bg-[#0D7366] text-white font-bold text-xs shadow-md shadow-[#0D7366]/20"
              >
                متوجه شدم
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
