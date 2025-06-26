#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Installing Wasp ---"
curl -sSL https://get.wasp.sh/installer.sh | sh
# Add Wasp to the PATH for this script's execution
export PATH="$HOME/.local/bin:$PATH"

echo "--- Navigating to app directory ---"
cd my-saas-app/app

echo "--- Building Wasp Project ---"
# This is the main compilation step
wasp build

echo "--- Wasp build finished. Preparing output for Vercel. ---"

# The root directory for Vercel's output MUST be 'public' for serverless functions to work correctly.
# Wasp places the frontend build in '.wasp/build/web-app/dist'
BUILD_OUTPUT_DIR=".wasp/build/web-app/dist"

# Debug: list the contents of .wasp/build to see what's actually there.
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
  echo "--- ERROR: Build output directory not found at $BUILD_OUTPUT_DIR! ---"
  # List the contents of the build directory to help debug
  echo "--- Listing contents of .wasp/build: ---"
  ls -R .wasp/build
  exit 1
fi

echo "--- Found build output at $BUILD_OUTPUT_DIR. Copying to /public directory. ---"

# Create the final 'public' directory at the root of the monorepo
mkdir -p ../../public

# Copy all contents from the Wasp build output to the new 'public' directory
cp -r $BUILD_OUTPUT_DIR/. ../../public/

echo "--- Files successfully copied to /public. ---"

echo "--- Build script completed successfully! ---" 