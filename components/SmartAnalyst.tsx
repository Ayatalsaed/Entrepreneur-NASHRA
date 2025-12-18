import React, { useState } from 'react';
import { generateSmartBriefing } from '../services/geminiService';
import { BriefingResponse } from '../types';
import { Sparkles, Send, BrainCircuit, Loader2, FileText, Target, TrendingUp, Lightbulb, ArrowRight, BarChart3 } from 'lucide-react';

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

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Interface */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 p-8 md:p-12 flex-grow flex flex-col justify-center">
                
                {!briefing && !loading && (
                    <div className="text-center max-w-2xl mx-auto space-y-8 animate-fade-in">
                        <div>
                            <div className="inline-flex items-center justify-center p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl mb-6 shadow-xl">
                                <BrainCircuit size={40} className="text-emerald-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                المحلل الذكي
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                محرك تحليل فوري مدعوم بنماذج Gemini المتقدمة. اطلب تقريراً عن أي قطاع أو تقنية.
                            </p>
                        </div>

                        <div className="w-full">
                            <form onSubmit={handleSubmit} className="relative group">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="عن ماذا تريد أن تبحث اليوم؟"
                                    className="w-full p-5 pl-32 bg-white/10 border border-white/10 text-white placeholder:text-slate-500 rounded-2xl text-lg focus:outline-none focus:bg-white/15 focus:border-emerald-500/50 transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!topic.trim()}
                                    className="absolute left-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-emerald-600 flex items-center gap-2"
                                >
                                    <span>تحليل</span>
                                    <Sparkles size={18} />
                                </button>
                            </form>
                            
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {SUGGESTED_TOPICS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleSuggestionClick(t)}
                                        className="text-xs md:text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 hover:border-emerald-500/30 transition-all"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-in py-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                            <Loader2 size={64} className="text-emerald-400 animate-spin relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">جاري إعداد التقرير</h3>
                        <p className="text-slate-400">يقوم Gemini بتحليل البيانات وبناء الرؤى حول "{topic}"...</p>
                    </div>
                )}

                {briefing && (
                   <div className="animate-fade-in w-full">
                       <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                    <BarChart3 size={24} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">{briefing.title}</h2>
                            </div>
                            <button 
                                onClick={() => setBriefing(null)}
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                            >
                                تحليل جديد <ArrowRight size={16} className="rotate-180" />
                            </button>
                       </div>

                       <div className="grid md:grid-cols-12 gap-6">
                           {/* Summary */}
                           <div className="md:col-span-12 lg:col-span-8 space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
                                        <FileText size={20} />
                                        <h3>الملخص التنفيذي</h3>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {briefing.summary}
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold">
                                        <Target size={20} />
                                        <h3>الرؤى الرئيسية</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {briefing.keyPoints.map((point, idx) => (
                                            <li key={idx} className="flex gap-4">
                                                <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm font-bold border border-blue-500/20">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-slate-300 pt-1">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                           </div>

                           {/* Sidebar Outlook */}
                           <div className="md:col-span-12 lg:col-span-4">
                                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 h-full">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
                                        <TrendingUp size={20} />
                                        <h3>النظرة المستقبلية</h3>
                                    </div>
                                    <div className="text-emerald-100/80 leading-relaxed mb-6">
                                        {briefing.outlook}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Lightbulb size={12} />
                                            <span>تم التوليد بواسطة Gemini AI</span>
                                        </div>
                                    </div>
                                </div>
                           </div>
                       </div>
                   </div> 
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center animate-fade-in">
                        {error}
                        <button onClick={() => setError(null)} className="block mx-auto mt-2 text-sm underline">حاول مرة أخرى</button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAnalyst;