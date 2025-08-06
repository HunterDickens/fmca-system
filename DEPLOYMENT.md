# FMCA System Deployment Guide

This guide will help you deploy the FMCA (Federal Motor Carrier Administration) system to Render.

## Prerequisites

1. A Render account (free tier available)
2. Git repository with your code
3. Basic understanding of web applications

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository contains:
- `render.yaml` - Render configuration file
- `automcs150-backend/` - Python Flask backend
- `automcs150-frontend/` - Next.js frontend
- All necessary configuration files

### 2. Connect to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Blueprint"
3. Connect your GitHub/GitLab repository
4. Render will automatically detect the `render.yaml` file

### 3. Configure Environment Variables

The following environment variables will be automatically set by Render:

**Backend Service:**
- `DATABASE_URL` - Automatically set from the database service
- `JWT_SECRET_KEY` - Automatically generated
- `FLASK_ENV` - Set to "production"
- `FLASK_APP` - Set to "app.py"

**Frontend Service:**
- `NEXT_PUBLIC_API_URL` - Set to the backend service URL
- `PORT` - Set to 3000

### 4. Deploy

1. Click "Apply" to start the deployment
2. Render will:
   - Create a PostgreSQL database
   - Deploy the backend service
   - Deploy the frontend service
   - Run database migrations
   - Load mock data

### 5. Access Your Application

Once deployment is complete, you'll have:
- **Frontend**: `https://fmca-frontend.onrender.com`
- **Backend API**: `https://fmca-backend.onrender.com`
- **Database**: Managed PostgreSQL instance

## Default Login Credentials

### Admin User
- **Email**: `admin@fmca.com`
- **Password**: `admin123`

### Sample Carrier Users
- **Email**: `john.doe@truckingco.com`
- **Password**: `password123`

- **Email**: `sarah.smith@freightlogistics.com`
- **Password**: `password123`

- **Email**: `mike.johnson@expresshauling.com`
- **Password**: `password123`

- **Email**: `lisa.wilson@cargotransport.com`
- **Password**: `password123`

- **Email**: `david.brown@interstatetrucking.com`
- **Password**: `password123`

## Mock Data Included

The deployment includes comprehensive mock data:

### Users
- 1 Admin user
- 5 Carrier users with different company profiles

### Filing History
- 6 MCS-150 filings with various statuses:
  - Completed filings
  - In Progress filings
  - Pending Review filings
  - Draft filings

### Notifications
- Various notification types (success, info, warning)
- Different read/unread states

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in requirements.txt
   - Verify Python/Node.js versions

2. **Database Connection Issues**
   - Verify DATABASE_URL is correctly set
   - Check if database service is running
   - Ensure migrations completed successfully

3. **Frontend Not Loading**
   - Check if backend API is accessible
   - Verify NEXT_PUBLIC_API_URL is correct
   - Check browser console for errors

### Logs and Monitoring

- View logs in the Render dashboard for each service
- Monitor database performance
- Check application health endpoints

## Customization

### Adding More Mock Data

1. Edit `automcs150-backend/mock_data.json`
2. Add new users, filings, or notifications
3. Redeploy the backend service

### Environment Variables

You can add custom environment variables in the Render dashboard:
1. Go to your service settings
2. Navigate to "Environment"
3. Add key-value pairs

### Database Management

- Access database through Render dashboard
- Use pgAdmin or similar tool for database management
- Backup data regularly

## Cost Considerations

- **Free Tier**: Limited to 750 hours/month per service
- **Paid Plans**: Start at $7/month per service
- **Database**: Free tier includes 1GB storage

## Security Notes

- Change default passwords after deployment
- Use strong JWT secrets in production
- Enable HTTPS (automatic on Render)
- Regular security updates

## Support

For deployment issues:
1. Check Render documentation
2. Review application logs
3. Contact Render support if needed

## Next Steps

After successful deployment:
1. Test all functionality
2. Update DNS if using custom domain
3. Set up monitoring and alerts
4. Configure backups
5. Plan for scaling 