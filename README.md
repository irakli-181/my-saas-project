# 🚀 Complete SaaS Application - Wasp Framework

A production-ready SaaS application template built with **Wasp Framework**, featuring authentication, payments, AI integration, admin dashboard, and more. Perfect for launching your next SaaS business.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irakli-181/my-saas-project)

## 🌟 **Live Demo**
- **🌐 Frontend**: Modern React application with Tailwind CSS
- **⚡ Backend API**: Node.js with Prisma ORM
- **👑 Admin Dashboard**: Complete management interface
- **🔐 Authentication**: Email/password with admin roles

---

## 📊 **Project Statistics**
- **233 Files** | **36,420+ Lines of Code** | **4.04 MB**
- **Built with Wasp v0.16.6** | **TypeScript Ready** | **Production Optimized**

---

## 🚀 **Quick Deploy to Vercel**

### **1-Click Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irakli-181/my-saas-project)

### **Manual Deployment**
1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Configure environment variables (see below)
3. **Deploy**: Vercel will automatically build and deploy

---

## ⚙️ **Environment Variables for Production**

### **Required Environment Variables**

Add these to your Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# Authentication
ADMIN_EMAILS=your-admin@email.com
SKIP_EMAIL_VERIFICATION_IN_DEV=false

# Stripe (Payment Processing)
STRIPE_API_KEY=sk_live_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...

# OpenAI (AI Features)
OPENAI_API_KEY=sk-...

# AWS S3 (File Upload)
AWS_S3_REGION=us-east-1
AWS_S3_IAM_ACCESS_KEY=your-access-key
AWS_S3_IAM_SECRET_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name

# Email (Optional)
SENDGRID_API_KEY=your-sendgrid-key

# Google Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=GA4-...
```

---

## 🏗️ **Application Architecture**

```
📦 SaaS Application
├── 🎯 my-saas-app/app/          # Main Wasp application
│   ├── ⚙️ main.wasp            # App configuration
│   ├── 🗄️ schema.prisma        # Database schema
│   ├── 📂 src/                  # Source code
│   │   ├── 🔐 auth/            # Authentication system
│   │   ├── 👑 admin/           # Admin dashboard
│   │   ├── 💰 payment/         # Stripe & LemonSqueezy
│   │   ├── 🤖 demo-ai-app/     # AI features
│   │   ├── 📁 file-upload/     # AWS S3 integration
│   │   ├── 📊 analytics/       # User analytics
│   │   ├── 🎨 client/          # Frontend components
│   │   ├── ⚙️ server/          # Backend utilities
│   │   └── 🏠 landing-page/    # Marketing pages
│   └── 📊 migrations/          # Database migrations
├── 🧪 e2e-tests/               # Playwright tests
├── 📝 blog/                    # Astro blog system
└── 📖 README.md                # This file
```

---

## 🔧 **Core Features**

### **🔐 Authentication & User Management**
- Email/password authentication
- Admin role management
- Password reset functionality
- Email verification system

### **👑 Admin Dashboard**
- User management interface
- Analytics and metrics
- Revenue tracking
- System configuration

### **💰 Payment Integration**
- **Stripe**: Credit cards, subscriptions
- **LemonSqueezy**: Alternative payment processor
- Webhook handling for payment events
- Customer portal integration

### **🤖 AI-Powered Features**
- OpenAI GPT integration
- AI-powered schedule generation
- Credit-based usage system
- Task automation

### **📁 File Management**
- AWS S3 integration
- Secure file uploads
- Download URL generation
- File validation and processing

### **📊 Analytics & Insights**
- User activity tracking
- Revenue analytics
- Performance metrics
- Real-time dashboards

### **🎮 Interactive Features**
- Timer games for productivity
- Typing speed tests
- Keystroke analytics
- Performance tracking

---

## 🚀 **Local Development**

### **Prerequisites**
- Node.js 18+
- PostgreSQL database
- Wasp CLI (`curl -sSL https://get.wasp.sh/installer.sh | sh`)

### **Setup**
```bash
# Clone the repository
git clone https://github.com/irakli-181/my-saas-project.git
cd my-saas-project

# Navigate to app directory
cd my-saas-app/app

# Start development server
wasp start
```

### **Access Points**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3000/admin

### **Admin Account Setup**
1. Go to http://localhost:3000/signup
2. Use email: `admin@test.com`
3. Use any password
4. You'll have admin privileges automatically

---

## 📋 **API Documentation**

### **Authentication Endpoints**
- `GET /auth/me` - Get current user
- `POST /auth/email/signup` - Register new user
- `POST /auth/email/login` - User login
- `POST /auth/email/request-password-reset` - Password reset

### **Admin Endpoints**
- `GET /operations/getPaginatedUsers` - Get users (admin only)
- `POST /operations/updateUser` - Update user (admin only)
- `GET /operations/getDashboardStats` - Dashboard analytics

### **AI Features**
- `POST /operations/generateGptResponse` - AI schedule generation
- `GET /operations/getGptResponses` - Get AI responses

### **File Upload**
- `POST /operations/createFile` - Upload file to S3
- `GET /operations/getAllFilesByUser` - Get user files

### **Payment Processing**
- `POST /payments-webhook` - Payment webhooks
- `POST /operations/createCheckoutSession` - Create payment session

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation

### **Backend**
- **Node.js** with Express
- **Prisma ORM** for database
- **PostgreSQL** database
- **JWT** authentication

### **Framework**
- **Wasp v0.16.6** - Full-stack framework
- **TypeScript** throughout
- **ESLint** + **Prettier** for code quality

### **Integrations**
- **Stripe** & **LemonSqueezy** - Payments
- **OpenAI GPT** - AI features
- **AWS S3** - File storage
- **SendGrid** - Email delivery
- **Google Analytics** - Analytics

### **Testing**
- **Playwright** - E2E testing
- **Jest** - Unit testing
- **TypeScript** - Type safety

---

## 🚀 **Deployment Options**

### **Vercel (Recommended)**
- ✅ **1-click deployment**
- ✅ **Automatic builds**
- ✅ **Environment variables**
- ✅ **Custom domains**

### **Railway**
- ✅ **Database included**
- ✅ **Auto scaling**
- ✅ **Git integration**

### **Render**
- ✅ **Free tier available**
- ✅ **Managed database**
- ✅ **Auto deploys**

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 **Support**

- **GitHub Issues**: [Report bugs or request features](https://github.com/irakli-181/my-saas-project/issues)
- **Documentation**: Check the `/my-saas-app/README.md` for detailed setup
- **Wasp Docs**: [Official Wasp documentation](https://wasp-lang.dev/docs)

---

## 🌟 **Show Your Support**

Give a ⭐️ if this project helped you build your SaaS application!

---

**Built with ❤️ using Wasp Framework** 