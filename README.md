# FMCA (Federal Motor Carrier Administration) System

A comprehensive web application for managing motor carrier filings and administrative tasks.

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

### Backend Setup
```bash
cd automcs150-backend
pip install -r requirements.txt
python init_db.py
python app.py
```

### Frontend Setup
```bash
cd automcs150-frontend
npm install
npm run dev
```

## Features

- **User Management**: Registration, login, profile management
- **Filing System**: Create and manage motor carrier filings
- **Admin Dashboard**: Statistics, user management, notifications
- **Real-time Notifications**: Stay updated with system events
- **Export Functionality**: Generate reports and exports
- **Responsive Design**: Works on desktop and mobile devices

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## License

[Add your license information here]