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
# Wasp places the frontend build in '.wasp/build/web-app/build/'
OUTPUT_DIR_PATH=".wasp/build/web-app/build"

# Check if the build output directory exists
if [ -d "$OUTPUT_DIR_PATH" ]; then
  echo "--- Found build output at $OUTPUT_DIR_PATH. Copying to /public directory. ---"
  
  # Create the final 'public' directory at the root of the monorepo
  mkdir -p ../../public
  
  # Copy all contents from the Wasp build output to the new 'public' directory
  cp -r $OUTPUT_DIR_PATH/. ../../public/
  
  echo "--- Files successfully copied to /public. ---"
else
  echo "--- ERROR: Build output directory not found at $OUTPUT_DIR_PATH! ---"
  # List the contents of the build directory to help debug
  echo "--- Listing contents of .wasp/build: ---"
  ls -R .wasp/build
  exit 1
fi

echo "--- Build script completed successfully! ---" 