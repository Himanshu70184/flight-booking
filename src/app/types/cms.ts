export interface CmsBlog {
  _id?: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug?: string;
  order: number;
  isActive: boolean;
}

export interface CmsTestimonial {
  _id?: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  customerPhoto: string;
  routeLabel?: string;
  badge?: string;
  order: number;
  isActive: boolean;
}

export interface CmsFaq {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface CmsContact {
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: string;
}

export interface CmsSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface PublicCmsContent {
  blogs: CmsBlog[];
  testimonials: CmsTestimonial[];
  faqs: CmsFaq[];
  contact: CmsContact;
  seo: CmsSeo;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
