
import React, { useState } from 'react';
import { X, Twitter, Linkedin, Facebook, Link as LinkIcon, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 left-5 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">مشاركة المقال</h3>
          </div>

          <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 font-amiri leading-relaxed">
              {title}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <a 
              href={shareLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/5 dark:hover:bg-[#1DA1F2]/10 transition-all text-slate-600 dark:text-slate-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2]"
            >
              <Twitter size={24} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest">تويتر</span>
            </a>
            <a 
              href={shareLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#0077B5]/20 hover:bg-[#0077B5]/5 dark:hover:bg-[#0077B5]/10 transition-all text-slate-600 dark:text-slate-400 hover:text-[#0077B5] dark:hover:text-[#0077B5]"
            >
              <Linkedin size={24} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest">لينكد إن</span>
            </a>
            <a 
              href={shareLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#1877F2]/20 hover:bg-[#1877F2]/5 dark:hover:bg-[#1877F2]/10 transition-all text-slate-600 dark:text-slate-400 hover:text-[#1877F2] dark:hover:text-[#1877F2]"
            >
              <Facebook size={24} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest">فيسبوك</span>
            </a>
            <button 
              onClick={handleCopy}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                copied 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {copied ? <Check size={24} /> : <LinkIcon size={24} />}
              <span className="text-xs font-bold uppercase tracking-widest">
                {copied ? 'تم النسخ' : 'نسخ الرابط'}
              </span>
            </button>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
