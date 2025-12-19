
import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';
import ArticleCard from './ArticleCard';
import { 
  ArrowRight, 
  ArrowLeft,
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  Clock, 
  MessageCircle, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link as LinkIcon,
  Check,
  Send,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Type,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onNavigateToArticle: (article: Article) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, onNavigateToArticle }) => {
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  // Font Size Logic
  const DEFAULT_FONT_SIZE = 20;
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 32;
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('nashra_article_font_size');
    return saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    localStorage.setItem('nashra_article_font_size', fontSize.toString());
  }, [fontSize]);

  const handleIncreaseFont = () => setFontSize(prev => Math.min(prev + 2, MAX_FONT_SIZE));
  const handleDecreaseFont = () => setFontSize(prev => Math.max(prev - 2, MIN_FONT_SIZE));
  const handleResetFont = () => setFontSize(DEFAULT_FONT_SIZE);

  // Load comments from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`nashra_comments_${article.id}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Failed to parse comments", e);
      }
    } else {
      setComments([]);
    }
    setNewComment('');
    setUserName('');
    setCurrentPage(1);
  }, [article.id]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#article/${article.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthorClick = () => {
    window.location.hash = `author/${encodeURIComponent(article.author)}`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    const comment: Comment = {
      id: Date.now().toString(),
      userName: userName.trim() || 'قارئ مجهول',
      text: newComment.trim(),
      date: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date()),
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`nashra_comments_${article.id}`, JSON.stringify(updatedComments));
    
    setNewComment('');
    setUserName('');
    setIsSubmitting(false);
    setCurrentPage(1);
  };

  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    localStorage.setItem(`nashra_comments_${article.id}`, JSON.stringify(updatedComments));
    
    const newTotalPages = Math.ceil(updatedComments.length / commentsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const calculateReadTime = () => {
    if (article.readingTime) return article.readingTime;
    const words = article.content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes + ' دقيقة للقراءة';
  };

  const articleUrl = `${window.location.origin}/#article/${article.id}`;
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
  };

  const relatedArticles = MOCK_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * commentsPerPage;
    return comments.slice(start, start + commentsPerPage);
  }, [comments, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const commentSection = document.getElementById('comments-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen animate-fade-in pb-20">
      {/* Article Navigation & Controls */}
      <div className="sticky top-[84px] md:top-[92px] z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 py-3 shadow-sm">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-bold text-sm"
                aria-label="العودة"
            >
                <ArrowRight size={18} />
                <span className="hidden sm:inline">العودة للأخبار</span>
            </button>
            
            {/* Font Size & Reading Mode Controls */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button 
                      onClick={handleDecreaseFont}
                      disabled={fontSize <= MIN_FONT_SIZE}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20 transition-all"
                      title="تصغير الخط"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <div className="flex items-center gap-2 px-3 border-x border-slate-100 dark:border-slate-800">
                      <div className="p-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                        <Type size={14} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300 min-w-[2.5rem] text-center font-mono">
                        {fontSize}px
                      </span>
                    </div>

                    <button 
                      onClick={handleIncreaseFont}
                      disabled={fontSize >= MAX_FONT_SIZE}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20 transition-all"
                      title="تكبير الخط"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <div className="w-px h-4 bg-slate-100 dark:bg-slate-800 mx-1"></div>
                    
                    <button 
                      onClick={handleResetFont}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                      title="إعادة ضبط الخط"
                    >
                      <RotateCcw size={14} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <article className="container mx-auto px-4 max-w-4xl mt-12">
        <header className="mb-12">
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-widest">
                  {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.2] mb-10 text-center font-amiri">
                {article.title}
            </h1>
            
            <div className="flex flex-col items-center gap-8 border-y border-slate-100 dark:border-slate-800 py-8">
                <div className="flex flex-wrap items-center justify-center gap-10 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                        <div 
                          onClick={handleAuthorClick}
                          className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 cursor-pointer hover:border-emerald-500 transition-all"
                        >
                             <img src={`https://ui-avatars.com/api/?name=${article.author}&background=059669&color=fff`} alt={article.author} />
                        </div>
                        <div className="flex flex-col text-right">
                            <span 
                              onClick={handleAuthorClick}
                              className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
                            >
                              <User size={16} className="text-emerald-500" /> {article.author}
                            </span>
                            <span className="text-xs">رئيس التحرير</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <Calendar size={18} className="text-emerald-500" /> {article.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={18} className="text-emerald-500" /> {calculateReadTime()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">شارك المقال</span>
                    <div className="flex items-center gap-4">
                        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5 rounded-full transition-all border border-slate-100 dark:border-slate-800">
                            <Twitter size={20} fill="currentColor" />
                        </a>
                        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#0077B5] hover:bg-[#0077B5]/5 rounded-full transition-all border border-slate-100 dark:border-slate-800">
                            <Linkedin size={20} fill="currentColor" />
                        </a>
                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/5 rounded-full transition-all border border-slate-100 dark:border-slate-800">
                            <Facebook size={20} fill="currentColor" />
                        </a>
                        <button onClick={handleCopyLink} className={`p-3 rounded-full transition-all border flex items-center gap-2 ${copied ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border-emerald-200' : 'text-slate-400 hover:text-emerald-600 border-slate-100 dark:border-slate-800'}`}>
                            {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 border border-slate-200 dark:border-slate-800">
             <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover max-h-[700px] hover:scale-105 transition-transform duration-[3000ms]" />
             <div className="bg-slate-50 dark:bg-slate-900 p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic font-tajawal">مصدر الصورة: Entrepreneur NASHRA Archive</div>
        </div>

        {/* Dynamic Content Area */}
        <div className="prose prose-xl prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 mx-auto">
            <div 
              className="leading-[1.8] whitespace-pre-line font-amiri tracking-wide px-2 md:px-10 transition-all duration-300 antialiased"
              style={{ fontSize: `${fontSize}px` }}
            >
              {article.content}
            </div>
        </div>

        {/* Comments Section */}
        <div id="comments-section" className="mt-16 p-8 md:p-12 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200/50">
                <MessageCircle size={24} />
              </div>
              أصوات القراء ({comments.length})
            </h3>
            
            <form onSubmit={handleSubmitComment} className="mb-14 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400 pr-2">الاسم الكامل</label>
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="مثال: أحمد العبدالله"
                    className="w-full p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right dark:text-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 pr-2">مشاركتك</label>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right min-h-[150px] dark:text-white transition-all font-amiri text-lg" 
                  placeholder="أضف تعليقك هنا..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
              >
                <span>نشر التعليق</span>
                <Send size={18} className="rotate-180" />
              </button>
            </form>

            <div className="space-y-8">
              {paginatedComments.length > 0 ? (
                <>
                  {paginatedComments.map((comment) => (
                    <div key={comment.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in group hover:border-emerald-100 dark:hover:border-emerald-900 transition-all">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-slate-800 flex items-center justify-center border border-emerald-100 dark:border-slate-700 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=059669&color=fff&size=64`} 
                              alt={comment.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{comment.userName}</h4>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">{comment.date}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 text-slate-200 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="حذف التعليق"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-amiri text-xl pr-2">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all shadow-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="flex items-center gap-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-12 h-12 rounded-2xl font-black transition-all ${
                              currentPage === page 
                              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' 
                              : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-emerald-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-all shadow-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                    <MessageCircle size={32} className="text-slate-200 dark:text-slate-700" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 font-bold text-lg">شاركنا رأيك حول هذا المقال لتكون أول من يعلّق</p>
                </div>
              )}
            </div>
        </div>

        <div className="mt-24 pt-16 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white border-r-4 border-emerald-500 pr-5">مقالات ذات صلة</h3>
                <button onClick={onBack} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-2">عرض الكل <ArrowLeft size={16} /></button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {relatedArticles.length > 0 ? (
                   relatedArticles.map(rel => (
                       <ArticleCard key={rel.id} article={rel} onClick={onNavigateToArticle} variant="vertical" hideRelated />
                   ))
                 ) : (
                   <p className="text-slate-400 dark:text-slate-600 italic">لا توجد مقالات مشابهة حالياً.</p>
                 )}
             </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
