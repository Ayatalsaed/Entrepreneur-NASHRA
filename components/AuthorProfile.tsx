
import React, { useMemo } from 'react';
import { AuthorInfo, MOCK_ARTICLES } from '../constants';
import { ArrowRight, Twitter, Linkedin, Mail, Calendar, User } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { Article } from '../types';

interface AuthorProfileProps {
  author: AuthorInfo;
  onBack: () => void;
  onArticleClick: (article: Article) => void;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ author, onBack, onArticleClick }) => {
  const authorArticles = useMemo(() => 
    MOCK_ARTICLES.filter(a => a.author === author.name),
    [author.name]
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-6xl">
      {/* Navigation */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-sm"
        >
          <ArrowRight size={18} />
          <span>العودة للرئيسية</span>
        </button>
      </div>

      {/* Author Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 md:p-12 mb-16 shadow-xl shadow-slate-200/40 dark:shadow-none">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-emerald-50 dark:ring-emerald-950/30">
            <img 
              src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=059669&color=fff&size=200`} 
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow text-center md:text-right">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">الملف الشخصي للكاتب</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 font-amiri">{author.name}</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold mb-6">{author.role}</p>
            
            <div className="max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-amiri mb-8">
              {author.bio}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              {author.socials.twitter && (
                <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#1DA1F2] rounded-2xl transition-all">
                  <Twitter size={24} fill="currentColor" />
                </a>
              )}
              {author.socials.linkedin && (
                <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0077B5] rounded-2xl transition-all">
                  <Linkedin size={24} fill="currentColor" />
                </a>
              )}
              <a href="#" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Author Articles */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">مقالات {author.name}</h2>
        </div>

        {authorArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {authorArticles.map(article => (
              <ArticleCard 
                key={article.id}
                article={article}
                onClick={onArticleClick}
                variant="vertical"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">لا توجد مقالات منشورة لهذا الكاتب حالياً.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorProfile;
