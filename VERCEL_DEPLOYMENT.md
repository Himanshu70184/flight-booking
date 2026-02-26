# Vercel Deployment Guide

## Current Setup
- **Frontend**: React + Vite (in root)
- **Backend API**: Vercel Serverless Functions (in `/api` folder)
- **Database**: MongoDB (Atlas or local)

## Files Created/Modified

### 1. `/api/` - Vercel Serverless API Routes
- `api/lib/db.js` - MongoDB connection
- `api/models/` - Mongoose models (Blog, Testimonial, Faq, SiteSetting, AdminUser)
- `api/public/content.js` - Public content endpoint
- `api/auth/login.js` - Admin login
- `api/auth/me.js` - Admin profile
- `api/admin/blogs.js` - Blog CRUD
- `api/admin/testimonials.js` - Testimonial CRUD
- `api/admin/faqs.js` - FAQ CRUD
- `api/admin/settings.js` - Settings management
- `api/upload.js` - Image upload (simplified for serverless)

### 2. `vercel.json` - Vercel configuration for API routing

### 3. `src/app/services/contentApi.ts` - Updated to auto-detect production URL

### 4. `src/app/services/uploadService.ts` - Updated to auto-detect production URL

## Environment Variables Required (Vercel Dashboard)

Go to your Vercel project Settings → Environment Variables and add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string_min_32_chars
CORS_ORIGIN=https://your-project.vercel.app
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI
```
bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Deploy via Git
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Important Notes

### MongoDB on Vercel
Vercel serverless functions require a cloud MongoDB. Options:
1. **MongoDB Atlas** (Free tier available) - Recommended
2. **MongoDB Realm**
3. **mLab** (now MongoDB Atlas)

### Image Uploads
The current `api/upload.js` is simplified for serverless. For production:
- Use Vercel Blob: https://vercel.com/docs/storage/vercel-blob
- Or AWS S3 / Cloudinary

### CORS Configuration
The API will automatically allow requests from your Vercel frontend due to CORS configuration.

## Testing Locally

To test the API routes locally with Vercel:
```
bash
vercel dev
```

This will start both frontend (port 5173) and API (port 3000) locally.

## Troubleshooting

### 1. 404 on API routes
- Ensure `vercel.json` is in project root
- Check that API files are in `/api` folder

### 2. MongoDB connection error
- Verify `MONGODB_URI` is set correctly
- Check IP whitelist in MongoDB Atlas (allow all IPs: 0.0.0.0/0)

### 3. JWT errors
- Ensure `JWT_SECRET` is set in Vercel environment variables
- Secret should be at least 32 characters

### 4. Function timeout
- Vercel free tier has 10s timeout
- For longer operations, consider upgrading or optimizing queries
