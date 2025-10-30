# Classroom Portal - React Frontend

A modern React frontend for the Classroom Assignment Portal with role-based dashboards, real-time data, and responsive design.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, React Router, and React Query
- **Role-Based Dashboards**: Different interfaces for students, teachers, and admins
- **Real-Time Data**: Live updates with React Query
- **Responsive Design**: Works on desktop and mobile with Tailwind CSS
- **Authentication**: JWT-based auth with protected routes
- **Form Handling**: React Hook Form with validation
- **Notifications**: Toast notifications for user feedback
- **API Integration**: Full integration with Express.js backend

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   cd react-frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Make sure backend is running on http://localhost:3001

## 🎯 Quick Start

1. **Start Backend Server** (in separate terminal):
   ```bash
   cd server
   npm start
   ```

2. **Start React Frontend**:
   ```bash
   cd react-frontend
   npm start
   ```

3. **Open Browser**: http://localhost:3000

4. **Login with Test Accounts**:
   - Teacher: `teacher@test.com` / `password123`
   - Student: `student@test.com` / `password123`
   - Admin: `admin@test.com` / `password123`

## 📁 Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/           # Login & Register
│   │   ├── Dashboard/      # Role-based dashboards
│   │   ├── Layout/         # App layout & navigation
│   │   ├── Classes/        # Class management
│   │   ├── Assignments/    # Assignment features
│   │   ├── Admin/          # Admin tools
│   │   ├── System/         # System monitoring
│   │   └── UI/             # Reusable UI components
│   ├── contexts/
│   │   └── AuthContext.js  # Authentication context
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── package.json
└── tailwind.config.js
```

## 🎨 Components Overview

### Authentication
- **Login**: Modern login form with quick test account buttons
- **Register**: User registration with role selection
- **Protected Routes**: JWT-based route protection

### Dashboards
- **Student Dashboard**: Class enrollment, assignments, submissions
- **Teacher Dashboard**: Class management, assignment creation
- **Admin Dashboard**: System overview, user management

### Layout
- **Responsive Sidebar**: Collapsible navigation with role-based menu
- **Header**: User info and logout functionality
- **Mobile Support**: Touch-friendly mobile interface

### Features
- **Real-time Updates**: Live data with React Query
- **Form Validation**: Client-side validation with React Hook Form
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User feedback for actions

## 🔧 Configuration

### Environment Variables
Create `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=Classroom Portal
REACT_APP_VERSION=1.0.0
```

### API Integration
The app connects to your Express.js backend:
- Base URL: `http://localhost:3001/api`
- Authentication: JWT tokens in localStorage
- Auto-retry and error handling included

## 🎯 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🚀 Deployment

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Serve the build folder** with any static server

3. **Update API URL** in production environment

## 🔗 Integration with Backend

This React frontend is designed to work with your existing Express.js backend:

- **Authentication**: Uses your JWT auth system
- **API Calls**: All CRUD operations through your REST API
- **Real-time Data**: Fetches from your MongoDB database
- **Role-based Access**: Respects your user role system

## 🎉 What's Working

- ✅ **Authentication**: Login/register with JWT tokens
- ✅ **Role-based Dashboards**: Student, teacher, admin views
- ✅ **Responsive Design**: Mobile and desktop support
- ✅ **API Integration**: Full backend connectivity
- ✅ **Real-time Updates**: Live data with React Query
- ✅ **Form Handling**: Validation and error states
- ✅ **Navigation**: Protected routes and role-based menus
- ✅ **System Monitoring**: Health checks and database stats

Your modern React frontend is ready to use with your existing backend! 🚀