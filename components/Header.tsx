import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Rocket, Search, ChevronLeft } from 'lucide-react';
import { NAV_LINKS, MOCK_ARTICLES } from '../constants';
import { Article } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onArticleSelect: (article: Article) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onArticleSelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm py-2' 
            : 'bg-white border-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => handleNavClick('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-emerald-200 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Rocket size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 leading-none tracking-tight font-tajawal">Entrepreneur</span>
                <span className="text-xs font-bold text-emerald-600 tracking-[0.2em] mt-0.5">NASHRA</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors duration-200 rounded-full ${
                    currentView === link.value 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-200"
                aria-label="بحث"
              >
                <Search size={20} />
              </button>
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:shadow-lg active:transform active:scale-95">
                اشترك الآن
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 active:bg-slate-100 rounded-full"
              >
                <Search size={22} />
              </button>
              <button 
                className="p-2 text-slate-600 active:bg-slate-100 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 absolute w-full shadow-xl animate-fade-in z-50">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className={`text-right px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    currentView === link.value 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <hr className="border-slate-100 my-4" />
              <button className="bg-emerald-600 text-white w-full py-4 rounded-xl font-bold shadow-lg shadow-emerald-100">
                اشترك في النشرة البريدية
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-24 bg-slate-900/60 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-4 bg-white">
              <Search className="text-emerald-500" size={28} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مقالات، أخبار، أو مواضيع..."
                className="flex-grow text-xl font-bold placeholder:text-slate-300 focus:outline-none text-slate-800 placeholder:font-normal"
              />
              <button 
                onClick={handleSearchClose}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-4 md:p-6 bg-slate-50/50 flex-grow">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-16 text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="opacity-40" />
                  </div>
                  <p className="font-medium">اكتب للبدء في البحث...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid gap-4">
                  <p className="text-sm font-bold text-slate-400 mb-2">نتائج البحث ({filteredArticles.length})</p>
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => handleSearchResultClick(article)}
                      className="bg-white p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all flex gap-4 group"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <span className="text-xs font-bold text-emerald-600 mb-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">{article.category}</span>
                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p>لا توجد نتائج مطابقة لـ "{searchQuery}"</p>
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