
import { Article, Category } from './types';

export interface AuthorInfo {
  name: string;
  bio: string;
  avatar: string;
  role: string;
  socials: {
    twitter?: string;
    linkedin?: string;
  };
}

export const MOCK_AUTHORS: Record<string, AuthorInfo> = {
  'أحمد المنصور': {
    name: 'أحمد المنصور',
    role: 'محلل تقني أول',
    bio: 'خبير في شؤون التقنية والذكاء الاصطناعي مع خبرة تزيد عن 10 سنوات في تحليل الأسواق الرقمية الناشئة في منطقة الشرق الأوسط.',
    avatar: 'https://ui-avatars.com/api/?name=أحمد+المنصور&background=059669&color=fff',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  },
  'سارة خالد': {
    name: 'سارة خالد',
    role: 'مستشارة ريادة أعمال',
    bio: 'متخصصة في استراتيجيات نمو الشركات الناشئة وتقديم المشورة للمستثمرين الملائكة. كتبت العديد من المقالات حول تحديات التأسيس في المنطقة.',
    avatar: 'https://ui-avatars.com/api/?name=سارة+خالد&background=059669&color=fff',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  },
  'فهد العتيبي': {
    name: 'فهد العتيبي',
    role: 'محرر القسم المالي',
    bio: 'صحفي متخصص في التقنية المالية والتحول الرقمي في القطاع المصرفي. يتابع عن كثب تطورات "الفينتك" في الأسواق الخليجية.',
    avatar: 'https://ui-avatars.com/api/?name=فهد+العتيبي&background=059669&color=fff',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
  }
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في الشرق الأوسط: فرص وتحديات',
    excerpt: 'مع تزايد الاستثمارات في البنية التحتية الرقمية، تتجه دول المنطقة نحو تبني تقنيات الذكاء الاصطناعي بشكل غير مسبوق.',
    content: `تشهد منطقة الشرق الأوسط تحولاً رقمياً متسارعاً، حيث أصبح الذكاء الاصطناعي محوراً أساسياً في استراتيجيات التنويع الاقتصادي. تهدف الرؤى الوطنية الطموحة إلى تحويل المجتمعات نحو الاقتصاد القائم على المعرفة، وتعتبر البيانات هي النفط الجديد في هذا العصر.

    تستثمر الحكومات والشركات الخاصة مليارات الدولارات في تطوير البنية التحتية للحوسبة السحابية ومراكز البيانات. ومن المتوقع أن يساهم الذكاء الاصطناعي بنسبة كبيرة في الناتج المحلي الإجمالي لدول المنطقة بحلول عام 2030، حيث تتصدر المملكة العربية السعودية والإمارات المشهد بتبني استراتيجيات وطنية واضحة.
    
    ومع ذلك، لا تزال هناك تحديات تتعلق بالمواهب والتشريعات التي تحتاج إلى معالجة لضمان نمو مستدام وشامل لهذا القطاع الحيوي، بالإضافة إلى القلق من الفجوة الرقمية التي قد تنشأ بين الدول المتقدمة تقنياً وبقية دول العالم.`,
    category: Category.AI,
    author: 'أحمد المنصور',
    date: '15 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isFeatured: true,
    tags: ['ذكاء_اصطناعي', 'تقنية', 'اقتصاد_رقمي'],
    readingTime: '5 دقائق'
  },
  {
    id: '2',
    title: 'كيف تنجح شركتك الناشئة في عامها الأول؟',
    excerpt: 'دليل شامل لرواد الأعمال المبتدئين لتجاوز عقبات التأسيس والوصول إلى مرحلة الاستقرار.',
    content: 'يعتبر العام الأول لأي شركة ناشئة هو الأصعب والأكثر خطورة. تشير الإحصائيات إلى أن نسبة كبيرة من الشركات تفشل في تجاوز هذه المرحلة بسبب نقص التمويل أو سوء التخطيط.',
    category: Category.STARTUPS,
    author: 'سارة خالد',
    date: '14 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    readingTime: '7 دقائق'
  },
  {
    id: '3',
    title: 'ثورة التقنية المالية "فينتك" تعيد تشكيل القطاع المصرفي',
    excerpt: 'البنوك التقليدية تواجه منافسة شرسة من تطبيقات الدفع الرقمي والمحافظ الإلكترونية.',
    content: 'لم تعد البنوك هي اللاعب الوحيد في الساحة المالية. تطبيقات الفينتك تقدم حلولاً أسرع وأرخص وأكثر مرونة للمستخدمين.',
    category: Category.TECH,
    author: 'فهد العتيبي',
    date: '13 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    readingTime: '4 دقائق'
  },
  {
    id: '4',
    title: 'سوق العملات الرقمية: هل اقترب زمن التبني الشامل؟',
    excerpt: 'تحليلات حول استقرار البيتكوين ودخول المؤسسات المالية الكبرى إلى عالم البلوكشين.',
    content: 'بعد سنوات من التذبذب، يبدو أن العملات الرقمية بدأت تأخذ طابعاً مؤسسياً أكثر رصانة مع موافقة صناديق الاستثمار المتداولة.',
    category: Category.CRYPTO,
    author: 'ليلى مراد',
    date: '12 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000',
    readingTime: '6 دقائق',
    contentWarning: 'يتضمن تحليلات لمخاطر استثمارية عالية'
  },
  {
    id: '5',
    title: 'الهيدروجين الأخضر: رهان المنطقة القادم في الطاقة',
    excerpt: 'لماذا تتسابق الدول الخليجية لتصدر مشهد إنتاج الطاقة النظيفة عالمياً؟',
    content: 'تمتلك المنطقة مقومات طبيعية هائلة تجعلها مؤهلة لقيادة ثورة الهيدروجين الأخضر بفضل الشمس والرياح والمساحات الشاسعة.',
    category: Category.GREEN,
    author: 'عمر ياسين',
    date: '11 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000',
    readingTime: '8 دقائق'
  },
  {
    id: '6',
    title: 'ستارلينك وتأثيرها على الاتصالات في المناطق النائية',
    excerpt: 'كيف يغير إنترنت الأقمار الصناعية قواعد اللعبة للقرى والبادية في العالم العربي.',
    content: 'وصول الإنترنت فائق السرعة إلى أبعد نقطة في الصحراء لم يعد خيالاً، بل أصبح واقعاً يخدم التعليم والطب عن بعد.',
    category: Category.SPACE,
    author: 'هند القحطاني',
    date: '10 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    readingTime: '5 دقائق'
  },
  {
    id: '7',
    title: 'ريادة الأعمال في زمن الذكاء الاصطناعي التوليدي',
    excerpt: 'كيف تستخدم الشركات الناشئة نماذج LLM لتسريع وتيرة تطوير منتجاتها.',
    content: 'الشركات الناشئة اليوم لا تحتاج لجيوش من المبرمجين، الذكاء الاصطناعي أصبح الشريك المؤسس التقني للجميع.',
    category: Category.STARTUPS,
    author: 'سامي يوسف',
    date: '09 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    readingTime: '4 دقائق'
  },
  {
    id: '8',
    title: 'تطور الحوسبة الكمومية وتأثيرها على التشفير',
    excerpt: 'هل نحن مستعدون لليوم الذي تصبح فيه كلمات السر الحالية غير مجدية؟',
    content: 'الحوسبة الكمومية تقدم قدرات معالجة مرعبة، مما يهدد أنظمة التشفير الحالية ويدفع نحو تشفير مقاوم للكم.',
    category: Category.TECH,
    author: 'رائد إبراهيم',
    date: '08 أكتوبر 2023',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
    readingTime: '9 دقائق'
  }
];

export const NAV_LINKS = [
  { label: 'الرئيسية', value: 'home' },
  { label: 'أخبار التقنية', value: 'tech' },
  { label: 'ريادة الأعمال', value: 'business' },
  { label: 'شركات ناشئة', value: 'startups' },
  { label: 'ذكاء اصطناعي', value: 'ai' },
  { label: 'المحلل الذكي', value: 'analyst' },
];

export const MARKET_DATA = [
  { symbol: 'AAPL', price: '189.43', change: '+1.23%' },
  { symbol: 'TSLA', price: '242.68', change: '-0.45%' },
  { symbol: 'BTC', price: '64,231', change: '+2.10%' },
  { symbol: 'MSFT', price: '402.12', change: '+0.88%' },
  { symbol: 'GOOGL', price: '145.67', change: '-0.12%' },
  { symbol: 'NVDA', price: '875.28', change: '+3.45%' },
];
