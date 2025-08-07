Test.
# FMCA (Federal Motor Carrier Administration) System

A comprehensive web application for managing motor carrier filings and administrative tasks.

## 🚀 Quick Deploy

Deploy to Render with one click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Or use our deployment helper:
```bash
./deploy.sh
```

## Project Structure

This project consists of two main components:

### Backend (`automcs150-backend/`)
- **Framework**: Flask with SQLAlchemy
- **Database**: PostgreSQL with Alembic migrations
- **Features**:
  - User authentication and authorization
  - Filing management system
  - Notification system
  - Admin dashboard
  - User management
  - Export functionality

### Frontend (`automcs150-frontend/`)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Features**:
  - Modern, responsive UI
  - Admin dashboard with statistics
  - Filing forms and workflow
  - User profile management
  - Real-time notifications
  - Dark/light theme support

## Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL database

### Local Development Setup

#### Backend Setup
```bash
cd automcs150-backend
pip install -r requirements.txt
python -m flask db upgrade
python load_custom_data.py
python app.py
```

#### Frontend Setup
```bash
cd automcs150-frontend
npm install
npm run dev
```

## 🎯 Demo Data

The system comes with comprehensive mock data including:

### Users
- **Admin**: `admin@fmca.com` / `admin123`
- **Carriers**: 5 sample carrier accounts with different company profiles

### Filing History
- 6 MCS-150 filings with various statuses (Completed, In Progress, Pending Review, Draft)
- Realistic carrier information and filing data

### Notifications
- Various notification types (success, info, warning)
- Different read/unread states

## Features

- **User Management**: Registration, login, profile management
- **Filing System**: Create and manage motor carrier filings
- **Admin Dashboard**: Statistics, user management, notifications
- **Real-time Notifications**: Stay updated with system events
- **Export Functionality**: Generate reports and exports
- **Responsive Design**: Works on desktop and mobile devices
- **Mock Data**: Comprehensive demo data for testing and demonstration

## Deployment

### Render Deployment
See `DEPLOYMENT.md` for detailed deployment instructions to Render.

### Other Platforms
The application can be deployed to other platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS/GCP/Azure

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `FLASK_ENV`: Environment (development/production)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Filings
- `GET /filing/history` - Get filing history
- `POST /filing/submit` - Submit new filing
- `GET /filing/:id` - Get specific filing

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/statistics` - Get system statistics
- `GET /admin/notifications` - Get all notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Support

For deployment issues, see `DEPLOYMENT.md` or check the Render documentation.