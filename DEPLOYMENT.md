# FMCA Application Deployment Guide

This guide will help you deploy the FMCA application to Render using your `fmca-2` repository.

## Prerequisites

1. A GitHub account with your `fmca-2` repository
2. A Render account (free tier available)
3. Your database file with demo data

## Deployment Steps

### 1. Prepare Your Repository

Make sure your `fmca-2` repository contains all the files from this project, including:
- `render.yaml` (deployment configuration)
- `automcs150-backend/` (Flask backend)
- `automcs150-frontend/` (Next.js frontend)
- All configuration files

### 2. Deploy to Render

1. **Sign up/Login to Render**: Go to [render.com](https://render.com) and create an account or login

2. **Connect Your Repository**:
   - Click "New +" and select "Blueprint"
   - Connect your GitHub account
   - Select your `fmca-2` repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Deployment**:
   - Render will create 3 services:
     - `fmca-backend` (Python Flask API)
     - `fmca-frontend` (Next.js frontend)
     - `fmca-database` (PostgreSQL database)
   - Click "Apply" to start the deployment

4. **Wait for Deployment**:
   - Backend deployment: ~5-10 minutes
   - Frontend deployment: ~3-5 minutes
   - Database creation: ~2-3 minutes

### 3. Load Demo Data

After deployment, you can load demo data using the initialization script:

1. **Access the Backend Console**:
   - Go to your `fmca-backend` service in Render
   - Click on "Shell" tab
   - Run the following commands:

```bash
cd automcs150-backend
python init_db.py
```

This will create:
- Admin user: `admin@fmca.com` / `admin123`
- Demo carrier: `demo@carrier.com` / `demo123`
- Sample filing history and notifications

### 4. Access Your Application

Once deployment is complete, you'll have:
- **Frontend**: `https://fmca-frontend.onrender.com`
- **Backend API**: `https://fmca-backend.onrender.com`
- **Database**: Managed by Render

## Environment Variables

The following environment variables are automatically configured:

### Backend (`fmca-backend`)
- `DATABASE_URL`: Automatically set by Render
- `JWT_SECRET_KEY`: Automatically generated
- `FLASK_ENV`: Set to "production"

### Frontend (`fmca-frontend`)
- `NEXT_PUBLIC_API_URL`: Points to your backend URL

## Custom Database Data

If you have a specific database file with demo data:

1. **Export your data** as SQL or CSV format
2. **Access the database** through Render's database dashboard
3. **Import your data** using the database console or connection tools

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `requirements.txt` and `package.json`

2. **Database Connection Issues**:
   - Verify the `DATABASE_URL` is correctly formatted
   - Check if the database service is running

3. **Frontend API Calls**:
   - Ensure `NEXT_PUBLIC_API_URL` is set correctly
   - Check CORS settings in the backend

### Logs and Monitoring

- **Backend logs**: Available in the `fmca-backend` service dashboard
- **Frontend logs**: Available in the `fmca-frontend` service dashboard
- **Database logs**: Available in the `fmca-database` service dashboard

## Cost Information

- **Free Tier**: Includes 750 hours/month for web services
- **Database**: Free tier includes 1GB storage
- **Bandwidth**: Free tier includes 100GB/month

## Support

If you encounter issues:
1. Check the Render documentation
2. Review the service logs
3. Contact Render support if needed

## Demo Credentials

After running the initialization script, you can login with:

- **Admin Account**:
  - Email: `admin@fmca.com`
  - Password: `admin123`

- **Demo Carrier Account**:
  - Email: `demo@carrier.com`
  - Password: `demo123` 