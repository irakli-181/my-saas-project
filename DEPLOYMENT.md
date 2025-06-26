# 🚀 Vercel Deployment Guide

This guide will help you deploy your SaaS application to Vercel in minutes.

## 📋 **Prerequisites**

- GitHub account
- Vercel account ([sign up at vercel.com](https://vercel.com))
- PostgreSQL database (we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))

---

## 🚀 **Quick Deploy (1-Click)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irakli-181/my-saas-project)

1. Click the "Deploy with Vercel" button above
2. Fork the repository to your GitHub account
3. Configure environment variables (see below)
4. Deploy!

---

## 🔧 **Manual Deployment Steps**

### **Step 1: Import Project to Vercel**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **"my-saas-project"**

### **Step 2: Configure Build Settings**

Vercel should automatically detect the settings, but verify:

- **Framework Preset**: Other
- **Root Directory**: `./` (leave as default)
- **Build Command**: `cd my-saas-app/app && wasp build`
- **Output Directory**: `my-saas-app/app/.wasp/build/web-app/build`
- **Install Command**: `curl -sSL https://get.wasp.sh/installer.sh | sh && cd my-saas-app/app && npm install`

### **Step 3: Set Environment Variables**

**IMPORTANT**: Add these environment variables directly in your Vercel project dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below by clicking **"Add"**

#### **Required Variables**

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database

# Admin Configuration
ADMIN_EMAILS=your-admin@email.com
SKIP_EMAIL_VERIFICATION_IN_DEV=false

# Stripe Payment Processing
STRIPE_API_KEY=sk_live_your_stripe_secret_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# OpenAI Integration
OPENAI_API_KEY=sk-your_openai_api_key
```

#### **Optional Variables (for full functionality)**

```bash
# AWS S3 File Upload
AWS_S3_REGION=us-east-1
AWS_S3_IAM_ACCESS_KEY=your_aws_access_key
AWS_S3_IAM_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA4-your_tracking_id

# LemonSqueezy (Alternative Payment Processor)
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_key
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

### **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## 🗄️ **Database Setup**

### **Option 1: Neon (Recommended)**

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to Vercel as `DATABASE_URL`

### **Option 2: Supabase**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add it to Vercel as `DATABASE_URL`

### **Option 3: Railway**

1. Go to [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string
4. Add it to Vercel as `DATABASE_URL`

---

## 💳 **Payment Setup (Stripe)**

### **Get Stripe API Keys**

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Copy your **Publishable Key** and **Secret Key**
4. For production, use **Live** keys
5. For testing, use **Test** keys

### **Configure Webhooks**

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/payments-webhook`
3. Select events: `payment_intent.succeeded`, `customer.subscription.created`, etc.
4. Copy the webhook secret and add to environment variables

---

## 🤖 **AI Features Setup (OpenAI)**

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add it to Vercel as `OPENAI_API_KEY`
4. Set up billing for API usage

---

## 📁 **File Upload Setup (AWS S3)**

1. Create an AWS account
2. Create an S3 bucket
3. Create an IAM user with S3 permissions
4. Add the credentials to environment variables:
   - `AWS_S3_REGION`
   - `AWS_S3_IAM_ACCESS_KEY`
   - `AWS_S3_IAM_SECRET_KEY`
   - `AWS_S3_BUCKET_NAME`

---

## 🎛️ **Admin Setup**

1. After deployment, visit your site
2. Go to `/signup`
3. Register with the email you set in `ADMIN_EMAILS`
4. You'll automatically have admin privileges
5. Access admin dashboard at `/admin`

---

## 🔧 **Custom Domain (Optional)**

1. In Vercel dashboard, go to your project
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. SSL certificate will be automatically generated

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- Automatically enabled for performance monitoring
- View in Vercel dashboard

### **Google Analytics**
- Add your tracking ID to `REACT_APP_GOOGLE_ANALYTICS_ID`
- Analytics will be automatically tracked

---

## 🐛 **Troubleshooting**

### **Build Fails**
- Check that Wasp CLI is properly installed
- Verify all environment variables are set
- Check build logs in Vercel dashboard

### **Database Connection Issues**
- Verify `DATABASE_URL` format
- Ensure database is accessible from external connections
- Check database credentials

### **Payment Issues**
- Verify Stripe keys are correct (test vs live)
- Check webhook endpoint configuration
- Ensure webhook secret is properly set

### **File Upload Issues**
- Verify AWS S3 credentials
- Check bucket permissions
- Ensure CORS is configured on S3 bucket

---

## 🔄 **Continuous Deployment**

Your Vercel deployment will automatically:
- Build and deploy on every push to `main` branch
- Run build checks on pull requests
- Provide preview URLs for branch deployments

---

## 📞 **Support**

- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **App Issues**: [GitHub Issues](https://github.com/irakli-181/my-saas-project/issues)
- **Wasp Issues**: [Wasp Discord](https://discord.gg/wasp-lang)

---

🎉 **Congratulations! Your SaaS app is now live on Vercel!** 