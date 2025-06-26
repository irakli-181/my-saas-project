# 🚀 Open SaaS Template - Full-Stack SaaS Starter

A complete SaaS application template built with **Wasp Framework**, featuring authentication, payments, AI integration, admin dashboard, and more. This project gives you everything you need to launch your SaaS business quickly.

## 🌟 **Live Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Admin Dashboard**: http://localhost:3000/admin (admin users only)

---

## 📁 **Project Structure**

```
my-saas-app/
├── app/                    # 🎯 Main Wasp application
│   ├── main.wasp          # ⚙️ App configuration & routing
│   ├── schema.prisma      # 🗄️ Database schema
│   ├── src/               # 📂 Source code
│   ├── .env.server        # 🔐 Server environment variables
│   ├── .env.client        # 🔐 Client environment variables
│   └── migrations/        # 📊 Database migrations
├── e2e-tests/             # 🧪 End-to-end tests (Playwright)
├── blog/                  # 📝 Blog/docs (Astro + Starlight)
└── README.md              # 📖 This file
```

---

## 🏗️ **Application Architecture**

### **Core Directories (`app/src/`)**

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| **`auth/`** | 🔐 Authentication system | `LoginPage.tsx`, `SignupPage.tsx`, `userSignupFields.ts` |
| **`admin/`** | 👑 Admin dashboard & management | `dashboards/`, `elements/`, admin components |
| **`payment/`** | 💰 Stripe & LemonSqueezy integration | `operations.ts`, `plans.ts`, `webhook.ts` |
| **`demo-ai-app/`** | 🤖 AI-powered demo features | OpenAI integration, task management |
| **`file-upload/`** | 📁 AWS S3 file management | Upload/download operations |
| **`analytics/`** | 📊 User & business analytics | Stats calculation, dashboards |
| **`client/`** | 🎨 Frontend components & layouts | Navigation, shared components |
| **`server/`** | ⚙️ Backend utilities & scripts | Database seeds, utilities |
| **`landing-page/`** | 🏠 Marketing landing page | Homepage components |
| **`user/`** | 👤 User management | Profile, account settings |
| **`messages/`** | 💬 Contact form system | Message handling |
| **`shared/`** | 🔄 Shared utilities | Common types, constants |

---

## 🚀 **Quick Start Guide**

### **1. Start the Application**
```bash
cd my-saas-app/app
wasp start
```

### **2. Access Your App**
- **Main App**: http://localhost:3000
- **Sign Up**: Use `admin@test.com` for admin access
- **API**: Backend runs on http://localhost:3001

### **3. Create Admin Account**
1. Go to http://localhost:3000/signup
2. Use email: `admin@test.com` 
3. Choose any password
4. ✅ **You're now an admin!**

---

## 🔧 **Key Features & How to Use**

### **🔐 Authentication System**
- **Location**: `src/auth/`
- **Features**: Email/password, social login ready
- **Admin Access**: Set via `ADMIN_EMAILS` in `.env.server`
- **Pages**: Login, Signup, Password Reset, Email Verification

### **👑 Admin Dashboard**  
- **URL**: http://localhost:3000/admin
- **Location**: `src/admin/`
- **Features**:
  - User management (`/admin/users`)
  - Analytics dashboard (`/admin`)
  - Settings & configuration (`/admin/settings`)
  - Charts & metrics (`/admin/chart`)

### **💰 Payment System**
- **Location**: `src/payment/`
- **Processors**: Stripe + Lemon Squeezy
- **Features**: Subscriptions, one-time payments, customer portals
- **Plans**: Configured in `plans.ts`
- **Webhooks**: `/payments-webhook` endpoint

### **🤖 AI Demo App**
- **URL**: http://localhost:3000/demo-app
- **Location**: `src/demo-ai-app/`
- **Features**: OpenAI integration, task scheduling, credit system
- **API**: GPT-powered schedule generation

### **🎮 Timer Game**
- **URL**: http://localhost:3000/timer
- **Location**: `src/client/components/TimerGame.tsx`
- **Features**: Countdown timer, focus sessions, productivity tool
- **Design**: Modern UI with visual feedback and auto-reset

### **📁 File Upload**
- **URL**: http://localhost:3000/file-upload
- **Location**: `src/file-upload/`
- **Backend**: AWS S3 integration
- **Features**: Secure uploads, download URLs, file management

### **📊 Analytics**
- **Location**: `src/analytics/`
- **Features**: Daily stats, user metrics, revenue tracking
- **Jobs**: Automated background calculations
- **Dashboard**: Real-time business insights

---

## ⚙️ **Configuration Files**

### **Environment Variables**

**`.env.server` (Backend)**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/opensaas
ADMIN_EMAILS=admin@test.com                    # Admin user emails
SKIP_EMAIL_VERIFICATION_IN_DEV=true          # Skip email verification
STRIPE_API_KEY=sk_test_...                    # Stripe secret key
OPENAI_API_KEY=sk-...                         # OpenAI API key
AWS_S3_REGION=us-east-1                       # AWS region
# ... other API keys
```

**`.env.client` (Frontend)**
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Stripe public key
# ... other client configs
```

### **Main Configuration (`main.wasp`)**
- App metadata & routing
- Authentication setup
- Database configuration  
- Email sender settings
- API endpoints & operations

### **Database Schema (`schema.prisma`)**
- User management
- Payment subscriptions
- File storage
- Analytics data
- Admin permissions

---

## 🛠️ **Development Workflow**

### **Database Operations**
```bash
wasp db migrate-dev        # Apply migrations
wasp db studio            # View database GUI
wasp db seed              # Seed with fake data
```

### **Environment Management**
```bash
# Edit server config
nano .env.server

# Edit client config  
nano .env.client

# Restart to apply changes
wasp start
```

### **Testing**
```bash
cd e2e-tests
npm install
npm run local:e2e:start   # Run end-to-end tests
```

---

## 📋 **Key API Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/me` | GET | Get current user |
| `/auth/email/signup` | POST | Register new user |
| `/auth/email/login` | POST | User login |
| `/operations/generateGptResponse` | POST | AI schedule generation |
| `/operations/createFile` | POST | File upload |
| `/operations/getPaginatedUsers` | GET | Admin: Get users |
| `/payments-webhook` | POST | Payment webhooks |

---

## 🎯 **Common Tasks**

### **Add New Admin User**
1. Add email to `ADMIN_EMAILS` in `.env.server`
2. Restart server: `wasp start`
3. User signs up → automatically becomes admin

### **Configure Payments**
1. Get Stripe/LemonSqueezy API keys
2. Add to `.env.server` and `.env.client`
3. Configure plans in `src/payment/plans.ts`
4. Set up webhooks in payment processor dashboard

### **Customize Landing Page**
- Edit: `src/landing-page/LandingPage.tsx`
- Styling: Uses Tailwind CSS
- Components: Modular, reusable components

### **Add New Features**
1. Create operations in `src/*/operations.ts`
2. Add routes/pages in `main.wasp`
3. Build UI components in respective directories
4. Update database schema if needed

---

## 🏆 **Production Deployment**

### **Environment Setup**
- Set production database URL
- Configure real email provider (SendGrid/Mailgun)
- Set up proper API keys (Stripe live keys)
- Configure AWS S3 for file storage
- Set up analytics (Plausible/Google Analytics)

### **Database**
```bash
wasp db deploy    # Deploy database changes
```

### **Deployment Options**
- **Railway** (Recommended by Wasp)
- **Fly.io**
- **Heroku**
- **Custom VPS**

---

## 🤝 **Support & Resources**

- **Wasp Docs**: https://wasp.sh/docs
- **Open SaaS Docs**: https://docs.opensaas.sh
- **Wasp Discord**: https://discord.gg/rzdnErX
- **GitHub Issues**: For bug reports and feature requests

---

## 📊 **What You Get Out of the Box**

✅ **Authentication** - Email/password + social login ready  
✅ **Payments** - Stripe & Lemon Squeezy integration  
✅ **Admin Dashboard** - User management & analytics  
✅ **AI Integration** - OpenAI API with credit system  
✅ **File Upload** - AWS S3 secure file handling  
✅ **Database** - PostgreSQL with Prisma ORM  
✅ **Email System** - Transactional emails  
✅ **Analytics** - Business metrics & user tracking  
✅ **Type Safety** - Full TypeScript integration  
✅ **Testing** - Playwright e2e tests included  
✅ **Responsive Design** - Mobile-first UI  

**You're ready to build your SaaS! 🚀**
