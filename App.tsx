
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import ArticleCard from './components/ArticleCard';
import ArticleDetail from './components/ArticleDetail';
import SmartAnalyst from './components/SmartAnalyst';
import Footer from './components/Footer';
import { MOCK_ARTICLES, NAV_LINKS } from './constants';
import { Article, Category } from './types';
import { TrendingUp, Zap, Sparkles, Headphones, PlayCircle, Star, Bookmark } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(MOCK_ARTICLES);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedArticle]);

  useEffect(() => {
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
  }, [currentView]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedArticle(null);
  };

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

    const mainFeatured = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
    const otherArticles = filteredArticles.filter(a => a.id !== mainFeatured?.id);
    const sideHeroArticles = otherArticles.slice(0, 2);
    const mainFeedArticles = otherArticles.slice(2);
    
    // Extract Featured Stories for the new section
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

        {mainFeatured && currentView === 'home' && (
          <section className="mb-20 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto">
              
              <div 
                onClick={() => handleArticleClick(mainFeatured)}
                className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl border border-white/20"
              >
                 <img 
                    src={mainFeatured.imageUrl} 
                    alt={mainFeatured.title} 
                    className="w-full h-[500px] lg:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent flex flex-col justify-end p-10 md:p-14">
                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-full mb-5 shadow-xl shadow-emerald-900/40">
                            <Star size={14} className="fill-current" /> مقال الغلاف
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] drop-shadow-xl font-amiri">
                            {mainFeatured.title}
                        </h1>
                        <p className="text-slate-200 text-xl line-clamp-2 md:w-5/6 mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 font-medium">
                            {mainFeatured.excerpt}
                        </p>
                        <div className="flex items-center text-slate-300 text-base gap-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
                                {mainFeatured.author[0]}
                              </div>
                              <span className="font-bold text-white">{mainFeatured.author}</span>
                            </div>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                            <span>{mainFeatured.date}</span>
                        </div>
                    </div>
                 </div>
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
            
            {/* New "Featured Stories" Section */}
            {currentView === 'home' && featuredStories.length > 0 && (
              <section className="bg-white/50 p-8 rounded-[2rem] border border-slate-100 animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Bookmark size={24} className="fill-current" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">قصص مميزة</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredStories.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      onClick={handleArticleClick} 
                      variant="compact" 
                    />
                  ))}
                </div>
              </section>
            )}

            <div className="flex items-center justify-between border-b-4 border-slate-100 pb-5">
              <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Zap size={32} className="text-emerald-500 fill-emerald-500" />
                آخر المستجدات
              </h3>
            </div>
            
            <div className="flex flex-col gap-10">
              {mainFeedArticles.map(article => (
                <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={handleArticleClick} 
                    variant="horizontal" 
                />
              ))}
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
