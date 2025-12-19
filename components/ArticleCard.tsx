
import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';
import { Calendar, User, Clock, ArrowUpRight, Sparkles, Heart, AlertTriangle, Share2, ArrowLeft, Play, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { summarizeArticle } from '../services/geminiService';
import SummaryModal from './SummaryModal';
import ShareModal from './ShareModal';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'vertical' | 'horizontal' | 'compact' | 'large';
  hideRelated?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, variant = 'vertical', hideRelated = false }) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [isLiked, setIsLiked] = useState(() => {
    try {
      const saved = localStorage.getItem('nashra_liked_articles');
      if (saved) {
        const likedIds = JSON.parse(saved);
        return likedIds.includes(article.id);
      }
    } catch (e) {
      console.error("Error reading likes from localStorage", e);
    }
    return false;
  });

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    try {
      const saved = localStorage.getItem('nashra_liked_articles');
      let likedIds = saved ? JSON.parse(saved) : [];
      
      if (newLikedState) {
        if (!likedIds.includes(article.id)) likedIds.push(article.id);
      } else {
        likedIds = likedIds.filter((id: string) => id !== article.id);
      }
      
      localStorage.setItem('nashra_liked_articles', JSON.stringify(likedIds));
    } catch (e) {
      console.error("Error saving likes to localStorage", e);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.hash = `author/${encodeURIComponent(article.author)}`;
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const calculateReadTime = () => {
    if (article.readingTime) return article.readingTime;
    const words = article.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    if (minutes === 1) return 'دقيقة واحدة';
    if (minutes === 2) return 'دقيقتان';
    if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق`;
    return `${minutes} دقيقة`;
  };

  const readTime = calculateReadTime();

  const handleSummarize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSummaryOpen(true);
    if (summary) return;
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

  const relatedArticles = useMemo(() => {
    if (hideRelated) return [];
    return MOCK_ARTICLES
      .filter(a => a.id !== article.id && (a.category === article.category || a.tags?.some(t => article.tags?.includes(t))))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  }, [article.id, article.category, article.tags, hideRelated]);

  const RelatedSection = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => {
    if (hideRelated || relatedArticles.length === 0) return null;

    return (
      <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-100 dark:border-slate-800'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Layers size={14} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'} />
          <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>مواضيع ذات صلة</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {relatedArticles.map(rel => (
            <div 
              key={rel.id} 
              onClick={(e) => { e.stopPropagation(); onClick(rel); }}
              className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                theme === 'dark' 
                ? 'hover:bg-white/5 bg-white/2' 
                : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h5 className={`text-xs font-bold leading-tight line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                  {rel.title}
                </h5>
                <span className={`text-[9px] font-medium ${theme === 'dark' ? 'text-emerald-400/70' : 'text-emerald-600 dark:text-emerald-400'}`}>{rel.category}</span>
              </div>
              <ArrowLeft size={12} className={theme === 'dark' ? 'text-white/20' : 'text-slate-300 dark:text-slate-700'} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const WarningBadge = ({ className = "", isOverlay = false }: { className?: string; isOverlay?: boolean }) => {
    if (!article.contentWarning) return null;
    return (
      <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 text-white rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-wide w-fit animate-pulse shadow-xl shadow-rose-900/20 border border-white/20 group-hover:scale-105 transition-transform ${isOverlay ? 'backdrop-blur-md bg-opacity-80' : ''} ${className}`}>
        <div className="bg-white/30 p-1.5 rounded-lg">
          <AlertTriangle size={16} className="text-white fill-current" />
        </div>
        <span className="font-tajawal drop-shadow-sm">تنبيه المحتوى: {article.contentWarning}</span>
      </div>
    );
  };

  const VideoPlayOverlay = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
    if (!article.videoUrl) return null;
    
    const sizes = {
      sm: { container: "w-8 h-8", icon: 14 },
      md: { container: "w-12 h-12", icon: 20 },
      lg: { container: "w-16 h-16", icon: 28 }
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
        <div className={`${sizes[size].container} bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
          <Play size={sizes[size].icon} fill="white" className="text-white ml-1" />
        </div>
      </div>
    );
  };

  const VideoBadge = () => {
    if (!article.videoUrl) return null;
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 dark:bg-emerald-600 text-white rounded text-[10px] font-black uppercase">
        <Play size={8} fill="currentColor" /> فيديو
      </span>
    );
  };

  // Correct sharing URL for hash-based routing
  const articleUrl = `${window.location.origin}/#article/${article.id}`;

  const renderVariant = () => {
    if (variant === 'large') {
      return (
        <div 
          onClick={() => onClick(article)}
          className="group relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl h-[500px] md:h-[750px] border border-white/10 dark:border-slate-800 animate-fade-in hover:scale-[1.01] hover:shadow-emerald-900/30 transition-all duration-700 ease-out"
        >
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
          
          <VideoPlayOverlay size="lg" />

          <WarningBadge 
            isOverlay 
            className="absolute top-10 right-10 z-20 md:px-7 md:py-4 md:text-sm md:rounded-3xl shadow-2xl ring-4 ring-rose-500/30" 
          />

          <div className="relative h-full flex flex-col justify-end p-8 md:p-14 text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-5 py-2 bg-emerald-600 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">
                    {article.category}
                  </span>
                  <VideoBadge />
                  <span className="flex items-center gap-2 text-sm font-bold text-emerald-100/80 backdrop-blur-md bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Clock size={16} className="text-emerald-400" /> {readTime}
                  </span>
                </div>
                <button 
                  onClick={handleSummarize}
                  className="p-3 bg-white/10 hover:bg-emerald-600 backdrop-blur-md rounded-2xl transition-all border border-white/10 group/summarize"
                >
                  <Sparkles size={20} className="group-hover/summarize:scale-110 transition-transform" />
                </button>
            </div>

            <div className="space-y-4 mb-8">
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[1.05] font-amiri drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] max-w-5xl group-hover:text-emerald-50 transition-all duration-500 tracking-tight">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-200/90 font-medium line-clamp-2 md:w-3/4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-1000 delay-100 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/10 mb-8">
              <div className="flex items-center gap-4">
                <div 
                  onClick={handleAuthorClick}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-xl ring-4 ring-white/10 overflow-hidden group-hover:ring-emerald-500/50 transition-all duration-500 cursor-pointer"
                >
                  <img src={`https://ui-avatars.com/api/?name=${article.author}&background=059669&color=fff`} alt={article.author} />
                </div>
                <div className="flex flex-col">
                  <span 
                    onClick={handleAuthorClick}
                    className="font-black text-white text-lg md:text-xl flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <User size={18} className="text-emerald-400" /> {article.author}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm text-emerald-400 font-bold flex items-center gap-2">
                      <Calendar size={14} className="text-emerald-400" /> {article.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                 <button 
                    onClick={toggleLike}
                    className={`p-3.5 md:p-4 rounded-2xl md:rounded-[1.25rem] backdrop-blur-md transition-all shadow-lg ${
                      isLiked ? 'bg-rose-600 text-white' : 'bg-white/10 text-white hover:bg-rose-600 border border-white/10'
                    }`}
                    aria-label="أعجبني"
                 >
                    <Heart size={22} className={isLiked ? "fill-current" : ""} />
                 </button>
                 <button 
                    onClick={handleShare}
                    className="p-3.5 md:p-4 rounded-2xl md:rounded-[1.25rem] backdrop-blur-md bg-white/10 text-white hover:bg-emerald-600 transition-all shadow-lg border border-white/10"
                    aria-label="مشاركة"
                 >
                    <Share2 size={22} />
                 </button>
              </div>
            </div>

            {!hideRelated && (
              <div className="max-w-md animate-fade-in delay-500 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                <RelatedSection theme="dark" />
              </div>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div 
          onClick={() => onClick(article)}
          className="group grid grid-cols-[theme(spacing.24)_1fr] gap-4 cursor-pointer p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
        >
          <div className="w-24 h-24 rounded-lg overflow-hidden relative shadow-sm">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <VideoPlayOverlay size="sm" />
          </div>
          <div className="grid grid-rows-[auto_auto_1fr_auto] gap-1">
              <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">{article.category}</span>
                    <VideoBadge />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-bold">
                      <Clock size={10} className="text-emerald-500" /> {readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleSummarize} className="p-1.5 text-emerald-500 hover:text-emerald-700 transition-colors" aria-label="ملخص ذكي"><Sparkles size={14} /></button>
                    <button onClick={handleShare} className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors" aria-label="مشاركة"><Share2 size={14} /></button>
                    <button onClick={toggleLike} className={`p-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-300 dark:text-slate-700 hover:text-rose-500'}`} aria-label="أعجبني"><Heart size={14} className={isLiked ? "fill-current" : ""} /></button>
                  </div>
              </div>
              <WarningBadge className="mb-1 py-1.5 px-3 text-[10px] rounded-xl" />
              <h4 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{article.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 dark:text-slate-500 font-bold">
                  <span 
                    onClick={handleAuthorClick}
                    className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <User size={10} className="text-emerald-500" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1"><Calendar size={10} className="text-emerald-500" /> {article.date}</span>
              </div>
          </div>
        </div>
      );
    }

    if (variant === 'horizontal') {
      return (
        <div 
          onClick={() => onClick(article)}
          className="group flex flex-col sm:flex-row gap-6 cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 border border-slate-100 dark:border-slate-800 h-full overflow-hidden"
        >
          {/* Image Part */}
          <div className="flex-shrink-0 w-full sm:w-5/12 lg:w-4/12 h-56 sm:h-auto min-h-[220px] overflow-hidden rounded-3xl relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            
            <VideoPlayOverlay size="md" />

            {/* Float Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-2.5 rounded-full text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg flex items-center justify-center">
                  <ArrowUpRight size={18} />
              </div>
              <button onClick={handleShare} className="p-2.5 rounded-full backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 delay-75 hover:text-emerald-600 shadow-lg" aria-label="مشاركة"><Share2 size={18} /></button>
              <button onClick={toggleLike} className={`p-2.5 rounded-full backdrop-blur-sm transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300 delay-150 ${isLiked ? 'bg-rose-500 text-white opacity-100' : 'bg-white/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400 hover:text-rose-500'}`} aria-label="أعجبني"><Heart size={18} className={isLiked ? "fill-current" : ""} /></button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Content Part */}
          <div className="flex-grow flex flex-col justify-between py-1 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-100/50 dark:border-emerald-900/50 uppercase tracking-widest">{article.category}</span>
                  <VideoBadge />
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-bold"><Clock size={14} className="text-emerald-500" /> {readTime}</span>
                </div>
                <button onClick={handleSummarize} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-100 dark:border-emerald-900/50 group/btn shadow-sm hover:shadow-emerald-100"><Sparkles size={14} className="group-hover/btn:scale-110 transition-transform" /><span className="text-[10px] font-bold">ملخص ذكي</span></button>
              </div>
              
              <div className="space-y-3">
                <WarningBadge className="md:text-[13px] md:px-6 md:py-3 md:rounded-2xl shadow-rose-500/10" />
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300 leading-tight font-amiri">{article.title}</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
                    <p className={`text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {isExpanded ? article.content : article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleExpand}
                        className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:text-emerald-700 dark:hover:text-emerald-300 transition-all w-fit py-1 px-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                    >
                        {isExpanded ? (
                            <>عرض أقل <ChevronUp size={14} /></>
                        ) : (
                            <>إقرأ المزيد <ChevronDown size={14} /></>
                        )}
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-all py-1 px-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800" aria-label="مشاركة">
                      <Share2 size={14} /> مشاركة
                    </button>
                  </div>
              </div>
            </div>
            
            {/* Footer Metadata */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 dark:border-slate-800 mt-2">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-bold">
                <span 
                  onClick={handleAuthorClick}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-emerald-500" /> {article.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" /> {article.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs group-hover:translate-x-[-8px] transition-transform duration-300">
                <span>عرض المقال</span>
                <ArrowLeft size={14} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        onClick={() => onClick(article)}
        className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer grid grid-rows-[auto_1fr] h-full"
      >
        <div className="relative overflow-hidden h-64">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-115 transition-transform duration-[2000ms]" />
          
          <VideoPlayOverlay size="md" />

          <div className="absolute top-5 right-5 flex items-center gap-2">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-1.5 text-xs font-black text-slate-900 dark:text-white rounded-full shadow-lg border border-white/20 dark:border-slate-800">{article.category}</div>
            <VideoBadge />
          </div>
          <div className="absolute top-5 left-5 flex flex-col gap-2">
             <button onClick={toggleLike} className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-xl ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500'}`} aria-label="أعجبني"><Heart size={20} className={isLiked ? "fill-current" : ""} /></button>
             <button onClick={handleShare} className="p-2.5 rounded-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 hover:text-emerald-600 transition-all shadow-xl delay-75" aria-label="مشاركة"><Share2 size={20} /></button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="p-7 grid grid-rows-[auto_auto_1fr_auto] gap-4">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-bold">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-500" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" /> {readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSummarize} className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50" aria-label="ملخص ذكي"><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /></button>
              </div>
          </div>
          
          <div className="space-y-2">
            <WarningBadge className="mb-2 rounded-2xl py-2 px-4 shadow-rose-500/10" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300 leading-tight font-amiri line-clamp-2">{article.title}</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px]' : 'max-h-24'}`}>
              <p className={`text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                  {isExpanded ? article.content : article.excerpt}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                  onClick={toggleExpand}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:text-emerald-700 dark:hover:text-emerald-300 transition-all w-fit py-1 px-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
              >
                  {isExpanded ? (
                      <>عرض أقل <ChevronUp size={14} /></>
                  ) : (
                      <>إقرأ المزيد <ChevronDown size={14} /></>
                  )}
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold text-xs hover:text-emerald-600 dark:hover:text-emerald-400 transition-all py-1 px-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800" aria-label="مشاركة">
                <Share2 size={14} /> مشاركة
              </button>
            </div>
          </div>
          
          {!hideRelated && (
             <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <RelatedSection />
             </div>
          )}

          <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800 mt-2">
              <div className="flex items-center gap-3">
                <div 
                  onClick={handleAuthorClick}
                  className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-sm font-black ring-4 ring-emerald-50 dark:ring-emerald-950 group-hover:ring-emerald-100 dark:group-hover:ring-emerald-900 transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  <img src={`https://ui-avatars.com/api/?name=${article.author}&background=059669&color=fff`} alt={article.author} />
                </div>
                <div className="flex flex-col">
                  <span 
                    onClick={handleAuthorClick}
                    className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <User size={12} className="text-emerald-500" /> {article.author}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">فريق التحرير</span>
                </div>
              </div>
              <ArrowLeft size={16} className="text-slate-200 dark:text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-[-6px] transition-all duration-300" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderVariant()}
      <SummaryModal 
        isOpen={isSummaryOpen} 
        onClose={() => setIsSummaryOpen(false)} 
        title={article.title} 
        summary={summary} 
        loading={loading} 
        error={error} 
        onOpenArticle={() => onClick(article)} 
      />
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        title={article.title} 
        url={articleUrl} 
      />
    </>
  );
};

export default ArticleCard;
