# 🚀 Open SaaS - Complete SaaS Application Template

[![Deployment Status](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://vercel.com)
[![GitHub](https://img.shields.io/github/license/irakli-181/my-saas-project)](https://github.com/irakli-181/my-saas-project)
[![Wasp](https://img.shields.io/badge/built%20with-wasp-yellow)](https://wasp.sh)

A complete, production-ready SaaS application template built with **Wasp Framework**. Features authentication, admin dashboard, payments, AI integration, file uploads, and more.

## 🌟 Live Demo

- **🌐 Live Application**: [Deploy to Vercel →](https://vercel.com/new/clone?repository-url=https://github.com/irakli-181/my-saas-project)
- **📊 Admin Dashboard**: Access at `/admin` (admin users only)
- **🤖 AI Demo**: OpenAI-powered features at `/demo-app`

## ✨ Features

### 🔐 **Authentication & User Management**
- Email/password authentication
- Email verification & password reset
- User profile management
- Admin user controls

### 👑 **Admin Dashboard**
- User management interface
- Analytics & business metrics
- Revenue tracking
- System administration tools

### 💰 **Payment Integration**
- **Stripe** integration for subscriptions & one-time payments
- **LemonSqueezy** alternative payment processor
- Customer portal for subscription management
- Webhook handling for payment events

### 🤖 **AI-Powered Features**
- OpenAI GPT integration
- AI-powered task scheduling
- Credit-based usage system
- Smart content generation

### 📁 **File Management**
- AWS S3 integration for file uploads
- Secure file handling
- Image optimization
- Download URL generation

### 🎮 **Interactive Features**
- Timer games for productivity
- Typing speed tests
- Keystroke tracking
- Performance analytics

### 📝 **Content Management**
- Blog system powered by Astro
- Starlight documentation framework
- SEO-optimized content
- Markdown support

### 🧪 **Testing & Quality**
- End-to-end tests with Playwright
- Type safety with TypeScript
- Code formatting with Prettier
- Comprehensive test coverage

### 🎨 **Modern UI/UX**
- Tailwind CSS for styling
- Responsive design
- Dark mode support
- Accessible components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Wasp CLI** (`curl -sSL https://get.wasp.sh/installer.sh | sh`)

### 1. Clone & Install

```bash
git clone https://github.com/irakli-181/my-saas-project.git
cd my-saas-project/my-saas-app/app
npm install
```

### 2. Environment Setup

Create environment files from examples:

```bash
cp .env.server.example .env.server
cp .env.client.example .env.client
```

### 3. Configure Environment Variables

**`.env.server`** (Backend Configuration):
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/opensaas"

# Auth
ADMIN_EMAILS="admin@test.com"
SKIP_EMAIL_VERIFICATION_IN_DEV=true

# Payments
STRIPE_API_KEY="sk_test_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# AI
OPENAI_API_KEY="sk-your_openai_key"

# File Upload
AWS_S3_REGION="us-east-1"
AWS_S3_IAM_ACCESS_KEY="your_access_key"
AWS_S3_IAM_SECRET_KEY="your_secret_key"
AWS_S3_FILES_BUCKET="your-bucket-name"
```

**`.env.client`** (Frontend Configuration):
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_public_key"
```

### 4. Start Development Server

```bash
wasp start
```

**Access Your Application:**
- 🌐 **Frontend**: http://localhost:3000
- ⚡ **Backend**: http://localhost:3001
- 👑 **Admin**: http://localhost:3000/admin

### 5. Create Admin Account

1. Visit http://localhost:3000/signup
2. Use email: `admin@test.com`
3. Choose any password
4. ✅ You now have admin access!

## 📦 Project Structure

```
my-saas-project/
├── my-saas-app/           # 🎯 Main Wasp application
│   ├── app/               # 📂 Core application code
│   │   ├── main.wasp      # ⚙️ App configuration
│   │   ├── schema.prisma  # 🗄️ Database schema
│   │   └── src/           # 📁 Source code
│   │       ├── admin/     # 👑 Admin dashboard
│   │       ├── auth/      # 🔐 Authentication
│   │       ├── payment/   # 💰 Payment processing
│   │       ├── demo-ai-app/ # 🤖 AI features
│   │       └── client/    # 🎨 Frontend components
│   ├── blog/              # 📝 Blog system (Astro)
│   └── e2e-tests/         # 🧪 End-to-end tests
└── README.md              # 📖 This file
```

## 🔧 Database Operations

```bash
# Apply database migrations
wasp db migrate-dev

# View database in browser
wasp db studio

# Seed database with sample data
wasp db seed
```

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `https://github.com/irakli-181/my-saas-project`

2. **Configure Build Settings**:
   - **Framework Preset**: `Other`
   - **Root Directory**: `my-saas-app/app`
   - **Build Command**: `wasp build`
   - **Output Directory**: `.wasp/build/web-app/build`

3. **Environment Variables**:
   Add all variables from `.env.server` and `.env.client` in Vercel dashboard

4. **Database Setup**:
   - Use Vercel Postgres or external PostgreSQL
   - Update `DATABASE_URL` environment variable

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Deploy to Render

1. Connect GitHub repository
2. Set build command: `wasp build`
3. Set start command: `wasp start`
4. Configure environment variables

## 🔐 Environment Variables Guide

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ADMIN_EMAILS` | ✅ | Comma-separated admin emails |
| `STRIPE_API_KEY` | 💰 | Stripe secret key |
| `OPENAI_API_KEY` | 🤖 | OpenAI API key for AI features |
| `AWS_S3_*` | 📁 | AWS S3 credentials for file upload |

## 🛠️ Development Workflow

### Key Commands

```bash
# Start development server
wasp start

# Build for production
wasp build

# Run database migrations
wasp db migrate-dev

# Run tests
cd e2e-tests && npm run test

# Format code
npm run format
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/me` | GET | Get current user |
| `/auth/email/signup` | POST | User registration |
| `/auth/email/login` | POST | User login |
| `/operations/generateGptResponse` | POST | AI content generation |
| `/operations/createFile` | POST | File upload |
| `/operations/getPaginatedUsers` | GET | Admin: User list |
| `/payments-webhook` | POST | Payment webhooks |

## 🎯 Key Features Usage

### 🔐 Authentication
- **Signup**: `/signup` - Create new account
- **Login**: `/login` - Sign in to account
- **Admin Access**: Use `admin@test.com` email

### 💰 Payments
- **Pricing**: `/pricing` - View subscription plans
- **Checkout**: `/checkout` - Purchase subscriptions
- **Webhooks**: Automatically handle payment events

### 🤖 AI Features
- **Demo App**: `/demo-app` - AI-powered task scheduling
- **OpenAI Integration**: GPT-based content generation
- **Credit System**: Usage-based AI access

### 📁 File Upload
- **Upload Interface**: `/file-upload` - Secure file uploads
- **S3 Integration**: Automatic cloud storage
- **File Management**: Download and delete files

### 👑 Admin Dashboard
- **Analytics**: `/admin` - Business metrics and KPIs
- **User Management**: `/admin/users` - User administration
- **Settings**: `/admin/settings` - System configuration

## 🧪 Testing

### Run End-to-End Tests

```bash
cd e2e-tests
npm install
npm run test
```

### Test Coverage

- ✅ Authentication flows
- ✅ Payment processing
- ✅ Admin functionality
- ✅ AI features
- ✅ File uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🌐 Live Demo**: [Coming Soon]
- **📚 Documentation**: [Wasp Docs](https://wasp.sh/docs)
- **💬 Community**: [Wasp Discord](https://discord.gg/rzdnErX)
- **🐛 Issues**: [GitHub Issues](https://github.com/irakli-181/my-saas-project/issues)

## 💡 Support

- **📧 Email**: irakli.khizanishvili18@gmail.com
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/irakli-181/my-saas-project/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/irakli-181/my-saas-project/discussions)

---

**Built with ❤️ using [Wasp](https://wasp.sh) - The fastest way to develop full-stack web apps with React & Node.js.** 