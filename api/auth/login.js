import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDatabase } from '../lib/db.js';
import { AdminUser } from '../models/AdminUser.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDatabase();

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim(), isActive: true });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET is missing in server configuration' });
    }

    const token = jwt.sign(
      {
        sub: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      jwtSecret,
      { expiresIn: '12h' }
    );

    admin.lastLoginAt = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
}
