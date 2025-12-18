
import React, { useState } from 'react';
import { Article } from '../types';
import { Calendar, User, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { summarizeArticle } from '../services/geminiService';
import SummaryModal from './SummaryModal';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'vertical' | 'horizontal' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, variant = 'vertical' }) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple read time estimation
  const readTime = article.readingTime || Math.ceil(article.content.length / 500) + ' دقيقة';

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSummaryOpen(true);
    
    if (summary) return; // Don't fetch if we already have it

    setLoading(true);
    setError(null);
    try {
      const result = await summarizeArticle(article.title, article.content);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل توليد الملخص');
    } finally {
      setLoading(false);
    }
  };

  const SummaryButton = () => (
    <button 
      onClick={handleSummarize}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-100 group/btn"
      title="ملخص الذكاء الاصطناعي"
    >
      <Sparkles size={14} className="group-hover/btn:scale-110 transition-transform" />
      <span className="text-[10px] font-bold">ملخص ذكي</span>
    </button>
  );

  if (variant === 'compact') {
    return (
      <>
        <div 
          onClick={() => onClick(article)}
          className="group flex gap-4 items-start cursor-pointer p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100"
        >
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
              <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
          </div>
          <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{article.category}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {readTime}</span>
                  </div>
                  <button onClick={handleSummarize} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                    <Sparkles size={14} />
                  </button>
              </div>
              <h4 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
              {article.title}
              </h4>
          </div>
        </div>
        <SummaryModal 
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          title={article.title}
          summary={summary}
          loading={loading}
          error={error}
          onOpenArticle={() => onClick(article)}
        />
      </>
    )
  }

  if (variant === 'horizontal') {
    return (
      <>
        <div 
          onClick={() => onClick(article)}
          className="group flex flex-col sm:flex-row gap-5 cursor-pointer bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 h-full"
        >
          <div className="sm:w-5/12 overflow-hidden rounded-xl relative h-48 sm:h-auto">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
          <div className="sm:w-7/12 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{article.category}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {readTime}</span>
              </div>
              <SummaryButton />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-3 leading-tight font-amiri">
              {article.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex items-center text-xs text-slate-400 gap-4 mt-auto border-t border-slate-50 pt-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-500"><User size={14} className="text-emerald-500" /> {article.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
            </div>
          </div>
        </div>
        <SummaryModal 
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          title={article.title}
          summary={summary}
          loading={loading}
          error={error}
          onOpenArticle={() => onClick(article)}
        />
      </>
    );
  }

  // Vertical (Default)
  return (
    <>
      <div 
        onClick={() => onClick(article)}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full"
      >
        <div className="relative overflow-hidden h-52">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-900 rounded-full shadow-sm text-center">
              {article.category}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {readTime}</span>
              </div>
              <button 
                onClick={handleSummarize}
                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
              >
                <Sparkles size={16} />
              </button>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2 font-amiri">
            {article.title}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-auto">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                {article.author.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-600">{article.author}</span>
          </div>
        </div>
      </div>
      <SummaryModal 
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        title={article.title}
        summary={summary}
        loading={loading}
        error={error}
        onOpenArticle={() => onClick(article)}
      />
    </>
  );
};

export default ArticleCard;
