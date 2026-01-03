# DayFlow HR Suite - Backend API

Complete HR management system backend built with Express, MongoDB, and TypeScript.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 Employee Management
- 📅 Leave Management System
- ⏰ Attendance Tracking
- 💰 Payroll Management
- 📊 Performance Reviews
- 📢 Announcements
- 🔒 Role-based Access Control
- 📈 Analytics & Reports

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- TypeScript
- JWT Authentication
- Zod Validation
- Cloudinary (File uploads)
- Nodemailer (Emails)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

See `.env.example` for required environment variables.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Employee Endpoints
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Leave Endpoints
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Apply for leave
- `PATCH /api/leaves/:id/approve` - Approve leave
- `PATCH /api/leaves/:id/reject` - Reject leave

### Attendance Endpoints
- `POST /api/attendance/check-in` - Clock in
- `POST /api/attendance/check-out` - Clock out
- `GET /api/attendance` - Get attendance records

### More endpoints available in the API routes.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## License

MIT
