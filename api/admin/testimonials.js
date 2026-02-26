import jwt from 'jsonwebtoken';
import { connectDatabase } from '../lib/db.js';
import { Testimonial } from '../models/Testimonial.js';

function authenticateAdmin(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return { error: 'JWT_SECRET is missing', status: 500 };
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    return { admin: payload };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

export default async function handler(req, res) {
  try {
    await connectDatabase();

    const auth = authenticateAdmin(req);
    if (auth.error) {
      return res.status(auth.status).json({ success: false, message: auth.error });
    }

    const { query: { id }, method } = req;

    // GET /api/admin/testimonials - List all testimonials
    if (method === 'GET' && !id) {
      const items = await Testimonial.find().sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, data: items });
    }

    // POST /api/admin/testimonials - Create testimonial
    if (method === 'POST') {
      const item = await Testimonial.create(req.body);
      return res.status(201).json({ success: true, data: item });
    }

    // PUT /api/admin/testimonials/:id - Update testimonial
    if (method === 'PUT' && id) {
      const item = await Testimonial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!item) {
        return res.status(404).json({ success: false, message: 'Testimonial item not found' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    // DELETE /api/admin/testimonials/:id - Delete testimonial
    if (method === 'DELETE' && id) {
      const item = await Testimonial.findByIdAndDelete(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Testimonial item not found' });
      }
      return res.status(200).json({ success: true, message: 'Deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Route not found' });
  } catch (error) {
    console.error('Testimonial API error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
