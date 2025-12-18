
import React from 'react';
import { X, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary: string | null;
  loading: boolean;
  error: string | null;
  onOpenArticle: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  summary, 
  loading, 
  error,
  onOpenArticle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Sparkles size={24} className="fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-none">الملخص الذكي</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">مدعوم بذكاء Gemini</p>
            </div>
          </div>

          <h4 className="text-2xl font-bold text-slate-800 mb-8 font-amiri leading-tight">
            {title}
          </h4>

          <div className="min-h-[200px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">جاري استخلاص الأفكار الرئيسية...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 text-sm font-bold underline"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : (
              <div className="prose prose-slate prose-lg">
                <div className="text-slate-700 font-amiri text-xl leading-relaxed whitespace-pre-line bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100/50">
                  {summary}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onOpenArticle}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              إقرأ المقال كاملاً <ArrowLeft size={18} />
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default SummaryModal;
