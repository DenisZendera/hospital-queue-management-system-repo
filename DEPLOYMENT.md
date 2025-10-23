# Deployment Guide - Good Health Hospital System

## Deploy to Render (Free Tier)

Follow these steps to deploy your hospital management system to Render for free!

### Prerequisites
- GitHub account with this repository pushed
- Render account (sign up at https://render.com - free)

### Step 1: Create a Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email

### Step 2: Connect Your GitHub Repository
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Click "Connect GitHub" and authorize Render
4. Select your repository: `hospital-queue-management-system-repo`

### Step 3: Configure Your Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `good-health-hospital` (or your preferred name)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** Leave blank
- **Runtime:** `Node`

**Build & Deploy Settings:**
- **Build Command:** `npm run build:all`
- **Start Command:** `npm start`

**Environment Variables:**
Click "Add Environment Variable" and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET_PATIENT` | Click "Generate" (Render will auto-generate) |
| `JWT_SECRET_STAFF` | Click "Generate" (Render will auto-generate) |

**Plan:**
- Select **Free** plan (0/month)

### Step 4: Deploy!
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build all 3 dashboards
   - Start the server
3. Wait 5-10 minutes for the first deployment

### Step 5: Access Your App

Once deployed, you'll get a URL like: `https://good-health-hospital.onrender.com`

**Access the dashboards:**
- **Patient Dashboard:** `https://your-app.onrender.com/`
- **Admin Dashboard:** `https://your-app.onrender.com/admin`
- **Doctor Dashboard:** `https://your-app.onrender.com/doctor`
- **API Health Check:** `https://your-app.onrender.com/health`

### Step 6: Test Your Deployment

1. Open the patient dashboard
2. Try signing up/logging in
3. Book an appointment
4. Access admin dashboard to manage

## Important Notes

### Free Tier Limitations
- App goes to sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for continuous testing)

### Database
- SQLite database is included and will persist
- Database is stored in the container (resets on redeploy)
- For production, consider upgrading to PostgreSQL

### Updating Your App
Whenever you push changes to GitHub main branch:
1. Render auto-detects the changes
2. Automatically rebuilds and redeploys
3. Takes 5-10 minutes

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Make sure all package.json files are correct
- Verify node version compatibility

### App Won't Start
- Check the deployment logs
- Verify environment variables are set
- Check that PORT is set to 10000

### Can't Access Dashboards
- Make sure you're using HTTPS (not HTTP)
- Clear browser cache
- Check browser console for errors

### Database Issues
- Database resets on each deploy (free tier)
- To persist data, upgrade to PostgreSQL

## Alternative: Deploy Frontends Separately

If you want to deploy frontends to Vercel/Netlify and backend to Render:

**Backend (Render):**
- Deploy only the `server/` folder
- Use environment variables for CORS

**Frontends (Vercel/Netlify):**
- Deploy each dashboard separately
- Set `VITE_API_BASE_URL` to your Render backend URL

## Support

If you encounter issues:
1. Check Render logs (Dashboard → Logs)
2. Check browser console (F12)
3. Verify all environment variables are set
4. Make sure GitHub repository is up to date

## Upgrade Options

**Render Paid Plans:**
- $7/month - Always-on service (no sleep)
- $25/month - Faster build times
- PostgreSQL database available

**Other Hosting Options:**
- Railway (generous free tier)
- Fly.io (free tier available)
- Heroku (paid only now)
- AWS/GCP (complex but scalable)

Good luck with your deployment! 🚀
