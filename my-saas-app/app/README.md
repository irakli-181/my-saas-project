# 🎯 Interactive SaaS Application

This is a customized application built on the Open SaaS starter kit, now featuring interactive mini-games for testing user speed and accuracy. The project combines a full-featured SaaS foundation with engaging performance measurement tools.

## 🏗️ **File Structure Overview**

```
app/
├── main.wasp              # 🎮 Main app configuration & routing
├── schema.prisma          # 🗄️ Database schema & models
├── package.json           # 📦 Frontend dependencies
├── tsconfig.json          # 🔧 TypeScript configuration
├── tailwind.config.cjs    # 🎨 Tailwind CSS configuration
├── vite.config.ts         # ⚡ Vite build configuration
├── .env.server           # 🔐 Server environment variables
├── .env.client           # 🔐 Client environment variables
├── migrations/           # 📊 Database migration files
├── public/              # 🌐 Static assets (images, icons)
└── src/                 # 📂 Main source code
```

## 🎮 **Custom Features**

This application includes two interactive performance testing games:

### **⚡ Click Speed Test Game**
An interactive game to measure user click speed in clicks-per-second, featuring a configurable timer, position-accurate click animations, and persistent database-backed score history. Users can test their reflexes and compete against their previous performances.

📍 **Route**: `/timer-game`  
📖 **Documentation**: [Click Speed Test Technical README](./CLICK_SPEED_TEST_README.md)

### **⌨️ Keystroke Typing Test Game**
A typing test that measures speed (WPM) and accuracy against randomly selected paragraph texts, providing real-time word-by-word validation and visual feedback. The test enforces a maximum 1-minute time limit and tracks comprehensive typing statistics.

📍 **Route**: `/keystroke-timer`  
📖 **Documentation**: [Keystroke Typing Test Technical README](./KEYSTROKE_TYPING_TEST_README.md)

Both games feature:
- Real-time performance calculations
- Persistent score history (10 most recent scores per user)
- Sortable score tables with performance ratings
- Responsive design with dark mode support
- User authentication and data isolation

## 🛠️ **Tech Stack**

- **Framework**: [Wasp](https://wasp-lang.dev/) - Full-stack React & Node.js framework
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Wasp Auth (Email/Password)
- **Styling**: TailwindCSS with dark mode support
- **Build Tool**: Vite
- **Deployment**: Docker-ready

## 📂 **Source Code Structure (`src/`)**

### **🔐 Authentication (`auth/`)**
```
auth/
├── LoginPage.tsx              # Login form component
├── SignupPage.tsx             # Registration form component
├── AuthPageLayout.tsx         # Shared auth page layout
├── userSignupFields.ts        # User signup field configuration
└── email-and-pass/           # Email authentication specific
    ├── EmailVerificationPage.tsx
    ├── PasswordResetPage.tsx
    ├── RequestPasswordResetPage.tsx
    └── emails.ts             # Email templates
```

### **👑 Admin Dashboard (`admin/`)**
```
admin/
├── useRedirectHomeUnlessUserIsAdmin.ts  # Admin access control
├── layout/                   # Admin layout components
├── dashboards/              # Dashboard pages
│   ├── analytics/           # Analytics dashboard
│   └── users/              # User management
└── elements/               # Reusable admin components
    ├── charts/             # Chart components
    ├── forms/              # Form components
    ├── settings/           # Settings pages
    ├── calendar/           # Calendar components
    └── ui-elements/        # UI components
```

### **💰 Payment System (`payment/`)**
```
payment/
├── CheckoutPage.tsx          # Checkout flow UI
├── PricingPage.tsx          # Pricing plans display
├── operations.ts            # Payment operations
├── plans.ts                 # Subscription plans config
├── paymentProcessor.ts      # Payment processor abstraction
├── webhook.ts              # Webhook handler
├── stripe/                 # Stripe integration
│   ├── checkoutUtils.ts
│   ├── paymentDetails.ts
│   ├── paymentProcessor.ts
│   ├── stripeClient.ts
│   └── webhook.ts
└── lemonSqueezy/          # Lemon Squeezy integration
    ├── checkoutUtils.ts
    ├── paymentDetails.ts
    ├── paymentProcessor.ts
    └── webhook.ts
```

### **🤖 AI Demo App (`demo-ai-app/`)**
```
demo-ai-app/
├── DemoAppPage.tsx          # Main AI demo interface
├── operations.ts           # AI operations & API calls
├── schedule.ts             # Schedule generation logic
└── components/             # AI app specific components
```

### **📁 File Upload (`file-upload/`)**
```
file-upload/
├── FileUploadPage.tsx       # File upload interface
├── operations.ts           # File operations
├── s3Utils.ts              # AWS S3 utilities
└── validation.ts           # File validation rules
```

### **📊 Analytics (`analytics/`)**
```
analytics/
├── operations.ts           # Analytics operations
├── stats.ts               # Statistics calculations
└── providers/             # Analytics providers
    ├── googleAnalyticsUtils.ts
    └── plausibleAnalyticsUtils.ts
```

### **🎨 Client (`client/`)**
```
client/
├── App.tsx                 # Root application component
├── components/            # Shared UI components
│   ├── NavBar/           # Navigation components
│   ├── TimerGame.tsx     # Click speed test game
│   ├── TimerGamePage.tsx # Click speed test page wrapper
│   ├── KeystrokeTimer.tsx # Typing test game
│   ├── KeystrokeTimerPage.tsx # Typing test page wrapper
│   ├── cookie-consent/   # Cookie consent system
│   └── NotFoundPage.tsx  # 404 page
└── hooks/                # Custom React hooks
```

### **🏠 Landing Page (`landing-page/`)**
```
landing-page/
├── LandingPage.tsx         # Main landing page
└── components/            # Landing page components
    ├── Hero.tsx
    ├── Features.tsx
    ├── Testimonials.tsx
    └── FAQ.tsx
```

### **👤 User Management (`user/`)**
```
user/
├── AccountPage.tsx         # User account settings
└── operations.ts          # User-related operations
```

### **⚙️ Server (`server/`)**
```
server/
├── scripts/               # Server-side scripts
│   └── dbSeeds.ts        # Database seeding
├── utils.ts              # Server utilities
└── validation.ts         # Server-side validation
```

### **💬 Messages (`messages/`)**
```
messages/
├── MessagesPage.tsx        # Contact messages interface
└── operations.ts          # Message operations
```

### **🎮 Game Operations**
```
timer-game/
└── operations.ts          # Click speed test operations

typing-timer/
└── operations.ts          # Typing test operations
```

### **🔄 Shared (`shared/`)**
```
shared/
├── common.ts              # Common constants & utilities
├── types.ts              # Shared TypeScript types
└── utils.ts              # Utility functions
```

---

## 🚀 **Key Configuration Files**

### **`main.wasp`** - App Configuration
- **Routes & Pages**: All app routing configuration
- **Authentication**: Auth providers & settings
- **Database**: Database connection & seeding
- **Operations**: API endpoints (queries & actions)
- **Jobs**: Background job scheduling
- **Email**: Email provider configuration

### **`schema.prisma`** - Database Schema
- **User Model**: User accounts & admin permissions
- **Payment Models**: Subscriptions, plans, transactions
- **AI Models**: GPT responses, tasks
- **File Models**: File uploads & metadata
- **Analytics Models**: Stats, logs, page views
- **Game Models**: SpeedScore (click test), TypingScore (typing test)

### **Environment Variables**

**`.env.server`** (Backend Configuration)
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
ADMIN_EMAILS=admin@test.com
SKIP_EMAIL_VERIFICATION_IN_DEV=true

# Payments
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
LEMONSQUEEZY_API_KEY=...

# AI
OPENAI_API_KEY=sk-...

# File Upload
AWS_S3_REGION=us-east-1
AWS_S3_FILES_BUCKET=my-bucket
AWS_S3_IAM_ACCESS_KEY=...
AWS_S3_IAM_SECRET_KEY=...

# Analytics
PLAUSIBLE_API_KEY=...
PLAUSIBLE_SITE_ID=...
```

**`.env.client`** (Frontend Configuration)
```bash
# Payments
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-...
```

---

## 🛠️ **Development Commands**

```bash
# Start development server
wasp start

# Database operations
wasp db migrate-dev        # Create & apply migrations
wasp db studio            # Open database GUI
wasp db seed              # Seed with test data
wasp db reset             # Reset database

# Build & deployment
wasp build               # Build for production
wasp deploy              # Deploy to production
```

### **🎮 Accessing Custom Games**
Once the development server is running (`wasp start`):
- **Click Speed Test**: `http://localhost:3000/timer-game`
- **Keystroke Typing Test**: `http://localhost:3000/keystroke-timer`

Both games require user authentication. Use the admin account (`admin@test.com`) or create a new user account.

---

## 🎯 **Adding New Features**

### **1. Add New Page**
1. Create component in appropriate `src/` directory
2. Add route in `main.wasp`
3. Add page configuration in `main.wasp`

### **2. Add New API Operation**
1. Create operation function in `operations.ts`
2. Add operation declaration in `main.wasp`
3. Use in frontend components

### **3. Add Database Model**
1. Update `schema.prisma`
2. Run `wasp db migrate-dev`
3. Update TypeScript types if needed

### **4. Add New Admin Feature**
1. Create component in `src/admin/`
2. Add route for admin page
3. Add admin access control

---

## 📚 **Important Files to Know**

| File | Purpose | When to Edit |
|------|---------|-------------|
| `main.wasp` | App configuration & routing | Adding pages, API endpoints, auth |
| `schema.prisma` | Database schema | Adding new data models |
| `src/auth/userSignupFields.ts` | User signup logic | Changing user registration |
| `src/payment/plans.ts` | Subscription plans | Updating pricing |
| `.env.server` | Server configuration | Adding API keys, environment config |
| `src/client/App.tsx` | Root component | App-wide layout changes |

---

**Ready to start coding! 🚀**

