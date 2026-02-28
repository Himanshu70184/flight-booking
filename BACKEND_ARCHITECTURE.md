# Backend Architecture & Key Issues - FIXED

## 🎯 Issues Fixed

### ✅ Issue 1: Code Duplication
**Problem**: Three separate implementations existed:
- `/src/index.js` (root level)
- `/server/src/index.js` (main)
- `/api/index.js` (Vercel serverless)

**Solution**:
- ❌ Deleted `/src` folder (duplicate)
- ❌ Deleted root `/index.js` and `/routes` (unused)
- ✅ Kept `/server/src` as the **primary backend**
- ✅ Kept `/api` as **optional Vercel alternative** (not recommended)

---

### ✅ Issue 2: Incorrect Entry Points
**Problem**: Multiple entry points causing confusion

**Solution**:
- ✅ Primary entry point: `server/src/index.js` (with `npm run dev`)
- ✅ Root script: `npm run dev:backend` runs `npm run dev --prefix server`
- ✅ Fixed `vercel.json` to point to `/api/index.js` if Vercel is used

---

### ✅ Issue 3: Incomplete Environment Configuration
**Problem**: Missing or incorrect env variables in `.env`

**Solution**:
- ✅ Updated root `.env` with complete backend configuration
- ✅ Fixed `VITE_API_BASE_URL` from `localhost:4003` → `localhost:4000`
- ✅ Added all required backend variables (MONGODB_URI, JWT_SECRET, CORS_ORIGIN, etc.)
- ✅ Created `BACKEND_SETUP.md` with complete env reference

---

## 📊 Current Backend Architecture

```
flight-booking-platform/
├── server/ (PRIMARY BACKEND)
│   ├── src/
│   │   ├── index.js                 ← Main entry point
│   │   ├── config/db.js             ← MongoDB connection
│   │   ├── middleware/auth.js       ← JWT authentication
│   │   ├── models/                  ← Database schemas
│   │   │   ├── AdminUser.js
│   │   │   ├── Blog.js
│   │   │   ├── Faq.js
│   │   │   ├── FlightInquiry.js
│   │   │   ├── SiteSetting.js
│   │   │   └── Testimonial.js
│   │   ├── routes/                  ← API endpoints
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── flightRoutes.js
│   │   │   ├── inquiryRoutes.js
│   │   │   └── publicRoutes.js
│   │   ├── seed/defaultContent.js   ← Database seeding
│   │   └── services/flightService.js ← EaseMyTrip API integration
│   ├── package.json
│   └── .env.example
│
├── api/ (OPTIONAL - Vercel Serverless)
│   ├── index.js                     ← Single handler for Vercel
│   ├── lib/db.js
│   ├── models/
│   └── (Note: Not recommended due to serverless limitations)
│
├── .env (CONFIGURED)
├── vercel.json (FIXED)
└── BACKEND_SETUP.md (NEW - Setup Guide)
```

---

## 🚀 How to Run Backend

### Development (Recommended)
```bash
cd server
npm install
npm run dev
```

Or from root:
```bash
npm run dev:backend
```

### Production
```bash
cd server
npm start
```

---

## 📡 API Architecture

### Authentication Flow
```
Client Login Request
    ↓
POST /api/auth/login (email + password)
    ↓
AdminUser.findOne() → Verify password with bcrypt
    ↓
Generate JWT token (12h expiry)
    ↓
Return token to client
    ↓
Client stores token & includes in Authorization header
    ↓
POST /api/admin/* (with Bearer token)
    ↓
authenticateAdmin middleware → Verify JWT
    ↓
Process admin request
```

### Flight Search Flow
```
Client Search Request
    ↓
POST /api/flights/search
    ↓
Input validation (adults, children, infants, etc.)
    ↓
searchFlights() service
    ↓
Call EaseMyTrip API with credentials
    ↓
Parse response
    ↓
Return flight results to client
```

---

## 🔐 Security Implementation

| Feature | Implementation |
|---------|-----------------|
| **JWT Authentication** | 12-hour token expiry, signed with `JWT_SECRET` |
| **Password Hashing** | bcryptjs (salt rounds: 10) |
| **CORS** | Whitelist allowed origins from env var |
| **Admin Protection** | All `/api/admin/*` routes require JWT token |
| **Request Logging** | Log origin and headers in dev mode |
| **Input Validation** | Validate passenger counts, flight details, etc. |

---

## 🗄️ Database Models

### AdminUser
- Email (unique)
- Password hash
- Role (admin, manager, etc.)
- Active status
- Last login timestamp

### Blog
- Title, excerpt, content
- Featured image, author
- Active status, order, tags
- Timestamps

### Testimonial
- Client name, role
- Message
- Avatar URL
- Active status, order
- Star rating

### FAQ
- Question, answer
- Category
- Active status, order

### SiteSetting
- SEO metadata
- Contact information
- Site branding

### FlightInquiry
- Trip details (origin → destination → dates)
- Passenger info (adults, children, infants)
- Cabin preference
- EaseMyTrip trace ID
- Timestamps

---

## 📚 Key Endpoints

### Public API
```
GET    /health                    # Health check
GET    /api/debug                 # Request debug info
GET    /api/public/content        # Site content
POST   /api/auth/login            # Admin login
POST   /api/flights/search        # Search flights
POST   /api/flights/re-price      # Reprice flight
POST   /api/flights/seat-map      # Get seat map
POST   /api/flights/ssr           # Special services
POST   /api/inquiries/save        # Save inquiry
```

### Admin API (Protected)
```
POST   /api/admin/blogs           # Create blog
PUT    /api/admin/blogs/:id       # Update blog
DELETE /api/admin/blogs/:id       # Delete blog
POST   /api/admin/testimonials    # Manage testimonials
POST   /api/admin/faqs            # Manage FAQs
PUT    /api/admin/settings        # Update settings
```

---

## ⚙️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| File Uploads | Multer + Sharp |
| External API | EaseMyTrip |
| Deployment | Railway/Render/VPS (Not Vercel) |

---

## ✅ Next Steps

1. **Configure MongoDB Atlas**
   - Create account at mongodb.com/cloud/atlas
   - Create cluster & database
   - Get connection string
   - Add to `.env` as `MONGODB_URI`

2. **Obtain EaseMyTrip Credentials**
   - Contact EaseMyTrip for API access
   - Get username, password, and IP whitelist

3. **Test Backend Locally**
   - Run `npm run dev:backend`
   - Test endpoints with Postman/curl
   - Verify health check: `GET http://localhost:4000/health`

4. **Deploy Backend**
   - Recommended: Railway.app or Render.com
   - Set env variables in hosting platform
   - Configure MongoDB Atlas IP whitelist

5. **Connect Frontend**
   - Update `VITE_API_BASE_URL` in frontend `.env`
   - Point to deployed backend URL
   - Update `CORS_ORIGIN` in backend `.env`

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `MONGODB_URI is required` | Add `MONGODB_URI` to `.env` |
| `JWT_SECRET is missing` | Add `JWT_SECRET` to `.env` |
| `CORS error` | Add frontend origin to `CORS_ORIGIN` |
| `Port already in use` | Change `PORT` in `.env` or kill process |
| EaseMyTrip 401 error | Verify credentials and IP whitelist |
| Admin can't login | Check password in admin user record |

---

## 📖 Documentation Files

- **BACKEND_SETUP.md** - Comprehensive setup guide
- **VERCEL_DEPLOYMENT.md** - Deployment recommendations
- **API_INTEGRATION_COMPLETE.md** - Flight API integration details
- **CORS_SOLUTION_GUIDE.md** - CORS troubleshooting

---

**Status**: ✅ Backend architecture is now clean and ready for development/deployment
