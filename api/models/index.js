// Consolidated Mongoose Models for Vercel Serverless
import mongoose from 'mongoose';

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  author: String,
  image: String,
  category: String,
  tags: [String],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  company: String,
  avatar: String,
  content: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// FAQ Schema
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Site Setting Schema
const siteSettingSchema = new mongoose.Schema({
  singletonKey: { type: String, required: true },
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    socialLinks: mongoose.Schema.Types.Mixed,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Admin User Schema
const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export models
export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export const Faq = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
export const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
