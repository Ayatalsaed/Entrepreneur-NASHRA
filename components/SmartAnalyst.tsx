
import React, { useState } from 'react';
import { generateSmartBriefing } from '../services/geminiService';
import { BriefingResponse } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  Loader2, 
  FileText, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight, 
  BarChart3, 
  Share2, 
  CheckCircle2, 
  Zap, 
  Compass,
  RefreshCw
} from 'lucide-react';
import ShareModal from './ShareModal';

const SUGGESTED_TOPICS = [
    "مستقبل الذكاء الاصطناعي",
    "التجارة الإلكترونية 2024",
    "التقنية المالية في السعودية",
    "الطاقة المتجددة",
    "الأمن السيبراني"
];

const SmartAnalyst: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setBriefing(null);

    try {
      const result = await generateSmartBriefing(topic);
      setBriefing(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  const shareUrl = briefing 
    ? `${window.location.origin}/#analyst?topic=${encodeURIComponent(topic)}`
    : window.location.href;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Interface */}
        <div className="bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col border border-white/5">
            {/* Background Dynamic Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 p-6 md:p-12 flex-grow flex flex-col">
                
                {!briefing && !loading && (
                    <div className="flex-grow flex flex-col justify-center text-center max-w-2xl mx-auto space-y-10 animate-fade-in">
                        <div>
                            <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 rounded-[2rem] mb-8 shadow-2xl">
                                <BrainCircuit size={48} className="text-emerald-400" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight font-tajawal">
                                المحلل الذكي
                            </h1>
                            <p className="text-slate-400 text-xl leading-relaxed font-medium">
                                قم بتوليد تقارير تحليلية معمقة في ثوانٍ. استشر الذكاء الاصطناعي حول اتجاهات السوق، التقنيات الناشئة، أو استراتيجيات النمو.
                            </p>
                        </div>

                        <div className="w-full">
                            <form onSubmit={handleSubmit} className="relative group">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="ما هو الموضوع الذي تريد تحليله؟"
                                    className="w-full p-6 pl-36 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-[2rem] text-xl focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all shadow-2xl"
                                />
                                <button
                                    type="submit"
                                    disabled={!topic.trim()}
                                    className="absolute left-2.5 top-2.5 bottom-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-2xl font-black transition-all disabled:opacity-50 disabled:hover:bg-emerald-600 flex items-center gap-3 shadow-lg shadow-emerald-900/40"
                                >
                                    <span>تحليل</span>
                                    <Zap size={20} fill="currentColor" />
                                </button>
                            </form>
                            
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <span className="w-full text-slate-500 text-sm font-bold mb-1 uppercase tracking-widest">مواضيع مقترحة</span>
                                {SUGGESTED_TOPICS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleSuggestionClick(t)}
                                        className="text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-emerald-600/20 px-4 py-2 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all font-bold"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in py-20">
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
                            <div className="relative">
                                <Loader2 size={80} className="text-emerald-400 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BrainCircuit size={32} className="text-emerald-400 opacity-50" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-md">
                            <h3 className="text-3xl font-black text-white">يقوم Gemini بمعالجة طلبك</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                جاري تحليل البيانات وبناء رؤى استراتيجية حول <span className="text-emerald-400 font-bold">"{topic}"</span> باستخدام أحدث نماذج الاستدلال.
                            </p>
                        </div>
                    </div>
                )}

                {briefing && (
                   <div className="w-full h-full flex flex-col">
                       {/* Header Section */}
                       <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/10 pb-8 gap-6 animate-fade-in">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl shadow-emerald-900/20 ring-1 ring-emerald-500/30">
                                    <BarChart3 size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white font-amiri leading-tight">{briefing.title}</h2>
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">تقرير استراتيجي حصري</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsShareOpen(true)}
                                    className="bg-white/5 hover:bg-emerald-600/20 text-white px-6 py-3 rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-sm font-bold shadow-xl"
                                >
                                    <Share2 size={18} />
                                    مشاركة التقرير
                                </button>
                                <button 
                                    onClick={() => setBriefing(null)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl transition-all font-bold flex items-center gap-2 text-sm shadow-xl shadow-emerald-900/20"
                                >
                                    <RefreshCw size={18} />
                                    تحليل جديد
                                </button>
                            </div>
                       </div>

                       {/* Content Grid */}
                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                           
                           {/* Left Column: Summary & Key Points */}
                           <div className="lg:col-span-8 space-y-8">
                                
                                {/* Summary Card */}
                                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group animate-fade-in">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-50"></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider">الملخص التنفيذي</h3>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-xl font-amiri md:text-2xl transition-all group-hover:text-white">
                                        {briefing.summary}
                                    </p>
                                </div>

                                {/* Key Points Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2 px-4">
                                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                                            <Target size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider">الرؤى والبيانات الرئيسية</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {briefing.keyPoints.map((point, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300 group animate-fade-in"
                                                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
                                            >
                                                <div className="flex items-start gap-5">
                                                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-black shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-slate-300 text-lg leading-relaxed pt-1 group-hover:text-white transition-colors">
                                                        {point}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                           </div>

                           {/* Right Column: Outlook & Insights */}
                           <div className="lg:col-span-4 space-y-8">
                                
                                {/* Outlook Card */}
                                <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-[2.5rem] p-8 h-full shadow-2xl relative overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '600ms' }}>
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                    
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                                            <Compass size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider">النظرة المستقبلية</h3>
                                    </div>

                                    <div className="flex-grow flex flex-col justify-center">
                                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mb-8 backdrop-blur-md">
                                            <p className="text-emerald-100 text-lg md:text-xl leading-relaxed font-amiri italic">
                                                "{briefing.outlook}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                                        <div className="flex items-center gap-4 text-emerald-400/60">
                                            <CheckCircle2 size={16} />
                                            <span className="text-xs font-bold uppercase tracking-widest">تحليل تم التحقق منه</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <Sparkles size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">المصدر</span>
                                                <span className="text-xs text-white font-bold">Gemini Strategic Engine</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                           </div>
                       </div>
                   </div> 
                )}

                {error && (
                    <div className="mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 text-center animate-fade-in max-w-lg mx-auto">
                        <p className="text-lg font-bold mb-4">{error}</p>
                        <button 
                            onClick={() => setError(null)} 
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-widest"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {briefing && (
        <ShareModal 
            isOpen={isShareOpen} 
            onClose={() => setIsShareOpen(false)} 
            title={briefing.title} 
            url={shareUrl} 
        />
      )}
    </div>
  );
};

export default SmartAnalyst;
