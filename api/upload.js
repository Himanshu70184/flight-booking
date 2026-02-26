import jwt from 'jsonwebtoken';
import { connectDatabase } from '../lib/db.js';

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
  // For Vercel serverless, we need to handle file uploads differently
  // This is a simplified version - for production, use Vercel Blob or cloud storage
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDatabase();

    const auth = authenticateAdmin(req);
    if (auth.error) {
      return res.status(auth.status).json({ success: false, message: auth.error });
    }

    // Check if there's a file in the request
    // Vercel serverless has limitations with multipart/form-data
    // For production, consider using Vercel Blob: https://vercel.com/docs/storage/vercel-blob
    
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      // Handle base64 encoded images from frontend
      const { image, filename } = req.body || {};
      
      if (!image) {
        return res.status(400).json({ success: false, message: 'No image provided' });
      }

      // In production, you would upload to Vercel Blob or S3 here
      // For now, return a placeholder URL
      const placeholderUrl = `https://placeholder.com/${Date.now()}-${filename || 'image'}`;
      
      return res.status(200).json({ 
        success: true, 
        data: { 
          imageUrl: placeholderUrl,
          message: 'Note: For production, configure Vercel Blob or cloud storage for image uploads'
        } 
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid request format' });
  } catch (error) {
    console.error('Upload API error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
}

// Disable body parsing for file uploads (if supported by deployment platform)
export const config = {
  api: {
    bodyParser: false,
  },
};
