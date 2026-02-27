# Backend Deployment Guide

## ⚠️ Important: Vercel vs Traditional Hosting

Your Express backend with MongoDB might face issues on Vercel because:
- **Stateless Functions**: Each request is isolated (connection pooling issues)
- **Cold Starts**: Initial requests are slow
- **Long Timeouts**: Limited to 60 seconds
- **MongoDB Connections**: Don't persist between functions

## 🚀 Recommended Deployment Options

### Option 1: **Railway.app** (RECOMMENDED) ✅
Best for Node.js Express servers
- **Setup**: Drag & drop your repo
- **Database**: Integrated MongoDB support
- **Performance**: Always warm, no cold starts
- **Cost**: $5-20/month

**Steps:**
1. Go to railway.app
2. Create new project → Import GitHub repo
3. Select `backend` branch
4. Add MongoDB service
5. Set environment variables in Railway dashboard
6. Deploy!

### Option 2: **Render.com**
Also good for Node.js servers
- **Setup**: Connect GitHub
- **Free tier**: Available (with limitations)
- **Cost**: $7+/month for production

### Option 3: **Vercel** (If you must use it)
Requires restructuring into serverless functions
- More complex setup
- Not ideal for full Express servers
- Consider only if backend is already API functions

### Option 4: **Traditional VPS**
- DigitalOcean ($5/month)
- Linode ($5/month)  
- AWS EC2
- Full control, runs any Node.js app

---

## 📋 Environment Variables Needed

**For Railway/Render Dashboard, set these:**

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flight-booking?retryWrites=true&w=majority

# Server
NODE_ENV=production
PORT=4000

# JWT
JWT_SECRET=your-super-secure-random-string-here

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=Admin Name

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-domain.com

# Flight API
EASEMYTRIP_API_URL=https://stagingapi.easemytrip.com/Flight.svc/json
EASEMYTRIP_USERNAME=EMTB2B
EASEMYTRIP_PASSWORD=EMT@uytrFYTREt
EASEMYTRIP_IP=your-server-ip
```

---

## 🎯 Quick Deployment Checklist

- [ ] MongoDB Atlas account with database created
- [ ] All environment variables configured
- [ ] Backend server running locally (`npm run dev` in /server)
- [ ] Backend responds to health check
- [ ] Git commits pushed to `backend` branch
- [ ] Railway/Render account created
- [ ] Repository connected
- [ ] Environment vars set in hosting dashboard
- [ ] Deploy button clicked
- [ ] Check deployment logs for errors

---

## 🔗 Useful Links

- [Railway.app Docs](https://docs.railway.app)
- [Render.com Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Functions](https://vercel.com/docs/functions)

---

## ❓ Troubleshooting

**"Cannot find module"**
- Ensure `npm install` runs on deployment
- Check package.json has all dependencies

**"MongoDB connection timeout"**
- Whitelist deployment IP in MongoDB Atlas
- Check connection string format

**"CORS errors"**
- Add frontend URL to CORS_ORIGIN
- Format: `https://example.com` (no trailing slash)

**"Function timeout"**
- Reduce maxDuration in vercel.json
- Use Railway/Render for longer processes

---

## 💡 Recommendation

**Use Railway.app for best experience:**
1. Most Node.js-friendly
2. No cold starts
3. MongoDB easily integrated
4. Zero configuration needed
5. Cost-effective

Your Express backend will work perfectly on Railway! 🎉
