#!/bin/bash

# FMCA System Deployment Script
# This script helps with deploying the FMCA system to Render

echo "🚀 FMCA System Deployment Helper"
echo "================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if we have the necessary files
echo "📋 Checking required files..."

if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    exit 1
fi

if [ ! -d "automcs150-backend" ]; then
    echo "❌ automcs150-backend directory not found!"
    exit 1
fi

if [ ! -d "automcs150-frontend" ]; then
    echo "❌ automcs150-frontend directory not found!"
    exit 1
fi

echo "✅ All required files found!"

# Check git status
echo ""
echo "📊 Git Status:"
git status --porcelain

echo ""
echo "🔗 Deployment Steps:"
echo "1. Push your code to GitHub/GitLab:"
echo "   git add ."
echo "   git commit -m 'Deploy to Render'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and:"
echo "   - Sign up/Login"
echo "   - Click 'New +' → 'Blueprint'"
echo "   - Connect your repository"
echo "   - Click 'Apply' to deploy"
echo ""
echo "3. Wait for deployment (5-15 minutes)"
echo ""
echo "4. Access your application:"
echo "   - Frontend: https://fmca-frontend.onrender.com"
echo "   - Backend: https://fmca-backend.onrender.com"
echo ""
echo "5. Login with default credentials:"
echo "   - Admin: admin@fmca.com / admin123"
echo "   - Carrier: john.doe@truckingco.com / password123"
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Consider committing them before deployment:"
    echo "   git add ."
    echo "   git commit -m 'Update before deployment'"
    echo "   git push origin main"
    echo ""
fi

echo "📚 For more information, see DEPLOYMENT.md"
echo "🎉 Happy deploying!" 