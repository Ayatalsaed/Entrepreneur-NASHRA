
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Rocket, Search, ChevronLeft, Play, ArrowLeft, Twitter, Linkedin, Facebook, Sun, Moon, Calendar } from 'lucide-react';
import { NAV_LINKS, MOCK_ARTICLES } from '../constants';
import { Article } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onArticleSelect: (article: Article) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onArticleSelect, isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Threshold set to approximately the height of the top utility bar (40px)
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set formatted Arabic date
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setFormattedDate(new Intl.DateTimeFormat('ar-SA', options).format(new Date()));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const filteredArticles = searchQuery.trim()
    ? MOCK_ARTICLES.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchResultClick = (article: Article) => {
    onArticleSelect(article);
    handleSearchClose();
  };

  const SocialIcons = ({ className = "", iconSize = 18 }: { className?: string; iconSize?: number }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#1DA1F2] transition-colors duration-200" aria-label="Twitter">
        <Twitter size={iconSize} fill="currentColor" />
      </a>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#0077B5] transition-colors duration-200" aria-label="LinkedIn">
        <Linkedin size={iconSize} fill="currentColor" />
      </a>
      <a href="#" className="flex items-center justify-center text-slate-400 hover:text-[#1877F2] transition-colors duration-200" aria-label="Facebook">
        <Facebook size={iconSize} fill="currentColor" />
      </a>
    </div>
  );

  return (
    <>
      <header className="z-40 w-full relative">
        {/* Top Utility Bar - This part scrolls away */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-2 hidden md:block h-10">
          <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>بث مباشر للأسواق</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <SocialIcons className="border-l border-slate-200 dark:border-slate-700 pl-6" iconSize={14} />
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span>{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar - This part sticks to top */}
        <div 
          className={`sticky top-0 z-50 transition-all duration-500 ${
            scrolled 
              ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg py-2' 
              : 'bg-white dark:bg-slate-950 border-b border-transparent py-5'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => handleNavClick('home')}
              >
                <div className={`bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-emerald-200 dark:shadow-emerald-900/40 shadow-lg group-hover:scale-105 transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-10 h-10'}`}>
                  <Rocket size={scrolled ? 20 : 22} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-slate-900 dark:text-white leading-none tracking-tight font-tajawal transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>Entrepreneur</span>
                  <span className={`font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.2em] transition-all duration-300 ${scrolled ? 'text-[10px] mt-0' : 'text-xs mt-0.5'}`}>NASHRA</span>
                </div>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link.value)}
                    className={`relative px-4 py-2 text-sm font-black transition-all duration-300 rounded-full ${
                      currentView === link.value 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className={`flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900 rounded-full transition-all duration-300 group/search ${scrolled ? 'w-9 h-9' : 'w-10 h-10'}`}
                  aria-label="بحث"
                >
                  <Search size={scrolled ? 20 : 22} className="group-hover/search:scale-110 transition-transform" />
                </button>
                
                <button className={`bg-slate-900 dark:bg-emerald-600 text-white px-6 rounded-full text-sm font-black hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all hover:shadow-lg active:transform active:scale-95 ${scrolled ? 'py-2' : 'py-2.5'}`}>
                  اشترك الآن
                </button>
              </div>

              {/* Mobile Menu Button & Search Toggle */}
              <div className="flex items-center gap-2 md:hidden">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800 rounded-full transition-colors"
                >
                  <Search size={22} />
                </button>
                <button 
                  className="p-2 text-slate-600 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-800 rounded-full transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu - Now inside the sticky container to remain sticky when open */}
            {isMenuOpen && (
              <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 absolute top-full left-0 w-full shadow-2xl animate-fade-in z-50 overflow-hidden">
                <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-4 px-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{formattedDate}</div>
                    <button 
                      onClick={toggleDarkMode}
                      className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 shadow-sm"
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.value}
                      onClick={() => handleNavClick(link.value)}
                      className={`text-right px-4 py-3 rounded-xl text-base font-black transition-all ${
                        currentView === link.value 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                  <hr className="border-slate-100 dark:border-slate-800 my-4" />
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">تابعنا على</span>
                    <SocialIcons iconSize={24} />
                  </div>
                  <button className="bg-emerald-600 text-white w-full py-4 rounded-xl font-black shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">
                    اشترك في النشرة البريدية
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 md:pt-24 bg-slate-900/60 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200 dark:border-slate-800">
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900">
              <Search className="text-emerald-500" size={28} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مقالات، أخبار، أو مواضيع..."
                className="flex-grow text-xl font-black placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none text-slate-800 dark:text-white bg-transparent placeholder:font-normal text-right font-tajawal"
              />
              <button 
                onClick={handleSearchClose}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 flex-grow no-scrollbar">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-16 text-slate-400 dark:text-slate-600">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="opacity-40" />
                  </div>
                  <p className="font-bold text-lg">اكتب للبدء في البحث...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid gap-4">
                  <p className="text-sm font-black text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-widest">نتائج البحث ({filteredArticles.length})</p>
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => handleSearchResultClick(article)}
                      className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl cursor-pointer transition-all flex gap-4 group"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {article.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                            <div className="bg-white/90 dark:bg-slate-900/90 rounded-full p-1.5 shadow-sm">
                              <Play size={14} className="text-emerald-600 fill-emerald-600" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 w-fit px-2 py-0.5 rounded-full uppercase tracking-wider">{article.category}</span>
                          {article.videoUrl && (
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                              فيديو <Play size={8} className="fill-current" />
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1 font-amiri">
                          {article.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed mb-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-[-4px] transition-transform">
                          <span>عرض المقال</span>
                          <ArrowLeft size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 dark:text-slate-600">
                  <p className="font-bold">لا توجد نتائج مطابقة لـ "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Close on backdrop click */}
          <div className="absolute inset-0 -z-10" onClick={handleSearchClose}></div>
        </div>
      )}
    </>
  );
};

export default Header;
