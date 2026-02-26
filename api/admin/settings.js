import jwt from 'jsonwebtoken';
import { connectDatabase } from '../lib/db.js';
import { SiteSetting } from '../models/SiteSetting.js';

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

    const { method } = req;

    // GET /api/admin/settings - Get settings
    if (method === 'GET') {
      const settings = await SiteSetting.findOne({ singletonKey: 'main' });
      return res.status(200).json({ success: true, data: settings });
    }

    // PUT /api/admin/settings - Update settings
    if (method === 'PUT') {
      const settings = await SiteSetting.findOneAndUpdate(
        { singletonKey: 'main' },
        { ...req.body, singletonKey: 'main' },
        { new: true, upsert: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: settings });
    }

    return res.status(404).json({ success: false, message: 'Route not found' });
  } catch (error) {
    console.error('Settings API error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
