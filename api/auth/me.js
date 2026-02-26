import jwt from 'jsonwebtoken';
import { connectDatabase } from '../lib/db.js';
import { AdminUser } from '../models/AdminUser.js';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDatabase();

    const auth = authenticateAdmin(req);
    if (auth.error) {
      return res.status(auth.status).json({ success: false, message: auth.error });
    }

    const admin = await AdminUser.findById(auth.admin.sub).select('_id email name role isActive');

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin', error: error.message });
  }
}
