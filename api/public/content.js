import { connectDatabase } from '../lib/db.js';
import { Blog } from '../models/Blog.js';
import { Testimonial } from '../models/Testimonial.js';
import { Faq } from '../models/Faq.js';
import { SiteSetting } from '../models/SiteSetting.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDatabase();

    const [blogs, testimonials, faqs, settings] = await Promise.all([
      Blog.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      Faq.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      SiteSetting.findOne({ singletonKey: 'main' }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        blogs,
        testimonials,
        faqs,
        seo: settings?.seo || {},
        contact: settings?.contact || {},
      },
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    return res.status(500).json({ success: false, message: 'Failed to load public content', error: error.message });
  }
}
