# 🏢 DayFlow HR Suite - Complete HR Management System

A comprehensive, production-ready HR Management System with modern tech stack and enterprise features.

## 📦 Project Structure

```
dayflow-hr-suite/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   └── data/            # Mock data
│   └── package.json
│
├── backend/                  # Express + MongoDB + TypeScript
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   ├── app.ts           # Express app
│   │   └── server.ts        # Server entry
│   ├── SETUP_GUIDE.md       # Complete setup instructions
│   ├── API_REFERENCE.md     # API documentation
│   ├── PROJECT_SUMMARY.md   # Project overview
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Zod** - Validation
- **Nodemailer** - Emails
- **Cloudinary** - File storage
- **Winston** - Logging

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, HR, Manager, Employee)
- Password reset functionality
- Secure session management

### 👥 Employee Management
- Complete CRUD operations
- Search and filter functionality
- Department management
- Profile picture uploads
- Employee statistics dashboard

### 📅 Leave Management
- Leave application system
- Approval workflow
- Leave balance tracking
- Leave calendar view
- Email notifications

### ⏰ Attendance Tracking
- Check-in/Check-out system
- Manual attendance marking
- Attendance reports
- Overtime tracking
- Location tracking

### 💰 Payroll Management
- Payroll generation
- Salary calculations (allowances, deductions, tax)
- Payslip generation
- Bulk payroll processing
- Payment tracking

### 📊 Performance Management
- Performance reviews
- Goal tracking
- Rating system
- Feedback system

### 📢 Announcements
- Company-wide announcements
- Department-specific announcements
- Priority levels
- Attachment support

### 📋 Task Management
- Task assignment
- Progress tracking
- Priority management
- Comments and attachments

## 🏁 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dayflow-hr-suite
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

Backend will run on: `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 Documentation

- **[Backend Setup Guide](./backend/SETUP_GUIDE.md)** - Complete backend setup instructions
- **[API Reference](./backend/API_REFERENCE.md)** - API endpoints documentation
- **[Project Summary](./backend/PROJECT_SUMMARY.md)** - Detailed project overview

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dayflow-hr
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Configuration
Update API URL in frontend if needed (usually in a config file or environment variables).

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh` - Refresh token
- GET `/api/auth/me` - Get current user

### Employees
- GET `/api/employees` - Get all employees
- GET `/api/employees/:id` - Get employee
- POST `/api/employees` - Create employee
- PUT `/api/employees/:id` - Update employee
- DELETE `/api/employees/:id` - Delete employee

### Leave Management
- GET `/api/leaves` - Get leaves
- POST `/api/leaves` - Apply leave
- PATCH `/api/leaves/:id/approve` - Approve leave
- PATCH `/api/leaves/:id/reject` - Reject leave

### Attendance
- POST `/api/attendance/check-in` - Check in
- POST `/api/attendance/check-out` - Check out
- GET `/api/attendance` - Get attendance

### Payroll
- POST `/api/payroll/generate` - Generate payroll
- GET `/api/payroll` - Get payroll records
- GET `/api/payroll/employee/:id` - Employee payroll

**For complete API documentation, see [API_REFERENCE.md](./backend/API_REFERENCE.md)**

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for refresh tokens
- Rate limiting
- CORS protection
- MongoDB injection protection
- XSS protection
- Helmet security headers
- Input validation with Zod

## 📊 Database Schema

### Collections
- **Users** - Employee accounts and authentication
- **Departments** - Organization departments
- **Leaves** - Leave requests and approvals
- **Attendance** - Daily attendance records
- **Payroll** - Salary and payment records
- **Performance** - Performance reviews
- **Announcements** - Company announcements
- **Tasks** - Task assignments
- **LeaveBalance** - Leave balance tracking

## 🎨 UI Components

### Frontend Features
- Responsive design for all screen sizes
- Modern glassmorphism UI
- Animated counters and transitions
- Interactive charts and graphs
- Toast notifications
- Modal dialogs
- Data tables with pagination
- Form validation
- Loading states
- Error boundaries

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🚀 Deployment

### Backend Deployment
Recommended platforms:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

### Frontend Deployment
Recommended platforms:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Database
- MongoDB Atlas (recommended)
- Self-hosted MongoDB

## 🐛 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check environment variables
- Verify port 5000 is not in use
- Check logs in `/backend/logs`

### Frontend Issues
- Clear browser cache
- Check API URL configuration
- Verify backend is running
- Check browser console for errors

## 📈 Performance Optimization

### Backend
- Database indexes for frequently queried fields
- Response compression
- Query optimization
- Caching strategies (implement as needed)

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Default User Roles

When creating users, use these role values:
- `admin` - Full system access
- `hr` - HR management access
- `manager` - Team management access
- `employee` - Basic employee access

## 🔑 First Steps After Installation

1. Start MongoDB
2. Start backend server
3. Start frontend dev server
4. Register first admin user
5. Create departments
6. Add employees
7. Configure leave balances
8. Start using the system!

## 📞 Support

For issues, questions, or contributions:
- Create an issue in the repository
- Check documentation files
- Review setup guides

---

## 🎉 Features Highlights

✅ Complete authentication system
✅ Role-based access control
✅ Employee management with search/filter
✅ Leave management with approval workflow
✅ Attendance tracking with reports
✅ Payroll generation and tracking
✅ Performance review system
✅ File upload to cloud storage
✅ Email notifications
✅ Real-time validation
✅ Responsive design
✅ Production-ready
✅ Fully documented

---

**Built with ❤️ for modern HR management**

**Version:** 1.0.0
**Last Updated:** January 2026
