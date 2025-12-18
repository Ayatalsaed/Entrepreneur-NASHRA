import React from 'react';
import { Rocket, Twitter, Linkedin, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Rocket size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none">Entrepreneur</span>
                <span className="text-sm font-semibold text-emerald-400 tracking-widest">NASHRA</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              منصتك الأولى للأخبار والتحليلات في عالم التقنية وريادة الأعمال في الشرق الأوسط وشمال أفريقيا.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">أقسام الموقع</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">أخبار التقنية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">شركات ناشئة</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">ريادة أعمال</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">المحلل الذكي</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">معلومات</h3>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">عن نشـرة</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">فريق العمل</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">أعلن معنا</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">اتصل بنا</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-emerald-600 inline-block pb-1">النشرة البريدية</h3>
            <p className="text-slate-400 text-sm mb-4">اشترك ليصلك ملخص أسبوعي بأهم الأخبار.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-emerald-500 text-right placeholder:text-slate-500"
              />
              <button className="bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Mail size={18} />
                اشتراك
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>© 2024 Entrepreneur NASHRA. جميع الحقوق محفوظة.</p>
          <p>صنع بكل حب و ☕</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;