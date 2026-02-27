# CORS Issue Fix - API 500 Error on OPTIONS Request

## Problem Analysis

Your backend API was returning a **500 Internal Server Error** on CORS preflight (OPTIONS) requests to `https://flight-booking-backend-iota.vercel.app/api/auth/login`.

### Root Cause
The API handler was missing:
1. **CORS header configuration** - Headers needed to pass CORS validation
2. **OPTIONS method handling** - Preflight requests use OPTIONS, and the handler was not recognizing it

When a browser makes a cross-origin request, it first sends an OPTIONS request. Without proper handling, this resulted in a 500 error, blocking all cross-origin requests.

## Solution Implemented

### 1. Updated API Handler (`/api/index.js`)
Added CORS support with:

```javascript
// Set CORS headers for all requests
setCorsHeaders(res, origin);

// Handle preflight requests immediately
if (method === 'OPTIONS') {
  return res.status(200).end();
}
```

**Key Features:**
- Reads `CORS_ORIGIN` environment variable with comma-separated allowed origins
- Sets required CORS headers on every response
- Immediately responds to OPTIONS requests with status 200
- Validates origin before allowing cross-origin access

### 2. Updated Vercel Configuration (`vercel.json`)
- Added API function configuration with memory and timeout limits
- Configured routes to properly handle `/api/*` paths
- Maintained frontend rewrite for SPA routing

### 3. Updated Environment Variables (`.env.example`)
Added complete backend environment variable documentation:
- `MONGODB_URI` - Database connection
- `CORS_ORIGIN` - Allowed domains (comma-separated)
- `JWT_SECRET` - Token signing key
- Database credentials and default admin user

## How to Deploy

### Step 1: Add Environment Variables to Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add the following variables:

```
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
JWT_SECRET=your-very-secure-random-key
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=Admin@12345
```

⚠️ **Important:** Use different values for production!

### Step 2: Configure CORS_ORIGIN

For production, set:
```
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

For development with local testing:
```
CORS_ORIGIN=http://localhost:5173,http://localhost:5176,https://your-frontend.vercel.app
```

### Step 3: Push Code to Repository

```bash
git add api/ vercel.json .env.example
git commit -m "fix: Add CORS support to API handler"
git push
```

Vercel will automatically redeploy with the updated code.

### Step 4: Verify CORS Configuration

Test the CORS headers are working:

```bash
curl -X OPTIONS https://flight-booking-backend-iota.vercel.app/api/auth/login \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see headers like:
```
Access-Control-Allow-Origin: https://your-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
```

## Files Modified

1. **`/api/index.js`** - Main API handler with CORS support
2. **`/api/lib/db.js`** - MongoDB connection helper
3. **`/api/models/index.js`** - Mongoose schemas
4. **`vercel.json`** - Vercel deployment configuration
5. **`.env.example`** - Environment variables documentation

## Testing Locally

To test the API locally before deploying:

```bash
# Install dependencies if not already done
npm install

# Set environment variables
export MONGODB_URI="your_mongodb_uri"
export CORS_ORIGIN="http://localhost:5173"
export JWT_SECRET="test-secret"

# For Vercel local testing, use vercel dev
npm install -g vercel
vercel dev
```

This will run both your frontend (on port 3000) and API locally.

## Common Issues & Solutions

### Issue: Still getting CORS errors
**Solution:** 
- Check that `CORS_ORIGIN` environment variable includes your frontend domain
- Make sure frontend is using the correct API base URL from `.env`
- Clear browser cache and try again

### Issue: 401 Unauthorized on login
**Solution:**
- Verify admin credentials in environment variables
- Check that MongoDB connection is working
- Look at API logs for auth errors

### Issue: 404 on API routes
**Solution:**
- Ensure routes match exactly (e.g., `/api/auth/login` not `/api/auth/login/`)
- Check that request method matches (GET, POST, etc.)
- Verify API is deployed and running on Vercel

## Next Steps

1. ✅ Copy API files to repository
2. ✅ Configure environment variables in Vercel
3. ✅ Deploy to production
4. ✅ Test CORS with OPTIONS request
5. ✅ Verify login endpoint works from frontend

## References

- [Mozilla CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Vercel API Routes Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Mongoose Documentation](https://mongoosejs.com/)
