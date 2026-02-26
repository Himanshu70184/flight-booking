// Consolidated API Handler for Vercel - All endpoints in one file
import { connectToDatabase } from './lib/db.js';
import { Blog, Testimonial, Faq, SiteSetting, AdminUser } from './models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Parse body for POST/PUT requests
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper: Authenticate admin
async function authenticateAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Helper: Handle API errors
function handleError(res, error) {
  console.error('API Error:', error);
  return res.status(500).json({ 
    success: false, 
    message: error.message || 'Internal server error' 
  });
}

// ==================== PUBLIC ENDPOINTS ====================

// GET /api/public/content - Get all public CMS content
export default async function handler(req, res) {
  const { url, method } = req;
  
  try {
    await connectToDatabase();
    
    // Route: /api/public/content
    if (url === '/api/public/content' && method === 'GET') {
      const [blogs, testimonials, faqs, settings] = await Promise.all([
        Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(10),
        Testimonial.find({ isActive: true }).sort({ order: 1 }),
        Faq.find({ isActive: true }).sort({ order: 1 }),
        SiteSetting.findOne({ singletonKey: 'main' }),
      ]);
      
      return res.status(200).json({
        success: true,
        data: {
          blogs,
          testimonials,
          faqs,
          contact: settings?.contact || {},
          seo: settings?.seo || {},
        }
      });
    }
    
    // ==================== AUTH ENDPOINTS ====================
    
    // POST /api/auth/login
    if (url === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }
      
      const admin = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({
        success: true,
        data: {
          token,
          user: { email: admin.email, name: admin.name, role: admin.role }
        }
      });
    }
    
    // GET /api/auth/me
    if (url === '/api/auth/me' && method === 'GET') {
      const auth = await authenticateAdmin(req);
      const admin = await AdminUser.findById(auth.id).select('-passwordHash');
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      return res.status(200).json({
        success: true,
        data: { email: admin.email, name: admin.name, role: admin.role }
      });
    }
    
    // ==================== ADMIN BLOGS ====================
    
    // GET /api/admin/blogs
    if (url === '/api/admin/blogs' && method === 'GET') {
      await authenticateAdmin(req);
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: blogs });
    }
    
    // POST /api/admin/blogs
    if (url === '/api/admin/blogs' && method === 'POST') {
      await authenticateAdmin(req);
      const blog = await Blog.create(req.body);
      return res.status(201).json({ success: true, data: blog });
    }
    
    // PUT /api/admin/blogs/:id
    if (url?.match(/^\/api\/admin\/blogs\/[a-fA-F0-9]+$/) && method === 'PUT') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
      }
      return res.status(200).json({ success: true, data: blog });
    }
    
    // DELETE /api/admin/blogs/:id
    if (url?.match(/^\/api\/admin\/blogs\/[a-fA-F0-9]+$/) && method === 'DELETE') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      await Blog.findByIdAndDelete(id);
      return res.status(200).json({ success: true, data: { message: 'Blog deleted' } });
    }
    
    // ==================== ADMIN TESTIMONIALS ====================
    
    // GET /api/admin/testimonials
    if (url === '/api/admin/testimonials' && method === 'GET') {
      await authenticateAdmin(req);
      const testimonials = await Testimonial.find().sort({ order: 1 });
      return res.status(200).json({ success: true, data: testimonials });
    }
    
    // POST /api/admin/testimonials
    if (url === '/api/admin/testimonials' && method === 'POST') {
      await authenticateAdmin(req);
      const testimonial = await Testimonial.create(req.body);
      return res.status(201).json({ success: true, data: testimonial });
    }
    
    // PUT /api/admin/testimonials/:id
    if (url?.match(/^\/api\/admin\/testimonials\/[a-fA-F0-9]+$/) && method === 'PUT') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
      if (!testimonial) {
        return res.status(404).json({ success: false, message: 'Testimonial not found' });
      }
      return res.status(200).json({ success: true, data: testimonial });
    }
    
    // DELETE /api/admin/testimonials/:id
    if (url?.match(/^\/api\/admin\/testimonials\/[a-fA-F0-9]+$/) && method === 'DELETE') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      await Testimonial.findByIdAndDelete(id);
      return res.status(200).json({ success: true, data: { message: 'Testimonial deleted' } });
    }
    
    // ==================== ADMIN FAQS ====================
    
    // GET /api/admin/faqs
    if (url === '/api/admin/faqs' && method === 'GET') {
      await authenticateAdmin(req);
      const faqs = await Faq.find().sort({ order: 1 });
      return res.status(200).json({ success: true, data: faqs });
    }
    
    // POST /api/admin/faqs
    if (url === '/api/admin/faqs' && method === 'POST') {
      await authenticateAdmin(req);
      const faq = await Faq.create(req.body);
      return res.status(201).json({ success: true, data: faq });
    }
    
    // PUT /api/admin/faqs/:id
    if (url?.match(/^\/api\/admin\/faqs\/[a-fA-F0-9]+$/) && method === 'PUT') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
      if (!faq) {
        return res.status(404).json({ success: false, message: 'FAQ not found' });
      }
      return res.status(200).json({ success: true, data: faq });
    }
    
    // DELETE /api/admin/faqs/:id
    if (url?.match(/^\/api\/admin\/faqs\/[a-fA-F0-9]+$/) && method === 'DELETE') {
      await authenticateAdmin(req);
      const id = url.split('/').pop();
      await Faq.findByIdAndDelete(id);
      return res.status(200).json({ success: true, data: { message: 'FAQ deleted' } });
    }
    
    // ==================== ADMIN SETTINGS ====================
    
    // GET /api/admin/settings
    if (url === '/api/admin/settings' && method === 'GET') {
      await authenticateAdmin(req);
      let settings = await SiteSetting.findOne({ singletonKey: 'main' });
      if (!settings) {
        settings = await SiteSetting.create({ singletonKey: 'main' });
      }
      return res.status(200).json({ success: true, data: settings });
    }
    
    // PUT /api/admin/settings
    if (url === '/api/admin/settings' && method === 'PUT') {
      await authenticateAdmin(req);
      const settings = await SiteSetting.findOneAndUpdate(
        { singletonKey: 'main' },
        { ...req.body, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, data: settings });
    }
    
    // ==================== UPLOAD (Stub for Vercel) ====================
    
    // POST /api/upload
    if (url === '/api/upload' && method === 'POST') {
      await authenticateAdmin(req);
      // File uploads require additional Vercel configuration
      // For now, return a placeholder response
      return res.status(200).json({ 
        success: true, 
        data: { 
          message: 'File upload not configured for Vercel serverless',
          url: null 
        } 
      });
    }
    
    // ==================== HEALTH CHECK ====================
    
    // GET /api/health
    if (url === '/api/health' && method === 'GET') {
      return res.status(200).json({ success: true, message: 'API is healthy' });
    }
    
    // 404 - No matching route
    return res.status(404).json({ success: false, message: 'Endpoint not found' });
    
  } catch (error) {
    // Handle auth errors specifically
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ success: false, message: error.message });
    }
    return handleError(res, error);
  }
}
