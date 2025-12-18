
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import SmartAnalyst from './components/SmartAnalyst';
import Skeleton from './components/Skeleton';
import Footer from './components/Footer';
import { MOCK_ARTICLES, NAV_LINKS } from './constants';
import { Article, Category } from './types';
import { TrendingUp, Zap, Sparkles, Headphones, PlayCircle, Bookmark, Filter, SearchX } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedArticle]);

  useEffect(() => {
    setIsLoading(true);
    // Reset category filter when switching views
    setActiveCategory(Category.ALL);
    
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      if (currentView === 'home') {
        setFilteredArticles(MOCK_ARTICLES);
      } else {
        const categoryMap: { [key: string]: Category } = {
          'tech': Category.TECH,
          'business': Category.BUSINESS,
          'startups': Category.STARTUPS,
          'ai': Category.AI
        };
        
        const category = categoryMap[currentView];
        if (category) {
          setFilteredArticles(MOCK_ARTICLES.filter(a => a.category === category));
        }
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentView]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedArticle(null);
  };

  // Compute feed sections
  const mainFeatured = useMemo(() => filteredArticles.find(a => a.isFeatured) || filteredArticles[0], [filteredArticles]);
  const otherArticles = useMemo(() => filteredArticles.filter(a => a.id !== mainFeatured?.id), [filteredArticles, mainFeatured]);
  const sideHeroArticles = useMemo(() => otherArticles.slice(0, 2), [otherArticles]);
  const baseFeedArticles = useMemo(() => otherArticles.slice(2), [otherArticles]);
  
  // Apply category filtering specifically to the main feed list
  const displayedFeedArticles = useMemo(() => {
    if (activeCategory === Category.ALL) return baseFeedArticles;
    return baseFeedArticles.filter(article => article.category === activeCategory);
  }, [baseFeedArticles, activeCategory]);

  const renderContent = () => {
    if (currentView === 'analyst') {
      return <SmartAnalyst />;
    }

    if (currentView === 'article' && selectedArticle) {
      return (
        <ArticleDetail 
          article={selectedArticle} 
          onBack={() => handleNavigate('home')} 
          onNavigateToArticle={handleArticleClick}
        />
      );
    }

    const featuredStories = MOCK_ARTICLES
      .filter(a => a.isFeatured)
      .slice(0, 3);

    return (
      <main className="container mx-auto px-4 py-8">
        
        {currentView !== 'home' && (
             <div className="mb-12 text-center animate-fade-in">
                <span className="text-emerald-600 font-bold tracking-[0.3em] text-sm uppercase mb-3 block">القسم الحصري</span>
                <h2 className="text-5xl font-black text-slate-900 mb-4">
                    {NAV_LINKS.find(l => l.value === currentView)?.label}
                </h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
        )}

        {/* Hero Section Skeleton */}
        {isLoading && currentView === 'home' && (
           <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 h-[500px] lg:h-[600px] bg-slate-200 rounded-[2.5rem] animate-pulse"></div>
              <div className="lg:col-span-4 flex flex-col gap-8">
                 <div className="flex-1 bg-slate-200 rounded-[2rem] min-h-[280px] animate-pulse"></div>
                 <div className="flex-1 bg-slate-200 rounded-[2rem] min-h-[280px] animate-pulse"></div>
              </div>
           </div>
        )}

        {!isLoading && mainFeatured && currentView === 'home' && (
          <section className="mb-20 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto">
              <div className="lg:col-span-8">
                 <ArticleCard 
                    article={mainFeatured} 
                    onClick={handleArticleClick} 
                    variant="large" 
                 />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-8">
                 {sideHeroArticles.map(article => (
                     <div 
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="flex-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border border-slate-100 min-h-[280px]"
                     >
                        <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent flex flex-col justify-end p-8">
                            <span className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest">{article.category}</span>
                            <h3 className="text-2xl font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors line-clamp-2 font-amiri">
                                {article.title}
                            </h3>
                        </div>
                     </div>
                 ))}
                 {sideHeroArticles.length < 2 && (
                     <div className="flex-1 bg-gradient-to-br from-slate-900 to-emerald-950 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center border border-emerald-500/30">
                         <PlayCircle className="text-emerald-400 mb-4 animate-pulse" size={48} />
                         <h3 className="font-bold text-white text-xl">حصريات فيديو</h3>
                         <p className="text-emerald-300/80 mt-2 text-sm">مقابلات مرئية مع رواد التغيير</p>
                     </div>
                 )}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Featured Stories Section */}
            {currentView === 'home' && (
              <section className="bg-white/50 p-8 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Bookmark size={24} className="fill-current" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">قصص مميزة</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    Array(3).fill(0).map((_, idx) => <Skeleton key={idx} variant="compact" />)
                  ) : (
                    featuredStories.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        onClick={handleArticleClick} 
                        variant="compact" 
                      />
                    ))
                  )}
                </div>
              </section>
            )}

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-slate-100 pb-5 gap-6">
                    <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Zap size={32} className="text-emerald-500 fill-emerald-500" />
                        آخر المستجدات
                    </h3>
                    
                    {/* Category Filter Bar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-400">
                            <Filter size={14} />
                            <span className="text-[10px] font-bold uppercase">تصفية</span>
                        </div>
                        {Object.values(Category).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                                    activeCategory === cat
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                                        : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col gap-10 min-h-[400px]">
                {isLoading ? (
                    Array(4).fill(0).map((_, idx) => <Skeleton key={idx} variant="horizontal" />)
                ) : displayedFeedArticles.length > 0 ? (
                    displayedFeedArticles.map(article => (
                    <div key={article.id} className="animate-fade-in">
                        <ArticleCard 
                            article={article} 
                            onClick={handleArticleClick} 
                            variant="horizontal" 
                        />
                    </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <SearchX size={40} className="text-slate-300" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">لا توجد مقالات في هذا القسم</h4>
                        <p className="text-slate-500 mb-6">لم نجد أي مقالات تندرج تحت تصنيف "{activeCategory}" حالياً.</p>
                        <button 
                            onClick={() => setActiveCategory(Category.ALL)}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                            عرض كل المقالات
                        </button>
                    </div>
                )}
                </div>
            </div>

             <button className="w-full py-5 rounded-2xl bg-white border-2 border-slate-200 font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md">
                تحميل المزيد من المقالات المتميزة
             </button>
          </div>

          <div className="lg:col-span-4 space-y-14">
            
            <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="relative z-10">
                  <Headphones className="mb-6" size={40} />
                  <h3 className="text-2xl font-black mb-3">بودكاست NASHRA</h3>
                  <p className="text-emerald-50/80 mb-6 leading-relaxed">استمع إلى أعمق التحليلات في عالم ريادة الأعمال خلال تنقلك.</p>
                  <button className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all">
                    <PlayCircle size={18} /> استمع الآن
                  </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 sticky top-32">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">الأكثر رواجاً</h3>
              </div>
              
              <div className="space-y-8">
                {MOCK_ARTICLES.slice(0, 5).map((article, idx) => (
                  <div 
                    key={article.id} 
                    className="flex gap-5 group cursor-pointer items-start border-b border-slate-50 pb-6 last:border-0"
                    onClick={() => handleArticleClick(article)}
                  >
                    <span className="text-5xl font-black text-slate-100 group-hover:text-emerald-200 transition-all duration-300 leading-none">
                        0{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-emerald-600 mb-2 block uppercase tracking-widest">{article.category}</span>
                      <h4 className="font-bold text-slate-800 text-lg leading-[1.4] group-hover:text-emerald-700 transition-colors line-clamp-2 font-amiri">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-amiri selection:bg-emerald-200 selection:text-emerald-900">
      <MarketTicker />
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onArticleSelect={handleArticleClick}
      />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default App;
