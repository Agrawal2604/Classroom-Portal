# 🎓 Classroom Assignment Portal

A comprehensive full-stack web application for managing classroom assignments, built with React frontend and MERN stack backend. Features include user authentication, assignment management, submission system, grading with history tracking, and bulk operations.

## 🌟 Features

### For Students
- ✅ User registration and authentication
- 📚 View all available assignments
- 📝 Submit assignments with text content
- 📊 View submission status and grades
- 💬 Receive detailed teacher feedback
- 📈 Track grade history

### For Teachers
- 👨‍🏫 Teacher dashboard with analytics
- ➕ Create and manage assignments
- 👀 View all student submissions
- ✏️ Grade submissions with detailed feedback
- 📊 Bulk grading operations
- 📋 Grade history tracking
- 🗑️ Data management tools

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router DOM for navigation
- Axios for API communication
- CSS3 with responsive design

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

**Database:**
- MongoDB Atlas (Cloud)
- Comprehensive data models
- Grade history tracking
- Bulk operations support

## Features

### For Students
- Register and login with student credentials
- View all available assignments
- Submit assignments with text content
- View submission status and grades
- Receive teacher feedback

### For Teachers
- Register and login with teacher credentials
- Create and manage assignments
- View all student submissions
- Grade submissions and provide feedback
- Dashboard with recent activity

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios for API calls
- CSS3 for styling

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
classroom-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
└── package.json           # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd classroom-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/classroom-portal
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

5. **Run the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```
   
   **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (teachers only)
- `PUT /api/assignments/:id` - Update assignment (teachers only)
- `DELETE /api/assignments/:id` - Delete assignment (teachers only)

### Submissions
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Submit assignment (students only)
- `PUT /api/submissions/:id/grade` - Grade submission (teachers only)

## Usage

### Getting Started

1. **Register an account**
   - Choose "Student" or "Teacher" role
   - Students need to provide a Student ID

2. **For Teachers:**
   - Create assignments with title, description, due date, and points
   - View and grade student submissions
   - Provide feedback to students

3. **For Students:**
   - Browse available assignments
   - Submit assignments before due date
   - View grades and teacher feedback

### User Roles

**Student Features:**
- View assignments
- Submit text-based assignments
- Track submission status
- View grades and feedback

**Teacher Features:**
- Create and manage assignments
- View all student submissions
- Grade submissions with numerical scores
- Provide written feedback

## Database Schema

### User Model
- name, email, password
- role (student/teacher)
- studentId (for students)

### Assignment Model
- title, description, dueDate
- maxPoints, subject
- teacher reference
- timestamps

### Submission Model
- assignment and student references
- content, grade, feedback
- status (submitted/graded/late)
- timestamps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
## 🚀 Q
uick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/classroom-assignment-portal.git
   cd classroom-assignment-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run install-all
   ```

3. **Set up environment variables:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your MongoDB Atlas connection string
   ```

4. **Seed the database:**
   ```bash
   cd server
   node seedDatabase.js
   node addMoreSubmissions.js
   node addMoreAssignments.js
   ```

5. **Start the application:**
   ```bash
   npm run dev
   # Or run separately:
   # npm run server (Backend on port 5003)
   # npm run client (Frontend on port 3000)
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5003

## 🔑 Demo Credentials

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `password123`

**Student Account:**
- Email: `student@test.com`
- Password: `password123`

## 📁 Project Structure

```
classroom-assignment-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── .env.example       # Environment template
│   └── server.js          # Main server file
├── .gitignore
├── README.md
└── package.json           # Root package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for educational purposes.