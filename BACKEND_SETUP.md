# Backend Setup Guide

## 📋 Overview

The backend is an **Express.js API** that serves the Flight Booking Platform. It's located in the `/server` directory.

### Primary Entry Point
- **Server Location**: `/server/src/index.js`
- **Port**: 4000 (configurable via `PORT` env var)
- **Database**: MongoDB
- **API Framework**: Express.js

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
cd server
npm install
```

### 2. **Configure Environment Variables**
Edit the root `.env` file or create `server/.env` with these variables:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flight-booking

# JWT
JWT_SECRET=your-random-secret-key-here

# Admin (auto-created on startup)
ADMIN_EMAIL=admin@flightbooking.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=Super Admin

# CORS (Frontend URLs)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Flight API (EaseMyTrip)
EASEMYTRIP_API_URL=https://stagingapi.easemytrip.com/Flight.svc/json
EASEMYTRIP_USERNAME=EMTB2B
EASEMYTRIP_PASSWORD=EMT@uytrFYTREt
EASEMYTRIP_IP=127.0.0.1
```

### 3. **Start Backend**
```bash
# Option 1: Watch mode (auto-restart on changes)
npm run dev

# Option 2: Production
npm start
```

### 4. **Run from Root**
```bash
npm run dev:backend
```

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)
- **GET** `/api/public/content` - Fetch site content (blogs, FAQs, testimonials, settings)
- **GET** `/health` - Health check
- **GET** `/api/debug` - Debug request origin/headers

### Authentication
- **POST** `/api/auth/login` - Admin login
  - Body: `{ email, password }`
  - Returns: JWT token (12-hour expiry)

### Flight Search (Public)
- **POST** `/api/flights/search` - Search flights via EaseMyTrip API
- **POST** `/api/flights/reprice` - Reprice selected flights
- **POST** `/api/flights/seatmap` - Get seat availability
- **POST** `/api/flights/ssr` - Get special service requests

### Flight Inquiries (Public)
- **POST** `/api/inquiries/save` - Save flight inquiry
- **GET** `/api/inquiries` - Get all inquiries

### Admin Routes (Requires JWT Token)
- **POST** `/api/admin/blogs` - Create blog
- **PUT** `/api/admin/blogs/:id` - Update blog
- **DELETE** `/api/admin/blogs/:id` - Delete blog
- **POST** `/api/admin/testimonials` - Manage testimonials
- **POST** `/api/admin/faqs` - Manage FAQs
- **POST** `/api/admin/settings` - Update site settings

### File Upload
- **POST** `/api/upload` - Upload files

---

## 🗄️ Project Structure

```
server/
├── src/
│   ├── index.js                 # Main entry point
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── models/                 # Database schemas
│   │   ├── AdminUser.js
│   │   ├── Blog.js
│   │   ├── Faq.js
│   │   ├── FlightInquiry.js
│   │   ├── SiteSetting.js
│   │   └── Testimonial.js
│   ├── routes/                 # API route handlers
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── flightRoutes.js
│   │   ├── inquiryRoutes.js
│   │   └── publicRoutes.js
│   ├── seed/
│   │   └── defaultContent.js   # Default database content
│   └── services/
│       └── flightService.js    # EaseMyTrip API integration
├── package.json
└── .env.example                # Example env variables
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 4000 | Server port |
| `NODE_ENV` | No | development | development/production |
| `MONGODB_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT tokens |
| `ADMIN_EMAIL` | No | admin@flightbooking.com | Default admin email |
| `ADMIN_PASSWORD` | No | Admin@12345 | Default admin password |
| `ADMIN_NAME` | No | Super Admin | Default admin name |
| `CORS_ORIGIN` | No | http://localhost:5173 | Allowed frontend origins (comma-separated) |
| `EASEMYTRIP_USERNAME` | **Yes** | - | EaseMyTrip username |
| `EASEMYTRIP_PASSWORD` | **Yes** | - | EaseMyTrip password |
| `EASEMYTRIP_IP` | **Yes** | - | Server IP for EaseMyTrip |
| `EASEMYTRIP_API_URL` | No | staging URL | EaseMyTrip API endpoint |

---

## ✅ Verification Checklist

Before deploying:

- [ ] `.env` file configured with all required variables
- [ ] MongoDB Atlas cluster created and connection string added
- [ ] EaseMyTrip API credentials obtained
- [ ] Backend runs locally: `npm run dev`
- [ ] Health check responds: `curl http://localhost:4000/health`
- [ ] Admin login works: `POST /api/auth/login`
- [ ] Flight search works: `POST /api/flights/search`
- [ ] Frontend can reach backend (CORS configured)
- [ ] Uploads folder exists and has write permissions

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MONGODB_URI is required in server/.env
```
**Solution**: Add `MONGODB_URI` to `.env` file

### JWT Secret Missing
```
Error: JWT_SECRET is missing in server .env
```
**Solution**: Add `JWT_SECRET` to `.env` file

### EaseMyTrip Missing Credentials
```
Error: Missing required environment variables: EASEMYTRIP_USERNAME, EASEMYTRIP_PASSWORD, EASEMYTRIP_IP
```
**Solution**: Add EaseMyTrip credentials to `.env`

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Add frontend URL to `CORS_ORIGIN` env variable (comma-separated)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution**: Change `PORT` in `.env` or kill the process using port 4000

---

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production (Recommended: Railway.app)
See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for deployment options.

### Vercel (Serverless - Not Recommended)
The `/api` folder contains a Vercel serverless implementation, but Express servers work better on traditional hosting (Railway, Render, VPS).

Update `vercel.json` environment variables in Vercel dashboard if using Vercel deployment.

---

## 📚 Database Seeding

The backend automatically seeds default content on first startup if the database is empty:
- Creates default admin user
- Adds sample blogs
- Adds sample testimonials
- Adds FAQ entries
- Creates site settings

**Credentials** (customizable via env vars):
- Email: `admin@flightbooking.com`
- Password: `Admin@12345`

---

## 🔐 Security Notes

1. **Always change `JWT_SECRET` in production**
2. **Use strong `ADMIN_PASSWORD` in production**
3. **Restrict `CORS_ORIGIN` to your domain only**
4. **Store sensitive data in environment variables, never in code**
5. **Use HTTPS in production**
6. **Regularly update dependencies**: `npm audit fix`

---

## 📞 Support

For issues or questions:
1. Check logs: `npm run dev` shows detailed errors
2. Review API endpoint documentation above
3. Check `/api/debug` endpoint for request details
4. Verify MongoDB connection: Check Atlas UI
5. Verify EaseMyTrip API status and credentials
