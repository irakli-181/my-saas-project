#!/bin/bash
set -e

echo "--- Installing Wasp ---"
curl -sSL https://get.wasp.sh/installer.sh | sh
export PATH="$HOME/.local/bin:$PATH"

echo "--- Navigating to app directory ---"
cd my-saas-app/app

echo "--- Building Wasp Project ---"
wasp build

echo "--- Wasp build finished. Listing contents of .wasp/build for debugging: ---"
ls -R .wasp/build

echo "--- Preparing output for Vercel. ---"
# Create the root-level output directory Vercel expects
mkdir -p ../../build

# Copy the web app (frontend) to the output directory
echo "--- Copying web app to /build ---"
cp -r .wasp/build/web-app/build/* ../../build/

# Vercel needs a public directory for static assets
# We will rename the root /build to /public for Vercel's serverless functions
# Or create a 'public' folder and move the build contents into it.
mv ../../build ../../public

echo "--- Build script completed successfully! ---" 