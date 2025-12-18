
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { MOCK_ARTICLES } from '../constants';
import ArticleCard from './ArticleCard';
import { 
  ArrowRight, 
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
  Trash2
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
    // Reset form when article changes
    setNewComment('');
    setUserName('');
  }, [article.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  };

  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    localStorage.setItem(`nashra_comments_${article.id}`, JSON.stringify(updatedComments));
  };

  const calculateReadTime = () => {
    if (article.readingTime) return article.readingTime;
    const words = article.content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes + ' دقيقة للقراءة';
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  };

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
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2] mb-10 text-center font-amiri">
                {article.title}
            </h1>
            
            <div className="flex flex-col items-center gap-8 border-y border-slate-100 py-8">
                <div className="flex flex-wrap items-center justify-center gap-10 text-sm text-slate-500">
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
                            <Clock size={18} className="text-emerald-500" /> {calculateReadTime()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">شارك المقال</span>
                    <div className="flex items-center gap-4">
                        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5 rounded-full transition-all border border-slate-100">
                            <Twitter size={20} fill="currentColor" />
                        </a>
                        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#0077B5] hover:bg-[#0077B5]/5 rounded-full transition-all border border-slate-100">
                            <Linkedin size={20} fill="currentColor" />
                        </a>
                        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/5 rounded-full transition-all border border-slate-100">
                            <Facebook size={20} fill="currentColor" />
                        </a>
                        <button onClick={handleCopyLink} className={`p-3 rounded-full transition-all border flex items-center gap-2 ${copied ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-400 hover:text-emerald-600 border-slate-100'}`}>
                            {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                        </button>
                        <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all border border-slate-100">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl mb-16 border border-slate-200">
             <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover max-h-[700px]" />
             <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 italic">مصدر الصورة: Entrepreneur NASHRA Archive</div>
        </div>

        <div className="prose prose-xl prose-slate max-w-none text-slate-800 mx-auto">
            <div className="leading-[2.2] whitespace-pre-line text-lg md:text-2xl font-amiri tracking-wide px-2 md:px-6">
              {article.content}
            </div>
        </div>

        {/* Improved Comments Section */}
        <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <MessageCircle size={24} />
              </div>
              تعليقات القراء ({comments.length})
            </h3>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-12 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 pr-2">الاسم (اختياري)</label>
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="مثال: محمد الأحمد"
                    className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 pr-2">التعليق</label>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right min-h-[120px]" 
                  placeholder="شاركنا رأيك حول هذا الموضوع..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'نشر التعليق'}
                <Send size={18} className="rotate-180" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-fade-in group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-100">
                          {comment.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{comment.userName}</h4>
                          <span className="text-xs text-slate-400">{comment.date}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                        title="حذف التعليق"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-amiri text-lg pr-13">
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                  <MessageCircle size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium">لا توجد تعليقات حتى الآن. كن أول من يشارك رأيه!</p>
                </div>
              )}
            </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-100">
             <h3 className="text-2xl font-black mb-8 text-slate-900 border-r-4 border-emerald-500 pr-4">إقرأ أيضاً</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {relatedArticles.length > 0 ? (
                   relatedArticles.map(rel => (
                       <ArticleCard key={rel.id} article={rel} onClick={onNavigateToArticle} variant="vertical" />
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
