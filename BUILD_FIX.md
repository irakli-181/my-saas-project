# 🛠️ Vercel Build Issues - Troubleshooting Guide

If your Vercel build is failing after the npm install step, here are common solutions:

## 🔍 **Common Build Issues & Solutions**

### **Issue 1: Wasp CLI Not Found**
If you see `wasp: command not found`:

**Solution:** Updated `vercel.json` with proper PATH export:
```json
"buildCommand": "curl -sSL https://get.wasp.sh/installer.sh | sh && export PATH=$PATH:$HOME/.local/bin && cd my-saas-app/app && wasp build"
```

### **Issue 2: Build Timeout**
If the build times out during `wasp build`:

**Solution:** Try these Vercel project settings:
1. Go to Project Settings → Functions
2. Set Function Region to closest to your location
3. Increase timeout to 30 seconds

### **Issue 3: Missing Environment Variables**
If build fails due to missing env vars:

**Required Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
ADMIN_EMAILS=your@email.com
SKIP_EMAIL_VERIFICATION_IN_DEV=true
```

### **Issue 4: Alternative Deployment Strategy**

If Vercel continues to fail, try this approach:

#### **Option A: Pre-build Locally**
```bash
# On your local machine
cd my-saas-app/app
wasp build
```
Then deploy the built files to Vercel.

#### **Option B: Use Railway (Alternative)**
Railway might handle Wasp builds better:

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add environment variables
4. Deploy automatically

#### **Option C: Manual Vercel Build**
Create a custom build script:

1. **Create `build.sh`:**
```bash
#!/bin/bash
# Install Wasp
curl -sSL https://get.wasp.sh/installer.sh | sh
export PATH=$PATH:$HOME/.local/bin

# Navigate to app directory
cd my-saas-app/app

# Build the app
wasp build

# Copy build outputs
cp -r .wasp/build/web-app/build/* ../../dist/
```

2. **Update `vercel.json`:**
```json
{
  "buildCommand": "chmod +x build.sh && ./build.sh",
  "outputDirectory": "dist"
}
```

## 🔧 **Debug Your Build**

### **Check Build Logs**
Look for these specific error patterns:

1. **`wasp: command not found`** → PATH issue
2. **`Error: Cannot find module`** → Missing dependencies
3. **`Database connection failed`** → Environment variables
4. **`Build timeout`** → Increase function timeout

### **Test Locally First**
Before deploying to Vercel:

```bash
# Test your build locally
cd my-saas-app/app
wasp build

# Check if build directory exists
ls -la .wasp/build/
```

## 🎯 **Quick Fixes to Try**

### **Fix 1: Clear Vercel Cache**
1. Go to Project Settings → Data & Storage
2. Clear Function and Build Cache
3. Redeploy

### **Fix 2: Use Different Build Command**
In Vercel dashboard:
1. Go to Project Settings → Git
2. Override Build Command with:
```bash
curl -sSL https://get.wasp.sh/installer.sh | sh && $HOME/.local/bin/wasp --version && cd my-saas-app/app && $HOME/.local/bin/wasp build
```

### **Fix 3: Split Build Process**
Update `vercel.json`:
```json
{
  "buildCommand": "curl -sSL https://get.wasp.sh/installer.sh | sh",
  "installCommand": "cd my-saas-app/app && npm ci && $HOME/.local/bin/wasp build"
}
```

## 📞 **Need More Help?**

**Share your complete build logs** including:
1. The install output (✅ you already shared this)
2. The build command execution
3. Any error messages
4. The final failure reason

**Common log patterns to look for:**
- `Running "build" command`
- `wasp build` output
- Error stack traces
- Exit codes

---

🎯 **Let's get your deployment working! Share the complete logs and I'll provide a targeted solution.** 