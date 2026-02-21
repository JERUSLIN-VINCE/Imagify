# Imagify Deployment Guide

## Current Status

### ✅ Backend - Deployed & Working
- **URL:** https://server-ashen-rho.vercel.app
- **Status:** Connected to MongoDB
- **Features:** User registration, login, credit system

### ⚠️ Frontend - Needs Verification
- Please provide your frontend Vercel URL

---

## Required Environment Variables

### Server Project (Vercel)
Add these variables in Vercel Dashboard → server project → Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB Atlas connection string | ✅ Yes |
| JWT_SECRET | Random string for JWT tokens | ✅ Yes |
| CLIPDROP_API | API key from https://clipdrop.co/apis | ✅ Yes (for image generation) |
| FRONTEND_URL | Your frontend Vercel URL | Optional (for CORS) |

---

## Deployment Flow

### Automatic Deployment (GitHub Integration)
1. ✅ Code pushed to GitHub
2. ✅ Vercel automatically detects changes
3. ✅ Vercel redeploys both frontend and backend

### How It Works
- When you push changes to GitHub main branch:
  - Frontend (Imagify folder) → Deploys to your frontend URL
  - Backend (server folder) → Deploys to server-ashen-rho.vercel.app

---

## Testing the API

```
bash
# Health check
curl https://server-ashen-rho.vercel.app/

# Debug info
curl https://server-ashen-rho.vercel.app/debug

# Register user
curl -X POST https://server-ashen-rho.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'
```

---

## Security Notes

1. **Never commit .env files to GitHub** - Already configured in .gitignore
2. **Use Vercel Environment Variables** - Keep secrets safe
3. **CORS configured** - Only allows specific origins in production

---

## Troubleshooting

### If backend shows FUNCTION_INVOCATION_FAILED:
1. Check Vercel dashboard → server project → Functions → Logs
2. Verify all environment variables are set
3. Check MongoDB Atlas network settings (allow all IPs)

### If frontend can't connect to backend:
1. Verify VITE_BACKEND_URL is set in frontend project
2. Check browser console for CORS errors
3. Ensure backend CORS allows your frontend domain

---

## Next Steps

1. Add CLIPDROP_API to server project in Vercel
2. Provide your frontend Vercel URL
3. Test the full application flow
