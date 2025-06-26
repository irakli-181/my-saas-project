# 🚀 Deployment Guide - Vercel

This guide will help you deploy your Open SaaS application to Vercel successfully.

## 📋 Prerequisites

- ✅ GitHub repository set up
- ✅ Vercel account ([sign up here](https://vercel.com))
- ✅ Database ready (PostgreSQL recommended)
- ✅ Environment variables prepared

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irakli-181/my-saas-project)

## 📖 Manual Deployment Steps

### 1. Import Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: `https://github.com/irakli-181/my-saas-project`
4. Select your repository

### 2. Configure Project Settings

**Framework Preset**: `Other` (Custom)

**Root Directory**: Leave blank (project is configured to build from `my-saas-app/app`)

**Build Settings**:
- **Build Command**: `cd my-saas-app/app && wasp build`
- **Output Directory**: `my-saas-app/app/.wasp/build/web-app/build`
- **Install Command**: `cd my-saas-app/app && npm install`

### 3. Environment Variables

Add these environment variables in the Vercel Dashboard:

#### 🔐 Authentication & Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
ADMIN_EMAILS=admin@test.com,your-email@example.com
SKIP_EMAIL_VERIFICATION_IN_DEV=false
```

#### 💰 Payment Integration
```bash
# Stripe
STRIPE_API_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_public_key

# LemonSqueezy (optional)
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_WEBHOOK_SECRET=your_lemonsqueezy_webhook_secret
```

#### 🤖 AI Integration
```bash
OPENAI_API_KEY=sk-your_openai_api_key
```

#### 📁 File Upload (AWS S3)
```bash
AWS_S3_REGION=us-east-1
AWS_S3_IAM_ACCESS_KEY=your_aws_access_key
AWS_S3_IAM_SECRET_KEY=your_aws_secret_key
AWS_S3_FILES_BUCKET=your-s3-bucket-name
```

#### 📧 Email Provider (Optional)
```bash
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Or Mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### 4. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel project dashboard, go to **Storage** tab
2. Create a **Postgres** database
3. Copy the connection string to `DATABASE_URL`

#### Option B: External PostgreSQL
Use any PostgreSQL provider:
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app) (PostgreSQL)
- [AWS RDS](https://aws.amazon.com/rds/)
- [Google Cloud SQL](https://cloud.google.com/sql)

### 5. Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🔧 Post-Deployment Configuration

### Database Migrations

After your first deployment, you need to run database migrations:

```bash
# Clone your repository locally
git clone https://github.com/irakli-181/my-saas-project.git
cd my-saas-project/my-saas-app/app

# Set up environment variables locally
cp .env.server.example .env.server
# Edit .env.server with your production DATABASE_URL

# Run migrations
wasp db migrate-dev
```

### Create Admin User

1. Visit your deployed app's signup page: `https://your-project.vercel.app/signup`
2. Use one of the emails from your `ADMIN_EMAILS` environment variable
3. You'll have admin access automatically

## 🌍 Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Domains"** tab
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update your app's metadata in `main.wasp` with your domain

## 🔍 Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your project dashboard
2. Get insights on performance and usage

### Application Monitoring
Your app includes built-in analytics:
- **Admin Dashboard**: View user metrics at `/admin`
- **Payment Analytics**: Track revenue and subscriptions
- **User Analytics**: Monitor signups and engagement

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
**Error**: `wasp: command not found`
**Solution**: The build uses a custom configuration. Make sure your `vercel.json` is properly configured.

#### 2. Database Connection Issues
**Error**: Database connection timeout
**Solution**: 
- Verify your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP ranges
- Run migrations after deployment

#### 3. Environment Variables Not Loading
**Error**: Features not working (payments, AI, etc.)
**Solution**:
- Double-check all environment variables in Vercel dashboard
- Ensure no typos in variable names
- Redeploy after adding variables

#### 4. API Routes Not Working
**Error**: 404 on API endpoints
**Solution**: 
- Verify your `vercel.json` configuration
- Check that serverless functions are properly configured

### Debug Mode

To enable debug logging in production:

```bash
# Add to environment variables
DEBUG=wasp:*
NODE_ENV=production
```

## 📊 Performance Optimization

### 1. Edge Caching
Your `vercel.json` is configured for optimal caching. Static assets are cached automatically.

### 2. Database Optimization
- Use connection pooling for production databases
- Consider database read replicas for scaling
- Monitor query performance

### 3. File Upload Optimization
- Images are automatically optimized via S3
- Consider CDN for global file distribution

## 🔄 Continuous Deployment

Every push to your `main` branch will automatically trigger a new deployment. To set up different environments:

1. **Production**: `main` branch → `your-app.vercel.app`
2. **Staging**: `staging` branch → `staging-your-app.vercel.app`
3. **Preview**: Feature branches → preview URLs

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Functions → View Logs
2. **GitHub Issues**: [Report bugs](https://github.com/irakli-181/my-saas-project/issues)
3. **Wasp Discord**: [Community support](https://discord.gg/rzdnErX)

---

**🎉 Congratulations!** Your SaaS application is now deployed and ready to scale! 