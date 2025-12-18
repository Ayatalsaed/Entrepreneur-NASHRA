
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  date: string;
  imageUrl: string;
  videoUrl?: string;
  isFeatured?: boolean;
  tags?: string[];
  readingTime?: string;
  contentWarning?: string;
}

export enum Category {
  ALL = 'الكل',
  TECH = 'تقنية',
  STARTUPS = 'شركات ناشئة',
  BUSINESS = 'ريادة أعمال',
  AI = 'ذكاء اصطناعي',
  CRYPTO = 'عملات رقمية',
  SPACE = 'فضاء',
  GREEN = 'تقنية خضراء'
}

export interface BriefingRequest {
  topic: string;
}

export interface BriefingResponse {
  title: string;
  summary: string;
  keyPoints: string[];
  outlook: string;
}
