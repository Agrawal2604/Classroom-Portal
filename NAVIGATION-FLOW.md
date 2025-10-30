# 🚀 Classroom Portal - Navigation Flow Guide

## Complete Navigation Sequence

### 1. **Start Here: Login Page**
**URL**: http://localhost:8080/login.html

**Features**:
- ✅ Login form with email/password
- ✅ Registration form (toggle between login/register)
- ✅ Quick test buttons for instant login
- ✅ Automatic redirect after successful authentication

**Test Accounts**:
- **Teacher**: `teacher@test.com` / `password123`
- **Student**: `student@test.com` / `password123`

**Flow**: Login → Redirects to Main Dashboard (index.html)

---

### 2. **Main Dashboard**
**URL**: http://localhost:8080/index.html

**Features**:
- ✅ Role-based dashboard (Student/Teacher/Admin views)
- ✅ Real API integration with your backend
- ✅ Class management, assignment creation
- ✅ User info display in header
- ✅ Navigation to alternative dashboard

**Navigation Options**:
- **Dashboard Button**: Refresh current view
- **Alternative View Button**: Go to dashboard.html
- **Logout Button**: Return to login.html

**Flow**: Main Dashboard ↔ Alternative Dashboard

---

### 3. **Alternative Dashboard**
**URL**: http://localhost:8080/dashboard.html

**Features**:
- ✅ Sidebar navigation with different sections
- ✅ Alternative UI layout
- ✅ Same backend connectivity
- ✅ Role-specific menu items

**Navigation Options**:
- **Main Dashboard Button**: Return to index.html
- **Login Button**: Go to login.html
- **Sidebar Navigation**: Switch between views

**Flow**: Alternative Dashboard ↔ Main Dashboard

---

## 🔄 Complete Navigation Flow

```
login.html (Authentication)
    ↓ (Successful Login)
index.html (Main Dashboard)
    ↕ (Switch Views)
dashboard.html (Alternative Dashboard)
    ↓ (Logout)
login.html (Back to Start)
```

## 🎯 How to Test the Flow

### **Step 1: Start the Servers**
```bash
# Terminal 1 - Backend Server
cd server
npm start
# Server runs on http://localhost:3001

# Terminal 2 - Frontend Server  
cd client
python -m http.server 8080
# Client runs on http://localhost:8080
```

### **Step 2: Test the Complete Flow**

1. **Open**: http://localhost:8080/login.html
2. **Quick Login**: Click "Login as Teacher" or "Login as Student"
3. **Main Dashboard**: Automatically redirected to index.html
   - View classes, create assignments, manage data
   - Click "Alternative View" button
4. **Alternative Dashboard**: Now on dashboard.html
   - Use sidebar navigation
   - Click "Switch to Main Dashboard" to go back
5. **Logout**: Click logout from any dashboard
   - Returns to login.html

### **Step 3: Test All Features**

**As Teacher**:
- Create classes
- Create assignments
- View class management tools

**As Student**:
- Join classes with code `CS101`
- View assignments
- Submit work (coming soon)

## 🔧 Button Functions

### **Login Page Buttons**:
- `Login` → Authenticate and redirect to index.html
- `Register` → Create account and redirect to index.html  
- `Login as Teacher/Student` → Quick test login

### **Main Dashboard Buttons**:
- `Dashboard` → Refresh current view
- `Alternative View` → Go to dashboard.html
- `Logout` → Return to login.html
- `Create Class/Assignment` → Modal forms
- `Join Class` → Join with class code

### **Alternative Dashboard Buttons**:
- `Main Dashboard` → Return to index.html
- `Login` → Go to login.html
- `Switch to Main Dashboard` → Return to index.html
- `Logout` → Return to login.html

## 🎉 What's Working

✅ **Seamless Navigation**: One-click switching between all three pages
✅ **Authentication Flow**: Login → Dashboard → Logout → Login
✅ **Real API Integration**: All data stored in MongoDB
✅ **Role-Based Views**: Different interfaces for students/teachers
✅ **Persistent Sessions**: Stay logged in across page switches
✅ **Quick Testing**: Instant login buttons for development

Your classroom portal now has a complete, connected navigation flow with three distinct interfaces all working together!