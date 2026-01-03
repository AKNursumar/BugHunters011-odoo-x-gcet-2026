# DayFlow HR Suite - Complete Backend Setup Guide

## 🎯 Project Overview

A complete HR Management System backend built with:
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose ODM**
- **TypeScript** for type safety
- **JWT** authentication with refresh tokens
- **Zod** for validation
- **Cloudinary** for file uploads
- **Nodemailer** for email notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v6 or higher) - Running locally or MongoDB Atlas
- npm or yarn package manager

## 🚀 Quick Start

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Update the `.env` file with your credentials:
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/dayflow-hr

# JWT Secrets (Change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@dayflow-hr.com

# Cloudinary (Sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
```

### 4. Start MongoDB
Ensure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
# Windows: MongoDB should start automatically
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 5. Run Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 6. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   └── env.ts        # Environment variables
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── employeeController.ts
│   │   ├── leaveController.ts
│   │   ├── attendanceController.ts
│   │   └── payrollController.ts
│   ├── models/           # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Department.ts
│   │   ├── Leave.ts
│   │   ├── Attendance.ts
│   │   ├── Payroll.ts
│   │   ├── Performance.ts
│   │   ├── Announcement.ts
│   │   ├── Task.ts
│   │   └── LeaveBalance.ts
│   ├── routes/           # API routes
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── leaveRoutes.ts
│   │   ├── attendanceRoutes.ts
│   │   └── payrollRoutes.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── leaveService.ts
│   │   ├── attendanceService.ts
│   │   └── payrollService.ts
│   ├── middleware/       # Custom middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   ├── validationMiddleware.ts
│   │   ├── uploadMiddleware.ts
│   │   └── rateLimitMiddleware.ts
│   ├── utils/            # Utility functions
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   ├── email.ts
│   │   ├── fileUpload.ts
│   │   └── logger.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── dist/                 # Compiled JavaScript
├── logs/                 # Application logs
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `GET /me` - Get current user

### Employees (`/api/employees`)
- `GET /` - Get all employees (paginated, filterable)
- `GET /stats` - Get employee statistics (Admin/HR)
- `GET /:id` - Get employee by ID
- `POST /` - Create employee (Admin/HR)
- `PUT /:id` - Update employee
- `DELETE /:id` - Delete employee (Admin/HR)
- `POST /:id/upload-avatar` - Upload profile picture

### Leave Management (`/api/leaves`)
- `GET /` - Get all leave requests
- `GET /calendar` - Get leave calendar
- `GET /balance/:employeeId` - Get leave balance
- `GET /:id` - Get leave by ID
- `POST /` - Apply for leave
- `PATCH /:id/approve` - Approve leave (Manager/HR/Admin)
- `PATCH /:id/reject` - Reject leave (Manager/HR/Admin)

### Attendance (`/api/attendance`)
- `POST /check-in` - Clock in
- `POST /check-out` - Clock out
- `GET /` - Get attendance records
- `GET /today` - Get today's attendance (Admin/HR)
- `GET /report` - Get attendance report (Admin/HR)
- `GET /:employeeId` - Get employee attendance
- `POST /mark` - Mark attendance manually (Admin/HR)

### Payroll (`/api/payroll`)
- `GET /` - Get all payroll records (Admin/HR)
- `GET /stats` - Get payroll statistics (Admin/HR)
- `GET /:id` - Get payroll by ID
- `GET /employee/:id` - Get employee payroll history
- `POST /generate` - Generate payroll (Admin/HR)
- `POST /bulk-generate` - Bulk generate payroll (Admin/HR)
- `PUT /:id` - Update payroll (Admin/HR)

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features
- **HR**: Manage employees, leaves, attendance, payroll
- **Manager**: Approve/reject leaves, view team data
- **Employee**: View own data, apply for leaves, mark attendance

### Token System
- **Access Token**: Valid for 15 minutes (configurable)
- **Refresh Token**: Valid for 7 days (configurable)
- Refresh tokens stored in HTTP-only cookies
- Tokens contain user ID, email, role, and employee ID

## 📧 Email Configuration

### Gmail Setup (Recommended for Development)
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### Email Templates Included
- Welcome email for new employees
- Password reset emails
- Leave approval/rejection notifications
- Payroll processing notifications

## ☁️ Cloudinary Setup (File Uploads)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Add to `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## 🗄️ Database Indexes

Optimized indexes are created for:
- User email and employee ID (unique)
- Attendance records (employee + date)
- Leave dates (for calendar queries)
- Payroll records (employee + month + year)

## 🛡️ Security Features

- Helmet.js for security headers
- Rate limiting on all API endpoints
- Strict rate limiting on authentication routes
- MongoDB injection protection
- XSS protection via input sanitization
- CORS configuration
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt (10 salt rounds)

## 📊 Logging

- Winston logger configured
- Logs stored in `/logs` directory
- Separate error and combined logs
- Console logging in development mode

## 🧪 Testing the API

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "employeeId": "EMP001",
    "role": "employee",
    "joiningDate": "2024-01-01"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman or Thunder Client
1. Import the API endpoints
2. Set up environment variables for tokens
3. Test all endpoints systematically

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT secrets to strong random strings
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or production database
- [ ] Configure CORS for production frontend URL
- [ ] Set up proper logging service
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Configure file upload limits
- [ ] Set up database backups
- [ ] Monitor server performance

### Recommended Hosting Platforms
- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Database**: MongoDB Atlas (Free tier available)
- **File Storage**: Cloudinary (Free tier available)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain consistent code style
3. Add proper error handling
4. Write meaningful commit messages
5. Test all endpoints before committing

## 📄 License

MIT License

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check server logs in `/logs` directory

---

**Built with ❤️ for DayFlow HR Suite**
