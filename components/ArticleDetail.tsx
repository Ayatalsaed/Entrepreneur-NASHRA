import React from 'react';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';
import ArticleCard from './ArticleCard';
import { ArrowRight, Calendar, User, Share2, Bookmark, Clock, MessageCircle } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onNavigateToArticle: (article: Article) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, onNavigateToArticle }) => {
  const readTime = article.readingTime || Math.ceil(article.content.length / 500) + ' دقيقة للقراءة';
  
  const relatedArticles = MOCK_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-20">
      <div className="sticky top-[84px] md:top-[92px] z-30 bg-white/80 backdrop-blur border-b border-slate-100 py-3">
        <div className="container mx-auto px-4">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-bold text-sm"
            >
                <ArrowRight size={18} />
                <span>العودة للأخبار</span>
            </button>
        </div>
      </div>

      <article className="container mx-auto px-4 max-w-4xl mt-12">
        <header className="mb-12">
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 uppercase tracking-widest">
                  {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2] mb-8 text-center">
                {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 border-y border-slate-100 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-emerald-100">
                         <img src={`https://ui-avatars.com/api/?name=${article.author}&background=059669&color=fff`} alt={article.author} />
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="font-bold text-slate-900 text-base">{article.author}</span>
                        <span className="text-xs">رئيس التحرير</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Calendar size={18} className="text-emerald-500" /> {article.date}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock size={18} className="text-emerald-500" /> {readTime}
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all border border-slate-100">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all border border-slate-100">
                        <Bookmark size={20} />
                    </button>
                </div>
            </div>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl mb-16 border border-slate-200">
             <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto object-cover max-h-[700px]"
            />
             <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 italic">
                مصدر الصورة: Entrepreneur NASHRA Archive
             </div>
        </div>

        <div className="prose prose-xl prose-slate max-w-none text-slate-800 mx-auto">
            <div className="leading-[2.2] whitespace-pre-line text-lg md:text-2xl font-amiri tracking-wide px-2 md:px-6">
              {article.content}
            </div>
        </div>

        <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="text-emerald-600" />
              تعليقات القراء
            </h3>
            <div className="space-y-4">
              <p className="text-slate-500 text-sm italic">لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>
              <textarea 
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right bg-white" 
                placeholder="أضف تعليقك هنا..."
                rows={3}
              ></textarea>
              <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all">إرسال</button>
            </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-100">
             <h3 className="text-2xl font-black mb-8 text-slate-900 border-r-4 border-emerald-500 pr-4">إقرأ أيضاً</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {relatedArticles.length > 0 ? (
                   relatedArticles.map(rel => (
                       <ArticleCard 
                        key={rel.id} 
                        article={rel} 
                        onClick={onNavigateToArticle} 
                        variant="vertical" 
                       />
                   ))
                 ) : (
                   <p className="text-slate-400">لا توجد مقالات مشابهة حالياً.</p>
                 )}
             </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;